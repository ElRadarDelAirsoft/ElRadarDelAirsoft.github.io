// Carteles del banner: se suben como imágenes sueltas en src/assets/banner/,
// con el número de contacto como nombre de archivo (ej. "+51 994 016 209.webp").
// No hay backend, así que Vite escanea la carpeta en build time con
// import.meta.glob — no hace falta editar JSON. Banner.jsx los muestra en un
// carrusel que se adapta a cualquier cantidad de carteles.
const modules = import.meta.glob('../assets/banner/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Fecha del evento de cada cartel, para ordenar el carrusel del más próximo
// al más lejano. Se actualiza a mano cada vez que se sube o cambia un cartel;
// los que no tengan fecha registrada quedan al final.
const eventDates = {
  '+51 998 318 610': '2026-07-30', // Partida Nocturna, CQB La Molina
  '+51 996 668 504': '2026-08-02', // Gulag Lima
  '+51 936 371 606': '2026-08-02', // Partida Abierta
  '+51 995 964 444': '2026-08-30', // Arena Airsoft, aniversario Pretorianos
}

export const bannerImages = Object.entries(modules)
  .map(([path, url]) => ({
    url,
    contacto: path.split('/').pop().replace(/\.[^.]+$/, ''),
  }))
  .sort((a, b) => {
    const dateA = eventDates[a.contacto] || '9999-99-99'
    const dateB = eventDates[b.contacto] || '9999-99-99'
    return dateA.localeCompare(dateB)
  })
