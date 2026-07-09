import { SunIcon, MoonIcon } from './Icons.jsx'

export default function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors
        bg-slate-100 border-slate-200 text-slate-700 hover:border-neon-blue/60
        dark:bg-base-700/50 dark:border-base-600/60 dark:text-neon-green dark:hover:border-neon-green/60"
    >
      {isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
    </button>
  )
}
