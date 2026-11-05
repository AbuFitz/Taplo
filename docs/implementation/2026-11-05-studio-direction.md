# Studio direction and connected quick setup · 5 November 2026

The founder explicitly authorised replacing previous-session design decisions. This pass uses the 3.0 blueprint as product direction, preserving useful records and behaviour rather than preserving old screen composition.

## What this changes

- Rebuilt Today as a frameless task canvas. Date, actual work, reply needs, useful details and the business page have separate hierarchy. Removed decorative dashboard art, redundant Today toolbar and invented identity avatars. Real logos remain unframed and contained without cropping.
- Desktop uses an operational work column and a contextual details column. Mobile puts first-offer and quick setup before the calendar; the permanent navigation retains all tools without repeating the complete desktop directory. The DOM order matches the responsive reading order.
- First-run Studio is typography-led, with one setup action and optional synthetic examples. Examples preserve the existing safety check against overwriting a draft.
- Contact and public-hours editors open on the current task. They retain inputs, validate before commit, focus the relevant field, guard unsaved dismissal, acknowledge actual save failures, restore focus, and protect same-field edits made in another tab. Loading the latest values is explicit.
- Public hours retain multiple opening periods, reject overlaps/reversed/invalid times, copy the owner's Monday periods to weekdays while preserving weekends, and show/hide their public block explicitly. No default opening times are represented as the merchant's facts.
- Found and addressed a legacy coupling: booking config may be derived from public opening hours. Before a quick public-hours update, preserve the current booking pattern with a checked persistence result. A failed snapshot prevents the public-hours update. No appointment slots or booking readiness are silently changed by editing public display hours.
- Today's work uses business-local dates, current pending expiry and real recorded statuses. It handles invalid time zones, updates on time/focus changes, and excludes expired/finished/cancelled work. It does not invent revenue, payment state or order fulfilment.
- Attention links open the actual enquiry section. Appointment links open that specific appointment; closing removes the selection URL, and missing appointments give a recoverable state without inventing details.

## Contracts and scope

Advances P02 and the usable P03 Studio journey, with studio.today and the quick-edit design principles. The new public-hours editor is deliberately distinct from staff/resource working-time editing. It does **not** close PreviewWorkingHoursImpact, scheduling concurrency, live provider connections, authenticated cloud persistence or the wider P03/P04/P07 contracts. Existing accepted work, scheduling rules, identities, public page design and unrelated user content are retained. No Neon data/schema/roles or provider configuration changed in this pass.

## Verification

Local typecheck, changed-file lint, production build and unit checks are performed against the changed source. Before the final routing additions, the local complete unit suite recorded 522 passed and 67 database-dependent skips; skips do not count as success. Actual CI runs include isolated PostgreSQL.

Added connected browser coverage for 320/390/1440 light/dark composition and contact editing, validation/focus, persistence after reload, dirty dismissal, cross-tab conflict, split hours, preserving the old appointment pattern, public block projection, enquiry routing and appointment deep-link recovery. Existing first-offer and operational-shell cases remain part of verification. Screenshot/a11y results are recorded from the run, not inferred from test authorship. Final rendered composition still receives inspection after the deployed build is ready.


### Rendered review and connected correction

The first CI run passed isolated database/unit checks, build, operational-shell, appearance navigation and targeted setup regression. Its new focused journey checks caught two distinct issues: geometry was sampled while the entry animation was still running, and the public hours renderer discarded all but the first period. Bounds assertions now wait for the actual entry animation to finish without relaxing viewport limits. The public renderer retains every period, orders and merges legacy overlapping intervals for truthful status, reports same-day reopening after breaks, and safely handles invalid legacy hours/timezones. These changes have dedicated status tests. Final CI results remain evidence to record after the correction run.

Reviewed actual 320/390/1440 captures and the deployed Studio, including neutral rounded contact editor, split-hours scrolling, light/dark typography, dirty dismissal and return focus. No final-design claim is made for untouched Studio routes or the full ecosystem.


The correction run passed all 17 focused browser journeys, including public split-hours display; operational-shell, appearance navigation and selected setup recovery also passed. During follow-through, the older Business details hours editor was found to use a different single-period/closed-day interpretation. It now displays every saved interval and opens the same validated, conflict-aware quick editor without navigation. The shared editor owns its CSS for direct-entry consistency. Content summaries count distinct open days rather than periods. Browser coverage now continues from Today through the public page into Business details, verifies both periods and the closed Sunday, and returns focus after dismissal.


### Identity without invented marks

Public profile marks now require supplied imagery; no business initials are generated from a name. Missing cover imagery retains the selected colour-field composition without a repeated monogram. Team members without photos keep their real names and profile actions without fabricated initials or blank portraits. Photo-backed arrangements and logo proportions remain intact. Updated the legacy browser assertions that explicitly expected fabricated initials and added mixed/no-photo render coverage. This follows the founder's identity directive and does not create, remove or alter stored logos/photos.


Live customer review confirmed that the team profile lost focus to the document after dismissal. The shared controlled Overlay now captures the initiating element before autofocus and restores it on close when no explicit trigger/callback owns restoration. A newly focused field in another overlay takes precedence. Added phone/desktop connected checks for both close-button and Escape dismissal, without fabricated team portraits.


## Verified application checkpoint

Application/test commit: `018d8f05f00742172a516d648b691a2877d43e08`, canonical branch `claude/modest-cerf-4tont1`.

GitHub Actions run: https://github.com/AbuFitz/Taplo/actions/runs/42035008519

The `verify` job completed successfully:

- Type generation, TypeScript, repository lint and production build passed.
- 609 unit/database tests passed in isolated CI PostgreSQL; no database skips in that run. The equivalent local suite recorded 542 passes and 67 unavailable-database skips, which were not counted as passes.
- 19 connected onboarding/Studio/customer checks passed, including the public-hours round trip through Business details, conflict/save recovery and customer profile → booking → original opener focus.
- 3 operational-shell, 3 starting-look/navigation and 3 targeted mobile preview/validation checks passed.
- 104 public-theme contrast and design-control checks passed.
- Total browser checks in the successful verify job: 132. The separate full browser-regression job was still running when this checkpoint was recorded; its outcome is not assumed.

Manual deployed review confirmed the shared hours editor from Business details, its neutral floating surface and focus return, public team/name rendering without invented marks, and profile → booking → original person focus recovery. Code source is clean at the checkpoint. This evidence advances the stated Studio/identity slice only. It does not establish cloud draft claim completion, payments/commerce launch, the full customer app/Console, native/device behaviour, external provider readiness or professional legal/security approval.
