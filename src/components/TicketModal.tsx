import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import type { TicketTier } from '../data/conference';

interface TicketModalProps {
  tier: TicketTier | null;
  onClose: () => void;
}

export function TicketModal({ tier, onClose }: TicketModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [dietary, setDietary] = useState('');
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setFullName('');
    setEmail('');
    setQuantity(1);
    setDietary('');
    setError('');
    setConfirmed(false);
  }, [tier]);

  useEffect(() => {
    if (!tier) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [tier, onClose]);

  if (!tier) return null;

  const totalSek = tier.priceSek * quantity;
  const formattedTotal = `${totalSek.toLocaleString('sv-SE')} kr`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      setError('Ange ditt för- och efternamn.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Ange en giltig e-postadress för biljettbekräftelsen.');
      return;
    }
    setError('');
    setConfirmed(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <article
        className="modal-dialog__panel relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 text-[var(--text-primary)] shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Stäng bokningsformulär"
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {confirmed ? (
          <div className="py-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-brass)]">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <span>Plats reserverad</span>
            </p>
            <h3
              id="ticket-modal-title"
              className="typo-display mt-3 text-2xl font-semibold"
            >
              Tack, {fullName.trim()}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              Din reservation för{' '}
              <strong className="text-[var(--text-primary)]">
                {quantity} × {tier.name}
              </strong>{' '}
              (<span className="typo-mono">{formattedTotal}</span>) har
              registrerats. En bekräftelse skickas till{' '}
              <strong className="font-medium text-[var(--text-primary)]">
                {email.trim()}
              </strong>
              .
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="btn-primary px-5 py-2.5 text-sm"
              >
                Stäng
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p className="text-xs font-medium text-[var(--accent-brass)]">
              Biljettbokning · Stjärnfall 2027
            </p>
            <h3
              id="ticket-modal-title"
              className="typo-display mt-1.5 text-2xl font-semibold"
            >
              {tier.name} —{' '}
              <span className="typo-mono">{tier.priceFormatted}</span>
            </h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {tier.subtitle}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="booking-name"
                  className="block text-xs font-semibold text-[var(--text-primary)]"
                >
                  Namn
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="För- och efternamn"
                  className="mt-1.5 w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px]"
                />
              </div>

              <div>
                <label
                  htmlFor="booking-email"
                  className="block text-xs font-semibold text-[var(--text-primary)]"
                >
                  E-postadress
                </label>
                <input
                  id="booking-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="namn@exempel.se"
                  className="mt-1.5 w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="booking-qty"
                    className="block text-xs font-semibold text-[var(--text-primary)]"
                  >
                    Antal biljetter
                  </label>
                  <select
                    id="booking-qty"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="typo-mono mt-1.5 w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px]"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} st
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="booking-diet"
                    className="block text-xs font-semibold text-[var(--text-primary)]"
                  >
                    Specialkost (valfritt)
                  </label>
                  <input
                    id="booking-diet"
                    type="text"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder="T.ex. vegetarisk"
                    className="mt-1.5 w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 text-xs font-medium text-[var(--error-ink)]"
              >
                {error}
              </p>
            )}

            <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-hairline)] pt-5">
              <p>
                <span className="block text-xs text-[var(--text-muted)]">
                  Totalt att betala
                </span>
                <strong className="typo-mono text-lg font-semibold text-[var(--text-primary)]">
                  {formattedTotal}
                </strong>
              </p>

              <button type="submit" className="btn-primary px-5 py-2.5 text-sm">
                Slutför bokning
              </button>
            </footer>
          </form>
        )}
      </article>
    </div>
  );
}
