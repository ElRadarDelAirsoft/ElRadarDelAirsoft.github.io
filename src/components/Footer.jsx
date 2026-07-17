import { InstagramIcon, TiktokIcon } from './Icons.jsx'

const COMUNIDAD_INSTAGRAM = 'https://www.instagram.com/elradardelairsoft/'
const COMUNIDAD_TIKTOK = 'https://tiktok.com/@airsoftperu'

const columnTitle =
  'text-accent font-display font-semibold uppercase tracking-widest text-xs mb-3'

export default function Footer({ ultimaActualizacion }) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:bg-black dark:border-base-700">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-slate-600 dark:text-slate-400">
        <div>
          <h3 className={columnTitle}>Contacto, Sugerencias y Comunidad</h3>
          <div className="flex items-center gap-3 mb-3">
            <a
              href={COMUNIDAD_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram comunidad"
              className="hover:text-accent transition-[color,transform] duration-150 ease-out-quart active:scale-90
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
            >
              <InstagramIcon aria-hidden="true" className="w-4 h-4" />
            </a>
            <a
              href={COMUNIDAD_TIKTOK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok comunidad"
              className="hover:text-accent transition-[color,transform] duration-150 ease-out-quart active:scale-90
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
            >
              <TiktokIcon aria-hidden="true" className="w-4 h-4" />
            </a>
          </div>
          <p>Última actualización: {ultimaActualizacion || '—'}</p>
        </div>

        <div>
          <h3 className={columnTitle}>Apoya el proyecto</h3>
          <p className="text-xs sm:text-sm mb-3">
            Si te pude ayudar con algo, se aceptan donaciones para seguir dando un buen servicio. Escanea el
            código con tu Yape:
          </p>
          <img
            src="/images/Yape.jpg"
            alt="Código QR de Yape para donaciones"
            width="508"
            height="515"
            loading="lazy"
            className="w-40 h-40 rounded-sm object-contain bg-white p-1.5"
          />
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-base-700 py-4 text-center text-xs uppercase tracking-widest text-slate-400 dark:text-slate-600">
        El Radar del Airsoft — Perú
      </div>
    </footer>
  )
}
