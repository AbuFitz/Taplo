# Taplo · Email/SMS editing, suggestions and exact copy

Working edition 2.5 · 3 November 2026. Deepens COMMUNICATIONS-AND-MARKETING and spec 83 with concrete surfaces and template rules. Open COMMUNICATIONS-REFERENCE.html for a selected interactive visual reference, not a deployed communications service. Its business, counts and messages are fictional fixture data. Public copy below describes the intended product directly; provider/development limitations stay in internal notes.

## What the business sees first

Studio → Communications opens **Updates** and **Campaigns**, with a small status row: Essential emails included; Campaign emails 180 of 250 used; Text balance 64. Clear explanation: **Emails keep the details together. Add texts for timely reminders when you need them.** All counts/statuses come from real records in implementation, never generated examples.

Do not ask a new owner to design an email from scratch. Render a coordinated default from business identity, category capabilities and actual event facts. No stock logo initial or automatic circular plate. Business name or wordmark once, restrained accent, neutral reading surface. Platform security/billing messages use Taplo's identity; merchant service messages use merchant via Taplo. A custom website domain does not create custom email From support.

## Suggest based on a real missing job

| Context | Suggested copy | In-context setup | Suppression/repeat rule |
| --- | --- | --- | --- |
| First bookable offer saved | Keep customers up to date | Review confirmation and choose one reminder time; email already on for necessary accepted work | Once per business/capability; snooze/dismiss supported |
| Owner reports repeated manual reminders | Add a text reminder | Show price/segments and balance, choose allowed timing and funding explicitly | No SMS activation or top-up just because a phone number exists |
| First supported collection workflow | Tell customers when an order is ready | Preview trigger and collection instructions; staff commits ready state | Never send ready on order-created event |
| Returning-customer capability enabled | Make the next visit easy | Pro recipe draft with interval, exclusions, permission and contact cap | Never enable/rebook/discount automatically |
| New stock/offer | Share something new | Core manual campaign with eligible audience preview | Do not create a campaign for every inventory update |
| Cancelled slot/class seat | You have an opening to share | Draft a targeted campaign or use appropriate waitlist rules first | No false scarcity; no automatic broad blast or discount |
| No marketing-eligible audience | Invite customers to hear from you | Preview optional sender/channel choices at relevant touchpoint | No bought lists, compulsory consent or bulk repermission spam |
| Team publisher leaves | Review your scheduled messages | Owner adopts/pauses planned work after permission check | Revoked authority cannot continue silently |

Suggested action card stays within the current task, can collapse and remembers relevant dismissal. Do not cover an active input with a popup. Detailed editing opens a full task surface with context preserved, not a tiny universal side panel. A short optional demonstration may illustrate the exact current control; no persistent floating autoplay tutorial. Suggestions are deterministic rules first, not an LLM required to know whether a reminder exists.

## Email editor: a useful document, not a website builder

Desktop: editing canvas and fields take primary space; preview beside it with Email/SMS and width controls. Mobile: Edit and Preview as two reachable views, same draft; no permanently tiny phone preview above a compressed form. Saving/review CTA stays clear of keyboard and system safe area. Close warns only for unsaved changes; Save draft retains them. Full settings is optional, with return to the same template/task.

| Region | Editable | Protected/generated |
| --- | --- | --- |
| Identity | Approved merchant asset/theme preset; verified reply contact through dedicated settings | Actual sender identity, seller facts and authenticated From |
| Subject/preheader | Plain text within template type rules; length guidance, not a guaranteed inbox cutoff | No confidential intake/child/health detail; required event clarity |
| Opening | Short greeting and permitted neutral wording | Safe fallback when recipient name absent; no Hi undefined |
| Content | Allowed note and selected curated blocks for a campaign | Booking time/timezone, order/quote/payment facts, accepted policy and required disclosures |
| Primary action | Relevant wording from allowed action list | Authorised task route, expiry and private-access checks |
| Footer | Optional sign-off within limits | Seller/contact facts, Taplo role, required unsubscribe/preferences and legal information |

Operational templates do not allow arbitrary product/promo blocks. Campaign editor permits a small curated vocabulary: heading, paragraph, one approved image, current offer/product, action button, divider and sign-off. No arbitrary HTML/scripts/custom CSS, copied remote tracking pixels or an entire theme editor. Sanitise rich text, escape tokens and validate URL protocols server-side. The customer sees readable content with blocked images/plain-text fallback; colour is never the only indication of action/status.

Preview states: long business/customer name, absent logo/name, missing optional field, image blocked, light/dark email client, plain text, narrow viewport, invalid URL, expired/unpublished offer. Font rendering in email differs from app; use maintained email-safe fallbacks. Styling choices preserve contrast and protected content; do not let a dark merchant theme make refund text invisible.

## SMS editor: short, honest and cost-aware

SMS is text, not a miniature HTML email. Show a simple message preview with sender and full text, including mandatory applicable opt-out. Edit permitted text and insert allowed data tokens; resolved recipient-specific content determines the final estimate. Offer a plain punctuation suggestion, but never silently change the business name/customer meaning to reduce cost.

Show **Estimated 1 text per recipient · 42 recipients · 42 units** and current balance/reserved balance before review. GSM-7 often permits 160 units in one segment or 153 per concatenated segment; non-GSM UCS-2 often permits 70/67, with extended GSM characters costing extra septets. Twilio's current glossary documents these encoding limits. Final billing must use the actual provider/body/sender/country; emoji, variable-length names, links and required opt-out can change the count.

Audience estimates are not always one uniform length. Compute per-recipient resolved lengths without exposing contact data to unauthorised authors, sum reservation units and show a conservative range/upper bound where required. If final content exceeds approved budget, pause for review rather than surprise top-up. One retry/timeout cannot consume twice. Do not use provider auto-transformation without reflecting the actual resulting estimate.

A one-way sender preview says **Replies aren't monitored. Use the link to manage your booking.** Place this explanation in setup/review, not as a misleading Reply STOP instruction. UK promotional sends require a working appropriate opt-out; a verified Taplo-hosted preference link can be assessed for the chosen one-way sender. Two-way messaging/STOP handling is a separate confirmed sender/channel capability, not automatically included. Review country/provider terms and actual legal suitability before enabling.

## Copy catalogue: generated facts stay protected

| Template | Subject / lead | Body/action pattern |
| --- | --- | --- |
| Booking accepted | Your appointment is confirmed | Your appointment with {business} is {date} at {time} {timezone}. {permitted_location_summary}. Manage booking |
| Reminder | Your appointment is tomorrow | A reminder of your appointment with {business} on {date} at {time}. View details or make a permitted change |
| Booking changed | Your appointment has changed | Show actual new facts and clearly identify what changed; View booking |
| Cancellation | Your appointment is cancelled | Show cancelled state, relevant money outcome separately; View cancellation |
| Refund initiated | Your refund is processing | {amount} refund requested for {reference}; avoid promising bank arrival; View refund |
| Refund complete | Your refund has been issued | Render only verified provider outcome and appropriate timing explanation; View payment |
| Collection ready | Your order is ready to collect | {reference}, actual collection place/window and necessary instructions; View collection details |
| Quote issued | Your quote from {business} | Scope/total/expiry from issued quote, not editable draft; Review quote |
| Merchant promotion | A few appointments are available this Friday | Actual offer/window, no invented scarcity; View appointments + opt-out |
| Rebooking promotion | Ready for your next visit? | Relevant service invitation for eligible audience; View times + opt-out |
| Taplo software receipt | Your Taplo receipt | Correct plan/period/tax/amount and receipt link; no merchant-customer payment conflation |
| Taplo payment issue | Your Taplo subscription needs attention | Verified invoice/payment status, service impact and safe billing action; no fake urgency |
| Team invitation | {business} invited you to Taplo Studio | Inviter, role scope, expiry and Accept invitation; no blanket access or marketing signup |

Timing-sensitive subjects are rendered from actual send time: a delayed reminder must not say tomorrow when it is now today. Locale/timezone and daylight-saving correctness belong to the rendering contract. Avoid fake urgency, unsupported savings, invented review ratings or promises that a refund has settled. Subject/body/preview text must agree.

## Test, approve and enable

Save draft → preview resolved sample → internal authorised test if configured → review real eligible audience, sender, timing and money/allowance → approve exact version → schedule/enable. The visual reference does not actually send a test or message. Production test sends go only to authorised test destinations, are rate limited, labelled appropriately and cannot validate a real customer's private link. A successful preview/test is not legal approval or guaranteed deliverability.

Editing approved content, audience, channel, offer or timing invalidates the relevant approval. Enabling an automation records its trigger/rules/version and explicit authority. Suggestion acknowledgement is not approval. For a solo owner, compose and approve can be the same person with a deliberate review; team authors can prepare without permission to publish/spend. Basic role templates do not require Business; custom composition is distinct.

Delivery history shows Queued, Provider accepted, Delivered where supported, Suppressed, Failed and Needs checking. Show the useful reason/next action, not provider stack traces. Resending re-evaluates status/permission and current facts. Operational fallback uses an allowed available channel and does not reveal private details. Marketing does not jump from an opted-out email to SMS.

## Taplo's own workspace

Taplo staff use a separately scoped platform Communications workspace in Console. Tabs: Service notices, Owner education, Customer marketing, Templates and Delivery. A marketer cannot select every merchant's private customer database. Service incident/security/billing templates have protected event data and restricted authority; product upsells are marketing. Support may inspect a redacted relevant delivery case without editing campaigns; finance manages software billing without arbitrary list export.

Approval record includes principal, scope, revision, audience definition, schedule and authorised budget. Send jobs re-check membership and policy. Platform and merchant suppression lists are independently scoped, with appropriate provider safety suppression layered above them. Two-factor/step-up, least privilege and logged exports protect staff tooling. This design remains subject to actual legal assessment, provider limits and implemented access tests.

## Exact screen/state packet still needed for each family

Each template/editor family needs populated mobile/desktop/light/dark/keyboard states and source records, schema/command/error/permission contracts, missing fields, queued edit/cancel races, unknown provider acceptance, wrong sender, zero audience, credit/quota exhaustion and member revocation. The supplied reference demonstrates selected composition/edit/preview/review states only. It is not every final Studio/Console screen or a working messaging backend.

Sources: https://www.twilio.com/docs/glossary/what-sms-character-limit ; current ICO electronic-mail guidance and source catalogue in COMMUNICATIONS-AND-MARKETING. Checked 3 November 2026. All template wording above is original proposed Taplo copy and needs context-specific review.
