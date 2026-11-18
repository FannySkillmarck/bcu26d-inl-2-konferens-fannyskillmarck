# Security Specification — Stjärnfall 2027 Firestore Rules

## 1. Data Invariants

1. **Default Deny**: All unmatched paths in Firestore are denied for read and write.
2. **Verified Google Identity**: Every read/write requires `request.auth != null && request.auth.token.email_verified == true`.
3. **Strict Owner Isolation (PII Protection)**:
   - `/users/{userId}` contains `email`, `displayName`, and user preferences; only `request.auth.uid == userId` may `get`, `create`, `update`, or `delete`. No `list` is exposed on `/users`.
   - `/users/{userId}/registrations/{registrationId}` and `/users/{userId}/checkIns/{passId}` enforce the Master Gate: the parent `/users/{userId}` document must exist and have `uid == request.auth.uid`. `list` queries on subcollections enforce `resource.data.userId == request.auth.uid` (or `scannerUid == request.auth.uid`).
4. **Immutable Ownership & Timestamps**:
   - `uid`, `userId`, `scannerUid`, `registrationId`, `passId`, and `createdAt` cannot be modified after creation.
   - `createdAt` on create and `updatedAt` on create/update must equal `request.time`.
5. **Bounded Types & Strict Allowlisted Keys**:
   - Every string validates `is string && size() <= MAX` matching `firebase-blueprint.json`.
   - `savedTalkIds` is bounded to `size() <= 12` and checks `savedTalkIds[0]` type when non-empty.
   - `create` checks `keys().hasAll(...)` and `keys().hasOnly(...)`; `update` validates `isValid*` first and restricts mutations via named action branches with `affectedKeys().hasOnly(...)`.

## 2. The "Dirty Dozen" Attack Payloads (Expected: `PERMISSION_DENIED`)

1. **Unauthenticated read on user profile**: `GET /users/userA` with `auth: null`.
2. **Cross-user PII read**: `GET /users/userB` signed in as `userA`.
3. **Collection-wide user scraping**: `LIST /users` signed in as `userA`.
4. **Unverified email token write**: `CREATE /users/userA` with `auth.token.email_verified: false`.
5. **Identity spoofing on profile create**: `CREATE /users/userA` with `uid: "userB"` while signed in as `userA`.
6. **Shadow / ghost field injection**: `CREATE /users/userA` with all valid fields plus `"isAdmin": true`.
7. **Unbounded array / Denial of Wallet**: `UPDATE /users/userA` with `savedTalkIds` containing 25 items (`> 12`).
8. **Oversized string poisoning**: `CREATE /users/userA` with `displayName` > 120 chars or `userId` > 128 chars.
9. **Client-forged timestamp**: `CREATE /users/userA/registrations/reg1` with `createdAt` set to a past client `Timestamp` instead of `request.time`.
10. **Orphaned registration without parent Master Gate**: `CREATE /users/userA/registrations/reg1` when `/users/userA` does not exist.
11. **Ownership hijacking via update**: `UPDATE /users/userA/registrations/reg1` changing `userId` or `createdAt` or `passId`.
12. **Invalid passId format or non-whitelisted tierId**: `CREATE /users/userA/registrations/reg1` with `passId: "BAD-ID"` or `tierId: "vip-free"`.
