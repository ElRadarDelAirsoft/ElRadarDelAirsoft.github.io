// Quita tildes/diacríticos (á->a, ñ->n, ü->u) sin tocar mayúsculas ni espacios.
// Node-safe: no usa APIs de DOM, así que sirve tanto en el browser (Card.jsx,
// búsqueda) como en el script de build (scripts/prerender.mjs).
export function stripDiacritics(str) {
  if (!str) return ''
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Convierte un nombre en un slug de URL (minúsculas, sin tildes, guiones).
export function slugify(str) {
  if (!str) return ''
  return stripDiacritics(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
