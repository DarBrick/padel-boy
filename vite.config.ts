import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Always use root path - runtime detection in App.tsx handles basename routing
  base: '/',
})
