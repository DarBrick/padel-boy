import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Padel Boy!',
      underConstruction: 'Under construction...',
      countIs: 'Count is {{count}}',
    },
  },
  pl: {
    translation: {
      welcome: 'Witaj w Padel Boy!',
      underConstruction: 'W budowie...',
      countIs: 'Licznik: {{count}}',
    },
  },
  es: {
    translation: {
      welcome: '¡Bienvenido a Padel Boy!',
      underConstruction: 'En construcción...',
      countIs: 'Contador: {{count}}',
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export default i18n
