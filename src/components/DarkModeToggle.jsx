import { SunIcon, MoonIcon } from './Icons.jsx'

export default function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full
        bg-slate-200/70 text-slate-700 hover:bg-slate-300 transition-colors
        dark:bg-base-700/60 dark:text-neon-green dark:hover:bg-base-700"
    >
      {isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
    </button>
  )
}
