# Taplo · Full blueprint review and closure plan

Working edition 2.7 · 3 November 2026. Review scope: inventory and cross-document consistency across the whole supplied blueprint, with targeted detailed review of current packages/economics, identity, app/repo/domain decisions, rewards/Wallet/scanning, category/team rules, payments, legal controls and visual handoff. The review does not claim every sentence has received independent specialist validation or every feature has a final screen/API. No production implementation is authorised by this document task.

## Verdict

The product direction is coherent: a compact branded mini-space, useful customer return view, capability-adapted Studio and controlled Console sharing one operational engine. Discovery supports this; it is not the sole reason to use Taplo. It is a substantial blueprint with uneven implementation readiness. Research, decisions, visual specimens, exact contracts and actual proof must remain distinct.

All four plans are intended at launch. That means all four need real supported functionality at launch, not that every possible category or distant integration is ready. General pages/presence may serve a wider group than operational checkout. Category search can recognise unsupported categories without activating unreviewed transactions.

## Review findings and corrective decisions

| ID | Finding | Action / current result |
| --- | --- | --- |
| R01 | Older payment integrity spec still said responsibility undecided | Corrected spec 16 to point to current direct-charge decision; actual legal/provider configuration stays unverified |
| R02 | Three pricing links in numbered specs used wrong relative paths | Corrected to ../PRICING-DECISION.md; whole-document Markdown target check added |
| R03 | Launch cash budget had no distinct media usage reserve despite gallery/files | Added £10/month reserve, plus existing 20% cushion; £217.55 becomes £229.55/month; no plan-price change |
| R04 | Feature comparison had broad family names but no complete selected display-row mapping | Added package-feature-map.json and full founder feature readout; still a documentary catalogue, not runtime enforcement |
| R05 | Wallet testing described at a high level only | Added 22-case native device pack, pairings/prerequisites, fixtures/evidence and honest blocked status |
| R06 | Old price experiments/rollout language persists in historical sections | Current PRICING-DECISION plus proposed-packages and feature map govern; history stays labelled superseded, never copied into new marketing/billing |
| R07 | All categories were easy to mistake for equally finished | Explicit support tier/depth matrix below; no invented all-categories-ready assertion |
| R08 | £218 could be mistaken for whole-company operating cost | Revised cash budget labelled early platform envelope; paid usage, labour/build, acquisition, insurance and specialist extras separate |
| R09 | Package count, support work and provider account structure could imply readiness | Launch gates attached to capability, legal control and actual evidence, not plan title or page count |

## Domain review and remaining work

| Area | Written position | Material remaining closure |
| --- | --- | --- |
| Product/identity | One mini-space from direct links/Explore/Saved; private return utility | Real task evidence for why owners adopt and customers return |
| Marketing/SEO | Main-site solutions, public metadata/cards, merchant/Search Console authority | Actual keyword/intent study, finished layouts/copy/assets, index/schema tests, no traffic guarantee |
| Onboarding/guidance | Recognisable draft, account at end, first offer in Studio, contextual quick setup | Every state/device/keyboard/permission composition and shared-editor contracts; actual novice observation |
| Public page/theme | Blocks/sideways rails/neutral readable popups; brand inheritance, 3 appearance families | Finished block specimen catalogue, exact tokens/contrast fallbacks, all identity shapes and provider/card rendering |
| Explore/customer return | Map/list, manual location, saved businesses, For you and browser parity | Exact ranking/search/freshness/abuse rules, final map states, deep-link/privacy/guest fixture proof |
| Studio/calendar/team | Task-first role-scoped workspace; no per-seat fee; category presets | Final screens, all required scoped commands/field masks/resources/recurrence travel/absence cases |
| Commerce/booking/classes | Separate stock/time/capacity holds and durable accepted agreements | Exact composite command/error/event/schema fixtures, real concurrent last-slot/last-stock evidence |
| Payments/deposits/refunds | Merchant direct Stripe Connect, configurable supported deposits, separate SaaS billing | Actual loss/controller configuration, cancellation legal scope, webhook/outcome/partial-refund reconciliation; no automatic always-keep-deposit rule |
| Rewards/Wallet/scanner | Presets, ledger authority, staff-confirmed scan, public-card separation | Exact provider payloads/commands/challenge policy, real issue/update/offboarding/concurrency/device results |
| Identity/privacy | Apple/Google/email code, person vs membership, staff invite and assurance gates | Pinned auth implementation, every method MFA/step-up test, relay/linking/recovery/deletion/tenant boundaries |
| Communications | Operational email included; scoped campaigns/consent/roles/segment balance | Provider-approved account/streams, template rendering/email clients, dispatch suppression/reconciliation evidence |
| Domains/NFC | Connect existing domains; later controlled registrar purchase and hardware | Actual registrar contract/ownership/renewal, hostname lifecycle, phone tag compatibility and product obligations |
| Console/support/trust | Cases, financial authority, reviews/report/appeal, escalation | Staffed rota and operating budget, actual moderation/recovery tools, detection tuning, incident/complaint drills |
| Apps/widgets/release | Two native apps, monorepo, web Console, scoped widgets and SKU policy matrix | Real signed builds/deep links/deletion/privacy declarations/store review, exact OS-version support and device results |
| Data/security/reliability | Server-owned transactional engine, tenant isolation, outbox, recovery boundaries | Consolidated migrations/contracts, retention/provider inventory, threat model, real restore/load/security drill |
| Legal/tax | Ten blocked drafts, 28 mapped control areas, UK-first working scope | Actual entity/data-role/tax/retention/subprocessor schedules and competent review; implementation/operating evidence |
| Pricing/economics | £0/12/24/49, no seat fee/commission, optional SMS; reproducible assumptions | Supplier account fit, real load/support/churn/conversion, actual tax/invoices/credits and demand evidence |

## Category readiness, without hiding the gaps

| Category cluster | Existing depth | Still distinct before operational release |
| --- | --- | --- |
| Tutors/coaches | Deeper reference profile + team, guardian/participant, recurrence/attendance | Exact guardian proof/field scopes, credits vs subscriptions, child/remote-delivery/store-policy legal and UI validation |
| Mobile repair/detailing/trades | Deeper reference profile + dispatch/team/quote/coverage | Exact travel-buffer/arrival/variation/compatibility/unsafe-job cases; no unbuilt route-optimisation claim |
| Retail/makers | Deeper stock/variant/fulfilment/return reference profile | Actual stock reservation/partial return/tax/fulfilment group and local stock contracts/tests |
| Workshops/classes | Deeper capacity/resource/waitlist/attendee profile | Exact series/course/waitlist fairness, partial attendance/refund/cancellation fixtures |
| Barbers/beauty | Stronger team/public-profile adaptations and scheduling/reward patterns | Full processing/resource/named-worker/substitution/absence and offer editor/detail states |
| Photographers/creatives | Operating/team/quote milestones mapped | Complete deliverable/licence/gallery/access/change-order lifecycle; no implied file-storage unlimitedness |
| Fitness/consulting/creators | Capability adaptations mapped | Membership/digital licence/credit/replay, confidentiality and exact store/SKU-specific handling |
| Vehicle dealers | Unique unit/viewing/team mapping | Reservation/deposit/sale/finance boundaries and specialist trader rules; listing alone is not transaction readiness |
| Food/coffee | Menu/preparation/collection/team mapping | Allergen/product-information/time/perishability/fulfilment rules and specialist review |
| Clinics/health | Restricted scheduling boundary | Sensitive data/professional/consent/clinical scope requires specialist construction; not a generic notes feature |
| Mixed or missing category | Capability resolver/preset composition | Unsupported capability clearly explained; category change cannot grant access or rewrite existing work |

## Build-ready feature packet required everywhere

One versioned feature ID → outcome/entry points → exact record source and fields → allowed actor/action/scope/field projection → validation → state transition/command/input/error/event → actual view/states/accessibility/motion → metering/plan/dependency → failure/recovery/offboarding → source/applicability/legal gate → reproducible acceptance fixtures → actual evidence. Configuration flags alone do not complete that chain. An agent must surface unresolved inputs instead of inventing them.

The new feature map closes the plan-display link only. It does not claim all existing record/permission/command JSONs now agree; schema reconciliation remains priority. Older broad commercial models and historical price experiments are research, not a second current billing authority. No old customer agreement changes merely because the blueprint changes.

## Concrete next closure sequence

1. Pin one connected pilot profile (maker/workshop default) and all four actual supported plan scopes; preserve wider category requirements without pretending equal readiness.
2. Close exact contracts/screens for draft → first offer → team availability/stock → customer booking/order → optional deposit → notification → private return → cancellation/refund → reward earn/redeem → Console recovery.
3. Rehearse idempotency, concurrency, tenant/field/privacy and restore/provider unknown outcomes in the actual implementation; then native Wallet/device pack and actual email clients.
4. Complete entity/provider/category/legal schedules and professional/security review; operational owners/rotas, incident/recovery/support/merchant exit.
5. Observe representative first-time owners/customers, measure task success, cost and commercial choices; fix actual confusion rather than claiming 99.99999% certainty from planning.

No fixed completion percentage is assigned. A quality gate is exact evidence per supported slice, not the number of chapters. Check contracts/blueprint-review-inventory.json for a content inventory and documentary link checks, not a legal/design/runtime pass certificate.

## Deepened closure work · 2.8

EXPLORE-MAP-PROVIDER-DESIGN-AND-COST chooses Mapbox custom styling and separates display/location lookup/storage/own merchant search. LEAN-LAUNCH-SPENDING-AND-SECURITY corrects mandatory-cost impressions: previous £4,374.20 upfront is an optional funded scenario; no new phone/NFC Wallet hardware purchase is assumed. Supplier anchors approximately £121.29 plus reserves/cushion yield the previous £229.55 early envelope; actual invoice may differ.

TRANSACTION-FEE-OPTIONS-AND-CHANGE-POLICY retains 0% current commission and models alternatives with fair prospective change/accepted-work protection. Merchant terms remain blocked legal draft, now including a price-change schedule requirement. LOW-FRICTION-SETUP-AND-SUPPORT-CONTRACT operationalises in-context setup/diagnostics. VISUAL-STATE-CLOSURE-2.8 inventories 67 important screen families and selected four visual reference scenes. WORKING-HOURS-EXACT-CONTRACT closes the simple editor's typed shape/impact/apply boundary, with legacy migration explicitly scoped; not all APIs or DB migrations are complete. CATEGORY-CLOSURE-PROFILES deepens six further category groups. INTEGRATION-AND-OPERATING-EVIDENCE-PACK prepares actual rehearsals/operating schedules/customer studies; no unperformed result is marked passed.
