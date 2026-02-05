const translation = {
  lang: 'pl',
  appName: 'Padel Boy',
  home: {
    subtitle: 'Organizuj i zarządzaj grami w Padel z łatwością. Bezpłatnie, bez opłat.',
    underDevelopment:
      'Ten produkt jest aktualnie w fazie aktywnego rozwoju. Nowe funkcje są regularnie dodawane.',
    viewRoadmap: 'Zobacz Plan Rozwoju',
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
  roadmap: {
    title: 'Plan Rozwoju',
    subtitle: 'Zobacz, nad czym pracujemy i co nadchodzi',
    back: 'Wróć',
    completed: 'Ukończone',
    inProgress: 'W Trakcie',
    planned: 'Zaplanowane',
    features: [
      'Start projektu!',
      'Możliwość organizacji Americano dla indywidualnych graczy',
      'Możliwość organizacji Mexicano dla indywidualnych graczy',
      'Lokalny słownik graczy, znani gracze',
      'Przechowywanie i udostępnianie wyników turnieju przez unikalny link',
      'Ponowne otwieranie turniejów',
      'Cofnięcie do ostatniej rundy',
      'Rozszerzone dostępne statystyki turnieju',
      'Eksport/import danych pojedynczego lub wielu turniejów',
      'Statystyki graczy w wielu turniejach',
      'Kod QR do udostępniania turniejów',
      'Dodanie wsparcia dla gry w turnieju w stałych parach',
    ],
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
  footer: {
    home: 'Strona główna',
    roadmap: 'Plan Rozwoju',
    createdBy: 'Stworzono przez Dariusz W.',
    github: 'GitHub',
    license: 'CC BY-NC-SA 4.0',
    version: 'Wersja',
  },
  cookieBanner: {
    message: 'Ta aplikacja przechowuje Twoje preferencje i informacje o turniejach lokalnie w Twojej przeglądarce.',
    accept: 'Rozumiem',
    close: 'Zamknij',
  },
  privacy: {
    title: 'Polityka Prywatności',
    back: 'Wróć',
    intro:
      'Padel Boy to darmowa aplikacja, która przechowuje wszystkie dane lokalnie w Twojej przeglądarce. Nie zbieramy, nie przesyłamy ani nie przechowujemy żadnych danych osobowych na zewnętrznych serwerach.',
    language: {
      title: 'Preferencje Językowe',
      desc: '<p>Kiedy wybierasz język, Twój wybór jest zapisywany w localStorage przeglądarki pod kluczem "i18nextLng".</p><p>Dzięki temu aplikacja pamięta Twój wybór języka przy kolejnych wizytach.</p><h3>Szczegóły Techniczne</h3><ul><li><strong>Cel:</strong> Niezbędne do wyświetlania interfejsu w preferowanym języku</li><li><strong>Przechowywane dane:</strong> Kod języka (np. "en", "pl", "es")</li></ul>',
    },
    tournaments: {
      title: 'Dane Turniejowe',
      desc: '<p>Konfiguracje turniejów, imiona graczy i wyniki meczów są przechowywane lokalnie w localStorage przeglądarki.</p><infoPanel><p><strong>Gwarancja prywatności:</strong> Te dane nigdy nie opuszczają Twojego urządzenia i nie są dostępne dla nas ani żadnych osób trzecich.</p></infoPanel><h3>Co przechowujemy</h3><ul><li><strong>Cel:</strong> Niezbędne do utrzymania stanu turnieju między sesjami</li><li><strong>Przechowywane dane:</strong> Ustawienia turnieju, imiona graczy, wyniki meczów, tabele</li></ul>',
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
      desc: '<p>Padel Boy to darmowa aplikacja internetowa do organizowania turniejów padla. Usługa jest świadczona "tak jak jest" bez żadnych gwarancji.</p><infoPanel><p><strong>Czego NIE robimy:</strong> Nie pobieramy opłat, nie zbieramy danych osobowych ani nie wyświetlamy reklam. Aplikacja działa całkowicie w przeglądarce przy użyciu lokalnej pamięci.</p></infoPanel>',
    },
    responsibilities: {
      title: 'Obowiązki Użytkownika',
      desc: '<p>Jesteś odpowiedzialny za:</p><ul><li>Zapewnienie dokładnych informacji o graczach i ustawień turnieju</li><li>Zarządzanie własnymi danymi przechowywanymi w localStorage przeglądarki</li><li>Korzystanie z aplikacji zgodnie z lokalnymi przepisami</li><li>Szanowanie prywatności innych graczy przy udostępnianiu wyników turnieju</li></ul><infoPanel><p><strong>Ważne:</strong> Nie ponosimy odpowiedzialności za spory, błędy w organizacji turnieju ani jakiekolwiek skutki wynikające z użytkowania aplikacji.</p></infoPanel>',
    },
    disclaimer: {
      title: 'Wyłączenie Gwarancji',
      desc: '<p>Ta aplikacja jest świadczona bez jakiejkolwiek gwarancji, wyraźnej lub dorozumianej.</p><h3>Nie gwarantujemy</h3><ul><li>Nieprzerwanej lub bezbłędnej pracy</li><li>Dokładności algorytmów planowania meczów</li><li>Zachowania danych (pamięć przeglądarki może zostać wyczyszczona)</li><li>Kompatybilności ze wszystkimi urządzeniami i przeglądarkami</li></ul><infoPanel><p><strong>Użytkowanie na własne ryzyko:</strong> Korzystając z tej usługi, potwierdzasz i akceptujesz te ograniczenia.</p></infoPanel>',
    },
    liability: {
      title: 'Ograniczenie Odpowiedzialności',
      desc: '<p>W maksymalnym zakresie dozwolonym przez prawo nie ponosimy odpowiedzialności za:</p><ul><li>Utratę danych turniejowych</li><li>Błędy w harmonogramie lub nieprawidłowe parowanie meczów</li><li>Spory między graczami</li><li>Jakiekolwiek bezpośrednie, pośrednie, przypadkowe lub następcze szkody</li></ul><infoPanel><p><strong>Jedyny środek zaradczy</strong> to zaprzestanie korzystania z aplikacji.</p></infoPanel>',
    },
    changes: {
      title: 'Zmiany Warunków',
      desc: '<p>Zastrzegamy sobie prawo do modyfikacji tych warunków w dowolnym momencie. Dalsze korzystanie z aplikacji po wprowadzeniu zmian oznacza akceptację nowych warunków.</p><infoPanel><p><strong>Ostatnia aktualizacja:</strong> 4 lutego 2026</p></infoPanel>',
    },
  },
  help: {
    title: 'Pomoc i FAQ',
    back: 'Wróć',
    intro: 'Dowiedz się, jak korzystać z Padel Boy i poznaj formaty turniejów.',
    gettingStarted: {
      title: 'Pierwsze Kroki',
      desc: '<ol><li>Wybierz format turnieju (Americano lub Mexicano)</li><li>Wprowadź nazwę turnieju lub użyj automatycznie wygenerowanej</li><li>Dodaj graczy, klikając "Dodaj Gracza" - potrzebujesz co najmniej 4 graczy</li><li>Dostosuj liczbę kortów (automatycznie obliczana na podstawie liczby graczy)</li><li>Wybierz punkty na mecz (16, 21, 24 lub 32) - standard to 21 punktów</li><li>Kliknij "Rozpocznij Turniej", aby rozpocząć</li></ol><infoPanel><p><strong>Przechowywanie danych:</strong> Dane turnieju są zapisywane lokalnie w przeglądarce.</p></infoPanel><h3>Punkty na Mecz - Wyjaśnienie</h3><p>To ustawienie określa ŁĄCZNĄ liczbę punktów zdobytych przez oba zespoły w każdym meczu. Mecz kończy się, gdy suma punktów obu zespołów osiągnie tę liczbę.</p><h3>Dostępne Opcje</h3><ul><li><strong>16 punktów</strong> - Szybkie mecze (~10-15 min), idealne dla dużych turniejów lub ograniczeń czasowych</li><li><strong>21 punktów</strong> - Standardowy format (~15-20 min), zrównoważony między szybkością a rywalizacją</li><li><strong>24 punkty</strong> - Wydłużone mecze (~20-25 min), więcej czasu na rozwijanie strategii</li><li><strong>32 punkty</strong> - Mecze pełnej długości (~30-40 min), styl profesjonalnych turniejów</li></ul><h3>Przykład z 21 punktami</h3><ul><li>Mecz zaczyna się 0-0</li><li>Wynik postępuje: 1-0, 2-1, 3-2, 5-3, 7-5, 9-7...</li><li>Mecz kończy się, gdy łączny wynik = 21 (np. 12-9, 11-10 lub 15-6)</li><li>Zespół z większą liczbą punktów wygrywa ten mecz</li><li>Punkty obu zespołów liczą się do rankingu turnieju</li></ul><infoPanel><p><strong>Dlaczego ten system?</strong> Wszystkie mecze trwają podobny czas, co zmniejsza czas oczekiwania między rundami. Gracze na różnych kortach kończą w podobnym czasie, utrzymując płynną organizację turnieju.</p></infoPanel><h3>Końcowa Klasyfikacja</h3><p>Na końcu turnieju gracze są klasyfikowani według łącznej liczby punktów zdobytych we wszystkich meczach. Gracz z największą liczbą punktów wygrywa.</p>',
    },
    americano: {
      title: 'Format Americano',
      desc: '<p>W Americano wszyscy gracze rywalizują ze wszystkimi innymi graczami w wielu rundach.</p><h3>Jak to działa</h3><ul><li>Gracze są dobierani losowo</li><li>Każdy gracz gra z różnymi partnerami</li><li>Każdy gracz zmierza się z różnymi przeciwnikami</li><li>Punkty są śledzone indywidualnie</li><li>Idealny do gier towarzyskich, gdzie wszyscy grają razem</li></ul><infoPanel><p><strong>Idealny dla:</strong> Gier towarzyskich, wydarzeń społecznych, rozwoju graczy</p></infoPanel>',
    },
    mexicano: {
      title: 'Format Mexicano',
      desc: '<p>W Mexicano gracze są dobierani dynamicznie na podstawie aktualnego rankingu.</p><h3>Jak to działa</h3><ul><li>Pierwsze rundy wykorzystują losowe parowanie</li><li>Po początkowych rundach najlepsi gracze grają ze sobą</li><li>Gracze z niższym rankingiem również grają z graczami o podobnym poziomie</li><li>Tworzy konkurencyjne, zrównoważone mecze</li><li>Rankingi aktualizowane po każdej rundzie</li></ul><h3>Ustawienia</h3><ul><li><strong>Styl parowania:</strong> Jak przydzielani są partnerzy (1. i 4. vs 2. i 3., lub 1. i 3. vs 2. i 4.)</li><li><strong>Rundy losowe:</strong> Liczba początkowych rund przed parowaniem według rankingu</li></ul><infoPanel><p><strong>Idealny dla:</strong> Turniejów konkurencyjnych, dopasowania według umiejętności</p></infoPanel>',
    },
    players: {
      title: 'Zarządzanie Graczami',
      desc: '<h3>Nazwy Graczy</h3><ul><li>Nie mogą być puste lub zawierać tylko spacje</li><li>Każda nazwa musi być unikalna w turnieju</li><li>Maksymalnie 40 graczy na turniej</li></ul><h3>Dodawanie Graczy</h3><ul><li>Musisz wybrać graczy dla każdego nowego turnieju</li><li>Sugestie graczy pochodzą ze wszystkich zakończonych turniejów zapisanych w przeglądarce</li><li>Wpisz, aby wyszukać lub wybierz z sugestii</li><li>Potrzebujesz co najmniej 4 graczy, aby rozpocząć turniej</li></ul><h3>Przydział Kortów</h3><ul><li>Aplikacja automatycznie sugeruje optymalną liczbę kortów na podstawie liczby graczy</li><li>Możesz ręcznie dostosować liczbę kortów w razie potrzeby</li><li>Nie będziesz mógł ustawić więcej kortów niż potrzeba, aby zapewnić wykorzystanie wszystkich kortów podczas rund</li></ul>',
    },
    troubleshooting: {
      title: 'Rozwiązywanie Problemów',
      desc: '<h3>Mój turniej zniknął</h3><ul><li>Dane są przechowywane w localStorage przeglądarki</li><li>Wyczyszczenie danych przeglądarki usunie turnieje</li><li>Używaj trybu incognito/prywatnego ostrożnie - dane są usuwane po zamknięciu</li><li>Jeśli posiadasz link do zakończonego turnieju, możesz odtworzyć jego dane (w tym nazwy graczy i szczegółowe wyniki) otwierając go</li></ul><h3>Nie mogę dodać graczy</h3><ul><li>Maksymalnie 40 graczy</li><li>Sprawdź, czy przycisk "Rozpocznij Turniej" jest aktywny (wymaga 4+ graczy)</li></ul><h3>Język zmienił się nieoczekiwanie</h3><ul><li>Twoje preferencje językowe są zapisywane automatycznie</li><li>Użyj przełącznika języka (prawy górny róg), aby go zmienić</li></ul><infoPanel><p><strong>Potrzebujesz pomocy lub znalazłeś błąd?</strong><br>Zgłoś problem na naszym <githubIssuesLink>projekcie GitHub</githubIssuesLink></p></infoPanel>',
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
} as const

export default translation
