// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  '+51 954 150 336': '2026-11-08', // Partida Arena Airsoft (9:00am a 1:00pm)
  'aHR0cHM6Ly9mb3Jtcy5nbGUvQVlEcXBaQmZ2a0JOc0poWDk': '2026-11-08', // Samurai Tactical, CQB Lab Punta Hermosa (9am)
  'aHR0cHM6Ly9mb3Jtcy5nbGUvZFJZM3FMRzJBSlZOTGVaeTU': '2026-11-08', // Combat Zone Airsoft, Akito, La Estrella (9am)
  'aHR0cHM6Ly9ncmlkc3RyaWtlLm5ldC9pbnZpdGUvY2xhaW0_dD1KOFU0UUhUWg': '2026-11-08', // Haití en Llamas II, Mercenarios Airsoft (9am, S/.25)
}
