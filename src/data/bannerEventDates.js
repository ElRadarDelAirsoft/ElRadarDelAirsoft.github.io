// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  '+51998 318 610': '2026-08-27', // Partida Nocturna, CQB La Molina
  '+51 998 318 610': '2026-08-30', // Partida de Reconocimiento de Cancha, Padrino Airsoft, Fundo Mamacona
  'aHR0cHM6Ly9mb3Jtcy5nbGUvZVZ1NDJLREN0ZmlxS0Y0NzY': '2026-08-30', // Partida Cumpleañera, CQB Lab Punta Hermosa
  '+51913259 530': '2026-09-04', // El Último Recurso, Pampas
  'aHR0cHM6Ly9mb3Jtcy5nbGUvVkhqbnJIZjlpcExqUm5xVDk': '2026-09-13', // 20 años de Airsoft en el Perú, Fundo Mamacona
}
