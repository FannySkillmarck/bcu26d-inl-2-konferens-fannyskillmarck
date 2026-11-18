export interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: {
    method: string;
    params?: unknown[] | Record<string, unknown>;
  }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    listener: (...args: unknown[]) => void
  ) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export interface WalletConnection {
  address: string;
  chainId: string;
  chainName: string;
}

export interface SignedPassReceipt {
  address: string;
  chainId: string;
  chainName: string;
  signature: string;
  message: string;
  signedAtIso: string;
}

const CHAIN_NAMES: Record<string, string> = {
  '0x1': 'Ethereum Mainnet',
  '0xaa36a7': 'Sepolia Testnet',
  '0x89': 'Polygon PoS',
  '0x2105': 'Base',
  '0xa4b1': 'Arbitrum One',
  '0xa': 'Optimism',
  '0xe708': 'Linea',
};

export function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === 'undefined') return null;
  return window.ethereum ?? null;
}

export function getChainName(chainId: string): string {
  const normalized = chainId.toLowerCase();
  return (
    CHAIN_NAMES[normalized] ??
    `EVM Chain (${Number.parseInt(normalized, 16) || normalized})`
  );
}

export function shortenHex(value: string, head = 6, tail = 4): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

function utf8ToHex(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return (
    '0x' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  );
}

export async function connectEvmWallet(): Promise<WalletConnection> {
  const provider = getEthereumProvider();
  if (!provider) {
    throw new Error('NO_WALLET');
  }

  const accounts = (await provider.request({
    method: 'eth_requestAccounts',
  })) as string[];

  const address = accounts?.[0];
  if (!address) {
    throw new Error('NO_ACCOUNT');
  }

  const chainId = (await provider.request({
    method: 'eth_chainId',
  })) as string;

  return {
    address,
    chainId,
    chainName: getChainName(chainId),
  };
}

export async function signSymposiumPass(params: {
  address: string;
  chainId: string;
  tierName: string;
  quantity?: number;
}): Promise<SignedPassReceipt> {
  const provider = getEthereumProvider();
  if (!provider) {
    throw new Error('NO_WALLET');
  }

  const signedAtIso = new Date().toISOString();
  const chainName = getChainName(params.chainId);
  const qty = params.quantity ?? 1;

  const message = [
    'Stjärnfall 2027 — Nordic Symposium on Astrology & Cosmic Time',
    'Venue: Münchenbryggeriet, Stockholm (2027-10-20)',
    `Pass Tier: ${params.tierName} (Qty: ${qty})`,
    `Holder Wallet: ${params.address}`,
    `Network: ${chainName} (${params.chainId})`,
    `Issued At: ${signedAtIso}`,
  ].join('\n');

  const signature = (await provider.request({
    method: 'personal_sign',
    params: [utf8ToHex(message), params.address],
  })) as string;

  return {
    address: params.address,
    chainId: params.chainId,
    chainName,
    signature,
    message,
    signedAtIso,
  };
}

export function isUserRejectedError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const code = (err as { code?: unknown }).code;
  return code === 4001;
}
