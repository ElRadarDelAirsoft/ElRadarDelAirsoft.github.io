// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  'aHR0cHM6Ly9mb3Jtcy5nbGUva3QyMnp2YlVOREZ5aGh5eDc': '2026-11-22', // Combat Zone Airsoft, Akito (9am)
  'aHR0cHM6Ly9mb3Jtcy5nbGUvMmZTdWc1WmtBOFpuRDVBbjg': '2026-11-28', // Operación Bad Boys 2.0, Samurai Tactical Team, Vivero de Chimbote (28 nov)
}
