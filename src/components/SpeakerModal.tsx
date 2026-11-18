import { useEffect } from 'react';
import { ArrowDownRight, BookOpen, Mail, X } from 'lucide-react';
import type { Speaker } from '../data/conference';
import { useLanguage } from '../i18n/LanguageContext';
import { ResilientImage } from './ResilientImage';

interface SpeakerModalProps {
  speaker: Speaker | null;
  onClose: () => void;
  onJumpToProgram: () => void;
}

export function SpeakerModal({
  speaker,
  onClose,
  onJumpToProgram,
}: SpeakerModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!speaker) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [speaker, onClose]);

  if (!speaker) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="speaker-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <article
        className="modal-dialog__panel relative max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.speakerModal.closeAria}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          <figure className="md:col-span-5 aspect-[3/4] md:aspect-auto">
            <ResilientImage
              src={speaker.image}
              alt={t.speakerModal.portraitAlt(speaker.name)}
              width={speaker.width}
              height={speaker.height}
              className="h-full w-full object-cover"
              fallbackLabel={speaker.name}
            />
          </figure>

          <div className="md:col-span-7 flex flex-col justify-between p-6 sm:p-8">
            <div>
              <p className="pr-12 text-xs font-semibold text-[var(--accent-brass)]">
                {speaker.role} · {speaker.city}
              </p>
              <p className="mt-1 pr-12 text-xs text-[var(--text-muted)]">
                {speaker.affiliation}
              </p>
              <h3
                id="speaker-modal-title"
                className="typo-display mt-2.5 text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                {speaker.name}
              </h3>

              <section className="mt-5">
                <h4 className="text-xs font-semibold tracking-wide uppercase text-[var(--text-primary)]">
                  {t.speakerModal.bioHeading}
                </h4>
                <div className="mt-2 space-y-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  <p>{speaker.bio}</p>
                  <p>{speaker.extendedBio}</p>
                </div>
              </section>

              <section className="mt-6 border-t border-[var(--border-hairline)] pt-5">
                <h4 className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-[var(--text-primary)]">
                  <BookOpen
                    className="h-3.5 w-3.5 text-[var(--accent-brass)]"
                    aria-hidden="true"
                  />
                  <span>{t.speakerModal.publicationsHeading}</span>
                </h4>
                <ul className="mt-3 space-y-3">
                  {speaker.publications.map((pub) => (
                    <li
                      key={`${pub.title}-${pub.year}`}
                      className="border-l-2 border-[var(--accent-brass)]/50 pl-3"
                    >
                      <p className="text-xs font-medium leading-snug text-[var(--text-primary)]">
                        {pub.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        {pub.venue} ·{' '}
                        <span className="typo-mono">{pub.year}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-6 border-t border-[var(--border-hairline)] pt-4">
                <p className="text-xs font-medium text-[var(--text-muted)]">
                  {t.speakerModal.sessionLabel} ·{' '}
                  <time className="typo-mono">{speaker.sessionTime}</time>
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                  {speaker.sessionTitle}
                </p>
              </section>
            </div>

            <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-hairline)] pt-4">
              <a
                href={`mailto:${speaker.email}`}
                className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{speaker.email}</span>
              </a>

              <button
                type="button"
                onClick={onJumpToProgram}
                className="btn-primary px-4 py-2 text-xs"
              >
                <span>{t.speakerModal.viewInSchedule}</span>
                <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}
