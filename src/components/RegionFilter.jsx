const LIMA_DEPARTAMENTOS = ['lima', 'callao']

// Clasifica un departamento en el bucket "lima" o "provincias" para el
// filtro rápido de canchas. Departamento vacío no entra en ningún bucket.
export function matchesRegion(departamento, region) {
  if (region === 'todos') return true
  const dep = (departamento || '').trim().toLowerCase()
  if (!dep) return false
  const isLima = LIMA_DEPARTAMENTOS.includes(dep)
  return region === 'lima' ? isLima : !isLima
}

const options = [
  { value: 'todos', label: 'Todo el Perú' },
  { value: 'lima', label: 'Lima' },
  { value: 'provincias', label: 'Provincias' },
]

const pillBase =
  'shrink-0 px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider border ' +
  'transition-[background-color,color,border-color,transform] duration-200 ease-out-quart ' +
  'active:scale-[0.96] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-base-900'
const pillActive = 'bg-accent text-black border-accent'
const pillInactive =
  'bg-slate-50 border-slate-200 text-slate-600 hover:border-accent hover:text-base-950 ' +
  'dark:bg-base-900 dark:border-base-700 dark:text-slate-300 dark:hover:border-accent dark:hover:text-white'

export default function RegionFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Región
      </span>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`${pillBase} ${value === opt.value ? pillActive : pillInactive}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
