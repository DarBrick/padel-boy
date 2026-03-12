import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import './index.css'
import './i18n'

// Load dev utilities in development mode
if (import.meta.env.DEV) {
  import('./utils/devUtils')
}

if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
