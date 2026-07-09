import { useEffect, useState } from 'react'

// Carga /data/airsoft.json (servido como estático desde /public/data/).
// Único punto donde se lee el contenido editable por el admin.
export function useAirsoftData() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/data/airsoft.json')
      .then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar airsoft.json (${res.status})`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, error, loading }
}
