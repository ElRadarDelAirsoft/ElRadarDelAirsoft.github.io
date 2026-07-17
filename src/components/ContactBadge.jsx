import { PhoneIcon, MailIcon, GlobeIcon, MapPinIcon } from './Icons.jsx'

// Filas de ancho completo (no chips envueltos) para que todas midan lo
// mismo sin importar cuánto texto tenga cada una.
const baseClasses =
  'flex w-full items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-sm border ' +
  'bg-slate-100 border-slate-200 text-slate-700 hover:border-accent hover:text-base-950 ' +
  'transition-[background-color,color,border-color,transform] duration-200 ease-out-quart active:scale-[0.97] ' +
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 ' +
  'dark:bg-base-800 dark:border-base-700 dark:text-slate-300 dark:hover:border-accent dark:hover:text-white dark:focus-visible:ring-offset-base-900'

// Badge estático (no clicable) para mostrar la dirección sin enlazar a
// Google Maps, así nadie sale de la página sin querer.
const staticClasses =
  'flex w-full items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-sm border ' +
  'bg-slate-100 border-slate-200 text-slate-700 ' +
  'dark:bg-base-800 dark:border-base-700 dark:text-slate-300'

// Badge genérico de contacto (teléfono / email / web / dirección).
// Teléfono/email/web son clicables; la dirección es texto plano (sin salir a Maps).
export default function ContactBadge({ type, value }) {
  if (!value) return null

  switch (type) {
    case 'phone':
      return (
        <a href={`tel:${value.replace(/[^\d+]/g, '')}`} className={baseClasses}>
          <PhoneIcon aria-hidden="true" className="w-4 h-4 shrink-0" /> <span className="truncate min-w-0">{value}</span>
        </a>
      )
    case 'email':
      return (
        <a href={`mailto:${value}`} className={baseClasses}>
          <MailIcon aria-hidden="true" className="w-4 h-4 shrink-0" /> <span className="truncate min-w-0">{value}</span>
        </a>
      )
    case 'web': {
      const href = value.startsWith('http') ? value : `https://${value}`
      // Solo el dominio (sin ruta ni parámetros de tracking) para que
      // links largos de terceros no rompan el ancho del badge.
      let displayText = value.replace(/^https?:\/\//, '')
      try {
        displayText = new URL(href).hostname.replace(/^www\./, '')
      } catch {
        // valor no parseable como URL: se muestra tal cual, truncado
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
          <GlobeIcon aria-hidden="true" className="w-4 h-4 shrink-0" /> <span className="truncate min-w-0">{displayText}</span>
        </a>
      )
    }
    case 'address':
      return (
        <span className={staticClasses}>
          <MapPinIcon aria-hidden="true" className="w-4 h-4 shrink-0" /> <span className="truncate min-w-0">{value}</span>
        </span>
      )
    default:
      return null
  }
}
