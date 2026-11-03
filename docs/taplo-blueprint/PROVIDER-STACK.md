# Taplo · Providers, email and what they cost

Current database refinement · 2.5: DATABASE-CHOICE-AND-COSTS.md compares current Neon/Supabase tariffs, recovery and workloads. Both now advertise broader backend capabilities; do not repeat a database-only-Neon versus bundled-Supabase claim. Selected Taplo services remain deliberate decisions, not automatic adoption of every provider feature.

Working edition 2.3 · 3 November 2026. Adopted planning choices; no supplier accounts, subscriptions or live integrations purchased/configured. Prices are dated inputs, not quotes. GBP illustrations use the existing assumed £0.80 per US dollar, not a live exchange rate; supplier taxes, FX/card charges and extra usage can change the invoice.

## The practical stack

Taplo owns the business rules, customer relationship records, permissions and Studio experience. Providers supply specialised infrastructure. Merchants should not need to learn the names below or open unnecessary extra accounts.

| Need | Working choice | Cost basis to Taplo | Merchant experience / readiness |
| --- | --- | --- | --- |
| Email delivery | Resend paid API plan; React Email for controlled templates | Published Pro anchor $20/month for 50,000; $0.90/1,000 additional emails [P1] | Included operational email; marketing allowance in their Taplo plan; no separate merchant Resend subscription required by our preferred design |
| Merchant payments | Stripe Connect, direct charges; Stripe-set processing pricing and supported provider loss responsibility preferred | No added Connect account/payout fees under the published Stripe-handles-pricing model; actual agreement/configuration must match [P4] | Owner completes hosted Stripe setup; separate verified ability to charge and receive payouts |
| Taplo subscriptions | Stripe Billing + Payments on Taplo's own account | Model 0.7% Billing plus standard UK card 1.5% + 20p; actual card mix differs [P5] | One software bill and clear optional purchases; no employee seat fee |
| Optional UK texts | Twilio as initial implementation default, subject to actual sender setup | Retrieved common outbound rate $0.056/segment; failed-message processing and other applicable charges separately [P6] | Taplo SMS packs, true usage preview and spending controls; no Twilio account required |
| Taplo support inbox | Crisp Mini initially; Taplo-authored help content and case context | $45/workspace/month, four support seats in retrieved plan [P7] | In-product help and email thread; customer does not need a Crisp account |
| Hosting / public pages / API | Vercel Pro, reuse compatible existing repository | $20/month platform anchor plus measured usage/developer seats, not per merchant [P8] | Same canonical business page and return routes |
| Database | Neon Postgres paid production configuration | Launch published $0.106/CU-hour and $0.35/GB-month, plus applicable extra items [P9] | One tenant-safe source for business operations; paid-plan SLA/backup needs reviewed |
| Images/files | Vercel Blob initially, optimised derivatives; no merchant public bucket keys | Published storage $0.023/GB-month beyond applicable allocation; operations/transfer/transform costs separate [P8] | Contextual media picker, private intake files distinct from public gallery |
| Calendar connection | Direct Google Calendar and Microsoft Graph adapters | No assumed per-member sync aggregator subscription; quotas, infrastructure and maintenance budgeted | Busy time input plus deliberate Taplo event export; see INTEGRATIONS-AND-SUPPORT |
| Explore maps | Mapbox working choice, Taplo's own merchant/offer search | Web map loads and native mobile MAU billed differently; see P10 | Map/list same results; attribution, geocoding/storage licence and privacy separately reviewed |
| Identity/login | Maintained auth library such as Better Auth against selected database; validate existing auth before replacement | Infrastructure, security work and email cost; no invented zero-cost identity service guarantee | One person may have scoped memberships; platform authentication separate from merchant marketing |
| Monitoring | Vercel platform logs plus Sentry candidate for errors; capped telemetry | Reserve a £20/month planning allowance pending verified plan/volume, not a sourced Sentry quote | Redacted events; no default session recording of payment/intake or private activity |
| Background processing | Durable database outbox with bounded worker/reconcile jobs, managed queue where actual load warrants | Included in measured DB/compute budgets until selected managed service priced | Accepted jobs persist; retries do not duplicate bookings, texts or refunds |
| Domains | Vercel hostname routing; registrar API candidate assessed separately | Per-TLD registration/renewal/transfer plus integration/support; no blanket price | Connect existing domain first; buying needs registrant/renewal/exit contract before sale |
| Loyalty passes | Apple Wallet and Google Wallet issuer services directly | Developer/issuer accounts, signing, hosting, updates and actual fees not yet fully priced | Pro rewards entitlement; payment wallet buttons are a different Stripe capability |
| Native app / push | Apple/Google release accounts and platform push services | Release, device QA, store policy and operations still to be priced | Push permission optional; no assumption every customer installs an app |
| Stock media | Unsplash/Pexels remain evaluated candidates, not both installed | API approval/licence/attribution and actual commercial-use workflow review | Decoration only, never passed off as the merchant's real work |

P1–P10 below contain source facts; choices and all UX/operating rules here are Taplo recommendations. Unknown components are deliberately not assigned a fictitious zero price. No external AI dependency is required for a booking, refund, search match, availability check or initial setup.

## Why Resend is the default

For this stage, I recommend Resend because its API/templates/event tooling suit a small team building controlled branded emails, and the current tariff supports the intended send model. This is a product-fit judgement, not a universal delivery ranking. Postmark remains a transactional-focused alternative; SES a lower raw-unit-cost alternative with its own account, sending operations and development tradeoffs. Neither should be added as a second production provider just for a hypothetical fallback. Revisit on measured deliverability, account isolation, actual support and total cost, not a single per-email headline.

## Resend: strong default, with a proper sending design

Resend documents one shared account with tenant domains/scoped keys or separate tenant accounts; shared reputation and account suspension remain risks. Aggregate limits and domain allowances matter. [P2] Our low-friction default is Taplo-managed delivery. Ordinary merchants do not configure DNS or buy email infrastructure merely to send a booking confirmation.

Proposed sender families, on domains Taplo actually owns and verifies:

| Message | Identity seen by recipient | Controlled content | Reply destination |
| --- | --- | --- | --- |
| Merchant booking/order/quote | Merchant name via Taplo | One merchant identity, neutral readable body, safe accent, specific transaction facts | Merchant's verified support address or an authenticated routed thread |
| Merchant campaign | Merchant name via Taplo, from a distinct campaign sender family | Reviewed reusable template, visible sender/address and unsubscribe | Verified merchant support route |
| Account security / Taplo software bill | Taplo | Taplo identity and necessary account/billing facts | Taplo support |
| Taplo support case | Taplo support | Case reference and next step; avoid sensitive detail in subject | Same support thread |

Sender addresses are implementation placeholders until production domains exist; never spoof the merchant's unverified domain. A custom website domain is not an authenticated email domain. Custom From-domain setup is excluded from launch package promises; revisit with demand, domain capacity, support cost and verification/removal flows. Logo and name use the same identity rules as the mini-space; no invented initials or repeated wordmark/name. Emails need dark-mode/fallback/text-only and long-name checks, not just a beautiful Studio preview.

Use separate provider-approved account/stream boundaries for critical Taplo authentication and merchant-generated mail. Separate transactional and campaign subdomains as an additional measure; subdomains alone do not isolate an entire account suspension. Do not create extra accounts to evade provider enforcement. Shared merchant delivery still needs tenant-scoped consent, rate limits, abuse checks, per-tenant campaign pause, bounce/complaint handling and a production incident plan. No automatic provider failover to bypass an opt-out/suppression.

Current pricing FAQ permits newsletters through the email API with consent, visible unsubscribe, List-Unsubscribe and List-Unsubscribe-Post; its Broadcasts product instead uses contacts-based billing. [P1] Therefore the planning default is our own tenant-scoped campaign orchestration through the API, not an assumption that contact-priced Broadcasts are free. Confirm commercial fit, acceptable use, throughput and actual deployment configuration before scale.

## Email engine and allowance rules

Every logical send has tenant, recipient, purpose, template/version, originating record, consent basis, idempotency key and delivery attempts. Address/consent resolution happens server-side; browser tags are not authority. Queue priorities reserve capacity for security and accepted operational work. Promotional exhaustion never blocks a cancellation receipt.

Marketing allowance is recipient-sends, not contacts: 100 recipients consume 100; five campaigns to those recipients consume 500. Draft/preview/internal test do not consume merchant campaign quota; bound test abuse separately. Reserve allowance on enqueue, settle on provider acceptance, release once for definite pre-acceptance rejection. A later bounce does not refund a send already attempted by the provider. Unknown provider outcome stays reconciling; do not immediately release and resend. Provider retry does not charge twice. One account-level monthly plan allowance, not multiplied by team members or Business locations.

Marketing unsubscribe is tenant-and-purpose scoped; opting out of one merchant does not consent to another, and does not remove a genuinely necessary service notification. Provider safety suppressions must still be honoured. No marketing list purchased/scraped by the import tool. Authentication and private transaction URLs expire appropriately and cannot be repurposed as campaign tracking links. Open/click tracking off by default pending privacy review; opens are not reliable evidence of reading.

Studio Communication settings has a calm summary: Operational emails included; Campaigns 180 of 250 used; Text balance 64. A campaign composer shows eligible recipients, excluded count/reasons, send time/timezone and remaining allowance before Send. At allowance exhaustion, retain draft and offer next reset or deliberate upgrade; never surprise bill. Queue outage/paused/rejected are explicit states, not all labelled Sent.

## Cost illustrations and accounting treatment

Run contracts/calculate-provider-costs.py; PROVIDER-COSTS.md contains the reproducible estimates. The existing plan serving budget uses a conservative 0.072p/email, not a promise of that exact marginal invoice at all volumes. Paying a $20 minimum matters at low volume. Larger feature/domain/rate-limit requirements may require another plan regardless of send price.

Shared-tool invoices are reconciled against the existing variable email/infrastructure and fixed pools, not added twice. The new provider calculation is an envelope check, not a replacement company P&L. It excludes real workforce, tax, all other operating costs and unverified supplier items. Current package prices stay £0/£12/£24/£49.

## Dated source register · checked 3 November 2026

- P1: https://resend.com/pricing — published Pro/overage anchors and API-versus-Broadcasts FAQ. Dynamic plan selectors can change the quote.
- P2: https://resend.com/docs/knowledge-base/setting-up-resend-for-multi-tenants — account, domain, reputation, routing and aggregate-limit implications.
- P3: https://resend.com/blog/how-to-warm-up-a-new-domain — separate sending subdomains and warming practices.
- P4: https://stripe.com/gb/connect/pricing and https://docs.stripe.com/connect/risk-management — pricing and loss configuration are separate decisions.
- P5: https://stripe.com/gb/pricing and https://stripe.com/gb/billing/pricing — actual payment mix/configuration still matters.
- P6: https://www.twilio.com/en-us/sms/pricing/gb — per-segment tariff, not per displayed message.
- P7: https://crisp.chat/en/pricing/ — Mini versus Essentials; no assumed WhatsApp entitlement on Mini.
- P8: https://vercel.com/pricing and https://vercel.com/docs/plans/pro-plan — compute/storage/use allocations and platform/developer distinction.
- P9: https://neon.com/pricing — usage tariff, typical-spend examples are not fixed quotations.
- P10: https://www.mapbox.com/pricing — 50,000 web map loads included then first paid tier $5/1,000; native mobile first 25,000 MAU included then $4/1,000 in the next band. Search/geocoding, storage rights and other APIs separately scoped.

Edition 2.4: COMMUNICATIONS-AND-MARKETING defines the delivery/automation/permissions catalogue. Neon is the working database choice, not an order to replace a functioning Supabase stack without inventorying auth/storage/realtime and a validated migration plan. CUSTOMER-WEB-AND-ACQUISITION records that distinction; Supabase official documentation https://supabase.com/docs confirms its bundled Postgres/Auth/Storage/Realtime capabilities.
