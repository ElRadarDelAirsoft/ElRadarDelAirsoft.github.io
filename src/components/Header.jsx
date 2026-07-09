import SearchBar from './SearchBar.jsx'
import DarkModeToggle from './DarkModeToggle.jsx'

export default function Header({ search, onSearchChange, isDark, onToggleDark }) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 dark:bg-base-950/90 dark:border-base-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display font-extrabold text-xl sm:text-2xl leading-tight text-base-900 dark:text-white">
              🪖 Airsoft <span className="text-neon-green">Perú</span>
              <span className="hidden sm:inline"> · Biblioteca</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
              Todo lo que necesitas de la comunidad: canchas, tiendas, grupos, eventos y más.
            </p>
          </div>
          <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
        </div>
        <SearchBar value={search} onChange={onSearchChange} />
      </div>
    </header>
  )
}
