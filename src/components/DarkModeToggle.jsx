import { SunIcon, MoonIcon } from './Icons.jsx'

export default function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="inline-flex items-center justify-center w-9 h-9 rounded-sm border transition-colors
        bg-slate-100 border-slate-200 text-slate-700 hover:border-accent hover:text-accent
        dark:bg-base-900 dark:border-base-700 dark:text-accent dark:hover:border-accent"
    >
      {isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
    </button>
  )
}
