import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// server.proxy: Leitet alle Anfragen an /api/* an das Backend weiter.
// Ohne Proxy würde fetch('/api/...') an Vite selbst gehen (Port 5173)
// statt ans Backend (Port 3001) → 404 Fehler.
// changeOrigin: true → setzt den Host-Header auf das Ziel (nötig für CORS).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
