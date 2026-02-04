import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      lang: 'en',
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
      create: {
        title: 'Create Tournament',
        backToHome: 'Back to home',
        eventType: {
          label: 'Tournament Format',
          americanoDesc: 'All players vs all',
          mexicanoDesc: 'Dynamic pairing by ranking',
        },
        name: {
          label: 'Tournament Name',
          placeholder: 'Enter tournament name',
          error: 'Please enter a tournament name',
        },
        players: {
          label: 'Players',
          add: 'Add Player',
          namePlaceholder: 'Enter player name',
          hint: 'Click on a name to edit it',
          defaultName: 'Player',
          error: 'Please enter a number between 4 and 40',
        },
        courts: {
          label: 'Number of Courts',
          error: 'Please enter a number between 1 and 10',
        },
        mexicano: {
          title: 'Mexicano Settings',
          matchup: {
            label: 'Pairing',
            desc1: '1st & 4th vs 2nd & 3rd',
            desc2: '1st & 3rd vs 2nd & 4th',
          },
          randomRounds: {
            label: 'Random Rounds',
            desc: 'Number of initial rounds with random pairings before ranking-based matchups',
          },
        },
        submit: 'Start Tournament',
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
      cookieBanner: {
        message: 'This app stores your preferences and tournament information locally in your browser.',
        accept: 'Got it',
        close: 'Close',
      },
      privacy: {
        title: 'Privacy Policy',
        back: 'Back',
        intro: 'Padel Boy is a free application that stores all data locally in your browser. We do not collect, transmit, or store any personal information on external servers.',
        language: {
          title: 'Language Preference',
          desc: 'When you select a language, your choice is saved in your browser\'s localStorage under the key "i18nextLng".\n\nThis allows the app to remember your language preference on future visits.\n\nPurpose: Essential for providing the interface in your preferred language.\nData stored: Language code (e.g., "en", "pl", "es").',
        },
        tournaments: {
          title: 'Tournament Data',
          desc: 'Tournament configurations, player names, and match scores are stored locally in your browser\'s localStorage.\n\nThis data never leaves your device and is not accessible to us or any third parties.\n\nPurpose: Essential for maintaining tournament state between sessions.\nData stored: Tournament settings, player names, match results, standings.',
        },
        control: {
          title: 'Your Control',
          desc: 'You have full control over your data:\n\n• Clear browser data: Clearing your browser\'s cache and cookies will remove all stored information including language preferences and tournament data.\n\n• Private browsing: Using incognito/private mode means data is deleted when you close the browser.\n\n• No tracking: We do not use cookies or localStorage for advertising, analytics, or tracking purposes.',
        },
      },
      months: {
        '0': 'Jan',
        '1': 'Feb',
        '2': 'Mar',
        '3': 'Apr',
        '4': 'May',
        '5': 'Jun',
        '6': 'Jul',
        '7': 'Aug',
        '8': 'Sep',
        '9': 'Oct',
        '10': 'Nov',
        '11': 'Dec',
      },
      weekdays: {
        '0': 'Sunday',
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday',
      },
    },
  },
  pl: {
    translation: {
      lang: 'pl',
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
      create: {
        title: 'Stwórz Turniej',
        backToHome: 'Powrót do strony głównej',
        eventType: {
          label: 'Format Turnieju',
          americanoDesc: 'Wszyscy gracze vs wszyscy',
          mexicanoDesc: 'Dynamiczne parowanie wg rankingu',
        },
        name: {
          label: 'Nazwa Turnieju',
          placeholder: 'Wprowadź nazwę turnieju',
          error: 'Wprowadź nazwę turnieju',
        },
        players: {
          label: 'Gracze',
          add: 'Dodaj Gracza',
          namePlaceholder: 'Wprowadź imię gracza',
          hint: 'Kliknij na imię, aby je edytować',
          defaultName: 'Gracz',
          error: 'Wprowadź liczbę od 4 do 40',
        },
        courts: {
          label: 'Liczba Kortów',
          error: 'Wprowadź liczbę od 1 do 10',
        },
        mexicano: {
          title: 'Ustawienia Mexicano',
          matchup: {
            label: 'Parowanie',
            desc1: '1. i 4. vs 2. i 3.',
            desc2: '1. i 3. vs 2. i 4.',
          },
          randomRounds: {
            label: 'Rundy Losowe',
            desc: 'Liczba początkowych rund z losowym parowaniem przed parowaniem według rankingu',
          },
        },
        submit: 'Rozpocznij Turniej',
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
      cookieBanner: {
        message: 'Ta aplikacja przechowuje Twoje preferencje i informacje o turniejach lokalnie w Twojej przeglądarce.',
        accept: 'Rozumiem',
        close: 'Zamknij',
      },
      privacy: {
        title: 'Polityka Prywatności',
        back: 'Wróć',
        intro: 'Padel Boy to darmowa aplikacja, która przechowuje wszystkie dane lokalnie w Twojej przeglądarce. Nie zbieramy, nie przesyłamy ani nie przechowujemy żadnych danych osobowych na zewnętrznych serwerach.',
        language: {
          title: 'Preferencje Językowe',
          desc: 'Kiedy wybierasz język, Twój wybór jest zapisywany w localStorage przeglądarki pod kluczem "i18nextLng".\n\nDzięki temu aplikacja pamięta Twój wybór języka przy kolejnych wizytach.\n\nCel: Niezbędne do wyświetlania interfejsu w preferowanym języku.\nPrzechowywane dane: Kod języka (np. "en", "pl", "es").',
        },
        tournaments: {
          title: 'Dane Turniejowe',
          desc: 'Konfiguracje turniejów, imiona graczy i wyniki meczów są przechowywane lokalnie w localStorage przeglądarki.\n\nTe dane nigdy nie opuszczają Twojego urządzenia i nie są dostępne dla nas ani żadnych osób trzecich.\n\nCel: Niezbędne do utrzymania stanu turnieju między sesjami.\nPrzechowywane dane: Ustawienia turnieju, imiona graczy, wyniki meczów, tabele.',
        },
        control: {
          title: 'Twoja Kontrola',
          desc: 'Masz pełną kontrolę nad swoimi danymi:\n\n• Czyszczenie danych przeglądarki: Wyczyszczenie pamięci podręcznej i plików cookie przeglądarki usunie wszystkie przechowywane informacje, w tym preferencje językowe i dane turniejowe.\n\n• Przeglądanie prywatne: Używanie trybu incognito/prywatnego oznacza, że dane są usuwane po zamknięciu przeglądarki.\n\n• Brak śledzenia: Nie używamy plików cookie ani localStorage do celów reklamowych, analitycznych lub śledzenia.',
        },
      },
      months: {
        '0': 'Sty',
        '1': 'Lut',
        '2': 'Mar',
        '3': 'Kwi',
        '4': 'Maj',
        '5': 'Cze',
        '6': 'Lip',
        '7': 'Sie',
        '8': 'Wrz',
        '9': 'Paź',
        '10': 'Lis',
        '11': 'Gru',
      },
      weekdays: {
        '0': 'niedziela',
        '1': 'poniedziałek',
        '2': 'wtorek',
        '3': 'środa',
        '4': 'czwartek',
        '5': 'piątek',
        '6': 'sobota',
      },
    },
  },
  es: {
    translation: {
      lang: 'es',
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
      create: {
        title: 'Crear Torneo',
        backToHome: 'Volver al inicio',
        eventType: {
          label: 'Formato del Torneo',
          americanoDesc: 'Todos contra todos',
          mexicanoDesc: 'Emparejamiento dinámico por ranking',
        },
        name: {
          label: 'Nombre del Torneo',
          placeholder: 'Introduce el nombre del torneo',
          error: 'Introduce un nombre para el torneo',
        },
        players: {
          label: 'Jugadores',
          add: 'Añadir Jugador',
          namePlaceholder: 'Introduce el nombre del jugador',
          hint: 'Haz clic en un nombre para editarlo',
          defaultName: 'Jugador',
          error: 'Introduce un número entre 4 y 40',
        },
        courts: {
          label: 'Número de Pistas',
          error: 'Introduce un número entre 1 y 10',
        },
        mexicano: {
          title: 'Configuración Mexicano',
          matchup: {
            label: 'Emparejamiento',
            desc1: '1º y 4º vs 2º y 3º',
            desc2: '1º y 3º vs 2º y 4º',
          },
          randomRounds: {
            label: 'Rondas Aleatorias',
            desc: 'Número de rondas iniciales con emparejamientos aleatorios antes de basarse en el ranking',
          },
        },
        submit: 'Iniciar Torneo',
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
      cookieBanner: {
        message: 'Esta aplicación almacena tus preferencias e información de torneos localmente en tu navegador.',
        accept: 'Entendido',
        close: 'Cerrar',
      },
      privacy: {
        title: 'Política de Privacidad',
        back: 'Volver',
        intro: 'Padel Boy es una aplicación gratuita que almacena todos los datos localmente en tu navegador. No recopilamos, transmitimos ni almacenamos ninguna información personal en servidores externos.',
        language: {
          title: 'Preferencia de Idioma',
          desc: 'Cuando seleccionas un idioma, tu elección se guarda en el localStorage de tu navegador bajo la clave "i18nextLng".\n\nEsto permite que la aplicación recuerde tu preferencia de idioma en futuras visitas.\n\nPropósito: Esencial para proporcionar la interfaz en tu idioma preferido.\nDatos almacenados: Código de idioma (p. ej., "en", "pl", "es").',
        },
        tournaments: {
          title: 'Datos de Torneos',
          desc: 'Las configuraciones de torneos, nombres de jugadores y resultados de partidos se almacenan localmente en el localStorage de tu navegador.\n\nEstos datos nunca salen de tu dispositivo y no son accesibles para nosotros ni para terceros.\n\nPropósito: Esencial para mantener el estado del torneo entre sesiones.\nDatos almacenados: Configuraciones de torneos, nombres de jugadores, resultados de partidos, clasificaciones.',
        },
        control: {
          title: 'Tu Control',
          desc: 'Tienes control total sobre tus datos:\n\n• Borrar datos del navegador: Limpiar la caché y las cookies de tu navegador eliminará toda la información almacenada, incluidas las preferencias de idioma y los datos de torneos.\n\n• Navegación privada: Usar el modo incógnito/privado significa que los datos se eliminan cuando cierras el navegador.\n\n• Sin seguimiento: No usamos cookies ni localStorage con fines publicitarios, analíticos o de seguimiento.',
        },
      },
      months: {
        '0': 'Ene',
        '1': 'Feb',
        '2': 'Mar',
        '3': 'Abr',
        '4': 'May',
        '5': 'Jun',
        '6': 'Jul',
        '7': 'Ago',
        '8': 'Sep',
        '9': 'Oct',
        '10': 'Nov',
        '11': 'Dic',
      },
      weekdays: {
        '0': 'domingo',
        '1': 'lunes',
        '2': 'martes',
        '3': 'miércoles',
        '4': 'jueves',
        '5': 'viernes',
        '6': 'sábado',
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
