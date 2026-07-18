import { InstagramIcon, TiktokIcon } from './Icons.jsx'

const COMUNIDAD_INSTAGRAM = 'https://www.instagram.com/elradardelairsoft/'
const COMUNIDAD_TIKTOK = 'https://www.tiktok.com/@elradardelairsoft'

const columnTitle =
  'text-accent font-display font-semibold uppercase tracking-widest text-xs mb-3'

const ctaButton =
  'inline-flex items-center gap-2 text-base sm:text-lg font-bold px-8 py-4 rounded-sm bg-accent text-black ' +
  'hover:bg-accent-dim transition-[background-color,color,transform] duration-150 ease-out-quart ' +
  'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ' +
  'dark:focus-visible:ring-offset-base-900'

const bannerSocialBtn =
  'inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent text-black ' +
  'hover:bg-accent-dim transition-[background-color,transform] duration-150 ease-out-quart active:scale-90 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:bg-black dark:border-base-700">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-600 dark:text-slate-400">
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
          <p>Última actualización: {__LAST_DEPLOY_DATE__}</p>
        </div>

        <div>
          <h3 className={columnTitle}>¿Quieres sumar info o falta algo?</h3>
          <p className="text-xs sm:text-sm mb-3">
            Cuéntanos si falta una cancha, tienda, grupo o si encontraste un dato desactualizado.
          </p>
          <a href="https://forms.gle/zii1J6sbrNpeDjEK7" target="_blank" rel="noopener noreferrer" className={ctaButton}>
            Aporta
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
        <div className="flex items-center gap-6">
          <a
            href={COMUNIDAD_INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram comunidad"
            className={bannerSocialBtn}
          >
            <InstagramIcon aria-hidden="true" className="w-8 h-8 sm:w-10 sm:h-10" />
          </a>
          <a
            href={COMUNIDAD_TIKTOK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok comunidad"
            className={bannerSocialBtn}
          >
            <TiktokIcon aria-hidden="true" className="w-8 h-8 sm:w-10 sm:h-10" />
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
