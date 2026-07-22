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

export const bannerImages = Object.entries(modules)
  .map(([path, url]) => ({
    url,
    contacto: path.split('/').pop().replace(/\.[^.]+$/, ''),
  }))
  .sort((a, b) => a.contacto.localeCompare(b.contacto, 'es'))
