import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use subdirectory for GitHub Pages, root for custom domains
  base: process.env.VITE_CUSTOM_DOMAIN ? '/' : '/padel-boy/',
})
