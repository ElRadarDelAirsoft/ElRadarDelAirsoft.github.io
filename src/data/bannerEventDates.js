// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  '+51 943 446 795': '2026-10-11', // CQB Lab Punta Hermosa
  '+51 996 928 899': '2026-10-11', // Arena Airsoft (9:00am a 1:00pm)
  'aHR0cHM6Ly9mb3Jtcy5nbGUvNjJhQ0d2ZUhRM0ROeVVQTjY': '2026-10-25', // Operación Kamikaze IV, Samurai Tactical Team, CQB Lab Punta Hermosa
}
