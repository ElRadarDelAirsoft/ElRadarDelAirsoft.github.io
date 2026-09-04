// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  '+51 998 318 610': '2026-09-03', // Partida Nocturna de Airsoft, CQB La Molina
  '+51913259 530': '2026-09-04', // El Último Recurso, Pampas
  'aHR0cHM6Ly9mb3Jtcy5nbGUvWXVpVmhjc2NOMnVxVFl1ZEE': '2026-09-06', // Combat Zone Airsoft (Akito), Campo La Estrella
  'aHR0cHM6Ly9mb3Jtcy5nbGUvb1NUdXg1Zjdvc2g3ZEx2WkE': '2026-09-06', // Partida de Airsoft, CQB Lab Punta Hermosa
  '+51 996 928 899': '2026-09-06', // Partida Abierta, límite 400fps
  'aHR0cHM6Ly9mb3Jtcy5nbGUvVkhqbnJIZjlpcExqUm5xVDk': '2026-09-13', // 20 años de Airsoft en el Perú, Fundo Mamacona
}
