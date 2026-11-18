import { useEffect } from 'react';
import { ArrowDownRight, Mail, X } from 'lucide-react';
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
        className="modal-dialog__panel relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl"
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

        <div className="grid grid-cols-1 sm:grid-cols-5">
          <figure className="sm:col-span-2 aspect-[3/4] sm:aspect-auto">
            <ResilientImage
              src={speaker.image}
              alt={t.speakerModal.portraitAlt(speaker.name)}
              width={speaker.width}
              height={speaker.height}
              className="h-full w-full object-cover"
              fallbackLabel={speaker.name}
            />
          </figure>

          <div className="sm:col-span-3 flex flex-col justify-between p-6 sm:p-8">
            <div>
              <p className="text-xs font-medium text-[var(--accent-brass)]">
                {speaker.role} · {speaker.city}
              </p>
              <h3
                id="speaker-modal-title"
                className="typo-display mt-2 text-2xl font-semibold tracking-tight"
              >
                {speaker.name}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                {speaker.bio}
              </p>

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
