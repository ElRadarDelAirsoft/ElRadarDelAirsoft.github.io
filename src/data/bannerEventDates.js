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
  'aHR0cHM6Ly9hcHAuYXJlbmFhaXJzb2Z0cGVydS5jb20': '2026-11-22', // Partida Arena Airsoft, Callao (9am-1pm)
  'aHR0cHM6Ly9mb3Jtcy5nbGUvVEZaclQ1djVNS3NnUUxuWTk': '2026-11-22', // Cumpleaños Black Beard Coffee, CBQ Lab (9am)
  'aHR0cHM6Ly9mb3Jtcy5nbGUvMmZTdWc1WmtBOFpuRDVBbjg': '2026-11-28', // Operación Bad Boys 2.0, Samurai Tactical Team, Vivero de Chimbote (28 nov)
  'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZm9ybXMvZC9lLzFGQUlwUUxTZVBTR1ZVT2pNQ0I3S0tSM3lsOEFyX0o3Q0tHcVlxV2gzNXNyTUdQeHZRWndfczd3L3ZpZXdmb3JtP3VzcD1kaWFsb2c': '2026-11-29', // Age of Jackass VIII Special Edition, Jackass Airsoft Team, La Estrella (9am)
}
