import Card from './Card.jsx'
import { categoryConfig } from '../data/categoryConfig.js'

// Renderiza una o varias categorías como grids responsivos (1 col mobile, 2-3 desktop).
// groups: [{ key: 'canchas', items: [...] }, ...]
export default function CategoryGrid({ groups, showHeaders = true, emptyMessage }) {
  const hasAnyItems = groups.some((g) => g.items.length > 0)

  if (!hasAnyItems) {
    return (
      <div className="text-center py-16 text-slate-500 dark:text-slate-400 animate-fade-up">
        <p className="text-lg font-medium">{emptyMessage || 'No se encontraron resultados.'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {groups.map(({ key, items }) => {
        if (items.length === 0) return null
        const config = categoryConfig[key]
        return (
          <section key={key} aria-labelledby={`section-${key}`}>
            {showHeaders && (
              <h2
                id={`section-${key}`}
                className="flex items-center gap-2.5 text-lg font-display font-semibold uppercase tracking-wide mb-4 pb-2 border-b-2 border-accent text-base-950 dark:text-white"
              >
                <span>{config.emoji}</span>
                {config.label}
                <span className="text-sm font-normal normal-case tracking-normal text-slate-500 dark:text-slate-400">({items.length})</span>
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, idx) => (
                <Card key={item.id} item={item} categoryKey={key} index={idx} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
