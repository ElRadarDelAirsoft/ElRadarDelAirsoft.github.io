// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  '+51 998 318 610': '2026-07-30', // Partida Nocturna, CQB La Molina
  '+51 996 668 504': '2026-08-02', // Gulag Lima
  '+51 936 371 606': '2026-08-02', // Partida Abierta
  '+51 995 964 444': '2026-08-30', // Arena Airsoft, aniversario Pretorianos
}
