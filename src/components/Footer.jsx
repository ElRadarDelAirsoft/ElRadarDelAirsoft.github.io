import { InstagramIcon, TiktokIcon, LinkIcon } from './Icons.jsx'

const COMUNIDAD_INSTAGRAM = 'https://www.instagram.com/elradardelairsoft/'
const COMUNIDAD_TIKTOK = 'https://www.tiktok.com/@elradardelairsoft'

const columnTitle =
  'text-accent-dim dark:text-accent font-display font-semibold uppercase tracking-widest text-xs mb-3'

const ctaButton =
  'inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-sm bg-accent text-black ' +
  'shadow-[0_0_0_3px_rgba(95,211,236,0.25)] hover:shadow-[0_0_0_5px_rgba(95,211,236,0.35)] hover:-translate-y-0.5 hover:bg-accent-dim ' +
  'transition-[background-color,box-shadow,transform] duration-150 ease-out-quart ' +
  'active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ' +
  'dark:focus-visible:ring-offset-base-900'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:bg-black dark:border-base-700">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-600 dark:text-slate-400">
        <div>
          <h3 className={columnTitle}>Contacto, Sugerencias y Comunidad</h3>
          <div className="flex items-center gap-4 mb-3">
            <a
              href={COMUNIDAD_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram comunidad"
              className="hover:text-accent transition-[color,transform] duration-150 ease-out-quart active:scale-90
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
            >
              <InstagramIcon aria-hidden="true" className="w-8 h-8" />
            </a>
            <a
              href={COMUNIDAD_TIKTOK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok comunidad"
              className="hover:text-accent transition-[color,transform] duration-150 ease-out-quart active:scale-90
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
            >
              <TiktokIcon aria-hidden="true" className="w-8 h-8" />
            </a>
          </div>
          <p>Última actualización: {__LAST_DEPLOY_DATE__}</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <h3 className={columnTitle}>¿Quieres sumar info o falta algo?</h3>
          <p className="text-xs sm:text-sm mb-4">
            Cuéntanos si falta una cancha, tienda, grupo o si encontraste un dato desactualizado.
          </p>
          <a href="https://forms.gle/zii1J6sbrNpeDjEK7" target="_blank" rel="noopener noreferrer" className={ctaButton}>
            Aporta <LinkIcon aria-hidden="true" className="w-4 h-4" />
          </a>
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

      <div className="border-t border-slate-200 dark:border-base-700 py-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-5">
          <a
            href={COMUNIDAD_INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram comunidad"
            className="text-slate-600 dark:text-slate-300 hover:text-accent transition-[color,transform] duration-150 ease-out-quart active:scale-90
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
          >
            <InstagramIcon aria-hidden="true" className="w-6 h-6" />
          </a>
          <a
            href={COMUNIDAD_TIKTOK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok comunidad"
            className="text-slate-600 dark:text-slate-300 hover:text-accent transition-[color,transform] duration-150 ease-out-quart active:scale-90
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
          >
            <TiktokIcon aria-hidden="true" className="w-6 h-6" />
          </a>
        </div>
        <div className="text-center text-xs uppercase tracking-widest text-slate-400 dark:text-slate-600">
          El Radar del Airsoft — Perú
        </div>
        <p className="text-center text-[11px] italic text-slate-400 dark:text-slate-600 max-w-2xl px-4">
          Esta página no está afiliada a ninguna de las personas, canchas o negocios aquí mencionados y no se hace
          responsable por las interacciones que puedan suscitarse con los contactos publicados. El objetivo de la
          página es brindar información estructurada a la comunidad de manera gratuita.
        </p>
      </div>
    </footer>
  )
}
