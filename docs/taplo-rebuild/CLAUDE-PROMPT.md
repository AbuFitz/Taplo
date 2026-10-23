# Taplo implementation handoff

The owner has now authorized direct frontend implementation and using Claude sparingly where useful. Work on claude/modest-cerf-4tont1, the same branch as Claude; sync concurrent changes without force-pushing. The earlier preparation-only boundary is superseded. Round four was reconciled at commit 4a08d1ffe3c163b21d6b4b2060c602ba18b0ebc8. Recheck for subsequent pushes before use.

---

Continue Taplo from the latest actual repository state. The owner wants a substantial improvement in product design, theme quality, editing, setup, marketing and content. Preserve good work from the latest push; identify what still falls short through rendered evidence. Do not treat prior screenshots or this pack's baseline observations as permanent facts.

## Read the project and establish the current state

Read AGENTS.md, current project instructions and the relevant installed Next documentation. Read the latest delivery/review package and requirements checklist before changing anything. Identify repository HEAD and the deployment being reviewed separately. The research baseline was `e4cee6d1f169cfbd9ffcd76a39b8965e5fea4c52`; a later Claude run reported navigation/hero/footer, booking story, Folio, desktop changes, editor handles and cover-photo setup. Confirm those claims and retain improvements that work.

Read ROUND4-RECONCILIATION.md, CUSTOMER-JOURNEY-AUDIT.md and the preserved upstream checklist first. The deployed round-four reference is not completed propagation. E01–E03 persist in the actual latest-source probe; J02 is a live no-op Back control and J03 loses selected vehicle context in the in-page form. Resolve them as part of complete engine/journey work. Preserve/migrate saved composition deliberately; do not silently flatten saved split/columns documents just because the checklist proposes retiring those names.

Read `docs/taplo-rebuild/AUDIT.md`, `ENGINE-AND-UX.md`, `CREATIVE-BRIEF.md`, `TOOLING.md` and `ACCEPTANCE.csv`. Use the repository-local frontend-design and taplo-design-review skills if installed. Confirm the files are present before claiming skill use. Do not repeatedly install the same dependencies or assume a documented MCP connection exists.

Also read ENGINE-REVIEW-MATRIX.md, ENGINE-AUDIT.md and WIDGET-COVERAGE.csv. Use the matrix to prove the full theme/layout system, including saved composition migration, precedence, parity and state preservation; example screenshots alone cannot close it. Actual-source probes found widget-level contrast failures with a changed wallpaper and with an outlined button on a changed widget background. The current look picker already replaces page styling and supports Undo; do not rely on the obsolete override-retention description. The registry currently declares 30 types, including nine without explicit baseline workbench type declarations. Recheck these findings against the incoming commit before applying the included desired-contract regression tests.

Build a short current-state ledger: requirement, current evidence, still present/resolved/regressed/unverified, next action. Use actual rendered screens, not only source inspection. Preserve all supported industries, business records, saved page documents, existing pricing and entitlements. Keep production-integration work separately scoped; this is not permission to change auth, charge payments, scrape business data or publish misleading claims.

## Product target

Read SCOPE.md, UK-DIRECTION.md and MARKETING-AUDIT.md. The owner clarified that backend is a later project: build the complete intended live frontend, preserve full testing access and keep simulated action outcomes accurate in context. Put visual choices using actual content before long settings forms; simplify arbitrary picture shapes without losing stored documents. The owner explicitly reaffirmed that theme examples are only a small part: the engine, page layouts, all widgets, owner/customer journeys and the connected marketing experience must be finished. Use credible, down-to-earth UK businesses to exercise that system. Avoid overly boutique, cinematic or generic international stock aesthetics. Do not narrow the work to imagery or theme recolours.

Taplo is a compact, useful business presence: identity, offerings and a clear way for the next customer to act. Learn from Linktree's approachability and visual customization, Framer's presentation, and Apple's care in feature storytelling. Browse the current primary references directly; record what you actually observed. Do not copy branding, wording, proprietary media or exact compositions.

“Better than Linktree” is the aspiration. Demonstrate it through clear owner tasks and better examples; do not claim comparative speed/conversion without measurement. A white hero, new accent colour, a renamed theme or a freshly captured old page is not sufficient evidence of a new direction.

## Prove a visual standard before multiplying it

Reconcile any existing direction studies. If they do not demonstrate meaningful composition differences, create a small set of genuinely different populated alternatives on the same homepage hero, editor state and customer-page header plus services. Compare hierarchy, type, image, useful first-screen content and main action at phone and desktop widths. Choose coherently and explain the tradeoff briefly.

Use the actual renderer and the content brief. Avoid placeholders, miniaturized unreadable UI, grey silhouette walls and unrelated generic stock photos. The first three flagship examples are detailing, barbering and vehicle dealerships. Design each around its customer task; extend the accepted system to the remaining supported capabilities and industries.

If the owner has requested a visual review stop in the current session, honor it with a concrete rendered package before further rollout. Otherwise continue through the agreed scope. Do not invent an approval requirement merely to avoid finishing work.

## Strengthen the existing theme and page engine

Preserve the separation between BusinessContent, PageDoc, industry suggestions, visual look, composition and widgets. Keep one renderer for editor preview, customer pages, examples and capture sources. Audit catalogue/looks/showcase mappings and derive counts and previews consistently.

Add finite schema-controlled composition choices only where the flagship brief proves they are needed. Keep versioned migrations and safe fallbacks. A theme must express hierarchy, image/header behavior, typography, widget density and surfaces—not just a background.

Fix theme application as a product interaction: preview the owner's actual content, make retention/reset of custom overrides understandable, preserve records and widget IDs/order, and support undo. Treat loading demo content as a separate isolated operation. Never seed example reviews, stock or services into an existing real business without an explicit operation intended to do that.

Test palettes on the real images, surfaces, overlays and interaction states. Keep readable defaults and explain corrective adjustments. Desktop customer pages retain identity, reading order and main action while deliberately adapting width and collections.

## Build useful, believable example businesses

Use `fixtures/businesses.json` as original editorial source material and adapt it through the real BusinessContent schema. It is not a runtime fixture to import blindly. Keep examples fictional, isolated and consistently identified. Dates and availability are deterministic demo state, not live demand. Use safe demo destinations and intercept outbound example actions.

An adapter and `fixtures/business-content-inputs.json` are now included, with six schema-valid inputs at the recorded baseline commit. Read fixtures/INTEGRATION.md and revalidate on current HEAD. Booking is deliberately disabled in those inputs; author isolated availability and actual PageDoc composition rather than pretending these content files are finished interactive demos.

Develop the Stillwater, After Hours and Forecourt briefs or equally strong justified alternatives. The detailing page needs package scope, honest from/quote pricing and enquiry; the barber needs service/provider/time logic; the dealer needs matching photos/specs and clear available/reserved/sold states. Do not route café menu items through appointment booking.

Commission or generate a coherent image set and store assets locally with provenance, meaningful filenames, alt text, dimensions and focal crops. The included Stillwater image is generated illustrative photography, not proof of an actual job or a specific vehicle for sale. Obtain matching multi-angle sets for inventory; never fabricate before/after evidence, real customer reviews or credentials.

Replace weak gallery compositions with these finished real-renderer examples. Default to phone previews. Make designs visible early and collapse secondary filters on phones. Design detail should show a useful interactive phone page before optional desktop and technical details. Every design remains usable across industries.

## Complete the widgets and overlays

Use the full registry as the inventory. Services, booking, team, products/affiliate, stock, gallery/media, reviews, enquiries, hours/location, social/contact, sharing and every other existing type need purposeful default/detail/edit states and their edge cases. Extend the existing `/workbench` rather than create a competing renderer.

Use compact summaries with essential information and clear detail. Avoid duplicate price/duration facts and generic card wrappers for every type. Keep selected service, eligible provider, duration, price and mode consistent through booking. Distinguish confirmed appointment, request and enquiry. Handle no slots, stale slot, unavailable provider, validation and retry without losing input. Do not fake production payment, publication, message delivery or account success.

Sheets/dialogs need coherent header/body/action hierarchy, readable scale, deliberate dismissal, focus return, background scroll lock, safe areas, software-keyboard behavior and nested carousel handling. Keep content scrollable. Test actual browser/device behavior; do not make every interaction a Dynamic Island or glass panel.

## Make setup and editing feel obvious

Owner loop: add/select content → edit its information → see it change → adjust presentation → reorder → return. Keep records connected to presentation without duplicate data entry. Use actual visual choices with current content where practical. Consolidate redundant controls; progressive disclosure should reduce work, not hide the next step.

On desktop keep a readable live preview and focused inspector. On phones use a predictable sheet/page relationship with reachable actions and retained selection. Reordering needs handles, insertion feedback, appropriate activation, scroll, cancel and Move up/down. Undo/redo, save errors, reload persistence and published/draft distinctions must remain trustworthy.

Setup should reveal a useful first page from the owner's real words, preserve progress and collect optional detail progressively. Adapt first content to the business. Show clear next/back actions, useful validation and readiness tasks. The incoming cover-photo step may help; evaluate its crop/fallback and whether it actually improves the first result. Do not build an unauthorized scraper or new auth stack to imitate a low-friction flow.

## Rebuild the connected marketing story

Use the homepage narrative, draft lines and feature illustration briefs in CREATIVE-BRIEF.md as a starting point; improve them against the actual product. Author a memorable hero, useful product interaction, distinct theme story, setup scene and sharing close. Vary composition intentionally. Keep navigation/footer, typography, spacing, imagery and tone part of one system.

Every feature page needs a relevant large visual or useful demonstration rather than only rewritten copy in the same old layout. Review product, design, services, booking, team, products, vehicles, gallery/reviews, messages, enquiries, sharing, pricing and how-it-works routes plus legal access. Keep commercial and capability claims tied to the existing sources of truth. Do not invent legal text, customer counts or conversion figures.

Produce original marketing assets from current UI. Complete editable film source, 16:9 website film, separately composed 9:16 and 4:5 cuts, posters and short feature loops. Use the campaign storyboards as concrete source material. Check full playback and readable UI at final display size. Existing 16:9 output alone does not complete social formats. No autoplay audio; provide static/reduced-motion alternatives.

## Tool use must have a deliverable

Motion, Base UI, dnd-kit, Radix Colors, capture scripts, Playwright and axe already exist in the baseline. Use them well. Assess the actual workbench before Storybook migration. Add Penpot only if a real maintained design canvas is accessible; use the browser workbench if it is not. Use DevTools tooling for missing trace/network investigation. Inspect the existing film project before selecting HyperFrames. Optional authored 3D must tell a specific story, load selectively and have a good static fallback. Do not add a second editor or animation system to demonstrate activity.

Record versions, license/cost implications and runtime versus authoring use for additions. Use the current official docs and actual installed APIs. Keep authoring dependencies and oversized assets out of the customer bundle.

## Finish with inspectable evidence

Complete the accepted owner→page→customer-action→share journey, then propagate the standard across the agreed catalogue and routes. Maintain the acceptance ledger. Each item needs actual artifact, version, viewport/state, result and remaining limitation. Do not mark a stage complete when its central visual work remains open.

Run appropriate existing build/type/lint/unit/browser checks. Verify migrations, theme/content preservation, preview/public parity, add/edit/hide/reorder/undo/save/reload, overlay behavior and QR/export consistency. Independently decode exported QR PNG/SVG to the expected actual destination. Distinguish lab performance from field Web Vitals, emulation from physical devices, and configured production providers from demo behavior.

Delivery should include rendered comparisons, finished assets, source locations, exact checks run and the still-open ledger. A passing build is necessary engineering evidence; it is not design approval. Do not hand back another long list of installed tools while the product examples and marketing remain visibly unfinished.
