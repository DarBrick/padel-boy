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
        home: 'Home',
        createdBy: 'Created by Dariusz W.',
        github: 'GitHub',
        license: 'CC BY-NC-SA 4.0',
        version: 'Version',
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
      terms: {
        title: 'Terms of Service',
        back: 'Back',
        intro: 'By using Padel Boy, you agree to these terms. Please read them carefully.',
        service: {
          title: 'Service Description',
          desc: 'Padel Boy is a free web application for organizing padel tournaments. The service is provided "as is" without any warranties or guarantees.\n\nWe do not charge fees, collect personal data, or display advertisements. The app runs entirely in your browser using local storage.',
        },
        responsibilities: {
          title: 'User Responsibilities',
          desc: 'You are responsible for:\n\n• Ensuring accurate player information and tournament settings\n• Managing your own data stored in browser localStorage\n• Using the app in compliance with local laws and regulations\n• Respecting other players\' privacy when sharing tournament results\n\nWe are not responsible for disputes, errors in tournament organization, or any outcomes resulting from app usage.',
        },
        disclaimer: {
          title: 'Disclaimer of Warranties',
          desc: 'This app is provided without warranty of any kind, express or implied.\n\nWe do not guarantee:\n• Uninterrupted or error-free operation\n• Accuracy of match scheduling algorithms\n• Preservation of data (browser storage can be cleared)\n• Compatibility with all devices and browsers\n\nUse of this service is at your own risk.',
        },
        liability: {
          title: 'Limitation of Liability',
          desc: 'To the maximum extent permitted by law, we shall not be liable for:\n\n• Loss of tournament data\n• Scheduling errors or incorrect match pairings\n• Disputes between players\n• Any direct, indirect, incidental, or consequential damages\n\nYour sole remedy is to discontinue use of the app.',
        },
        changes: {
          title: 'Changes to Terms',
          desc: 'We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.\n\nLast updated: February 4, 2026',
        },
      },
      help: {
        title: 'Help & FAQ',
        back: 'Back',
        intro: 'Learn how to use Padel Boy and understand tournament formats.',
        gettingStarted: {
          title: 'Getting Started',
          desc: '1. Choose your tournament format (Americano or Mexicano)\n2. Enter a tournament name or use the auto-generated one\n3. Add players by clicking "Add Player" - you need at least 4 players\n4. Adjust the number of courts (automatically calculated based on players)\n5. Click "Start Tournament" to begin\n\nYour tournament data is saved locally in your browser.',
        },
        americano: {
          title: 'Americano Format',
          desc: 'In Americano, all players compete against all other players over multiple rounds.\n\nHow it works:\n• Players are paired randomly\n• Each player partners with different teammates\n• Each player faces different opponents\n• Points are tracked individually\n• Perfect for social games where everyone plays together\n\nIdeal for: Casual games, social events, player development',
        },
        mexicano: {
          title: 'Mexicano Format',
          desc: 'In Mexicano, players are paired dynamically based on current rankings.\n\nHow it works:\n• First rounds use random pairing\n• After initial rounds, top-ranked players face each other\n• Lower-ranked players also face similar-ranked opponents\n• Creates competitive, balanced matches\n• Rankings update after each round\n\nSettings:\n• Pairing style: How partners are assigned (1st & 4th vs 2nd & 3rd, or 1st & 3rd vs 2nd & 4th)\n• Random rounds: Number of initial rounds before ranking-based pairing\n\nIdeal for: Competitive tournaments, skill-based matchmaking',
        },
        players: {
          title: 'Managing Players',
          desc: 'Player Names:\n• Cannot be empty or contain only spaces\n• Each name must be unique within the tournament\n• Maximum 40 players per tournament\n\nAdding Players:\n• You must select players for each new tournament\n• Player suggestions come from all completed tournaments stored in your browser\n• Type to search or select from suggestions\n• You need at least 4 players to start a tournament\n\nCourt Allocation:\n• The app automatically suggests the optimal number of courts based on player count\n• You can manually adjust the court number if needed\n• You won\'t be able to set more courts than required to ensure all courts are used during rounds',
        },
        troubleshooting: {
          title: 'Troubleshooting',
          desc: 'My tournament disappeared:\n• Data is stored in browser localStorage\n• Clearing browser data will delete tournaments\n• Use incognito/private mode carefully - data is deleted when closed\n• If you have the link to a completed tournament, you can recreate its data (including player names and detailed results) by opening it\n\nCan\'t add players:\n• Maximum 40 players allowed\n• Check if "Start Tournament" button is enabled (needs 4+ players)\n\nLanguage changed unexpectedly:\n• Your language preference is saved automatically\n• Use the language switcher (top-right) to change it back\n\nNeed help or found a bug?\n• Report issues on our <a href="https://github.com/DarBrick/padel-boy/issues" target="_blank" rel="noopener noreferrer" class="text-[var(--color-padel-yellow)] hover:underline">GitHub project</a>',
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
      footer: {        home: 'Strona główna',        createdBy: 'Stworzono przez Dariusz W.',
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
      terms: {
        title: 'Warunki Korzystania',
        back: 'Wróć',
        intro: 'Korzystając z Padel Boy, zgadzasz się na te warunki. Przeczytaj je uważnie.',
        service: {
          title: 'Opis Usługi',
          desc: 'Padel Boy to darmowa aplikacja internetowa do organizowania turniejów padla. Usługa jest świadczona "tak jak jest" bez żadnych gwarancji.\n\nNie pobieramy opłat, nie zbieramy danych osobowych ani nie wyświetlamy reklam. Aplikacja działa całkowicie w przeglądarce przy użyciu lokalnej pamięci.',
        },
        responsibilities: {
          title: 'Obowiązki Użytkownika',
          desc: 'Jesteś odpowiedzialny za:\n\n• Zapewnienie dokładnych informacji o graczach i ustawień turnieju\n• Zarządzanie własnymi danymi przechowywanymi w localStorage przeglądarki\n• Korzystanie z aplikacji zgodnie z lokalnymi przepisami\n• Szanowanie prywatności innych graczy przy udostępnianiu wyników turnieju\n\nNie ponosimy odpowiedzialności za spory, błędy w organizacji turnieju ani jakiekolwiek skutki wynikające z użytkowania aplikacji.',
        },
        disclaimer: {
          title: 'Wyłączenie Gwarancji',
          desc: 'Ta aplikacja jest świadczona bez jakiejkolwiek gwarancji, wyraźnej lub dorozumianej.\n\nNie gwarantujemy:\n• Nieprzerwanej lub bezbłędnej pracy\n• Dokładności algorytmów planowania meczów\n• Zachowania danych (pamięć przeglądarki może zostać wyczyszczona)\n• Kompatybilności ze wszystkimi urządzeniami i przeglądarkami\n\nKorzystanie z tej usługi odbywa się na własne ryzyko.',
        },
        liability: {
          title: 'Ograniczenie Odpowiedzialności',
          desc: 'W maksymalnym zakresie dozwolonym przez prawo nie ponosimy odpowiedzialności za:\n\n• Utratę danych turniejowych\n• Błędy w harmonogramie lub nieprawidłowe parowanie meczów\n• Spory między graczami\n• Jakiekolwiek bezpośrednie, pośrednie, przypadkowe lub następcze szkody\n\nJedynym środkiem zaradczym jest zaprzestanie korzystania z aplikacji.',
        },
        changes: {
          title: 'Zmiany Warunków',
          desc: 'Zastrzegamy sobie prawo do modyfikacji tych warunków w dowolnym momencie. Dalsze korzystanie z aplikacji po wprowadzeniu zmian oznacza akceptację nowych warunków.\n\nOstatnia aktualizacja: 4 lutego 2026',
        },
      },
      help: {
        title: 'Pomoc i FAQ',
        back: 'Wróć',
        intro: 'Dowiedz się, jak korzystać z Padel Boy i poznaj formaty turniejów.',
        gettingStarted: {
          title: 'Pierwsze Kroki',
          desc: '1. Wybierz format turnieju (Americano lub Mexicano)\n2. Wprowadź nazwę turnieju lub użyj automatycznie wygenerowanej\n3. Dodaj graczy, klikając "Dodaj Gracza" - potrzebujesz co najmniej 4 graczy\n4. Dostosuj liczbę kortów (automatycznie obliczana na podstawie liczby graczy)\n5. Kliknij "Rozpocznij Turniej", aby rozpocząć\n\nDane turnieju są zapisywane lokalnie w przeglądarce.',
        },
        americano: {
          title: 'Format Americano',
          desc: 'W Americano wszyscy gracze rywalizują ze wszystkimi innymi graczami w wielu rundach.\n\nJak to działa:\n• Gracze są dobierani losowo\n• Każdy gracz gra z różnymi partnerami\n• Każdy gracz zmierza się z różnymi przeciwnikami\n• Punkty są śledzone indywidualnie\n• Idealny do gier towarzyskich, gdzie wszyscy grają razem\n\nIdealny dla: Gier towarzyskich, wydarzeń społecznych, rozwoju graczy',
        },
        mexicano: {
          title: 'Format Mexicano',
          desc: 'W Mexicano gracze są dobierani dynamicznie na podstawie aktualnego rankingu.\n\nJak to działa:\n• Pierwsze rundy wykorzystują losowe parowanie\n• Po początkowych rundach najlepsi gracze grają ze sobą\n• Gracze z niższym rankingiem również grają z graczami o podobnym poziomie\n• Tworzy konkurencyjne, zrównoważone mecze\n• Rankingi aktualizowane po każdej rundzie\n\nUstawienia:\n• Styl parowania: Jak przydzielani są partnerzy (1. i 4. vs 2. i 3., lub 1. i 3. vs 2. i 4.)\n• Rundy losowe: Liczba początkowych rund przed parowaniem według rankingu\n\nIdealny dla: Turniejów konkurencyjnych, dopasowania według umiejętności',
        },
        players: {
          title: 'Zarządzanie Graczami',
          desc: 'Nazwy Graczy:\n• Nie mogą być puste lub zawierać tylko spacje\n• Każda nazwa musi być unikalna w turnieju\n• Maksymalnie 40 graczy na turniej\n\nDodawanie Graczy:\n• Musisz wybrać graczy dla każdego nowego turnieju\n• Sugestie graczy pochodzą ze wszystkich zakończonych turniejów zapisanych w przeglądarce\n• Wpisz, aby wyszukać lub wybierz z sugestii\n• Potrzebujesz co najmniej 4 graczy, aby rozpocząć turniej\n\nPrzydział Kortów:\n• Aplikacja automatycznie sugeruje optymalną liczbę kortów na podstawie liczby graczy\n• Możesz ręcznie dostosować liczbę kortów w razie potrzeby\n• Nie będziesz mógł ustawić więcej kortów niż potrzeba, aby zapewnić wykorzystanie wszystkich kortów podczas rund',
        },
        troubleshooting: {
          title: 'Rozwiązywanie Problemów',
          desc: 'Mój turniej zniknął:\n• Dane są przechowywane w localStorage przeglądarki\n• Wyczyszczenie danych przeglądarki usunie turnieje\n• Używaj trybu incognito/prywatnego ostrożnie - dane są usuwane po zamknięciu\n• Jeśli posiadasz link do zakończonego turnieju, możesz odtworzyć jego dane (w tym nazwy graczy i szczegółowe wyniki) otwierając go\n\nNie mogę dodać graczy:\n• Maksymalnie 40 graczy\n• Sprawdź, czy przycisk "Rozpocznij Turniej" jest aktywny (wymaga 4+ graczy)\n\nJęzyk zmienił się nieoczekiwanie:\n• Twoje preferencje językowe są zapisywane automatycznie\n• Użyj przełącznika języka (prawy górny róg), aby go zmienić\n\nPotrzebujesz pomocy lub znalazłeś błąd?\n• Zgłoś problem na naszym <a href="https://github.com/DarBrick/padel-boy/issues" target="_blank" rel="noopener noreferrer" class="text-[var(--color-padel-yellow)] hover:underline">projekcie GitHub</a>',
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
        home: 'Inicio',
        createdBy: 'Creado por Dariusz W.',
        github: 'GitHub',
        license: 'CC BY-NC-SA 4.0',
        version: 'Versión',
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
      },      terms: {
        title: 'Términos de Servicio',
        back: 'Volver',
        intro: 'Al usar Padel Boy, aceptas estos términos. Por favor, léelos cuidadosamente.',
        service: {
          title: 'Descripción del Servicio',
          desc: 'Padel Boy es una aplicación web gratuita para organizar torneos de pádel. El servicio se proporciona "tal cual" sin ninguna garantía.\n\nNo cobramos tarifas, no recopilamos datos personales y no mostramos anuncios. La aplicación opera completamente en tu navegador usando almacenamiento local.',
        },
        responsibilities: {
          title: 'Responsabilidades del Usuario',
          desc: 'Eres responsable de:\n\n• Proporcionar información precisa sobre jugadores y configuraciones de torneos\n• Gestionar tus propios datos almacenados en el localStorage del navegador\n• Usar la aplicación conforme a las leyes locales\n• Respetar la privacidad de otros jugadores al compartir resultados de torneos\n\nNo somos responsables de disputas, errores en la organización de torneos o consecuencias derivadas del uso de la aplicación.',
        },
        disclaimer: {
          title: 'Descargo de Garantías',
          desc: 'Esta aplicación se proporciona sin garantía alguna, expresa o implícita.\n\nNo garantizamos:\n• Operación ininterrumpida o libre de errores\n• Precisión de los algoritmos de programación de partidos\n• Preservación de datos (el almacenamiento del navegador puede borrarse)\n• Compatibilidad con todos los dispositivos y navegadores\n\nEl uso de este servicio es bajo tu propio riesgo.',
        },
        liability: {
          title: 'Limitación de Responsabilidad',
          desc: 'En la medida máxima permitida por la ley, no somos responsables de:\n\n• Pérdida de datos de torneos\n• Errores de programación o emparejamientos incorrectos\n• Disputas entre jugadores\n• Cualquier daño directo, indirecto, incidental o consecuente\n\nTu único recurso es dejar de usar la aplicación.',
        },
        changes: {
          title: 'Cambios en los Términos',
          desc: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la aplicación después de los cambios constituye la aceptación de los nuevos términos.\n\nÚltima actualización: 4 de febrero de 2026',
        },
      },
      help: {
        title: 'Ayuda y Preguntas Frecuentes',
        back: 'Volver',
        intro: 'Aprende a usar Padel Boy y comprende los formatos de torneo.',
        gettingStarted: {
          title: 'Comenzando',
          desc: '1. Elige el formato del torneo (Americano o Mexicano)\n2. Ingresa el nombre del torneo o usa el generado automáticamente\n3. Añade jugadores haciendo clic en "Añadir Jugador" - necesitas al menos 4 jugadores\n4. Ajusta el número de pistas (calculado automáticamente según el número de jugadores)\n5. Haz clic en "Iniciar Torneo" para comenzar\n\nLos datos del torneo se guardan localmente en tu navegador.',
        },
        americano: {
          title: 'Formato Americano',
          desc: 'En Americano, todos los jugadores compiten contra todos los demás jugadores en múltiples rondas.\n\nCómo funciona:\n• Los jugadores se emparejan al azar\n• Cada jugador juega con diferentes compañeros\n• Cada jugador se enfrenta a diferentes oponentes\n• Los puntos se rastrean individualmente\n• Ideal para juegos casuales donde todos juegan juntos\n\nPerfecto para: Juegos casuales, eventos sociales, desarrollo de jugadores',
        },
        mexicano: {
          title: 'Formato Mexicano',
          desc: 'En Mexicano, los jugadores se emparejan dinámicamente según la clasificación actual.\n\nCómo funciona:\n• Las primeras rondas usan emparejamiento aleatorio\n• Después de las rondas iniciales, los mejores jugadores juegan entre sí\n• Los jugadores de menor clasificación también juegan con jugadores de nivel similar\n• Crea partidos competitivos y equilibrados\n• Las clasificaciones se actualizan después de cada ronda\n\nConfiguraciones:\n• Estilo de emparejamiento: Cómo se asignan los compañeros (1º y 4º vs 2º y 3º, o 1º y 3º vs 2º y 4º)\n• Rondas aleatorias: Número de rondas iniciales antes del emparejamiento por clasificación\n\nPerfecto para: Torneos competitivos, emparejamiento por habilidad',
        },
        players: {
          title: 'Gestión de Jugadores',
          desc: 'Nombres de Jugadores:\n• No pueden estar vacíos ni contener solo espacios\n• Cada nombre debe ser único dentro del torneo\n• Máximo 40 jugadores por torneo\n\nAñadir Jugadores:\n• Debes seleccionar jugadores para cada nuevo torneo\n• Las sugerencias de jugadores provienen de todos los torneos completados almacenados en tu navegador\n• Escribe para buscar o selecciona de las sugerencias\n• Necesitas al menos 4 jugadores para iniciar un torneo\n\nAsignación de Pistas:\n• La aplicación sugiere automáticamente el número óptimo de pistas según el número de jugadores\n• Puedes ajustar manualmente el número de pistas si es necesario\n• No podrás establecer más pistas de las necesarias para garantizar que todas las pistas se utilicen durante las rondas',
        },
        troubleshooting: {
          title: 'Solución de Problemas',
          desc: 'Mi torneo desapareció:\n• Los datos se almacenan en el localStorage del navegador\n• Borrar los datos del navegador eliminará los torneos\n• Usa el modo incógnito/privado con precaución: los datos se eliminan al cerrar\n• Si tienes el enlace a un torneo completado, puedes recrear sus datos (incluyendo nombres de jugadores y resultados detallados) abriéndolo\n\nNo puedo añadir jugadores:\n• Máximo 40 jugadores\n• Verifica que el botón "Iniciar Torneo" esté activo (requiere 4+ jugadores)\n\nEl idioma cambió inesperadamente:\n• Tu preferencia de idioma se guarda automáticamente\n• Usa el selector de idioma (esquina superior derecha) para cambiarlo\n\n¿Necesitas ayuda o encontraste un error?\n• Reporta problemas en nuestro <a href="https://github.com/DarBrick/padel-boy/issues" target="_blank" rel="noopener noreferrer" class="text-[var(--color-padel-yellow)] hover:underline">proyecto de GitHub</a>',
        },
      },      months: {
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
