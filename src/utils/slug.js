// Convierte un nombre en un slug de URL (minúsculas, sin tildes, guiones).
// Node-safe: no usa APIs de DOM, así que sirve tanto en el browser (Card.jsx)
// como en el script de build (scripts/prerender.mjs).
export function slugify(str) {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes/diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
