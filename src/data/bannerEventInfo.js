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
  'aHR0cHM6Ly9mb3Jtcy5nbGUvMmZTdWc1WmtBOFpuRDVBbjg': { nombre: 'Operación Bad Boys 2.0', organizador: 'Samurai Tactical Team', lugar: 'Vivero de Chimbote', ciudad: 'Chimbote', hora: '' },
  'aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZm9ybXMvZC9lLzFGQUlwUUxTZVBTR1ZVT2pNQ0I3S0tSM3lsOEFyX0o3Q0tHcVlxV2gzNXNyTUdQeHZRWndfczd3L3ZpZXdmb3JtP3VzcD1kaWFsb2c': { nombre: 'Age of Jackass VIII Special Edition', organizador: 'Jackass Airsoft Team', lugar: 'La Estrella', ciudad: 'Lima', hora: '09:00' },
}
