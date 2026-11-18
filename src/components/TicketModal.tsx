import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import type { TicketTier } from '../data/conference';
import { useLanguage } from '../i18n/LanguageContext';

interface TicketModalProps {
  tier: TicketTier | null;
  onClose: () => void;
}

export function TicketModal({ tier, onClose }: TicketModalProps) {
  const { language, t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [dietary, setDietary] = useState('');
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const tierId = tier?.id ?? null;

  useEffect(() => {
    setFullName('');
    setEmail('');
    setQuantity(1);
    setDietary('');
    setError('');
    setConfirmed(false);
  }, [tierId]);

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
  const formattedTotal = `${totalSek.toLocaleString(
    language === 'sv' ? 'sv-SE' : language === 'zh' ? 'zh-CN' : 'en-US'
  )} ${t.ticketModal.currencySuffix}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      setError(t.ticketModal.nameError);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t.ticketModal.emailError);
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
          aria-label={t.ticketModal.closeAria}
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {confirmed ? (
          <div className="py-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-brass)]">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <span>{t.ticketModal.reservedLabel}</span>
            </p>
            <h3
              id="ticket-modal-title"
              className="typo-display mt-3 text-2xl font-semibold"
            >
              {t.ticketModal.thankYou(fullName.trim())}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              {t.ticketModal.confirmationPrefix}{' '}
              <strong className="text-[var(--text-primary)]">
                {quantity} × {tier.name}
              </strong>{' '}
              (<span className="typo-mono">{formattedTotal}</span>){' '}
              {t.ticketModal.confirmationMiddle}{' '}
              <strong className="font-medium text-[var(--text-primary)]">
                {email.trim()}
              </strong>
              {t.ticketModal.confirmationSuffix}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="btn-primary px-5 py-2.5 text-sm"
              >
                {t.ticketModal.closeBtn}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p className="text-xs font-medium text-[var(--accent-brass)]">
              {t.ticketModal.bookingEyebrow}
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
                  {t.ticketModal.nameLabel}
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.ticketModal.namePlaceholder}
                  className="mt-1.5 w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px]"
                />
              </div>

              <div>
                <label
                  htmlFor="booking-email"
                  className="block text-xs font-semibold text-[var(--text-primary)]"
                >
                  {t.ticketModal.emailLabel}
                </label>
                <input
                  id="booking-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.ticketModal.emailPlaceholder}
                  className="mt-1.5 w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="booking-qty"
                    className="block text-xs font-semibold text-[var(--text-primary)]"
                  >
                    {t.ticketModal.quantityLabel}
                  </label>
                  <select
                    id="booking-qty"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="typo-mono mt-1.5 w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px]"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {t.ticketModal.quantityOption(n)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="booking-diet"
                    className="block text-xs font-semibold text-[var(--text-primary)]"
                  >
                    {t.ticketModal.dietaryLabel}
                  </label>
                  <input
                    id="booking-diet"
                    type="text"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder={t.ticketModal.dietaryPlaceholder}
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
                  {t.ticketModal.totalLabel}
                </span>
                <strong className="typo-mono text-lg font-semibold text-[var(--text-primary)]">
                  {formattedTotal}
                </strong>
              </p>

              <button type="submit" className="btn-primary px-5 py-2.5 text-sm">
                {t.ticketModal.submitBtn}
              </button>
            </footer>
          </form>
        )}
      </article>
    </div>
  );
}
