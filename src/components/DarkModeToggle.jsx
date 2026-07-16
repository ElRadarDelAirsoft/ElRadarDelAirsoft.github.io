import { SunIcon, MoonIcon } from './Icons.jsx'

export default function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-sm border overflow-hidden
        transition-[background-color,border-color,transform] duration-200 ease-out-quart active:scale-[0.92]
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2
        bg-slate-100 border-slate-200 text-slate-700 hover:border-accent hover:text-accent
        dark:bg-base-900 dark:border-base-700 dark:text-accent dark:hover:border-accent dark:focus-visible:ring-offset-base-900"
    >
      <SunIcon
        className={`w-4 h-4 absolute transition-[opacity,transform] duration-300 ease-out-quart ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-50'
        }`}
      />
      <MoonIcon
        className={`w-4 h-4 absolute transition-[opacity,transform] duration-300 ease-out-quart ${
          isDark ? 'opacity-0 rotate-45 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      />
    </button>
  )
}
