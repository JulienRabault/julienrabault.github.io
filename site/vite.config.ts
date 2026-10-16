import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  // Deux points d'entrée : / en français, /en/ en anglais.
  build: {
    rollupOptions: {
      input: { fr: path.resolve(import.meta.dirname, 'index.html'), en: path.resolve(import.meta.dirname, 'en/index.html') },
    },
  },
})
