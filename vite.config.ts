import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5170,
    proxy: {
      '/api': {
        target: env.VITE_API_BASE_URL || 'http://localhost:7000',
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: ['.ngrok-free.dev']
  },
  }
})
