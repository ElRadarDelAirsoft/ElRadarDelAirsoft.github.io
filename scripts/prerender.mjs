// Corre después de `vite build` (ver package.json -> "build").
// Genera páginas estáticas indexables (HTML plano, sin React ni hidratación)
// para cada campo, tienda, ciudad y post de blog, más sitemap.xml, robots.txt
// y llms.txt. No agrega dependencias: usa fs/path de Node y reusa el CSS
// que Vite ya compiló.
//
// Estas páginas son deliberadamente "dumb": HTML + el mismo CSS de Tailwind,
// sin JS de React. La home ("/") sigue siendo la SPA interactiva de siempre.

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { slugify } from '../src/utils/slug.js'
import { blogPosts } from '../src/data/blogPosts.js'
import { whatsappLinkFromPhone } from '../src/utils/whatsapp.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')

// TODO: actualizar con el dominio real antes de deployar a producción.
// Afecta canonical, og:url, sitemap.xml y llms.txt.
const SITE_URL = 'https://elradardelairsoft.github.io'
const SITE_NAME = 'El Radar del Airsoft'
const LOGO_PATH = '/images/logo-radar-airsoft.webp'
const LOGO_PATH_DARK = '/images/logo-radar-airsoft-bw.webp'
const OG_BANNER_PATH = '/images/og-banner.png'

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/airsoft.json'), 'utf8'))

// ---------- helpers genéricos ----------

function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]))
}

function absUrl(p) {
  return SITE_URL + p
}

function jsonLdScript(obj) {
  const json = JSON.stringify(obj).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}

function writePage(routePath, html) {
  const dir = path.join(DIST, routePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
  generatedRoutes.push(routePath)
}

// CSS compilado por Vite: lo leemos del index.html ya buildeado para no
// duplicarlo ni recompilarlo.
function findCssHref() {
  const indexHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  const match = indexHtml.match(/<link rel="stylesheet"[^>]+href="([^"]+)"/)
  if (!match) throw new Error('No se encontró el <link rel="stylesheet"> en dist/index.html')
  return match[1]
}

const generatedRoutes = []

// no-flash dark mode: honra el mismo toggle (localStorage) que usa la SPA,
// así una página de detalle respeta la preferencia que el usuario ya eligió.
const DARK_MODE_SCRIPT = `<script>(function(){try{var s=localStorage.getItem('airsoft-dark-mode');var d=s!==null?s==='true':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()</script>`

function renderHead({ title, description, canonical, ogImage, cssHref, jsonLd = [] }) {
  return `<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/favicon.png" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:site_name" content="${esc(SITE_NAME)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <link rel="preload" href="/fonts/oswald-variable.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin />
    <link href="/fonts/fonts.css" rel="stylesheet" />
    <link rel="stylesheet" href="${cssHref}" />
    ${DARK_MODE_SCRIPT}
    ${jsonLd.map(jsonLdScript).join('\n    ')}`
}

function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  }
}

function breadcrumbNav(items) {
  return `<nav aria-label="Breadcrumb" class="text-xs text-slate-500 mb-4">
    ${items.map((it, i) => `${i > 0 ? '<span class="mx-1.5">/</span>' : ''}${
      i === items.length - 1
        ? `<span class="text-slate-700">${esc(it.name)}</span>`
        : `<a href="${it.path}" class="hover:text-accent-dim">${esc(it.name)}</a>`
    }`).join('')}
  </nav>`
}

function contactRow(icon, label) {
  return `<li class="flex items-center gap-1.5 text-sm text-slate-600">${icon} ${label}</li>`
}

// hideAddress/hideHorarios: canchas oculta dirección/horarios del front a
// pedido (siguen intactos en el JSON) sin afectar a tiendas, que sigue
// mostrando ambos campos igual que antes.
function contactBlock(entity, { hideAddress = false, hideHorarios = false } = {}) {
  const rows = []
  const address = entity.direccion || entity.ubicacion
  if (address && !hideAddress) {
    rows.push(`<li class="text-sm text-slate-600">📍 ${esc(address)}</li>`)
  }
  if (entity.telefono) rows.push(`<li><a href="tel:${esc(entity.telefono)}" class="text-sm text-slate-600 hover:text-accent-dim">📞 ${esc(entity.telefono)}</a></li>`)
  if (entity.email) rows.push(`<li><a href="mailto:${esc(entity.email)}" class="text-sm text-slate-600 hover:text-accent-dim">✉️ ${esc(entity.email)}</a></li>`)
  if (entity.web) {
    const webHref = entity.web.startsWith('http') ? entity.web : `https://${entity.web}`
    let webLabel = entity.web
    try {
      webLabel = new URL(webHref).hostname.replace(/^www\./, '')
    } catch {
      // valor no parseable como URL: se muestra tal cual
    }
    rows.push(`<li><a href="${webHref}" target="_blank" rel="noopener noreferrer" class="text-sm text-slate-600 hover:text-accent-dim">🌐 ${esc(webLabel)}</a></li>`)
  }
  if (entity.horarios && !hideHorarios) rows.push(`<li class="text-sm text-slate-600">🕒 ${esc(entity.horarios)}</li>`)
  return `<ul class="flex flex-col gap-2 mb-5">${rows.join('')}</ul>`
}

function whatsappCta(phone, label = 'Contactar por WhatsApp') {
  const href = whatsappLinkFromPhone(phone)
  if (!href) return ''
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-sm bg-green-600 text-white hover:bg-green-500">${esc(label)}</a>`
}

// ---------- galería de fotos ----------
// JS plano (sin React, sin dependencias): estas páginas son HTML "dumb" a propósito.
const INTERACTIVE_SCRIPT = `<script>
function swapFoto(el) {
  var main = document.getElementById('foto-principal')
  var tmpSrc = main.src, tmpAlt = main.alt
  main.src = el.src; main.alt = el.alt
  el.src = tmpSrc; el.alt = tmpAlt
}
</script>`

// mainSrc/mainAlt: foto principal. extras: hasta 5 rutas adicionales (JSON
// "fotos_adicionales") — clic en una miniatura intercambia esa foto con la
// que está arriba en grande.
function photoGallery(mainSrc, mainAlt, extras) {
  if (!mainSrc) return ''
  const thumbs = (extras || []).filter(Boolean).slice(0, 5)
  const img = `<img id="foto-principal" src="${mainSrc}" alt="${esc(mainAlt)}" width="800" height="450" class="w-full h-auto rounded-sm mb-2 object-cover" />`
  if (thumbs.length === 0) return `${img}<div class="mb-5"></div>`
  return `${img}
    <div class="grid grid-cols-5 gap-2 mb-5">
      ${thumbs.map((t, i) => `<button type="button" onclick="swapFoto(this.querySelector('img'))" aria-label="Ver foto ${i + 2}" class="block rounded-sm overflow-hidden border border-slate-200 hover:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent">
        <img src="${t}" alt="${esc(mainAlt)} — foto ${i + 2}" width="120" height="80" class="w-full h-16 object-cover" />
      </button>`).join('\n      ')}
    </div>`
}

function page({ head, body }) {
  return `<!doctype html>
<html lang="es">
  <head>
    ${head}
  </head>
  <body class="bg-white text-base-950 dark:bg-black dark:text-slate-200">
    <div class="min-h-screen flex flex-col">
      <header class="border-b border-black/40 bg-[#232b1c] bg-[url('/images/camo-tiger-stripe.webp')] bg-cover bg-center">
        <div class="h-[3px] w-full bg-accent"></div>
        <div class="max-w-4xl mx-auto px-4 py-5">
          <a href="/" class="inline-flex items-center gap-2 rounded-sm bg-[#f8f9fd] dark:bg-transparent px-2.5 py-1.5 shadow-md dark:shadow-none w-fit">
            <img src="${LOGO_PATH}" alt="${esc(SITE_NAME)}" width="452" height="456" class="h-20 w-auto object-contain dark:hidden" />
            <img src="${LOGO_PATH_DARK}" alt="${esc(SITE_NAME)}" width="600" height="526" class="hidden dark:block h-20 w-auto object-contain" />
          </a>
        </div>
      </header>
      <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        ${body}
      </main>
      <footer class="border-t border-slate-200 dark:border-base-700 py-6 text-center">
        <a href="/" class="text-sm font-semibold uppercase tracking-wide text-accent-dim dark:text-accent hover:underline">← Volver al directorio completo</a>
      </footer>
    </div>
  </body>
</html>`
}

// ---------- 404 ----------

function build404Page(cssHref) {
  const title = `404 — Página no encontrada | ${SITE_NAME}`
  const head = `<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/favicon.png" />
    <title>${esc(title)}</title>
    <meta name="robots" content="noindex" />
    <link rel="preload" href="/fonts/oswald-variable.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin />
    <link href="/fonts/fonts.css" rel="stylesheet" />
    <link rel="stylesheet" href="${cssHref}" />
    ${DARK_MODE_SCRIPT}`

  const body = `<div class="text-center py-6">
    <img src="/404.webp" alt="Un topo explorador táctico confundido frente a una pantalla de error 404" width="900" height="1125" class="mx-auto w-full max-w-sm rounded-sm mb-8" />
    <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-3">404 — Página no encontrada</h1>
    <p class="text-slate-600 mb-8">Parece que este túnel no lleva a ningún lado. La página que buscas no existe o se movió.</p>
    <a href="/" class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-sm bg-accent text-black hover:bg-accent/90">Volver al directorio</a>
  </div>`

  // 404.html (no "index.html" ni carpeta propia) es el nombre que Netlify,
  // Vercel y GitHub Pages buscan automáticamente como página de error.
  // No se agrega a generatedRoutes/sitemap: no es contenido indexable.
  fs.writeFileSync(path.join(DIST, '404.html'), page({ head, body }))
}

// ---------- generación: campos (canchas) ----------

function buildCampos(cssHref) {
  const byDepartamento = new Map()
  for (const c of data.canchas || []) {
    const dep = (c.departamento || '').trim()
    if (!dep) continue
    if (!byDepartamento.has(dep)) byDepartamento.set(dep, [])
    byDepartamento.get(dep).push(c)
  }

  for (const [departamento, canchas] of byDepartamento) {
    const depSlug = slugify(departamento)
    const depPath = `/campos/${depSlug}`

    // landing de ciudad/departamento
    const breadcrumb = [
      { name: 'Inicio', path: '/' },
      { name: 'Canchas', path: '/campos' },
      { name: departamento, path: depPath },
    ]
    const faq = [
      {
        q: `¿Cuántas canchas de airsoft hay en ${departamento}?`,
        a: `Actualmente ${SITE_NAME} tiene registradas ${canchas.length} cancha${canchas.length === 1 ? '' : 's'} de airsoft en ${departamento}: ${canchas.map((c) => c.nombre).join(', ')}.`,
      },
      {
        q: `¿Cómo reservo una partida en una cancha de airsoft en ${departamento}?`,
        a: `Cada cancha listada tiene su número de WhatsApp directo — es la forma más rápida de coordinar horarios y reservar tu partida.`,
      },
    ]
    const head = renderHead({
      title: `Canchas de airsoft en ${departamento} | ${SITE_NAME}`,
      description: `Directorio de canchas de airsoft en ${departamento}, Perú (también llamadas campos de airsoft): ${canchas.map((c) => c.nombre).join(', ')}. Direcciones, contacto y horarios.`,
      canonical: absUrl(`${depPath}/`),
      ogImage: absUrl(OG_BANNER_PATH),
      cssHref,
      jsonLd: [
        breadcrumbJsonLd(breadcrumb),
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    })
    const body = `${breadcrumbNav(breadcrumb)}
      <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-2">Canchas de airsoft en ${esc(departamento)}</h1>
      <p class="text-slate-600 mb-8">${canchas.length} cancha${canchas.length === 1 ? '' : 's'} de airsoft registrada${canchas.length === 1 ? '' : 's'} en ${SITE_NAME}, el directorio nacional de airsoft del Perú.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        ${canchas.map((c) => `<a href="${depPath}/${slugify(c.nombre)}/" class="block rounded-sm border border-slate-200 p-4 hover:border-accent">
          <h2 class="font-display font-semibold text-lg mb-1">${esc(c.nombre)}</h2>
          ${c.descripcion ? `<p class="text-sm text-slate-600 line-clamp-2">${esc(c.descripcion)}</p>` : ''}
        </a>`).join('')}
      </div>
      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading" class="font-display font-semibold uppercase tracking-wide text-lg mb-4">Preguntas frecuentes</h2>
        <div class="flex flex-col gap-5">
          ${faq.map((f) => `<div><h3 class="font-semibold mb-1">${esc(f.q)}</h3><p class="text-sm text-slate-600">${esc(f.a)}</p></div>`).join('')}
        </div>
      </section>`
    writePage(depPath, page({ head, body }))

    // página individual por cancha
    for (const c of canchas) {
      const nombreSlug = slugify(c.nombre)
      const campoPath = `${depPath}/${nombreSlug}`
      const breadcrumbCampo = [...breadcrumb, { name: c.nombre, path: campoPath }]
      const description = c.descripcion || `${c.nombre} — cancha de airsoft en ${departamento}, Perú. Dirección, contacto y horarios.`
      const head2 = renderHead({
        title: `${c.nombre} — Cancha de airsoft en ${departamento} | ${SITE_NAME}`,
        description,
        canonical: absUrl(`${campoPath}/`),
        ogImage: c.imagen ? absUrl(c.imagen) : absUrl(OG_BANNER_PATH),
        cssHref,
        jsonLd: [
          breadcrumbJsonLd(breadcrumbCampo),
          {
            '@context': 'https://schema.org',
            '@type': 'SportsActivityLocation',
            name: c.nombre,
            description,
            url: absUrl(`${campoPath}/`),
            address: c.direccion ? { '@type': 'PostalAddress', streetAddress: c.direccion, addressRegion: departamento, addressCountry: 'PE' } : undefined,
            telephone: c.telefono || c.whatsapp || undefined,
            image: c.imagen ? absUrl(c.imagen) : undefined,
          },
        ],
      })
      const body2 = `${breadcrumbNav(breadcrumbCampo)}
        <span class="inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm bg-accent/15 text-accent-dim mb-3">Cancha de airsoft · ${esc(departamento)}</span>
        <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-4">${esc(c.nombre)} — Cancha de airsoft en ${esc(departamento)}</h1>
        ${photoGallery(c.imagen, `${c.nombre} — Cancha de airsoft en ${departamento}`, c.fotos_adicionales)}
        ${c.descripcion ? `<p class="text-slate-600 mb-5">${esc(c.descripcion)}</p>` : ''}
        ${contactBlock(c, { hideAddress: true, hideHorarios: true })}
        ${c.organizador ? `<p class="text-sm text-slate-500 mb-5">Organizador: ${esc(c.organizador)}</p>` : ''}
        <div class="flex flex-wrap gap-2">
          ${whatsappCta(c.whatsapp)}
        </div>
        ${INTERACTIVE_SCRIPT}`
      writePage(campoPath, page({ head: head2, body: body2 }))
    }
  }
}

// ---------- generación: tiendas ----------

function buildTiendas(cssHref) {
  const byCiudad = new Map()
  for (const t of data.tiendas || []) {
    const ciudad = (t.ciudad || '').trim()
    if (!ciudad) continue
    if (!byCiudad.has(ciudad)) byCiudad.set(ciudad, [])
    byCiudad.get(ciudad).push(t)
  }

  for (const [ciudad, tiendas] of byCiudad) {
    const ciudadSlug = slugify(ciudad)
    const ciudadPath = `/tiendas/${ciudadSlug}`
    const breadcrumb = [
      { name: 'Inicio', path: '/' },
      { name: 'Tiendas', path: '/tiendas' },
      { name: ciudad, path: ciudadPath },
    ]
    const faq = [
      {
        q: `¿Dónde comprar equipo de airsoft en ${ciudad}?`,
        a: `${SITE_NAME} tiene registradas ${tiendas.length} tienda${tiendas.length === 1 ? '' : 's'} de airsoft en ${ciudad}: ${tiendas.map((t) => t.nombre).join(', ')}.`,
      },
    ]
    const head = renderHead({
      title: `Tiendas de airsoft en ${ciudad} | ${SITE_NAME}`,
      description: `Directorio de tiendas de airsoft en ${ciudad}, Perú: ${tiendas.map((t) => t.nombre).join(', ')}. Réplicas, munición y accesorios.`,
      canonical: absUrl(`${ciudadPath}/`),
      ogImage: absUrl(OG_BANNER_PATH),
      cssHref,
      jsonLd: [
        breadcrumbJsonLd(breadcrumb),
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        },
      ],
    })
    const body = `${breadcrumbNav(breadcrumb)}
      <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-2">Tiendas de airsoft en ${esc(ciudad)}</h1>
      <p class="text-slate-600 mb-8">${tiendas.length} tienda${tiendas.length === 1 ? '' : 's'} registrada${tiendas.length === 1 ? '' : 's'} en ${SITE_NAME}.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        ${tiendas.map((t) => `<a href="${ciudadPath}/${slugify(t.nombre)}/" class="block rounded-sm border border-slate-200 p-4 hover:border-accent">
          <h2 class="font-display font-semibold text-lg mb-1">${esc(t.nombre)}</h2>
          <p class="text-sm text-slate-600">${esc(t.especialidad || '')}</p>
        </a>`).join('')}
      </div>
      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading" class="font-display font-semibold uppercase tracking-wide text-lg mb-4">Preguntas frecuentes</h2>
        <div class="flex flex-col gap-5">
          ${faq.map((f) => `<div><h3 class="font-semibold mb-1">${esc(f.q)}</h3><p class="text-sm text-slate-600">${esc(f.a)}</p></div>`).join('')}
        </div>
      </section>`
    writePage(ciudadPath, page({ head, body }))

    for (const t of tiendas) {
      const nombreSlug = slugify(t.nombre)
      const tiendaPath = `${ciudadPath}/${nombreSlug}`
      const breadcrumbTienda = [...breadcrumb, { name: t.nombre, path: tiendaPath }]
      const description = t.descripcion || `${t.nombre} — tienda de airsoft en ${ciudad}, Perú. ${t.especialidad || ''}`.trim()
      const head2 = renderHead({
        title: `${t.nombre} — Tienda de airsoft en ${ciudad} | ${SITE_NAME}`,
        description,
        canonical: absUrl(`${tiendaPath}/`),
        ogImage: t.imagen ? absUrl(t.imagen) : absUrl(OG_BANNER_PATH),
        cssHref,
        jsonLd: [
          breadcrumbJsonLd(breadcrumbTienda),
          {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: t.nombre,
            description,
            url: absUrl(`${tiendaPath}/`),
            address: t.direccion ? { '@type': 'PostalAddress', streetAddress: t.direccion, addressRegion: ciudad, addressCountry: 'PE' } : undefined,
            telephone: t.telefono || t.whatsapp || undefined,
            image: t.imagen ? absUrl(t.imagen) : undefined,
          },
        ],
      })
      const body2 = `${breadcrumbNav(breadcrumbTienda)}
        <span class="inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm bg-accent/15 text-accent-dim mb-3">Tienda de airsoft · ${esc(ciudad)}</span>
        <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-4">${esc(t.nombre)} — Tienda de airsoft en ${esc(ciudad)}</h1>
        ${t.imagen ? `<img src="${t.imagen}" alt="${esc(t.nombre)} — Tienda de airsoft en ${esc(ciudad)}" width="800" height="450" class="w-full h-auto rounded-sm mb-5 object-cover" />` : ''}
        ${t.especialidad ? `<p class="text-slate-700 font-medium mb-2">${esc(t.especialidad)}</p>` : ''}
        ${t.descripcion ? `<p class="text-slate-600 mb-5">${esc(t.descripcion)}</p>` : ''}
        ${contactBlock(t)}
        ${whatsappCta(t.whatsapp)}`
      writePage(tiendaPath, page({ head: head2, body: body2 }))
    }
  }
}

// ---------- generación: eventos ----------

function buildEventos(cssHref) {
  const eventos = (data.eventos || []).filter((e) => e.nombre)
  if (eventos.length === 0) return

  const eventosIndexPath = '/eventos'
  const breadcrumbIndex = [{ name: 'Inicio', path: '/' }, { name: 'Eventos', path: eventosIndexPath }]

  const headIndex = renderHead({
    title: `Eventos de airsoft en Perú | ${SITE_NAME}`,
    description: 'Próximos eventos y partidas especiales de airsoft en Perú: fecha, ubicación, aforo e inscripción.',
    canonical: absUrl(`${eventosIndexPath}/`),
    ogImage: absUrl(OG_BANNER_PATH),
    cssHref,
    jsonLd: [breadcrumbJsonLd(breadcrumbIndex)],
  })
  const bodyIndex = `${breadcrumbNav(breadcrumbIndex)}
    <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-6">Eventos de airsoft en Perú</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      ${eventos.map((e) => `<a href="${eventosIndexPath}/${slugify(e.nombre)}/" class="block rounded-sm border border-slate-200 p-4 hover:border-accent">
        <h2 class="font-display font-semibold text-lg mb-1">${esc(e.nombre)}</h2>
        <p class="text-sm text-slate-600">${esc(e.fecha_hora || '')}</p>
      </a>`).join('')}
    </div>`
  writePage(eventosIndexPath, page({ head: headIndex, body: bodyIndex }))

  for (const e of eventos) {
    const eventoPath = `${eventosIndexPath}/${slugify(e.nombre)}`
    const breadcrumbEvento = [...breadcrumbIndex, { name: e.nombre, path: eventoPath }]
    const description = e.descripcion || `${e.nombre} — evento de airsoft en Perú. ${e.fecha_hora || ''}`.trim()
    const head = renderHead({
      title: `${e.nombre} — Evento de airsoft | ${SITE_NAME}`,
      description,
      canonical: absUrl(`${eventoPath}/`),
      ogImage: e.imagen ? absUrl(e.imagen) : absUrl(OG_BANNER_PATH),
      cssHref,
      jsonLd: [
        breadcrumbJsonLd(breadcrumbEvento),
        {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: e.nombre,
          description,
          startDate: e.fecha_hora || undefined,
          location: e.ubicacion ? { '@type': 'Place', name: e.ubicacion } : undefined,
          url: absUrl(`${eventoPath}/`),
          image: e.imagen ? absUrl(e.imagen) : undefined,
        },
      ],
    })
    const body = `${breadcrumbNav(breadcrumbEvento)}
      <span class="inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm bg-accent/15 text-accent-dim mb-3">Evento de airsoft</span>
      <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-4">${esc(e.nombre)}</h1>
      ${photoGallery(e.imagen, e.nombre, e.fotos_adicionales)}
      ${e.descripcion ? `<p class="text-slate-600 mb-5">${esc(e.descripcion)}</p>` : ''}
      <ul class="flex flex-col gap-2 mb-5">
        ${e.fecha_hora ? `<li class="text-sm text-slate-600">🗓️ ${esc(e.fecha_hora)}</li>` : ''}
        ${e.aforo ? `<li class="text-sm text-slate-600">👥 Aforo: ${esc(e.aforo)}</li>` : ''}
        ${e.contacto ? `<li class="text-sm text-slate-600">☎️ Contacto: ${esc(e.contacto)}</li>` : ''}
      </ul>
      <div class="flex flex-wrap gap-2">
        ${whatsappCta(e.whatsapp)}
        ${e.link_inscripcion ? `<a href="${e.link_inscripcion}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-sm border border-accent text-accent-dim hover:bg-accent hover:text-black dark:text-accent">Inscribirme</a>` : ''}
      </div>
      ${INTERACTIVE_SCRIPT}`
    writePage(eventoPath, page({ head, body }))
  }
}

// ---------- generación: blog ----------

function buildBlog(cssHref) {
  const blogIndexPath = '/blog'
  const breadcrumbIndex = [{ name: 'Inicio', path: '/' }, { name: 'Blog', path: blogIndexPath }]

  const headIndex = renderHead({
    title: `Blog de airsoft en Perú | ${SITE_NAME}`,
    description: 'Guías, comparativas y respuestas sobre airsoft en Perú: legalidad, diferencias con paintball/gotcha/gelsoft, y cómo empezar.',
    canonical: absUrl(`${blogIndexPath}/`),
    ogImage: absUrl(OG_BANNER_PATH),
    cssHref,
    jsonLd: [breadcrumbJsonLd(breadcrumbIndex)],
  })
  const bodyIndex = `${breadcrumbNav(breadcrumbIndex)}
    <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-6">Blog de airsoft en Perú</h1>
    <div class="flex flex-col gap-4">
      ${blogPosts.map((p) => `<a href="${blogIndexPath}/${p.slug}/" class="block rounded-sm border border-slate-200 p-5 hover:border-accent">
        <h2 class="font-display font-semibold text-lg mb-1.5">${esc(p.title)}</h2>
        <p class="text-sm text-slate-600">${esc(p.metaDescription)}</p>
      </a>`).join('')}
    </div>`
  writePage(blogIndexPath, page({ head: headIndex, body: bodyIndex }))

  for (const post of blogPosts) {
    const postPath = `${blogIndexPath}/${post.slug}`
    const breadcrumbPost = [...breadcrumbIndex, { name: post.title, path: postPath }]
    const head = renderHead({
      title: `${post.title} | ${SITE_NAME}`,
      description: post.metaDescription,
      canonical: absUrl(`${postPath}/`),
      ogImage: absUrl(OG_BANNER_PATH),
      cssHref,
      jsonLd: [
        breadcrumbJsonLd(breadcrumbPost),
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.metaDescription,
          datePublished: post.publishedAt,
          url: absUrl(`${postPath}/`),
          author: { '@type': 'Organization', name: SITE_NAME },
          publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: absUrl(LOGO_PATH) } },
        },
      ],
    })
    const table = post.comparativa ? `<div class="overflow-x-auto mb-8">
      <table class="w-full text-sm border-collapse">
        <thead><tr>${post.comparativa.headers.map((h) => `<th class="text-left border-b border-slate-300 py-2 pr-4 font-semibold">${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${post.comparativa.rows.map((row) => `<tr>${row.map((cell) => `<td class="border-b border-slate-200 py-2 pr-4 text-slate-600">${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>` : ''

    const body = `${breadcrumbNav(breadcrumbPost)}
      <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-4">${esc(post.title)}</h1>
      <p class="text-base font-medium text-slate-800 bg-accent/10 border-l-4 border-accent rounded-sm p-4 mb-8">${esc(post.respuestaRapida)}</p>
      ${post.sections.map((s) => `<section class="mb-8">
        <h2 class="font-display font-semibold text-xl mb-3">${esc(s.heading)}</h2>
        ${s.body.map((p) => `<p class="text-slate-600 mb-3">${esc(p)}</p>`).join('')}
      </section>`).join('')}
      ${table}`
    writePage(postPath, page({ head, body }))
  }
}

// ---------- home: contenido estático rastreable ----------

// La home ("/") sigue siendo la SPA interactiva — React monta y reemplaza
// #root por completo. Pero el HTML que Vite deja en dist/index.html llega
// con #root vacío, así que cualquier bot que no ejecute JS (y varios
// crawlers de motores GEO no lo hacen) ve una página sin texto ni keywords.
// Inyectamos aquí contenido real (mismos datos que usa la SPA) dentro de
// #root: los usuarios con JS lo ven un instante antes de que React lo
// reemplace; los bots sin JS lo indexan tal cual.
function injectHomeContent() {
  const indexPath = path.join(DIST, 'index.html')
  const html = fs.readFileSync(indexPath, 'utf8')

  const departamentos = [...new Set((data.canchas || []).map((c) => (c.departamento || '').trim()).filter(Boolean))]
  const ciudadesTiendas = [...new Set((data.tiendas || []).map((t) => (t.ciudad || '').trim()).filter(Boolean))]
  const nCanchas = (data.canchas || []).length
  const nTiendas = (data.tiendas || []).length
  const nEquipos = (data.equipos || []).length

  const seoContent = `<header class="border-b border-black/40 bg-[#232b1c]">
      <div class="max-w-4xl mx-auto px-4 py-5">
        <span class="inline-flex items-center gap-2 rounded-sm bg-[#f8f9fd] px-2.5 py-1.5">
          <img src="${LOGO_PATH}" alt="${esc(SITE_NAME)}" width="452" height="456" class="h-14 w-auto object-contain" />
        </span>
      </div>
    </header>
    <main class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-3">El Radar del Airsoft — Directorio Nacional de Airsoft en Perú</h1>
      <p class="text-slate-600 mb-6">${esc(SITE_NAME)} es el directorio con canchas de airsoft en Lima y en todo el Perú, además de tiendas, grupos de WhatsApp, equipos, importadores y talleres de reparación. Actualmente hay ${nCanchas} canchas de airsoft, ${nTiendas} tiendas y ${nEquipos} equipos registrados a nivel nacional.</p>
      <h2 class="font-display font-semibold uppercase tracking-wide text-lg mb-3">Canchas de airsoft por departamento</h2>
      <ul class="flex flex-wrap gap-2 mb-8">
        ${departamentos.map((d) => `<li><a href="/campos/${slugify(d)}/" class="inline-block text-sm px-3 py-1.5 rounded-sm border border-slate-300 hover:border-accent">Canchas de airsoft en ${esc(d)}</a></li>`).join('\n        ')}
      </ul>
      <h2 class="font-display font-semibold uppercase tracking-wide text-lg mb-3">Tiendas de airsoft por ciudad</h2>
      <ul class="flex flex-wrap gap-2 mb-8">
        ${ciudadesTiendas.map((c) => `<li><a href="/tiendas/${slugify(c)}/" class="inline-block text-sm px-3 py-1.5 rounded-sm border border-slate-300 hover:border-accent">Tiendas de airsoft en ${esc(c)}</a></li>`).join('\n        ')}
      </ul>
      <h2 class="font-display font-semibold uppercase tracking-wide text-lg mb-3">Blog</h2>
      <ul class="mb-8">
        ${blogPosts.map((p) => `<li><a href="/blog/${p.slug}/" class="text-sm text-accent-dim hover:underline">${esc(p.title)}</a></li>`).join('\n        ')}
      </ul>
      <p class="text-xs text-slate-400">Cargando el directorio interactivo…</p>
    </main>`

  const updated = html.replace('<div id="root"></div>', `<div id="root">${seoContent}</div>`)
  if (updated === html) throw new Error('No se encontró <div id="root"></div> en dist/index.html — revisar injectHomeContent()')
  fs.writeFileSync(indexPath, updated)
}

// ---------- sitemap / robots / llms.txt ----------

// Fecha real del build (último commit) en vez de un campo del JSON que hay
// que acordarse de actualizar a mano y queda desfasado.
function getLastCommitDate() {
  try {
    return execSync('git log -1 --format=%cd --date=short').toString().trim()
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

function buildSeoFiles() {
  const lastmod = getLastCommitDate()
  const urls = ['/', ...generatedRoutes.map((r) => `${r}/`)]
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${absUrl(u)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join('\n')}
</urlset>
`
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap)

  const robots = `User-agent: *
Allow: /

Sitemap: ${absUrl('/sitemap.xml')}
`
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots)

  const nCanchas = (data.canchas || []).length
  const nTiendas = (data.tiendas || []).length
  const nEquipos = (data.equipos || []).length
  const departamentos = [...new Set((data.canchas || []).map((c) => c.departamento).filter(Boolean))]
  const ciudadesTiendas = [...new Set((data.tiendas || []).map((t) => t.ciudad).filter(Boolean))]

  const llms = `# ${SITE_NAME}

> El único directorio nacional de airsoft del Perú: campos de juego, tiendas, grupos de WhatsApp, eventos, importadores, workshops de reparación, jugadores y equipos — en un solo lugar, a nivel nacional (no solo Lima).

## Qué es
${SITE_NAME} es un directorio comunitario, no una tienda ni un club. Reúne y organiza la información de contacto (WhatsApp, dirección, redes) de negocios y grupos de la comunidad de airsoft peruana.

## Categorías y volumen actual
- Canchas de airsoft (también llamadas campos de airsoft): ${nCanchas} (departamentos con página propia: ${departamentos.join(', ') || 'sin datos aún'})
- Tiendas: ${nTiendas} (ciudades con página propia: ${ciudadesTiendas.join(', ') || 'sin datos aún'})
- Equipos activos: ${nEquipos}
- Blog: ${blogPosts.length} artículo${blogPosts.length === 1 ? '' : 's'} publicado${blogPosts.length === 1 ? '' : 's'}

## Nota de desambiguación importante
"Airsoft" no es lo mismo que "gotcha" (nombre coloquial usado en Perú para paintball) ni que "gelsoft"/"gel blaster" (bolitas de gel). El airsoft usa réplicas realistas de armas y munición de BBs plásticas. Detalle completo: ${absUrl('/blog/airsoft-vs-paintball-vs-gotcha-vs-gelsoft-peru/')}

## Páginas principales
- Directorio interactivo (buscador, filtros): ${absUrl('/')}
- Canchas de airsoft por departamento: ${departamentos.map((d) => absUrl(`/campos/${slugify(d)}/`)).join(', ') || `${absUrl('/campos/')}<departamento>/`}
- Tiendas por ciudad: ${ciudadesTiendas.map((c) => absUrl(`/tiendas/${slugify(c)}/`)).join(', ') || `${absUrl('/tiendas/')}<ciudad>/`}
- Blog: ${absUrl('/blog/')}

## Sitemap
${absUrl('/sitemap.xml')}
`
  // BOM al inicio: el .txt no lleva header de charset en todos los hosts
  // estáticos, y sin BOM algunos navegadores adivinan mal el encoding y
  // corrompen tildes/ñ. Con BOM, UTF-8 se detecta de forma confiable.
  fs.writeFileSync(path.join(DIST, 'llms.txt'), String.fromCharCode(0xfeff) + llms)
}

// ---------- main ----------

function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('[prerender] dist/index.html no existe — corre "vite build" primero.')
    process.exit(1)
  }
  const cssHref = findCssHref()
  injectHomeContent()
  buildCampos(cssHref)
  buildTiendas(cssHref)
  buildEventos(cssHref)
  buildBlog(cssHref)
  build404Page(cssHref)
  buildSeoFiles()
  console.log(`[prerender] ${generatedRoutes.length} páginas estáticas generadas + sitemap.xml + robots.txt + llms.txt`)
}

main()
