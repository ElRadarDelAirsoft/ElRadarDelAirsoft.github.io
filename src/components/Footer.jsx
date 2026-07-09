import { WhatsAppIcon, MailIcon, InstagramIcon, TiktokIcon } from './Icons.jsx'

const ADMIN_EMAIL = 'admin@airsoftperu.pe'
const ADMIN_WHATSAPP = 'https://wa.me/51987654321'
const COMUNIDAD_INSTAGRAM = 'https://instagram.com/airsoftperu'
const COMUNIDAD_TIKTOK = 'https://tiktok.com/@airsoftperu'

const columnTitle =
  'text-accent font-display font-semibold uppercase tracking-widest text-xs mb-3'

export default function Footer({ ultimaActualizacion }) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:bg-black dark:border-base-700">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-slate-600 dark:text-slate-400">
        <div>
          <h3 className={columnTitle}>Contacto</h3>
          <p className="mb-3">¿Falta tu negocio, cancha o grupo? Escríbeme y lo agrego a la biblioteca.</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={ADMIN_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-sm bg-green-600 text-white hover:bg-green-500 transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-sm border
                bg-slate-100 border-slate-200 text-slate-700 hover:border-accent transition-colors
                dark:bg-base-900 dark:border-base-700 dark:text-slate-300 dark:hover:border-accent"
            >
              <MailIcon className="w-3.5 h-3.5" /> {ADMIN_EMAIL}
            </a>
          </div>
        </div>

        <div>
          <h3 className={columnTitle}>Comunidad</h3>
          <div className="flex items-center gap-3 mb-3">
            <a href={COMUNIDAD_INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram comunidad" className="hover:text-accent transition-colors">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href={COMUNIDAD_TIKTOK} target="_blank" rel="noopener noreferrer" aria-label="TikTok comunidad" className="hover:text-accent transition-colors">
              <TiktokIcon className="w-4 h-4" />
            </a>
          </div>
          <p>Última actualización: {ultimaActualizacion || '—'}</p>
        </div>

        <div>
          <h3 className={columnTitle}>Apoya el proyecto</h3>
          <div className="flex items-center gap-3">
            <img
              src="/images/Yape.jpg"
              alt="Código QR de Yape para donaciones"
              loading="lazy"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-sm object-cover shrink-0"
            />
            <p className="text-xs sm:text-sm">
              Si te pude ayudar con algo, se aceptan donaciones para seguir dando un buen servicio.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-base-700 py-4 text-center text-xs uppercase tracking-widest text-slate-400 dark:text-slate-600">
        El Radar del Airsoft — Perú
      </div>
    </footer>
  )
}
