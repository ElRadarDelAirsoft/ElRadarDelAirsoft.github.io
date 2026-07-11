import { forwardRef } from 'react'
import SearchBar from './SearchBar.jsx'
import DarkModeToggle from './DarkModeToggle.jsx'

const Header = forwardRef(function Header({ search, onSearchChange, isDark, onToggleDark, stats }, ref) {
  return (
    <header ref={ref} className="sticky top-0 z-20 border-b border-slate-200 bg-[#f8f9fd]">
      <div className="h-[3px] w-full bg-accent" />
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2.5">
        <h1 className="sr-only">El Radar del Airsoft - Perú</h1>
        <div className="flex items-center justify-between gap-3">
          <img
            src="/images/logo-radar-airsoft.png"
            alt="El Radar del Airsoft"
            className="h-14 sm:h-20 md:h-24 w-auto object-contain shrink-0"
          />
          <div className="flex items-center gap-2 flex-1 min-w-0 max-w-xs justify-end">
            <SearchBar value={search} onChange={onSearchChange} />
            <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
          </div>
        </div>
        {stats && (
          <p className="text-xs sm:text-sm text-left uppercase tracking-wider text-slate-500">
            {stats.canchas} campos · {stats.tiendas} tiendas · {stats.equipos} equipos — el directorio nacional de airsoft del Perú
          </p>
        )}
      </div>
    </header>
  )
})

export default Header
