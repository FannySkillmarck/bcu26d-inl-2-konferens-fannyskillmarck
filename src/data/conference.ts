import heroImg from '/src/assets/images/hero_celestial_hall_1794721042686.jpg';
import astridImg from '/src/assets/images/speaker_astrid_lind_1794721043176.jpg';
import henrikImg from '/src/assets/images/speaker_henrik_solberg_1794721044549.jpg';
import mayaImg from '/src/assets/images/speaker_maya_ekstrom_1794721044856.jpg';
import lucasImg from '/src/assets/images/speaker_lucas_bergman_1794721044924.jpg';
import frejaImg from '/src/assets/images/speaker_freja_norberg_1794721045490.jpg';
import oskarImg from '/src/assets/images/speaker_oskar_nyman_1794721044700.jpg';
import mapImg from '/src/assets/images/venue_static_map_1794721045782.jpg';
import type { Language } from '../i18n/LanguageContext';

export type TrackType = 'Huvudscen' | 'Workshop' | 'Samtal';

export interface ImageMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  speaker: string;
  speakerId: string;
  track: TrackType;
  room: string;
  description: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  city: string;
  image: string;
  width: number;
  height: number;
  email: string;
  handle: string;
  sessionTitle: string;
  sessionTime: string;
  bio: string;
}

export interface TicketTier {
  id: string;
  name: string;
  priceSek: number;
  priceFormatted: string;
  subtitle: string;
  featured?: boolean;
  includes: string[];
  quotaNote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ConferenceContent {
  heroMedia: ImageMedia;
  venueMapMedia: ImageMedia;
  keyFacts: Array<{ label: string; value: string }>;
  scheduleItems: ScheduleItem[];
  speakers: Speaker[];
  ticketTiers: TicketTier[];
  practicalDetails: Array<{ title: string; detail: string }>;
  faqItems: FaqItem[];
}

const CONFERENCE_DATA: Record<Language, ConferenceContent> = {
  sv: {
    heroMedia: {
      src: heroImg,
      alt: 'Mälarsalen på Münchenbryggeriet i Stockholm med utsikt över Riddarfjärden i skymning och en armillarsfär i mässing i förgrunden.',
      width: 1376,
      height: 768,
    },
    venueMapMedia: {
      src: mapImg,
      alt: 'Statisk orienteringskarta över Södermalm och Riddarfjärden med markerad plats vid Münchenbryggeriet på Torkel Knutssonsgatan 2.',
      width: 1200,
      height: 896,
    },
    keyFacts: [
      { label: 'Datum', value: '20 oktober 2027' },
      { label: 'Plats', value: 'Münchenbryggeriet, Stockholm' },
      { label: 'Program', value: '6 föreläsningar & samtal' },
      { label: 'Kapacitet', value: '320 platser' },
    ],
    scheduleItems: [
      {
        id: 'zodiakens-aterkomst',
        time: '09:00 – 09:50',
        title: 'Zodiakens återkomst i sekulär tid',
        speaker: 'Astrid Lind',
        speakerId: 'astrid-lind',
        track: 'Huvudscen',
        room: 'Mälarsalen',
        description:
          'Varför söker samtidsmänniskan rytm i planetära cykler när vardagskalendern blivit helt digital? En idéhistorisk öppningsföreläsning om nordisk almanackstradition.',
      },
      {
        id: 'saturnus-arkitektur',
        time: '10:15 – 11:05',
        title: 'Saturnus återkomst och arkitekturens tidslinjer',
        speaker: 'Henrik Solberg',
        speakerId: 'henrik-solberg',
        track: 'Huvudscen',
        room: 'Mälarsalen',
        description:
          'Hur 29-årscykler format observatorier, stadsplaner och livsfaser – från Tycho Brahes Ven till samtida skandinavisk formgivning.',
      },
      {
        id: 'rita-fodelsehoroskop',
        time: '11:30 – 12:20',
        title: 'Att rita ett födelsehoroskop utan mystifikation',
        speaker: 'Maya Ekström',
        speakerId: 'maya-ekstrom',
        track: 'Workshop',
        room: 'Bryggerisalen',
        description:
          'Praktisk genomgång av ekliptikan, husindelning och geometriska aspekter med fokus på tydlig grafisk notation och astronomisk precision.',
      },
      {
        id: 'manfaser-folktro',
        time: '13:30 – 14:20',
        title: 'Månfaser, tidvatten och folktro i Norden',
        speaker: 'Freja Norberg',
        speakerId: 'freja-norberg',
        track: 'Huvudscen',
        room: 'Mälarsalen',
        description:
          'Arkivfynd från 1700-talets skärgård visar hur bönder, sjöfarare och tidiga akademiker tolkade samma vintergata och månkalender.',
      },
      {
        id: 'kosmiska-motiv-typografi',
        time: '14:45 – 15:35',
        title: 'Kosmiska motiv i samtida skandinavisk typografi',
        speaker: 'Oskar Nyman',
        speakerId: 'oskar-nyman',
        track: 'Workshop',
        room: 'Bryggerisalen',
        description:
          'Från kopparstick i äldre stjärnatlaser till geometriska glyfer och variabla typsnitt för nutida böcker, kalendrar och utställningar.',
      },
      {
        id: 'personliga-horisonten',
        time: '16:00 – 17:00',
        title: 'Den personliga horisonten: Ascendenten som berättelse',
        speaker: 'Lucas Bergman & Astrid Lind',
        speakerId: 'lucas-bergman',
        track: 'Samtal',
        room: 'Mälarsalen',
        description:
          'Avslutande scensamtal om berättandets psykologi, arketypisk symbolik och varför himlakartor fortsätter väcka igenkänning.',
      },
    ],
    speakers: [
      {
        id: 'astrid-lind',
        name: 'Astrid Lind',
        role: 'Idéhistoriker & författare',
        city: 'Uppsala',
        image: astridImg,
        width: 896,
        height: 1200,
        email: 'astrid@stjarnfall.se',
        handle: '@astridlind',
        sessionTitle: 'Zodiakens återkomst i sekulär tid',
        sessionTime: '09:00 – 09:50',
        bio: 'Docent i idéhistoria vid Uppsala universitet och författare till "Almanackans dolda historia". Hon forskar om hur astronomiska trycksaker formade nordisk vardagstid från 1600-talet fram till i dag.',
      },
      {
        id: 'henrik-solberg',
        name: 'Henrik Solberg',
        role: 'Arkitekt & astrologihistoriker',
        city: 'Oslo',
        image: henrikImg,
        width: 896,
        height: 1200,
        email: 'henrik@stjarnfall.se',
        handle: '@henriksolberg',
        sessionTitle: 'Saturnus återkomst och arkitekturens tidslinjer',
        sessionTime: '10:15 – 11:05',
        bio: 'Arkitekt SAR/MSA verksam i Oslo och Stockholm. Hans arbete undersöker ljusinsläpp, solur och kosmologisk orientering i nordiska byggnader och observatorier.',
      },
      {
        id: 'maya-ekstrom',
        name: 'Maya Ekström',
        role: 'Astrolog & datavisualiserare',
        city: 'Göteborg',
        image: mayaImg,
        width: 896,
        height: 1200,
        email: 'maya@stjarnfall.se',
        handle: '@mayaekstrom',
        sessionTitle: 'Att rita ett födelsehoroskop utan mystifikation',
        sessionTime: '11:30 – 12:20',
        bio: 'Informationsdesigner som förenar klassisk hellenistisk kartteknik med modern datagrafik. Hon leder regelbundet kurser i astronomisk geometri för formgivare.',
      },
      {
        id: 'freja-norberg',
        name: 'Freja Norberg',
        role: 'Etnolog & arkivforskare',
        city: 'Lund',
        image: frejaImg,
        width: 896,
        height: 1200,
        email: 'freja@stjarnfall.se',
        handle: '@frejanorberg',
        sessionTitle: 'Månfaser, tidvatten och folktro i Norden',
        sessionTime: '13:30 – 14:20',
        bio: 'Tidigare intendent vid Folklivsarkivet i Lund. Freja har katalogiserat över 400 handskrivna bondepraktikor och vädermärken längs den svenska västkusten.',
      },
      {
        id: 'oskar-nyman',
        name: 'Oskar Nyman',
        role: 'Typograf & bokformgivare',
        city: 'Stockholm',
        image: oskarImg,
        width: 896,
        height: 1200,
        email: 'oskar@stjarnfall.se',
        handle: '@oskar_nyman',
        sessionTitle: 'Kosmiska motiv i samtida skandinavisk typografi',
        sessionTime: '14:45 – 15:35',
        bio: 'Grundare av ateljén Nyman Bokform i Stockholm. Har formgivit uppmärksammade konstböcker, astronomiska kartverk och specialritade symboltypsnitt.',
      },
      {
        id: 'lucas-bergman',
        name: 'Lucas Bergman',
        role: 'Kulturpsykolog & essäist',
        city: 'Malmö',
        image: lucasImg,
        width: 896,
        height: 1200,
        email: 'lucas@stjarnfall.se',
        handle: '@lucasbergman',
        sessionTitle: 'Den personliga horisonten: Ascendenten som berättelse',
        sessionTime: '16:00 – 17:00',
        bio: 'Legitimerad psykolog och medarbetare i flera nordiska kulturtidskrifter. Han skriver om symbolik, självberättelser och ritualer i en sekulariserad tid.',
      },
    ],
    ticketTiers: [
      {
        id: 'student',
        name: 'Student',
        priceSek: 690,
        priceFormatted: '690 kr',
        subtitle: 'För studerande med giltig studentlegitimation',
        includes: [
          'Heldagsentré till Mälarsalen',
          'Förmiddags- och eftermiddagskaffe',
          'Digital programskrift',
        ],
        quotaNote: 'Begränsat antal · 45 platser',
      },
      {
        id: 'ordinarie',
        name: 'Ordinarie',
        priceSek: 1490,
        priceFormatted: '1 490 kr',
        subtitle: 'Full tillgång till hela symposiet',
        featured: true,
        includes: [
          'Tillgång till huvudscen och workshops',
          'Nordisk lunchbuffé med utsikt över Riddarfjärden',
          'Tryckt konferenskompendium (128 sidor)',
          'Eftermingel från kl. 17:00',
        ],
        quotaNote: 'Mest vald · Inkl. moms',
      },
      {
        id: 'after-work',
        name: 'After Work',
        priceSek: 540,
        priceFormatted: '540 kr',
        subtitle: 'Eftermiddagsprogram och kvällsmingel från kl. 14:30',
        includes: [
          'De två sista programpunkterna',
          'Ett glas alkoholfritt eller mousserande',
          'Kvällsmingel i Bryggerisalen till kl. 19:00',
        ],
        quotaNote: 'Entré från kl. 14:30',
      },
      {
        id: 'utstallare',
        name: 'Utställare',
        priceSek: 3200,
        priceFormatted: '3 200 kr',
        subtitle: 'För förlag, formgivare och oberoende aktörer',
        includes: [
          'Eget utställarbord (180 cm) i foajén',
          'Två fullständiga ordinarie pass',
          'Omnämnande i tryckt program och på scen',
          'Eluttag och trådbundet nätverk',
        ],
        quotaNote: 'Endast 12 utställarplatser',
      },
    ],
    practicalDetails: [
      {
        title: 'Adress & lokal',
        detail:
          'Münchenbryggeriet, Torkel Knutssonsgatan 2, 118 25 Stockholm. Huvudentré via Söder Mälarstrand eller gårdssidan.',
      },
      {
        title: 'Kollektivtrafik',
        detail:
          'Tunnelbana till Mariatorget (uppgång Torkel Knutssonsgatan, cirka 5 minuters promenad) eller Slussen (10 minuter längs kajen).',
      },
      {
        title: 'Öppettider',
        detail:
          'Registrering och morgonkaffe öppnar 08:15. Första föreläsningen startar 09:00. Eftermingel pågår till 19:00.',
      },
      {
        title: 'Tillgänglighet',
        detail:
          'Stegfri entré och hiss till samtliga konferenssalar. Hörslinga finns installerad i Mälarsalen. Specialkost anges vid bokning.',
      },
    ],
    faqItems: [
      {
        id: 'parking',
        question: 'Var finns det parkering i närheten av Münchenbryggeriet?',
        answer:
          'Ett begränsat antal avgiftsbelagda gatuparkeringar finns längs Söder Mälarstrand och på Torkel Knutssonsgatan. Närmaste större parkeringshus ligger vid Hornsgatan och Mariatorget (cirka 5 minuters promenad). Vi rekommenderar i första hand tunnelbana till Mariatorget eller Slussen.',
      },
      {
        id: 'dietary',
        question: 'Hur hanteras specialkost, vegansk mat och allergier?',
        answer:
          'All fika och vår nordiska lunchbuffé märks tydligt med innehåll och erbjuder alltid vegetariska, veganska, glutenfria samt laktosfria alternativ. Ange eventuella matallergier direkt i fältet för specialkost vid biljettbokning, eller mejla info@stjarnfall.se senast fem dagar före symposiet.',
      },
      {
        id: 'accessibility',
        question: 'Är lokalerna anpassade för rullstol och hörselnedsättning?',
        answer:
          'Ja. Huvudentrén från Söder Mälarstrand har stegfri access och rymliga hissar leder direkt upp till både Mälarsalen och Bryggerisalen. Handikappanpassade toaletter finns på varje våningsplan, och hörslinga är installerad i Mälarsalen. Ledsagarbiljett ordnas kostnadsfritt via e-post.',
      },
      {
        id: 'tickets-transfer',
        question: 'Kan jag överlåta min biljett eller få återbetalning?',
        answer:
          'Biljetter kan överlåtas kostnadsfritt till en annan deltagare fram till 48 timmar före konferensens start. Återbetalning är möjlig fram till 30 dagar innan symposiet äger rum. Kontakta oss med ditt bokningsnamn så hjälper vi dig.',
      },
      {
        id: 'coatcheck-wifi',
        question: 'Ingår garderob, bagageförvaring och wifi?',
        answer:
          'Ja, bemannad garderob med plats för mindre resväskor ingår i alla biljettnivåer. Samtliga konferensytor har kostnadsfritt trådlöst nätverk samt eluttag i foajén.',
      },
    ],
  },
  en: {
    heroMedia: {
      src: heroImg,
      alt: 'Mälarsalen at Münchenbryggeriet in Stockholm overlooking Riddarfjärden at dusk with a brass armillary sphere in the foreground.',
      width: 1376,
      height: 768,
    },
    venueMapMedia: {
      src: mapImg,
      alt: 'Static orientation map of Södermalm and Riddarfjärden showing Münchenbryggeriet at Torkel Knutssonsgatan 2.',
      width: 1200,
      height: 896,
    },
    keyFacts: [
      { label: 'Date', value: 'October 20, 2027' },
      { label: 'Venue', value: 'Münchenbryggeriet, Stockholm' },
      { label: 'Programme', value: '6 lectures & dialogues' },
      { label: 'Capacity', value: '320 seats' },
    ],
    scheduleItems: [
      {
        id: 'zodiakens-aterkomst',
        time: '09:00 – 09:50',
        title: 'The Return of the Zodiac in Secular Time',
        speaker: 'Astrid Lind',
        speakerId: 'astrid-lind',
        track: 'Huvudscen',
        room: 'Mälarsalen',
        description:
          'Why do modern audiences seek rhythm in planetary cycles when everyday calendars are fully digital? An intellectual-history keynote on Nordic almanac traditions.',
      },
      {
        id: 'saturnus-arkitektur',
        time: '10:15 – 11:05',
        title: 'Saturn Return and the Timelines of Architecture',
        speaker: 'Henrik Solberg',
        speakerId: 'henrik-solberg',
        track: 'Huvudscen',
        room: 'Mälarsalen',
        description:
          'How 29-year cycles have shaped observatories, urban plans, and life stages — from Tycho Brahe’s Ven to contemporary Scandinavian design.',
      },
      {
        id: 'rita-fodelsehoroskop',
        time: '11:30 – 12:20',
        title: 'Drawing a Birth Chart Without Mystification',
        speaker: 'Maya Ekström',
        speakerId: 'maya-ekstrom',
        track: 'Workshop',
        room: 'Bryggerisalen',
        description:
          'Hands-on walkthrough of the ecliptic, house division, and geometric aspects focusing on crisp graphic notation and astronomical precision.',
      },
      {
        id: 'manfaser-folktro',
        time: '13:30 – 14:20',
        title: 'Lunar Phases, Tides, and Nordic Folklore',
        speaker: 'Freja Norberg',
        speakerId: 'freja-norberg',
        track: 'Huvudscen',
        room: 'Mälarsalen',
        description:
          'Archival discoveries from the 18th-century archipelago show how farmers, sailors, and early scholars read the same Milky Way and lunar calendar.',
      },
      {
        id: 'kosmiska-motiv-typografi',
        time: '14:45 – 15:35',
        title: 'Cosmic Motifs in Contemporary Scandinavian Typography',
        speaker: 'Oskar Nyman',
        speakerId: 'oskar-nyman',
        track: 'Workshop',
        room: 'Bryggerisalen',
        description:
          'From copperplate engravings in historic star atlases to geometric glyphs and variable typefaces for modern books, calendars, and exhibitions.',
      },
      {
        id: 'personliga-horisonten',
        time: '16:00 – 17:00',
        title: 'The Personal Horizon: The Ascendant as Narrative',
        speaker: 'Lucas Bergman & Astrid Lind',
        speakerId: 'lucas-bergman',
        track: 'Samtal',
        room: 'Mälarsalen',
        description:
          'Closing stage dialogue on the psychology of storytelling, archetypal symbolism, and why celestial charts continue to resonate.',
      },
    ],
    speakers: [
      {
        id: 'astrid-lind',
        name: 'Astrid Lind',
        role: 'Historian of Ideas & Author',
        city: 'Uppsala',
        image: astridImg,
        width: 896,
        height: 1200,
        email: 'astrid@stjarnfall.se',
        handle: '@astridlind',
        sessionTitle: 'The Return of the Zodiac in Secular Time',
        sessionTime: '09:00 – 09:50',
        bio: 'Associate Professor in the History of Ideas at Uppsala University and author of "The Hidden History of the Almanac". She studies how astronomical print shaped Nordic everyday time from the 1600s to today.',
      },
      {
        id: 'henrik-solberg',
        name: 'Henrik Solberg',
        role: 'Architect & Astrological Historian',
        city: 'Oslo',
        image: henrikImg,
        width: 896,
        height: 1200,
        email: 'henrik@stjarnfall.se',
        handle: '@henriksolberg',
        sessionTitle: 'Saturn Return and the Timelines of Architecture',
        sessionTime: '10:15 – 11:05',
        bio: 'Architect SAR/MSA based in Oslo and Stockholm. His work investigates daylight apertures, sundials, and cosmological orientation in Nordic buildings and observatories.',
      },
      {
        id: 'maya-ekstrom',
        name: 'Maya Ekström',
        role: 'Astrologer & Data Visualiser',
        city: 'Gothenburg',
        image: mayaImg,
        width: 896,
        height: 1200,
        email: 'maya@stjarnfall.se',
        handle: '@mayaekstrom',
        sessionTitle: 'Drawing a Birth Chart Without Mystification',
        sessionTime: '11:30 – 12:20',
        bio: 'Information designer bridging classical Hellenistic charting techniques with modern data graphics. She regularly leads courses in astronomical geometry for designers.',
      },
      {
        id: 'freja-norberg',
        name: 'Freja Norberg',
        role: 'Ethnologist & Archival Researcher',
        city: 'Lund',
        image: frejaImg,
        width: 896,
        height: 1200,
        email: 'freja@stjarnfall.se',
        handle: '@frejanorberg',
        sessionTitle: 'Lunar Phases, Tides, and Nordic Folklore',
        sessionTime: '13:30 – 14:20',
        bio: 'Former curator at the Folklife Archives in Lund. Freja has catalogued over 400 handwritten farmers’ almanacs and weather proverbs along Sweden’s west coast.',
      },
      {
        id: 'oskar-nyman',
        name: 'Oskar Nyman',
        role: 'Typographer & Book Designer',
        city: 'Stockholm',
        image: oskarImg,
        width: 896,
        height: 1200,
        email: 'oskar@stjarnfall.se',
        handle: '@oskar_nyman',
        sessionTitle: 'Cosmic Motifs in Contemporary Scandinavian Typography',
        sessionTime: '14:45 – 15:35',
        bio: 'Founder of studio Nyman Bokform in Stockholm. Has designed acclaimed art books, astronomical atlases, and bespoke symbolic typefaces.',
      },
      {
        id: 'lucas-bergman',
        name: 'Lucas Bergman',
        role: 'Cultural Psychologist & Essayist',
        city: 'Malmö',
        image: lucasImg,
        width: 896,
        height: 1200,
        email: 'lucas@stjarnfall.se',
        handle: '@lucasbergman',
        sessionTitle: 'The Personal Horizon: The Ascendant as Narrative',
        sessionTime: '16:00 – 17:00',
        bio: 'Licensed psychologist and contributor to several Nordic cultural journals. He writes on symbolism, personal narrative, and ritual in a secular age.',
      },
    ],
    ticketTiers: [
      {
        id: 'student',
        name: 'Student',
        priceSek: 690,
        priceFormatted: '690 SEK',
        subtitle: 'For students with a valid student ID card',
        includes: [
          'Full-day admission to Mälarsalen',
          'Morning and afternoon coffee service',
          'Digital symposium booklet',
        ],
        quotaNote: 'Limited allocation · 45 seats',
      },
      {
        id: 'ordinarie',
        name: 'Standard',
        priceSek: 1490,
        priceFormatted: '1,490 SEK',
        subtitle: 'Full access to the entire symposium',
        featured: true,
        includes: [
          'Access to main stage and workshops',
          'Nordic lunch buffet overlooking Riddarfjärden',
          'Printed symposium compendium (128 pages)',
          'Evening reception from 17:00',
        ],
        quotaNote: 'Most popular · Incl. VAT',
      },
      {
        id: 'after-work',
        name: 'After Work',
        priceSek: 540,
        priceFormatted: '540 SEK',
        subtitle: 'Afternoon programme and evening reception from 14:30',
        includes: [
          'Final two programme sessions',
          'One complimentary sparkling or non-alcoholic drink',
          'Evening gathering in Bryggerisalen until 19:00',
        ],
        quotaNote: 'Admission from 14:30',
      },
      {
        id: 'utstallare',
        name: 'Exhibitor',
        priceSek: 3200,
        priceFormatted: '3,200 SEK',
        subtitle: 'For publishers, designers, and independent studios',
        includes: [
          'Dedicated exhibitor table (180 cm) in the foyer',
          'Two full Standard symposium passes',
          'Credit in the printed programme and on stage',
          'Power outlet and wired ethernet connection',
        ],
        quotaNote: 'Only 12 exhibitor tables',
      },
    ],
    practicalDetails: [
      {
        title: 'Address & venue',
        detail:
          'Münchenbryggeriet, Torkel Knutssonsgatan 2, 118 25 Stockholm. Main entrance via Söder Mälarstrand or the courtyard.',
      },
      {
        title: 'Public transit',
        detail:
          'Metro to Mariatorget (exit Torkel Knutssonsgatan, approx. 5 min walk) or Slussen (10 minutes along the waterfront).',
      },
      {
        title: 'Opening hours',
        detail:
          'Registration and morning coffee open at 08:15. First lecture begins at 09:00. Evening reception runs until 19:00.',
      },
      {
        title: 'Accessibility',
        detail:
          'Step-free entrance and elevator access to all conference halls. Hearing loop installed in Mälarsalen. Dietary needs can be noted at booking.',
      },
    ],
    faqItems: [
      {
        id: 'parking',
        question: 'Where can I park near Münchenbryggeriet?',
        answer:
          'Limited paid street parking is available along Söder Mälarstrand and Torkel Knutssonsgatan. The nearest larger parking garages are located near Hornsgatan and Mariatorget (about a 5-minute walk). Whenever possible, we recommend taking the metro to Mariatorget or Slussen.',
      },
      {
        id: 'dietary',
        question: 'How are dietary requirements and food allergies handled?',
        answer:
          'All coffee breaks and our Nordic lunch buffet are clearly labelled and always include vegetarian, vegan, gluten-free, and lactose-free choices. Please enter any allergies in the dietary field when booking your ticket, or email info@stjarnfall.se at least five days before the event.',
      },
      {
        id: 'accessibility',
        question: 'Are the halls accessible for wheelchairs and hearing aids?',
        answer:
          'Yes. The main entrance via Söder Mälarstrand is step-free, and spacious elevators connect directly to both Mälarsalen and Bryggerisalen. Accessible restrooms are available on every floor, and a hearing loop is installed in Mälarsalen. Companion tickets are available free of charge upon request.',
      },
      {
        id: 'tickets-transfer',
        question:
          'Can I transfer my ticket to someone else or request a refund?',
        answer:
          'Tickets can be transferred to another attendee free of charge up to 48 hours before the symposium begins. Full refunds are available up to 30 days prior to the event. Email us with your booking details and we will update your registration.',
      },
      {
        id: 'coatcheck-wifi',
        question: 'Are coat check, luggage storage, and Wi-Fi included?',
        answer:
          'Yes, attended coat check with space for cabin luggage is included with every pass. Free high-speed Wi-Fi and power outlets in the foyer are available throughout the day.',
      },
    ],
  },
  zh: {
    heroMedia: {
      src: heroImg,
      alt: '暮色中的斯德哥尔摩慕尼黑啤酒厂会议中心 Mälarsalen 厅，俯瞰骑士湾，前景摆有一座黄铜浑仪。',
      width: 1376,
      height: 768,
    },
    venueMapMedia: {
      src: mapImg,
      alt: '斯德哥尔摩南岛区与骑士湾静态方位示意图，标示 Torkel Knutssonsgatan 2 慕尼黑啤酒厂会议中心位置。',
      width: 1200,
      height: 896,
    },
    keyFacts: [
      { label: '日期', value: '2027年10月20日' },
      { label: '地点', value: '慕尼黑啤酒厂会议中心，斯德哥尔摩' },
      { label: '议程', value: '6场演讲与对谈' },
      { label: '容量', value: '320 席位' },
    ],
    scheduleItems: [
      {
        id: 'zodiakens-aterkomst',
        time: '09:00 – 09:50',
        title: '世俗时代中的黄道十二宫回归',
        speaker: 'Astrid Lind',
        speakerId: 'astrid-lind',
        track: 'Huvudscen',
        room: 'Mälarsalen 厅',
        description:
          '当日常历法全面数字化后，当代人为何仍在行星周期中寻找节律？一场关于北欧历书传统的思想史开幕演讲。',
      },
      {
        id: 'saturnus-arkitektur',
        time: '10:15 – 11:05',
        title: '土星回归与建筑的时间轴',
        speaker: 'Henrik Solberg',
        speakerId: 'henrik-solberg',
        track: 'Huvudscen',
        room: 'Mälarsalen 厅',
        description:
          '29年周期如何塑造天文台、城市规划与人生阶段——从第谷·布拉赫的文岛到当代斯堪的纳维亚设计。',
      },
      {
        id: 'rita-fodelsehoroskop',
        time: '11:30 – 12:20',
        title: '去神秘化地绘制出生星盘',
        speaker: 'Maya Ekström',
        speakerId: 'maya-ekstrom',
        track: 'Workshop',
        room: 'Bryggerisalen 厅',
        description:
          '黄道、宫位划分与几何相位的实操讲解，聚焦清晰的图形符号与天文学精度。',
      },
      {
        id: 'manfaser-folktro',
        time: '13:30 – 14:20',
        title: '北欧的月相、潮汐与民间信仰',
        speaker: 'Freja Norberg',
        speakerId: 'freja-norberg',
        track: 'Huvudscen',
        room: 'Mälarsalen 厅',
        description:
          '18世纪群岛档案揭示农夫、航海者与早期学者如何共同解读同一片银河与阴历。',
      },
      {
        id: 'kosmiska-motiv-typografi',
        time: '14:45 – 15:35',
        title: '当代斯堪的纳维亚字体排印中的宇宙意象',
        speaker: 'Oskar Nyman',
        speakerId: 'oskar-nyman',
        track: 'Workshop',
        room: 'Bryggerisalen 厅',
        description:
          '从古典星图铜版画到现代书籍、历书与展览中的几何字形和可变字体设计。',
      },
      {
        id: 'personliga-horisonten',
        time: '16:00 – 17:00',
        title: '个人地平线：作为叙事的上升星座',
        speaker: 'Lucas Bergman & Astrid Lind',
        speakerId: 'lucas-bergman',
        track: 'Samtal',
        room: 'Mälarsalen 厅',
        description:
          '闭幕舞台对谈，探讨叙事心理学、原型象征以及天体星图为何至今仍能引发共鸣。',
      },
    ],
    speakers: [
      {
        id: 'astrid-lind',
        name: 'Astrid Lind',
        role: '思想史学者兼作家',
        city: '乌普萨拉',
        image: astridImg,
        width: 896,
        height: 1200,
        email: 'astrid@stjarnfall.se',
        handle: '@astridlind',
        sessionTitle: '世俗时代中的黄道十二宫回归',
        sessionTime: '09:00 – 09:50',
        bio: '乌普萨拉大学思想史副教授，《历书的隐秘历史》作者。长期研究17世纪以来天文出版物如何塑造北欧日常时间观念。',
      },
      {
        id: 'henrik-solberg',
        name: 'Henrik Solberg',
        role: '建筑师兼星象史研究者',
        city: '奥斯陆',
        image: henrikImg,
        width: 896,
        height: 1200,
        email: 'henrik@stjarnfall.se',
        handle: '@henriksolberg',
        sessionTitle: '土星回归与建筑的时间轴',
        sessionTime: '10:15 – 11:05',
        bio: '活跃于奥斯陆与斯德哥尔摩的 SAR/MSA 注册建筑师，专注于北欧建筑与天文台中的采光、日晷与宇宙方位研究。',
      },
      {
        id: 'maya-ekstrom',
        name: 'Maya Ekström',
        role: '占星学者兼数据可视化设计师',
        city: '哥德堡',
        image: mayaImg,
        width: 896,
        height: 1200,
        email: 'maya@stjarnfall.se',
        handle: '@mayaekstrom',
        sessionTitle: '去神秘化地绘制出生星盘',
        sessionTime: '11:30 – 12:20',
        bio: '将古典希腊化时期制图技艺与现代数据图形相结合的信息设计师，定期为设计师群体开设天文几何课程。',
      },
      {
        id: 'freja-norberg',
        name: 'Freja Norberg',
        role: '民俗学家兼档案研究员',
        city: '隆德',
        image: frejaImg,
        width: 896,
        height: 1200,
        email: 'freja@stjarnfall.se',
        handle: '@frejanorberg',
        sessionTitle: '北欧的月相、潮汐与民间信仰',
        sessionTime: '13:30 – 14:20',
        bio: '曾任隆德民俗档案馆馆员，系统编目了瑞典西海岸四百余份手写农民历书与气象谚语。',
      },
      {
        id: 'oskar-nyman',
        name: 'Oskar Nyman',
        role: '字体设计师兼书籍装帧师',
        city: '斯德哥尔摩',
        image: oskarImg,
        width: 896,
        height: 1200,
        email: 'oskar@stjarnfall.se',
        handle: '@oskar_nyman',
        sessionTitle: '当代斯堪的纳维亚字体排印中的宇宙意象',
        sessionTime: '14:45 – 15:35',
        bio: '斯德哥尔摩 Nyman Bokform 工作室创始人，设计过诸多备受赞誉的艺术画册、天文图集及定制符号字体。',
      },
      {
        id: 'lucas-bergman',
        name: 'Lucas Bergman',
        role: '文化心理学家兼随笔作家',
        city: '马尔默',
        image: lucasImg,
        width: 896,
        height: 1200,
        email: 'lucas@stjarnfall.se',
        handle: '@lucasbergman',
        sessionTitle: '个人地平线：作为叙事的上升星座',
        sessionTime: '16:00 – 17:00',
        bio: '执业心理学家及多家北欧文化期刊撰稿人，专注于世俗时代中的象征符号、自我叙事与仪式感研究。',
      },
    ],
    ticketTiers: [
      {
        id: 'student',
        name: '学生票',
        priceSek: 690,
        priceFormatted: '690 瑞典克朗',
        subtitle: '适用于持有有效学生证的在读学生',
        includes: [
          'Mälarsalen 主厅全日入场资格',
          '上下午茶歇咖啡服务',
          '数字版研讨会手册',
        ],
        quotaNote: '名额有限 · 仅限 45 席',
      },
      {
        id: 'ordinarie',
        name: '标准全程票',
        priceSek: 1490,
        priceFormatted: '1,490 瑞典克朗',
        subtitle: '畅享研讨会全部议程与活动',
        featured: true,
        includes: [
          '主舞台演讲及全部工作坊入场资格',
          '骑士湾景北欧风味自助午餐',
          '精装印刷研讨会文集（128 页）',
          '17:00 起晚间交流酒会',
        ],
        quotaNote: '最受欢迎 · 含税',
      },
      {
        id: 'after-work',
        name: '午后交流票',
        priceSek: 540,
        priceFormatted: '540 瑞典克朗',
        subtitle: '14:30 起午后议程及晚间社交酒会',
        includes: [
          '压轴两场专题议程入场资格',
          '一杯起泡饮品或无酒精特调',
          'Bryggerisalen 厅晚间交流至 19:00',
        ],
        quotaNote: '14:30 起入场',
      },
      {
        id: 'utstallare',
        name: '展商套票',
        priceSek: 3200,
        priceFormatted: '3,200 瑞典克朗',
        subtitle: '面向出版社、设计工作室及独立机构',
        includes: [
          '前厅专属展示桌位（180 厘米）',
          '两张完整标准全程参会通行证',
          '印刷议程手册及现场舞台鸣谢',
          '配备电源插座与有线网络接口',
        ],
        quotaNote: '仅设 12 个展位',
      },
    ],
    practicalDetails: [
      {
        title: '地址与场馆',
        detail:
          'Münchenbryggeriet，Torkel Knutssonsgatan 2，118 25 Stockholm。可由 Söder Mälarstrand 或内庭院主入口进入。',
      },
      {
        title: '公共交通',
        detail:
          '搭乘地铁至 Mariatorget 站（Torkel Knutssonsgatan 出口，步行约 5 分钟）或 Slussen 站（沿水岸步行约 10 分钟）。',
      },
      {
        title: '开放时间',
        detail:
          '08:15 开放签到与早茶咖啡，09:00 首场演讲开始，晚间交流活动持续至 19:00。',
      },
      {
        title: '无障碍设施',
        detail:
          '无台阶平层入口，电梯直达所有会议厅；Mälarsalen 厅配有听力辅助感应环路。特殊饮食需求可在购票时备注。',
      },
    ],
    faqItems: [
      {
        id: 'parking',
        question: '慕尼黑啤酒厂会议中心附近有哪些停车位？',
        answer:
          'Söder Mälarstrand 沿线和 Torkel Knutssonsgatan 街道设有少量收费路边停车位。附近较大的室内停车场位于 Hornsgatan 与 Mariatorget 附近（步行约 5 分钟）。我们建议优先搭乘地铁前往 Mariatorget 或 Slussen 站。',
      },
      {
        id: 'dietary',
        question: '如何满足特殊饮食需求与食物过敏要求？',
        answer:
          '所有茶歇点心及北欧风味自助午餐均配有清晰成分标识，并常备素食、纯素、无麸质及无乳糖选项。请在预订门票时于“特殊饮食要求”栏注明过敏源，或最晚于活动前五天发送邮件至 info@stjarnfall.se。',
      },
      {
        id: 'accessibility',
        question: '场馆是否适合轮椅通行并配有听力辅助设备？',
        answer:
          '是的。Söder Mälarstrand 主入口提供无台阶平层通道，宽敞电梯可直达 Mälarsalen 厅与 Bryggerisalen 厅。每层均设无障碍洗手间，Mälarsalen 厅配有听力辅助感应环路。如有陪同人员需求，可通过邮件免费申请陪同席位。',
      },
      {
        id: 'tickets-transfer',
        question: '是否支持门票转让或退票？',
        answer:
          '门票可在研讨会开始前 48 小时内免费转让给其他参会者。活动前 30 天内支持全额退票。请将您的预订信息发送至联系邮箱，我们将为您办理变更。',
      },
      {
        id: 'coatcheck-wifi',
        question: '门票是否包含衣帽寄存、行李存放与无线网络？',
        answer:
          '包含。所有票种均免费提供专人看管的衣帽及随身登机箱寄存服务。会议全程覆盖免费无线网络，前厅亦配有电源插座。',
      },
    ],
  },
};

export function getConferenceData(language: Language): ConferenceContent {
  return CONFERENCE_DATA[language];
}
