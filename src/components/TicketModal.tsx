import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, LogIn, X } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import type { TicketTier } from '../data/conference';
import { useLanguage } from '../i18n/LanguageContext';
import type { SignedPassReceipt } from '../lib/web3';
import { DigitalBadge } from './DigitalBadge';
import type { AttendeeStats } from './LiveAttendeeCounter';
import { Web3PassCard } from './Web3PassCard';

interface TicketModalProps {
  tier: TicketTier | null;
  onClose: () => void;
  onRegistrationComplete?: (stats: AttendeeStats) => void;
}

export function TicketModal({
  tier,
  onClose,
  onRegistrationComplete,
}: TicketModalProps) {
  const { language, t } = useLanguage();
  const {
    user,
    isSigningIn,
    signIn,
    saveTicketRegistration,
    attachWeb3ToRegistration,
  } = useFirebase();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [dietary, setDietary] = useState('');
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [signedReceipt, setSignedReceipt] = useState<SignedPassReceipt | null>(
    null
  );
  const [savedRegId, setSavedRegId] = useState<string | null>(null);
  const [savedPassId, setSavedPassId] = useState<string | null>(null);
  const savingCloudRef = useRef(false);

  const tierId = tier?.id ?? null;

  useEffect(() => {
    setFullName(user?.displayName ?? '');
    setEmail(user?.email ?? '');
    setQuantity(1);
    setDietary('');
    setError('');
    setConfirmed(false);
    setSignedReceipt(null);
    setSavedRegId(null);
    setSavedPassId(null);
    savingCloudRef.current = false;
  }, [tierId]);

  useEffect(() => {
    if (!tier || !user || confirmed) return;
    setFullName((prev) => (prev.trim() ? prev : (user.displayName ?? '')));
    setEmail((prev) => (prev.trim() ? prev : (user.email ?? '')));
  }, [tier, user, confirmed]);

  useEffect(() => {
    if (!tier || !confirmed || !user || savedRegId || savingCloudRef.current) {
      return;
    }
    savingCloudRef.current = true;
    void saveTicketRegistration({
      tierId: tier.id,
      tierName: tier.name,
      quantity,
      fullName: fullName.trim(),
      email: email.trim(),
      dietary: dietary.trim(),
      web3Wallet: signedReceipt?.address,
      web3ChainId: signedReceipt?.chainId,
      web3Signature: signedReceipt?.signature,
    })
      .then((saved) => {
        if (saved) {
          setSavedRegId(saved.registrationId);
          setSavedPassId(saved.passId);
        }
      })
      .finally(() => {
        savingCloudRef.current = false;
      });
  }, [
    tier,
    confirmed,
    user,
    savedRegId,
    quantity,
    fullName,
    email,
    dietary,
    signedReceipt,
    saveTicketRegistration,
  ]);

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

    void fetch('/api/attendees/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tierId: tier.id, quantity }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Partial<AttendeeStats> | null) => {
        if (
          data &&
          typeof data.count === 'number' &&
          typeof data.capacity === 'number' &&
          typeof data.updatedAt === 'string'
        ) {
          onRegistrationComplete?.({
            count: data.count,
            capacity: data.capacity,
            updatedAt: data.updatedAt,
          });
        }
      })
      .catch(() => {
        // Confirmation still completes locally if offline
      });
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
        className={`modal-dialog__panel relative max-h-[90dvh] w-full overflow-y-auto rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 text-[var(--text-primary)] shadow-2xl sm:p-8 ${
          confirmed ? 'max-w-2xl' : 'max-w-lg'
        }`}
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
          <div className="py-2">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-brass)]">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <span>{t.ticketModal.reservedLabel}</span>
            </p>
            <h3
              id="ticket-modal-title"
              className="typo-display mt-3 pr-10 text-2xl font-semibold"
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

            <DigitalBadge
              tierName={tier.name}
              quantity={quantity}
              attendeeName={fullName.trim()}
              attendeeEmail={email.trim()}
              receipt={signedReceipt}
              passIdOverride={savedPassId ?? undefined}
              compact
            />

            <Web3PassCard
              tierName={tier.name}
              quantity={quantity}
              attendeeName={fullName.trim()}
              attendeeEmail={email.trim()}
              showInlineBadge={false}
              onReceiptChange={(receipt) => {
                setSignedReceipt(receipt);
                if (receipt && savedRegId) {
                  void attachWeb3ToRegistration(savedRegId, {
                    wallet: receipt.address,
                    chainId: receipt.chainId,
                    signature: receipt.signature,
                  });
                }
              }}
              compact
            />

            {!user ? (
              <div className="mt-4 flex flex-col gap-3 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-subtle)]/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                  {t.auth.modalSignInPrompt}
                </p>
                <button
                  type="button"
                  onClick={() => void signIn()}
                  disabled={isSigningIn}
                  className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-1.5 rounded-md border border-[var(--accent-brass)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  <LogIn
                    className="h-3.5 w-3.5 shrink-0 text-[var(--accent-brass)]"
                    aria-hidden="true"
                  />
                  <span>
                    {isSigningIn ? t.auth.signingInBtn : t.auth.modalSignInBtn}
                  </span>
                </button>
              </div>
            ) : (
              savedRegId && (
                <p className="mt-3 text-xs font-medium text-[var(--accent-brass)]">
                  ✓ {t.auth.syncedWithGoogleBadge}
                </p>
              )
            )}

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
              className="typo-display mt-1.5 pr-10 text-2xl font-semibold"
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
