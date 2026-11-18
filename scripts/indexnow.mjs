// Avisa a Bing (y a los demás buscadores que usan IndexNow) de las URLs del
// sitio para que las rastreen sin esperar. Se corre a mano DESPUÉS de que el
// deploy esté publicado:
//
//   npm run indexnow
//
// Lee el sitemap en vivo, así que solo envía URLs que ya existen en
// producción. La clave es pública por diseño: el protocolo exige que esté
// publicada en https://<sitio>/<clave>.txt (ver public/).

const SITE_URL = 'https://elradardelairsoft.github.io'
const KEY = 'afd6e27b51463464d9c2bbeda0931352'

const keyCheck = await fetch(`${SITE_URL}/${KEY}.txt`)
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`[indexnow] ${SITE_URL}/${KEY}.txt no está publicado todavía. Espera al deploy y reintenta.`)
  process.exit(1)
}

const sitemap = await (await fetch(`${SITE_URL}/sitemap.xml`)).text()
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (urlList.length === 0) {
  console.error('[indexnow] el sitemap no tiene URLs.')
  process.exit(1)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE_URL).host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  }),
})
// 200 = recibido, 202 = recibido y pendiente de validar la clave
console.log(`[indexnow] ${urlList.length} URLs enviadas -> HTTP ${res.status}`)
if (res.status >= 400) {
  console.error(await res.text())
  process.exit(1)
}
