import { categoryConfig, categoryKeys } from '../data/categoryConfig.js'

const itemBase =
  'flex items-center justify-between gap-2 px-3 py-2.5 rounded-sm text-xs font-semibold min-w-0 ' +
  'uppercase tracking-wider border transition-[background-color,color,border-color,transform] duration-200 ease-out-quart text-left ' +
  'active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-base-900'

const itemActive = 'bg-accent text-black border-accent'
const itemInactive =
  'bg-slate-50 border-slate-200 text-slate-600 hover:border-accent hover:text-base-950 ' +
  'dark:bg-base-900 dark:border-base-700 dark:text-slate-300 dark:hover:border-accent dark:hover:text-white'

// Versión vertical de CategoryTabs, para la barra lateral en desktop.
// "todo" es un valor especial que muestra las 9 categorías a la vez.
export default function CategorySidebar({ active, onChange, counts }) {
  return (
    <nav aria-label="Categorías" className="flex flex-col gap-1.5">
      {categoryKeys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-current={active === key ? 'true' : undefined}
          className={`${itemBase} ${active === key ? itemActive : itemInactive}`}
        >
          <span className="truncate">{categoryConfig[key].emoji} {categoryConfig[key].label}</span>
          {typeof counts?.[key] === 'number' && (
            <span className="opacity-70 shrink-0">{counts[key]}</span>
          )}
        </button>
      ))}
    </nav>
  )
}
