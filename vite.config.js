import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  define: {
    global: 'window'
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://autenticacaoservice.pagpix.online',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/streaming': {
        target: 'https://streamingservice.pagpix.online',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/streaming/, '')
      }
    }
  }
})
