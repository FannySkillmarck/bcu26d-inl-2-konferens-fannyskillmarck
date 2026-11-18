import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import jsQR from 'jsqr';
import {
  AlertTriangle,
  Camera,
  CameraOff,
  CheckCircle2,
  ImageUp,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  parseDigitalBadgePayload,
  readCheckedInRecords,
  writeCheckedInRecords,
  type CheckedInRecord,
  type ScanEvaluation,
} from '../lib/badgeScanner';
import { shortenHex } from '../lib/web3';

interface CheckInScannerProps {
  compact?: boolean;
}

const SCAN_INTERVAL_MS = 120;

export function CheckInScanner({ compact = false }: CheckInScannerProps) {
  const { language, t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment'
  );
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanEvaluation | null>(null);
  const [checkedInRecords, setCheckedInRecords] = useState<
    Record<string, CheckedInRecord>
  >(() => readCheckedInRecords());

  const checkedInRef = useRef(checkedInRecords);
  checkedInRef.current = checkedInRecords;

  const formatTime = useCallback(
    (iso: string) => {
      try {
        return new Date(iso).toLocaleTimeString(
          language === 'sv' ? 'sv-SE' : language === 'zh' ? 'zh-CN' : 'en-GB',
          { hour: '2-digit', minute: '2-digit', second: '2-digit' }
        );
      } catch {
        return iso;
      }
    },
    [language]
  );

  const evaluateRawQr = useCallback((rawData: string) => {
    const parsed = parseDigitalBadgePayload(rawData);
    const nowIso = new Date().toISOString();

    if (!parsed) {
      setScanResult({
        status: 'invalid',
        scannedAtIso: nowIso,
        raw: rawData,
      });
      return;
    }

    const existing = checkedInRef.current[parsed.passId];
    if (existing) {
      setScanResult({
        status: 'duplicate',
        badge: parsed,
        checkedInAtIso: existing.checkedInAtIso,
        raw: rawData,
      });
      return;
    }

    const nextRecord: CheckedInRecord = {
      passId: parsed.passId,
      holder: parsed.holder,
      tier: parsed.tier,
      qty: parsed.qty,
      web3Verified: parsed.web3Verified,
      wallet: parsed.wallet,
      checkedInAtIso: nowIso,
    };

    const nextMap = {
      ...checkedInRef.current,
      [parsed.passId]: nextRecord,
    };
    checkedInRef.current = nextMap;
    setCheckedInRecords(nextMap);
    writeCheckedInRecords(nextMap);

    setScanResult({
      status: 'valid',
      badge: parsed,
      checkedInAtIso: nowIso,
      raw: rawData,
    });
  }, []);

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    pausedRef.current = false;
    setIsPaused(false);
    setCameraActive(false);
    setIsStarting(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const scanFrame = useCallback(
    (timestamp: number) => {
      if (!streamRef.current) return;

      if (
        !pausedRef.current &&
        timestamp - lastScanTimeRef.current >= SCAN_INTERVAL_MS
      ) {
        lastScanTimeRef.current = timestamp;
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (
          video &&
          canvas &&
          video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
          video.videoWidth > 0 &&
          video.videoHeight > 0
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const code = jsQR(
              imageData.data,
              imageData.width,
              imageData.height,
              {
                inversionAttempts: 'dontInvert',
              }
            );
            if (code?.data) {
              pausedRef.current = true;
              setIsPaused(true);
              evaluateRawQr(code.data);
            }
          }
        }
      }

      rafRef.current = window.requestAnimationFrame(scanFrame);
    },
    [evaluateRawQr]
  );

  const startCamera = useCallback(
    async (mode: 'environment' | 'user') => {
      stopCamera();
      setError(null);

      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices ||
        typeof navigator.mediaDevices.getUserMedia !== 'function'
      ) {
        setError(t.checkInScanner.unsupportedError);
        return;
      }

      setIsStarting(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        if (typeof navigator.mediaDevices.enumerateDevices === 'function') {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoInputs = devices.filter((d) => d.kind === 'videoinput');
            setHasMultipleCameras(videoInputs.length > 1);
          } catch {
            // Ignore enumerateDevices failure
          }
        }

        pausedRef.current = false;
        setIsPaused(false);
        setCameraActive(true);
        rafRef.current = window.requestAnimationFrame(scanFrame);
      } catch (err: unknown) {
        stopCamera();
        const errName =
          err && typeof err === 'object' && 'name' in err
            ? String((err as { name?: unknown }).name)
            : '';

        if (
          errName === 'NotAllowedError' ||
          errName === 'PermissionDeniedError' ||
          errName === 'SecurityError'
        ) {
          setError(t.checkInScanner.permissionDeniedError);
        } else if (
          errName === 'NotFoundError' ||
          errName === 'DevicesNotFoundError' ||
          errName === 'OverconstrainedError'
        ) {
          setError(t.checkInScanner.noCameraError);
        } else {
          setError(t.checkInScanner.cameraError);
        }
      } finally {
        setIsStarting(false);
      }
    },
    [scanFrame, stopCamera, t.checkInScanner]
  );

  const handleSwitchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraActive) {
      void startCamera(nextMode);
    }
  };

  const handleResumeScan = () => {
    pausedRef.current = false;
    setIsPaused(false);
    setScanResult(null);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });
        if (!code?.data) {
          setError(t.checkInScanner.imageDecodeError);
          return;
        }
        evaluateRawQr(code.data);
      };
      img.onerror = () => {
        setError(t.checkInScanner.imageDecodeError);
      };
      img.src = String(reader.result ?? '');
    };
    reader.readAsDataURL(file);
  };

  const handleClearLog = () => {
    checkedInRef.current = {};
    setCheckedInRecords({});
    writeCheckedInRecords({});
  };

  const recentList = Object.values(checkedInRecords).sort((a, b) =>
    b.checkedInAtIso.localeCompare(a.checkedInAtIso)
  );

  return (
    <section
      aria-label={t.checkInScanner.heading}
      className={`rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] ${
        compact ? 'mt-4 p-4' : 'mt-5 p-5 sm:p-6'
      }`}
    >
      <div className="flex flex-col gap-3 border-b border-[var(--border-hairline)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="typo-display flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
            <ScanLine
              className="h-4 w-4 shrink-0 text-[var(--accent-brass)]"
              aria-hidden="true"
            />
            <span>{t.checkInScanner.heading}</span>
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
            {t.checkInScanner.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!cameraActive ? (
            <button
              type="button"
              onClick={() => void startCamera(facingMode)}
              disabled={isStarting}
              className="btn-primary px-3.5 py-2 text-xs disabled:opacity-60"
            >
              <Camera className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                {isStarting
                  ? t.checkInScanner.startingCamera
                  : t.checkInScanner.startCameraBtn}
              </span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors whitespace-nowrap"
              >
                <CameraOff
                  className="h-3.5 w-3.5 shrink-0 text-[var(--accent-brass)]"
                  aria-hidden="true"
                />
                <span>{t.checkInScanner.stopCameraBtn}</span>
              </button>
              {hasMultipleCameras && (
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors whitespace-nowrap"
                >
                  <RefreshCw
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{t.checkInScanner.switchCameraBtn}</span>
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label={t.checkInScanner.uploadQrAria}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors whitespace-nowrap"
          >
            <ImageUp
              className="h-3.5 w-3.5 shrink-0 text-[var(--accent-brass)]"
              aria-hidden="true"
            />
            <span>{t.checkInScanner.uploadQrBtn}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="sr-only"
          />
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="relative aspect-video overflow-hidden rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              aria-label={t.checkInScanner.videoAria}
              className={`h-full w-full object-cover ${
                cameraActive ? 'block' : 'hidden'
              }`}
            />

            {!cameraActive && (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <Camera
                  className="h-7 w-7 text-[var(--accent-brass)]"
                  aria-hidden="true"
                />
                <p className="mt-2.5 max-w-xs text-xs leading-relaxed text-[var(--text-muted)]">
                  {t.checkInScanner.idleHint}
                </p>
              </div>
            )}

            {cameraActive && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div className="h-36 w-36 rounded-lg border-2 border-[var(--accent-brass)]/85 shadow-[0_0_0_9999px_rgba(11,13,17,0.38)]" />
              </div>
            )}
          </div>

          {cameraActive && (
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <p className="text-[var(--text-muted)]">
                {isPaused
                  ? t.checkInScanner.pausedStatus
                  : t.checkInScanner.scanningStatus}
              </p>
              {isPaused && (
                <button
                  type="button"
                  onClick={handleResumeScan}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-[var(--accent-brass)] bg-[var(--bg-subtle)] px-3 py-1 text-xs font-semibold text-[var(--accent-brass)] hover:opacity-90 transition-opacity"
                >
                  <ScanLine className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.checkInScanner.scanNextBtn}</span>
                </button>
              )}
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="mt-3 text-xs font-medium text-[var(--error-ink)]"
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col justify-between gap-4 lg:col-span-6">
          {scanResult ? (
            <div
              aria-live="polite"
              className={`rounded-md border p-4 text-xs ${
                scanResult.status === 'valid'
                  ? 'border-[var(--accent-brass)] bg-[var(--bg-subtle)]/70'
                  : scanResult.status === 'duplicate'
                    ? 'border-amber-500/60 bg-[var(--bg-subtle)]/70'
                    : 'border-[var(--error-ink)]/60 bg-[var(--bg-subtle)]/70'
              }`}
            >
              {scanResult.status === 'invalid' ? (
                <div className="flex items-start gap-2.5">
                  <XCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--error-ink)]"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--error-ink)]">
                      {t.checkInScanner.invalidTitle}
                    </p>
                    <p className="mt-1 text-[var(--text-muted)]">
                      {t.checkInScanner.invalidHint}
                    </p>
                    <p className="typo-mono mt-2 truncate text-[11px] text-[var(--text-muted)]">
                      {scanResult.raw}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p
                    className={`flex items-center gap-1.5 font-semibold ${
                      scanResult.status === 'valid'
                        ? 'text-[var(--accent-brass)]'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {scanResult.status === 'valid' ? (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertTriangle
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span>
                      {scanResult.status === 'valid'
                        ? t.checkInScanner.validTitle
                        : t.checkInScanner.duplicateTitle(
                            formatTime(scanResult.checkedInAtIso)
                          )}
                    </span>
                  </p>

                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="min-w-0">
                      <dt className="text-[var(--text-muted)]">
                        {t.checkInScanner.holderLabel}
                      </dt>
                      <dd className="mt-0.5 truncate font-semibold text-[var(--text-primary)]">
                        {scanResult.badge.holder}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--text-muted)]">
                        {t.checkInScanner.passIdLabel}
                      </dt>
                      <dd className="typo-mono mt-0.5 font-semibold text-[var(--accent-brass)]">
                        {scanResult.badge.passId}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--text-muted)]">
                        {t.checkInScanner.tierLabel}
                      </dt>
                      <dd className="mt-0.5 font-medium text-[var(--text-primary)]">
                        {scanResult.badge.qty} × {scanResult.badge.tier}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--text-muted)]">
                        {t.checkInScanner.verificationLabel}
                      </dt>
                      <dd className="mt-0.5 font-medium text-[var(--text-primary)]">
                        {scanResult.badge.web3Verified
                          ? t.checkInScanner.web3VerifiedValue
                          : t.checkInScanner.standardTicketValue}
                      </dd>
                    </div>
                    {scanResult.badge.wallet && (
                      <div>
                        <dt className="text-[var(--text-muted)]">
                          {t.checkInScanner.walletLabel}
                        </dt>
                        <dd className="typo-mono mt-0.5 text-[var(--text-primary)]">
                          {shortenHex(scanResult.badge.wallet, 6, 4)}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-[var(--text-muted)]">
                        {t.checkInScanner.checkedInAtLabel}
                      </dt>
                      <dd className="typo-mono mt-0.5 text-[var(--text-primary)]">
                        {formatTime(scanResult.checkedInAtIso)}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          ) : null}

          {recentList.length > 0 && (
            <div className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-3.5 text-xs">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-hairline)]">
                <p className="font-semibold text-[var(--text-primary)]">
                  {t.checkInScanner.recentHeading(recentList.length)}
                </p>
                <button
                  type="button"
                  onClick={handleClearLog}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] min-h-[32px]"
                >
                  <Trash2 className="h-3 w-3" aria-hidden="true" />
                  <span>{t.checkInScanner.clearLogBtn}</span>
                </button>
              </div>
              <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto">
                {recentList.slice(0, 8).map((entry) => (
                  <li
                    key={entry.passId}
                    className="flex items-center justify-between gap-2 text-[11px]"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {entry.web3Verified && (
                        <ShieldCheck
                          className="h-3.5 w-3.5 shrink-0 text-[var(--accent-brass)]"
                          aria-hidden="true"
                        />
                      )}
                      <span className="typo-mono font-semibold text-[var(--accent-brass)]">
                        {entry.passId}
                      </span>
                      <span className="truncate font-medium text-[var(--text-primary)]">
                        {entry.holder}
                      </span>
                    </div>
                    <span className="typo-mono shrink-0 text-[var(--text-muted)]">
                      {formatTime(entry.checkedInAtIso)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
