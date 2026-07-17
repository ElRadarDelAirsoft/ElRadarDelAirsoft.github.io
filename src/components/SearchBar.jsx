import { SearchIcon, XIcon } from './Icons.jsx'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <label htmlFor="airsoft-search" className="sr-only">
        Buscar por nombre, lugar o contacto
      </label>
      <SearchIcon aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
      <input
        id="airsoft-search"
        type="text"
        name="q"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre, lugar, contacto…"
        className="w-full rounded-sm border bg-white border-slate-300 pl-9 pr-9 py-2.5 text-sm
          text-base-950 placeholder:text-slate-500 transition-colors duration-200 ease-out-quart
          focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent
          dark:bg-base-900 dark:border-base-700 dark:text-white dark:placeholder:text-slate-500"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 dark:text-slate-400
            transition-[color,transform] duration-150 ease-out-quart active:scale-90 animate-pop-in
            dark:hover:text-slate-200"
        >
          <XIcon aria-hidden="true" className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
