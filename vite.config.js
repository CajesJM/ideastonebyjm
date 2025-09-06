import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ideastonebyjm/',
  plugins: [react()],
  build: {
    outDir: 'docs'
  }
})
