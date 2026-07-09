import SearchBar from './SearchBar.jsx'
import DarkModeToggle from './DarkModeToggle.jsx'

export default function Header({ search, onSearchChange, isDark, onToggleDark }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-base-600/60 dark:bg-base-950/80">
      <div className="h-[3px] w-full bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple" />
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 rounded-lg bg-white p-1 shadow-sm">
              <img
                src="/images/logo-airsoft-peru.png"
                alt="Airsoft Perú"
                className="h-9 sm:h-11 w-auto aspect-[1.3] object-cover object-left rounded"
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-extrabold text-xl sm:text-2xl leading-tight tracking-tight">
                <span className="hidden sm:inline text-base-900 dark:text-white">El </span>
                <span className="text-gradient">Radar</span>
                <span className="text-base-900 dark:text-white"> del Airsoft</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                Todo lo que necesitas de la comunidad: canchas, tiendas, grupos, eventos y más.
              </p>
            </div>
          </div>
          <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
        </div>
        <SearchBar value={search} onChange={onSearchChange} />
      </div>
    </header>
  )
}
