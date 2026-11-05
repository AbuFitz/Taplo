# P03 · Email-code account entry

5 November 2026. Better Auth 1.7.17 (MIT), pinned in package/lock files. Official email OTP, session, account-linking documentation and installed types were inspected. The existing Supabase adapter remains inactive; no existing identity data was migrated or merged.

## Implemented source

The finish step no longer asks for a password. The configured account flow requests an email code, supports six-digit paste/autofill, masks the displayed address, offers change-email and a 30-second resend countdown, preserves the page draft on failure and checks the actual cookie session before opening Studio. No auth token is written to localStorage. Sandbox editing still opens Studio; its contradictory account-required message is replaced with “You can keep editing before you publish.”

The first-party server surface exposes only send-sign-in-code, email-code sign-in, session and sign-out. Password signup/reset and implicit social-linking endpoints are closed. The pinned SDK owns OTP generation, hashed verification storage, ten-minute expiry, five attempt limit, rotation, secure host-only cookies and persistent database rate limiting. Email is awaited through Resend; errors do not return a successful send. A provider accepting an email is not proof of inbox delivery.

Runtime requires explicit TAPLO_AUTH_ENABLED=1, TAPLO_AUTH_DATABASE_URL, TAPLO_AUTH_SECRET (32+ characters), TAPLO_AUTH_BASE_URL, RESEND_API_KEY and TAPLO_SECURITY_EMAIL_FROM. The browser adapter requires NEXT_PUBLIC_TAPLO_AUTH_PROVIDER=better-auth and account capability. No deployment flags or secrets have been changed by this implementation. No provider emails have been sent.

Auth uses a separate taplo_auth schema/credential and rejects superuser, bypass-RLS, role/database-creation power or access to tenant operational roles. No automatic table migrations run in the request path. db/auth/0001_namespace.sql and db:generate:auth provide an explicit namespace and read-only SDK migration compiler for operator review; the compiler refuses to overwrite an output file. Auth web credentials must receive only the reviewed auth-table grants, never migration or tenant access. No new SQL was applied to live Neon in this work.

## Verification and remaining boundaries

Unit tests check the restricted HTTP surface, cross-origin rejection, missing-configuration failure and cookie/account-link defaults. Isolated PostgreSQL tests exercise the actual SDK challenge → wrong-code rejection → verified cookie session → consumed-code replay rejection → logout. These are test-adapter emails, not live Resend/device/MFA evidence. Actual CI results must be recorded after execution; locally DB cases are skipped when no permitted DB is available.

This is account-entry implementation, not full P03 completion. Canonical identity binding, anonymous draft sync/claim and membership-based Studio return still need connecting to the new cookie-session adapter. The existing bearer/Supabase claim route is not silently treated as compatible. Canonical BeginSignIn continuation records/return-state and audience-specific absolute session limits also remain. Apple/Google, MFA/step-up, recovery, edge/IP trust, address/device/global abuse controls, mail-domain approval and relay/delivery tests remain activation/release prerequisites. Current database IP/path throttling alone does not establish complete abuse protection. Protected actions must remain denied without real assurance; no aal2 is minted by this implementation.

## Related onboarding repairs

Barber navigation now says Services and Barbers instead of inherited Treatments/Team. First-service duration accepts blank or a deliberate integer from 1–1440 minutes; it no longer silently clamps oversize values or accepts zero as a completed duration. Invalid fields receive contextual errors after Continue; partial rows remain in the setup draft and invalid values do not overwrite valid business service records. A completely blank row remains optional, and a minutes-only row can be removed.
