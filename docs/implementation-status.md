# Implementation status

Legend: ✅ done and verified as stated · 🟡 partial · ⬜ not started. "Verified" names the evidence. Direction change 2 (`spec-direction-2.md`) supersedes the earlier layout-template approach; this file reflects the current state only.

## Direction 2 — theme, widgets and "My page" editor

### Stage 1 — audit and editor decision ✅
`audit-and-editor-decision.md`: what existed (five fused layout families, two exposed controls, order/hide with no UI, two installed-but-unused libraries), research from official docs/registry metadata, decision (custom editor on stable dnd-kit; Puck rejected for stated, partly-unverified reasons; Craft.js/GrapesJS rejected). `react-hook-form` and `@supabase/ssr` removed (zero imports).

### Stage 2 — contracts, themes, widgets, renderer ✅
- Separate concepts: industry preset / visual theme / composition / widget (`theme-engine.md`).
- 8 themes; 27 widget types in a typed registry; one renderer for preview, published, samples and the public route.
- Business records separate from presentation; products and offers added as real records; images gain focal point and safe local upload.
- Migration: legacy v1 config and v1 demo drafts upgrade with a visible note; unknown widgets removed from view with a note; invalid settings fall back to defaults.
- Verified by unit tests (see log).

### Stage 3 — My page editor ✅ (demo-mode data)
Content (add / edit / duplicate / hide / remove-from-page / reorder by drag handle, **accessible move up/down**, empty states, undo/redo, starter suggestions with preview) · Design (theme gallery, header, background, text, buttons, cards, layout, readability check, per-control and per-section reset) · Page settings (publish/unpublish/discard, address, sharing, search visibility, honest domain state). Persistent live preview on desktop; Preview sheet on phones.

### Stage 4 — public profile + starter themes ✅
Compact header + widgets, three desktop arrangements, six synthetic businesses with deliberately cross-paired themes, edge-case fixtures.

### Stage 5 — onboarding, stable demos, verification ✅
Claim → identity → look → widgets → publish, resumable, page visible as it forms. `/demo/profiles`, `/demo/themes`, `/<slug>?theme=` are server-rendered and need no localStorage.

## What was tested (commands actually run)
See `## Verification log`.

## Known limitations / not built
- **All owner data is demo-only** (browser localStorage; no auth, no server persistence). The Supabase RPC path for published pages is unchanged from the earlier milestone and still not exercised against a live project.
- No real file storage: uploads are downscaled to small data URLs (≈≤380 KB each); browser storage is ~5 MB, and the editor warns if saving fails.
- Reorder by **touch** is verified with synthetic touch events (Chromium DevTools), not a physical phone. Pointer and keyboard are verified directly.
- Payments are **simulated** (labelled); bookings (`/{slug}/book`), analytics, NFC, staff pages, custom domains, email, team invitations are not built.
- No true video background (a slowly drifting gradient exists and respects reduced motion). No per-widget responsive arrangements beyond the three desktop modes.
- Undo history is per tab and resets on reload (the draft persists).
- Design references (Linktree et al.) were **not inspected**; see `design-direction.md`.
- 200% zoom is verified by a 640px-wide proxy, not a real browser zoom. No screen-reader (NVDA/VoiceOver) pass; automated axe only.
- Visual review was by me, not a designer.
- DB integration tests (15) were last run before this direction change; SQL is unchanged and they were not re-run here (no Postgres in this session).

## Earlier milestone items still true
Foundation migration + RLS + public projection (15 DB tests), slug rules, entitlement resolver (plans/prices locked), demo mode on by default (`TAPLO_DEMO_MODE=0` closes it), unbuilt dashboard areas labelled honestly. Phases 3–9 of the original plan (services/profile content CRUD beyond demo, reviews page, analytics, bookings, payments, team/domains, NFC) remain unstarted as production features.

## External setup still required
Supabase project, Stripe, Resend, Vercel domain integration, `taplo.co` DNS. None configured; nothing claims otherwise.

## Verification log
Run on a clean production build (`rm -rf .next && npm run build`), Chromium 1194, Node 22.
- `tsc --noEmit` ✅ · `eslint .` ✅ (0 errors, 0 warnings) · `next build` ✅
- `vitest run` — **49 unit tests** ✅: registry completeness (27 types, schema/defaults/field keys), 8 themes distinct + WCAG AA, style overrides + reset + corrective readability + corrupt-override rejection, migration (legacy config, unknown widget, repair), starter planning (add never removes, replace names removals), view-model (theme switch preserves records and arrangement for 6 businesses × 8 themes, empty/hidden/locked statuses, unsafe links, expiry, corrupt settings), fixtures (independent theme/industry pairing), image/URL safety. (+ 15 DB integration tests skipped: no Postgres in this session.)
- `playwright test` — **66 browser tests** ✅ in 3.6 min:
  - **editor (11):** add/edit/duplicate/hide/remove-from-page (records survive; undo restores); reorder by move buttons, **keyboard drag**, **mouse drag**, **touch drag** (CDP touch events) with preview following editor order; 8-theme switch with unchanged content/arrangement/records; custom values, per-section and global reset; per-widget overrides + reset (other widgets untouched); undo/redo by buttons and Ctrl/Cmd+Z (typing = one step) and persistence after refresh; publish → published-page parity (widgets, order, theme), later edits private until republish, discard, unpublish; starter preview/cancel/apply/undo; image upload, focal sliders, bad-file rejection, initials fallback; unreadable colour corrected and explained; long names / 14 services / no images / no contacts / empty page.
  - **profiles (29):** stable sample index; fresh browser sees identical page; `?theme=` changes only the look; theme gallery; noindex + reserved paths; all 9 fixtures × 5 widths (360/390/640/820/1280); 6 businesses × 8 themes × phone+desktop — each: no horizontal overflow, console error, broken image, dead link, sub-40px tap target, exactly one `h1`; booking dialog + select portal inherit the theme (4 themes); keyboard-only focus ring, focus trap and restore; reduced motion stops the drifting background; video loads nothing third-party until tap; payment is plainly simulated; header never duplicates a channel widget.
  - **journeys (14):** onboarding wording and full flow with live preview, resume after reload, 390px; legacy draft migration with note; products/offers records → widgets → archive/expiry; services → every service widget; Free/Pro gating with content kept; page settings; My page first in navigation; phone editing at 360 and 390 (+ 640px ≈ 200% zoom); upload → published.
  - **accessibility (12):** axe WCAG 2.1 A/AA + best practice, zero serious/critical: every theme (café + tutor), six businesses × phone/desktop, four themed dialogs, editor Content/Design/Settings, onboarding, add-widget dialog.
- Defects found by these runs and fixed: stale unreadable muted text token (axe), social icon labels not matching visible text (axe), video button name mismatch (axe), subtitle contrast lost to opacity (axe), editor horizontal overflow on phones, a text-only header that never drew a chosen picture, no `<main>` landmark in onboarding, silent legacy migration, "Undo" able to revert a freshly loaded sample to blank, cover banner oversized on desktop, centred alignment leaking into list content, "Page colour" override ignored on plain-colour themes.
