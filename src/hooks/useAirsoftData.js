import airsoftData from '../../public/data/airsoft.json'

// Único punto donde se lee el contenido editable por el admin. Se importa
// (no se hace fetch) para que quede embebido en el build: sin round-trip
// de red ni flash de "cargando" en el primer render.
export function useAirsoftData() {
  return airsoftData
}
