# Studio rebuild · 6 November 2026

## Authority and scope

Founder explicitly rejected the existing Studio as a design reference and authorised rebuilding its architecture, layout, section pages, guidance and support on `claude/modest-cerf-4tont1`. This supersedes assumptions that the previous navigation or page compositions were final. P02 is the principal packet; P03/P07 task projections are used where actual records already exist. This document records design construction and runtime evidence; it does not establish production payment, team authentication, communications or support delivery readiness.

The rebuilt shell no longer imports `workspace.css`, `workspace-polish.css`, `workspace-foundation.css`, `workspace-tools.css` `studio-shell.css`, `studio-today.css` or the accumulated `portal-workspace.css`. Those historical files remain for reference and other consumers, but do not define this Studio. `studio-design.css` loads the new scoped modules under `src/features/studio/styles/` in explicit cascade order. `operational.css` now contains only theme/form/accessibility primitives, with the old composition rules removed. Canonical records, validation, conflict handling, publication gates and saved-design adapters remain functional dependencies. A form field is retained because the task requires it, not because its previous presentation is protected.

## Current research and interpretation

Primary sources reviewed on 6 November 2026:

- [Linear, March 2026 interface refresh](https://linear.app/now/behind-the-latest-design-refresh): consistent location/view headers, quieter navigation, reduced redundant icon treatments and deliberate visual weight. Official before/after sidebar image inspected. Adopt predictable frame and restrained navigation weight; do not reproduce Linear's development-tool density or hide business tasks behind symbols.
- [Linear, interface redesign process](https://linear.app/now/how-we-redesigned-the-linear-ui): test the architecture across major views and define shared component behaviour. Adopt a route matrix rather than judging one attractive dashboard.
- [Shopify, app home and onboarding](https://shopify.dev/docs/apps/design/user-experience/app-home-page): daily value, immediate work, clear actions, brief setup and consistently discoverable support. Adopt real daily work and derived readiness; do not invent activity/revenue.
- [Framer interface, updated October 2026](https://www.framer.com/academy/lessons/framer-interface): stable workspace views, selection-driven editing, preview/publish distinction. Adopt persistent Studio context and canvas-width composition; Taplo still uses its own block-based mini-page model.
- [Notion workspace search](https://www.notion.com/en-gb/help/search): search as both finding content and jumping to a section, with keyboard access. Adopt Ctrl/Cmd+K and real offer/destination results; do not suggest a cross-business search or AI answer capability.
- [NN/g, contextual help](https://www.nngroup.com/articles/onboarding-tutorials/): task-relevant help is easier to use than a detached tutorial. Adopt short selectable steps, clear outcomes and direct task actions. No autoplay or obligatory tour.

These are design inputs. Taplo's precise composition and density are implementation decisions to verify in its own rendered screens. Desk research is not observed customer usability evidence.

## Interaction architecture

| Layer | Purpose | Behaviour |
| --- | --- | --- |
| Workspace frame | Business identity and stable destinations | Desktop sidebar; phone task dock and labelled directory; remains present while editing a page. No invented initials. |
| Location bar | Where am I, find something, get help | Current section, search, contextual Help. Search opens a focus-managed dialog; results navigate to real records/editors or open contact/hours quick edits in place. |
| Page heading | What can I do here | One title, short purpose, one principal action, optional compact guide. No duplicated promotional artwork or setup banner. |
| Work canvas | Complete the task | Four compositions: daily work; searchable/filterable records; measured form; focused settings/detail. Preview exists where it helps authoring. |
| Guidance | Understand the next useful step | Saved-record completion; choose a step; act or close. Watching help never marks work complete. |
| Support | Recover and return to work | Searchable guides, common fixes, in-place contact/hours edits, report form with optional diagnostics. Report delivery retains its actual success/failure boundary. |

## Route and state map

| Screen | Rebuilt composition | Real actions and states |
| --- | --- | --- |
| `studio.today` | Date, work summary, agenda/catalogue, first offer, compact page snapshot, quick changes | Derived current/upcoming/pending work, contact/hours modal, saved/conflict/retry behaviour, empty work, page readiness. |
| `studio.offer_list` | Unified list, type tabs, archive view, query, add menu | Real service/product records; existing editor deep links; archived/example/plan-hidden/stock status; no matches/empty. No simulated live publication. |
| `studio.service_editor` | Essentials → customer next step → optional presentation | Existing name/price/duration/booking/link validation and saved records; disclosures expose link errors. |
| `studio.product_editor` | Essentials → visible customer action → optional details | Product/vehicle type, price, imagery, enquiry/link, facts and stock state. Native checkout remains a separate unclosed engineering packet. |
| `studio.calendar` | Shared heading, section tabs, calendar view controls, actual schedule | Calendar/enquiries/availability, existing time-zone, assignment, blocked-time and detail behaviour. No invented appointments. |
| `studio.team` | Searchable profile grid, identity and work assignment | Actual public profile records/hours; neutral person glyph if no photo. Actual scoped login/invite/role service remains P07 work. |
| Reviews | Source form with linked state and page placement guidance | Validated Google link, external source destination, plan boundary. No manually fabricated Google rating. |
| Analytics | Clear empty measures and customer-action explanation | No fabricated chart or revenue. Plan access stays enforced. Collection/reporting pipeline remains separate work. |
| `studio.settings` | General, plan, connections, data | Appearance; in-place contact/hours; identity/team links; plan intent; actual JSON download; guarded reset. Connections never pretend to connect. |
| `studio.help` | Question-led answers, quick changes, searchable guide library, human route | Relevant guide deep link, step selection, real task destination, retained report form failure/recovery. |
| `studio.page_editor` | Authoring inside the shared frame | Composition follows actual available width using ResizeObserver. Existing content/appearance controls and customer preview stay connected. The initial composition is measured before an editor mounts, preserving task deep links across hydration. Phone dock remains available; keyboard state protects editing space. |

## Visual construction

- Warm neutral workspace, white/light or dark surfaces, ink-first actions, restrained cobalt orientation. Customer chosen themes are separate.
- Inter operational text; Manrope section hierarchy; Bricolage Grotesque display titles connect Studio to the marketing identity. The founder’s new rebuild instruction supersedes treating the earlier title-font recommendation as visually final. Existing semantic Phosphor Studio adapter and established Lucide form/search glyphs; no new icon dependency.
- Page titles have clear hierarchy, record rows have deliberate density, borders separate relationships rather than wrap every sentence.
- Real product imagery uses a restrained thumbnail; absent images use a neutral content-type glyph. No inferred logo or initials.
- Phone composition is authored separately: stacked offer metadata, scrollable type tabs, compact context bar, persistent dock, readable form inputs, safe-area-aware actions. Desktop does not dictate a shrunk phone layout.
- Support and task overlays use the shared accessible Dialog foundation with visible title/close, focus restoration, dirty-state protection and recovery.
- No entrance fade on task pages, no autonomous tutorial animation, reduced-motion support.

## Verification and limits

Required for this pass: build, typecheck, targeted lint, connected offer/search/help/settings actions, screenshots of every existing Studio route at 1440 and 390 in light/dark plus 320 light, overflow checks and meaningful axe audits. Evidence is recorded after actual execution, not inferred from authored CSS.

Remaining product work is not hidden by the design: canonical remote writes for all records, payment/checkout, scoped team logins, integrated messaging/Wallet/domains, full analytics, Console workflows and provider delivery. Existing package code also differs from the saved 3.0 commercial defaults; this visual rebuild does not silently select a new pricing contract. Complete that reconciliation in the commercial packet.

### First rendered review

The first CI captures exposed an excessively tall zero-work Today state and a label/content accessible-name mismatch on the miniature preview. Today now omits zero-work metrics, puts quick changes in the work column, and offers an expandable design snapshot on phones. The miniature is a static snapshot with explicit actions beneath it. A mobile navigation assertion also needed to wait for the closing dialog before choosing the new page’s appearance control. These were addressed from the actual capture/error evidence. The initial captures did not complete the whole route matrix because the first accessibility assertion stopped each matrix case.

Local build/typecheck and 41 focused record/quick-edit model tests passed before the visual run. Final route/appearance/accessibility results will be recorded after the corrected run. No production deployment, provider configuration or end-user research occurred in this design pass.

### Second rendered review and final corrections

Run [42212719094](https://github.com/AbuFitz/Taplo/actions/runs/42212719094) produced all 55 route screenshots: 11 routes at desktop light/dark and 390px light/dark, plus 320px light. A contact sheet of desktop offers/help/settings/editor, phone Today/offers/help/editor and phone dark calendar/team/settings/editor was inspected. The phone matrices and connected search/offer/help/menu/quick-edit cases passed in that run. Desktop audits identified a location-label selector applying opacity to Studio text and a search visible-label/accessibility-name mismatch. Explicit divider styling and matching “Search Studio” wording correct those defects.

The rendered dark phone editor also exposed hardcoded light-mode labels in its inherited anatomy stylesheet. That stylesheet has been replaced with operational theme tokens; the empty workspace no longer loads a broad historical stylesheet. The preview resize limit now uses the actual editor container height, keeping room for fields and publication controls below the shared navigation. Added focused editor-label audits, maximum-preview body-space verification and a first-run/sample/navigation journey.

Before these final corrections, CI passed typecheck, lint, unit tests, production build and the database-backed workspace draft/conflict/retry journey. Some wider browser suites failed and require reconciliation; they are not recorded as passed. The coding environment disconnected during the final edit pass. Final corrections were preserved through GitHub; subsequent CI results must be checked before calling the rebuild verified. No claim of product-wide or production readiness is made.
