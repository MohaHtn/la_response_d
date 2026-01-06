import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/documents': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/moderation': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/setup': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    }
  },
  define: {
    // En production Docker, VITE_API_URL doit être vide pour utiliser des chemins relatifs via Nginx
    // En développement local avec Vite, le proxy ci-dessus gère les requêtes
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || ''),
  }
})
