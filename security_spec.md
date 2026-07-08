# Security Specification: ScriptForge AI Firestore Access Control

## 1. Data Invariants
1. **User Profile Isolation**: A user's profile (`/users/{userId}`) can only be created, read, or updated by the authenticated user whose `uid` matches the document's `{userId}` path parameter. No user can read or write to other users' profiles.
2. **Subscription Level Tamper Protection**: Only system processes or authorized update operations can set a subscription tier (`plan`). A standard user profile creation should default to `Free` and users cannot self-escalate their `plan` to `Pro` or `Premium` without a verified payment event.
3. **History Isolation**: A generation history item (`/users/{userId}/history/{historyId}`) can only be created, read, updated, or deleted by the user who owns that history. The parent `{userId}` must match `request.auth.uid`.
4. **Immutable Fields**: Properties such as `createdAt`, `userId`, and `email` must be immutable once created.
5. **Data Limits**: Field values (such as text titles) must not exceed reasonable length limits (e.g. titles <= 200 chars) to prevent resource abuse.

---

## 2. The "Dirty Dozen" Malicious Payloads (Forbidden Cases)

### Identity & Path Spoofing
1. **Payload 1 (Read other user profile)**: Attempting to GET `/users/victimUser123` while authenticated as `attacker456`.
2. **Payload 2 (Write other user profile)**: Attempting to SET `/users/victimUser123` with attacker data while authenticated as `attacker456`.
3. **Payload 3 (Access other user's history)**: Attempting to GET or LIST `/users/victimUser123/history` while authenticated as `attacker456`.
4. **Payload 4 (Hijack history parent)**: Attempting to CREATE `/users/victimUser123/history/itemXYZ` while authenticated as `attacker456`.

### subscription/Tier Privilege Escalation
5. **Payload 5 (Self-escalation to Pro)**: Authenticated user `user789` attempting to update `/users/user789` changing `plan` from `"Free"` to `"Pro"`.
6. **Payload 6 (Self-escalation to Premium)**: Authenticated user `user789` attempting to update `/users/user789` changing `plan` from `"Free"` to `"Premium"`.
7. **Payload 7 (Tampering stripe id)**: Authenticated user `user789` trying to force set `stripeSubscriptionId` to a fake active session key on update.

### Data Validation & Injection Checks
8. **Payload 8 (Large Character Injection in Name)**: Attempting to write a 1MB random string as `name` in profile to crash views or cause overflow.
9. **Payload 9 (Junk Characters in ID)**: Attempting to create a document with path variable `/users/user789/history/$$$_hacked_$$$` to poison URL routers.
10. **Payload 10 (Spoofed Timestamp)**: Attempting to create a history item with client-supplied `createdAt` set to a future date instead of `request.time`.
11. **Payload 11 (Mutable Field Overwrite)**: Attempting to update a history document changing its `userId` field to a different user's ID.
12. **Payload 12 (Anonymous Read of History)**: Attempting to read a user history list without being authenticated.

---

## 3. Recommended Rules Verification Tests

Tests are structured in `firestore.rules` using standard Firestore rules declarations matching the "Eight Pillars" security directives.
