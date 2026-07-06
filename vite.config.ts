/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// The base path defaults to '/' for local dev/builds; the GitHub Pages
// workflow overrides it with `--base=/coding-circus/` at build time.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
})
