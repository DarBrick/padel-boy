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
        points: {
          label: 'Points Per Match',
          desc: 'Number of points to play per match. Standard is 21 points.',
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
          desc: '<p>When you select a language, your choice is saved in your browser\'s localStorage under the key "i18nextLng".</p><p>This allows the app to remember your language preference on future visits.</p><h3>Technical Details</h3><ul><li><strong>Purpose:</strong> Essential for providing the interface in your preferred language</li><li><strong>Data stored:</strong> Language code (e.g., "en", "pl", "es")</li></ul>',
        },
        tournaments: {
          title: 'Tournament Data',
          desc: '<p>Tournament configurations, player names, and match scores are stored locally in your browser\'s localStorage.</p><div class="info-panel"><p><strong>Privacy guarantee:</strong> This data never leaves your device and is not accessible to us or any third parties.</p></div><h3>What we store</h3><ul><li><strong>Purpose:</strong> Essential for maintaining tournament state between sessions</li><li><strong>Data stored:</strong> Tournament settings, player names, match results, standings</li></ul>',
        },
        control: {
          title: 'Your Control',
          desc: '<p>You have full control over your data:</p><h3>Data Management</h3><ul><li><strong>Clear browser data:</strong> Clearing your browser\'s cache and cookies will remove all stored information including language preferences and tournament data</li><li><strong>Private browsing:</strong> Using incognito/private mode means data is deleted when you close the browser</li><li><strong>No tracking:</strong> We do not use cookies or localStorage for advertising, analytics, or tracking purposes</li></ul>',
        },
      },
      terms: {
        title: 'Terms of Service',
        back: 'Back',
        intro: 'By using Padel Boy, you agree to these terms. Please read them carefully.',
        service: {
          title: 'Service Description',
          desc: '<p>Padel Boy is a free web application for organizing padel tournaments. The service is provided "as is" without any warranties or guarantees.</p><div class="info-panel"><p><strong>What we DON\'T do:</strong> We do not charge fees, collect personal data, or display advertisements. The app runs entirely in your browser using local storage.</p></div>',
        },
        responsibilities: {
          title: 'User Responsibilities',
          desc: '<p>You are responsible for:</p><ul><li>Ensuring accurate player information and tournament settings</li><li>Managing your own data stored in browser localStorage</li><li>Using the app in compliance with local laws and regulations</li><li>Respecting other players\' privacy when sharing tournament results</li></ul><div class="info-panel"><p><strong>Important:</strong> We are not responsible for disputes, errors in tournament organization, or any outcomes resulting from app usage.</p></div>',
        },
        disclaimer: {
          title: 'Disclaimer of Warranties',
          desc: '<p>This app is provided without warranty of any kind, express or implied.</p><h3>We do not guarantee</h3><ul><li>Uninterrupted or error-free operation</li><li>Accuracy of match scheduling algorithms</li><li>Preservation of data (browser storage can be cleared)</li><li>Compatibility with all devices and browsers</li></ul><div class="info-panel"><p><strong>Use at your own risk:</strong> By using this service, you acknowledge and accept these limitations.</p></div>',
        },
        liability: {
          title: 'Limitation of Liability',
          desc: '<p>To the maximum extent permitted by law, we shall not be liable for:</p><ul><li>Loss of tournament data</li><li>Scheduling errors or incorrect match pairings</li><li>Disputes between players</li><li>Any direct, indirect, incidental, or consequential damages</li></ul><div class="info-panel"><p><strong>Your sole remedy</strong> is to discontinue use of the app.</p></div>',
        },
        changes: {
          title: 'Changes to Terms',
          desc: '<p>We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.</p><div class="info-panel"><p><strong>Last updated:</strong> February 4, 2026</p></div>',
        },
      },
      help: {
        title: 'Help & FAQ',
        back: 'Back',
        intro: 'Learn how to use Padel Boy and understand tournament formats.',
        gettingStarted: {
          title: 'Getting Started',
          desc: '<ol><li>Choose your tournament format (Americano or Mexicano)</li><li>Enter a tournament name or use the auto-generated one</li><li>Add players by clicking "Add Player" - you need at least 4 players</li><li>Adjust the number of courts (automatically calculated based on players)</li><li>Choose points per match (16, 21, 24, or 32) - standard is 21 points</li><li>Click "Start Tournament" to begin</li></ol><div class="info-panel"><p><strong>💾 Data Storage:</strong> Your tournament data is saved locally in your browser.</p></div><h3>Points Per Match Explained</h3><p>This setting determines the TOTAL combined points scored by both teams in each match. The match ends when the sum of both teams\' scores reaches this number.</p><h3>Available Options</h3><ul><li><strong>16 points</strong> - Quick matches (~9 min), ideal for large tournaments or time constraints</li><li><strong>21 points</strong> - Standard format (~12 min), balanced between speed and competition</li><li><strong>24 points</strong> - Extended matches (~14 min), more time to develop strategies</li><li><strong>32 points</strong> - Full-length matches (~18 min), professional tournament style</li></ul><h3>Example with 21 points</h3><ul><li>Match starts 0-0</li><li>Score progresses: 1-0, 2-1, 3-2, 5-3, 7-5, 9-7...</li><li>Match ends when combined score = 21 (e.g., 12-9, 11-10, or 15-6)</li><li>The team with more points wins that match</li><li>Both teams\' points count toward tournament rankings</li></ul><div class="info-panel"><p><strong>⚡ Why This System?</strong> All matches take similar time to complete, reducing wait times between rounds. Players on different courts finish at roughly the same time, keeping the tournament flowing smoothly.</p></div><h3>Final Rankings</h3><p>At the end of the tournament, players are ranked by their total points scored across all matches. The player with the most points wins.</p>',
        },
        americano: {
          title: 'Americano Format',
          desc: '<p>In Americano, all players compete against all other players over multiple rounds.</p><h3>How it works</h3><ul><li>Players are paired randomly</li><li>Each player partners with different teammates</li><li>Each player faces different opponents</li><li>Points are tracked individually</li><li>Perfect for social games where everyone plays together</li></ul><div class="info-panel"><p><strong>Ideal for:</strong> Casual games, social events, player development</p></div>',
        },
        mexicano: {
          title: 'Mexicano Format',
          desc: '<p>In Mexicano, players are paired dynamically based on current rankings.</p><h3>How it works</h3><ul><li>First rounds use random pairing</li><li>After initial rounds, top-ranked players face each other</li><li>Lower-ranked players also face similar-ranked opponents</li><li>Creates competitive, balanced matches</li><li>Rankings update after each round</li></ul><h3>Settings</h3><ul><li><strong>Pairing style:</strong> How partners are assigned (1st & 4th vs 2nd & 3rd, or 1st & 3rd vs 2nd & 4th)</li><li><strong>Random rounds:</strong> Number of initial rounds before ranking-based pairing</li></ul><div class="info-panel"><p><strong>Ideal for:</strong> Competitive tournaments, skill-based matchmaking</p></div>',
        },
        players: {
          title: 'Managing Players',
          desc: '<h3>Player Names</h3><ul><li>Cannot be empty or contain only spaces</li><li>Each name must be unique within the tournament</li><li>Maximum 40 players per tournament</li></ul><h3>Adding Players</h3><ul><li>You must select players for each new tournament</li><li>Player suggestions come from all completed tournaments stored in your browser</li><li>Type to search or select from suggestions</li><li>You need at least 4 players to start a tournament</li></ul><h3>Court Allocation</h3><ul><li>The app automatically suggests the optimal number of courts based on player count</li><li>You can manually adjust the court number if needed</li><li>You won\'t be able to set more courts than required to ensure all courts are used during rounds</li></ul>',
        },
        troubleshooting: {
          title: 'Troubleshooting',
          desc: '<h3>My tournament disappeared</h3><ul><li>Data is stored in browser localStorage</li><li>Clearing browser data will delete tournaments</li><li>Use incognito/private mode carefully - data is deleted when closed</li><li>If you have the link to a completed tournament, you can recreate its data (including player names and detailed results) by opening it</li></ul><h3>Can\'t add players</h3><ul><li>Maximum 40 players allowed</li><li>Check if "Start Tournament" button is enabled (needs 4+ players)</li></ul><h3>Language changed unexpectedly</h3><ul><li>Your language preference is saved automatically</li><li>Use the language switcher (top-right) to change it back</li></ul><div class="info-panel"><p><strong>Need help or found a bug?</strong><br>Report issues on our <a href="https://github.com/DarBrick/padel-boy/issues" target="_blank" rel="noopener noreferrer" class="text-[var(--color-padel-yellow)] hover:underline">GitHub project</a></p></div>',
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
        points: {
          label: 'Punkty na Mecz',
          desc: 'Liczba punktów do rozegrania w każdym meczu. Standard to 21 punktów.',
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
          desc: '<p>Kiedy wybierasz język, Twój wybór jest zapisywany w localStorage przeglądarki pod kluczem "i18nextLng".</p><p>Dzięki temu aplikacja pamięta Twój wybór języka przy kolejnych wizytach.</p><h3>Szczegóły Techniczne</h3><ul><li><strong>Cel:</strong> Niezbędne do wyświetlania interfejsu w preferowanym języku</li><li><strong>Przechowywane dane:</strong> Kod języka (np. "en", "pl", "es")</li></ul>',
        },
        tournaments: {
          title: 'Dane Turniejowe',
          desc: '<p>Konfiguracje turniejów, imiona graczy i wyniki meczów są przechowywane lokalnie w localStorage przeglądarki.</p><div class="info-panel"><p><strong>Gwarancja prywatności:</strong> Te dane nigdy nie opuszczają Twojego urządzenia i nie są dostępne dla nas ani żadnych osób trzecich.</p></div><h3>Co przechowujemy</h3><ul><li><strong>Cel:</strong> Niezbędne do utrzymania stanu turnieju między sesjami</li><li><strong>Przechowywane dane:</strong> Ustawienia turnieju, imiona graczy, wyniki meczów, tabele</li></ul>',
        },
        control: {
          title: 'Twoja Kontrola',
          desc: '<p>Masz pełną kontrolę nad swoimi danymi:</p><h3>Zarządzanie Danymi</h3><ul><li><strong>Czyszczenie danych przeglądarki:</strong> Wyczyszczenie pamięci podręcznej i plików cookie przeglądarki usunie wszystkie przechowywane informacje, w tym preferencje językowe i dane turniejowe</li><li><strong>Przeglądanie prywatne:</strong> Używanie trybu incognito/prywatnego oznacza, że dane są usuwane po zamknięciu przeglądarki</li><li><strong>Brak śledzenia:</strong> Nie używamy plików cookie ani localStorage do celów reklamowych, analitycznych lub śledzenia</li></ul>',
        },
      },
      terms: {
        title: 'Warunki Korzystania',
        back: 'Wróć',
        intro: 'Korzystając z Padel Boy, zgadzasz się na te warunki. Przeczytaj je uważnie.',
        service: {
          title: 'Opis Usługi',
          desc: '<p>Padel Boy to darmowa aplikacja internetowa do organizowania turniejów padla. Usługa jest świadczona "tak jak jest" bez żadnych gwarancji.</p><div class="info-panel"><p><strong>Czego NIE robimy:</strong> Nie pobieramy opłat, nie zbieramy danych osobowych ani nie wyświetlamy reklam. Aplikacja działa całkowicie w przeglądarce przy użyciu lokalnej pamięci.</p></div>',
        },
        responsibilities: {
          title: 'Obowiązki Użytkownika',
          desc: '<p>Jesteś odpowiedzialny za:</p><ul><li>Zapewnienie dokładnych informacji o graczach i ustawień turnieju</li><li>Zarządzanie własnymi danymi przechowywanymi w localStorage przeglądarki</li><li>Korzystanie z aplikacji zgodnie z lokalnymi przepisami</li><li>Szanowanie prywatności innych graczy przy udostępnianiu wyników turnieju</li></ul><div class="info-panel"><p><strong>Ważne:</strong> Nie ponosimy odpowiedzialności za spory, błędy w organizacji turnieju ani jakiekolwiek skutki wynikające z użytkowania aplikacji.</p></div>',
        },
        disclaimer: {
          title: 'Wyłączenie Gwarancji',
          desc: '<p>Ta aplikacja jest świadczona bez jakiejkolwiek gwarancji, wyraźnej lub dorozumianej.</p><h3>Nie gwarantujemy</h3><ul><li>Nieprzerwanej lub bezbłędnej pracy</li><li>Dokładności algorytmów planowania meczów</li><li>Zachowania danych (pamięć przeglądarki może zostać wyczyszczona)</li><li>Kompatybilności ze wszystkimi urządzeniami i przeglądarkami</li></ul><div class="info-panel"><p><strong>Użytkowanie na własne ryzyko:</strong> Korzystając z tej usługi, potwierdzasz i akceptujesz te ograniczenia.</p></div>',
        },
        liability: {
          title: 'Ograniczenie Odpowiedzialności',
          desc: '<p>W maksymalnym zakresie dozwolonym przez prawo nie ponosimy odpowiedzialności za:</p><ul><li>Utratę danych turniejowych</li><li>Błędy w harmonogramie lub nieprawidłowe parowanie meczów</li><li>Spory między graczami</li><li>Jakiekolwiek bezpośrednie, pośrednie, przypadkowe lub następcze szkody</li></ul><div class="info-panel"><p><strong>Jedyny środek zaradczy</strong> to zaprzestanie korzystania z aplikacji.</p></div>',
        },
        changes: {
          title: 'Zmiany Warunków',
          desc: '<p>Zastrzegamy sobie prawo do modyfikacji tych warunków w dowolnym momencie. Dalsze korzystanie z aplikacji po wprowadzeniu zmian oznacza akceptację nowych warunków.</p><div class="info-panel"><p><strong>Ostatnia aktualizacja:</strong> 4 lutego 2026</p></div>',
        },
      },
      help: {
        title: 'Pomoc i FAQ',
        back: 'Wróć',
        intro: 'Dowiedz się, jak korzystać z Padel Boy i poznaj formaty turniejów.',
        gettingStarted: {
          title: 'Pierwsze Kroki',
          desc: '1. Wybierz format turnieju (Americano lub Mexicano)\n2. Wprowadź nazwę turnieju lub użyj automatycznie wygenerowanej\n3. Dodaj graczy, klikając "Dodaj Gracza" - potrzebujesz co najmniej 4 graczy\n4. Dostosuj liczbę kortów (automatycznie obliczana na podstawie liczby graczy)\n5. Wybierz punkty na mecz (16, 21, 24 lub 32) - standard to 21 punktów\n6. Kliknij "Rozpocznij Turniej", aby rozpocząć\n\nDane turnieju są zapisywane lokalnie w przeglądarce.\n\nPunkty na Mecz - Wyjaśnienie:\nTo ustawienie określa ŁĄCZNĄ liczbę punktów zdobytych przez oба zespoły w każdym meczu. Mecz kończy się, gdy suma punktów obu zespołów osiągnie tę liczbę.\n\nDostępne Opcje:\n• 16 punktów - Szybkie mecze (~10-15 min), idealne dla dużych turniejów lub ograniczeń czasowych\n• 21 punktów - Standardowy format (~15-20 min), zrównoważony między szybkością a rywalizacją\n• 24 punkty - Wydłużone mecze (~20-25 min), więcej czasu na rozwijanie strategii\n• 32 punkty - Mecze pełnej długości (~30-40 min), styl profesjonalnych turniejów\n\nPrzykład z 21 punktami:\n• Mecz zaczyna się 0-0\n• Wynik postępuje: 1-0, 2-1, 3-2, 5-3, 7-5, 9-7...\n• Mecz kończy się, gdy łączny wynik = 21 (np. 12-9, 11-10 lub 15-6)\n• Zespół z większą liczbą punktów wygrywa ten mecz\n• Punkty obu zespołów liczą się do rankingu turnieju\n\nDlaczego Ten System?\nWszystkie mecze trwają podobny czas, co zmniejsza czas oczekiwania między rundami. Gracze na różnych kortach kończą w podobnym czasie, utrzymując płynną organizację turnieju.\n\nKońcowa Klasyfikacja:\nNa końcu turnieju gracze są klasyfikowani według łącznej liczby punktów zdobytych we wszystkich meczach. Gracz z największą liczbą punktów wygrywa.',
        },
        americano: {
          title: 'Format Americano',
          desc: '<p>W Americano wszyscy gracze rywalizują ze wszystkimi innymi graczami w wielu rundach.</p><h3>Jak to działa</h3><ul><li>Gracze są dobierani losowo</li><li>Każdy gracz gra z różnymi partnerami</li><li>Każdy gracz zmierza się z różnymi przeciwnikami</li><li>Punkty są śledzone indywidualnie</li><li>Idealny do gier towarzyskich, gdzie wszyscy grają razem</li></ul><div class="info-panel"><p><strong>Idealny dla:</strong> Gier towarzyskich, wydarzeń społecznych, rozwoju graczy</p></div>',
        },
        mexicano: {
          title: 'Format Mexicano',
          desc: '<p>W Mexicano gracze są dobierani dynamicznie na podstawie aktualnego rankingu.</p><h3>Jak to działa</h3><ul><li>Pierwsze rundy wykorzystują losowe parowanie</li><li>Po początkowych rundach najlepsi gracze grają ze sobą</li><li>Gracze z niższym rankingiem również grają z graczami o podobnym poziomie</li><li>Tworzy konkurencyjne, zrównoważone mecze</li><li>Rankingi aktualizowane po każdej rundzie</li></ul><h3>Ustawienia</h3><ul><li><strong>Styl parowania:</strong> Jak przydzielani są partnerzy (1. i 4. vs 2. i 3., lub 1. i 3. vs 2. i 4.)</li><li><strong>Rundy losowe:</strong> Liczba początkowych rund przed parowaniem według rankingu</li></ul><div class="info-panel"><p><strong>Idealny dla:</strong> Turniejów konkurencyjnych, dopasowania według umiejętności</p></div>',
        },
        players: {
          title: 'Zarządzanie Graczami',
          desc: '<h3>Nazwy Graczy</h3><ul><li>Nie mogą być puste lub zawierać tylko spacje</li><li>Każda nazwa musi być unikalna w turnieju</li><li>Maksymalnie 40 graczy na turniej</li></ul><h3>Dodawanie Graczy</h3><ul><li>Musisz wybrać graczy dla każdego nowego turnieju</li><li>Sugestie graczy pochodzą ze wszystkich zakończonych turniejów zapisanych w przeglądarce</li><li>Wpisz, aby wyszukać lub wybierz z sugestii</li><li>Potrzebujesz co najmniej 4 graczy, aby rozpocząć turniej</li></ul><h3>Przydział Kortów</h3><ul><li>Aplikacja automatycznie sugeruje optymalną liczbę kortów na podstawie liczby graczy</li><li>Możesz ręcznie dostosować liczbę kortów w razie potrzeby</li><li>Nie będziesz mógł ustawić więcej kortów niż potrzeba, aby zapewnić wykorzystanie wszystkich kortów podczas rund</li></ul>',
        },
        troubleshooting: {
          title: 'Rozwiązywanie Problemów',
          desc: '<h3>Mój turniej zniknął</h3><ul><li>Dane są przechowywane w localStorage przeglądarki</li><li>Wyczyszczenie danych przeglądarki usunie turnieje</li><li>Używaj trybu incognito/prywatnego ostrożnie - dane są usuwane po zamknięciu</li><li>Jeśli posiadasz link do zakończonego turnieju, możesz odtworzyć jego dane (w tym nazwy graczy i szczegółowe wyniki) otwierając go</li></ul><h3>Nie mogę dodać graczy</h3><ul><li>Maksymalnie 40 graczy</li><li>Sprawdź, czy przycisk "Rozpocznij Turniej" jest aktywny (wymaga 4+ graczy)</li></ul><h3>Język zmienił się nieoczekiwanie</h3><ul><li>Twoje preferencje językowe są zapisywane automatycznie</li><li>Użyj przełącznika języka (prawy górny róg), aby go zmienić</li></ul><div class="info-panel"><p><strong>Potrzebujesz pomocy lub znalazłeś błąd?</strong><br>Zgłoś problem na naszym <a href="https://github.com/DarBrick/padel-boy/issues" target="_blank" rel="noopener noreferrer" class="text-[var(--color-padel-yellow)] hover:underline">projekcie GitHub</a></p></div>',
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
        points: {
          label: 'Puntos por Partido',
          desc: 'Número de puntos a jugar en cada partido. El estándar es 21 puntos.',
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
          desc: '<p>Cuando seleccionas un idioma, tu elección se guarda en el localStorage de tu navegador bajo la clave "i18nextLng".</p><p>Esto permite que la aplicación recuerde tu preferencia de idioma en futuras visitas.</p><h3>Detalles Técnicos</h3><ul><li><strong>Propósito:</strong> Esencial para proporcionar la interfaz en tu idioma preferido</li><li><strong>Datos almacenados:</strong> Código de idioma (p. ej., "en", "pl", "es")</li></ul>',
        },
        tournaments: {
          title: 'Datos de Torneos',
          desc: '<p>Las configuraciones de torneos, nombres de jugadores y resultados de partidos se almacenan localmente en el localStorage de tu navegador.</p><div class="info-panel"><p><strong>Garantía de privacidad:</strong> Estos datos nunca salen de tu dispositivo y no son accesibles para nosotros ni para terceros.</p></div><h3>Qué almacenamos</h3><ul><li><strong>Propósito:</strong> Esencial para mantener el estado del torneo entre sesiones</li><li><strong>Datos almacenados:</strong> Configuraciones de torneos, nombres de jugadores, resultados de partidos, clasificaciones</li></ul>',
        },
        control: {
          title: 'Tu Control',
          desc: '<p>Tienes control total sobre tus datos:</p><h3>Gestión de Datos</h3><ul><li><strong>Borrar datos del navegador:</strong> Limpiar la caché y las cookies de tu navegador eliminará toda la información almacenada, incluidas las preferencias de idioma y los datos de torneos</li><li><strong>Navegación privada:</strong> Usar el modo incógnito/privado significa que los datos se eliminan cuando cierras el navegador</li><li><strong>Sin seguimiento:</strong> No usamos cookies ni localStorage con fines publicitarios, analíticos o de seguimiento</li></ul>',
        },
      },      terms: {
        title: 'Términos de Servicio',
        back: 'Volver',
        intro: 'Al usar Padel Boy, aceptas estos términos. Por favor, léelos cuidadosamente.',
        service: {
          title: 'Descripción del Servicio',
          desc: '<p>Padel Boy es una aplicación web gratuita para organizar torneos de pádel. El servicio se proporciona "tal cual" sin ninguna garantía.</p><div class="info-panel"><p><strong>Lo que NO hacemos:</strong> No cobramos tarifas, no recopilamos datos personales y no mostramos anuncios. La aplicación opera completamente en tu navegador usando almacenamiento local.</p></div>',
        },
        responsibilities: {
          title: 'Responsabilidades del Usuario',
          desc: '<p>Eres responsable de:</p><ul><li>Proporcionar información precisa sobre jugadores y configuraciones de torneos</li><li>Gestionar tus propios datos almacenados en el localStorage del navegador</li><li>Usar la aplicación conforme a las leyes locales</li><li>Respetar la privacidad de otros jugadores al compartir resultados de torneos</li></ul><div class="info-panel"><p><strong>Importante:</strong> No somos responsables de disputas, errores en la organización de torneos o consecuencias derivadas del uso de la aplicación.</p></div>',
        },
        disclaimer: {
          title: 'Descargo de Garantías',
          desc: '<p>Esta aplicación se proporciona sin garantía alguna, expresa o implícita.</p><h3>No garantizamos</h3><ul><li>Operación ininterrumpida o libre de errores</li><li>Precisión de los algoritmos de programación de partidos</li><li>Preservación de datos (el almacenamiento del navegador puede borrarse)</li><li>Compatibilidad con todos los dispositivos y navegadores</li></ul><div class="info-panel"><p><strong>Uso bajo tu propio riesgo:</strong> Al usar este servicio, reconoces y aceptas estas limitaciones.</p></div>',
        },
        liability: {
          title: 'Limitación de Responsabilidad',
          desc: '<p>En la medida máxima permitida por la ley, no somos responsables de:</p><ul><li>Pérdida de datos de torneos</li><li>Errores de programación o emparejamientos incorrectos</li><li>Disputas entre jugadores</li><li>Cualquier daño directo, indirecto, incidental o consecuente</li></ul><div class="info-panel"><p><strong>Tu único recurso</strong> es dejar de usar la aplicación.</p></div>',
        },
        changes: {
          title: 'Cambios en los Términos',
          desc: '<p>Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la aplicación después de los cambios constituye la aceptación de los nuevos términos.</p><div class="info-panel"><p><strong>Última actualización:</strong> 4 de febrero de 2026</p></div>',
        },
      },
      help: {
        title: 'Ayuda y Preguntas Frecuentes',
        back: 'Volver',
        intro: 'Aprende a usar Padel Boy y comprende los formatos de torneo.',
        gettingStarted: {
          title: 'Comenzando',
          desc: '1. Elige el formato del torneo (Americano o Mexicano)\n2. Ingresa el nombre del torneo o usa el generado automáticamente\n3. Añade jugadores haciendo clic en "Añadir Jugador" - necesitas al menos 4 jugadores\n4. Ajusta el número de pistas (calculado automáticamente según el número de jugadores)\n5. Elige puntos por partido (16, 21, 24 o 32) - el estándar es 21 puntos\n6. Haz clic en "Iniciar Torneo" para comenzar\n\nLos datos del torneo se guardan localmente en tu navegador.\n\nPuntos por Partido Explicado:\nEsta configuración determina el número TOTAL combinado de puntos anotados por ambos equipos en cada partido. El partido termina cuando la suma de las puntuaciones de ambos equipos alcanza este número.\n\nOpciones Disponibles:\n• 16 puntos - Partidos rápidos (~9 min), ideal para torneos grandes o restricciones de tiempo\n• 21 puntos - Formato estándar (~12 min), equilibrado entre velocidad y competición\n• 24 puntos - Partidos extendidos (~14 min), más tiempo para desarrollar estrategias\n• 32 puntos - Partidos completos (~18 min), estilo de torneos profesionales\n\nEjemplo con 21 puntos:\n• El partido comienza 0-0\n• El marcador progresa: 1-0, 2-1, 3-2, 5-3, 7-5, 9-7...\n• El partido termina cuando el marcador combinado = 21 (ej., 12-9, 11-10 o 15-6)\n• El equipo con más puntos gana ese partido\n• Los puntos de ambos equipos cuentan para la clasificación del torneo\n\n¿Por qué Este Sistema?\nTodos los partidos duran un tiempo similar, reduciendo los tiempos de espera entre rondas. Los jugadores en diferentes pistas terminan aproximadamente al mismo tiempo, manteniendo el torneo fluyendo sin problemas.\n\nClasificación Final:\nAl final del torneo, los jugadores se clasifican por sus puntos totales anotados en todos los partidos. El jugador con más puntos gana.',
        },
        americano: {
          title: 'Formato Americano',
          desc: '<p>En Americano, todos los jugadores compiten contra todos los demás jugadores en múltiples rondas.</p><h3>Cómo funciona</h3><ul><li>Los jugadores se emparejan al azar</li><li>Cada jugador juega con diferentes compañeros</li><li>Cada jugador se enfrenta a diferentes oponentes</li><li>Los puntos se rastrean individualmente</li><li>Ideal para juegos casuales donde todos juegan juntos</li></ul><div class="info-panel"><p><strong>Perfecto para:</strong> Juegos casuales, eventos sociales, desarrollo de jugadores</p></div>',
        },
        mexicano: {
          title: 'Formato Mexicano',
          desc: '<p>En Mexicano, los jugadores se emparejan dinámicamente según la clasificación actual.</p><h3>Cómo funciona</h3><ul><li>Las primeras rondas usan emparejamiento aleatorio</li><li>Después de las rondas iniciales, los mejores jugadores juegan entre sí</li><li>Los jugadores de menor clasificación también juegan con jugadores de nivel similar</li><li>Crea partidos competitivos y equilibrados</li><li>Las clasificaciones se actualizan después de cada ronda</li></ul><h3>Configuraciones</h3><ul><li><strong>Estilo de emparejamiento:</strong> Cómo se asignan los compañeros (1º y 4º vs 2º y 3º, o 1º y 3º vs 2º y 4º)</li><li><strong>Rondas aleatorias:</strong> Número de rondas iniciales antes del emparejamiento por clasificación</li></ul><div class="info-panel"><p><strong>Perfecto para:</strong> Torneos competitivos, emparejamiento por habilidad</p></div>',
        },
        players: {
          title: 'Gestión de Jugadores',
          desc: '<h3>Nombres de Jugadores</h3><ul><li>No pueden estar vacíos ni contener solo espacios</li><li>Cada nombre debe ser único dentro del torneo</li><li>Máximo 40 jugadores por torneo</li></ul><h3>Añadir Jugadores</h3><ul><li>Debes seleccionar jugadores para cada nuevo torneo</li><li>Las sugerencias de jugadores provienen de todos los torneos completados almacenados en tu navegador</li><li>Escribe para buscar o selecciona de las sugerencias</li><li>Necesitas al menos 4 jugadores para iniciar un torneo</li></ul><h3>Asignación de Pistas</h3><ul><li>La aplicación sugiere automáticamente el número óptimo de pistas según el número de jugadores</li><li>Puedes ajustar manualmente el número de pistas si es necesario</li><li>No podrás establecer más pistas de las necesarias para garantizar que todas las pistas se utilicen durante las rondas</li></ul>',
        },
        troubleshooting: {
          title: 'Solución de Problemas',
          desc: '<h3>Mi torneo desapareció</h3><ul><li>Los datos se almacenan en el localStorage del navegador</li><li>Borrar los datos del navegador eliminará los torneos</li><li>Usa el modo incógnito/privado con precaución: los datos se eliminan al cerrar</li><li>Si tienes el enlace a un torneo completado, puedes recrear sus datos (incluyendo nombres de jugadores y resultados detallados) abriéndolo</li></ul><h3>No puedo añadir jugadores</h3><ul><li>Máximo 40 jugadores</li><li>Verifica que el botón "Iniciar Torneo" esté activo (requiere 4+ jugadores)</li></ul><h3>El idioma cambió inesperadamente</h3><ul><li>Tu preferencia de idioma se guarda automáticamente</li><li>Usa el selector de idioma (esquina superior derecha) para cambiarlo</li></ul><div class="info-panel"><p><strong>¿Necesitas ayuda o encontraste un error?</strong><br>Reporta problemas en nuestro <a href="https://github.com/DarBrick/padel-boy/issues" target="_blank" rel="noopener noreferrer" class="text-[var(--color-padel-yellow)] hover:underline">proyecto de GitHub</a></p></div>',
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
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export default i18n
