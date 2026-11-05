# P03: bound setup claim

Command: `ClaimOnboardingDraft`, `POST /v1/onboarding/claim`.

Implemented in source: a verified Supabase subject can provision a canonical user explicitly during claim; binding uses provider + subject, never email. Repeated provisioning is serialised. Suspended identities remain blocked. A claim requires the current active merchant principal, the opaque HttpOnly draft credential, an unexpired draft, its exact version and an idempotency key. Business, owner membership, claimed draft, receipt, audit and outbox are atomic. Simultaneous identical retries return one business; a different actor/cookie cannot recover that receipt. No publication, account-verification message or payment is fabricated.

Migration `0002_onboarding_claim.sql` adds a narrowly scoped, non-bypass onboarding role and provider-bound provisioning insert policies. The regular app role retains no business/membership insert grants. The migration runner applies ordered pending migrations under a session advisory lock, refuses unknown/gapped history and retains the explicit reviewed-database opt-in.

Activation remains off (`TAPLO_SERVER_CLAIM` must be `1`). An actual configured database, reviewed migration and login-role membership in the new role are required before activation. Live provider verification and account return still need end-to-end evidence. The frontend setup has not yet been switched to the canonical claim endpoint. This is one command within P03, not completion of the packet or its first-offer/publish journey.

Verification: eight isolated PostgreSQL tests cover credential/version/audience rejection, concurrency, atomic record/event counts, replay authority, suspension, role restrictions, expiry and explicit provider-test-adapter provisioning. CI run 41973258290 (source ad14252) passed the npm test step with PostgreSQL, plus type checking, lint and build. The overall run is not claimed passed: its expanded browser step is still running. The adapter verifies database binding logic, not live provider behaviour.

## First offer draft

Added `CreateOfferDraft` at `POST /v1/businesses/{business_id}/offers/drafts`, guarded by `TAPLO_SERVER_OFFERS=1`. It rechecks the active user's current tenant membership and `catalogue.write` authority before returning even an earlier receipt. A deliberate title, kind, price mode and optional exact minor-unit price are recorded atomically with receipt/audit/outbox. Missing price/configuration remains a private draft. The ordinary runtime has no offer update/delete grant and cannot publish directly.

Contract conflict resolved: `CreateOfferDraft` explicitly allows incomplete drafts, but `Offer` formerly required policy/configuration references and nonempty delivery modes for every lifecycle state. The record now allows missing references/empty modes in drafts while requiring them for published/paused offers. No invented references are supplied to satisfy validation. The additive offer table enforces the same publication-completeness boundary.

Added three database cases connecting the claimed business to its first offer, testing concurrent retries, price preservation, revoked/cross-tenant/customer authority, incomplete drafts, contradictory free prices and direct-publication denial. These new offer cases await CI execution. Two lifecycle validation tests pass locally. The full local test run passed 439 tests and skipped 61 database cases because no local PostgreSQL server is configured. Blueprint static consistency checks and parsing all three additive migrations passed; these do not establish live database/provider evidence.

Remaining P03: complete account return and frontend adapter; editable offer/config/resources/hours; authoritative readiness, reviewed publication and public projection. P04–P12 remain unimplemented. No live migrations or provider activation were performed.
