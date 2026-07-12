import { forwardRef } from 'react'
import SearchBar from './SearchBar.jsx'
import DarkModeToggle from './DarkModeToggle.jsx'

const Header = forwardRef(function Header({ search, onSearchChange, isDark, onToggleDark, onLogoClick }, ref) {
  return (
    <header ref={ref} className="sticky top-0 z-20 border-b border-slate-200 bg-[#f8f9fd]">
      <div className="h-[3px] w-full bg-accent" />
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <h1 className="sr-only">El Radar del Airsoft - Perú</h1>
        <button type="button" onClick={onLogoClick} className="shrink-0" aria-label="Ir al inicio">
          <img
            src="/images/logo-radar-airsoft.png"
            alt="El Radar del Airsoft"
            className="h-14 sm:h-16 md:h-20 w-auto object-contain"
          />
        </button>
        <div className="flex flex-col items-end gap-1 flex-1 min-w-0 max-w-xs">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
            Todo del airsoft peruano aquí
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
