import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Language = 'sv' | 'en' | 'zh';

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
    switchToZhAria: string;
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
    addToCalendarBtn: string;
    addToCalendarAria: (title: string) => string;
    calendarMenuAria: (title: string) => string;
    googleCalendar: string;
    outlookWeb: string;
    outlookIcs: string;
    savedConfirmation: string;
    remindMeBtn: string;
    reminderActiveBtn: string;
    remindMeAria: (title: string) => string;
    reminderActiveAria: (title: string) => string;
    remindersBarLabel: (count: number) => string;
    remindersBarEmpty: string;
    remindersTestBtn: string;
    remindersTestAria: string;
    remindersEnableBtn: string;
    remindersClearBtn: string;
    remindersBlockedNotice: string;
    remindersUnsupportedNotice: string;
    remindersDismissAria: string;
    reminderNotificationTitle: (title: string) => string;
    reminderNotificationBody: (
      time: string,
      room: string,
      speaker: string
    ) => string;
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
  faq: {
    kicker: string;
    heading: string;
    intro: string;
    contactPrompt: string;
    navLabel: string;
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
    tabGroupAria: string;
    tabDirections: string;
    tabHotels: string;
    hotelSearchLabel: string;
    hotelSearchPlaceholder: string;
    hotelSearchAria: string;
    hotelSearchBtn: string;
    hotelRadiusLabel: string;
    hotelRatingLabel: string;
    hotelRatingAny: string;
    hotelSearching: string;
    hotelEmpty: string;
    hotelError: string;
    hotelDistanceFromVenue: (distance: string) => string;
    hotelReviewsCount: (count: number) => string;
    hotelShowOnMap: string;
    hotelOpenMaps: string;
    hotelVenuePinTitle: string;
  };
  weatherWidget: {
    heading: string;
    locationLabel: string;
    refreshBtn: string;
    refreshAria: string;
    loading: string;
    missingKeyNotice: string;
    unavailableNotice: string;
    feelsLike: string;
    windLabel: string;
    humidityLabel: string;
    precipLabel: string;
    forecastHeading: string;
    todayLabel: string;
  };
  speakerModal: {
    closeAria: string;
    portraitAlt: (name: string) => string;
    quickReadHeading: string;
    bioHeading: string;
    publicationsHeading: string;
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
    connectHeading: string;
    connectDescription: string;
    connectNavAria: string;
    twitterAria: string;
    linkedinAria: string;
    instagramAria: string;
  };
  web3: {
    badgeLabel: string;
    title: string;
    description: string;
    connectBtn: string;
    connectAria: string;
    connecting: string;
    signBtn: string;
    signAria: string;
    signing: string;
    disconnectBtn: string;
    disconnectAria: string;
    walletLabel: string;
    networkLabel: string;
    signatureLabel: string;
    tierLabel: string;
    verifiedBadge: string;
    noWalletError: string;
    rejectedError: string;
    genericError: string;
    copySignatureBtn: string;
    copiedSignatureBtn: string;
  };
  digitalBadge: {
    eyebrow: string;
    title: string;
    subtitle: string;
    verifiedStatus: string;
    standardStatus: string;
    holderLabel: string;
    tierLabel: string;
    passIdLabel: string;
    entranceLabel: string;
    entranceValue: string;
    qrAlt: (passId: string) => string;
    downloadQrBtn: string;
    downloadQrAria: string;
    scanNote: string;
  };
  attendeeCounter: {
    regionAria: string;
    label: string;
    ofCapacity: (capacity: number) => string;
    seatsRemaining: (remaining: number) => string;
    soldOut: string;
    loading: string;
  };
  checkInScanner: {
    toggleOpenBtn: string;
    toggleCloseBtn: string;
    toggleAria: string;
    heading: string;
    subtitle: string;
    startCameraBtn: string;
    startingCamera: string;
    stopCameraBtn: string;
    switchCameraBtn: string;
    uploadQrBtn: string;
    uploadQrAria: string;
    scanNextBtn: string;
    videoAria: string;
    idleHint: string;
    scanningStatus: string;
    pausedStatus: string;
    validTitle: string;
    duplicateTitle: (time: string) => string;
    invalidTitle: string;
    invalidHint: string;
    holderLabel: string;
    passIdLabel: string;
    tierLabel: string;
    verificationLabel: string;
    web3VerifiedValue: string;
    standardTicketValue: string;
    walletLabel: string;
    checkedInAtLabel: string;
    recentHeading: (count: number) => string;
    clearLogBtn: string;
    unsupportedError: string;
    permissionDeniedError: string;
    noCameraError: string;
    cameraError: string;
    imageDecodeError: string;
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
      switchToZhAria: 'Byt språk till kinesiska',
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
      addToCalendarBtn: 'Lägg till i kalender',
      addToCalendarAria: (title) => `Lägg till ${title} i kalender`,
      calendarMenuAria: (title) => `Kalenderalternativ för ${title}`,
      googleCalendar: 'Google Kalender',
      outlookWeb: 'Outlook (Webb)',
      outlookIcs: 'Outlook / Apple (.ics)',
      savedConfirmation: 'Kalenderfil hämtad',
      remindMeBtn: 'Påminn 15 min',
      reminderActiveBtn: 'Påminnelse på',
      remindMeAria: (title) =>
        `Aktivera lokal påminnelse 15 minuter före ${title}`,
      reminderActiveAria: (title) => `Stäng av lokal påminnelse för ${title}`,
      remindersBarLabel: (count) =>
        `${count} ${count === 1 ? 'programpunkt' : 'programpunkter'} med 15-minuterspåminnelse`,
      remindersBarEmpty:
        'Aktivera lokala webbläsarpåminnelser 15 min före dina sparade föreläsningar.',
      remindersTestBtn: 'Testa notis',
      remindersTestAria: 'Skicka en lokal testnotis i webbläsaren',
      remindersEnableBtn: 'Tillåt notiser',
      remindersClearBtn: 'Rensa alla',
      remindersBlockedNotice:
        'Webbläsarnotiser är blockerade — påminnelser visas här på sidan medan fliken är öppen.',
      remindersUnsupportedNotice:
        'Webbläsarnotiser stöds inte här — påminnelser visas här på sidan medan fliken är öppen.',
      remindersDismissAria: 'Stäng påminnelse',
      reminderNotificationTitle: (title) => `Börjar om 15 min: ${title}`,
      reminderNotificationBody: (time, room, speaker) =>
        `${time} · ${room} · ${speaker}`,
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
    faq: {
      kicker: '05. Vanliga frågor',
      heading: 'Vanliga frågor inför besöket',
      intro:
        'Här har vi samlat svar om parkering, specialkost, tillgänglighet och biljettvillkor på Münchenbryggeriet.',
      contactPrompt: 'Saknar du svar på din fråga? Kontakta oss på',
      navLabel: 'Vanliga frågor',
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
      tabGroupAria: 'Välj kartläge',
      tabDirections: 'Vägbeskrivning',
      tabHotels: 'Hotell i närheten',
      hotelSearchLabel: 'Sök eller filtrera hotell nära Münchenbryggeriet',
      hotelSearchPlaceholder: 'T.ex. boutique, Södermalm eller hotellnamn...',
      hotelSearchAria: 'Sök efter hotell nära Münchenbryggeriet',
      hotelSearchBtn: 'Sök hotell',
      hotelRadiusLabel: 'Sökradie',
      hotelRatingLabel: 'Lägsta betyg',
      hotelRatingAny: 'Alla betyg',
      hotelSearching: 'Söker hotell nära Münchenbryggeriet...',
      hotelEmpty:
        'Inga hotell hittades med valda filter. Prova en större sökradie.',
      hotelError: 'Kunde inte hämta närliggande hotell just nu. Försök igen.',
      hotelDistanceFromVenue: (distance) => `${distance} från lokalen`,
      hotelReviewsCount: (count) => `${count} omdömen`,
      hotelShowOnMap: 'Visa på kartan',
      hotelOpenMaps: 'Google Maps',
      hotelVenuePinTitle: 'Münchenbryggeriet (Symposium)',
    },
    weatherWidget: {
      heading: 'Aktuellt väder & prognos · Stockholm',
      locationLabel: 'Münchenbryggeriet, Södermalm',
      refreshBtn: 'Uppdatera',
      refreshAria: 'Uppdatera väderdata för Münchenbryggeriet',
      loading: 'Hämtar väderprognos för Stockholm...',
      missingKeyNotice:
        'Väderwidgeten kräver en konfigurerad Google Maps Platform Weather API-nyckel.',
      unavailableNotice:
        'Väderdata från Google Maps Weather API är inte tillgänglig just nu.',
      feelsLike: 'Känns som',
      windLabel: 'Vind',
      humidityLabel: 'Luftfuktighet',
      precipLabel: 'Nederbörd',
      forecastHeading: '5-dygnsprognos',
      todayLabel: 'Idag',
    },
    speakerModal: {
      closeAria: 'Stäng talarprofil',
      portraitAlt: (name) => `Porträtt av ${name}`,
      quickReadHeading: 'Snabbläsning · Föreläsningen i korthet',
      bioHeading: 'Bakgrund & forskning',
      publicationsHeading: 'Relaterade akademiska publikationer',
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
      connectHeading: 'Connect · Gemenskap',
      connectDescription:
        'Följ samtal, talaruppdateringar och gemenskap inför symposiet 2027.',
      connectNavAria: 'Sociala medier för Stjärnfall 2027',
      twitterAria: 'Stjärnfall 2027 på Twitter (öppnas i ny flik)',
      linkedinAria: 'Stjärnfall 2027 på LinkedIn (öppnas i ny flik)',
      instagramAria: 'Stjärnfall 2027 på Instagram (öppnas i ny flik)',
    },
    web3: {
      badgeLabel: 'Blockchain · Valfritt',
      title: 'Web3-verifierat konferensbevis (EVM)',
      description:
        'Koppla en Web3-plånbok (t.ex. MetaMask eller Rabby) för att signera ett kryptografiskt EIP-191-närvarobevis kopplat till din plånboksadress.',
      connectBtn: 'Koppla plånbok',
      connectAria: 'Koppla EVM-plånbok för att verifiera konferensbevis',
      connecting: 'Ansluter plånbok...',
      signBtn: 'Signera konferensbevis',
      signAria: 'Signera kryptografiskt konferensbevis i din plånbok',
      signing: 'Väntar på signatur...',
      disconnectBtn: 'Koppla från',
      disconnectAria: 'Koppla från ansluten plånbok',
      walletLabel: 'Plånbok',
      networkLabel: 'Nätverk',
      signatureLabel: 'EIP-191 Signatur',
      tierLabel: 'Passnivå',
      verifiedBadge: 'Kryptografiskt signerat',
      noWalletError:
        'Ingen Web3-plånbok hittades i webbläsaren. Installera t.ex. MetaMask eller Rabby för att använda blockchain-verifiering.',
      rejectedError: 'Signeringen eller anslutningen avbröts i din plånbok.',
      genericError: 'Kunde inte kommunicera med plånboken. Försök igen.',
      copySignatureBtn: 'Kopiera signatur',
      copiedSignatureBtn: 'Signatur kopierad',
    },
    digitalBadge: {
      eyebrow: 'Digitalt entrépass',
      title: 'Digital Badge · Snabbentré',
      subtitle:
        'Visa denna QR-kod i entrén på Münchenbryggeriet för snabb incheckning.',
      verifiedStatus: 'Web3-verifierat pass',
      standardStatus: 'Bekräftad entré',
      holderLabel: 'Innehavare',
      tierLabel: 'Biljettnivå',
      passIdLabel: 'Pass-ID',
      entranceLabel: 'Entré & sal',
      entranceValue: '20 okt 2027 · Från kl. 08:15',
      qrAlt: (passId) => `QR-kod för digitalt entrépass ${passId}`,
      downloadQrBtn: 'Ladda ner QR',
      downloadQrAria: 'Ladda ner QR-kod som bild för snabb incheckning',
      scanNote: 'Skannas i entrén · Uppdateras automatiskt vid Web3-signering',
    },
    attendeeCounter: {
      regionAria: 'Aktuellt antal registrerade deltagare till Stjärnfall 2027',
      label: 'Live · Anmälda deltagare',
      ofCapacity: (capacity) => `av ${capacity} platser`,
      seatsRemaining: (remaining) => `${remaining} platser kvar`,
      soldOut: 'Fullbokat',
      loading: 'Hämtar deltagarantal...',
    },
    checkInScanner: {
      toggleOpenBtn: 'Incheckningsskanner',
      toggleCloseBtn: 'Stäng skanner',
      toggleAria: 'Öppna eller stäng personalens kameraskanner för incheckning',
      heading: 'Check-in Scanner · Entrékontroll',
      subtitle:
        'Skanna deltagarnas Digital Badge QR-koder med enhetens kamera (MediaDevices API) eller ladda upp en QR-bild.',
      startCameraBtn: 'Starta kamera',
      startingCamera: 'Startar kamera...',
      stopCameraBtn: 'Stoppa kamera',
      switchCameraBtn: 'Byt kamera',
      uploadQrBtn: 'Skanna QR-bild',
      uploadQrAria: 'Ladda upp en sparad Digital Badge QR-bild för kontroll',
      scanNextBtn: 'Skanna nästa pass',
      videoAria: 'Kameravy för skanning av digitala entrépass',
      idleHint:
        'Kameran är avstängd. Starta kameran eller välj en QR-bild för att verifiera ett entrépass.',
      scanningStatus: 'Aktiv skanning · Rikta QR-koden mot ramen',
      pausedStatus:
        'Pass avläst · Tryck på Skanna nästa pass för att fortsätta',
      validTitle: 'Giltigt entrépass — Incheckad',
      duplicateTitle: (time) => `Redan incheckad kl. ${time}`,
      invalidTitle: 'Okänd QR-kod',
      invalidHint:
        'Koden motsvarar inte ett giltigt Stjärnfall 2027 Digital Badge-pass.',
      holderLabel: 'Innehavare',
      passIdLabel: 'Pass-ID',
      tierLabel: 'Biljettnivå',
      verificationLabel: 'Verifiering',
      web3VerifiedValue: 'Web3 EIP-191 signerad',
      standardTicketValue: 'Standardbiljett',
      walletLabel: 'Plånbok',
      checkedInAtLabel: 'Incheckad',
      recentHeading: (count) => `Senaste incheckningar (${count})`,
      clearLogBtn: 'Rensa logg',
      unsupportedError:
        'Kamerastöd (MediaDevices API) saknas i denna webbläsare eller i osäker kontext.',
      permissionDeniedError:
        'Kameraåtkomst nekades. Tillåt kamerabehörighet i webbläsaren eller skanna en QR-bild.',
      noCameraError:
        'Ingen kamera hittades på enheten. Du kan i stället välja en sparad QR-bild.',
      cameraError:
        'Kunde inte starta kameran. Kontrollera att ingen annan app använder den och försök igen.',
      imageDecodeError:
        'Hittade ingen läsbar QR-kod i den valda bilden. Försök med en tydligare bild.',
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
      switchToZhAria: 'Switch language to Chinese',
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
      addToCalendarBtn: 'Add to Calendar',
      addToCalendarAria: (title) => `Add ${title} to calendar`,
      calendarMenuAria: (title) => `Calendar options for ${title}`,
      googleCalendar: 'Google Calendar',
      outlookWeb: 'Outlook (Web)',
      outlookIcs: 'Outlook / Apple (.ics)',
      savedConfirmation: 'Calendar file downloaded',
      remindMeBtn: 'Remind 15m',
      reminderActiveBtn: 'Reminder on',
      remindMeAria: (title) =>
        `Enable local browser reminder 15 minutes before ${title}`,
      reminderActiveAria: (title) =>
        `Disable local browser reminder for ${title}`,
      remindersBarLabel: (count) =>
        `${count} ${count === 1 ? 'talk' : 'talks'} set for 15-min reminders`,
      remindersBarEmpty:
        'Enable local browser reminders 15 minutes before your saved talks begin.',
      remindersTestBtn: 'Test notification',
      remindersTestAria: 'Send a test local browser notification',
      remindersEnableBtn: 'Allow notifications',
      remindersClearBtn: 'Clear all',
      remindersBlockedNotice:
        'Browser notifications are blocked — reminders will appear on this page while the tab is open.',
      remindersUnsupportedNotice:
        'Browser notifications are unavailable here — reminders will appear on this page while the tab is open.',
      remindersDismissAria: 'Dismiss reminder banner',
      reminderNotificationTitle: (title) => `Starts in 15 min: ${title}`,
      reminderNotificationBody: (time, room, speaker) =>
        `${time} · ${room} · ${speaker}`,
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
    faq: {
      kicker: '05. FAQ',
      heading: 'Frequently asked questions',
      intro:
        'Answers to common attendee questions regarding parking, dietary requirements, accessibility, and ticket policies at Münchenbryggeriet.',
      contactPrompt: 'Still have a question? Reach us at',
      navLabel: 'FAQ',
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
      tabGroupAria: 'Select map workspace mode',
      tabDirections: 'Directions',
      tabHotels: 'Nearby Hotels',
      hotelSearchLabel: 'Search or filter hotels near Münchenbryggeriet',
      hotelSearchPlaceholder: 'E.g. boutique, waterfront, or hotel name...',
      hotelSearchAria: 'Search for hotels near Münchenbryggeriet',
      hotelSearchBtn: 'Search',
      hotelRadiusLabel: 'Radius',
      hotelRatingLabel: 'Minimum rating',
      hotelRatingAny: 'Any rating',
      hotelSearching: 'Searching nearby hotels around Münchenbryggeriet...',
      hotelEmpty:
        'No hotels matched your current filters. Try expanding the radius.',
      hotelError: 'Unable to load nearby hotels right now. Please try again.',
      hotelDistanceFromVenue: (distance) => `${distance} from venue`,
      hotelReviewsCount: (count) => `${count} reviews`,
      hotelShowOnMap: 'Show on map',
      hotelOpenMaps: 'Google Maps',
      hotelVenuePinTitle: 'Münchenbryggeriet (Symposium)',
    },
    weatherWidget: {
      heading: 'Local Weather & Forecast · Stockholm',
      locationLabel: 'Münchenbryggeriet, Södermalm',
      refreshBtn: 'Refresh',
      refreshAria: 'Refresh weather forecast for Münchenbryggeriet',
      loading: 'Loading Stockholm weather forecast...',
      missingKeyNotice:
        'The weather widget requires a configured Google Maps Platform Weather API key.',
      unavailableNotice:
        'Weather forecast data from Google Maps Weather API is currently unavailable.',
      feelsLike: 'Feels like',
      windLabel: 'Wind',
      humidityLabel: 'Humidity',
      precipLabel: 'Precipitation',
      forecastHeading: '5-day outlook',
      todayLabel: 'Today',
    },
    speakerModal: {
      closeAria: 'Close speaker profile',
      portraitAlt: (name) => `Portrait of ${name}`,
      quickReadHeading: 'Quick Read · Lecture Executive Summary',
      bioHeading: 'Background & Research',
      publicationsHeading: 'Related Academic Publications',
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
      connectHeading: 'Connect',
      connectDescription:
        'Follow speaker updates, essays, and community conversations ahead of the 2027 symposium.',
      connectNavAria: 'Social media channels for Stjärnfall 2027',
      twitterAria: 'Stjärnfall 2027 on Twitter (opens in a new tab)',
      linkedinAria: 'Stjärnfall 2027 on LinkedIn (opens in a new tab)',
      instagramAria: 'Stjärnfall 2027 on Instagram (opens in a new tab)',
    },
    web3: {
      badgeLabel: 'Blockchain · Optional',
      title: 'Web3-verified attendance pass (EVM)',
      description:
        'Connect an EVM browser wallet (such as MetaMask or Rabby) to sign a cryptographic EIP-191 symposium pass tied to your wallet address.',
      connectBtn: 'Connect wallet',
      connectAria: 'Connect EVM wallet to verify symposium pass',
      connecting: 'Connecting wallet...',
      signBtn: 'Sign attendance pass',
      signAria: 'Sign cryptographic symposium pass in your wallet',
      signing: 'Awaiting signature...',
      disconnectBtn: 'Disconnect',
      disconnectAria: 'Disconnect connected wallet',
      walletLabel: 'Wallet',
      networkLabel: 'Network',
      signatureLabel: 'EIP-191 Signature',
      tierLabel: 'Pass tier',
      verifiedBadge: 'Cryptographically signed',
      noWalletError:
        'No browser Web3 wallet detected. Install an EVM wallet extension such as MetaMask or Rabby to use blockchain verification.',
      rejectedError: 'Wallet connection or signature request was cancelled.',
      genericError: 'Could not communicate with wallet. Please try again.',
      copySignatureBtn: 'Copy signature',
      copiedSignatureBtn: 'Signature copied',
    },
    digitalBadge: {
      eyebrow: 'Digital Entry Pass',
      title: 'Digital Badge · Fast Check-In',
      subtitle:
        'Present this QR code at the Münchenbryggeriet entrance for express check-in.',
      verifiedStatus: 'Web3 Verified Pass',
      standardStatus: 'Confirmed Ticket',
      holderLabel: 'Holder',
      tierLabel: 'Ticket Tier',
      passIdLabel: 'Pass ID',
      entranceLabel: 'Entry & Hall',
      entranceValue: 'Oct 20, 2027 · From 08:15',
      qrAlt: (passId) => `QR code for digital symposium badge ${passId}`,
      downloadQrBtn: 'Download QR',
      downloadQrAria: 'Download QR code image for fast check-in',
      scanNote: 'Scan at entrance · Live-updates when signed with Web3',
    },
    attendeeCounter: {
      regionAria: 'Live count of registered attendees for Stjärnfall 2027',
      label: 'Live · Registered attendees',
      ofCapacity: (capacity) => `of ${capacity} seats`,
      seatsRemaining: (remaining) => `${remaining} seats remaining`,
      soldOut: 'Sold out',
      loading: 'Fetching attendee count...',
    },
    checkInScanner: {
      toggleOpenBtn: 'Check-in Scanner',
      toggleCloseBtn: 'Close Scanner',
      toggleAria: 'Toggle staff camera scanner for attendee digital badges',
      heading: 'Check-in Scanner · Entrance Desk',
      subtitle:
        'Scan attendee Digital Badge QR codes using the device camera (MediaDevices API) or load a badge QR image.',
      startCameraBtn: 'Start camera',
      startingCamera: 'Starting camera...',
      stopCameraBtn: 'Stop camera',
      switchCameraBtn: 'Switch camera',
      uploadQrBtn: 'Scan QR image',
      uploadQrAria: 'Upload a saved Digital Badge QR image to verify',
      scanNextBtn: 'Scan next badge',
      videoAria: 'Live camera viewfinder for scanning attendee digital badges',
      idleHint:
        'Camera is off. Start the camera or choose a QR image file to verify an attendee pass.',
      scanningStatus: 'Scanning active · Align QR code inside the frame',
      pausedStatus: 'Badge captured · Select Scan next badge to continue',
      validTitle: 'Valid Symposium Pass — Checked In',
      duplicateTitle: (time) => `Already checked in at ${time}`,
      invalidTitle: 'Unrecognized QR Code',
      invalidHint:
        'This QR payload is not a valid Stjärnfall 2027 Digital Badge pass.',
      holderLabel: 'Holder',
      passIdLabel: 'Pass ID',
      tierLabel: 'Ticket Tier',
      verificationLabel: 'Verification',
      web3VerifiedValue: 'Web3 EIP-191 Signed',
      standardTicketValue: 'Confirmed Ticket',
      walletLabel: 'Wallet',
      checkedInAtLabel: 'Checked in',
      recentHeading: (count) => `Recent check-ins (${count})`,
      clearLogBtn: 'Clear log',
      unsupportedError:
        'Camera access (MediaDevices API) is unavailable in this browser or context.',
      permissionDeniedError:
        'Camera permission was denied. Allow camera access in browser settings or scan a QR image.',
      noCameraError:
        'No camera device detected. You can upload a saved Digital Badge QR image instead.',
      cameraError:
        'Unable to access the camera. Ensure no other app is using it and try again.',
      imageDecodeError:
        'No readable QR code was found in the selected image. Try a clearer image.',
    },
  },
  zh: {
    documentTitle: 'Stjärnfall 2027 — 星象学与宇宙时间北欧研讨会',
    header: {
      brandAria: 'Stjärnfall 2027 — 返回页面顶部',
      mainNavAria: '主导航',
      mobileNavAria: '移动端导航',
      jumpToPrefix: '跳转至板块',
      navProgram: '日程',
      navSpeakers: '讲者',
      navTickets: '门票',
      navPractical: '实用信息',
      bookCta: '预订席位',
      bookCtaAria: '预订席位 — 前往门票类型',
      openMenuAria: '打开导航菜单',
      closeMenuAria: '关闭导航菜单',
      languageGroupAria: '选择语言',
      switchToSvAria: '切换语言为瑞典语',
      switchToEnAria: '切换语言为英语',
      switchToZhAria: '切换语言为中文',
    },
    hero: {
      dateLocation: '斯德哥尔摩 ·',
      dateLabel: '2027年10月20日',
      venueLabel: '· 慕尼黑啤酒厂会议中心',
      heading: '当天体力学遇上当代文化',
      description:
        '一场关于星象学、历史星图与行星时间轴的全日研讨会。六位北欧学者与创作者将共同探讨星空如何塑造我们对时间、建筑与叙事的理解。',
      primaryCta: '选择门票',
      secondaryCta: '浏览日程',
      imageFallback: '慕尼黑啤酒厂会议中心 — Mälarsalen',
    },
    schedule: {
      kicker: '01. 全日日程',
      heading: '从清晨到黄昏的六场专题演讲',
      filterGroupAria: '按环节类型筛选日程',
      filterAll: '全部',
      tracks: {
        Huvudscen: '主舞台',
        Workshop: '工作坊',
        Samtal: '对谈',
      },
      speakerProfileAria: (speaker) => `查看 ${speaker} 的讲者简介`,
      addToCalendarBtn: '添加到日历',
      addToCalendarAria: (title) => `将《${title}》添加到日历`,
      calendarMenuAria: (title) => `《${title}》的日历选项`,
      googleCalendar: 'Google 日历',
      outlookWeb: 'Outlook（网页版）',
      outlookIcs: 'Outlook / Apple (.ics)',
      savedConfirmation: '已下载日历文件',
      remindMeBtn: '提前15分提醒',
      reminderActiveBtn: '已设提醒',
      remindMeAria: (title) => `开启《${title}》开场前 15 分钟本地浏览器提醒`,
      reminderActiveAria: (title) => `取消《${title}》的开场前 15 分钟提醒`,
      remindersBarLabel: (count) =>
        `已为 ${count} 场演讲开启开场前 15 分钟提醒`,
      remindersBarEmpty:
        '为收藏的演讲开启本地浏览器提醒，开场前 15 分钟通知您。',
      remindersTestBtn: '测试提醒',
      remindersTestAria: '发送一条本地浏览器测试提醒',
      remindersEnableBtn: '开启通知权限',
      remindersClearBtn: '全部清除',
      remindersBlockedNotice:
        '浏览器通知权限已被屏蔽 — 保持页面打开时仍会在页面内弹出提醒。',
      remindersUnsupportedNotice:
        '当前环境不支持桌面通知 — 保持页面打开时会在页面内显示提醒。',
      remindersDismissAria: '关闭提醒横幅',
      reminderNotificationTitle: (title) => `15 分钟后开场：${title}`,
      reminderNotificationBody: (time, room, speaker) =>
        `${time} · ${room} · ${speaker}`,
    },
    speakers: {
      kicker: '02. 特邀讲者',
      heading: '学者、设计师与占星研究者',
      intro:
        '将鼠标悬停在肖像上或使用 Tab 键聚焦，即可查看联系方式与演讲主题；点击卡片阅读完整个人简介。',
      portraitAlt: (name, role) => `${name}肖像，${role}`,
      cardAria: (name, role, city, sessionTitle, sessionTime, email) =>
        `${name}，${role}，来自${city}。演讲：${sessionTitle}，${sessionTime}。联系邮箱：${email}。打开完整简介。`,
    },
    tickets: {
      kicker: '03. 门票类型',
      heading: '选择适合您行程的通行证',
      intro:
        '所有门票均包含衣帽寄存、纸质/电子议程手册以及前厅展览区的免费参观权限。',
      recommended: '推荐选择',
      selectCta: (name) => `选择${name}`,
      selectAria: (name, price) => `选择${name}门票，价格 ${price}`,
    },
    practical: {
      kicker: '04. 实用信息',
      heading: '前往慕尼黑啤酒厂会议中心',
      mapFallback: '地图：Torkel Knutssonsgatan 2, Stockholm',
      addressCaption: 'Torkel Knutssonsgatan 2, 南岛区 (Södermalm)',
    },
    faq: {
      kicker: '05. 常见问题',
      heading: '参会常见问题解答',
      intro:
        '以下汇总了关于停车信息、特殊饮食需求、无障碍设施及门票政策的常见问题。',
      contactPrompt: '仍有疑问？欢迎致信',
      navLabel: '常见问题',
    },
    howToGetHere: {
      heading: '交通指南',
      intro:
        '直接通过 Google Maps 规划前往慕尼黑啤酒厂会议中心的公共交通、骑行、驾车或步行路线。',
      missingKeyNoticeBefore: '路线规划器需要配置 Google Maps 密钥（',
      missingKeyNoticeAfter:
        '）。请参阅上方公共交通说明与位置示意图前往 Torkel Knutssonsgatan 2。',
      loadError:
        '暂时无法加载 Google Maps 地图。请参考上方位置示意图与公共交通信息前往 Torkel Knutssonsgatan 2。',
      originLabel: '您的出发地是？',
      originPlaceholder: '输入地址、车站或地点名称...',
      originInputAria: '输入出发地址或车站，获取前往慕尼黑啤酒厂会议中心的路线',
      suggestionsAria: '地址建议',
      selectOriginAria: (label) => `选择出发地点 ${label}`,
      searchSubmit: '查询',
      searchSubmitAria: '查询所填出发地的交通路线',
      loadingSuggestions: '正在获取地点建议...',
      quickOriginsTitle: '常用交通枢纽',
      quickOriginAria: (hub) => `计算从 ${hub} 出发的路线`,
      travelModeTitle: '出行方式',
      travelModeGroupAria: '选择出行方式',
      travelModes: {
        TRANSIT: {
          label: '公共交通',
          ariaLabel: '选择公共交通出行',
        },
        WALKING: {
          label: '步行',
          ariaLabel: '选择步行出行',
        },
        BICYCLING: {
          label: '骑行',
          ariaLabel: '选择骑行出行',
        },
        DRIVING: {
          label: '驾车',
          ariaLabel: '选择驾车出行',
        },
      },
      calculatingRoute: (origin) => `正在计算从 ${origin} 出发的路线...`,
      fromPrefix: (origin) => `出发地：${origin}`,
      loadingMap: '正在加载 Google Maps 与场馆位置数据...',
      noRouteError: (origin) => `未找到从 ${origin} 出发的所选出行方式路线。`,
      routeFetchError: '暂时无法获取路线指引，请检查出发地址后重试。',
      venueResolveError: '无法从 Google Maps 获取场馆坐标。',
      venueDataError: '无法从 Google Maps 获取场馆数据。',
      hoursUnit: '小时',
      minutesUnit: '分钟',
      tabGroupAria: '选择地图功能视图',
      tabDirections: '路线规划',
      tabHotels: '周边酒店',
      hotelSearchLabel: '搜索慕尼黑啤酒厂会议中心附近酒店',
      hotelSearchPlaceholder: '输入酒店名称、街区或风格（可选）...',
      hotelSearchAria: '搜索慕尼黑啤酒厂会议中心周边酒店',
      hotelSearchBtn: '搜索酒店',
      hotelRadiusLabel: '搜索半径',
      hotelRatingLabel: '最低评分',
      hotelRatingAny: '不限评分',
      hotelSearching: '正在查找会场周边酒店...',
      hotelEmpty: '当前筛选条件下未找到酒店，请尝试扩大搜索半径。',
      hotelError: '暂时无法获取周边酒店信息，请稍后重试。',
      hotelDistanceFromVenue: (distance) => `距会场 ${distance}`,
      hotelReviewsCount: (count) => `${count} 条评价`,
      hotelShowOnMap: '在地图上查看',
      hotelOpenMaps: 'Google Maps',
      hotelVenuePinTitle: '慕尼黑啤酒厂会议中心（会场）',
    },
    weatherWidget: {
      heading: '场馆实时天气与预报 · 斯德哥尔摩',
      locationLabel: 'Münchenbryggeriet, 南岛区',
      refreshBtn: '刷新',
      refreshAria: '刷新慕尼黑啤酒厂会议中心实时天气',
      loading: '正在加载斯德哥尔摩天气预报...',
      missingKeyNotice:
        '天气组件需要配置 Google Maps Platform Weather API 密钥。',
      unavailableNotice: 'Google Maps 天气服务当前不可用，请稍后重试。',
      feelsLike: '体感温度',
      windLabel: '风速',
      humidityLabel: '湿度',
      precipLabel: '降水概率',
      forecastHeading: '未来 5 日预报',
      todayLabel: '今天',
    },
    speakerModal: {
      closeAria: '关闭讲者简介',
      portraitAlt: (name) => `${name} 肖像`,
      quickReadHeading: '速览 · 演讲核心摘要',
      bioHeading: '学术背景与研究方向',
      publicationsHeading: '相关学术出版物',
      sessionLabel: '演讲场次',
      viewInSchedule: '在日程中查看',
    },
    ticketModal: {
      closeAria: '关闭预订表单',
      reservedLabel: '席位已预留',
      thankYou: (name) => `感谢您，${name}`,
      confirmationPrefix: '您预订的',
      confirmationMiddle: '已登记。确认函将发送至',
      confirmationSuffix: '。',
      closeBtn: '关闭',
      bookingEyebrow: '门票预订 · Stjärnfall 2027',
      nameLabel: '姓名',
      namePlaceholder: '请输入您的姓名',
      emailLabel: '电子邮箱',
      emailPlaceholder: 'name@example.com',
      quantityLabel: '门票数量',
      quantityOption: (n) => `${n} 张`,
      dietaryLabel: '特殊饮食要求（选填）',
      dietaryPlaceholder: '例如：素食',
      nameError: '请输入您的姓名。',
      emailError: '请输入有效的电子邮箱以接收门票确认。',
      totalLabel: '应付总额',
      submitBtn: '完成预订',
      currencySuffix: '瑞典克朗',
    },
    newsletter: {
      heading: '2027 研讨会通讯',
      description: '第一时间获取日程发布、讲者动态及增补席位通知。',
      subscribedPrefix: '订阅成功！最新动态将发送至',
      changeEmailBtn: '更换邮箱',
      changeEmailAria: '使用另一个邮箱订阅研讨会通讯',
      inputLabel: '订阅通讯的电子邮箱',
      inputPlaceholder: 'name@example.com',
      inputAria: '输入接收 Stjärnfall 2027 动态的电子邮箱',
      submitBtn: '订阅',
      submitAria: '订阅 Stjärnfall 2027 最新动态',
      invalidEmailError: '请输入有效的电子邮箱地址。',
    },
    footer: {
      tagline:
        '于斯德哥尔摩慕尼黑啤酒厂会议中心举办的星象学、天体力学与宇宙时间北欧研讨会。',
      copyright: '© 2027 Stjärnfall Symposium · 保留所有权利',
      navAria: '页脚导航',
      connectHeading: 'Connect · 社区互动',
      connectDescription:
        '关注讲者动态、专题短评，加入 2027 年研讨会前的社群讨论。',
      connectNavAria: 'Stjärnfall 2027 社交媒体频道',
      twitterAria: '在 Twitter 关注 Stjärnfall 2027（在新标签页打开）',
      linkedinAria: '在 LinkedIn 关注 Stjärnfall 2027（在新标签页打开）',
      instagramAria: '在 Instagram 关注 Stjärnfall 2027（在新标签页打开）',
    },
    web3: {
      badgeLabel: '区块链 · 可选功能',
      title: 'Web3 加密参会凭证 (EVM)',
      description:
        '连接 EVM 浏览器钱包（如 MetaMask 或 Rabby），即可签署与您钱包地址绑定的 EIP-191 加密研讨会凭证。',
      connectBtn: '连接钱包',
      connectAria: '连接 EVM 钱包以验证参会凭证',
      connecting: '正在连接钱包...',
      signBtn: '签署参会凭证',
      signAria: '在钱包中签署加密参会凭证',
      signing: '等待钱包签名...',
      disconnectBtn: '断开连接',
      disconnectAria: '断开已连接的钱包',
      walletLabel: '钱包地址',
      networkLabel: '网络',
      signatureLabel: 'EIP-191 签名',
      tierLabel: '票种',
      verifiedBadge: '已完成加密签名',
      noWalletError:
        '未检测到浏览器 Web3 钱包。请安装 MetaMask 或 Rabby 等 EVM 钱包扩展以启用区块链验证。',
      rejectedError: '您已在钱包中取消连接或签名请求。',
      genericError: '无法与钱包通信，请稍后重试。',
      copySignatureBtn: '复制签名',
      copiedSignatureBtn: '已复制签名',
    },
    digitalBadge: {
      eyebrow: '数字入场通行证',
      title: 'Digital Badge · 快速签到',
      subtitle: '入场时请在慕尼黑啤酒厂会议中心入口处出示此二维码快速核验。',
      verifiedStatus: 'Web3 加密已验证',
      standardStatus: '已确认门票',
      holderLabel: '持票人',
      tierLabel: '票种',
      passIdLabel: '通行证编号',
      entranceLabel: '入场时间',
      entranceValue: '2027年10月20日 · 08:15 起',
      qrAlt: (passId) => `数字参会通行证 ${passId} 二维码`,
      downloadQrBtn: '下载二维码',
      downloadQrAria: '下载入场签到二维码图片',
      scanNote: '入口扫码签到 · 完成 Web3 签名后实时同步加密凭证',
    },
    attendeeCounter: {
      regionAria: 'Stjärnfall 2027 实时已报名参会人数',
      label: '实时 · 已报名参会人数',
      ofCapacity: (capacity) => `/ ${capacity} 席`,
      seatsRemaining: (remaining) => `仅剩 ${remaining} 席`,
      soldOut: '名额已满',
      loading: '正在获取最新参会人数...',
    },
    checkInScanner: {
      toggleOpenBtn: '签到扫码器',
      toggleCloseBtn: '关闭扫码器',
      toggleAria: '展开或收起工作人员入场签到相机扫码器',
      heading: 'Check-in Scanner · 入场核验终端',
      subtitle:
        '调用设备摄像头（MediaDevices API）实时扫描参会者数字通行证二维码，或上传二维码图片核验。',
      startCameraBtn: '开启摄像头',
      startingCamera: '正在启动摄像头...',
      stopCameraBtn: '停止摄像头',
      switchCameraBtn: '切换镜头',
      uploadQrBtn: '扫描二维码图片',
      uploadQrAria: '上传已保存的数字通行证二维码图片进行核验',
      scanNextBtn: '继续扫描下一位',
      videoAria: '用于扫描参会者数字通行证的实时相机取景框',
      idleHint:
        '摄像头未开启。请开启摄像头或选择一张二维码图片以核验参会通行证。',
      scanningStatus: '正在扫描 · 请将通行证二维码置于取景框内',
      pausedStatus: '已读取通行证 · 点击“继续扫描下一位”恢复扫描',
      validTitle: '有效通行证 — 已完成签到',
      duplicateTitle: (time) => `该通行证已于 ${time} 签到`,
      invalidTitle: '无法识别的二维码',
      invalidHint: '该二维码不是有效的 Stjärnfall 2027 数字入场通行证。',
      holderLabel: '持票人',
      passIdLabel: '通行证编号',
      tierLabel: '票种',
      verificationLabel: '核验状态',
      web3VerifiedValue: 'Web3 EIP-191 加密签名',
      standardTicketValue: '标准确认门票',
      walletLabel: '钱包地址',
      checkedInAtLabel: '签到时间',
      recentHeading: (count) => `近期签到记录 (${count})`,
      clearLogBtn: '清空记录',
      unsupportedError:
        '当前浏览器或安全上下文不支持摄像头调用（MediaDevices API）。',
      permissionDeniedError:
        '摄像头权限被拒绝。请在浏览器设置中允许访问摄像头，或改为上传二维码图片。',
      noCameraError: '未检测到可用摄像头设备，您可以上传二维码图片完成核验。',
      cameraError: '无法启动摄像头，请确认没有其他应用正在占用后重试。',
      imageDecodeError:
        '未能从所选图片中识别出二维码，请更换更清晰的图片重试。',
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
    if (saved === 'en' || saved === 'sv' || saved === 'zh') return saved;
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
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
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
