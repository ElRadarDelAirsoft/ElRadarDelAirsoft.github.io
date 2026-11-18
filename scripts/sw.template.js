// Service worker de El Radar del Airsoft.
//
// NO se edita en dist/: scripts/prerender.mjs lo genera a partir de esta
// plantilla en cada build, reemplazando los marcadores de BUILD_ID y PRECACHE (abajo).
// Cada deploy cambia el BUILD_ID, así el navegador instala la versión nueva
// y borra las cachés de la anterior (no se queda contenido viejo).
//
// Estrategia:
//  - Páginas HTML (navegación): red primero (siempre contenido fresco: las
//    partidas de la semana cambian), con respaldo en caché si no hay señal
//    o la red tarda más de 3 s. Sin caché ni red -> se muestra la home
//    precacheada (el directorio completo vive dentro del JS de la home).
//  - /assets/* y /fonts/*: nombres con hash -> caché primero.
//  - Imágenes: sirve la copia guardada y la refresca en segundo plano.
//  - Todo lo demás (sitemap, robots, llms.txt, .ics, PDF, otros dominios)
//    no se toca.
//
// Para apagarlo en una emergencia: publicar un sw.js que haga
// self.registration.unregister() y borre las cachés "radar-*".

const BUILD_ID = '__BUILD_ID__'
const PRECACHE = __PRECACHE__

const SHELL = `radar-shell-${BUILD_ID}`
const PAGES = `radar-pages-${BUILD_ID}`
const IMAGES = 'radar-images-v1'
const KEEP = [SHELL, PAGES, IMAGES]
const MAX_PAGES = 60
const MAX_IMAGES = 250
const NETWORK_TIMEOUT_MS = 3000

const BYPASS = /\.(?:xml|txt|pdf|ics|json|webmanifest)$|\/google[^/]*\.html$|\/sw\.js$/i
const IMAGE = /\.(?:webp|png|jpe?g|gif|svg|avif|ico)$/i

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => n.startsWith('radar-') && !KEEP.includes(n)).map((n) => caches.delete(n))),
      )
      .then(() => self.clients.claim()),
  )
})

async function trim(name, max) {
  const cache = await caches.open(name)
  const keys = await cache.keys()
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i])
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function offlineFallback() {
  const home = await caches.match('/')
  return (
    home ||
    new Response('Sin conexión. Vuelve a intentarlo cuando tengas internet.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  )
}

async function pageStrategy(request, event) {
  const cache = await caches.open(PAGES)
  // La home guarda filtros en la URL (?q=...&cat=...): todas las variantes
  // comparten una sola copia.
  const keyUrl = new URL(request.url)
  keyUrl.search = ''
  const key = keyUrl.href
  const cached = await cache.match(key)

  const network = fetch(request).then((response) => {
    if (response.ok) {
      const copy = response.clone()
      event.waitUntil(cache.put(key, copy).then(() => trim(PAGES, MAX_PAGES)))
    }
    return response
  })

  if (!cached) return network.catch(offlineFallback)
  // Con copia guardada: si la red falla o tarda, se muestra la copia.
  return Promise.race([network, timeout(NETWORK_TIMEOUT_MS).then(() => cached)]).catch(() => cached)
}

async function cacheFirst(request, cacheName, event) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  if (hit) return hit
  const response = await fetch(request)
  if (response.ok) event.waitUntil(cache.put(request, response.clone()))
  return response
}

async function staleWhileRevalidate(request, cacheName, event) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) {
        event.waitUntil(cache.put(request, response.clone()).then(() => trim(cacheName, MAX_IMAGES)))
      }
      return response
    })
    .catch(() => null)
  if (hit) {
    event.waitUntil(refresh)
    return hit
  }
  return (await refresh) || Response.error()
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || request.headers.has('range')) return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin || BYPASS.test(url.pathname)) return

  if (request.mode === 'navigate') {
    event.respondWith(pageStrategy(request, event))
  } else if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/')) {
    event.respondWith(cacheFirst(request, SHELL, event))
  } else if (IMAGE.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, IMAGES, event))
  }
})
