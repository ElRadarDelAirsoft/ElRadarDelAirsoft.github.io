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
    <article className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-glow hover:border-neon-blue/40 dark:bg-base-800 dark:border-base-600/60">
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-base-800 via-base-900 to-base-950 flex items-center justify-center">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(0,217,255,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(57,255,20,0.25),transparent_55%)]" />
        {showImage ? (
          <img
            src={data.imagen}
            alt={data.nombre}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="relative h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
          />
        ) : (
          <span className="relative text-4xl drop-shadow-[0_0_12px_rgba(0,217,255,0.5)]">{config.emoji}</span>
        )}
        <span className="absolute top-2 left-2 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-black/70 text-neon-green backdrop-blur-sm ring-1 ring-white/10">
          {config.emoji} {config.label}
        </span>
        {data.badge && (
          <span className="absolute top-2 right-2 text-[11px] font-bold px-2 py-1 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-base-950">
            {data.badge}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2.5 p-4 flex-1">
        <h3 className="font-display font-bold text-lg leading-snug text-base-900 dark:text-white">
          {data.nombre}
        </h3>

        {data.descripcion && (
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{data.descripcion}</p>
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
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-base-950 transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5" /> {data.cta.label}
              </a>
            )}
            {data.whatsapp && (
              <a
                href={data.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white shadow-sm hover:shadow-[0_0_16px_-2px_rgba(34,197,94,0.6)] hover:from-green-500 hover:to-green-400 transition-all"
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
