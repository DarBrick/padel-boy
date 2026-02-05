import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import { resources } from './locales'
import { missingKeyLogger } from './utils/i18nLogger'

i18n
  .use(missingKeyLogger)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: 'translation',
    fallbackLng: 'en',
    supportedLngs: ['en', 'pl', 'es'],
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'ul', 'ol', 'li', 'h3'],
    },
    returnNull: false,
  })

export default i18n
