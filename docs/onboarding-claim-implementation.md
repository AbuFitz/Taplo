# P03: bound setup claim

Command: `ClaimOnboardingDraft`, `POST /v1/onboarding/claim`.

Implemented in source: a verified Supabase subject can provision a canonical user explicitly during claim; binding uses provider + subject, never email. Repeated provisioning is serialised. Suspended identities remain blocked. A claim requires the current active merchant principal, the opaque HttpOnly draft credential, an unexpired draft, its exact version and an idempotency key. Business, owner membership, claimed draft, receipt, audit and outbox are atomic. Simultaneous identical retries return one business; a different actor/cookie cannot recover that receipt. No publication, account-verification message or payment is fabricated.

Migration `0002_onboarding_claim.sql` adds a narrowly scoped, non-bypass onboarding role and provider-bound provisioning insert policies. The regular app role retains no business/membership insert grants. The migration runner applies ordered pending migrations under a session advisory lock, refuses unknown/gapped history and retains the explicit reviewed-database opt-in.

Activation remains off (`TAPLO_SERVER_CLAIM` must be `1`). An actual configured database, reviewed migration and login-role membership in the new role are required before activation. Live provider verification and account return still need end-to-end evidence. The frontend setup has not yet been switched to the canonical claim endpoint. This is one command within P03, not completion of the packet or its first-offer/publish journey.

Verification: eight isolated PostgreSQL tests cover credential/version/audience rejection, concurrency, atomic record/event counts, replay authority, suspension, role restrictions, expiry and explicit provider-test-adapter provisioning. They are added to CI; no database pass claimed before the run completes. The adapter verifies database binding logic, not live provider behaviour.
