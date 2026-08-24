// Fecha del evento de cada cartel del banner (ver src/data/bannerImages.js),
// para ordenar el carrusel del más próximo al más lejano. Se actualiza a mano
// cada vez que se sube o cambia un cartel; los que no tengan fecha registrada
// quedan al final.
//
// Separado de bannerImages.js para que scripts/prerender.mjs (Node plano,
// sin Vite) pueda importar las fechas sin tocar import.meta.glob, que solo
// existe dentro del build de Vite.
export const eventDates = {
  'aHR0cHM6Ly9mb3Jtcy5nbGUvWmhxTHdBeDJxWldWb2txRjk': '2026-08-27', // Combat Zone Airsoft (Akito), partida nocturna, Campo La Estrella
  'aHR0cHM6Ly9mb3Jtcy5nbGUvd2NMY1Y3SlpnZlJLZmpvSjY': '2026-08-30', // Arena Airsoft, aniversario Pretorianos (inscripción por formulario)
  '+51913259 530': '2026-09-04', // El Último Recurso, Pampas
  'aHR0cHM6Ly9mb3Jtcy5nbGUvVkhqbnJIZjlpcExqUm5xVDk': '2026-09-13', // 20 años de Airsoft en el Perú, Fundo Mamacona
}
