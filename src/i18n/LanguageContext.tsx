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
    },
    speakerModal: {
      closeAria: '关闭讲者简介',
      portraitAlt: (name) => `${name} 肖像`,
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
