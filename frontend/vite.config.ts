import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'react-hot-toast'],
          'vendor-leaflet': ['leaflet', 'react-leaflet'],
          'vendor-utils': ['jspdf', 'html2canvas', 'qrcode.react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
