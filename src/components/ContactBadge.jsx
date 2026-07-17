import { PhoneIcon, MailIcon, GlobeIcon, MapPinIcon } from './Icons.jsx'
import { mapsLinkFromAddress } from '../utils/whatsapp.js'

const baseClasses =
  'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-sm border ' +
  'bg-slate-100 border-slate-200 text-slate-700 hover:border-accent hover:text-base-950 ' +
  'transition-[background-color,color,border-color,transform] duration-200 ease-out-quart active:scale-[0.97] ' +
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 ' +
  'dark:bg-base-800 dark:border-base-700 dark:text-slate-300 dark:hover:border-accent dark:hover:text-white dark:focus-visible:ring-offset-base-900'

// Badge genérico de contacto (teléfono / email / web / dirección → maps).
// Cada variante es clicable y abre en una nueva pestaña cuando corresponde.
export default function ContactBadge({ type, value, mapsQuery }) {
  if (!value) return null

  switch (type) {
    case 'phone':
      return (
        <a href={`tel:${value.replace(/[^\d+]/g, '')}`} className={baseClasses}>
          <PhoneIcon aria-hidden="true" /> {value}
        </a>
      )
    case 'email':
      return (
        <a href={`mailto:${value}`} className={baseClasses}>
          <MailIcon aria-hidden="true" /> {value}
        </a>
      )
    case 'web': {
      const href = value.startsWith('http') ? value : `https://${value}`
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
          <GlobeIcon aria-hidden="true" /> {value.replace(/^https?:\/\//, '')}
        </a>
      )
    }
    case 'address':
      return (
        <a
          href={mapsLinkFromAddress(mapsQuery || value)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClasses} min-w-0`}
        >
          <MapPinIcon aria-hidden="true" className="shrink-0" /> <span className="line-clamp-2 text-left min-w-0">{value}</span>
        </a>
      )
    default:
      return null
  }
}
