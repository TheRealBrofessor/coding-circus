import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this as a project site at /coding-circus/.
export default defineConfig({
  base: '/coding-circus/',
  plugins: [react()],
})
