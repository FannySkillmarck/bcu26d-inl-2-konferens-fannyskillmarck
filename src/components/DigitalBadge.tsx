import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode, ShieldCheck, Ticket } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { shortenHex, type SignedPassReceipt } from '../lib/web3';

interface DigitalBadgeProps {
  tierName: string;
  quantity?: number;
  attendeeName?: string;
  attendeeEmail?: string;
  receipt?: SignedPassReceipt | null;
  compact?: boolean;
}

function derivePassId(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `SF27-${hash.toString(16).toUpperCase().padStart(6, '0').slice(0, 6)}`;
}

export function DigitalBadge({
  tierName,
  quantity = 1,
  attendeeName,
  attendeeEmail,
  receipt = null,
  compact = false,
}: DigitalBadgeProps) {
  const { t } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const passId = useMemo(() => {
    const seed =
      receipt?.signature ||
      `${attendeeEmail || ''}|${attendeeName || ''}|${tierName}|${quantity}`;
    return derivePassId(seed);
  }, [receipt?.signature, attendeeEmail, attendeeName, tierName, quantity]);

  const qrPayload = useMemo(() => {
    return JSON.stringify({
      event: 'STJARNFALL-2027',
      date: '2027-10-20',
      venue: 'Münchenbryggeriet, Stockholm',
      passId,
      tier: tierName,
      qty: quantity,
      holder:
        attendeeName ||
        (receipt ? shortenHex(receipt.address, 6, 4) : 'Symposium Guest'),
      web3Verified: Boolean(receipt),
      ...(receipt
        ? {
            wallet: receipt.address,
            chainId: receipt.chainId,
            sig: receipt.signature.slice(0, 26),
          }
        : {}),
    });
  }, [passId, tierName, quantity, attendeeName, receipt]);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(qrPayload, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#141619',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });

    return () => {
      cancelled = true;
    };
  }, [qrPayload]);

  const holderDisplay =
    attendeeName ||
    (receipt ? shortenHex(receipt.address, 6, 4) : t.digitalBadge.holderLabel);

  return (
    <section
      aria-label={t.digitalBadge.title}
      className={`rounded-lg border border-[var(--accent-brass)]/50 bg-[var(--bg-surface)] ${
        compact ? 'mt-5 p-4' : 'mt-5 p-5 sm:p-6'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-hairline)] pb-3">
        <div className="flex items-center gap-2">
          <QrCode
            className="h-4 w-4 shrink-0 text-[var(--accent-brass)]"
            aria-hidden="true"
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--accent-brass)]">
              {t.digitalBadge.eyebrow}
            </p>
            <h4 className="typo-display text-base font-semibold text-[var(--text-primary)]">
              {t.digitalBadge.title}
            </h4>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-[11px] font-semibold ${
            receipt
              ? 'border-[var(--accent-brass)] bg-[var(--bg-subtle)] text-[var(--accent-brass)]'
              : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)]'
          }`}
        >
          {receipt ? (
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <Ticket className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
          <span>
            {receipt
              ? t.digitalBadge.verifiedStatus
              : t.digitalBadge.standardStatus}
          </span>
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs leading-relaxed text-[var(--text-muted)]">
            {t.digitalBadge.subtitle}
          </p>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
            <div className="min-w-0">
              <dt className="text-[var(--text-muted)]">
                {t.digitalBadge.holderLabel}
              </dt>
              <dd className="mt-0.5 truncate font-semibold text-[var(--text-primary)]">
                {holderDisplay}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">
                {t.digitalBadge.passIdLabel}
              </dt>
              <dd className="typo-mono mt-0.5 font-semibold text-[var(--accent-brass)]">
                {passId}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">
                {t.digitalBadge.tierLabel}
              </dt>
              <dd className="mt-0.5 font-medium text-[var(--text-primary)]">
                {quantity} × {tierName}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">
                {t.digitalBadge.entranceLabel}
              </dt>
              <dd className="mt-0.5 font-medium text-[var(--text-primary)]">
                {t.digitalBadge.entranceValue}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {qrDataUrl && (
              <a
                href={qrDataUrl}
                download={`stjarnfall-2027-${passId}.png`}
                aria-label={t.digitalBadge.downloadQrAria}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors"
              >
                <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{t.digitalBadge.downloadQrBtn}</span>
              </a>
            )}
            <p className="text-[11px] text-[var(--text-muted)]">
              {t.digitalBadge.scanNote}
            </p>
          </div>
        </div>

        <figure className="shrink-0 self-center rounded-md border border-[var(--border-hairline)] bg-white p-2.5 shadow-xs">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={t.digitalBadge.qrAlt(passId)}
              width={136}
              height={136}
              className="h-[136px] w-[136px] block"
            />
          ) : (
            <div className="flex h-[136px] w-[136px] items-center justify-center text-xs text-neutral-500">
              QR
            </div>
          )}
        </figure>
      </div>
    </section>
  );
}
