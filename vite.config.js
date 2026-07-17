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
})
