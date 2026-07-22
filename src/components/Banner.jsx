import { useEffect, useRef, useState } from 'react'
import { bannerImages } from '../data/bannerImages.js'
import { whatsappLinkFromPhone } from '../utils/whatsapp.js'
import { WhatsAppIcon } from './Icons.jsx'

function ChevronIcon({ direction = 'left', className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}

// "Cartelera" de carteles de eventos, tipo cine: cualquier cantidad de
// carteles, cada uno en formato afiche (retrato) con el contacto superpuesto
// abajo. Se centra sola cuando entran todos; cuando desbordan (mobile, o
// muchos carteles), se convierte en un slider con flechas y puntos.
export default function Banner() {
  const count = bannerImages.length
  const scrollerRef = useRef(null)
  const trackRef = useRef(null)
  const itemRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasOverflow, setHasOverflow] = useState(false)

  useEffect(() => {
    const scroller = scrollerRef.current
    const track = trackRef.current
    if (!scroller || !track || count === 0) return

    // Se observan AMBOS: el scroller (ancho fijo, lo da el layout) y el
    // track interno (ancho lo dan sus hijos). El scroller casi nunca cambia
    // de tamaño solo; lo que cambia es cuánto contenido tiene el track
    // adentro (imágenes/fuentes cargando), y eso no dispara ResizeObserver
    // en el propio scroller si su clientWidth se mantiene igual.
    const checkOverflow = () => setHasOverflow(scroller.scrollWidth > scroller.clientWidth + 1)
    checkOverflow()
    const ro = new ResizeObserver(checkOverflow)
    ro.observe(scroller)
    ro.observe(track)
    return () => ro.disconnect()
  }, [count])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || count <= 1) return

    // Índice activo = el cartel cuyo centro está más cerca del centro visible
    // del scroller. Más confiable que IntersectionObserver acá porque no
    // depende de que un umbral de visibilidad se cruce en el frame correcto.
    let raf = null
    const updateActiveIndex = () => {
      const scrollerRect = scroller.getBoundingClientRect()
      const scrollerCenter = scrollerRect.left + scrollerRect.width / 2
      let closest = 0
      let closestDist = Infinity
      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.left + rect.width / 2 - scrollerCenter)
        if (dist < closestDist) { closestDist = dist; closest = i }
      })
      setActiveIndex(closest)
    }
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateActiveIndex)
    }
    updateActiveIndex()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [count])

  if (count === 0) return null

  function goTo(index) {
    const clamped = Math.max(0, Math.min(count - 1, index))
    const el = itemRefs.current[clamped]
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    // No depender solo del listener de scroll para reflejar el índice activo
    // (swipe manual sí lo actualiza vía scroll; click en flecha/punto lo fija directo).
    setActiveIndex(clamped)
  }

  return (
    <div className="bg-black border-b border-accent/30">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-accent text-center mb-3">
          ¡Partidas de la semana!
        </p>

        <div className="relative">
          {hasOverflow && (
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Cartel anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full
                bg-black/80 border border-accent/50 text-white backdrop-blur-sm
                disabled:opacity-30 disabled:cursor-not-allowed
                hover:not-disabled:bg-accent hover:not-disabled:text-black transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <ChevronIcon direction="left" />
            </button>
          )}

          {/* overflow-x-auto en el contenedor exterior + w-fit mx-auto en el interior:
              así se centra solo cuando entra, y cuando desborda arranca en
              scrollLeft 0 en vez de recortar el primer cartel fuera de la
              zona alcanzable con scroll. */}
          <div ref={scrollerRef} className="overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-1 scroll-smooth">
            <div ref={trackRef} className="flex gap-4 w-fit mx-auto px-1">
              {bannerImages.map((img, i) => {
                const waHref = whatsappLinkFromPhone(img.contacto)
                return (
                  <a
                    key={img.url}
                    ref={(el) => { itemRefs.current[i] = el }}
                    href={waHref || undefined}
                    target={waHref ? '_blank' : undefined}
                    rel={waHref ? 'noopener noreferrer' : undefined}
                    className="relative shrink-0 snap-center w-48 sm:w-56 md:w-64 rounded-sm overflow-hidden
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

          {hasOverflow && (
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === count - 1}
              aria-label="Siguiente cartel"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full
                bg-black/80 border border-accent/50 text-white backdrop-blur-sm
                disabled:opacity-30 disabled:cursor-not-allowed
                hover:not-disabled:bg-accent hover:not-disabled:text-black transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <ChevronIcon direction="right" />
            </button>
          )}
        </div>

        {hasOverflow && (
          <div className="flex items-center justify-center gap-2 mt-3" role="tablist" aria-label="Seleccionar cartel">
            {bannerImages.map((img, i) => (
              <button
                key={img.url}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Ver cartel ${i + 1} de ${count}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-sm transition-all duration-200 ease-out-quart
                  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black
                  ${i === activeIndex ? 'w-5 bg-accent' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
