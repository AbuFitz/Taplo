# 69 · Additional engineering and operating gaps

Edition 1.0 · Work frequently missed when a large product is described only as features. The following contracts need implementation evidence, not automatic new product surfaces.

## Security and abuse

Threat-model cross-tenant access, account takeover, refund/claim abuse, malicious uploads/links, fraudulent listings/reviews, messaging spam, inventory/slot hoarding and domain takeover. Enforce tenant and relationship boundaries server-side; validate uploads and external destinations; rate-limit costly/abusable actions by appropriate scope. Protect secrets, rotate credentials and minimise logs. Implement ordinary web/mobile protections appropriate to chosen frameworks and authentication; this blueprint is not a substitute for a security review. No arbitrary file or remote URL enters public page rendering as executable content.

## Reliability and scale

Define service objectives with actual operating budget and staffing: page response, reservation/commit success, reconciliation delay, notification freshness and restore time. Numbers remain to be agreed and measured; never invent a 99.99% SLA. Durable backups need restore drills and tenant-safe recovery, not just an enabled checkbox. Protect migrations, provider credentials, release rollback and old app compatibility. Feature flags need safe ownership, expiry and consistent behaviour across clients. A disabled capability can stop new work while preserving access to existing commitments.

Search/discovery is a projection, not transactional truth. Define publish/unpublish/version invalidation and stale-result recovery. Location/address access must not leak through search indexes or analytics. Image optimisation, cache invalidation and crawling must respect public/private boundaries. Track queue age and reconciliation backlogs so customer pending states cannot remain forgotten indefinitely.

## Analytics and instrumentation

Measure genuine useful outcomes: owner completes publish, customer finds eligible offer, successful commitment, return-to-record, owner handles work, successful recovery and support effort. Separate discovery impression/click, staff-link attribution, customer conversion and money state. Deduplicate events and document denominators/timezone; a click or pending payment is not revenue. No employee acquisition fee, commission entitlement or marketing consent is inferred from referral attribution.

Instrumentation uses purpose-limited IDs and minimum data. Do not log raw learner notes, exact customer locations, card/claim secrets or private message text into analytics. Consent/region rules and retention are explicit implementation decisions. An opt-out should not break necessary transactional records. Export/deletion requests include applicable analytics/providers and distinguish aggregation from identified records.

## International and category expansion

Currency exponent, tax/receipt, locale/address and timezone are designed as data, not UK-shaped strings. Initial supported geography and category restrictions must still be chosen. Regulated services, children accessing the app, subscriptions/digital supply and other special operating models require their specific reviewed contracts; do not enable a payment flow solely because it fits a generic service block. Avoid constructing speculative category policy templates as final legal advice.

## Distribution and capability parity

State what web, installed web and native apps actually support. Native NFC writing, Wallet and permission flows require device/provider work; a button in the web preview is not proof. Deep links have web fallbacks. Shared-device and staff sign-out remove private cached data. Mobile offline reading can be permitted for appropriate cached records, but new bookings/payments cannot falsely succeed offline. Sync conflicts preserve safe work and show the next action.

## Ownership and maintenance

Every integration, schema migration, operational runbook, design component and policy needs an accountable maintainer and review trigger. Provider API changes, security incidents, legal changes, rising unit costs and observed workflow failures are triggers. Archive superseded decisions with a concise current recommendation; do not force implementers to reconcile contradictory prose. A living blueprint should reduce guessing, not merely accumulate documents.
