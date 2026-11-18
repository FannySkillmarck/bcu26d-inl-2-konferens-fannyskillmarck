import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import type { Language } from '../i18n/LanguageContext';
import type { CheckedInRecord } from '../lib/badgeScanner';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  signInWithGoogle,
  signOutUser,
} from '../lib/firebase';

// Blueprint validation constants synchronized with firebase-blueprint.json
const ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const PASS_ID_PATTERN = /^SF27-[A-F0-9]{6}$/;
const ALLOWED_TIERS = new Set([
  'student',
  'ordinarie',
  'after-work',
  'utstallare',
]);
const ALLOWED_LANGS = new Set<Language>(['sv', 'en', 'zh']);

function clampStr(value: string, maxLen: number): string {
  return value.trim().slice(0, maxLen);
}

export function deriveBadgePassId(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `SF27-${hash.toString(16).toUpperCase().padStart(6, '0').slice(0, 6)}`;
}

export interface PersistedRegistration {
  registrationId: string;
  userId: string;
  tierId: string;
  tierName: string;
  quantity: number;
  fullName: string;
  email: string;
  dietary: string;
  passId: string;
  web3Wallet?: string;
  web3ChainId?: string;
  web3Signature?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface FirebaseContextValue {
  user: User | null;
  authReady: boolean;
  isSigningIn: boolean;
  authError: string | null;
  savedTalkIdsFromCloud: string[] | null;
  registrations: PersistedRegistration[];
  cloudCheckIns: Record<string, CheckedInRecord>;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
  syncSavedTalkIds: (ids: string[]) => Promise<void>;
  syncPreferredLanguage: (lang: Language) => Promise<void>;
  saveTicketRegistration: (input: {
    tierId: string;
    tierName: string;
    quantity: number;
    fullName: string;
    email: string;
    dietary: string;
    web3Wallet?: string;
    web3ChainId?: string;
    web3Signature?: string;
  }) => Promise<PersistedRegistration | null>;
  attachWeb3ToRegistration: (
    registrationId: string,
    web3: { wallet: string; chainId: string; signature: string }
  ) => Promise<void>;
  saveCheckInRecord: (record: CheckedInRecord) => Promise<void>;
  clearCheckInRecords: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

function readLocalSavedTalkIds(): string[] {
  try {
    const raw = window.localStorage.getItem('stjarnfall-talk-reminders');
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === 'string')
        .slice(0, 12);
    }
  } catch {
    // Ignore storage errors
  }
  return [];
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [savedTalkIdsFromCloud, setSavedTalkIdsFromCloud] = useState<
    string[] | null
  >(null);
  const [registrations, setRegistrations] = useState<PersistedRegistration[]>(
    []
  );
  const [cloudCheckIns, setCloudCheckIns] = useState<
    Record<string, CheckedInRecord>
  >({});

  const ensureUserProfile = useCallback(async (firebaseUser: User) => {
    if (!ID_PATTERN.test(firebaseUser.uid) || !firebaseUser.email) return;

    const userPath = `users/${firebaseUser.uid}`;
    const userRef = doc(db, 'users', firebaseUser.uid);

    const displayName = clampStr(
      firebaseUser.displayName || firebaseUser.email.split('@')[0] || 'Guest',
      120
    );
    const email = clampStr(firebaseUser.email, 254);
    const photoURL = firebaseUser.photoURL
      ? clampStr(firebaseUser.photoURL, 500)
      : undefined;

    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        let initialLang: Language = 'sv';
        try {
          const savedLang = window.localStorage.getItem('stjarnfall-lang');
          if (savedLang && ALLOWED_LANGS.has(savedLang as Language)) {
            initialLang = savedLang as Language;
          }
        } catch {
          // Ignore storage error
        }

        const localTalks = readLocalSavedTalkIds()
          .map((id) => clampStr(id, 128))
          .filter((id) => id.length > 0)
          .slice(0, 12);

        const payload: Record<string, unknown> = {
          uid: clampStr(firebaseUser.uid, 128),
          displayName,
          email,
          savedTalkIds: localTalks,
          preferredLanguage: initialLang,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        if (photoURL) {
          payload.photoURL = photoURL;
        }

        await setDoc(userRef, payload);
      } else {
        const existing = snap.data();
        const updates: Record<string, unknown> = {
          displayName,
          email,
          updatedAt: serverTimestamp(),
        };
        if (photoURL) {
          updates.photoURL = photoURL;
        } else if (existing?.photoURL) {
          updates.photoURL = clampStr(String(existing.photoURL), 500);
        }
        await updateDoc(userRef, updates);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, userPath);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);

      if (!nextUser) {
        setSavedTalkIdsFromCloud(null);
        setRegistrations([]);
        setCloudCheckIns({});
      } else {
        void ensureUserProfile(nextUser);
      }
    });

    return () => unsubscribe();
  }, [ensureUserProfile]);

  useEffect(() => {
    if (!authReady || !user) return;

    const userPath = `users/${user.uid}`;
    const userUnsub = onSnapshot(
      doc(db, 'users', user.uid),
      (snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        if (Array.isArray(data.savedTalkIds)) {
          setSavedTalkIdsFromCloud(
            data.savedTalkIds
              .filter((item): item is string => typeof item === 'string')
              .slice(0, 12)
          );
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, userPath);
      }
    );

    const regsPath = `users/${user.uid}/registrations`;
    const regsQuery = query(
      collection(db, 'users', user.uid, 'registrations'),
      where('userId', '==', user.uid)
    );
    const regsUnsub = onSnapshot(
      regsQuery,
      (snapshot) => {
        const list: PersistedRegistration[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as PersistedRegistration);
        });
        list.sort((a, b) => {
          const aSec = a.createdAt?.seconds ?? 0;
          const bSec = b.createdAt?.seconds ?? 0;
          return bSec - aSec;
        });
        setRegistrations(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, regsPath);
      }
    );

    const checkInsPath = `users/${user.uid}/checkIns`;
    const checkInsQuery = query(
      collection(db, 'users', user.uid, 'checkIns'),
      where('scannerUid', '==', user.uid)
    );
    const checkInsUnsub = onSnapshot(
      checkInsQuery,
      (snapshot) => {
        const map: Record<string, CheckedInRecord> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as CheckedInRecord;
          if (data.passId) {
            map[data.passId] = data;
          }
        });
        setCloudCheckIns(map);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, checkInsPath);
      }
    );

    return () => {
      userUnsub();
      regsUnsub();
      checkInsUnsub();
    };
  }, [authReady, user]);

  const signIn = useCallback(async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      const signedInUser = await signInWithGoogle();
      return signedInUser;
    } catch (error: unknown) {
      const code =
        error && typeof error === 'object' && 'code' in error
          ? String((error as { code?: unknown }).code)
          : '';
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('popup-closed');
      } else {
        setAuthError('sign-in-failed');
      }
      return null;
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthError(null);
    await signOutUser();
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const syncSavedTalkIds = useCallback(
    async (ids: string[]) => {
      if (!user) return;
      const bounded = Array.from(
        new Set(
          ids
            .filter((id): id is string => typeof id === 'string')
            .map((id) => clampStr(id, 128))
            .filter((id) => id.length > 0)
        )
      ).slice(0, 12);

      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          savedTalkIds: bounded,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [user]
  );

  const syncPreferredLanguage = useCallback(
    async (lang: Language) => {
      if (!user || !ALLOWED_LANGS.has(lang)) return;
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          preferredLanguage: lang,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [user]
  );

  const saveTicketRegistration = useCallback(
    async (input: {
      tierId: string;
      tierName: string;
      quantity: number;
      fullName: string;
      email: string;
      dietary: string;
      web3Wallet?: string;
      web3ChainId?: string;
      web3Signature?: string;
    }): Promise<PersistedRegistration | null> => {
      if (!user) return null;

      await ensureUserProfile(user);

      const safeTierId = ALLOWED_TIERS.has(input.tierId)
        ? input.tierId
        : 'ordinarie';
      const safeTierName = clampStr(input.tierName || 'Standard', 80);
      const safeQty = Math.min(5, Math.max(1, Math.trunc(input.quantity || 1)));
      const safeName = clampStr(
        input.fullName || user.displayName || 'Guest',
        120
      );
      const safeEmail = clampStr(input.email || user.email || '', 254);
      const safeDietary = clampStr(input.dietary || '', 200);

      const regId = `reg_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`.replace(/[^a-zA-Z0-9_-]/g, '');

      const seed =
        input.web3Signature ||
        `${safeEmail}|${safeName}|${safeTierName}|${safeQty}`;
      const passId = deriveBadgePassId(seed);
      const safePassId = PASS_ID_PATTERN.test(passId) ? passId : 'SF27-000001';

      const payload: Record<string, unknown> = {
        registrationId: regId,
        userId: user.uid,
        tierId: safeTierId,
        tierName: safeTierName,
        quantity: safeQty,
        fullName: safeName.length >= 2 ? safeName : 'Symposium Guest',
        email: safeEmail.length >= 3 ? safeEmail : 'guest@stjarnfall.se',
        dietary: safeDietary,
        passId: safePassId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (input.web3Wallet) {
        payload.web3Wallet = clampStr(input.web3Wallet, 64);
      }
      if (input.web3ChainId) {
        payload.web3ChainId = clampStr(input.web3ChainId, 32);
      }
      if (input.web3Signature) {
        payload.web3Signature = clampStr(input.web3Signature, 256);
      }

      const path = `users/${user.uid}/registrations/${regId}`;
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'registrations', regId),
          payload
        );
        return {
          registrationId: regId,
          userId: user.uid,
          tierId: safeTierId,
          tierName: safeTierName,
          quantity: safeQty,
          fullName: String(payload.fullName),
          email: String(payload.email),
          dietary: safeDietary,
          passId: safePassId,
          web3Wallet: input.web3Wallet
            ? clampStr(input.web3Wallet, 64)
            : undefined,
          web3ChainId: input.web3ChainId
            ? clampStr(input.web3ChainId, 32)
            : undefined,
          web3Signature: input.web3Signature
            ? clampStr(input.web3Signature, 256)
            : undefined,
        };
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    },
    [ensureUserProfile, user]
  );

  const attachWeb3ToRegistration = useCallback(
    async (
      registrationId: string,
      web3: { wallet: string; chainId: string; signature: string }
    ) => {
      if (!user || !ID_PATTERN.test(registrationId)) return;
      const path = `users/${user.uid}/registrations/${registrationId}`;
      try {
        await updateDoc(
          doc(db, 'users', user.uid, 'registrations', registrationId),
          {
            web3Wallet: clampStr(web3.wallet, 64),
            web3ChainId: clampStr(web3.chainId, 32),
            web3Signature: clampStr(web3.signature, 256),
            updatedAt: serverTimestamp(),
          }
        );
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [user]
  );

  const saveCheckInRecord = useCallback(
    async (record: CheckedInRecord) => {
      if (!user) return;
      if (!PASS_ID_PATTERN.test(record.passId)) return;

      await ensureUserProfile(user);

      const payload: Record<string, unknown> = {
        passId: clampStr(record.passId, 32),
        scannerUid: user.uid,
        holder: clampStr(record.holder || 'Symposium Guest', 120),
        tier: clampStr(record.tier || 'Standard', 80),
        qty: Math.min(10, Math.max(1, Math.trunc(record.qty || 1))),
        web3Verified: Boolean(record.web3Verified),
        checkedInAtIso: clampStr(record.checkedInAtIso, 40),
        createdAt: serverTimestamp(),
      };
      if (record.wallet) {
        payload.wallet = clampStr(record.wallet, 64);
      }

      const path = `users/${user.uid}/checkIns/${record.passId}`;
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'checkIns', record.passId),
          payload
        );
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    },
    [ensureUserProfile, user]
  );

  const clearCheckInRecords = useCallback(async () => {
    if (!user) return;
    const keys = Object.keys(cloudCheckIns);
    for (const passId of keys) {
      const path = `users/${user.uid}/checkIns/${passId}`;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'checkIns', passId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  }, [cloudCheckIns, user]);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        authReady,
        isSigningIn,
        authError,
        savedTalkIdsFromCloud,
        registrations,
        cloudCheckIns,
        signIn,
        signOut,
        clearAuthError,
        syncSavedTalkIds,
        syncPreferredLanguage,
        saveTicketRegistration,
        attachWeb3ToRegistration,
        saveCheckInRecord,
        clearCheckInRecords,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase(): FirebaseContextValue {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return ctx;
}
