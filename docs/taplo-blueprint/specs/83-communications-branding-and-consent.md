# 83 · Communications, branding and consent

Current continuation · 2.4: CUSTOMER-WEB-AND-ACQUISITION, COMMUNICATIONS-AND-MARKETING, TRUST-REVIEWS-AND-REPORTING and LEGAL-PACK-INDEX deepen these rules. Their supplier, consent, review/report and publication decisions supersede earlier open-ended wording. Read the explicit evidence and legal readiness limits.

Working edition 1.2 · 3 November 2026 · Recommendations extending 18, 46, 48, 52, 66 and 75. Resend/Twilio are now working delivery choices; no campaigns were sent.

## Recommended brand relationship

Merchant-led operational messages, Taplo-led platform messages. A booking email can show the merchant's approved logo/name, restrained accent, appointment facts and one action, with a clear Sent through Taplo footer. This recognises the actual business without pretending Taplo is white-labelled. Taplo account security, software billing and platform notices use Taplo branding.

If a merchant supplies a wordmark containing its name, do not repeat the same display name immediately beside it. If the logo is absent/unusable, show the name once; never invent initial avatars. Accessible text still names the sender. Payment receipts identify the actual seller and required details regardless of the decorative branding.

Neutral high-contrast email body; approved accent tokens only; no merchant background photograph behind essential instructions. Light/dark email rendering is tested independently of app themes. Plain-text alternative, useful alt text, text fallback for blocked images and a button whose destination is understandable without colour. Avoid confidential service/health details in subjects, SMS or lock-screen previews.

## Sender identity is not just a logo

Initial recommendation: verified Taplo sending domain, recognisable display name such as Chapter Barbers via Taplo, authorised merchant Reply-To where monitored, and explicit support ownership. Never use an arbitrary merchant domain in From before authentication. Connecting a website custom domain does not authenticate email sending. If custom email domains are later offered, document DNS/authentication, bounce handling, ownership, reputation and departure separately.

Do not route customer replies into an unmonitored no-reply address while promising they can reply. A Reply-To address alone does not create a Studio conversation: inbound processing needs an explicit integration, correlation and attachment/security design. Without that feature, state the real reply route. Provider receipts must not conflict with Taplo confirmations; choose one owner for each message purpose.

## Message catalogue

| Purpose | Brand and recipient | Trigger and guard | Destination |
| --- | --- | --- | --- |
| Verification/security | Taplo → account holder | Actual security/account event; short-lived token | Safe account action |
| Booking confirmation | Merchant via Taplo → authorised customer/payer | Confirmed booking, not browser redirect | Booking details/manage |
| Appointment reminder | Merchant via Taplo → appropriate contact | Current confirmed booking; current time/version | Directions/manage/join |
| Deposit receipt/balance request | Actual seller → payer | Verified payment or agreed balance due | Financial detail/payment action |
| Cancellation/refund update | Merchant context → affected customer | Committed status; distinguish refund initiated/completed | Outcome and support |
| Order collection/delivery | Merchant context → customer | Actual fulfilment state | Instructions/tracking |
| Quote or variation | Merchant context → authorised decision maker | Issued current proposal | Review and accept/decline |
| Team invitation | Merchant relationship plus Taplo access context → invited person | Pending scoped invitation | Accept and authenticate |
| Offer/promotion | Named merchant → eligible audience | Marketing permission and suppression checks | Offer with unsubscribe |
| Taplo recommendations | Taplo → eligible customer | Separate platform marketing basis/preferences | Relevant discovery, opt-out |
| SaaS billing/domain renewal | Taplo → authorised owner/billing contact | Actual subscription/domain lifecycle | Billing/renewal detail |

A reminder containing an unrelated sales offer may become marketing. Classification follows content/purpose, not a developer's transactional flag. Email delivery-provider stream labels are not a legal determination. Keep operational and marketing pipelines/reputation separated; Postmark demonstrates separate message streams, but is only an evaluated pattern/provider candidate. [R50–R51]

## Marketing and SMS controls

Merchant marketing consent is sender-, purpose- and channel-specific. Saving a business, booking or accepting Taplo terms is not blanket marketing consent. UK individual subscribers include sole traders/some partnerships; do not treat every business contact as exempt. Where relying on a soft opt-in, all applicable conditions must actually hold; an imported address list is not sufficient. Store wording/version, timestamp, collection context, sender, channel, basis and withdrawal. [R50]

Studio Campaigns: choose purpose → select eligible audience → compose from controlled template → preview sender/body/link and segment estimate → show estimated cost → send test to an authorised test contact → review → schedule/send with permission. Document creation of a test-send action does not authorise actually sending messages during blueprint work. Re-evaluate suppression/consent and account status at dispatch, not only audience creation. A paused campaign cannot continue draining a stale queue.

SMS has a distinct sender strategy: supported country, registration where needed, sender type, replies and opt-out method. Do not promise Reply STOP on a sender that cannot receive replies; offer an appropriate working alternative. Separate carrier/provider suppression from product marketing preferences; provider blocks can also prevent service messages. Expose an honest alternative contact route. Verify provider/country rules before selection; do not import US-only requirements as universal UK rules.

Message length, Unicode, segment count, sender costs and delivery charges affect economics. Show estimate and spend cap, not unlimited free SMS. Rate-limit tenant sends and OTPs, protect against SMS pumping, and require approval for unusual volume. WhatsApp is a separate possible provider/consent/template integration, not an interchangeable SMS transport promised by a phone-number field.

## Delivery engine and Studio feedback

Persist a notification intent from the committed business event; classify purpose, evaluate permissions/preferences, render an immutable template version, enqueue and track each channel attempt. Deduplication key includes tenant, event, recipient, purpose and relevant event version. A rescheduled booking invalidates stale scheduled reminders. Cancellation should not emit a later See you tomorrow reminder from an old queue entry.

Distinguish Queued, Provider accepted, Sent, Delivered where supported, Failed and Suppressed; none proves the customer read and understood it. Twilio status callbacks support delivery-state tracking, not a universal read guarantee. [R52] Retry transient failures within a deadline; avoid duplicate sends after uncertain acceptance; record correlation IDs and reconcile. Never keep sending a late reminder after the appointment has ended.

Studio shows outcome and useful action, not raw provider stack traces. Console sees redacted attempts, suppression reason, template version, provider status and authorisation for a resend. Resend rechecks state and consent. No support operator may bypass a marketing opt-out to improve delivery statistics.

## Template customisation

Business identity and theme come from one source. Owners may edit greeting, permitted explanatory paragraph and sign-off; protected seller/payment/time/cancellation facts are generated from the agreement. Preview with realistic long names, no logo, international phone, missing optional data, light/dark and plain text. Validate token use; block a template that omits a critical payment or access instruction. Version and audit template changes without rewriting previously sent evidence.

## Acceptance

No-logo sender; bounced payer email; guardian and learner contacts; appointment moved after reminder queued; customer opted out of promotions but needs booking details; carrier-blocked number; mixed promotional reminder; wrong tenant reply correlation; custom-domain removal; malicious template markup; duplicate callback; campaign cancelled mid-dispatch; refund still pending. Each needs an owner-facing outcome and Console recovery without leaking another merchant's data.
