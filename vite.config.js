import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/carnatic-music-app/',
  plugins: [react()],
})
