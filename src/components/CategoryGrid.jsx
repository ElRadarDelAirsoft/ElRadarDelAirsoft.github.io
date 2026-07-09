import Card from './Card.jsx'
import { categoryConfig } from '../data/categoryConfig.js'

// Renderiza una o varias categorías como grids responsivos (1 col mobile, 2-3 desktop).
// groups: [{ key: 'canchas', items: [...] }, ...]
export default function CategoryGrid({ groups, showHeaders = true, emptyMessage }) {
  const hasAnyItems = groups.some((g) => g.items.length > 0)

  if (!hasAnyItems) {
    return (
      <div className="text-center py-16 text-slate-500 dark:text-slate-400">
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
                className="flex items-center gap-2 text-xl font-display font-bold mb-4 text-base-900 dark:text-white"
              >
                <span>{config.emoji}</span>
                {config.label}
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({items.length})</span>
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <Card key={item.id} item={item} categoryKey={key} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
