import { Bell, BellRing, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type {
  ActiveReminderNotice,
  BrowserNotificationPermission,
} from '../lib/talkReminders';

interface TalkRemindersBarProps {
  savedCount: number;
  permission: BrowserNotificationPermission;
  activeNotice: ActiveReminderNotice | null;
  onRequestPermission: () => void;
  onSendTest: () => void;
  onClearAll: () => void;
  onDismissNotice: () => void;
}

export function TalkRemindersBar({
  savedCount,
  permission,
  activeNotice,
  onRequestPermission,
  onSendTest,
  onClearAll,
  onDismissNotice,
}: TalkRemindersBarProps) {
  const { t } = useLanguage();

  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-col gap-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)]/75 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5 sm:items-center">
          {savedCount > 0 ? (
            <BellRing
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-brass)] sm:mt-0"
              aria-hidden="true"
            />
          ) : (
            <Bell
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-brass)] sm:mt-0"
              aria-hidden="true"
            />
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--text-primary)]">
              {savedCount > 0
                ? t.schedule.remindersBarLabel(savedCount)
                : t.schedule.remindersBarEmpty}
            </p>
            {permission === 'denied' && (
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {t.schedule.remindersBlockedNotice}
              </p>
            )}
            {permission === 'unsupported' && (
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {t.schedule.remindersUnsupportedNotice}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {permission === 'default' && (
            <button
              type="button"
              onClick={onRequestPermission}
              className="inline-flex min-h-[40px] items-center rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors whitespace-nowrap"
            >
              {t.schedule.remindersEnableBtn}
            </button>
          )}

          <button
            type="button"
            onClick={onSendTest}
            aria-label={t.schedule.remindersTestAria}
            className="inline-flex min-h-[40px] items-center rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors whitespace-nowrap"
          >
            {t.schedule.remindersTestBtn}
          </button>

          {savedCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex min-h-[40px] items-center rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
            >
              {t.schedule.remindersClearBtn}
            </button>
          )}
        </div>
      </div>

      {activeNotice && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start justify-between gap-3 rounded-lg border border-[var(--accent-brass)] bg-[var(--bg-surface)] px-4 py-3 shadow-sm"
        >
          <div className="flex items-start gap-2.5 min-w-0">
            <BellRing
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-brass)]"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {activeNotice.title}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {activeNotice.body}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismissNotice}
            aria-label={t.schedule.remindersDismissAria}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
