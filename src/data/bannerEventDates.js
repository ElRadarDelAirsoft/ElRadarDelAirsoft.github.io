// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  '+51 913 259 530': '2026-08-16', // OP Blacklist, CBL Lab Sherwood
  '+51 943 446 795': '2026-08-16', // Partida Airsoft, CBL Lab Punta Hermosa
  '+51 994 016 209': '2026-08-16', // Airsoft Battle Rambo Perú, Comas-Trapiche
  '+51 996 928 899': '2026-08-16', // Partida Abierta
  '+51 990 346 281': '2026-08-16', // Batalla por Camboya, Mercenarios Airsoft
  '+51 995 964 444': '2026-08-30', // Arena Airsoft, aniversario Pretorianos
  '+51913259 530': '2026-09-04', // El Último Recurso, Pampas
}
