# Design contracts and category adaptation

Working recommendations, not final branding or final screen designs. Existing compositions and blocks may change. Design should preserve a compact mini-site while giving each activity an appropriate working view.

## Current direction

The block-first directive and specs 31–34 govern the public page, horizontal product shelves and contextual popup system. Earlier editorial website imagery is superseded. The business identity is flexible; the block/action grammar remains recognisable.

## Three design layers

1. Product system: navigation, typography hierarchy, spacing rhythm, focus/error/disabled states, status vocabulary and task flow. Taplo owns consistency and accessibility here.
2. Business identity: logo, photos, colours, curated typography, composition, emphasis and section order. Owners control identity within safe constraints.
3. Transaction shell: seller identity, price, availability, selected offer, terms, progress, errors and confirmation. It should inherit enough branding to feel continuous while retaining predictable controls and trustworthy information.

Customers should not have to relearn where the total, Back button or confirmation lives for each merchant. Owners should not have to make every business page look identical to achieve that consistency.

## Component contracts

| Component | Required content and behaviour | Critical states |
| --- | --- | --- |
| Business identity | Name, relevant area/delivery, visual identity and primary action; optional verification label with precise meaning | Missing image, long name, closed, temporarily unavailable, restricted |
| Offer summary | Title, relevant image, truthful price basis, type and availability; one clear action | Fixed/from/quote/free, sold out, unavailable, archived link |
| Item detail | Canonical offer facts, relevant options, seller, fulfilment/time implications and primary action | Loading, available, option missing, price changed, no longer available |
| Appointment selector | Service/location/staff context, date and eligible times with time-zone clarity | No slots, staff unavailable, conflict, hold expiry, changed price |
| Group session selector | Specific session, remaining availability, seat quantity and attendee requirements | Full, waitlist eligible, insufficient seats, cancelled session |
| Quantity/variant selector | Clearly labelled choice and exact resulting price/stock | Required selection, invalid combination, stock decreased |
| Quote brief | What the merchant needs, attachments and response expectation | Draft, validation error, submitted, clarification requested |
| Cart summary | Merchant, lines, options, fulfilment and complete calculable total | Invalid item, unavailable fulfilment, total changed, separate checkout needed |
| Review/commit action | Exact commitment, payment amount/due later, applicable terms and understandable action label | Ready, processing, declined, unknown result, recovery |
| Activity item | What/which business/status/date or delivery/next action | Awaiting decision, upcoming, preparing, ready, completed, cancelled, issue |
| Owner work item | Why attention is needed, relevant customer/offer, deadline, assigned owner and next step | New, assigned, waiting, failed action, resolved |
| Form field | Visible label, suitable input, helper only when useful, associated error | Empty, filled, invalid, disabled with reason, read-only |
| Toast/status message | Brief result; no essential-only information that disappears | Success, retryable failure, delayed action |
| Confirmation | What was committed, paid/due, next step and private activity access | Confirmed, request received, payment pending; never interchangeable |
| Case timeline | Actors, timestamps, evidence permissions, owner and next required action | Waiting, deadline approaching, action needed, resolved, reopened |

All components have keyboard and touch paths. Colour supplements explicit labels. Loading placeholders should preserve layout; errors explain recovery and retain meaningful work. Disabled controls need understandable reasons when the action matters. Do not add an information icon beside every ordinary label.

## Status vocabulary

Keep separate domains separate. An order can be paid and unfulfilled; a booking can be confirmed and partly paid; a refund can be approved and processing; a case can be waiting while a chargeback is under review. Display the statuses that answer the user's immediate question, with detail available. Avoid one global “complete” flag that hides these distinctions.

## Adaptation by operating need

These are proposed examples for testing, not eight separately built applications or a promise to launch every vertical at once.

| Business pattern | First useful customer action | Studio emphasis | Extra operational facts |
| --- | --- | --- | --- |
| Barber plus retail | Book a cut; buy a styling product | Today's appointments, gaps, collection orders | Staff skills, buffers, stock, deposits/change rules |
| Maker plus workshops | Buy an object; choose a workshop session | Parcels, collection and attendee lists | Variants, lead time, seat quantity, firing/material information |
| Trades/mobile service | Describe the job; approve a quote | Requests, quotes and scheduled visits | Address/service area, travel feasibility, scope, parts and balance |
| Tutor/coach | Arrange a session; buy a resource/package | Sessions, learners and entitlements | Payer/learner roles, recurrence, online delivery, progress privacy |
| Photographer/creative | View work; request a scoped service | Enquiries, quotes and delivery milestones | Package scope, usage/deliverable terms, deposits and files |
| Detailer/garage | Select a vehicle service; arrange fitting | Jobs, bays/equipment and collection | Vehicle context, resource time, part compatibility and stock |
| Food collection business | Choose items; arrange collection | Order preparation and collection windows | Preparation limits, availability, product information and relevant food obligations |
| Wellness practitioner | Book an eligible service | Appointments and restricted customer information | Consent, professional requirements and sensitive-data boundaries; specialist validation before launch |

A business may combine these needs. Category recommends vocabulary and defaults; capabilities supply actual rules. A second capability can reveal an additional working view without changing the business identity or replacing its page.

## First owner-screen sketches in words

Today: urgent work first, then upcoming work, then optional suggestions. A new owner sees the shortest path to a usable offer, not fabricated analytics.

Offers: one list with clear type and status, quick filtering when volume requires it, and an Add offer action that asks what the customer is getting. Type-specific editors expose necessary fields in a sensible order.

Page: a real-content preview and a small set of outcome controls — Look, Brand, Content and Order. Advanced choices are available after the owner understands the composition. Editing a displayed offer navigates to its source record.

Calendar: appointment/class/block views with agenda on small screens; scheduling exceptions and impact previews close to the relevant time. Calendar is not where stock, returns or general business identity are edited.

## Design validation

Use realistic extremes: zero offers, one offer, many offers, long names, several staff, missing photos, multilingual text, interrupted checkout, slow network and keyboard-only operation. Ask owners to explain the difference between changing a look and changing an offer. Ask customers what happens after the primary action before they press it. If their expectation is wrong, fix the hierarchy or wording before adding visual decoration.
