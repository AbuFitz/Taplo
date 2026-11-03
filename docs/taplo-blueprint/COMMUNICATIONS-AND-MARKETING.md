# Taplo · Communications and marketing operating design

Edition 2.5: MESSAGING-EDITOR-AND-GUIDANCE.md adds exact setup/suggestion/editor/wording contracts. COMMUNICATIONS-REFERENCE.html demonstrates selected fictional edit/preview/quick-timing/review states; it is not a delivery backend or all final screen states.

Working edition 2.4 · 3 November 2026. Deepens spec 83 and PROVIDER-STACK. Resend/Twilio are the delivery defaults; Taplo owns purpose, consent, scheduling, records, templates and authority. No campaign or external message was sent in this blueprint work.

## What businesses actually use messages for

| Job | Typical event / category | Default channel and treatment |
| --- | --- | --- |
| Confirm an agreement | Booking/order/quote acceptance | Operational email; private Activity record |
| Prevent missed work | Appointment tomorrow, changed time/location | Optional operational reminder email; funded SMS if enabled |
| Obtain necessary action | Quote decision, agreed balance due, fitting/collection information | Relevant operational email; optional SMS within purpose/contact rules |
| Update fulfilment | Ready to collect, dispatch/tracking, delayed order | Operational update from actual state |
| Explain change/refund | Cancellation, refund initiated/completed, merchant cannot perform | Operational email; urgent permitted notification if needed |
| Give agreed aftercare | Relevant safety/use instructions after the purchased service | Narrow necessary service information, not a disguised offer |
| Invite next purchase | Time for another haircut, refill, next course, seasonal stock | Marketing: eligibility and allowance/balance required |
| Win back a customer | No relevant visit for the chosen interval | Marketing; exclude already booked/recently contacted people |
| Promote a specific opening | Last-minute appointment or workshop place | Marketing, not an operational reminder merely because capacity is empty |
| Collect feedback/reviews | Neutral review invitation or service survey | Classify exact content/purpose before launch; conservative outbound setting requires marketing eligibility pending reviewed classification |
| Secure/manage account | Sign-in/reset, member invitation, permission change | Taplo/merchant-access operational notification; rate and access controls |
| Run Taplo business relationship | SaaS receipt, failed renewal, domain action, critical product change | Taplo operational message to correct owner/billing/admin role |

Email suits detail, durable agreements and lower-cost routine communication. SMS suits short time-sensitive prompts and direct links; it is optional, costs per segment and is not proof of reading. Never put confidential lesson/clinical/intake details in SMS or lock-screen previews. A text does not replace an accessible agreement/receipt. Do not send every update on every channel just because the phone number exists.

## Three separate senders

1. Merchant to that merchant's customers, within its own purpose/channel permissions.
2. Taplo to owners/members: account/service operations plus separately eligible product education/promotions.
3. Taplo to customers: account/activity operations plus separately eligible platform recommendations.

Buying from Chapter Barbers is not agreeing to Taplo promotions or another salon's campaign. Following/saving is not marketing consent. Owner's staff invitation does not opt that member into newsletters. ICO distinguishes individual/corporate subscribers and products/services soft-opt-in conditions [M1–M2]. Product default uses explicit channel-and-sender consent for promotional sends; supported soft-opt-in needs documented evidence and all conditions, not a merchant checkbox claiming everyone agreed. Charitable-purpose exceptions are not a generic SaaS exemption.

A service message with an offer is not safely operational just because an internal tag says transactional [M1]. Keep essential templates protected from promotional additions. Reward balances earned from a completed purchase can be shown in private Activity; an unsolicited prompt to spend rewards is assessed separately. Treat abandoned-cart, rebooking, win-back and birthday messages as marketing in the product default. Do not copy a competitor's All customers toggle as a legal conclusion.

## Research translated into Taplo decisions

| Current first-party source | Documented pattern | Taplo decision |
| --- | --- | --- |
| Fresha automated messages [M3] | Appointment messaging plus rebooking, win-back and milestones | Separate operational events from growth recipes; not a single automation switch |
| Square appointment communications [M4] | Timing/channel settings and blocked promotional language | Protected operational templates and an adjacent marketing workflow |
| Square campaigns [M5] | One-time/automated campaigns, location context, customer groups | Simple goal-led composer with explainable eligible audience and location scope |
| Shopify Messaging/Autopilot [M6] | Approval of tactics, abandoned/re-engagement flows, duplicate automation checks | Suggest a draft; owner deliberately enables it; shared contact policy prevents overlapping sends |
| Mailchimp roles [M7] | Author can prepare; other roles can send; billing/export differ | Separate compose, approve, dispatch, spend and export permissions |

These are targeted documented functionality findings, not completed visual teardowns or proof each platform is right for every UK workflow. Taplo's differentiator is using its existing booking/order truth and compact return space to suggest useful next actions without requiring a merchant to build a complicated CRM.

## Studio: simple controls, thorough rules

Two destinations under one Communications area: **Updates** and **Campaigns**. Updates lists booking/order/payment/account-purpose templates and real delivery outcomes. Campaigns has a goal-first surface: Fill an opening; Announce something; Bring customers back; Welcome subscribers. Advanced recipes are Pro where package rules say so; basic campaign sending uses the existing 250/1,000/3,000 account allowance. No extra tool subscription for each employee.

Composer steps in the same task: goal/offer → eligible audience → email or SMS → generated branded draft → timing → review. Show sender, reply route, selected location, eligible count, exclusions, text units or email allowance and a preview. Merchant can change allowed wording/images, not protected seller/legal/opt-out facts. Logo/name/theme use the shared identity engine; neutral readable email canvas, not entire merchant page background.

Audience selector explains Matches 42 customers, excludes 8 without email permission and 6 already booked. Counts must be computed from actual records, never illustrations in live UI. Only appropriately authorised staff see contact details; a campaign author may work with aggregate segments without downloading a list. Segment sources are business-local accepted facts, not health notes, children's behaviour, private messages or another merchant's customers.

A recipe card describes who/when/why with a sample, then Enable. In-context quick setup collects only missing necessary fields. No full-page detour, floating autoplay tutorial or empty workflow canvas as the first experience. Advanced settings remain reachable and reuse the same validator. Missing permissions, sender readiness, empty eligible audience, insufficient SMS, stale offer, quota exhaustion and pending approval get specific recoverable states with draft intact.

## Useful automation defaults

| Recipe | Proposed default and guard | Package |
| --- | --- | --- |
| Confirmation | Immediately after committed accepted event, once | All |
| Reminder | One configurable reminder, working default 24h before appointment | Operational all; SMS optional funded |
| Collection-ready | Once when staff commits ready state; no false inventory assumption | Supported commerce tier |
| Rebooking prompt | Owner-enabled interval by service; exclude future matching booking | Pro recipe |
| Win-back | Owner-enabled inactivity window; exclude open issue/active booking and recent campaign | Pro recipe |
| New subscriber welcome | Once for a valid merchant/channel subscription | Core basic campaign tool |
| Abandoned checkout | Owner-enabled, marketing eligible, no paid/active pending-payment duplicate | Pro recipe |
| Birthday | Optional month/day only if purpose genuinely wanted and permitted; no birth-year collection merely to send discount | Pro recipe |
| Capacity opening | Build a proposed campaign, never auto-discount or auto-blast a cancelled slot | Core manual / Pro reviewed automation |

Each trigger stores event/version and intended purpose. Re-evaluate current booking/stock/consent/suppression at dispatch. Moving a booking replaces its old reminder; cancellation invalidates it. A reminder created less than 24h before the appointment must not duplicate the immediate confirmation: default skip when confirmation was sent in the preceding two hours, with a separately reviewed meaningful urgent-change path. Quiet hours: marketing SMS 09:00–20:00 recipient local time; if unknown, use configured business timezone and disclose scheduling, never infer precise location. This is a product restraint, not a claimed UK statutory window. An operational update is governed by urgency/customer preferences, not automatically delayed past its usefulness.

Default merchant promotional contact limit: at most one message in 24 hours and three in seven days per recipient across that merchant's campaigns. Recipient marketing preferences can be stricter. These are configurable bounded product defaults to validate, not legal safe harbours. Duplicate recipes compete under one contact ledger; operational receipts are not suppressed merely because a campaign was sent. No blanket cross-merchant suppression pretending every business is the same sender.

## Delivery, costs and permission evidence

Email marketing count is accepted recipient-sends; SMS balance is provider-billed segments. Preview, reserve, dispatch, provider-acceptance reconciliation, failures and idempotency follow PROVIDER-STACK and 109. Security/operational priorities cannot be starved by promotional queues. SMS sender must have a working channel-appropriate opt-out; never promise Reply STOP for a one-way alphanumeric sender. No marketing auto-switch from email opt-out to SMS.

Consent/evidence records require business/platform sender, contact identity, channel, purpose, basis, notice text/version, source/collection time, proof reference and withdrawal time. Do not turn consent true through contact import. Soft-opt-in proof records collection during sale/negotiation, own similar purpose and collection-time plus message-time opt-out. Suppression survives ordinary deletion/reimport where lawfully necessary; access tightly restricted. Re-check queued recipients immediately before send, not just on campaign creation.

Per-campaign permission set: campaign.compose; audience.aggregate.read; campaign.approve; campaign.dispatch; automation.manage; communication.settings.manage; communication.spend; consent.evidence.read; audience.export. Basic standard marketing roles are available without Business upsell; Business adds custom role composition. Author cannot grant self approval/export/refund; publisher can send only approved scope and budget. Owner may combine roles for a solo business, with explicit final review. Removing a member revokes sessions/grants and flags their scheduled work for owner adoption; it does not reset consent or delete evidence.

## Taplo's future marketing team

Use Console's separately scoped platform workspace, not a merchant account with every tenant's customer list. Content author drafts pages/templates; campaign editor works with approved platform audience; publisher approves/schedules; billing/spend administrator controls budgets; analyst gets aggregate reports. Separate authority for product announcements, service incidents and merchant-targeted education. A marketer does not see payment secrets, private customer activity or clinical/learner intake. Staff MFA and logged access; sensitive export not automatic.

Owner onboarding education can be operational only when it actually helps the requested setup without promotions. Upsell/new-feature sales newsletters are marketing. Usage-based helpful suggestions first appear in Studio; optional emails require their own classification/eligibility. Platform customer recommendations are off by default pending explicit choice and suitable profiling/privacy review. No automatic cross-business advertising based on private purchases.

Analytics: queued/accepted/delivered where supported, failures, unsubscribes, complaint rate, costs and attributable accepted work under a disclosed model. No claim a click caused revenue; Apple/private-email and privacy tools make opens unreliable. Tracking pixels/links are separately assessed under current storage/access guidance [M8], not automatically justified by marketing consent. Default no open tracking or advertising pixels. Reports distinguish observed actions and modelled attribution.

## Acceptance

A customer opts out after queueing; staff member leaves after approving; booking changes during reminder dispatch; SMS is two segments; provider accepts but API times out; external payment pending; bounced contact; same recipient in two automations; owner sends a campaign with a promotional paragraph hidden in a reminder; wrong tenant export; guardian versus learner destination; close account with future work. Each case has explicit suppression/state/owner outcomes before implementation can be called complete.

M1 https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/key-concepts-for-direct-marketing-using-electronic-mail/ ; M2 https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/plan-direct-marketing/ . M3 https://www.fresha.com/help-center/knowledge-base/calendar/125-automated-messages-overview (search-retrieved; full rendered article unavailable). M4 https://api.squareup.com/help/gb/en/article/6729-customer-confirmations-with-square-appointments . M5 https://squareup.com/help/gb/en/article/8412-create-marketing-campaigns . M6 https://help.shopify.com/en/manual/promoting-marketing/autopilot/email-automations . M7 https://mailchimp.com/help/manage-user-levels-in-your-account/ . M8 https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/ . Checked 3 November 2026; ICO guidance includes 2026 changes rather than relying solely on older PECR summaries.
