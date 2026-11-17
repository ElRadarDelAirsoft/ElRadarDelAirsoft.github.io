// Helpers de fechas de los carteles del banner. Sin dependencias del DOM ni de
// Vite: los usan tanto la SPA (Banner.jsx, bannerImages.js) como el prerender
// en Node (scripts/prerender.mjs).

// Fecha de hoy (YYYY-MM-DD) en hora de Perú, que es la que importa para
// decidir si una partida ya pasó (el servidor/CI corre en UTC).
export function todayInLima(now = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: 'America/Lima' })
}

// Un cartel vence cuando su fecha es anterior a hoy; el del mismo día sigue
// vigente. Sin fecha registrada nunca vence (igual que en /bannerweb).
export function isExpired(date, today = todayInLima()) {
  return Boolean(date) && date < today
}

// "2026-11-22" → "domingo 22 de noviembre de 2026"
export function formatEventDate(date) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

// "09:00" → "9:00 am"
export function formatEventTime(hora) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hora || '')
  if (!m) return ''
  const h = Number(m[1])
  return `${h % 12 || 12}:${m[2]} ${h < 12 ? 'am' : 'pm'}`
}

// ISO 8601 con zona horaria de Perú (UTC-5, sin horario de verano), que es
// lo que Google exige en startDate; sin hora devuelve solo la fecha.
export function eventStartIso(date, hora) {
  return /^\d{1,2}:\d{2}$/.test(hora || '') ? `${date}T${hora.padStart(5, '0')}:00-05:00` : date
}
