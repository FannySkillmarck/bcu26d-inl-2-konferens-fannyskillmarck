import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Language = 'sv' | 'en';

export interface Translations {
  documentTitle: string;
  header: {
    brandAria: string;
    mainNavAria: string;
    mobileNavAria: string;
    jumpToPrefix: string;
    navProgram: string;
    navSpeakers: string;
    navTickets: string;
    navPractical: string;
    bookCta: string;
    bookCtaAria: string;
    openMenuAria: string;
    closeMenuAria: string;
    languageGroupAria: string;
    switchToSvAria: string;
    switchToEnAria: string;
  };
  hero: {
    dateLocation: string;
    dateLabel: string;
    venueLabel: string;
    heading: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    imageFallback: string;
  };
  schedule: {
    kicker: string;
    heading: string;
    filterGroupAria: string;
    filterAll: string;
    tracks: {
      Huvudscen: string;
      Workshop: string;
      Samtal: string;
    };
    speakerProfileAria: (speaker: string) => string;
  };
  speakers: {
    kicker: string;
    heading: string;
    intro: string;
    portraitAlt: (name: string, role: string) => string;
    cardAria: (
      name: string,
      role: string,
      city: string,
      sessionTitle: string,
      sessionTime: string,
      email: string
    ) => string;
  };
  tickets: {
    kicker: string;
    heading: string;
    intro: string;
    recommended: string;
    selectCta: (name: string) => string;
    selectAria: (name: string, price: string) => string;
  };
  practical: {
    kicker: string;
    heading: string;
    mapFallback: string;
    addressCaption: string;
  };
  howToGetHere: {
    heading: string;
    intro: string;
    missingKeyNoticeBefore: string;
    missingKeyNoticeAfter: string;
    loadError: string;
    originLabel: string;
    originPlaceholder: string;
    originInputAria: string;
    suggestionsAria: string;
    selectOriginAria: (label: string) => string;
    searchSubmit: string;
    searchSubmitAria: string;
    loadingSuggestions: string;
    quickOriginsTitle: string;
    quickOriginAria: (hub: string) => string;
    travelModeTitle: string;
    travelModeGroupAria: string;
    travelModes: {
      TRANSIT: { label: string; ariaLabel: string };
      WALKING: { label: string; ariaLabel: string };
      BICYCLING: { label: string; ariaLabel: string };
      DRIVING: { label: string; ariaLabel: string };
    };
    calculatingRoute: (origin: string) => string;
    fromPrefix: (origin: string) => string;
    loadingMap: string;
    noRouteError: (origin: string) => string;
    routeFetchError: string;
    venueResolveError: string;
    venueDataError: string;
    hoursUnit: string;
    minutesUnit: string;
  };
  speakerModal: {
    closeAria: string;
    portraitAlt: (name: string) => string;
    sessionLabel: string;
    viewInSchedule: string;
  };
  ticketModal: {
    closeAria: string;
    reservedLabel: string;
    thankYou: (name: string) => string;
    confirmationPrefix: string;
    confirmationMiddle: string;
    confirmationSuffix: string;
    closeBtn: string;
    bookingEyebrow: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    quantityLabel: string;
    quantityOption: (n: number) => string;
    dietaryLabel: string;
    dietaryPlaceholder: string;
    nameError: string;
    emailError: string;
    totalLabel: string;
    submitBtn: string;
    currencySuffix: string;
  };
  newsletter: {
    heading: string;
    description: string;
    subscribedPrefix: string;
    changeEmailBtn: string;
    changeEmailAria: string;
    inputLabel: string;
    inputPlaceholder: string;
    inputAria: string;
    submitBtn: string;
    submitAria: string;
    invalidEmailError: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    navAria: string;
  };
}

const TRANSLATIONS: Record<Language, Translations> = {
  sv: {
    documentTitle: 'Stjärnfall 2027 — Symposium om astrologi & kosmisk tid',
    header: {
      brandAria: 'Stjärnfall 2027 — Gå till sidans topp',
      mainNavAria: 'Huvudnavigation',
      mobileNavAria: 'Mobilnavigation',
      jumpToPrefix: 'Hoppa till sektionen',
      navProgram: 'Program',
      navSpeakers: 'Talare',
      navTickets: 'Biljetter',
      navPractical: 'Praktiskt',
      bookCta: 'Boka plats',
      bookCtaAria: 'Boka plats — Gå till biljettnivåer',
      openMenuAria: 'Öppna navigationsmeny',
      closeMenuAria: 'Stäng navigationsmeny',
      languageGroupAria: 'Välj språk',
      switchToSvAria: 'Byt språk till svenska',
      switchToEnAria: 'Byt språk till engelska',
    },
    hero: {
      dateLocation: 'Stockholm ·',
      dateLabel: '20 oktober 2027',
      venueLabel: '· Münchenbryggeriet',
      heading: 'Där himmelsmekanik möter samtida kultur',
      description:
        'Ett heldagssymposium om astrologi, historiska stjärnatlaser och planetära tidslinjer. Sex nordiska röster utforskar hur stjärnhimlen formar vår uppfattning om tid, arkitektur och berättande.',
      primaryCta: 'Välj biljett',
      secondaryCta: 'Utforska schemat',
      imageFallback: 'Münchenbryggeriet — Mälarsalen',
    },
    schedule: {
      kicker: '01. Dagsprogram',
      heading: 'Sex föreläsningar från gryning till skymning',
      filterGroupAria: 'Filtrera programpunkter efter format',
      filterAll: 'Alla',
      tracks: {
        Huvudscen: 'Huvudscen',
        Workshop: 'Workshop',
        Samtal: 'Samtal',
      },
      speakerProfileAria: (speaker) => `Visa talarprofil för ${speaker}`,
    },
    speakers: {
      kicker: '02. Medverkande talare',
      heading: 'Forskare, formgivare och astrologer',
      intro:
        'Håll muspekaren över eller navigera med Tab till ett porträtt för att visa kontaktuppgifter och föreläsningstitel. Välj ett kort för fullständig biografi.',
      portraitAlt: (name, role) => `Porträtt av ${name}, ${role}`,
      cardAria: (name, role, city, sessionTitle, sessionTime, email) =>
        `${name}, ${role} från ${city}. Föreläsning: ${sessionTitle}, ${sessionTime}. Kontakt: ${email}. Öppna fullständig biografi.`,
    },
    tickets: {
      kicker: '03. Biljettnivåer',
      heading: 'Välj det pass som passar din dag',
      intro:
        'Alla biljetter inkluderar garderob, programhäfte och fri tillgång till utställningsytan i foajén.',
      recommended: 'Rekommenderad',
      selectCta: (name) => `Välj ${name}`,
      selectAria: (name, price) => `Välj biljettnivå ${name} för ${price}`,
    },
    practical: {
      kicker: '04. Praktisk information',
      heading: 'Hitta till Münchenbryggeriet',
      mapFallback: 'Karta: Torkel Knutssonsgatan 2, Stockholm',
      addressCaption: 'Torkel Knutssonsgatan 2, Södermalm',
    },
    howToGetHere: {
      heading: 'Hur du tar dig hit',
      intro:
        'Planera din resväg till Münchenbryggeriet med kollektivtrafik, cykel, bil eller till fots direkt via Google Maps.',
      missingKeyNoticeBefore:
        'Reseplaneraren kräver en konfigurerad Google Maps-nyckel (',
      missingKeyNoticeAfter:
        '). Se kollektivtrafik och orienteringskarta ovan för vägbeskrivning till Torkel Knutssonsgatan 2.',
      loadError:
        'Kunde inte ladda Google Maps-kartan just nu. Använd orienteringskartan och kollektivtrafikinformationen ovan för att hitta till Torkel Knutssonsgatan 2.',
      originLabel: 'Var reser du ifrån?',
      originPlaceholder: 'Skriv adress, station eller plats...',
      originInputAria:
        'Ange startadress eller hållplats för vägbeskrivning till Münchenbryggeriet',
      suggestionsAria: 'Adressförslag',
      selectOriginAria: (label) => `Välj startplats ${label}`,
      searchSubmit: 'Visa',
      searchSubmitAria: 'Sök vägbeskrivning från angiven startadress',
      loadingSuggestions: 'Hämtar platsförslag...',
      quickOriginsTitle: 'Vanliga knutpunkter',
      quickOriginAria: (hub) => `Beräkna resväg från ${hub}`,
      travelModeTitle: 'Färdsätt',
      travelModeGroupAria: 'Välj färdsätt',
      travelModes: {
        TRANSIT: {
          label: 'Kollektivt',
          ariaLabel: 'Välj kollektivtrafik som färdsätt',
        },
        WALKING: {
          label: 'Till fots',
          ariaLabel: 'Välj promenad som färdsätt',
        },
        BICYCLING: {
          label: 'Cykel',
          ariaLabel: 'Välj cykel som färdsätt',
        },
        DRIVING: {
          label: 'Bil',
          ariaLabel: 'Välj bil som färdsätt',
        },
      },
      calculatingRoute: (origin) => `Beräknar resväg från ${origin}...`,
      fromPrefix: (origin) => `Från ${origin}`,
      loadingMap: 'Läser in Google Maps och platsdata...',
      noRouteError: (origin) =>
        `Kunde inte hitta någon resväg från ${origin} med valt färdsätt.`,
      routeFetchError:
        'Vägbeskrivningen kunde inte hämtas just nu. Kontrollera startadressen och försök igen.',
      venueResolveError: 'Kunde inte hämta platskoordinater från Google Maps.',
      venueDataError: 'Kunde inte hämta platsdata från Google Maps.',
      hoursUnit: 'tim',
      minutesUnit: 'min',
    },
    speakerModal: {
      closeAria: 'Stäng talarprofil',
      portraitAlt: (name) => `Porträtt av ${name}`,
      sessionLabel: 'Föreläsning',
      viewInSchedule: 'Visa i programmet',
    },
    ticketModal: {
      closeAria: 'Stäng bokningsformulär',
      reservedLabel: 'Plats reserverad',
      thankYou: (name) => `Tack, ${name}`,
      confirmationPrefix: 'Din reservation för',
      confirmationMiddle: 'har registrerats. En bekräftelse skickas till',
      confirmationSuffix: '.',
      closeBtn: 'Stäng',
      bookingEyebrow: 'Biljettbokning · Stjärnfall 2027',
      nameLabel: 'Namn',
      namePlaceholder: 'För- och efternamn',
      emailLabel: 'E-postadress',
      emailPlaceholder: 'namn@exempel.se',
      quantityLabel: 'Antal biljetter',
      quantityOption: (n) => `${n} st`,
      dietaryLabel: 'Specialkost (valfritt)',
      dietaryPlaceholder: 'T.ex. vegetarisk',
      nameError: 'Ange ditt för- och efternamn.',
      emailError: 'Ange en giltig e-postadress för biljettbekräftelsen.',
      totalLabel: 'Totalt att betala',
      submitBtn: 'Slutför bokning',
      currencySuffix: 'kr',
    },
    newsletter: {
      heading: 'Nyhetsbrev inför 2027',
      description:
        'Få utskick om programsläpp, talare och eventuella extraplatser till symposiet.',
      subscribedPrefix: 'Anmäld! Utskicken skickas till',
      changeEmailBtn: 'Ändra adress',
      changeEmailAria: 'Anmäl ytterligare en e-postadress till nyhetsbrevet',
      inputLabel: 'E-postadress för nyhetsbrev',
      inputPlaceholder: 'namn@exempel.se',
      inputAria: 'E-postadress för uppdateringar om Stjärnfall 2027',
      submitBtn: 'Prenumerera',
      submitAria: 'Prenumerera på uppdateringar om Stjärnfall 2027',
      invalidEmailError: 'Ange en giltig e-postadress.',
    },
    footer: {
      tagline:
        'Nordiskt symposium om astrologi, himmelsmekanik och kosmisk tid på Münchenbryggeriet i Stockholm.',
      copyright: '© 2027 Stjärnfall Symposium · Alla rättigheter förbehållna',
      navAria: 'Sidfotsnavigation',
    },
  },
  en: {
    documentTitle: 'Stjärnfall 2027 — Symposium on Astrology & Cosmic Time',
    header: {
      brandAria: 'Stjärnfall 2027 — Go to top of page',
      mainNavAria: 'Main navigation',
      mobileNavAria: 'Mobile navigation',
      jumpToPrefix: 'Jump to section',
      navProgram: 'Schedule',
      navSpeakers: 'Speakers',
      navTickets: 'Tickets',
      navPractical: 'Practical',
      bookCta: 'Book pass',
      bookCtaAria: 'Book pass — Go to ticket tiers',
      openMenuAria: 'Open navigation menu',
      closeMenuAria: 'Close navigation menu',
      languageGroupAria: 'Choose language',
      switchToSvAria: 'Switch language to Swedish',
      switchToEnAria: 'Switch language to English',
    },
    hero: {
      dateLocation: 'Stockholm ·',
      dateLabel: 'October 20, 2027',
      venueLabel: '· Münchenbryggeriet',
      heading: 'Where celestial mechanics meets contemporary culture',
      description:
        'A full-day symposium on astrology, historical star atlases, and planetary timelines. Six Nordic voices explore how the night sky shapes our understanding of time, architecture, and storytelling.',
      primaryCta: 'Choose ticket',
      secondaryCta: 'Explore schedule',
      imageFallback: 'Münchenbryggeriet — Mälarsalen',
    },
    schedule: {
      kicker: '01. Daily Schedule',
      heading: 'Six lectures from dawn to dusk',
      filterGroupAria: 'Filter schedule sessions by format',
      filterAll: 'All',
      tracks: {
        Huvudscen: 'Main Stage',
        Workshop: 'Workshop',
        Samtal: 'Conversation',
      },
      speakerProfileAria: (speaker) => `View speaker profile for ${speaker}`,
    },
    speakers: {
      kicker: '02. Featured Speakers',
      heading: 'Researchers, designers, and astrologers',
      intro:
        'Hover over or Tab to a portrait to reveal contact details and talk title. Select any card to read the full biography.',
      portraitAlt: (name, role) => `Portrait of ${name}, ${role}`,
      cardAria: (name, role, city, sessionTitle, sessionTime, email) =>
        `${name}, ${role} from ${city}. Talk: ${sessionTitle}, ${sessionTime}. Contact: ${email}. Open full biography.`,
    },
    tickets: {
      kicker: '03. Ticket Tiers',
      heading: 'Choose the pass that fits your day',
      intro:
        'All tickets include coat check, printed programme booklet, and complimentary access to the foyer exhibition space.',
      recommended: 'Recommended',
      selectCta: (name) => `Select ${name}`,
      selectAria: (name, price) => `Select ${name} ticket tier for ${price}`,
    },
    practical: {
      kicker: '04. Practical Information',
      heading: 'Getting to Münchenbryggeriet',
      mapFallback: 'Map: Torkel Knutssonsgatan 2, Stockholm',
      addressCaption: 'Torkel Knutssonsgatan 2, Södermalm',
    },
    howToGetHere: {
      heading: 'How to get here',
      intro:
        'Plan your route to Münchenbryggeriet by public transit, bicycle, car, or on foot directly via Google Maps.',
      missingKeyNoticeBefore:
        'The route planner requires a configured Google Maps key (',
      missingKeyNoticeAfter:
        '). See the transit details and static orientation map above for directions to Torkel Knutssonsgatan 2.',
      loadError:
        'Could not load Google Maps right now. Use the orientation map and transit details above to reach Torkel Knutssonsgatan 2.',
      originLabel: 'Where are you travelling from?',
      originPlaceholder: 'Enter address, station, or place...',
      originInputAria:
        'Enter starting address or transit stop for directions to Münchenbryggeriet',
      suggestionsAria: 'Address suggestions',
      selectOriginAria: (label) => `Select starting point ${label}`,
      searchSubmit: 'Show',
      searchSubmitAria: 'Search directions from entered starting address',
      loadingSuggestions: 'Loading place suggestions...',
      quickOriginsTitle: 'Common transit hubs',
      quickOriginAria: (hub) => `Calculate route from ${hub}`,
      travelModeTitle: 'Travel mode',
      travelModeGroupAria: 'Choose travel mode',
      travelModes: {
        TRANSIT: {
          label: 'Transit',
          ariaLabel: 'Select public transit as travel mode',
        },
        WALKING: {
          label: 'Walking',
          ariaLabel: 'Select walking as travel mode',
        },
        BICYCLING: {
          label: 'Cycling',
          ariaLabel: 'Select cycling as travel mode',
        },
        DRIVING: {
          label: 'Driving',
          ariaLabel: 'Select driving as travel mode',
        },
      },
      calculatingRoute: (origin) => `Calculating route from ${origin}...`,
      fromPrefix: (origin) => `From ${origin}`,
      loadingMap: 'Loading Google Maps and venue data...',
      noRouteError: (origin) =>
        `Could not find a route from ${origin} with the selected travel mode.`,
      routeFetchError:
        'Directions could not be fetched right now. Check the starting address and try again.',
      venueResolveError:
        'Could not retrieve venue coordinates from Google Maps.',
      venueDataError: 'Could not retrieve venue data from Google Maps.',
      hoursUnit: 'hr',
      minutesUnit: 'min',
    },
    speakerModal: {
      closeAria: 'Close speaker profile',
      portraitAlt: (name) => `Portrait of ${name}`,
      sessionLabel: 'Lecture',
      viewInSchedule: 'View in schedule',
    },
    ticketModal: {
      closeAria: 'Close booking form',
      reservedLabel: 'Seat reserved',
      thankYou: (name) => `Thank you, ${name}`,
      confirmationPrefix: 'Your reservation for',
      confirmationMiddle: 'has been recorded. A confirmation will be sent to',
      confirmationSuffix: '.',
      closeBtn: 'Close',
      bookingEyebrow: 'Ticket Booking · Stjärnfall 2027',
      nameLabel: 'Full name',
      namePlaceholder: 'First and last name',
      emailLabel: 'Email address',
      emailPlaceholder: 'name@example.com',
      quantityLabel: 'Number of tickets',
      quantityOption: (n) => `${n} ${n === 1 ? 'ticket' : 'tickets'}`,
      dietaryLabel: 'Dietary requirements (optional)',
      dietaryPlaceholder: 'E.g. vegetarian',
      nameError: 'Please enter your first and last name.',
      emailError: 'Please enter a valid email address for confirmation.',
      totalLabel: 'Total due',
      submitBtn: 'Complete booking',
      currencySuffix: 'SEK',
    },
    newsletter: {
      heading: 'Newsletter for 2027',
      description:
        'Receive updates on programme releases, speakers, and additional seat availability for the symposium.',
      subscribedPrefix: 'Subscribed! Updates will be sent to',
      changeEmailBtn: 'Change address',
      changeEmailAria: 'Subscribe another email address to the newsletter',
      inputLabel: 'Email address for newsletter',
      inputPlaceholder: 'name@example.com',
      inputAria: 'Email address for Stjärnfall 2027 updates',
      submitBtn: 'Subscribe',
      submitAria: 'Subscribe to Stjärnfall 2027 updates',
      invalidEmailError: 'Please enter a valid email address.',
    },
    footer: {
      tagline:
        'Nordic symposium on astrology, celestial mechanics, and cosmic time at Münchenbryggeriet in Stockholm.',
      copyright: '© 2027 Stjärnfall Symposium · All rights reserved',
      navAria: 'Footer navigation',
    },
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'stjarnfall-lang';

function getInitialLanguage(): Language {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'sv') return saved;
  } catch {
    // Ignore storage errors in restricted iframes
  }
  return 'sv';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors in restricted iframes
    }
  };

  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.documentTitle;
  }, [language, t.documentTitle]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
