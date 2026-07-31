import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'

function getLastCommitDate() {
  try {
    return execSync('git log -1 --format=%cd --date=short').toString().trim()
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

export default defineConfig({
  plugins: [react()],
  define: {
    __LAST_DEPLOY_DATE__: JSON.stringify(getLastCommitDate()),
  },
  build: {
    // scripts/prerender.mjs (Node plano, corre después del build) lo lee
    // para saber el nombre final hasheado de los carteles del banner y
    // poder reusarlos en páginas estáticas como /empieza-aqui/.
    manifest: true,
  },
})
