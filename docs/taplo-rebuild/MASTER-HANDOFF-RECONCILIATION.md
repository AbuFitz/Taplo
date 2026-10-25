# Master handoff reconciliation, 25 October 2026

> Priority update: the owner subsequently instructed master engineering first, engine afterwards. See MASTER-IMPLEMENTATION-DIRECTION.md and MASTER-ENGINEERING-STATUS.md for current execution; the sequencing and preserved plan boundaries below describe the earlier intake audit.

Source: owner-supplied “TAPLO — Master Engineering, UI/UX, Motion & Legal Handoff Bible”, attachment 6048dc58-7208-4353-8281-58cc3b03572d. This maps its proposals to the actual repository at f3bcc55. It does not replace the owner's direct feedback, earlier constraints or the engine-first worklist. Proposed code and sales claims are reference material, not verified implementation.

## Material findings

- The supplied file has Parts 1 through 6 only. Part 1 says full legal copy is in Part 7, but no Part 7 or complete terms/privacy copy is present. No legal text can be treated as supplied or approved. The operator's legal name, address and company details remain missing. hello@mytaplo.com is the desired contact, not a verified connected mailbox.
- The production repository already has Product and Designs dropdowns. Radix NavigationMenu renders portalled content separately; empty-looking list markup in one crawl does not prove missing controls. Inspect the rendered and keyboard-operable menu.
- Empty dashboard already renders Welcome with setup and explicit fictional business demos. Do not silently create a fictional business in a new owner's draft or replace their saved content.
- Related design recommendations do have a real defect: they exclude the current industry, then take the first three catalogue entries. This pass replaces that with same-industry and adjacent-audience ranking, excludes self/hidden legacy designs, and preserves deterministic ordering. Existing legacy detail routes remain readable.
- No evidence establishes “highest-converting” industries. Treat the proposed commercial-first order as editorial preference, not measured conversion performance. Existing personal/portfolio/founder coverage must remain available, as the owner requested.
- The stated “five production components” are prototypes. They are not directly compatible with the engine's content, history, tier gates, overlay, device frame and scenario contracts.

## Actual implementation map

| Proposed area | Existing source | Required next work |
| --- | --- | --- |
| Desktop/mobile navigation | src/features/marketing/SiteNav.tsx; ia.ts | Review thumb reach, focus, safe areas and route changes before replacing the working Radix menu. A mobile dock must not cover page CTAs, cookie controls or customer-page actions. |
| Hero and business story | src/features/marketing/home/LiveStage.tsx; Scenes.tsx; WidgetOrbit.tsx | Integrate relevant actual blocks and purposeful interaction; preserve the real customer renderer/device frames. No fake reservation, synced payment or open-now state. |
| Motion | motion/react; MonoField.tsx; page/renderer/ShaderWallpaper.tsx | Reuse installed Motion and Paper. Autonomous backgrounds, reduced motion, paused offscreen work, touch/keyboard equivalence. Owner rejected pointer-following backgrounds. |
| Feature pages | src/app/product/[slug]/page.tsx; marketing/product.ts; ProductLead.tsx; ProductScenes.tsx; ProductArtwork.tsx | Replace repeated screenshots with route-specific live/simplified block scenes, one feature at a time, after engine controls are ready. Show useful demonstrations for every feature; avoid a generic fallback icon card for six routes. |
| Inspiration | src/features/inspiration/examples.ts; Gallery.tsx; DesignPreview.tsx; src/app/inspiration/[slug]/page.tsx | Relevant alternatives fixed in this pass. New composition content remains downstream of deeper engine work. Preserve current canonical and legacy scenario mappings; do not copy fabricated locations/credentials from the supplied list. |
| Onboarding | src/features/demo/Setup*.tsx; page/editor preview and overlay infrastructure | Retain category-specific paths, logo crop before save, real renderer, drafts, skip/back, plan choice and accessible popups. The proposed three-step component has no persistent business record or functional theme application. |
| Plans | src/features/subscriptions/plans.ts; entitlements.ts; marketing/PlanComparison.tsx; demo/SetupPlans.tsx | The file proposes a commercial change: Pro gets domains and three bookable people; Business becomes unlimited. This is not just correcting copy: update product decisions, entitlements, public renderer, eligibility, setup, owner controls and tests together if adopted. Current locked boundaries are preserved in this pass. |
| Legal and contextual outcomes | src/app/legal; src/features/demo; booking adapter | Consolidate repetitive marketing notices during page redesign, while retaining concise and honest explanations where a user publishes, pays, books, imports or invites. Legal text alone does not make an unavailable service available. |
| Plaque/media | marketing/PlaqueScene.tsx; marketing/film; public/marketing/film | The Shots/Spline table is a production brief, not delivered WebM/GLB files. Real QR must stay decodable; wallet and NFC interactions must be labelled illustrations until integration exists. No claims that passes, notifications or print products were generated by these prompts. |

## Prototype corrections before any reuse

1. Use installed `motion/react`, existing icons and class helpers; do not install a second Motion package for copied imports.
2. ScrollRevealStatement calls useTransform inside a map and disables the Rules of Hooks lint rule. Use a child Word component, stable hooks and readable reduced-motion/static rendering instead.
3. Desktop Product is hover-only in the proposed header and lacks complete expanded/controls/focus/outside-click handling. Mobile drawer lacks modal focus management and an accessible close workflow. Keep the accessible primitives.
4. The proposed mobile hero does not implement the promised swipe/flip; the desktop mask only overlays a gradient, rather than revealing a genuine alternate owner view.
5. The slug input is not carried into its CTA URL or saved draft. Do not pretend it claims an address.
6. Reserving a slot is currently just a local boolean. Hardcoded “Confirmed in Diary”, “Synced”, “Open Now”, “3 Slots Today”, clinician titles and wallet promises must not be presented as real outcomes.
7. Eight entries are supplied in the carousel code while its heading claims twelve. Source the actual catalogue, count actual entries, avoid multiple expensive live iframes unless visible, and use the shared phone/browser scaling system.
8. The onboarding prototype's chosen scenario never changes its preview or persists to the dashboard. Its three steps omit the requested logo/crop, contacts/social links, category-specific first content, profile, background and plan decisions. Do not replace working setup with it.
9. The document's all-dark/indigo-glass mandate differs from the owner's selective monochrome gradients, creative white sections, frameless surfaces and minimal explanatory copy. Apply those direct preferences first.

## Sequence retained

1. Continue actual block family/profile/editor functionality and remaining dashboard workflows; the previous engine/workspace verification lists these precisely.
2. Review each registration branch alongside the editor with mobile and desktop browser testing.
3. Rebuild varied dark/gradient/personal/business inspiration compositions using the finished engine.
4. Rebuild marketing and feature pages using the useful interaction ideas above, coherent content and actual demonstrations; refresh corresponding media.
5. Apply any adopted plan changes consistently, finish legal content when operator facts are available, then connect backend services in their separate project.

The repository is available locally. No change of GitHub visibility or public indexing is needed or implied by this handoff.
