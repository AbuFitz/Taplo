# P02 operational shell implementation

Working branch: claude/modest-cerf-4tont1. Source authority: release-3.0/design/tokens.json and the P02 responsive shell contract.

Implemented: frameless full-width Studio shell, horizontal desktop navigation retaining all existing destinations, mobile bottom navigation, Inter/Manrope typography, shared light/dark/system appearance using canonical palette values, native keyboard-accessible appearance selector, per-device preference persistence and reactive system preference changes, scoped portal inheritance, branded asset tone selection, skip-to-content, explicit menu focus return, 44px popup close target. Merchant document/theme configuration is never mutated by operational appearance.

Existing public-page palettes and legacy saved data are preserved. Existing editor-specific composition remains in place. This is not completion of all Studio screen designs or P03 canonical offer journeys. Operational navigation now uses one semantic map of the regular Phosphor Core 2.1.1 paths. These are extracted from the pinned official npm package, with its MIT notice retained at src/features/platform/PHOSPHOR-LICENSE.txt; the full package is not installed or shipped. Legacy business/editor feature icons are retained pending their packet-specific rework, rather than adding a second runtime icon pack.

Actual verification: Next-generated route types + local TypeScript passed; targeted component lint passed; 13 foundation policy/transport tests passed. New Playwright checks cover theme persistence through navigation/reload, business document preservation, mobile dock overflow, dialog keyboard dismissal/focus return, system theme updates and skip navigation. Browser installation download was invalid; system Chromium exists but cannot start under the local runner socket restriction. No local browser assertion reached the page. Deployed desktop review exercised the sample-business load, appearance selection and menu Escape/focus return. It exposed legacy CSS overriding surface/text colours; these collisions are corrected with explicit operational scope. Local production build passed. CI provides browser verification and uploads P02 screenshots; corrected deployed review and mobile browser checks remain required. P02 is not accepted until rendered and accessibility review succeeds.


Deployed follow-up: corrected overview/menu contrast and dark-mode logo verified visually. Service-list/form review found additional hard-coded neutral button/input/title colours; those are now mapped to operational tokens. Menu dismissal restores the opener; navigation dismissal allows the new task to receive focus instead. Critical operational browser checks now finish in the verify job before the full browser-regression job, preserving the full suite while making failures available promptly. Local unit run: 437 passed, 50 database tests skipped without a local test database; prior PostgreSQL CI test step passed. Full browser acceptance remains pending, with no pass claimed from an attempted launch.


CI run 41740688007: critical mobile navigation/overflow, Escape/focus return in light and dark, device-theme reaction and keyboard skip checks passed (2 tests). Desktop test timed out because it reloaded before the client navigation reached Services; it is corrected to await the destination URL before reload. The desktop form/axe assertions had not run, so they are not counted as passed. On that source version, CI typecheck/lint/unit+PostgreSQL/build steps passed. Deployed follow-up confirmed readable service input text, labels, neutral action buttons and cancellation without saving in dark mode, plus light-mode return. A Radix-composed menu trigger replaces data-slot, so button token mapping now also targets its preserved data-variant attribute.


Mobile composition follow-up: Today is the consistent home destination, required readiness steps open initially, optional walkthroughs sit under Quick guides, repeated calendar guidance is removed, and the content/footer no longer double up their bottom safe space. Browser captures wait for the existing short entrance animation to finish. Compact controls keep 44px hit targets without stretching checkbox/switch artwork. Existing editor regression setup now uses the registered synthetic fixture data directly; the actual sample-entry flow remains exercised by the operational browser tests.


CI run 41741472191 exercised the service form and reported only the Optional disclosure label at 4.04:1 in dark mode. That label now uses the canonical muted token and 12px minimum type. The desktop audit remains a required check and was not bypassed. Mobile/device/keyboard cases continued to pass. Operational icon mapping and the contrast correction await the next source-version checks.


CI run 41742495794: dark form audit passed, but the subsequent header audit found two banner landmarks (global navigation and the legacy page-action header). Page actions now form a labelled group, leaving one actual application banner. The mobile/device/keyboard tests remained passing. All corrective checks stay enabled.


Verified source 9e4656553f4fb39dc68b493ed04145a4b254402d: GitHub Actions run 41743228789, verify job 126289696949 passed Next route types, TypeScript, lint, 487 unit/PostgreSQL tests, production build and all 3 operational Playwright checks. Service-form and navigation header axe audits passed with no rules disabled. Browser-regression job 126290820896 remained running when recorded. P02 shared shell is verified; remaining screen/state adoption and later packet journeys are not represented as complete. P03–P12 remain pending.

## Deployed editor review — 5 November

Reviewed the deployed desktop editor through its real sample-entry route and selected Noir through the Look control. Selection changed the business renderer. Found a separate defect: current design IDs were requested as absent `/looks/{id}.webp` assets. The chooser now uses the existing visibility-mounted real-renderer preview for current designs; legacy captures remain in place. Removed the duplicate desktop design walkthrough trigger. Added phone/desktop browser checks for a loaded real design preview, a single walkthrough trigger and retained selection when navigating between design tasks. These new browser checks await their CI result.

## Mobile framing correction

The actual 390px CI capture showed the beginning of the profile mark clipped out of the short editor preview. Design/Profile tabs were requesting focus on `.tp-name`, which scrolled past the mark. They now reset to the page top when reframing. Decorated handset previews also reserve their camera/status area outside the document viewport, including the shortened mobile stage. Unframed choice previews retain the full document viewport. Geometry unit checks pass; the phone browser check now asserts the complete mark is visible and that the iframe begins below the decorative island. New browser assertions await CI.

Source `357c6aa` passed the full verify job in run 41974661435: 500 unit/PostgreSQL tests, type generation/checking, lint, build, three operational browser checks, two task/real-preview checks and 104 public-profile/control checks. This is not a pass for the subsequent mobile/replay changes or the full browser-regression job, which was superseded by newer work.

Exact mobile block selection now leaves scrolling to the selection bridge's widget ID, instead of posting a second generic focus request which could jump back to the header (or the first block of the same type). The content-list default also starts at the top. Added a phone check that selects Questions and verifies it remains in the preview after the deferred focus window settles.

The first selected-Questions test incorrectly used a barber fixture whose starter page has no Questions block. It now uses the mechanic fixture, which contains that block; the viewport/selection assertions remain unchanged. Playwright captures failing screens automatically for diagnosis.
