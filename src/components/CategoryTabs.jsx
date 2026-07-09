import { categoryConfig, categoryKeys } from '../data/categoryConfig.js'

const pillBase =
  'shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-bold ' +
  'border transition-all whitespace-nowrap'

const pillActive =
  'bg-gradient-to-r from-neon-green to-neon-blue text-base-950 border-transparent shadow-glow-sm'
const pillInactive =
  'glass text-slate-600 hover:border-neon-blue/60 hover:text-base-900 ' +
  'dark:text-slate-300 dark:hover:text-white'

// Barra de tabs horizontal (scrollable en mobile) para filtrar por categoría.
// "todo" es un valor especial que muestra las 9 categorías a la vez.
export default function CategoryTabs({ active, onChange, counts }) {
  return (
    <nav
      aria-label="Categorías"
      className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
    >
      <button
        type="button"
        onClick={() => onChange('todo')}
        className={`${pillBase} ${active === 'todo' ? pillActive : pillInactive}`}
      >
        ⭐ Ver todo
      </button>
      {categoryKeys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`${pillBase} ${active === key ? pillActive : pillInactive}`}
        >
          {categoryConfig[key].emoji} {categoryConfig[key].label}
          {typeof counts?.[key] === 'number' && (
            <span className="text-xs opacity-70">({counts[key]})</span>
          )}
        </button>
      ))}
    </nav>
  )
}
