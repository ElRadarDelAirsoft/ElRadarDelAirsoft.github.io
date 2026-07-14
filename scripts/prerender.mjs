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
import { fileURLToPath } from 'node:url'
import { slugify } from '../src/utils/slug.js'
import { blogPosts } from '../src/data/blogPosts.js'
import { whatsappLinkFromPhone, mapsLinkFromAddress } from '../src/utils/whatsapp.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')

// TODO: actualizar con el dominio real antes de deployar a producción.
// Afecta canonical, og:url, sitemap.xml y llms.txt.
const SITE_URL = 'https://elradardelairsoft.pe'
const SITE_NAME = 'El Radar del Airsoft'
const LOGO_PATH = '/images/logo-radar-airsoft.png'

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
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
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

function contactBlock(entity) {
  const rows = []
  const address = entity.direccion || entity.ubicacion
  if (address) {
    rows.push(`<li><a href="${mapsLinkFromAddress(address)}" target="_blank" rel="noopener noreferrer" class="text-sm text-slate-600 hover:text-accent-dim">📍 ${esc(address)}</a></li>`)
  }
  if (entity.telefono) rows.push(`<li><a href="tel:${esc(entity.telefono)}" class="text-sm text-slate-600 hover:text-accent-dim">📞 ${esc(entity.telefono)}</a></li>`)
  if (entity.email) rows.push(`<li><a href="mailto:${esc(entity.email)}" class="text-sm text-slate-600 hover:text-accent-dim">✉️ ${esc(entity.email)}</a></li>`)
  if (entity.web) rows.push(`<li><a href="${entity.web.startsWith('http') ? entity.web : 'https://' + entity.web}" target="_blank" rel="noopener noreferrer" class="text-sm text-slate-600 hover:text-accent-dim">🌐 ${esc(entity.web)}</a></li>`)
  if (entity.horarios) rows.push(`<li class="text-sm text-slate-600">🕒 ${esc(entity.horarios)}</li>`)
  return `<ul class="flex flex-col gap-2 mb-5">${rows.join('')}</ul>`
}

function whatsappCta(phone, label = 'Contactar por WhatsApp') {
  const href = whatsappLinkFromPhone(phone)
  if (!href) return ''
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-sm bg-green-600 text-white hover:bg-green-500">${esc(label)}</a>`
}

function page({ head, body }) {
  return `<!doctype html>
<html lang="es">
  <head>
    ${head}
  </head>
  <body class="bg-white text-base-950 dark:bg-black dark:text-slate-200">
    <div class="min-h-screen flex flex-col">
      <header class="border-b border-slate-200 bg-[#f8f9fd]">
        <div class="h-[3px] w-full bg-accent"></div>
        <div class="max-w-4xl mx-auto px-4 py-5">
          <a href="/" class="inline-flex items-center gap-2">
            <img src="${LOGO_PATH}" alt="${esc(SITE_NAME)}" class="h-12 w-auto object-contain" />
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
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${cssHref}" />
    ${DARK_MODE_SCRIPT}`

  const body = `<div class="text-center py-6">
    <img src="/404.webp" alt="Un topo explorador táctico confundido frente a una pantalla de error 404" class="mx-auto w-full max-w-sm rounded-sm mb-8" />
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
      { name: 'Campos', path: '/campos' },
      { name: departamento, path: depPath },
    ]
    const faq = [
      {
        q: `¿Cuántos campos de airsoft hay en ${departamento}?`,
        a: `Actualmente ${SITE_NAME} tiene registrados ${canchas.length} campo${canchas.length === 1 ? '' : 's'} de airsoft en ${departamento}: ${canchas.map((c) => c.nombre).join(', ')}.`,
      },
      {
        q: `¿Cómo reservo una partida en un campo de airsoft en ${departamento}?`,
        a: `Cada campo listado tiene su número de WhatsApp directo — es la forma más rápida de coordinar horarios y reservar tu partida.`,
      },
    ]
    const head = renderHead({
      title: `Campos de airsoft en ${departamento} | ${SITE_NAME}`,
      description: `Directorio de campos de airsoft en ${departamento}, Perú: ${canchas.map((c) => c.nombre).join(', ')}. Direcciones, contacto y horarios.`,
      canonical: absUrl(`${depPath}/`),
      ogImage: absUrl(LOGO_PATH),
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
      <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-2">Campos de airsoft en ${esc(departamento)}</h1>
      <p class="text-slate-600 mb-8">${canchas.length} campo${canchas.length === 1 ? '' : 's'} registrado${canchas.length === 1 ? '' : 's'} en ${SITE_NAME}, el directorio nacional de airsoft del Perú.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        ${canchas.map((c) => `<a href="${depPath}/${slugify(c.nombre)}/" class="block rounded-sm border border-slate-200 p-4 hover:border-accent">
          <h2 class="font-display font-semibold text-lg mb-1">${esc(c.nombre)}</h2>
          <p class="text-sm text-slate-600">${esc(c.direccion || '')}</p>
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
      const description = c.descripcion || `${c.nombre} — campo de airsoft en ${departamento}, Perú. Dirección, contacto y horarios.`
      const head2 = renderHead({
        title: `${c.nombre} — Airsoft en ${departamento} | ${SITE_NAME}`,
        description,
        canonical: absUrl(`${campoPath}/`),
        ogImage: c.imagen ? absUrl(c.imagen) : absUrl(LOGO_PATH),
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
        <span class="inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm bg-accent/15 text-accent-dim mb-3">Campo de airsoft · ${esc(departamento)}</span>
        <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-4">${esc(c.nombre)}</h1>
        ${c.descripcion ? `<p class="text-slate-600 mb-5">${esc(c.descripcion)}</p>` : ''}
        ${contactBlock(c)}
        ${c.organizador ? `<p class="text-sm text-slate-500 mb-5">Organizador: ${esc(c.organizador)}</p>` : ''}
        ${whatsappCta(c.whatsapp)}`
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
      ogImage: absUrl(LOGO_PATH),
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
        ogImage: t.imagen ? absUrl(t.imagen) : absUrl(LOGO_PATH),
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
        <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-4">${esc(t.nombre)}</h1>
        ${t.especialidad ? `<p class="text-slate-700 font-medium mb-2">${esc(t.especialidad)}</p>` : ''}
        ${t.descripcion ? `<p class="text-slate-600 mb-5">${esc(t.descripcion)}</p>` : ''}
        ${contactBlock(t)}
        ${whatsappCta(t.whatsapp)}`
      writePage(tiendaPath, page({ head: head2, body: body2 }))
    }
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
    ogImage: absUrl(LOGO_PATH),
    cssHref,
    jsonLd: [breadcrumbJsonLd(breadcrumbIndex)],
  })
  const bodyIndex = `${breadcrumbNav(breadcrumbIndex)}
    <h1 class="font-display font-semibold uppercase tracking-wide text-2xl sm:text-3xl mb-6">Blog</h1>
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
      ogImage: absUrl(LOGO_PATH),
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

// ---------- sitemap / robots / llms.txt ----------

function buildSeoFiles() {
  const lastmod = data._ultima_actualizacion || new Date().toISOString().slice(0, 10)
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
- Campos de airsoft: ${nCanchas} (departamentos con página propia: ${departamentos.join(', ') || 'sin datos aún'})
- Tiendas: ${nTiendas} (ciudades con página propia: ${ciudadesTiendas.join(', ') || 'sin datos aún'})
- Equipos activos: ${nEquipos}
- Blog: ${blogPosts.length} artículo${blogPosts.length === 1 ? '' : 's'} publicado${blogPosts.length === 1 ? '' : 's'}

## Nota de desambiguación importante
"Airsoft" no es lo mismo que "gotcha" (nombre coloquial usado en Perú para paintball) ni que "gelsoft"/"gel blaster" (bolitas de gel). El airsoft usa réplicas realistas de armas y munición de BBs plásticas. Detalle completo: ${absUrl('/blog/airsoft-vs-paintball-vs-gotcha-vs-gelsoft-peru/')}

## Páginas principales
- Directorio interactivo (buscador, filtros): ${absUrl('/')}
- Campos por departamento: ${departamentos.map((d) => absUrl(`/campos/${slugify(d)}/`)).join(', ') || `${absUrl('/campos/')}<departamento>/`}
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
  buildCampos(cssHref)
  buildTiendas(cssHref)
  buildBlog(cssHref)
  build404Page(cssHref)
  buildSeoFiles()
  console.log(`[prerender] ${generatedRoutes.length} páginas estáticas generadas + sitemap.xml + robots.txt + llms.txt`)
}

main()
