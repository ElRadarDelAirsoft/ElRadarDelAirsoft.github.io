import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CategoryTabs from './components/CategoryTabs.jsx'
import CategoryGrid from './components/CategoryGrid.jsx'
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
      const items = data[key] || []
      const filtered = q ? items.filter((it) => getSearchableText(it).includes(q)) : items
      return { key, items: filtered }
    })
  }, [data, search, activeCategory])

  return (
    <div className="min-h-screen flex flex-col">
      <Header search={search} onSearchChange={setSearch} isDark={isDark} onToggleDark={toggleDark} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} counts={counts} />

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
