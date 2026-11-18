import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export function NewsletterSignup() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(t.newsletter.invalidEmailError);
      return;
    }
    setError('');
    setSubscribedEmail(trimmed);
    setEmail('');
  };

  return (
    <section
      aria-labelledby="heading-newsletter"
      className="w-full max-w-md lg:ml-auto"
    >
      <h2
        id="heading-newsletter"
        className="typo-display text-lg font-semibold tracking-tight text-[var(--text-primary)]"
      >
        {t.newsletter.heading}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
        {t.newsletter.description}
      </p>

      {subscribedEmail ? (
        <div
          aria-live="polite"
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-3 text-xs"
        >
          <p className="inline-flex items-center gap-2 text-[var(--text-primary)]">
            <CheckCircle2
              className="h-4 w-4 shrink-0 text-[var(--accent-brass)]"
              aria-hidden="true"
            />
            <span>
              {t.newsletter.subscribedPrefix}{' '}
              <strong className="font-semibold">{subscribedEmail}</strong>.
            </span>
          </p>
          <button
            type="button"
            onClick={() => setSubscribedEmail(null)}
            aria-label={t.newsletter.changeEmailAria}
            className="text-xs font-medium text-[var(--accent-brass)] hover:underline min-h-[36px]"
          >
            {t.newsletter.changeEmailBtn}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="footer-newsletter-email" className="sr-only">
              {t.newsletter.inputLabel}
            </label>
            <input
              id="footer-newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder={t.newsletter.inputPlaceholder}
              aria-label={t.newsletter.inputAria}
              aria-invalid={Boolean(error)}
              className="min-w-0 flex-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px]"
            />
            <button
              type="submit"
              aria-label={t.newsletter.submitAria}
              className="btn-primary px-5 py-2.5 text-xs"
            >
              {t.newsletter.submitBtn}
            </button>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-2 text-xs font-medium text-[var(--error-ink)]"
            >
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
