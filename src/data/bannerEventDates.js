// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZm9ybXMvZC9lLzFGQUlwUUxTZmpsT3VDWVI2R216eDduZmdOMVU0WTlMUS1DazBlUGt5ZGxKRTR1ZnhjVTJHUGZBL3ZpZXdmb3Jt': '2026-09-19', // Partidas de Airsoft en la Fábrica (4 partidas: 19-20-26-27 set)
  'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZm9ybXMvZC9lLzFGQUlwUUxTZkZhTWFDcUNuTUh1a1ZDSVJoR1MwTE44Z2V0UDRTNGtoTW9uWThGaHZKQndiaW53L3ZpZXdmb3JtIzIwLXNldA': '2026-09-20', // Partidas de Airsoft en la Fábrica (mismo cartel, link 20 set)
  'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZm9ybXMvZC9lLzFGQUlwUUxTZkZhTWFDcUNuTUh1a1ZDSVJoR1MwTE44Z2V0UDRTNGtoTW9uWThGaHZKQndiaW53L3ZpZXdmb3Jt': '2026-09-20', // Fuerte Azovstal, Battlefield 6
  'aHR0cHM6Ly9mb3Jtcy5nbGUvSkw1Z0hMU1FQNXc0VTJndDY': '2026-09-20', // Partida Abierta Airsoft, CQB Lab Punta Hermosa
}
