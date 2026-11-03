# Research expansion · 31 October 2026

Edition 1.0. Focused primary-source desk research, not observed user sessions or complete legal/provider due diligence. References R1–R34 apply to this edition; earlier sources remain in RESEARCH-SOURCES.md. Findings below are concise paraphrases; Taplo recommendations are separately labelled in specifications. Sources were retrieved or search-retrieved in this session; R29 records a retrieval limitation. Recheck current capability, plan, geography, API and legal commencement when implementing.

## R1 · TutorCruncher · client lesson booking

https://help.tutorcruncher.com/en/articles/14184477-clients-booking-lessons-tutors

Separates client booking from attached student participation and shows booked lessons in the client calendar. Supports payer/participant modelling; does not establish Taplo policy.

## R2 · TutorCruncher · cancellation

https://help.tutorcruncher.com/en/articles/14183040-cancelling-lessons

Distinguishes cancellation, chargeability and seat release. Supports an explicit cancellation-impact design rather than a single universal cancel action.

## R3 · Bookwhen · waiting lists

https://support.bookwhen.com/en/articles/753351-waiting-lists

Documents sequential timed offers and capacity handling. Reveals that waitlist promotion needs rules about quantity, expiry and public availability; no Taplo default is proved optimal.

## R4 · Shopify · inventory states

https://help.shopify.com/en/manual/inventory-and-locations/fundamentals/inventory-states

Distinguishes on-hand, available, committed, unavailable and incoming stock. Taplo adopts its own explicit balance/hold invariants rather than treating stock as a decorative product field.

## R5 · GOV.UK · online selling

https://www.gov.uk/online-and-distance-selling-for-businesses/online-selling

Identifies pre-order information, correction/optional-extra requirements and durable confirmation. Does not supply a universal category cancellation policy.

## R6 · Stripe · Connect charge types

https://docs.stripe.com/connect/charges

Explains charge-type funds flow, fee/refund/dispute debits and suitable platform patterns. Current direct-charge guidance also distinguishes supported account configurations. Technical suitability is not legal perimeter approval.

## R7 · Stripe · webhooks

https://docs.stripe.com/webhooks

Documents signature verification, duplicate deliveries, asynchronous handling and non-guaranteed ordering. Supports durable intake, deduplication and authoritative reconciliation rather than optimistic success from a browser redirect.

## R8 · Stripe · idempotency

https://docs.stripe.com/api/idempotent_requests

Explains safe retry keys and differences between API v1/v2 behaviours. Taplo must persist its own business-operation identity rather than assume every provider caches keys indefinitely.

## R9 · ICO · services covered by Children’s Code

https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/services-covered-by-this-code/

Scope can include services likely to be accessed by children, not just child-targeted services. An adult payer alone does not establish exemption; actual service assessment remains required.

## R10 · W3C · WCAG 2.2

https://www.w3.org/TR/WCAG22/

Provides testable accessibility criteria. Used as a design/testing reference; token examples and local no-overflow checks do not certify conformance.

## R11 · OWASP · authorisation

https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html

Recommends least privilege, deny-by-default and per-request checks, with relationship/attribute-aware controls. Role labels and hidden buttons alone are insufficient.

## R12 · Fresha · professional profile

https://www.fresha.com/help-center/academy/get-booked-online/create-your-professional-profile/lessons/100343

Describes a shareable professional profile with photos, bio, reviews and booking, connected to workplaces. Establishes an existing comparable workflow, not unique differentiation or Taplo portability rights.

## R13 · Square UK · bookable staff

https://squareup.com/help/gb/en/article/5350-create-staff-member-profiles-for-square-appointments

Distinguishes service-provider/front-desk/manager calendar access, customer-facing staff facts and service assignments. Future appointments must be resolved when removing staff.

## R14 · Fresha · permission roles

https://www.fresha.com/help-center/knowledge-base/team/100687-create-permission-roles

Documents own/all-calendar access and separate sales, client visibility, reports, team, catalogue, online profile, marketing, payment and workspace areas. Supports granular permission design, not copying every default.

## R15 · Square UK · staff schedules

https://squareup.com/help/gb/en/article/8443-manage-staff-schedules-and-availability-with-square-appointments

Documents recurring schedule versus one-time availability changes, locations and side-by-side team calendars. A calendar view and permission to modify team availability are distinct.

## R16 · Fresha · team onboarding

https://www.fresha.com/help-center/knowledge-base/team/276-add-team-members-to-your-workspace

Documents invitation, locations/services, no-access profiles, bookability and offboarding. Its current account/workspace constraints are product-specific; Taplo multi-membership is an explicit proposal, not attributed to Fresha.

## R17 · TutorCruncher · report visibility

https://help.tutorcruncher.com/en/articles/14183056-editing-which-users-have-access-to-reports

Documents separate report-visibility choices, including tutor access to other tutors’ reports. Reinforces field/purpose-level boundaries beyond general calendar access.

## R18 · Shopify · custom role examples

https://help.shopify.com/en/manual/your-account/users/roles/role-examples

Gives work-based permission examples such as inventory work without financial/customer settings. Supports task-oriented role presets and explicit sensitive permissions.

## R19 · Bookwhen · leaders

https://support.bookwhen.com/en/articles/4722971-leaders

Documents instructor/leader assignment and restricted access. Useful category-specific comparison; does not establish that Taplo instructors need the same notification restrictions.

## R20 · Google Calendar · incremental sync

https://developers.google.com/workspace/calendar/api/guides/sync

Documents sync-token persistence, pagination, deleted entries and reset/full-sync recovery. Supports an explicit sync lifecycle; does not mean two-way booking cancellation is safe.

## R21 · HMRC · digital platform operator scope

https://www.gov.uk/guidance/check-if-you-need-to-register-as-a-digital-platform-operator

Explains platform tests and narrower software-only exclusions. Native commerce/discovery requires an applicability assessment rather than an assumption that page-builder exclusion covers everything.

## R22 · FCA · payment services perimeter

https://www.fca.org.uk/firms/consider-if-you-provide-payment-services

Flags marketplaces/booking businesses receiving customer money and conditional exclusions. Assessment depends on actual funds flow; it is not a conclusion that Taplo definitely needs authorisation.

## R23 · ICO · controller/processor contract contents

https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/what-needs-to-be-included-in-the-contract/

Sets contract considerations for controller–processor processing. Role allocation must follow actual purposes/means, with appropriate instructions, security, assistance and end-of-contract treatment.

## R24 · CMA · fair customer contracts

https://www.gov.uk/guidance/writing-a-fair-contract-for-customers

Explains fairness concerns around deposits/cancellation and actual losses. A generic non-refundable default is not a substitute for reviewing the applicable service/policy.

## R25 · CMA · publishing consumer reviews

https://www.gov.uk/government/publications/fake-reviews/short-guide-for-businesses-publishing-consumer-reviews-and-complying-with-consumer-protection-law

Addresses review publishers and misleading/fake review information. Taplo needs authenticity/moderation/reporting processes, not just review-star widgets.

## R26 · ICO · electronic-mail marketing

https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/how-do-we-comply-with-the-pecr-electronic-mail-marketing-rules/

Distinguishes consent and conditional soft-opt-in routes. Supports purpose/channel/contact-specific evidence and suppression; does not imply a purchase permits unlimited platform/merchant marketing.

## R27 · DBT · subscription implementation consultation response

https://www.gov.uk/government/consultations/consultation-on-the-implementation-of-the-new-subscription-contracts-regime/outcome/government-response-to-consultation-on-the-implementation-of-the-new-subscription-contracts-regime-web-accessible-version

Includes an anticipated spring 2027 commencement. This is an implementation-policy statement, not sufficient evidence of enacted commencement at release.

## R28 · GOV.UK · subscription contracts guidance

https://www.gov.uk/government/publications/subscription-contracts

October 2026 publication points to B2C subscription guidance and regulations. The landing page alone does not resolve exact enacted commencement/transitional applicability.

## R29 · Draft consumer subscription regulations

https://www.legislation.gov.uk/ukdsi/2026/9780348287912/data.htm?view=plain

Search retrieval exposed a draft statutory instrument with a prospective January 2027 date; full open retrieval failed. Treat draft status/date as unresolved evidence, not enacted law. Qualified release review must resolve the current legal position.

## R30 · GOV.UK · manufactured products in GB

https://www.gov.uk/guidance/placing-manufactured-goods-on-the-market-in-great-britain

Outlines relevant product/supply-chain responsibilities. Actual NFC product construction, role and applicable conformity regime need supplier/specialist confirmation; no blanket CE/UKCA claim is made.

## R31 · Ofcom · regulation checker

https://www.ofcom.org.uk/os-toolkit/regulation-checker/regulation-checker

Explains service-scope factors including user content and messaging/reviews, with an indicative assessment tool. Assess actual Taplo features and exemptions; internal business search is not automatically a regulated general search service.

## R32 · IPO · trade-mark search

https://www.gov.uk/search-for-trademark

Provides a route for trade-mark research. A domain purchase or working product name is not trade-mark clearance; no Taplo clearance search was performed in this edition.

## R33 · Microsoft Bookings · availability and buffers

https://learn.microsoft.com/en-us/microsoft-365/bookings/configure-service-availability?view=o365-worldwide

Documents staff/service availability and setup/cleanup/travel buffer effects. Supports checking operational time beyond visible appointment duration; it does not validate an optimised travel-routing engine.

## What this research does not establish

No independent usability result, proven switching demand, final plan economics, final legal applicability, brand clearance or implemented integration is claimed. The four operating profiles have greater depth than the additional category applicability map. The coverage audit keeps those differences visible.

## R34 · DBT October 2026 draft subscription guidance PDF

https://assets.publishing.service.gov.uk/media/6acf97da2de3184ccf8b814e/subscription-contracts-rules-guidance.pdf

The linked October PDF explicitly describes draft regulations subject to parliamentary approval and says the new regime is not yet in force, while describing a prospective 1 January 2027 application. This clarifies the landing page's status; it is not proof the prospective date has been enacted. Recheck made regulations/commencement for release.

## Continuation research · 3 November 2026

R35–R39 support specs 77–78. They were checked for this continuation; the preceding source ledger retains its earlier research date.

### R35 · Google Business Profile API setup

https://developers.google.com/my-business/content/basic-setup

Documents project approval and API setup. A public profile link alone is not an authorised account connection.

### R36 · Google Business Profile OAuth

https://developers.google.com/my-business/content/implement-oauth

Documents user authorisation for accessing/managing location data. Authentication does not grant unrestricted reuse rights.

### R37 · Google Business Profile API policies

https://developers.google.com/my-business/content/policies

Restricts permitted purpose and content storage. Owner-authorised Google access must not be represented as a general permanent profile-copy licence; assess the intended integration before enabling it.

### R38 · Places API policies

https://developers.google.com/maps/documentation/places/web-service/policies

Sets content caching/storage and display/attribution requirements. Public lookup is distinct from merchant-authorised account access and is not an unrestricted Taplo profile-data source.

### R39 · OWASP SSRF prevention

https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html

Provides security guidance relevant to accepting website URLs. Import fetching needs network/redirect validation and bounded processing, not a generic server fetch against arbitrary destinations.

## R40 · Pexels API documentation

https://www.pexels.com/api/documentation/

Checked 3 November 2026. Documents photo/video search and provider/photographer attribution guidelines. General documentation discussing increased limits must be read with the newer help notice below.

## R41 · Pexels request-limit status

https://help.pexels.com/hc/en-us/articles/900005852323-How-do-I-get-unlimited-requests

Checked 3 November 2026; page updated 2 November states rate-limit increases are paused. It also describes integration eligibility/credit requirements. Do not assume an unrestricted free-scale agreement.

## R42 · Unsplash API guidelines

https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines

Checked 3 November 2026. Requires provider image hotlinks, attribution and selected-use download tracking; also restricts competing/automated uses. Suitable for evaluation as a supporting picker, not a blanket rehosting licence.

## Research continuation · 3 November 2026 · R43–R55

These are focused primary-source checks, not full competitive audits. Recommendations in 81–86 are Taplo design proposals; source statements do not establish market demand or legal clearance.

### R43 · Stripe Connect risk allocation
https://docs.stripe.com/connect/risk-management

Distinguishes transaction/account risk, connected-account loss responsibility and provider/platform operational controls. Current page discusses preview configuration; eligibility and production-supported API/account settings must be confirmed. Direct charges alone do not settle all liability.

### R44 · Stripe direct charges
https://docs.stripe.com/connect/direct-charges.md?platform=web&ui=stripe-hosted

Payments and transaction objects live on the connected account; account-scoped access is required. Documentation recommends full Dashboard access for direct-charge accounts. Relevant to the proposed merchant-led payment arrangement; not a Taplo provider agreement.

### R45 · SavvyCal current features
https://savvycal.com/features

Documents calendar overlay, team scheduling, availability controls, workflows and inline/popup website embeds. Shows why a 2026 comparison cannot reduce scheduling products to a basic appointment form.

### R46 · HoneyBook current connected client actions
https://help.honeybook.com/en/articles/5776807-the-differences-between-smart-files-and-legacy-files

April 2026 article documents smart files combining client actions, scheduling, questionnaires and invoice/payment-related capabilities. Useful mechanism to study; not evidence that Taplo must adopt a document-shaped interface.

### R47 · Bookwhen customer portal
https://support.bookwhen.com/en/articles/7982922-customer-portal-overview

June 2026 article describes central customer activity/bookings and membership/pass/voucher access, with a stated filtering limitation. Supports research into return utility; Taplo merchant-specific return context is a hypothesis.

### R48 · CMA deposit/cancellation fairness
https://www.gov.uk/government/publications/cancelling-goods-or-services-guide-for-consumers/cancelling-goods-or-services

Official guidance says agreed cancellation charges must be fair, loss-related and consider reasonable mitigation. Does not authorise blanket automatic deposit forfeiture or replace offer-specific legal review.

### R49 · Stripe saved payment authority
https://docs.stripe.com/payments/save-and-reuse.md?payment-ui=elements

Explains Setup Intents and consent/record requirements for specified future use, including off-session charging. Supports separate payment-authority design; no guaranteed later-charge success.

### R50 · ICO electronic marketing planning
https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/plan-direct-marketing/

Explains individual/corporate subscriber distinctions, channel-specific consent and conditions of the products/services soft opt-in. Merchant permission cannot be assumed to cover unrelated platform advertising.

### R51 · Postmark message streams
https://postmarkapp.com/message-streams

Documents separate transactional/broadcast streams. Relevant to delivery architecture/provider evaluation; transport classification does not decide legal marketing status.

### R52 · Twilio message status
https://www.twilio.com/docs/messaging/guides/track-outbound-message-status

Documents outbound message lifecycle/status callbacks. Supports tracking provider/delivery outcomes, not an assumption every SMS has been read.

### R53 · Google Calendar sync
https://developers.google.com/workspace/calendar/api/guides/sync

Documents full/incremental synchronisation, pagination/cursors and invalidation recovery. Calendar integration requires a lifecycle, not only OAuth and an event export.

### R54 · Microsoft Graph calendar view delta
https://learn.microsoft.com/en-us/graph/delta-query-events

Documents per-calendar/date-window change tracking and opaque paging/delta links. Provider-neutral sync code must preserve these specific semantics; the page distinguishes beta unbounded-calendar capability.

### R55 · Bookwhen waiting lists
https://support.bookwhen.com/en/articles/753351-waiting-lists

Documents timed notifications and operational caveats around event changes/unpublication. Taplo must choose explicit queue/allocation and validity rules instead of copying a feature name.


## Research continuation · R56–R61 · 3 November 2026

### R56 · Booksy UK cancellation and refund help

https://help.booksy.com/hc/en-gb/articles/21636477672082-Can-I-get-a-refund-if-I-cancel-an-appointment

https://help.booksy.com/hc/en-gb/articles/21636338356242-How-much-will-you-charge-for-cancelling-a-booking

UK help states providers set disclosed cancellation charges and process refunds; support does not refund on providers' behalf. This does not establish review complaint frequency or what happened in any individual dispute. Do not substitute US help for UK findings.

### R57 · CMA fair customer contracts · current July 2026 update

https://www.gov.uk/guidance/writing-a-fair-contract-for-customers

Explains transparent/fair cancellation terms, loss mitigation and avoiding excessive/double compensation. Reviewed for 87's outcome boundaries; no universal legally safe deposit percentage inferred.

### R58 · Phosphor official project and React documentation

https://phosphoricons.com/

https://github.com/phosphor-icons/react

Official project identifies MIT licensing; React documentation supports six weights and custom family extensions. Exact package export/version and full Taplo semantic coverage still require audit; no package installed as part of blueprint work.

### R59 · Lucide licence

https://lucide.dev/license

ISC licence plus identified Feather-derived MIT notices. Evaluated alternative, not permission to omit notices or mix families indiscriminately.

### R60 · Inter official typeface source

https://rsms.me/inter/

Documents UI-oriented type, text/display optical design, variable weights, tabular numbers and OFL licence. Recommended operational type; final visual/device/fallback review remains.

### R61 · Manrope official OFL file

https://github.com/google/fonts/blob/main/ofl/manrope/OFL.txt

Confirms OFL 1.1 terms. Proposed heading evaluation does not settle multilingual coverage, exact asset/version/weight support or final brand approval.

## Guidance accessibility sources · 3 November 2026

### R62 · W3C WCAG 2.2 Understanding Pause, Stop, Hide

https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html

Explains user control for applicable automatically moving/updating content. Supports controllable non-disruptive guidance media; does not establish that every short autoplay animation is acceptable. Understanding documents explain the normative criterion.

### R63 · W3C ARIA APG modal dialog pattern

https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

Describes modal focus, keyboard interaction, labelling and logical focus restoration. Applies to actual modal task surfaces; non-modal hints must use appropriate different behaviour.

### R64 · W3C WCAG 2.2 Understanding Redundant Entry

https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html

Explains reuse/selection of information already provided in the same process, with stated exceptions. Supports avoiding repeated entry during quick/full setup handovers; does not require indefinite cross-session retention or override privacy/security.

## Construction-tool checks · 3 November 2026

### R65 · Motion accessibility

https://motion.dev/docs/react-accessibility

Documents reducedMotion/useReducedMotion support. Informs product-motion defaults; does not validate Taplo's particular animation or media behaviour.

### R66 · Radix accessibility

https://www.radix-ui.com/primitives/docs/overview/accessibility

Documents ARIA-pattern, keyboard and focus behaviour. Primitives still require correct composition, naming, styling and application-level review.

### R67 · Storybook accessibility testing

https://storybook.js.org/docs/writing-tests/accessibility-testing

Documents automated component accessibility checking. Relevant to a state catalogue, not proof of complete accessibility or visual quality.

### R68 · Playwright assertions

https://playwright.dev/docs/test-assertions

Documents assertions including web-first retrying checks. Relevant to connected-task verification; assertions must encode correct requirements and cannot prove all untested behaviour.

## Stripe integration continuation · 3 November 2026

### R69 · UK Stripe Connect pricing

https://stripe.com/gb/connect/pricing

Distinguishes Stripe handling merchant pricing from platform-handled pricing. Former lists no additional platform account/payout fees; latter lists £2 per active account monthly and 0.25% + 10p per payout under its definitions. This is a dated published supplier input, not Taplo's final agreement; employee logins are not seller payment accounts.

### R70 · Stripe-hosted onboarding

https://docs.stripe.com/connect/hosted-onboarding

Explains hosted identity/business verification, link refresh and return handling. Return may follow Save for later; verify requirements/capabilities rather than infer readiness.

### R71 · Connect webhook scope

https://docs.stripe.com/connect/webhooks

Documents account versus connected-account events and v1/v2 distinctions. Relevant to routing/signature/account mapping and lifecycle; exact selected API/event schemas still required.

### R72 · Connect account balances

https://docs.stripe.com/connect/account-balances

Documents separate pending/available balances and applicable platform reserves. Financial success, available funds and payout arrival are not one state.

## Pricing, marketing and share-preview checks · 3 November 2026

### R73 · Booksy UK pricing

https://biz.booksy.com/en-gb/pricing

Lists £40/month plus £5 per additional user, VAT additional, with broad feature/messaging bundle. A current competitor scope check, not proof of operator satisfaction or Taplo superiority.

### R74 · Fresha pricing

https://www.fresha.com/pricing

Retrieved current page describes per-bookable-member pricing but rendered CHF. No exact comparable GBP price is inferred.

### R75 · Beacons pricing

https://beacons.ai/i/pricing

Current free commerce/growth features and fees; displayed monthly paid levels and annual equivalents differ. Use actual currency/cadence, not a false like-for-like GBP comparison.

### R76 · Linktree pricing

https://linktr.ee/s/pricing

Current tiers include selling, customisation and growth features. Exact price amounts did not render in retrieved text, so no numeric comparison is made.

### R77 · Twilio UK SMS pricing

https://www.twilio.com/en-us/sms/pricing/gb

Lists common outbound $0.056 per segment, with sender/carrier/failed-message and other cost distinctions. Do not treat USD as GBP or a long message as one segment.

### R78 · Postmark pricing

https://postmarkapp.com/pricing

At displayed 10,000-email volume, Basic $15/month with separate overage and plan features. Actual tenant/domain/currency configuration still matters.

### R79 · Stan official plan comparison

https://help.stan.store/article/31-creator-vs-creator-pro

Official help identifies Creator $29/month and Creator Pro $99/month, with annual alternatives. Different use case/currency, not an automatic Taplo pricing target.

### R80 · SimplyBook free plan

https://help.simplybook.me/index.php?title=Is_the_system_free%3F

Official help describes 50 bookings/month and one custom feature on Free. A useful bounded free model, not justification for copying its exact allowances.

### R81 · Google helpful content

https://developers.google.com/search/docs/fundamentals/creating-helpful-content

People-first useful reliable content is the baseline; does not promise traffic or rankings.

### R82 · Google JavaScript SEO

https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

Explains rendering/crawlable links/metadata and page status considerations. Public routes cannot rely only on an inaccessible client popup.

### R83 · Google LocalBusiness structured data

https://developers.google.com/search/docs/appearance/structured-data/local-business

Enhancements require eligible real public facts; no fabricated private address or guaranteed rich result.

### R84 · Open Graph protocol

https://ogp.me/

Defines core head metadata and image properties. Platforms still choose rendering/caching.

### R85 · Google spam policy

https://developers.google.com/search/docs/essentials/spam-policies

Scaled low-value content to manipulate search is prohibited, regardless of production method.

### R86 · Google faceted-navigation guidance

https://developers.google.com/crawling/docs/faceted-navigation

Explains infinite filter URL/crawl cost and deliberate control for indexable versus non-indexable facets.

### R87 · Google index/crawl controls

https://support.google.com/webmasters/answer/7489871/no-page-information-in-search-results?hl=en-GB

robots.txt crawl restriction differs from noindex; real access control protects private information.

### R88 · LinkedIn sharing help

https://www.linkedin.com/help/linkedin/answer/a525301/sharing-articles-or-links?lang=en

Describes 1.91:1 preview frame/1200×627 and possible absent image. Supports crop tests, not universal rendering guarantee.

### R89 · LinkedIn Post Inspector/cache

https://www.linkedin.com/help/lms/answer/a6233775?hcppcid=search

Explains cached previews and refresh for new posts; existing posts remain unchanged.

## Merchant SEO ownership checks · 3 November 2026

### R90 · Search Console property types

https://support.google.com/webmasters/answer/34592?device=c&hl=en

Domain/DNS and protocol-host-path URL-prefix properties have different coverage. Multi-tenant verification needs exact scope; no root-domain access for a merchant.

### R91 · Search Console verification

https://support.google.com/webmasters/answer/9008080

Documents DNS, HTML tag/file methods and continued verification. Exact provider-specified scope/location must be followed safely.

### R92 · Search Console OAuth

https://developers.google.com/webmaster-tools/v1/how-tos/authorizing

Private API requests require authorised OAuth access; sign-in alone is not a property reporting grant.

### R93 · Search Analytics API

https://developers.google.com/webmaster-tools/v1/searchanalytics/query

Provides filtered/grouped report rows but does not guarantee all data rows. Show coverage/date/source accurately.

### R94 · URL Inspection API

https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect

Reports indexed-version information, not a live URL test or generic request-indexing endpoint.

### R95 · Sitemap generation/submission

https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

Documents sitemap formats/scope and submission; inclusion does not guarantee indexing.

## Costing source checks · 3 November 2026

### R96 · Stripe UK processing

https://stripe.com/gb/pricing

Standard UK card baseline 1.5% + 20p; premium/international methods differ. Applied to Taplo subscription collection, not confused with merchant transaction fees.

### R97 · Stripe Billing

https://stripe.com/gb/billing/pricing

Pay-as-you-go 0.7% of Billing volume, with exclusions such as one-off invoices. Calculator conservatively applies to subscription gross; actual contract/base must be verified.

### R98 · Resend pricing

https://resend.com/pricing

Retrieved transactional Pro displays $20/month/50,000 emails, $0.90 per 1,000 extra, domain/endpoint limits and add-ons. Actual transactional/marketing mix and multitenant eligibility need confirmation.

### R99 · Amazon SES pricing

https://aws.amazon.com/ses/pricing/

Outbound à la carte $0.10 per 1,000 plus data/features/tenant-related costs as applicable. Lower unit delivery cost does not eliminate deliverability/operational work.

### R100 · Vercel pricing

https://vercel.com/pricing

Pro $20/month plus usage; developer seat costs are not per merchant or business employee. Runtime/traffic/observability costs vary.

### R101 · Neon pricing

https://neon.com/pricing

Launch usage-based $0.106/CU-hour and $0.35/GB-month plus applicable history/other costs. Typical spend shown is not a fixed platform quote.

### R102 · Brevo SMS credits

https://help.brevo.com/hc/en-us/articles/208717449-Supported-countries-and-pricing-for-SMS-messages

Country and message length determine credit use; exact rate retrieved from actual calculator/account still needed. No third-party claim of cheap UK cost is treated as a verified quote.

### R103 · Textmagic UK sender requirements/cost

https://support.textmagic.com/article/sending-text-messages-to-the-united-kingdom/

Provider-specific UK page lists dedicated number £2.40/month and one-way sender ID £10/month. Generic default/US outbound calculator is not a comparable UK quote; negotiate/verify actual supported model.

### R104 · UK VAT rates

https://www.gov.uk/vat-rates

Standard rate currently 20%; actual registration/supply/tax recovery treatment still requires accounting review. Model uses registered standard-rate scenario, not advice to charge unregistered.

## Provider continuation · 3 November 2026 · edition 2.3

P1–P14 are the dated source keys in PROVIDER-STACK, INTEGRATIONS-AND-SUPPORT and PAYMENTS-AND-REFUNDS. They supplement R1–R104 rather than renumber them. Current official Resend FAQ resolves a previous uncertainty: marketing can use the email API with required consent/unsubscribe handling, while Broadcasts are contact-priced. The official multi-tenant guide explicitly documents shared-account sender/reputation/suspension exposure and domain/aggregate constraints; this is not fully isolated native tenancy merely because API tags exist. These findings support the adopted architecture but do not establish Taplo's actual account configuration/terms/throughput or certify deliverability.

Official pricing was retrieved for Resend, Stripe, Twilio, Crisp, Vercel, Neon and Mapbox. Sentry pricing did not render reliably, so its entry remains a budget/candidate, not a quoted supplier rate. Cloudflare R2 pricing was inspected as a potential alternative, but the initial media choice stays Vercel Blob to reduce provider count; it is not another mandatory subscription. No full visual competitor teardown was completed in this continuation.

PROVIDER-COSTS records the selected conditional envelope and failures of low-budget assumptions, including map audience costs. A computed invoice is a scenario, not observed usage or a complete quote. Existing company model is retained rather than double-counting every new subtotal.

## Customer web, messaging and trust continuation · 2.4

New source keys W1–W3, M1–M8, T1–T6 and L1–L4 are local to the four current continuation documents and supplement earlier registers. Current primary-source research covers Apple/Android web-to-app patterns, Google search spam rules, current ICO electronic-mail and storage/access guidance, CMA review publishing, Ofcom user-generated listing/review/message scope and children, Google GBP/Places/review policies, online selling and HMRC platform reporting. Competitor functionality was studied through Fresha, Square, Shopify and Mailchimp first-party help; full Fresha article rendering was unavailable and the relevant finding is search-retrieved. These are targeted functional findings, not a comprehensive visual study, measured keyword landscape or observed owner/customer evidence. Supabase's current official docs were consulted to distinguish the bundled backend from choosing Neon for Postgres.

## Database and editor continuation · 2.5

Current official Neon pricing/plans and Supabase pricing/compute/backups/PITR were compared, including the now-broader Neon backend. DATABASE-CHOICE-AND-COSTS contains source keys D1–D5 and reproducible assumed workloads rather than unsupported merchant-count capacity claims. Supabase's daily backups and optional PITR were distinguished. Twilio's current SMS encoding glossary informed the editor estimate and boundary checks; provider/country/body-specific billing remains authoritative. This pass produces a selected communications visual reference, not a systematic competitor visual study or all final Studio screens. Main marketing solutions placement is a founder clarification, not new external research.

## Access, stores, rewards, Wallet and widgets continuation · 2.6

Current first-party Better Auth/Expo docs informed social/email/native flows and revealed the default 2FA coverage limitation for passwordless/social methods; the blueprint explicitly requires server assurance gates. Current Apple guidelines include October 2026 updates. Apple/Google developer registration, deletion, billing differences and Expo build pricing were checked. Neon/Supabase current pricing was rechecked without inventing a universal winner. Apple Wallet update/HIG/WWDC26 sources, Google Wallet issuer/loyalty/generic/Smart Tap documentation and current Expo Widgets/WidgetKit/Glance docs informed separate passes/widgets/scanning. Notably, current Expo Widgets can use Expo UI; the older claim that all such widgets must be handwritten Swift is not used. Google's official developer blog describes business-card uses; actual payload/provider/brand approval remains a gate. Native camera/device/provider/store flows have not been implemented/tested by this desk-research pass.
