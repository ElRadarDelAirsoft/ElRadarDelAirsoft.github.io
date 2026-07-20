import { bannerImages } from '../data/bannerImages.js'
import { whatsappLinkFromPhone } from '../utils/whatsapp.js'
import { WhatsAppIcon } from './Icons.jsx'

// "Cartelera" de carteles de eventos, tipo cine: 1 a 3 imágenes por semana,
// cada una en formato afiche (retrato) con el contacto superpuesto abajo.
// Se centra sola sin importar cuántos carteles haya (1, 2 o 3).
export default function Banner() {
  if (bannerImages.length === 0) return null

  return (
    <div className="bg-black border-b border-accent/30">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-accent text-center mb-3">
          ¡Partidas de la semana!
        </p>
        {/* overflow-x-auto en el contenedor exterior + w-fit mx-auto en el interior:
            así se centra solo cuando entra (1-2 carteles), y cuando desborda
            (3 carteles en mobile) arranca en scrollLeft 0 en vez de recortar
            el primer cartel fuera de la zona alcanzable con scroll. */}
        <div className="overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-1">
          <div className="flex gap-4 w-fit mx-auto px-1">
            {bannerImages.map((img) => {
              const waHref = whatsappLinkFromPhone(img.contacto)
              return (
                <a
                  key={img.url}
                  href={waHref || undefined}
                  target={waHref ? '_blank' : undefined}
                  rel={waHref ? 'noopener noreferrer' : undefined}
                  className="relative shrink-0 snap-center w-40 sm:w-52 md:w-60 rounded-sm overflow-hidden
                    border border-base-700 shadow-lg shadow-black/50 bg-base-900
                    transition-transform duration-200 ease-out-quart hover:scale-[1.02] active:scale-[0.98]
                    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <img
                    src={img.url}
                    alt={`Cartel de evento de airsoft — contacto ${img.contacto}`}
                    width="760"
                    height="1076"
                    className="w-full aspect-[760/1076] object-contain bg-black"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/85 backdrop-blur-sm border-t-2 border-accent px-2 py-2 flex items-center justify-center gap-1.5">
                    <WhatsAppIcon aria-hidden="true" className="w-4 h-4 shrink-0 text-accent" />
                    <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-wide text-white truncate">
                      {img.contacto}
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
