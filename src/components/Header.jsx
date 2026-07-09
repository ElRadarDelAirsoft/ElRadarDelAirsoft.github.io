import SearchBar from './SearchBar.jsx'
import DarkModeToggle from './DarkModeToggle.jsx'

export default function Header({ search, onSearchChange, isDark, onToggleDark }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-base-600/60 dark:bg-base-950/80">
      <div className="h-[3px] w-full bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple" />
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3.5">
        <h1 className="sr-only">El Radar del Airsoft - Perú</h1>
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-xl bg-white p-1 shadow-sm">
            <img
              src="/images/logo-radar-airsoft.png"
              alt="El Radar del Airsoft"
              className="h-16 sm:h-24 md:h-28 w-auto max-w-full object-contain rounded"
            />
          </div>
          <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
        </div>
        <p className="text-xs sm:text-sm text-left text-slate-500 dark:text-slate-400">
          Todo lo que necesitas de la comunidad: canchas, tiendas, grupos, eventos y más.
        </p>
        <SearchBar value={search} onChange={onSearchChange} />
      </div>
    </header>
  )
}
