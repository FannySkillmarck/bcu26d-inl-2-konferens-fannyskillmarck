import { useEffect, useState } from 'react';
import { Check, Copy, ScanLine, ShieldCheck, Wallet } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  connectEvmWallet,
  getChainName,
  getEthereumProvider,
  isUserRejectedError,
  shortenHex,
  signSymposiumPass,
  type SignedPassReceipt,
  type WalletConnection,
} from '../lib/web3';
import { CheckInScanner } from './CheckInScanner';
import { DigitalBadge } from './DigitalBadge';

interface Web3PassCardProps {
  tierName: string;
  quantity?: number;
  attendeeName?: string;
  attendeeEmail?: string;
  showInlineBadge?: boolean;
  onReceiptChange?: (receipt: SignedPassReceipt | null) => void;
  compact?: boolean;
}

export function Web3PassCard({
  tierName,
  quantity = 1,
  attendeeName,
  attendeeEmail,
  showInlineBadge = true,
  onReceiptChange,
  compact = false,
}: Web3PassCardProps) {
  const { t } = useLanguage();
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [receipt, setReceipt] = useState<SignedPassReceipt | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const updateReceipt = (next: SignedPassReceipt | null) => {
    setReceipt(next);
    onReceiptChange?.(next);
  };

  useEffect(() => {
    const provider = getEthereumProvider();
    if (!provider?.on || !wallet) return;

    const handleAccountsChanged = (accountsArg: unknown) => {
      const accounts = Array.isArray(accountsArg)
        ? (accountsArg as string[])
        : [];
      const nextAddress = accounts[0];
      if (!nextAddress) {
        setWallet(null);
        updateReceipt(null);
        return;
      }
      setWallet((prev) => (prev ? { ...prev, address: nextAddress } : null));
      updateReceipt(null);
    };

    const handleChainChanged = (chainIdArg: unknown) => {
      const nextChainId = String(chainIdArg ?? '');
      if (!nextChainId) return;
      setWallet((prev) =>
        prev
          ? {
              ...prev,
              chainId: nextChainId,
              chainName: getChainName(nextChainId),
            }
          : null
      );
      updateReceipt(null);
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
      provider.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [wallet]);

  const handleConnect = async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const connection = await connectEvmWallet();
      setWallet(connection);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'NO_WALLET') {
        setError(t.web3.noWalletError);
      } else if (isUserRejectedError(err)) {
        setError(t.web3.rejectedError);
      } else {
        setError(t.web3.genericError);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignPass = async () => {
    if (!wallet) return;
    setError(null);
    setIsSigning(true);
    try {
      const signed = await signSymposiumPass({
        address: wallet.address,
        chainId: wallet.chainId,
        tierName,
        quantity,
      });
      updateReceipt(signed);
    } catch (err: unknown) {
      if (isUserRejectedError(err)) {
        setError(t.web3.rejectedError);
      } else {
        setError(t.web3.genericError);
      }
    } finally {
      setIsSigning(false);
    }
  };

  const handleDisconnect = () => {
    setWallet(null);
    updateReceipt(null);
    setError(null);
    setCopied(false);
  };

  const handleCopySignature = async () => {
    if (!receipt || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(receipt.signature);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write unavailable in restricted iframe
    }
  };

  return (
    <aside
      aria-label={t.web3.title}
      className={`rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)]/70 ${
        compact ? 'mt-5 p-4' : 'mt-10 p-6 sm:p-7'
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-[var(--accent-brass)]">
            {t.web3.badgeLabel}
          </p>
          <h3
            className={`typo-display mt-1 font-semibold text-[var(--text-primary)] ${
              compact ? 'text-base' : 'text-xl'
            }`}
          >
            {t.web3.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
            {t.web3.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {!wallet ? (
            <button
              type="button"
              onClick={() => void handleConnect()}
              disabled={isConnecting}
              aria-label={t.web3.connectAria}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors whitespace-nowrap disabled:opacity-60"
            >
              <Wallet
                className="h-4 w-4 shrink-0 text-[var(--accent-brass)]"
                aria-hidden="true"
              />
              <span>
                {isConnecting ? t.web3.connecting : t.web3.connectBtn}
              </span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => void handleSignPass()}
                disabled={isSigning}
                aria-label={t.web3.signAria}
                className="btn-primary px-4 py-2 text-xs disabled:opacity-60"
              >
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{isSigning ? t.web3.signing : t.web3.signBtn}</span>
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                aria-label={t.web3.disconnectAria}
                className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
              >
                {t.web3.disconnectBtn}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setScannerOpen((prev) => !prev)}
            aria-expanded={scannerOpen}
            aria-label={t.checkInScanner.toggleAria}
            className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              scannerOpen
                ? 'border-[var(--accent-brass)] bg-[var(--bg-surface)] text-[var(--accent-brass)]'
                : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-brass)]'
            }`}
          >
            <ScanLine
              className="h-4 w-4 shrink-0 text-[var(--accent-brass)]"
              aria-hidden="true"
            />
            <span>
              {scannerOpen
                ? t.checkInScanner.toggleCloseBtn
                : t.checkInScanner.toggleOpenBtn}
            </span>
          </button>
        </div>
      </div>

      {wallet && (
        <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-[var(--border-hairline)] pt-4 text-xs sm:grid-cols-3">
          <div>
            <dt className="text-[var(--text-muted)]">{t.web3.walletLabel}</dt>
            <dd className="typo-mono mt-0.5 font-medium text-[var(--text-primary)]">
              {shortenHex(wallet.address, 6, 4)}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">{t.web3.networkLabel}</dt>
            <dd className="mt-0.5 font-medium text-[var(--text-primary)]">
              {wallet.chainName}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">{t.web3.tierLabel}</dt>
            <dd className="mt-0.5 font-medium text-[var(--text-primary)]">
              {tierName}
            </dd>
          </div>
        </dl>
      )}

      {receipt && (
        <div
          aria-live="polite"
          className="mt-4 rounded-md border border-[var(--accent-brass)]/50 bg-[var(--bg-surface)] p-4 text-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 font-semibold text-[var(--accent-brass)]">
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.web3.verifiedBadge}</span>
            </p>
            <button
              type="button"
              onClick={() => void handleCopySignature()}
              className="inline-flex items-center gap-1.5 font-medium text-[var(--text-primary)] hover:text-[var(--accent-brass)] min-h-[36px]"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>
                {copied ? t.web3.copiedSignatureBtn : t.web3.copySignatureBtn}
              </span>
            </button>
          </div>
          <p className="mt-2 text-[var(--text-muted)]">
            {t.web3.signatureLabel}:{' '}
            <code className="typo-mono break-all text-[var(--text-primary)]">
              {shortenHex(receipt.signature, 16, 12)}
            </code>
          </p>
        </div>
      )}

      {showInlineBadge && receipt && (
        <DigitalBadge
          tierName={tierName}
          quantity={quantity}
          attendeeName={attendeeName}
          attendeeEmail={attendeeEmail}
          receipt={receipt}
          compact={compact}
        />
      )}

      {scannerOpen && <CheckInScanner compact={compact} />}

      {error && (
        <p
          role="alert"
          className="mt-3 text-xs font-medium text-[var(--error-ink)]"
        >
          {error}
        </p>
      )}
    </aside>
  );
}
