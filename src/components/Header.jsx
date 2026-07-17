import { forwardRef } from 'react'
import SearchBar from './SearchBar.jsx'
import DarkModeToggle from './DarkModeToggle.jsx'

const Header = forwardRef(function Header({ search, onSearchChange, isDark, onToggleDark, onLogoClick }, ref) {
  return (
    <header
      ref={ref}
      className="sticky top-0 z-20 border-b border-black/40 bg-[#232b1c] bg-[url('/images/camo-tiger-stripe.webp')] bg-cover bg-center"
    >
      <div className="h-[3px] w-full bg-accent" />
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <h1 className="sr-only">El Radar del Airsoft - Perú</h1>
        <button
          type="button"
          onClick={onLogoClick}
          className="shrink-0 rounded-sm bg-[#f8f9fd] px-2.5 py-1.5 shadow-md transition-transform duration-150 ease-out-quart active:scale-95
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label="Ir al inicio"
        >
          <img
            src="/images/logo-radar-airsoft.webp"
            alt="El Radar del Airsoft"
            width="564"
            height="700"
            fetchpriority="high"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain"
          />
        </button>
        <div className="flex flex-col items-end gap-1.5 flex-1 min-w-0 max-w-xs">
          <span className="text-xs font-bold uppercase tracking-wide text-white text-right rounded-sm bg-black/55 backdrop-blur-sm px-2 py-1">
            Todo lo que necesitas del Airsoft en el Perú aquí
          </span>
          <div className="flex items-center gap-2 w-full">
            <SearchBar value={search} onChange={onSearchChange} />
            <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
          </div>
        </div>
      </div>
    </header>
  )
})

export default Header
