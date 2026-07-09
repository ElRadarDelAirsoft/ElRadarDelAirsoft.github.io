import { WhatsAppIcon, MailIcon, InstagramIcon, TiktokIcon } from './Icons.jsx'

const ADMIN_EMAIL = 'admin@airsoftperu.pe'
const ADMIN_WHATSAPP = 'https://wa.me/51987654321'
const COMUNIDAD_INSTAGRAM = 'https://instagram.com/airsoftperu'
const COMUNIDAD_TIKTOK = 'https://tiktok.com/@airsoftperu'

export default function Footer({ ultimaActualizacion }) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:bg-base-950 dark:border-base-700">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-display font-bold text-base text-base-900 dark:text-white">
              ¿Falta tu negocio, cancha o grupo?
            </p>
            <p>Escríbeme y lo agrego a la biblioteca.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={ADMIN_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-500 transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md
                bg-slate-200/70 text-slate-700 hover:bg-slate-300 transition-colors
                dark:bg-base-700/60 dark:text-slate-200 dark:hover:bg-base-700"
            >
              <MailIcon className="w-3.5 h-3.5" /> {ADMIN_EMAIL}
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t border-slate-200 dark:border-base-700">
          <p>Última actualización: {ultimaActualizacion || '—'}</p>
          <div className="flex items-center gap-3">
            <a href={COMUNIDAD_INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram comunidad" className="hover:text-neon-blue">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href={COMUNIDAD_TIKTOK} target="_blank" rel="noopener noreferrer" aria-label="TikTok comunidad" className="hover:text-neon-blue">
              <TiktokIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
