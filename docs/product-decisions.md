# Product decisions

Locked decisions come from the founder spec (v1.0, 22 Oct 2026). Everything under **Assumptions** is a proposed, reversible default awaiting founder confirmation.

## Locked
- All local service industries from day one; presets are suggestions, never an allowlist. "Other / describe your business" always publishes (General layout).
- Public hub at `/{businessSlug}`; staff at `/{businessSlug}/{staffSlug}`; booking at `/{businessSlug}/book` (reserved against staff slugs).
- Five layout families (Trades, Beauty, Education, Professional, General) from one data model and one block registry. No per-industry page apps.
- Plans and prices: Free £0 · Core £9.99 · Pro £19.99 · Business £39.99 per month. No annual discount, trial, quota or commission.
- No invented reviews, ratings, qualifications, prices, services or verification badges. Pilot businesses use synthetic fixtures until owners approve real content.

## Assumptions (change in one place each)
| Area | Assumption | Where |
|---|---|---|
| Free theme | Industry-matched layout; theme *switching* starts at Core | `entitlements.themeSwitching` |
| Testimonials | Owner-supplied testimonials allowed on every plan; review *destination links* from Core | `entitlements.testimonials / reviewLinks` |
| Payments | Pro includes deposits and full upfront payment | `entitlements.payments` |
| Team | Pro: team pages + one bookable operator; Business: multiple staff | `maxStaffBookable`, `multiStaff` |
| About / FAQ / case studies | Available on every plan (profile content, not gated by the spec) | view-model has no gate |
| Analytics | Dashboard access from Core | `entitlements.analytics` |
| Billing states | `past_due` keeps access during retry; `unpaid/canceled/incomplete` revert to Free without deleting content | `effectivePlan` |
| Profiles per account | Not limited yet (spec says "1 profile" on Free; enforcement deferred to billing phase) | — |
| Cache Components | Disabled in `next.config.ts`; every public read is a runtime tenant lookup. Revisit for tag-based caching | `next.config.ts` |
| Fonts | Self-hosted via Fontsource (no runtime third-party requests, builds work offline) | `features/themes/fonts.ts` |
| Booking before Phase 6 | Booking block degrades to the business's own enabled channels (call/WhatsApp/email) with the chosen service pre-filled. No fake form | `taplo-booking-card.tsx` |
| Professional layout | Default order has no Booking block (per spec); booking content is reported as "unplaced" | `presets/layouts` |
| Slug policy | 3–40 chars, a–z 0–9 single hyphens, not all digits; platform-name variants (`*taplo*`) reserved; retired slugs stay owned by their business forever | `slug.ts` + migration |
| Dev tooling | `/dev/*` and synthetic fixtures only when `NODE_ENV!=production` or `TAPLO_ENABLE_DEV_TOOLS=1` | `lib/env.ts` |
| Demo mode | `TAPLO_DEMO_MODE=1` opens onboarding/dashboard without auth, data in browser localStorage, labelled everywhere; implies dev tools/fixtures. For review deployments only | `lib/env.ts`, `features/demo` |
| Service archive | Services gain `archived` (hidden publicly, kept for history) instead of deletion | `content.ts` |
