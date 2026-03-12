import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['padel-icon.svg', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Padel Boy',
        short_name: 'Padel Boy',
        description: 'Create and manage padel tournaments in seconds.',
        theme_color: '#111827',
        background_color: '#111827',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/padel-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  // Always use root path - runtime detection in App.tsx handles basename routing
  base: '/',
  test: {
    globals: true,
    environment: 'jsdom',
    watch: false,
  },
})
