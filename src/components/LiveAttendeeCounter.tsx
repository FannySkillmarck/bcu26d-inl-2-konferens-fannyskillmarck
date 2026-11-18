import { useEffect } from 'react';
import { Users } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export interface AttendeeStats {
  count: number;
  capacity: number;
  updatedAt: string;
}

interface LiveAttendeeCounterProps {
  stats: AttendeeStats | null;
  onStatsUpdate: (next: AttendeeStats) => void;
}

export function LiveAttendeeCounter({
  stats,
  onStatsUpdate,
}: LiveAttendeeCounterProps) {
  const { language, t } = useLanguage();

  useEffect(() => {
    let active = true;
    let eventSource: EventSource | null = null;

    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/attendees', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Partial<AttendeeStats>;
        if (
          active &&
          typeof data.count === 'number' &&
          typeof data.capacity === 'number' &&
          typeof data.updatedAt === 'string'
        ) {
          onStatsUpdate({
            count: data.count,
            capacity: data.capacity,
            updatedAt: data.updatedAt,
          });
        }
      } catch {
        // Keep previously loaded value if transient network error occurs
      }
    };

    void fetchLatest();

    if (typeof EventSource !== 'undefined') {
      eventSource = new EventSource('/api/attendees/stream');
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as Partial<AttendeeStats>;
          if (
            active &&
            typeof data.count === 'number' &&
            typeof data.capacity === 'number' &&
            typeof data.updatedAt === 'string'
          ) {
            onStatsUpdate({
              count: data.count,
              capacity: data.capacity,
              updatedAt: data.updatedAt,
            });
          }
        } catch {
          // Ignore malformed SSE frames
        }
      };
    }

    const pollTimer = window.setInterval(() => {
      void fetchLatest();
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(pollTimer);
      eventSource?.close();
    };
  }, [onStatsUpdate]);

  const locale =
    language === 'sv' ? 'sv-SE' : language === 'zh' ? 'zh-CN' : 'en-US';
  const count = stats?.count ?? null;
  const capacity = stats?.capacity ?? 320;
  const remaining = count !== null ? Math.max(0, capacity - count) : null;
  const fillPercent =
    count !== null && capacity > 0
      ? Math.min(100, Math.max(0, Math.round((count / capacity) * 100)))
      : 0;

  return (
    <aside
      aria-label={t.attendeeCounter.regionAria}
      className="mt-7 border-t border-[var(--border-hairline)] pt-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent-brass)]">
          <span
            className="live-counter__dot inline-block h-2 w-2 rounded-full bg-[var(--accent-brass)]"
            aria-hidden="true"
          />
          <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{t.attendeeCounter.label}</span>
        </p>

        {remaining !== null && (
          <span className="typo-mono text-xs font-medium text-[var(--text-muted)]">
            {remaining === 0
              ? t.attendeeCounter.soldOut
              : t.attendeeCounter.seatsRemaining(remaining)}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2" aria-live="polite">
        {count !== null ? (
          <>
            <span className="typo-display typo-mono text-2xl font-semibold text-[var(--text-primary)]">
              {count.toLocaleString(locale)}
            </span>
            <span className="text-xs font-medium text-[var(--text-muted)]">
              {t.attendeeCounter.ofCapacity(capacity)}
            </span>
          </>
        ) : (
          <span className="text-xs text-[var(--text-muted)]">
            {t.attendeeCounter.loading}
          </span>
        )}
      </div>

      <div
        role="progressbar"
        aria-label={t.attendeeCounter.label}
        aria-valuenow={count ?? 0}
        aria-valuemin={0}
        aria-valuemax={capacity}
        className="mt-2.5 h-1.5 w-full overflow-hidden rounded-xs bg-[var(--border-hairline)]"
      >
        <div
          className="live-counter__bar h-full bg-[var(--accent-brass)]"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
    </aside>
  );
}
