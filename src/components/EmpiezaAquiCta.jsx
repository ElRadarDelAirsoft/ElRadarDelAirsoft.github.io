import { CompassIcon } from './Icons.jsx'

// Banner de entrada para jugadores nuevos, hacia la página estática
// /empieza-aqui/ generada por scripts/prerender.mjs (mismo patrón que el
// resto de páginas de detalle: <a> normal, sin routing de React).
export default function EmpiezaAquiCta() {
  return (
    <a
      href="/empieza-aqui/"
      className="block bg-accent text-black hover:bg-accent-dim transition-colors duration-150 ease-out-quart"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-2.5 text-center">
        <CompassIcon aria-hidden="true" className="w-5 h-5 shrink-0" />
        <span className="font-display font-semibold uppercase tracking-wide text-sm">
          ¿Es tu primera vez? — Empieza aquí
        </span>
      </div>
    </a>
  )
}
