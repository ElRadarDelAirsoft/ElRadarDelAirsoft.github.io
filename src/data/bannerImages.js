// Carteles del banner: se suben como imágenes sueltas en src/assets/banner/,
// con el número de contacto como nombre de archivo (ej. "+51 994 016 209.webp").
// No hay backend, así que Vite escanea la carpeta en build time con
// import.meta.glob — no hace falta editar JSON. Banner.jsx los muestra en un
// carrusel que se adapta a cualquier cantidad de carteles.
import { eventDates } from './bannerEventDates.js'
import { isExpired } from '../utils/bannerEvents.js'

const modules = import.meta.glob('../assets/banner/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Los carteles con fecha ya pasada se ocultan en el navegador aunque el
// deploy sea viejo; /bannerweb además los borra del repo en cada corrida.
export const bannerImages = Object.entries(modules)
  .map(([path, url]) => ({
    url,
    contacto: path.split('/').pop().replace(/\.[^.]+$/, ''),
  }))
  .filter((img) => !isExpired(eventDates[img.contacto]))
  .sort((a, b) => {
    const dateA = eventDates[a.contacto] || '9999-99-99'
    const dateB = eventDates[b.contacto] || '9999-99-99'
    return dateA.localeCompare(dateB)
  })
