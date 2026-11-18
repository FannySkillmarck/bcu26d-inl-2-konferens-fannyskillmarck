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

export interface ConferenceContent {
  heroMedia: ImageMedia;
  venueMapMedia: ImageMedia;
  keyFacts: Array<{ label: string; value: string }>;
  scheduleItems: ScheduleItem[];
  speakers: Speaker[];
  ticketTiers: TicketTier[];
  practicalDetails: Array<{ title: string; detail: string }>;
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
  },
};

export function getConferenceData(language: Language): ConferenceContent {
  return CONFERENCE_DATA[language];
}
