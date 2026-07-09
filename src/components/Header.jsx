import SearchBar from './SearchBar.jsx'
import DarkModeToggle from './DarkModeToggle.jsx'

export default function Header({ search, onSearchChange, isDark, onToggleDark }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-base-700 dark:bg-black/95">
      <div className="h-[2px] w-full bg-accent" />
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3.5">
        <h1 className="sr-only">El Radar del Airsoft - Perú</h1>
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-sm bg-white p-1">
            <img
              src="/images/logo-radar-airsoft.png"
              alt="El Radar del Airsoft"
              className="h-16 sm:h-24 md:h-28 w-auto max-w-full object-contain"
            />
          </div>
          <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
        </div>
        <p className="text-xs sm:text-sm text-left uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Canchas · Tiendas · Grupos · Eventos · y más
        </p>
        <SearchBar value={search} onChange={onSearchChange} />
      </div>
    </header>
  )
}
