import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CategoryTabs from './components/CategoryTabs.jsx'
import CategoryGrid from './components/CategoryGrid.jsx'
import RegionFilter, { matchesRegion } from './components/RegionFilter.jsx'
import { useAirsoftData } from './hooks/useAirsoftData.js'
import { categoryKeys, getSearchableText } from './data/categoryConfig.js'

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('airsoft-dark-mode')
    if (stored !== null) return stored === 'true'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('airsoft-dark-mode', String(isDark))
  }, [isDark])

  return [isDark, () => setIsDark((d) => !d)]
}

export default function App() {
  const { data, error, loading } = useAirsoftData()
  const [isDark, toggleDark] = useDarkMode()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('todo')
  const [regionFilter, setRegionFilter] = useState('todos')

  // Altura real del header (varía por breakpoint/contenido) para que la
  // barra de categorías se pegue justo debajo, sin taparlo ni dejar hueco.
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return
    const update = () => setHeaderHeight(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const counts = useMemo(() => {
    if (!data) return {}
    const q = search.trim().toLowerCase()
    return categoryKeys.reduce((acc, key) => {
      const items = data[key] || []
      acc[key] = q ? items.filter((it) => getSearchableText(it).includes(q)).length : items.length
      return acc
    }, {})
  }, [data, search])

  const groups = useMemo(() => {
    if (!data) return []
    const q = search.trim().toLowerCase()
    const keysToShow = activeCategory === 'todo' ? categoryKeys : [activeCategory]
    return keysToShow.map((key) => {
      let items = data[key] || []
      if (key === 'canchas') {
        items = items.filter((it) => matchesRegion(it.departamento, regionFilter))
      }
      const filtered = q ? items.filter((it) => getSearchableText(it).includes(q)) : items
      return { key, items: filtered }
    })
  }, [data, search, activeCategory, regionFilter])

  return (
    <div className="min-h-screen flex flex-col">
      <Header ref={headerRef} search={search} onSearchChange={setSearch} isDark={isDark} onToggleDark={toggleDark} />

      <div
        className="sticky z-10 bg-white dark:bg-black border-b border-slate-200 dark:border-base-700"
        style={{ top: headerHeight }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} counts={counts} />
          {activeCategory === 'canchas' && (
            <RegionFilter value={regionFilter} onChange={setRegionFilter} />
          )}
        </div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
        {loading && (
          <p className="text-center py-16 text-slate-500 dark:text-slate-400">Cargando biblioteca...</p>
        )}

        {error && (
          <p className="text-center py-16 text-red-500">
            Error al cargar los datos: {error}
          </p>
        )}

        {!loading && !error && (
          <CategoryGrid
            groups={groups}
            showHeaders={activeCategory === 'todo'}
            emptyMessage="No se encontraron resultados para tu búsqueda."
          />
        )}
      </main>

      <Footer ultimaActualizacion={data?._ultima_actualizacion} />
    </div>
  )
}
