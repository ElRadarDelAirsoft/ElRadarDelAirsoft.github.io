// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  '+51 998 318 610': '2026-09-24', // Partida Nocturna, CQB La Molina
  'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZm9ybXMvZC9lLzFGQUlwUUxTZjlqbU1JRGZhd0xhVGtqUTdpREFBbTFZQmhRWTNkbHU1YVdmZ1BONlcwM0JYNXBRL3ZpZXdmb3Jt': '2026-09-26', // Bomb Challenge, Airsoft Night Mission
  'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZm9ybXMvZC9lLzFGQUlwUUxTZkpDU3RlQWkxM1U0ZWg0YjB6cHBncUN4Wk9TdjZxNzh6WVV2Qmg1QmZrTGtpOGdBL3ZpZXdmb3Jt': '2026-09-27', // Batalla Stalingrado, Fábrica
  'aHR0cHM6Ly9mb3Jtcy5nbGUvdFhOMlUyb1JzekFyQzQxYzc': '2026-09-27', // Camboya, el CQB Maldito, Mercenarios Airsoft
  '+51 930 905 335': '2026-09-27', // Arena Airsoft, límite 400fps
}
