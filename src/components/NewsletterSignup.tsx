import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Ange en giltig e-postadress.');
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
        Nyhetsbrev inför 2027
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
        Få utskick om programsläpp, talare och eventuella extraplatser till
        symposiet.
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
              Anmäld! Utskicken skickas till{' '}
              <strong className="font-semibold">{subscribedEmail}</strong>.
            </span>
          </p>
          <button
            type="button"
            onClick={() => setSubscribedEmail(null)}
            aria-label="Anmäl ytterligare en e-postadress till nyhetsbrevet"
            className="text-xs font-medium text-[var(--accent-brass)] hover:underline min-h-[36px]"
          >
            Ändra adress
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="footer-newsletter-email" className="sr-only">
              E-postadress för nyhetsbrev
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
              placeholder="namn@exempel.se"
              aria-label="E-postadress för uppdateringar om Stjärnfall 2027"
              aria-invalid={Boolean(error)}
              className="min-w-0 flex-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px]"
            />
            <button
              type="submit"
              aria-label="Prenumerera på uppdateringar om Stjärnfall 2027"
              className="btn-primary px-5 py-2.5 text-xs"
            >
              Prenumerera
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
