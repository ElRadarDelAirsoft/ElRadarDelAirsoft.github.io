import SearchBar from './SearchBar.jsx'
import DarkModeToggle from './DarkModeToggle.jsx'

export default function Header({ search, onSearchChange, isDark, onToggleDark }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="h-[3px] w-full bg-accent" />
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3.5">
        <h1 className="sr-only">El Radar del Airsoft - Perú</h1>
        <div className="flex items-start justify-between gap-3">
          <img
            src="/images/logo-radar-airsoft.png"
            alt="El Radar del Airsoft"
            className="h-16 sm:h-24 md:h-28 w-auto max-w-full object-contain"
          />
          <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
        </div>
        <p className="text-xs sm:text-sm text-left uppercase tracking-wider text-slate-500">
          Todo lo que tienes que saber del airsoft en Perú
        </p>
        <SearchBar value={search} onChange={onSearchChange} />
      </div>
    </header>
  )
}
