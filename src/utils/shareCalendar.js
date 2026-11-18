// Helpers puros (sin DOM, sin dependencias) para "Compartir por WhatsApp" y
// "Agregar al calendario". Los usa scripts/prerender.mjs en Node.
//
// Zona horaria: Perú es UTC-5 todo el año (sin horario de verano), así que
// convertir a UTC es sumar 5 horas, sin tablas de zona horaria.

const PERU_UTC_OFFSET_HOURS = 5
const DEFAULT_DURATION_HOURS = 4

export function whatsappShareUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

function pad(n) {
  return String(n).padStart(2, '0')
}

// 'YYYY-MM-DD' (+ opcional 'HH:MM' hora de Perú) -> Date en UTC
function toUtcDate(date, hora) {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = hora ? hora.split(':').map(Number) : [0, 0]
  return new Date(Date.UTC(y, m - 1, d, hh + PERU_UTC_OFFSET_HOURS, mm || 0))
}

function stamp(dt) {
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`
}

function dayStamp(date, plusDays = 0) {
  const [y, m, d] = date.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + plusDays))
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`
}

// Sin hora -> evento de día completo. Con hora -> bloque de 4 h (una partida
// típica dura 3-4 h; el usuario lo ajusta en su calendario si hace falta).
function range(date, hora) {
  if (!hora) return { allDay: true, start: dayStamp(date), end: dayStamp(date, 1) }
  const start = toUtcDate(date, hora)
  const end = new Date(start.getTime() + DEFAULT_DURATION_HOURS * 3600 * 1000)
  return { allDay: false, start: stamp(start), end: stamp(end) }
}

export function googleCalendarUrl({ title, date, hora, details, location }) {
  const r = range(date, hora)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${r.start}/${r.end}`,
    details: details || '',
    location: location || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function icsEscape(text) {
  return String(text ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

// RFC 5545: líneas de máx. 75 octetos; las largas se pliegan con CRLF + espacio.
function fold(line) {
  const out = []
  let rest = line
  while (rest.length > 70) {
    out.push(rest.slice(0, 70))
    rest = ' ' + rest.slice(70)
  }
  out.push(rest)
  return out.join('\r\n')
}

export function icsContent({ uid, title, date, hora, details, location, url }) {
  const r = range(date, hora)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//El Radar del Airsoft//Eventos//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    r.allDay ? `DTSTART;VALUE=DATE:${r.start}` : `DTSTART:${r.start}`,
    r.allDay ? `DTEND;VALUE=DATE:${r.end}` : `DTEND:${r.end}`,
    `SUMMARY:${icsEscape(title)}`,
    details ? `DESCRIPTION:${icsEscape(details)}` : null,
    location ? `LOCATION:${icsEscape(location)}` : null,
    url ? `URL:${url}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)
  return lines.map(fold).join('\r\n') + '\r\n'
}
