# Implementation status

Legend: ✅ done and verified as stated · 🟡 partial · ⬜ not started. "Verified" names the evidence.

## Milestone 1 — Foundation + theme engine core (this commit)

### Phase 1 — Foundation
- ✅ Next.js 16.4 + TypeScript + Tailwind 4 scaffold; Radix-based shadcn (`radix-nova`) initialised once; required components added (`form` is not offered by the current shadcn registry; React Hook Form installed for later forms).
- ✅ Taplo component layer: TaploButton, Card, Input, Modal, Badge, Avatar, ServiceCard, ReviewCard, BookingCard.
- ✅ Industry catalogue (45 presets) + "Other"; searchable; unknown keys fall back to General. Unit tests.
- ✅ Slug rules (normalise, reserved, impersonation guard) in TS **and** SQL. Unit tests + DB tests.
- ✅ Migration: businesses, slugs+history, memberships, locations, drafts/versions, subscriptions, audit; RLS; public projection RPC. **Verified on a clean Postgres 16** (15 integration tests incl. cross-tenant denial, anon denial, staff isolation, 12-way slug race, concurrent publish, rename redirect, unpublish).
- 🟡 Public route `/{slug}` renders published snapshots via `get_public_profile`; the Supabase call path is **not verified against a live Supabase project** (no credentials). Dev fixtures verified.
- ⬜ Auth (sign up/in), onboarding wizard + resumable draft, dashboard shell, Storage/assets, rate limiting.
- Gate "two users cannot access each other's data": ✅ at database level; ⬜ end-to-end through the app (no auth yet).
- Gate "any industry can create a business and resolve draft/publication state": ✅ in SQL (`create_business` with `other`); ⬜ through UI.

### Phase 2 — Theme engine
- ✅ Block registry, 5 families, 5 token presets, shared renderer/view-model, empty-content behaviour, fixtures (6 industries + minimal / no-contacts / stress), dev showcase `/dev/themes`, versioned layout fallback + warnings, entitlement-aware rendering.
- ✅ §5.8 checks automated in Playwright (50 tests passing against a production build): every fixture × family at 360/390/640(≈200% zoom)/820/1280 → no horizontal overflow, no console errors, no broken images, one `h1`, no dead links; themed dialog + select portals inherit tokens; focus trap/restore; token isolation from marketing; reduced-motion; reserved paths 404; fixtures noindex + labelled.
- ✅ Theme switching leaves business content identical (unit test); free plan cannot switch tokens; unplaced content reported.
- 🟡 Draft vs published **persistence** exists in SQL; no UI to edit/publish yet. "Preview of what appears after switching" is available as `visibleBlockTypes` and shown in the showcase, not yet in a dashboard.
- 🟡 Visual QA: screenshots inspected by a human-equivalent pass for desktop (5 families) and mobile (4); no axe scan, no manual screen-reader pass, 200% zoom only by proxy.
- ⬜ Reference-site design observations (see `design-direction.md`).

### Phases 3–9
⬜ Services CRUD · ⬜ Reviews destination page `/review/{slug}` · ⬜ Analytics · ⬜ Bookings/holds/outbox · ⬜ Stripe Billing + Connect + webhooks · ⬜ Team/staff pages, domains · ⬜ NFC store.
Dashboard menu, booking state machine and payment architecture docs are intentionally **not** written yet; nothing in this milestone implements them.

## Verification log (commands actually run)
- `npx tsc --noEmit` ✅ · `npx eslint .` ✅ · `npm run build` ✅
- `vitest run` — 28 unit + 15 DB integration = 43 ✅ (DB tests need `TAPLO_TEST_DATABASE_URL`; skipped otherwise)
- `playwright test` — 50 ✅ (against `next start` with `TAPLO_ENABLE_DEV_TOOLS=1`)

## External setup still required
Supabase project (URL, anon key, service key; apply migrations; Auth providers) · Stripe (test keys, Price IDs, webhooks) · Resend (key, verified domain) · Vercel project + domain API token · `taplo.co` DNS. None configured; nothing here claims they are.

## Open questions for the founder
See the Assumptions table in `product-decisions.md` (testimonial/review-link packaging, Pro payment scope, one-profile limit enforcement).
