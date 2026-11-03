# Baseline and incoming work

Assessment date: 23 October 2026, Europe/London. Observations are version-specific. The user warned that Claude would push shortly.

## Evidence boundaries

Repository inspected through the connected GitHub tool: `AbuFitz/Taplo`, default branch `claude/modest-cerf-4tont1`, baseline tree `e4cee6d1f169cfbd9ffcd76a39b8965e5fea4c52`.

Live browser inspected: homepage, inspiration gallery, barber design detail, and opening a service in its embedded actual renderer. Screenshot viewport was approximately 730 CSS pixels wide on Taplo; this is not a physical-phone test. Linktree homepage and actual `/s/templates` page were inspected visually at a wider viewport. No comparative conversion or speed result is claimed.

The live site's commit was not verified. The report attached to the prior conversation and `docs/delivery-round-3.md` are delivery claims, not independent verification of their test counts.

## Direct observations

| ID | Surface | Evidence | Consequence / proposed correction |
|---|---|---|---|
| A01 | Homepage | White hero with headline, two CTAs and overlapping barber/café page imagery. At inspected width, the useful body of the example sits below the initial screen. | Give the first screen a legible product action and result; reduce decorative framing that hides the useful interaction. |
| A02 | Gallery | Seven examples; Desktop selected by default, confirmed in UI and `Gallery.tsx` state initialization. | Lead with sharp phone previews. Put desktop inspection inside the design detail. |
| A03 | Gallery | Style, capability and business filters occupy most of the initial screen at inspected width. | Present the designs earlier; collapse secondary filtering on narrow screens. |
| A04 | Gallery | Current examples: Night, Mono, Terracotta, Orchard, Forge, Colour, Showroom. No dedicated detailing example in this seven-item list. | Commission a coherent new catalogue with detailing, barber and dealer flagship examples. Names alone do not make a composition distinct. |
| A05 | Design detail | Desktop screenshot comes before the live page. A long descriptive/specification area explains fonts, layout and density. | Put a real phone-sized interactive example and a concise benefit first. Move technical design detail behind optional disclosure. |
| A06 | Service detail | Opening Signature cut shows £34 and 45 min, then repeats Price and Time in a definition list, alongside provider names and booking action. | Remove redundant facts; establish service summary, included work, provider choice and next action as one clear hierarchy. Recheck after push. |
| A07 | Example credibility | Public barber example includes fictional social handles linked to actual social domains; footer says businesses are examples. | Use clearly marked demo destinations or disabled demo social actions; avoid accidentally routing visitors to unrelated real accounts. |
| A08 | Theme story | Homepage displays nine starting-look choices, while inspiration displays seven populated examples. | Derive counts and availability from a shared source; distinguish a look from a populated starting design. |

## Verified repository facts

- Next 16.4.2, React 19.3.0, Motion 14.6.0, Base UI 1.9.0, dnd-kit, Radix Colors, Culori, Zod, Playwright and axe are declared in package.json. Lockfile resolution and runtime compatibility were not independently run here.
- There is an actual component workbench: `src/features/workbench/stories.ts`, `/workbench`, screenshots and `tests/e2e/workbench.spec.ts`. It renders shared components and defines interactions. No `.storybook` directory or Storybook dependency appeared in the inspected baseline.
- Business content and page presentation are already separated. `docs/theme-engine.md` describes a pipeline through migration, style resolution, entitlements, widget readiness, view model and shared renderer.
- `src/features/page/contracts/widgets.ts` and the registry provide typed settings and widget versions. Retain this investment.
- The style schema has finite choices for headers, backgrounds, cards, buttons and three desktop arrangements. It stores no owner-authored HTML/CSS/JS.
- `looks.ts` and `catalogue.ts` are separate concepts. Their counts and presentation need reconciling before adding another source of truth.
- `docs/implementation-status.md` contains earlier milestone limitations and older test counts. Newer product copy describes a richer booking setup. Treat this as documentation drift to investigate; do not conclude from the old status document that all newer booking work is absent.

## Active Claude Code session: observed, not executed here

The session visible in Opera GX is titled “Taplo business hub platform”, using the same branch. Read-only visual inspection showed these progress claims:

- Directions rendered and compared; direction A chosen for the platform.
- Tokens and navigation restyled; hero, footer and booking story added.
- A Folio look and renderer changes including serif scale and wider desktop.
- Handles and a row menu replacing Organise mode.
- Setup now accepting a cover photo.
- Final verification and a review package in progress; checklist says to stop for visual review.

No message was sent, command submitted or new Claude run started. These claims may resolve some baseline findings; re-audit rather than automatically retaining every complaint. The visible thumbnails were insufficient to assess the full design.

## Assessment

The visible baseline remains below the requested standard: the gallery prioritizes control chrome, useful example interactions are not prominent early, and marketing examples need more specific content and stronger composition. This is an expert assessment, not usability research or a measured comparison with Linktree.

The next handoff should be driven by named screens, populated examples, accepted visual decisions and recorded user tasks. Installing tools and reporting passing tests cannot substitute for this evidence.

## Still to inspect

Full homepage scroll and film playback; every feature page; pricing and plan boundaries; fresh and resumed onboarding; desktop and touch editor; direct customer pages; booking mode branches; stock detail/status; products/affiliate states; gallery/reviews; enquiries; sharing exports; navigation/footer at multiple widths; keyboard/focus/reduced motion; real device behavior. None is marked passed by this initial audit.

## Additional baseline observations after midnight

- Fresh onboarding entry has five steps and a plain form. At the inspected approximately 730px width, the preview is behind “Show my page”; no cover-photo field was visible. This is pre-push evidence, not a claim that the incoming cover-photo work failed.
- Empty editor entry offers setup or synthetic sample loading. An isolated Barber sample was loaded in this agent's browser; no existing owner data was present in that browser and nothing was published.
- At the same width, the editor uses a large preview plus bottom Content/Header/Design/Settings controls. Content opens a bottom sheet with a repeated “Your content” heading, Organise and Add content, and rows with hide controls. The Organise mode is still present in this deployed baseline; Claude's pending work says it replaces it.
- The seeded editor sample uses a compact profile header while the inspiration sample is photo-led. These are different seeded configurations; do not report this alone as a renderer parity defect.
- Latest read-only Claude screenshot reported build/types/lint passing, with unit and end-to-end failures to resolve before review. A subsequent GitHub branch lookup still returned baseline e4cee6d1f169cfbd9ffcd76a39b8965e5fea4c52.
