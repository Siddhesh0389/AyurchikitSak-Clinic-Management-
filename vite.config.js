// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://ayurchikitsak.onrender.com',
        changeOrigin: true,
      },
      '/ws': {
        target: 'https://ayurchikitsak.onrender.com',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'react-icons', 'react-hot-toast'],
          forms: ['react-hook-form', 'react-datepicker'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
})