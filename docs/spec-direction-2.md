# Direction change 2: a business presence, not a website template

`TAPLO-CLAUDE-CODE-SPEC.md` (v1.0, 22 Oct 2026) is not stored in this repository. This file lists precisely what the second direction supersedes, so nothing is read from an out-of-date source. Everything not listed here (all industries, services, reviews, bookings, payments, teams, analytics, optional NFC, the plans and prices, the data model, RLS, the database) is unchanged and still in scope.

## Superseded
| Earlier text | Now |
|---|---|
| §5.1 "Layout preset: ordered block instances + variants; determines visual hierarchy" | **Four separate concepts:** industry preset (terminology, suggested widgets/services/workflow) · visual theme (type, background, surfaces, buttons, borders, shadows, decoration) · composition (header arrangement, width, density, desktop arrangement, ordered widget instances) · widget (content bindings, variant, settings, appearance overrides). Industry never selects or restricts a theme. |
| §5.5 five *layout families* (Trades/Beauty/Education/Professional/General) as long hero-led page templates | Removed. Replaced by eight themes that work for every industry and a compact widget list. The legacy `layoutId`/`tokenPresetId` config migrates to a theme + starter widgets and keeps the owner's colour/font choices. |
| §5.4 "Hero → Services → … blocks; Subjects/Tutors are terminology variants" | Terminology still comes from the industry preset; the page is header + owner-arranged widgets. |
| §5 / §15 "Future customisation: palette, font choices, section order, button and hero styles… preserve extension points now; no mandatory manual building" | **Customisation is current scope.** Theme gallery, header, background, typography, buttons, cards/widgets, layout/spacing, per-widget overrides, reset to theme, widget add/edit/duplicate/hide/remove/reorder, undo/redo. Good defaults still mean no mandatory building. |
| §4/§6 "Profile" dashboard screen | **My page** workspace: Content · Design · Page settings with a persistent live preview. Operational screens (services, bookings, reviews, team, products, analytics, settings) stay separate. |
| §5.8 acceptance gate "render the same dataset through all five families" | Same dataset through all eight themes with identical widgets/content (asserted); stress/edge fixtures; phone/tablet/desktop; 200% zoom proxy; keyboard; reduced motion; axe. |
| §5.7 stored `layout_id`, `layout_version`, `token_preset_id`, `sections` | Stored **page document** `schemaVersion: 2`: `themeId`, `appearance` (validated deep-partial overrides), `meta` (search visibility, share text), `widgets[]` (`id, type, version, hidden, settings, appearance`). Same SQL columns (`profile_drafts.config`, `profile_versions.config`, JSONB); no table change. |
| Hero-first public page / "business website" feel | Compact business hub: identity, short description, location/online, primary actions, then owner-arranged widgets; dialogs/sheets for booking and enquiries. |

## Added
- Widget registry (27 types) with schema, fields, variants, requirements/entitlement, empty state, renderer, migration hook, multiple-instance rule.
- Starter composition as a separate previewable, undoable action (never touches theme, colours or records; "add what's missing" never removes anything; "rearrange" names exactly what would come off the page).
- Images with focal point, in-browser upload (demo), alt text.
- Stable server-rendered sample profiles that do not depend on any browser's localStorage.
- Editor toolkit decision: custom Taplo editor on dnd-kit (`audit-and-editor-decision.md`).
