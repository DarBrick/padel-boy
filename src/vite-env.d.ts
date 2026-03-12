/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  DEV: boolean
  PROD: boolean
  MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
