import { categoryConfig, categoryKeys } from '../data/categoryConfig.js'

const pillBase =
  'shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider ' +
  'border transition-[background-color,color,border-color,transform] duration-200 ease-out-quart whitespace-nowrap ' +
  'active:scale-[0.96] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-base-900'

const pillActive = 'bg-accent text-black border-accent'
const pillInactive =
  'bg-slate-50 border-slate-200 text-slate-600 hover:border-accent hover:text-base-950 ' +
  'dark:bg-base-900 dark:border-base-700 dark:text-slate-300 dark:hover:border-accent dark:hover:text-white'

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
        Ver todo
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
            <span className="opacity-70">({counts[key]})</span>
          )}
        </button>
      ))}
    </nav>
  )
}
