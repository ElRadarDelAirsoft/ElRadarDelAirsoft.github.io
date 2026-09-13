// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  'aHR0cHM6Ly9mb3Jtcy5nbGUvVkhqbnJIZjlpcExqUm5xVDk': '2026-09-13', // 20 años de Airsoft en el Perú, Fundo Mamacona
  '+51 994 016 209': '2026-09-13', // Operación Mad Max, La Estrella
  'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZm9ybXMvZC9lLzFGQUlwUUxTZkZhTWFDcUNuTUh1a1ZDSVJoR1MwTE44Z2V0UDRTNGtoTW9uWThGaHZKQndiaW53L3ZpZXdmb3Jt': '2026-09-20', // Fuerte Azovstal, Battlefield 6
}
