import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      appName: 'Padel Boy',
      home: {
        subtitle: 'Organize and manage Padel games with ease',
        startTournament: 'Start New Tournament',
        features: {
          formats: {
            title: 'Two Tournament Formats',
            description: 'Choose between Americano (all vs all) or Mexicano (dynamic pairing)',
          },
          players: {
            title: 'Flexible Player Count',
            description: 'Support for 4-16 players with automatic match generation',
          },
          rounds: {
            title: 'Smart Round Management',
            description: 'Automatic pairing and scheduling for multiple courts',
          },
          realtime: {
            title: 'Live Standings',
            description: 'Track scores and rankings in real-time as matches complete',
          },
        },
        howItWorks: {
          title: 'How It Works',
          step1: 'Choose tournament format (Americano or Mexicano)',
          step2: 'Add players and select number of courts',
          step3: 'System generates matches automatically',
          step4: 'Enter scores and watch standings update live',
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
    },
  },
  pl: {
    translation: {
      appName: 'Padel Boy',
      home: {
        subtitle: 'Organizuj i zarządzaj grami w Padel z łatwością',
        startTournament: 'Rozpocznij Nowy Turniej',
        features: {
          formats: {
            title: 'Dwa Formaty Turniejów',
            description: 'Wybierz między Americano (wszyscy vs wszyscy) lub Mexicano (dynamiczne parowanie)',
          },
          players: {
            title: 'Elastyczna Liczba Graczy',
            description: 'Wsparcie dla 4-16 graczy z automatycznym generowaniem meczów',
          },
          rounds: {
            title: 'Inteligentne Zarządzanie Rundami',
            description: 'Automatyczne parowanie i planowanie dla wielu kortów',
          },
          realtime: {
            title: 'Na Żywo Klasyfikacja',
            description: 'Śledź wyniki i rankingi w czasie rzeczywistym',
          },
        },
        howItWorks: {
          title: 'Jak To Działa',
          step1: 'Wybierz format turnieju (Americano lub Mexicano)',
          step2: 'Dodaj graczy i wybierz liczbę kortów',
          step3: 'System automatycznie generuje mecze',
          step4: 'Wprowadzaj wyniki i obserwuj aktualizacje na żywo',
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
    },
  },
  es: {
    translation: {
      appName: 'Padel Boy',
      home: {
        subtitle: 'Organiza y gestiona juegos de Padel con facilidad',
        startTournament: 'Iniciar Nuevo Torneo',
        features: {
          formats: {
            title: 'Dos Formatos de Torneo',
            description: 'Elige entre Americano (todos contra todos) o Mexicano (emparejamiento dinámico)',
          },
          players: {
            title: 'Número Flexible de Jugadores',
            description: 'Soporte para 4-16 jugadores con generación automática de partidos',
          },
          rounds: {
            title: 'Gestión Inteligente de Rondas',
            description: 'Emparejamiento y programación automática para múltiples pistas',
          },
          realtime: {
            title: 'Clasificación en Vivo',
            description: 'Sigue las puntuaciones y clasificaciones en tiempo real',
          },
        },
        howItWorks: {
          title: 'Cómo Funciona',
          step1: 'Elige el formato del torneo (Americano o Mexicano)',
          step2: 'Añade jugadores y selecciona el número de pistas',
          step3: 'El sistema genera los partidos automáticamente',
          step4: 'Introduce los resultados y observa las actualizaciones en vivo',
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
