import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      appName: 'Padel Boy',
      home: {
        subtitle: 'Organize and manage Padel games with ease. Free, no payments required.',
        startTournament: 'Start New Tournament',
        features: {
          formats: {
            title: 'Two Tournament Formats',
            description: 'Choose between Americano (all vs all) or Mexicano (dynamic pairing)',
          },
          players: {
            title: 'Flexible Player Count',
            description: 'Support for 4-40 players with automatic match generation',
          },
          rounds: {
            title: 'Smart Round Management',
            description: 'Automatic pairing and scheduling for multiple courts',
          },
          realtime: {
            title: 'Share Results',
            description: 'Share tournament standings with others via a unique URL',
          },
        },
        howItWorks: {
          title: 'How It Works',
          step1: 'Choose tournament format (Americano or Mexicano)',
          step2: 'Add players and select number of courts',
          step3: 'System generates matches automatically',
          step4: 'Enter scores and share standings via unique URL',
        },
      },
      setup: {
        title: 'Tournament Setup',
      },
      players: {
        title: 'Players',
      },
      tournament: {
        title: 'Tournament',
      },
      standings: {
        title: 'Standings',
      },
      footer: {
        createdBy: 'Created by Dariusz W.',
      },
    },
  },
  pl: {
    translation: {
      appName: 'Padel Boy',
      home: {
        subtitle: 'Organizuj i zarządzaj grami w Padel z łatwością. Bezpłatnie, bez opłat.',
        startTournament: 'Rozpocznij Nowy Turniej',
        features: {
          formats: {
            title: 'Dwa Formaty Turniejów',
            description: 'Wybierz między Americano (wszyscy vs wszyscy) lub Mexicano (dynamiczne parowanie)',
          },
          players: {
            title: 'Elastyczna Liczba Graczy',
            description: 'Wsparcie dla 4-40 graczy z automatycznym generowaniem meczów',
          },
          rounds: {
            title: 'Inteligentne Zarządzanie Rundami',
            description: 'Automatyczne parowanie i planowanie dla wielu kortów',
          },
          realtime: {
            title: 'Podziel się wynikami',
            description: 'Udostępnij klasyfikację turnieju innym za pomocą unikalnego linku',
          },
        },
        howItWorks: {
          title: 'Jak To Działa',
          step1: 'Wybierz format turnieju (Americano lub Mexicano)',
          step2: 'Dodaj graczy i wybierz liczbę kortów',
          step3: 'System automatycznie generuje mecze',
          step4: 'Wprowadzaj wyniki i udostępniaj klasyfikację przez unikalny link',
        },
      },
      setup: {
        title: 'Ustawienia Turnieju',
      },
      players: {
        title: 'Gracze',
      },
      tournament: {
        title: 'Turniej',
      },
      standings: {
        title: 'Klasyfikacja',
      },
      footer: {
        createdBy: 'Stworzono przez Dariusz W.',
      },
    },
  },
  es: {
    translation: {
      appName: 'Padel Boy',
      home: {
        subtitle: 'Organiza y gestiona juegos de Padel con facilidad. Gratis, sin pagos.',
        startTournament: 'Iniciar Nuevo Torneo',
        features: {
          formats: {
            title: 'Dos Formatos de Torneo',
            description: 'Elige entre Americano (todos contra todos) o Mexicano (emparejamiento dinámico)',
          },
          players: {
            title: 'Número Flexible de Jugadores',
            description: 'Soporte para 4-40 jugadores con generación automática de partidos',
          },
          rounds: {
            title: 'Gestión Inteligente de Rondas',
            description: 'Emparejamiento y programación automática para múltiples pistas',
          },
          realtime: {
            title: 'Compartir Resultados',
            description: 'Comparte la clasificación del torneo con otros mediante una URL única',
          },
        },
        howItWorks: {
          title: 'Cómo Funciona',
          step1: 'Elige el formato del torneo (Americano o Mexicano)',
          step2: 'Añade jugadores y selecciona el número de pistas',
          step3: 'El sistema genera los partidos automáticamente',
          step4: 'Introduce los resultados y comparte la clasificación mediante URL única',
        },
      },
      setup: {
        title: 'Configuración del Torneo',
      },
      players: {
        title: 'Jugadores',
      },
      tournament: {
        title: 'Torneo',
      },
      standings: {
        title: 'Clasificación',
      },
      footer: {
        createdBy: 'Creado por Dariusz W.',
      },
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'pl', 'es'],
    detection: {
      order: ['navigator', 'localStorage', 'cookie'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export default i18n
