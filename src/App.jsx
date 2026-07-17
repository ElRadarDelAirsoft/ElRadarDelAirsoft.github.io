import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CategoryTabs from './components/CategoryTabs.jsx'
import CategorySidebar from './components/CategorySidebar.jsx'
import CategoryGrid from './components/CategoryGrid.jsx'
import RegionFilter, { matchesRegion } from './components/RegionFilter.jsx'
import { useAirsoftData } from './hooks/useAirsoftData.js'
import { categoryConfig, categoryKeys, getSearchableText } from './data/categoryConfig.js'

const VALID_REGIONS = ['todos', 'lima', 'provincias']

function readFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const categoria = params.get('categoria')
  const region = params.get('region')
  return {
    search: params.get('q') || '',
    activeCategory: categoria && categoryKeys.includes(categoria) ? categoria : 'todo',
    regionFilter: region && VALID_REGIONS.includes(region) ? region : 'todos',
  }
}

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
  const [{ search, activeCategory, regionFilter }, setFilters] = useState(readFiltersFromUrl)

  const setSearch = (value) => setFilters((f) => ({ ...f, search: value }))
  const setActiveCategory = (value) => setFilters((f) => ({ ...f, activeCategory: value }))
  const setRegionFilter = (value) => setFilters((f) => ({ ...f, regionFilter: value }))

  // Refleja los filtros en la URL para que una búsqueda/categoría sea
  // compartible y sobreviva a un refresh (sin agregar historial por cada tecla).
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (activeCategory !== 'todo') params.set('categoria', activeCategory)
    if (regionFilter !== 'todos') params.set('region', regionFilter)
    const qs = params.toString()
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState(null, '', url)
  }, [search, activeCategory, regionFilter])

  // Altura real del header (varía por breakpoint/contenido) para que la
  // barra/sidebar de categorías se pegue justo debajo, sin taparlo ni dejar hueco.
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
      const items = data[categoryConfig[key].dataKey || key] || []
      acc[key] = q ? items.filter((it) => getSearchableText(it).includes(q)).length : items.length
      return acc
    }, {})
  }, [data, search])

  const groups = useMemo(() => {
    if (!data) return []
    const q = search.trim().toLowerCase()
    const keysToShow = activeCategory === 'todo' ? categoryKeys : [activeCategory]
    return keysToShow.map((key) => {
      let items = data[categoryConfig[key].dataKey || key] || []
      if (key === 'canchas') {
        items = items.filter((it) => matchesRegion(it.departamento, regionFilter))
      }
      const filtered = q ? items.filter((it) => getSearchableText(it).includes(q)) : items
      const sorted = [...filtered].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '', 'es'))
      return { key, items: sorted }
    })
  }, [data, search, activeCategory, regionFilter])

  const regionFilterNode = activeCategory === 'canchas' && (
    <RegionFilter value={regionFilter} onChange={setRegionFilter} />
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        ref={headerRef}
        search={search}
        onSearchChange={setSearch}
        isDark={isDark}
        onToggleDark={toggleDark}
        onLogoClick={() => setActiveCategory('todo')}
      />

      {/* Mobile/tablet: barra horizontal pegajosa. Un sidebar fijo no funciona
          en pantallas angostas, así que acá se mantienen los tabs de siempre. */}
      <div
        className="sticky z-10 bg-white dark:bg-black border-b border-slate-200 dark:border-base-700 md:hidden"
        style={{ top: headerHeight }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} counts={counts} />
          {regionFilterNode}
        </div>
      </div>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:flex md:items-start md:gap-8">
        {/* Desktop: sidebar fija a la izquierda */}
        <aside className="hidden md:block w-56 shrink-0 self-stretch">
          <div className="sticky flex flex-col gap-4" style={{ top: headerHeight + 24 }}>
            <CategorySidebar active={activeCategory} onChange={setActiveCategory} counts={counts} />
            {regionFilterNode}
          </div>
        </aside>

        <main className="flex-1 min-w-0 flex flex-col gap-6">
          {loading && (
            <p className="text-center py-16 text-slate-500 dark:text-slate-400">Cargando biblioteca…</p>
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
      </div>

      <Footer ultimaActualizacion={data?._ultima_actualizacion} />
    </div>
  )
}
