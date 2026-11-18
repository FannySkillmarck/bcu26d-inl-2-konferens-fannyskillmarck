import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Mail, MapPin } from 'lucide-react';
import { FaqSection } from './components/FaqSection';
import { Header } from './components/Header';
import { HowToGetHere } from './components/HowToGetHere';
import { NewsletterSignup } from './components/NewsletterSignup';
import { ResilientImage } from './components/ResilientImage';
import { SpeakerModal } from './components/SpeakerModal';
import { TicketModal } from './components/TicketModal';
import { Web3PassCard } from './components/Web3PassCard';
import { getConferenceData, type TrackType } from './data/conference';
import { useLanguage } from './i18n/LanguageContext';

const TRACK_FILTERS: Array<'Alla' | TrackType> = [
  'Alla',
  'Huvudscen',
  'Workshop',
  'Samtal',
];

export default function App() {
  const { language, t } = useLanguage();
  const data = getConferenceData(language);

  const [activeTrack, setActiveTrack] = useState<'Alla' | TrackType>('Alla');
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string | null>(
    null
  );
  const [highlightedSpeakerId, setHighlightedSpeakerId] = useState<
    string | null
  >(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () =>
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const selectedSpeaker =
    data.speakers.find((s) => s.id === selectedSpeakerId) ?? null;
  const selectedTicket =
    data.ticketTiers.find((tier) => tier.id === selectedTicketId) ?? null;

  const visibleSchedule =
    activeTrack === 'Alla'
      ? data.scheduleItems
      : data.scheduleItems.filter((item) => item.track === activeTrack);

  const handleJumpToProgram = (speakerId: string) => {
    setSelectedSpeakerId(null);
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
                    {t.hero.dateLocation}{' '}
                    <time dateTime="2027-10-20">{t.hero.dateLabel}</time>{' '}
                    {t.hero.venueLabel}
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
                  {t.hero.heading}
                </h1>

                <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-[var(--text-muted)]">
                  {t.hero.description}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <a href="#biljetter" className="btn-primary px-6 py-3 text-sm">
                  {t.hero.primaryCta}
                </a>
                <a
                  href="#program"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-brass)] transition-colors whitespace-nowrap min-h-[44px]"
                >
                  <span>{t.hero.secondaryCta}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <figure className="lg:col-span-7 overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)]">
              <ResilientImage
                src={data.heroMedia.src}
                alt={data.heroMedia.alt}
                width={data.heroMedia.width}
                height={data.heroMedia.height}
                priority
                className="aspect-[16/10] w-full object-cover lg:aspect-auto lg:h-full"
                fallbackLabel={t.hero.imageFallback}
              />
            </figure>
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-6 border-y border-[var(--border-hairline)] py-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.keyFacts.map((fact) => (
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
              <p className="section-header__kicker">{t.schedule.kicker}</p>
              <h2
                id="heading-program"
                className="typo-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                {t.schedule.heading}
              </h2>
            </div>

            <div
              role="group"
              aria-label={t.schedule.filterGroupAria}
              className="inline-flex flex-wrap items-center gap-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-1 self-start md:self-auto"
            >
              {TRACK_FILTERS.map((track) => {
                const isActive = activeTrack === track;
                const trackLabel =
                  track === 'Alla'
                    ? t.schedule.filterAll
                    : t.schedule.tracks[track];
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
                    {trackLabel}
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
                        {t.schedule.tracks[item.track]} · {item.room}
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
                        onClick={() => setSelectedSpeakerId(item.speakerId)}
                        aria-label={t.schedule.speakerProfileAria(item.speaker)}
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
              <p className="section-header__kicker">{t.speakers.kicker}</p>
              <h2
                id="heading-talare"
                className="typo-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                {t.speakers.heading}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                {t.speakers.intro}
              </p>
            </header>

            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.speakers.map((speaker) => (
                <li key={speaker.id}>
                  <article className="speaker-card rounded-lg">
                    <figure className="speaker-card__media relative aspect-[3/4] overflow-hidden bg-[var(--bg-subtle)]">
                      <ResilientImage
                        src={speaker.image}
                        alt={t.speakers.portraitAlt(speaker.name, speaker.role)}
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
                          onClick={() => setSelectedSpeakerId(speaker.id)}
                          aria-label={t.speakers.cardAria(
                            speaker.name,
                            speaker.role,
                            speaker.city,
                            speaker.sessionTitle,
                            speaker.sessionTime,
                            speaker.email
                          )}
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
            <p className="section-header__kicker">{t.tickets.kicker}</p>
            <h2
              id="heading-biljetter"
              className="typo-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              {t.tickets.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              {t.tickets.intro}
            </p>
          </header>

          <ul className="ticket-grid mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data.ticketTiers.map((tier) => (
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
                          {t.tickets.recommended}
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
                      onClick={() => setSelectedTicketId(tier.id)}
                      aria-label={t.tickets.selectAria(
                        tier.name,
                        tier.priceFormatted
                      )}
                      className={
                        tier.featured
                          ? 'btn-primary w-full px-4 py-2.5 text-xs'
                          : 'w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors whitespace-nowrap min-h-[44px]'
                      }
                    >
                      {t.tickets.selectCta(tier.name)}
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <Web3PassCard
            tierName={
              data.ticketTiers.find((tier) => tier.featured)?.name ??
              data.ticketTiers[0].name
            }
          />
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
                <p className="section-header__kicker">{t.practical.kicker}</p>
                <h2
                  id="heading-praktiskt"
                  className="typo-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                  style={{ textWrap: 'balance' }}
                >
                  {t.practical.heading}
                </h2>

                <dl className="mt-8 divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
                  {data.practicalDetails.map((row) => (
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
                    src={data.venueMapMedia.src}
                    alt={data.venueMapMedia.alt}
                    width={data.venueMapMedia.width}
                    height={data.venueMapMedia.height}
                    className="aspect-[4/3] w-full object-cover"
                    fallbackLabel={t.practical.mapFallback}
                  />
                  <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-hairline)] px-4 py-3.5 text-xs text-[var(--text-muted)] sm:px-5">
                    <address className="inline-flex items-center gap-1.5 font-medium not-italic text-[var(--text-primary)]">
                      <MapPin
                        className="h-3.5 w-3.5 shrink-0 text-[var(--accent-brass)]"
                        aria-hidden="true"
                      />
                      {t.practical.addressCaption}
                    </address>
                    <span className="typo-mono">59.3204° N, 18.0558° Ö</span>
                  </figcaption>
                </figure>
              </div>
            </div>

            <HowToGetHere />
          </div>
        </section>

        {/* 6. FREQUENTLY ASKED QUESTIONS */}
        <FaqSection items={data.faqItems} />
      </main>

      <footer className="border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)] py-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 pb-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <p className="typo-display text-lg font-semibold text-[var(--text-primary)]">
                Stjärnfall 2027
              </p>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--text-muted)]">
                {t.footer.tagline}
              </p>
              <address className="mt-4 text-xs not-italic text-[var(--text-muted)]">
                <a
                  href="mailto:info@stjarnfall.se"
                  className="hover:text-[var(--text-primary)]"
                >
                  info@stjarnfall.se
                </a>
              </address>
            </div>

            <section
              aria-labelledby="heading-footer-connect"
              className="lg:col-span-3"
            >
              <h2
                id="heading-footer-connect"
                className="typo-display text-lg font-semibold tracking-tight text-[var(--text-primary)]"
              >
                {t.footer.connectHeading}
              </h2>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-[var(--text-muted)]">
                {t.footer.connectDescription}
              </p>
              <nav aria-label={t.footer.connectNavAria} className="mt-4">
                <ul className="flex flex-wrap items-center gap-3">
                  <li>
                    <a
                      href="https://twitter.com/stjarnfall2027"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t.footer.twitterAria}
                      title="Twitter"
                      className="footer-connect__link"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.75}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-[18px] w-[18px]"
                        aria-hidden="true"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/stjarnfall-symposium"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t.footer.linkedinAria}
                      title="LinkedIn"
                      className="footer-connect__link"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.75}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-[18px] w-[18px]"
                        aria-hidden="true"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/stjarnfall2027"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t.footer.instagramAria}
                      title="Instagram"
                      className="footer-connect__link"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.75}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-[18px] w-[18px]"
                        aria-hidden="true"
                      >
                        <rect
                          width="20"
                          height="20"
                          x="2"
                          y="2"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </nav>
            </section>

            <div className="lg:col-span-5">
              <NewsletterSignup />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 border-t border-[var(--border-hairline)] pt-6 sm:flex-row sm:items-center">
            <p className="text-xs text-[var(--text-muted)]">
              {t.footer.copyright}
            </p>

            <nav aria-label={t.footer.navAria}>
              <ul className="flex flex-wrap items-center gap-6 text-xs font-medium text-[var(--text-muted)]">
                <li>
                  <a
                    href="#program"
                    className="hover:text-[var(--text-primary)]"
                  >
                    {t.header.navProgram}
                  </a>
                </li>
                <li>
                  <a
                    href="#talare"
                    className="hover:text-[var(--text-primary)]"
                  >
                    {t.header.navSpeakers}
                  </a>
                </li>
                <li>
                  <a
                    href="#biljetter"
                    className="hover:text-[var(--text-primary)]"
                  >
                    {t.header.navTickets}
                  </a>
                </li>
                <li>
                  <a
                    href="#praktiskt"
                    className="hover:text-[var(--text-primary)]"
                  >
                    {t.header.navPractical}
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[var(--text-primary)]">
                    {t.faq.navLabel}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>

      <SpeakerModal
        speaker={selectedSpeaker}
        onClose={() => setSelectedSpeakerId(null)}
        onJumpToProgram={() => {
          if (selectedSpeaker) handleJumpToProgram(selectedSpeaker.id);
        }}
      />

      <TicketModal
        tier={selectedTicket}
        onClose={() => setSelectedTicketId(null)}
      />
    </div>
  );
}
