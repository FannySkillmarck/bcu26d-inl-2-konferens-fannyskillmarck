import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Mail, MapPin } from 'lucide-react';
import { Header } from './components/Header';
import { HowToGetHere } from './components/HowToGetHere';
import { ResilientImage } from './components/ResilientImage';
import { SpeakerModal } from './components/SpeakerModal';
import { TicketModal } from './components/TicketModal';
import {
  HERO_MEDIA,
  KEY_FACTS,
  PRACTICAL_DETAILS,
  SCHEDULE_ITEMS,
  SPEAKERS,
  TICKET_TIERS,
  VENUE_MAP_MEDIA,
  type Speaker,
  type TicketTier,
  type TrackType,
} from './data/conference';

const TRACK_FILTERS: Array<'Alla' | TrackType> = [
  'Alla',
  'Huvudscen',
  'Workshop',
  'Samtal',
];

export default function App() {
  const [activeTrack, setActiveTrack] = useState<'Alla' | TrackType>('Alla');
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [highlightedSpeakerId, setHighlightedSpeakerId] = useState<
    string | null
  >(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketTier | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () =>
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const visibleSchedule =
    activeTrack === 'Alla'
      ? SCHEDULE_ITEMS
      : SCHEDULE_ITEMS.filter((item) => item.track === activeTrack);

  const handleJumpToProgram = (speakerId: string) => {
    setSelectedSpeaker(null);
    setActiveTrack('Alla');
    setHighlightedSpeakerId(speakerId);
    const section = document.getElementById('program');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      id="top"
      className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]"
    >
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <Header />

      <main>
        {/* 1. HERO SECTION */}
        <section
          aria-labelledby="hero-heading"
          className="mx-auto max-w-[1200px] px-4 pt-10 pb-14 sm:px-6 lg:pt-16 lg:pb-20"
        >
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-between lg:col-span-5">
              <div>
                <div className="flex items-center gap-3">
                  <svg
                    viewBox="0 0 48 48"
                    className="hero-emblem h-9 w-9 shrink-0 text-[var(--accent-brass)]"
                    aria-hidden="true"
                  >
                    <g className="hero-emblem__ring">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <circle cx="24" cy="4" r="2" fill="currentColor" />
                    </g>
                    <g className="hero-emblem__ring--reverse">
                      <circle
                        cx="24"
                        cy="24"
                        r="13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                      <circle cx="37" cy="24" r="1.5" fill="currentColor" />
                    </g>
                    <circle cx="24" cy="24" r="2.2" fill="currentColor" />
                  </svg>
                  <p className="text-xs font-medium text-[var(--text-muted)]">
                    Stockholm ·{' '}
                    <time dateTime="2027-10-20">20 oktober 2027</time> ·
                    Münchenbryggeriet
                  </p>
                </div>

                <h1
                  id="hero-heading"
                  className="typo-display mt-6 font-semibold tracking-tight text-[var(--text-primary)]"
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3.75rem)',
                    lineHeight: 1.06,
                    textWrap: 'balance',
                  }}
                >
                  Där himmelsmekanik möter samtida kultur
                </h1>

                <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-[var(--text-muted)]">
                  Ett heldagssymposium om astrologi, historiska stjärnatlaser
                  och planetära tidslinjer. Sex nordiska röster utforskar hur
                  stjärnhimlen formar vår uppfattning om tid, arkitektur och
                  berättande.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <a href="#biljetter" className="btn-primary px-6 py-3 text-sm">
                  Välj biljett
                </a>
                <a
                  href="#program"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-brass)] transition-colors whitespace-nowrap min-h-[44px]"
                >
                  <span>Utforska schemat</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <figure className="lg:col-span-7 overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)]">
              <ResilientImage
                src={HERO_MEDIA.src}
                alt={HERO_MEDIA.alt}
                width={HERO_MEDIA.width}
                height={HERO_MEDIA.height}
                priority
                className="aspect-[16/10] w-full object-cover lg:aspect-auto lg:h-full"
                fallbackLabel="Münchenbryggeriet — Mälarsalen"
              />
            </figure>
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-6 border-y border-[var(--border-hairline)] py-6 sm:grid-cols-2 lg:grid-cols-4">
            {KEY_FACTS.map((fact) => (
              <div key={fact.label} className="min-w-0">
                <dt className="text-xs font-medium text-[var(--text-muted)]">
                  {fact.label}
                </dt>
                <dd className="typo-display mt-1 text-lg font-semibold text-[var(--text-primary)] tabular-nums">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 2. SCHEDULE / PROGRAM SECTION */}
        <section
          id="program"
          aria-labelledby="heading-program"
          className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-20"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-header__kicker">01. Dagsprogram</p>
              <h2
                id="heading-program"
                className="typo-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Sex föreläsningar från gryning till skymning
              </h2>
            </div>

            <div
              role="group"
              aria-label="Filtrera programpunkter efter format"
              className="inline-flex flex-wrap items-center gap-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-1 self-start md:self-auto"
            >
              {TRACK_FILTERS.map((track) => {
                const isActive = activeTrack === track;
                return (
                  <button
                    key={track}
                    type="button"
                    onClick={() => {
                      setActiveTrack(track);
                      setHighlightedSpeakerId(null);
                    }}
                    aria-pressed={isActive}
                    className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
                      isActive
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {track}
                  </button>
                );
              })}
            </div>
          </div>

          <ol className="schedule__list mt-10 overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
            {visibleSchedule.map((item) => {
              const isHighlighted = highlightedSpeakerId === item.speakerId;
              return (
                <li key={item.id} className="schedule__row">
                  <article
                    data-track={item.track}
                    className={`schedule__item grid grid-cols-1 gap-4 py-6 pr-5 sm:pr-6 md:grid-cols-12 md:items-start md:gap-6 ${
                      isHighlighted ? 'schedule__item--highlighted' : ''
                    }`}
                  >
                    <div className="md:col-span-3">
                      <time className="typo-mono block text-sm font-medium text-[var(--text-primary)]">
                        {item.time}
                      </time>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {item.track} · {item.room}
                      </p>
                    </div>

                    <div className="md:col-span-6">
                      <h3 className="typo-display text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                        {item.description}
                      </p>
                    </div>

                    <div className="md:col-span-3 md:text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const found = SPEAKERS.find(
                            (s) => s.id === item.speakerId
                          );
                          if (found) setSelectedSpeaker(found);
                        }}
                        aria-label={`Visa talarprofil för ${item.speaker}`}
                        className="inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--accent-brass)] hover:underline"
                      >
                        {item.speaker}
                      </button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        {/* 3. SPEAKER GALLERY SECTION (Hover + Keyboard Focus Reveal) */}
        <section
          id="talare"
          aria-labelledby="heading-talare"
          className="border-y border-[var(--border-hairline)] bg-[var(--bg-subtle)]/55 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <header className="max-w-2xl">
              <p className="section-header__kicker">02. Medverkande talare</p>
              <h2
                id="heading-talare"
                className="typo-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Forskare, formgivare och astrologer
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                Håll muspekaren över eller navigera med Tab till ett porträtt
                för att visa kontaktuppgifter och föreläsningstitel. Välj ett
                kort för fullständig biografi.
              </p>
            </header>

            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SPEAKERS.map((speaker) => (
                <li key={speaker.id}>
                  <article className="speaker-card rounded-lg">
                    <figure className="speaker-card__media relative aspect-[3/4] overflow-hidden bg-[var(--bg-subtle)]">
                      <ResilientImage
                        src={speaker.image}
                        alt={`Porträtt av ${speaker.name}, ${speaker.role}`}
                        width={speaker.width}
                        height={speaker.height}
                        className="speaker-card__portrait h-full w-full object-cover"
                        fallbackLabel={speaker.name}
                      />

                      <figcaption className="speaker-card__overlay pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 text-white">
                        <time className="typo-mono text-xs font-medium text-amber-300">
                          {speaker.sessionTime}
                        </time>
                        <p className="typo-display mt-1 text-base font-semibold leading-snug">
                          {speaker.sessionTitle}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/20 pt-3 text-xs text-white/90">
                          <span className="inline-flex items-center gap-1.5 truncate">
                            <Mail
                              className="h-3.5 w-3.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span className="truncate">{speaker.email}</span>
                          </span>
                          <span className="typo-mono shrink-0">
                            {speaker.handle}
                          </span>
                        </div>
                      </figcaption>
                    </figure>

                    <div className="speaker-card__body p-5">
                      <h3 className="typo-display text-lg font-semibold text-[var(--text-primary)]">
                        <button
                          type="button"
                          onClick={() => setSelectedSpeaker(speaker)}
                          aria-label={`${speaker.name}, ${speaker.role} från ${speaker.city}. Föreläsning: ${speaker.sessionTitle}, ${speaker.sessionTime}. Kontakt: ${speaker.email}. Öppna fullständig biografi.`}
                          className="speaker-card__trigger text-left after:absolute after:inset-0 after:content-['']"
                        >
                          {speaker.name}
                        </button>
                      </h3>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {speaker.role} · {speaker.city}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. TICKET TIERS SECTION */}
        <section
          id="biljetter"
          aria-labelledby="heading-biljetter"
          className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24"
        >
          <header className="max-w-2xl">
            <p className="section-header__kicker">03. Biljettnivåer</p>
            <h2
              id="heading-biljetter"
              className="typo-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Välj det pass som passar din dag
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              Alla biljetter inkluderar garderob, programhäfte och fri tillgång
              till utställningsytan i foajén.
            </p>
          </header>

          <ul className="ticket-grid mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TICKET_TIERS.map((tier) => (
              <li key={tier.id} className="ticket-grid__item flex">
                <article
                  data-featured={tier.featured ? 'true' : 'false'}
                  className="ticket-card flex w-full flex-col justify-between rounded-lg p-6"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="typo-display text-xl font-semibold text-[var(--text-primary)]">
                        {tier.name}
                      </h3>
                      {tier.featured && (
                        <strong className="text-xs font-semibold text-[var(--accent-brass)]">
                          Rekommenderad
                        </strong>
                      )}
                    </div>

                    <p className="typo-mono mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                      {tier.priceFormatted}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                      {tier.subtitle}
                    </p>

                    <ul className="mt-6 space-y-2.5 border-t border-[var(--border-hairline)] pt-5 text-sm text-[var(--text-primary)]">
                      {tier.includes.map((line) => (
                        <li key={line} className="flex items-start gap-2.5">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-brass)]"
                            aria-hidden="true"
                          />
                          <span className="text-xs leading-relaxed text-[var(--text-muted)]">
                            {line}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4">
                    <p className="mb-3 text-xs text-[var(--text-muted)]">
                      {tier.quotaNote}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(tier)}
                      aria-label={`Välj biljettnivå ${tier.name} för ${tier.priceFormatted}`}
                      className={
                        tier.featured
                          ? 'btn-primary w-full px-4 py-2.5 text-xs'
                          : 'w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors whitespace-nowrap min-h-[44px]'
                      }
                    >
                      Välj {tier.name}
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. PRACTICAL INFORMATION & STATIC MAP */}
        <section
          id="praktiskt"
          aria-labelledby="heading-praktiskt"
          className="border-t border-[var(--border-hairline)] bg-[var(--bg-subtle)]/55 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="section-header__kicker">
                  04. Praktisk information
                </p>
                <h2
                  id="heading-praktiskt"
                  className="typo-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                  style={{ textWrap: 'balance' }}
                >
                  Hitta till Münchenbryggeriet
                </h2>

                <dl className="mt-8 divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
                  {PRACTICAL_DETAILS.map((row) => (
                    <div key={row.title} className="py-4">
                      <dt className="text-xs font-semibold text-[var(--text-primary)]">
                        {row.title}
                      </dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
                        {row.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="lg:col-span-7">
                <figure className="overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
                  <ResilientImage
                    src={VENUE_MAP_MEDIA.src}
                    alt={VENUE_MAP_MEDIA.alt}
                    width={VENUE_MAP_MEDIA.width}
                    height={VENUE_MAP_MEDIA.height}
                    className="aspect-[4/3] w-full object-cover"
                    fallbackLabel="Karta: Torkel Knutssonsgatan 2, Stockholm"
                  />
                  <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-hairline)] px-4 py-3.5 text-xs text-[var(--text-muted)] sm:px-5">
                    <address className="inline-flex items-center gap-1.5 font-medium not-italic text-[var(--text-primary)]">
                      <MapPin
                        className="h-3.5 w-3.5 shrink-0 text-[var(--accent-brass)]"
                        aria-hidden="true"
                      />
                      Torkel Knutssonsgatan 2, Södermalm
                    </address>
                    <span className="typo-mono">59.3204° N, 18.0558° Ö</span>
                  </figcaption>
                </figure>
              </div>
            </div>

            <HowToGetHere />
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)] py-10">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="typo-display text-base font-semibold text-[var(--text-primary)]">
              Stjärnfall 2027
            </p>
            <address className="mt-1 text-xs not-italic text-[var(--text-muted)]">
              © 2027 Stjärnfall Symposium ·{' '}
              <a
                href="mailto:info@stjarnfall.se"
                className="hover:text-[var(--text-primary)]"
              >
                info@stjarnfall.se
              </a>
            </address>
          </div>

          <nav aria-label="Sidfotsnavigation">
            <ul className="flex flex-wrap items-center gap-6 text-xs font-medium text-[var(--text-muted)]">
              <li>
                <a href="#program" className="hover:text-[var(--text-primary)]">
                  Program
                </a>
              </li>
              <li>
                <a href="#talare" className="hover:text-[var(--text-primary)]">
                  Talare
                </a>
              </li>
              <li>
                <a
                  href="#biljetter"
                  className="hover:text-[var(--text-primary)]"
                >
                  Biljetter
                </a>
              </li>
              <li>
                <a
                  href="#praktiskt"
                  className="hover:text-[var(--text-primary)]"
                >
                  Praktiskt
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>

      <SpeakerModal
        speaker={selectedSpeaker}
        onClose={() => setSelectedSpeaker(null)}
        onJumpToProgram={() => {
          if (selectedSpeaker) handleJumpToProgram(selectedSpeaker.id);
        }}
      />

      <TicketModal
        tier={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}
