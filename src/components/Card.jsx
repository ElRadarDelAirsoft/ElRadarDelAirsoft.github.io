import { useState } from 'react'
import ContactBadge from './ContactBadge.jsx'
import SocialIcons from './SocialIcons.jsx'
import { WhatsAppIcon, LinkIcon } from './Icons.jsx'
import { categoryConfig } from '../data/categoryConfig.js'

// Card genérica: recibe el item crudo del JSON + a qué categoría pertenece,
// lo normaliza vía categoryConfig y renderiza un layout consistente para
// cualquiera de las 9 categorías.
export default function Card({ item, categoryKey }) {
  const [imgError, setImgError] = useState(false)
  const config = categoryConfig[categoryKey]
  const data = config.normalize(item)

  const showImage = data.imagen && !imgError

  return (
    <article className="group flex flex-col rounded-sm overflow-hidden bg-white border border-slate-200 transition-colors hover:border-accent dark:bg-base-900 dark:border-base-700">
      <div className="relative h-40 w-full overflow-hidden bg-base-950 flex items-center justify-center">
        {showImage ? (
          <img
            src={data.imagen}
            alt={data.nombre}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="text-4xl opacity-80">{config.emoji}</span>
        )}
        {data.badge && (
          <span className="absolute top-2 right-2 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm bg-black/80 text-accent ring-1 ring-accent/40">
            {data.badge}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-black/70 backdrop-blur-sm">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">
            {config.emoji} {config.label}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 p-4 flex-1">
        <h3 className="font-display font-semibold uppercase tracking-wide text-lg leading-snug text-base-950 dark:text-white">
          {data.nombre}
        </h3>

        {data.descripcion && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{data.descripcion}</p>
        )}

        {data.extra.length > 0 && (
          <ul className="flex flex-col gap-1">
            {data.extra.map((row, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <row.icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{row.text}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-1.5 mt-1">
          <ContactBadge type="address" value={data.direccion?.texto} mapsQuery={data.direccion?.mapsQuery} />
          <ContactBadge type="phone" value={data.telefono} />
          <ContactBadge type="email" value={data.email} />
          <ContactBadge type="web" value={data.web} />
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2 flex-wrap">
          <SocialIcons {...data.socials} />

          <div className="flex items-center gap-2 ml-auto">
            {data.cta && (
              <a
                href={data.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-sm border border-accent text-accent-dim hover:bg-accent hover:text-black transition-colors dark:text-accent"
              >
                <LinkIcon className="w-3.5 h-3.5" /> {data.cta.label}
              </a>
            )}
            {data.whatsapp && (
              <a
                href={data.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-sm bg-green-600 text-white hover:bg-green-500 transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" /> {data.whatsapp.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
