// Datos estructurados de cada cartel del banner (clave = nombre de archivo
// compilado en src/assets/banner/, igual que bannerEventDates.js). Los usa
// scripts/prerender.mjs para generar la página indexable /eventos/ (con
// markup schema.org/Event) y Banner.jsx para el texto alternativo del cartel.
//
// Campos: nombre (evento), organizador, lugar (cancha o sitio), ciudad,
// hora ("HH:MM" en 24 h; "" si el cartel no la indica). La fecha vive en
// bannerEventDates.js. Si un cartel no tiene entrada acá, sigue saliendo en
// el banner pero no aparece en /eventos/.
export const eventInfo = {
  'aHR0cHM6Ly9mb3Jtcy5nbGUva3QyMnp2YlVOREZ5aGh5eDc': { nombre: 'Combat Zone Airsoft', organizador: 'Akito Airsoft', lugar: 'La Estrella', ciudad: 'Lima', hora: '09:00' },
  'aHR0cHM6Ly9hcHAuYXJlbmFhaXJzb2Z0cGVydS5jb20': { nombre: 'Partida Arena Airsoft', organizador: 'Arena Airsoft', lugar: 'Arena Airsoft', ciudad: 'Callao', hora: '09:00' },
  'aHR0cHM6Ly9mb3Jtcy5nbGUvMmZTdWc1WmtBOFpuRDVBbjg': { nombre: 'Operación Bad Boys 2.0', organizador: 'Samurai Tactical Team', lugar: 'Vivero de Chimbote', ciudad: 'Chimbote', hora: '' },
}
