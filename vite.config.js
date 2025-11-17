import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ideastonebyjm/',
  plugins: [react()],
  build: {
    outDir: 'docs'
  },
  // ADD THIS SERVER SECTION:
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})