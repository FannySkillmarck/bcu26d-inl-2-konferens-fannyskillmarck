import heroImg from '/src/assets/images/hero_celestial_hall_1794721042686.jpg';
import astridImg from '/src/assets/images/speaker_astrid_lind_1794721043176.jpg';
import henrikImg from '/src/assets/images/speaker_henrik_solberg_1794721044549.jpg';
import mayaImg from '/src/assets/images/speaker_maya_ekstrom_1794721044856.jpg';
import lucasImg from '/src/assets/images/speaker_lucas_bergman_1794721044924.jpg';
import frejaImg from '/src/assets/images/speaker_freja_norberg_1794721045490.jpg';
import oskarImg from '/src/assets/images/speaker_oskar_nyman_1794721044700.jpg';
import mapImg from '/src/assets/images/venue_static_map_1794721045782.jpg';

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

export const HERO_MEDIA: ImageMedia = {
  src: heroImg,
  alt: 'Mälarsalen på Münchenbryggeriet i Stockholm med utsikt över Riddarfjärden i skymning och en armillarsfär i mässing i förgrunden.',
  width: 1376,
  height: 768,
};

export const VENUE_MAP_MEDIA: ImageMedia = {
  src: mapImg,
  alt: 'Statisk orienteringskarta över Södermalm och Riddarfjärden med markerad plats vid Münchenbryggeriet på Torkel Knutssonsgatan 2.',
  width: 1200,
  height: 896,
};

export const KEY_FACTS = [
  { label: 'Datum', value: '20 oktober 2027' },
  { label: 'Plats', value: 'Münchenbryggeriet, Stockholm' },
  { label: 'Program', value: '6 föreläsningar & samtal' },
  { label: 'Kapacitet', value: '320 platser' },
];

export const SCHEDULE_ITEMS: ScheduleItem[] = [
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
];

export const SPEAKERS: Speaker[] = [
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
];

export const TICKET_TIERS: TicketTier[] = [
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
];

export const PRACTICAL_DETAILS = [
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
];
