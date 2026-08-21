// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  '+51 943 446 795': '2026-08-23', // Partida Airsoft, CQB Lab Punta Hermosa
  '+51 930 905 335': '2026-08-23', // Partida Abierta, límite 400fps
  '+51 995 292 571': '2026-08-23', // Combat Zone Airsoft (Akito), Campo La Estrella
  '+51 995 964 444': '2026-08-30', // Arena Airsoft, aniversario Pretorianos
  '+51913259 530': '2026-09-04', // El Último Recurso, Pampas
}
