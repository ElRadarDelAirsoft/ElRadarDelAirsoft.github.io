import { PhoneIcon, MailIcon, GlobeIcon, MapPinIcon } from './Icons.jsx'
import { mapsLinkFromAddress } from '../utils/whatsapp.js'

const baseClasses =
  'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border ' +
  'bg-slate-100 border-slate-200 text-slate-700 hover:border-neon-blue/60 hover:text-base-900 transition-colors ' +
  'dark:bg-base-700/50 dark:border-base-600/60 dark:text-slate-200 dark:hover:border-neon-blue/60 dark:hover:text-white'

// Badge genérico de contacto (teléfono / email / web / dirección → maps).
// Cada variante es clicable y abre en una nueva pestaña cuando corresponde.
export default function ContactBadge({ type, value, mapsQuery }) {
  if (!value) return null

  switch (type) {
    case 'phone':
      return (
        <a href={`tel:${value.replace(/[^\d+]/g, '')}`} className={baseClasses}>
          <PhoneIcon /> {value}
        </a>
      )
    case 'email':
      return (
        <a href={`mailto:${value}`} className={baseClasses}>
          <MailIcon /> {value}
        </a>
      )
    case 'web': {
      const href = value.startsWith('http') ? value : `https://${value}`
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
          <GlobeIcon /> {value.replace(/^https?:\/\//, '')}
        </a>
      )
    }
    case 'address':
      return (
        <a
          href={mapsLinkFromAddress(mapsQuery || value)}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
        >
          <MapPinIcon /> <span className="line-clamp-2 text-left">{value}</span>
        </a>
      )
    default:
      return null
  }
}
