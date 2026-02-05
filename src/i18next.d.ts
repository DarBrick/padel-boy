import 'i18next'

import enTranslation from './locales/en/translation'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof enTranslation
    }
    returnNull: false
  }
}
