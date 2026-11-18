export interface ParsedBadgeData {
  event: string;
  date: string;
  venue: string;
  passId: string;
  tier: string;
  qty: number;
  holder: string;
  web3Verified: boolean;
  wallet?: string;
  chainId?: string;
  sig?: string;
}

export type ScanEvaluation =
  | {
      status: 'valid' | 'duplicate';
      badge: ParsedBadgeData;
      checkedInAtIso: string;
      raw: string;
    }
  | {
      status: 'invalid';
      scannedAtIso: string;
      raw: string;
    };

export interface CheckedInRecord {
  passId: string;
  holder: string;
  tier: string;
  qty: number;
  web3Verified: boolean;
  wallet?: string;
  checkedInAtIso: string;
}

const CHECKED_IN_STORAGE_KEY = 'stjarnfall-checked-in-passes';

export function readCheckedInRecords(): Record<string, CheckedInRecord> {
  try {
    const raw = window.localStorage.getItem(CHECKED_IN_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, CheckedInRecord>;
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
  return {};
}

export function writeCheckedInRecords(
  records: Record<string, CheckedInRecord>
): void {
  try {
    window.localStorage.setItem(
      CHECKED_IN_STORAGE_KEY,
      JSON.stringify(records)
    );
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export function parseDigitalBadgePayload(
  rawText: string
): ParsedBadgeData | null {
  try {
    const parsed: unknown = JSON.parse(rawText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }
    const obj = parsed as Record<string, unknown>;

    if (
      obj.event !== 'STJARNFALL-2027' ||
      typeof obj.passId !== 'string' ||
      !obj.passId.trim()
    ) {
      return null;
    }

    return {
      event: obj.event,
      date: typeof obj.date === 'string' ? obj.date : '2027-10-20',
      venue:
        typeof obj.venue === 'string'
          ? obj.venue
          : 'Münchenbryggeriet, Stockholm',
      passId: obj.passId.trim(),
      tier: typeof obj.tier === 'string' ? obj.tier : 'Standard',
      qty: typeof obj.qty === 'number' && obj.qty > 0 ? obj.qty : 1,
      holder: typeof obj.holder === 'string' ? obj.holder : 'Symposium Guest',
      web3Verified: Boolean(obj.web3Verified),
      wallet: typeof obj.wallet === 'string' ? obj.wallet : undefined,
      chainId: typeof obj.chainId === 'string' ? obj.chainId : undefined,
      sig: typeof obj.sig === 'string' ? obj.sig : undefined,
    };
  } catch {
    return null;
  }
}
