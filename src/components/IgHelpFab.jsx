import { useEffect, useState } from 'react'
import { InstagramIcon, XIcon } from './Icons.jsx'

const DISMISS_KEY = 'radar-ig-help-dismissed'
const IG_URL = 'https://ig.me/m/elradardelairsoft'

export default function IgHelpFab() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(sessionStorage.getItem(DISMISS_KEY) !== '1')
  }, [])

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-30 flex items-end gap-2 animate-fade-up">
      <div className="relative max-w-[220px] rounded-sm bg-black text-white text-xs leading-snug px-3 py-2.5 pr-5 shadow-lg
        dark:border dark:border-base-700">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Cerrar y ocultar"
          className="absolute -top-2 -right-2 rounded-sm bg-white text-black w-5 h-5 flex items-center justify-center shadow
            transition-transform duration-150 ease-out-quart active:scale-90 hover:bg-slate-100"
        >
          <XIcon aria-hidden="true" className="w-3 h-3" />
        </button>
        ¡Si necesitas ayuda o es primera partida, escríbeme para guiarte!
      </div>
      <a
        href={IG_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por Instagram si necesitas ayuda"
        className="shrink-0 flex items-center justify-center w-14 h-14 rounded-sm bg-accent text-black
          shadow-[0_0_0_3px_rgba(107,155,55,0.25)] hover:shadow-[0_0_0_5px_rgba(107,155,55,0.35)] hover:-translate-y-0.5 hover:bg-accent-dim
          transition-[background-color,box-shadow,transform] duration-150 ease-out-quart
          active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <InstagramIcon aria-hidden="true" className="w-6 h-6" />
      </a>
    </div>
  )
}
