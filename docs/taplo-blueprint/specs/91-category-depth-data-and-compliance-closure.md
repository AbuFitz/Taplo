# 91 · Category depth, data and compliance closure

Working edition 1.3 · 3 November 2026 · Honest coverage and concrete construction plan. Extends 62–76 and 84–90. A category label is not evidence of a completed specialist product.

## Coverage as it actually stands

Spec 62 provides deeper operating profiles for tutoring, mobile repair, retail and workshops; 71–72 add meaningful team/barber structures. Spec 73 maps wider capability applicability. These are useful written contracts, not exhaustive research or complete UI/engineering/legal definition for every business category. The matrix below identifies what each category must close rather than pretending icons or relabelled calendars finish it.

| Model | Required functional distinction | Required next depth |
| --- | --- | --- |
| Barber/beauty | Named/any professional, staff eligibility/time/price, chair/resource, employee versus independent seller | End-to-end appointment, processing gaps, walk-ins, staff absence, seller attribution and no-show scenarios |
| Tutor/coach | Payer/guardian/learner, recurrence, attendance, private joining/report access | Authority verification, term changes, missed lessons/credits and safeguarding/access review |
| Mobile repair/detailing/trades | Service address/coverage, travel, intake, assessment/quote, scope variation | Journey buffers, arrival windows, customer-supplied facts, parts/change approval and unfinished job payment |
| Retail/maker | Variant/location inventory, collection/delivery, line-level fulfilment/returns | Partial returns, defective/damaged stock, custom-made goods and stock race cases |
| Workshops/events | Dated capacity, attendee quantity, course versus occurrence, resources/waitlist | Transfers, host cancellation, queue allocation, mixed tickets and venue changes |
| Photographer/creative | Enquiry, scoped project, booking, staged payment, private deliverables | Rights/licences, revision/acceptance and secure gallery handover; not fully specified today |
| Consultant/professional | Confidential engagement, service scope and document/task access | Sector permissions/regulated boundaries; generic appointment engine is insufficient |
| Fitness/training | Individual/group bookings, package entitlement, instructor/resources | Health/support data purpose, eligibility, recurring attendance and membership rules |
| Vehicle seller | Unique unit listing, enquiry/viewing and reservation | Sale/deposit/finance/description obligations; no generic checkout assumption |
| Food/coffee | Menu, collection windows, preparation, allergen/perishable facts | Dedicated food information/fulfilment/legal review; reward page alone is not restaurant operations |
| Creator/personal brand | Links/media, eligible service/goods/digital offer and recurring benefit | Digital supply, licence/access/refunds and renewal scope; not all creator commerce is physical retail |
| Mixed business | Composed supported capabilities sharing identity and customer context | Clear stock/time/entitlement authority and navigation; one category never silently overrides another |
| Clinics/health-related providers | Confidential/sensitive information, regulated service boundaries | Separate specialist/legal/security assessment; general booking does not imply clinical record support |

This table is a completion obligation, not a commitment to launch all models at once. Unsupported transactions remain unavailable while appropriate identity/contact/enquiry functions may be useful. Owner must understand supported scope; no hidden disclaimer contradicting a public product claim.

## Feature specification minimum

For every category-enabled function document actor/role, prerequisite setup, exact data authority, default and override rules, customer selection, commitment, daily work, change/cancel, money/time/stock effects, communication, support, retention/exit, mobile/desktop/theme composition and acceptance cases. Include every visible action's purpose, disabled/loading/error/success state, permission and next destination. The goal is usable connected workflows, not hundreds of disconnected button descriptions.

## Data architecture direction

Recommend a relational transactional store as the authority for tenants, memberships, offers, commitments, permissions and monetary allocations; object storage for processed assets/documents; explicit queued jobs/outbox for provider side effects; rebuildable search/analytics projections. This is an architecture recommendation, not a selected supplier or a claim that a deployment already provides guarantees.

Separate public merchant facts, private customer relationships, sensitive restricted fields, payment-provider tokens, authored appearance revisions and analytics. Do not duplicate full customer/payment records into page JSON to simplify rendering. Page blocks reference authorised published offer projections. Server enforces tenant/action/field rules and financial/availability invariants. Cache keys and invalidation include tenant and scope; personal results cannot enter public CDN caches.

Data decision register must name actual supplier/region, lawful purpose, controller/processor relationship, encryption/key model, backup and restore, retention, deletion/exports, subprocessors, incident owner, availability/cost limits and exit method. Providers in 84 remain evaluated integrations until their contracts/configurations are verified. Exact SQL engine/hosting, auth, queue and asset suppliers are still open; do not smuggle a choice into a component recommendation.

## Compliance as enforced product behaviour

| Area | Product/operating artefact | Closure evidence |
| --- | --- | --- |
| Consumer seller/terms/price/cancellation | Actual seller, agreement snapshot, rights-aware policies and refund flow | Jurisdiction/category-specific qualified review and verified UI behaviour |
| Payments/card security | Provider account/funds flow, permitted methods, authority, financial access | Provider agreement/configuration, applicable PCI scope and failure rehearsal |
| Privacy/marketing/tracking | Purpose/role inventory, DPA, consent/suppression, retention/rights/incident flows | Actual notices/contracts, data map and exercised requests/incidents |
| Staff/independent sellers | Membership/field grants, seller/customer ownership, offboarding | Reviewed relationship model and permission tests |
| Children/sensitive categories | Participant authority, minimum fields, restricted access | Applicability assessment and safeguarding/security/legal review |
| Content/reviews/safety | Moderation/report/appeal and review integrity | Applicable assessment and accountable operating process |
| Tax/platform reporting | Seller due diligence, invoices/exports/reporting where required | Accountant-led applicability and reporting design |
| Hardware/domains/Wallet | Separate issuer/registrant/seller obligations, lifecycle and exit | Supplier terms, conformity/brand/device evidence and customer disclosures |
| Accessibility/IP/fonts/icons | Component/interaction checks and asset provenance/notices | Actual audits, valid licences and retained notices |
| Reliability/security | Authorisation, threat model, recovery, backups, provider incidents | Meaningful tests, restore exercise and accountable runbooks |

This is traceability, not legal clearance. Existing specs 74–76 and LEGAL-REVIEW-BRIEF retain the detailed applicability questions. Do not declare compliant simply because these rows exist; each needs an owner, decision/version, enforced control, verification and review date.

## Avoiding a superficial product

Consistency comes from shared meanings, clean hierarchy, truthful status, correct records and recovery—not avoiding a particular coding tool. A polished empty state cannot compensate for a broken refund, and a secure backend does not excuse a confusing Studio. Review both connected task completion and visual quality. Research reduces avoidable errors; real tasks and provider/device tests still determine whether the design works.
