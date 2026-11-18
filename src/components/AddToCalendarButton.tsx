import { useEffect, useRef, useState } from 'react';
import {
  CalendarPlus,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
} from 'lucide-react';
import type { ScheduleItem } from '../data/conference';
import { useLanguage } from '../i18n/LanguageContext';
import {
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  downloadIcsEvent,
} from '../lib/calendar';

interface AddToCalendarButtonProps {
  item: ScheduleItem;
}

export function AddToCalendarButton({ item }: AddToCalendarButtonProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const googleUrl = buildGoogleCalendarUrl(item);
  const outlookUrl = buildOutlookCalendarUrl(item);

  const handleDownloadIcs = () => {
    downloadIcsEvent(item);
    setDownloaded(true);
    setIsOpen(false);
    window.setTimeout(() => setDownloaded(false), 2400);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t.schedule.addToCalendarAria(item.title)}
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors whitespace-nowrap"
      >
        {downloaded ? (
          <Check
            className="h-3.5 w-3.5 shrink-0 text-[var(--accent-brass)]"
            aria-hidden="true"
          />
        ) : (
          <CalendarPlus
            className="h-3.5 w-3.5 shrink-0 text-[var(--accent-brass)]"
            aria-hidden="true"
          />
        )}
        <span>
          {downloaded
            ? t.schedule.savedConfirmation
            : t.schedule.addToCalendarBtn}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={t.schedule.calendarMenuAria(item.title)}
          className="absolute left-0 z-20 mt-2 w-56 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-1.5 shadow-xl md:left-auto md:right-0"
        >
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="flex min-h-[40px] items-center justify-between gap-2 rounded px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <span>{t.schedule.googleCalendar}</span>
            <ExternalLink
              className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]"
              aria-hidden="true"
            />
          </a>

          <a
            href={outlookUrl}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="flex min-h-[40px] items-center justify-between gap-2 rounded px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <span>{t.schedule.outlookWeb}</span>
            <ExternalLink
              className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]"
              aria-hidden="true"
            />
          </a>

          <button
            type="button"
            role="menuitem"
            onClick={handleDownloadIcs}
            className="flex min-h-[40px] w-full items-center justify-between gap-2 rounded px-3 py-2 text-left text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <span>{t.schedule.outlookIcs}</span>
            <Download
              className="h-3.5 w-3.5 shrink-0 text-[var(--accent-brass)]"
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </div>
  );
}
