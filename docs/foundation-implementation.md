# Packet implementation record · 3 November 2026

## Consolidation

All six original refs are represented in main: main plus claude/modest-cerf-4tont1, codex/setup-studio-design, codex/studio-mobile-composition, codex/production-copy-inspiration and docs/taplo-blueprint-3-0. The last four are ancestry-contained in the two latest development heads. Merge retained all histories and resolved AGENTS.md by retaining both blueprint and production-copy instructions. Founder instruction to use main supersedes earlier branch names in the imported handoff. No source branch has been force-reset or deleted. The founder subsequently clarified that claude/modest-cerf-4tont1 is the canonical working branch; consolidated work is brought there with both histories retained.

## P01: implemented source; runtime acceptance in progress

- Canonical input/record JSON Schema validation from adopted 3.0 contracts (no separately writable source).
- Deny-by-default merchant/workforce distinction, membership/status/tenant/action/location/resource/own-assignment/field/state/fresh-step-up checks.
- Verified Supabase SDK token adapter pinned to configured issuer/authenticated audience, explicit provider-subject binding, no email auto-link. Only documented TOTP evidence is accepted for fresh step-up; other methods are not assumed equivalent. Actual provider and all-method assurance proof remains required.
- Additive reviewed subset under taplo schema: identity binding, business/membership, anonymous onboarding draft, idempotency receipts, append-only audit, outbox, provider operations and rate windows. Existing public Supabase migrations/tables are untouched. This is not the complete blueprint storage migration.
- Opaque HttpOnly/Secure/SameSite draft credential, origin checks, bounded request bodies, 7-day anonymous expiry, canonical versioned writes and ETags, atomic record/audit/outbox/receipt transaction and database-backed session rate limits.
- Command receipts serialize same principal/business/command/key and compare canonical payload hashes. Replays re-enter current authority before operation reads. No provider call is made inside a database transaction.
- Worker claims use SKIP LOCKED and lease ownership, bounded retry only after definite preacceptance rejection, uncertain outcome/expired lease enters reconciliation instead of automatic retry. No production consumer/provider adapter is enabled by this foundation.
- GetOperation checks current live membership, non-enumerating tenant visibility and a closed canonical projection.

Commands/routes: UpsertOnboardingDraft /v1/onboarding/drafts; read/resume on GET same resource; GetOperation /v1/businesses/{business_id}/operations/status. These are server foundations, not a completed account claim/publish/booking journey.

## Existing system inventory / migration boundaries

The app currently uses browser-local DemoState and an unimplemented account adapter (src/features/demo/account.ts). Existing public Supabase foundation/booking SQL and its integration harness remain. No configured production connection was assumed or queried. Blueprint canonical IDs are prefixed text, unlike legacy UUID records. Keep both sources until explicit mapping/dry-run/compare/switch; never cast or delete existing UUID records blindly. No plan prices or commercial decisions were changed in this packet.

## Environment and activation

- TAPLO_DATABASE_URL: server-only, restricted connection granted taplo_app and taplo_identity, never a browser secret. The transaction sets a non-owner NOBYPASSRLS role. Separate migration credentials are required.
- TAPLO_SERVER_DRAFTS=1 explicitly enables the anonymous server endpoint after its schema, cleanup and abuse protections are verified. Disabled otherwise; no fake successful persistence.
- TAPLO_MIGRATION_DATABASE_URL and TAPLO_APPLY_FOUNDATION=yes apply only the additive foundation after operator review. Never falls back to a production URL.
- TAPLO_TEST_DATABASE_URL points at throwaway PostgreSQL with create-database permission; integration harness creates and drops an isolated database. Existing CI already provides PostgreSQL 16.
- Runtime auth verifies the existing configured Supabase issuer. The blueprint's longer-term auth/provider choices are not silently replaced; identity binding and actual provider verification are prerequisites, and native/Console audiences need their own reviewed adapters.

Before enabling anonymous drafts publicly, provide edge/IP abuse controls and deploy cleanup of expired drafts/anonymous receipt payloads. The per-session rate limit is implemented but is not claimed to stop a client creating new sessions. Anonymous receipt replay is now bounded to the draft expiry, with expired keys rejected; physical deletion still requires the reviewed cleanup deployment. Other command receipts default to 90 days pending command-specific retention review. No new account, payment or publication is faked by these endpoints.

## Verification and next dependencies

Local npm tarball requests timed out (including pinned Lexend); a package-lock-only update succeeded. The repository npm test/build could not run locally and are not reported as passed. Ten direct Node 24 runtime scenarios did pass against TypeScript-transformed source: valid/malformed JSON, unsupported content type, streamed byte limit, error redaction/no-store/correlation, permitted owner action, cross-tenant denial, customer-session denial, revoked membership and fresh-verification enforcement. This does not replace AJV/PostgreSQL/browser evidence. Canonical integration tests cover actual SQL migration/RLS, concurrent writes, idempotency conflict/replay, rollback, draft credential isolation/expiry, worker claims/unknown outcomes and current membership operation projection. Existing CI is updated to generate Next route types before TypeScript. Record its actual result before marking P01 accepted.

P02–P12 remain pending; no screen count, scaffolding or static blueprint verification establishes those packets. Next unblocked work is resolving CI/isolated PostgreSQL findings, then adopting the shared design system (P02), followed by draft claim/category/offer/config/availability/readiness/reviewed publication (P03). P04+ remain dependency-gated. Real provider/device/security/restore/legal/customer evidence cannot be manufactured by code.

## 5 November checkpoint (supersedes initial verification notes above)

Dependencies now install successfully. Local type checking, lint and production builds passed; the full local test run passed 439 tests and skipped 61 cases requiring PostgreSQL. CI source `357c6aa` passed 500 unit/PostgreSQL tests, type checking, lint and build. Subsequent source `e6bd542` also passed all 500 tests, including the tightened identity, GBP and revoked-anonymous-receipt assertions. The isolated fixture-role race was fixed without disabling assertions. Live activation, physical retention cleanup, edge abuse controls and actual provider verification remain pending.

P02 has a verified shared shell and appearance controls, with remaining screen adoption. P03 has the atomic claim/first-offer command path under isolated checks; frontend account return/configuration/working-time/readiness/reviewed publication remain incomplete. See IMPLEMENTATION-PROGRESS.json and onboarding-claim-implementation.md for current evidence. P04–P12 are not complete.

Final source checkpoint `cb3d195` passed verify job 127078898149 in run 41977156083: 500 unit/PostgreSQL tests, type checking, lint, build and 110 focused browser checks. Full browser regression remains a separate unfinished check.
