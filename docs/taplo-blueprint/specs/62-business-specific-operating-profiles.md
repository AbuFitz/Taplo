# 62 · Business-specific operating profiles

Edition 1.0 · Concrete proposed rules for four reference business models. A category recommends a profile; operating capabilities determine actual rules. No business is permanently constrained to a category.

## Shared configuration and precedence

Business timezone/currency and locations → capability configuration → offer settings → occurrence/date exception → committed agreement snapshot. An override cannot exceed resource capacity, break permissions or silently rewrite a customer agreement. Required fields appear because an enabled capability needs them, not because the category name implies everything. Save drafts with missing fields; publish/enable transaction only when the relevant readiness requirements pass. Explain exactly what remains to finish. Optional information stays skippable.

### Tutoring / coaching

**Model:** paying customer/client can differ from learner/participant. One payer may authorise several participants; one tutor may run private lessons and group sessions. This separation is supported by current TutorCruncher workflows [R1]; Taplo's design below is a recommendation, not a copy of its whole product.

Setup: subject/level; online/in-person; private/group; tutor/resource; duration; capacity; lesson or series; actual price/cadence; cancellation rule; contact route; joining-link disclosure; participant requirements. Do not collect date of birth, school, diagnoses or safeguarding information by default if the task only needs a learner name and level. Optional support information has restricted access and a defined purpose/retention. Parent-managed booking does not by itself settle the platform's obligations if children access the service; assess that scope against ICO guidance [R9].

Availability: intersect tutor, venue/equipment if used, term dates, exceptions, lesson duration and buffers. Recurring sessions use local time plus IANA timezone and explicit occurrences. Holidays/excluded dates are shown before purchase. One occurrence change does not silently alter the whole series. Group capacity counts participant seats, not number of payers. A family booking for two learners needs two eligible places and explicit participant assignment.

Customer: choose offer → eligible participant(s) → session/time → price/cadence and missed-lesson terms → review/payment/request → confirmation/joining details. Free introduction is a distinct offer and must not subscribe the customer to paid lessons. Quote-led tuition remains a request. A package purchase grants credits according to its rule; it is not automatically a weekly timetable or recurring payment mandate.

Daily work: tutor sees assigned lessons and only necessary learner details; owner sees attendance, cancellations, billing/credit status. Attendance and chargeability are separate outcomes. Late-cancellation impact is shown before cancellation; current competitors surface such distinctions [R2], but Taplo's charge rule still needs lawful approved terms. Credit reversals/refunds are separate ledger operations. Substituting tutors or changing a paid series communicates material differences and requires an appropriate acceptance path.

Acceptance: one guardian books two learners; another guardian cannot access them by matching a surname. Tutor sees assigned notes, fulfilment staff does not. One lesson is cancelled without deleting series history. Subscription cancellation does not erase remaining credits unless the agreed policy requires an explicitly disclosed expiry. Remote joining link is private, not in Explore/search metadata.

### Mobile repair / field services

Setup: supported services; booking versus quote mode; service coverage; work duration or assessment rule; travel/setup/cleanup; staff/vehicle/tools; customer access conditions; parts/compatibility information; price mode; deposit/balance rule and cancellation policy. A repair provider can sell goods too. Public page shows coverage, not a fictitious visitable office or customer work address.

Intake: service need, eligible vehicle/equipment identifier only when useful, service postcode/address at the appropriate stage, symptom/condition, access/contact and safety/immobility questions relevant to the service. Do not turn every category into FixNow's exact intake. Optional attachments have safe upload handling. Unsupported/out-of-area requests get an honest explanation and enquiry route if the merchant accepts them; never auto-confirm an ineligible job.

Availability: a duration-only slot is insufficient if jobs require travel. For an initial release use explicit service zones and conservative configured travel buffers; do not claim route optimisation. Future routing must evaluate the predecessor/successor job, working hours, traffic assumptions and uncertainty before confirming. Booking time can be an arrival window with a clear label instead of a fake exact arrival. Required vehicle/equipment resources cannot be double-booked.

Customer: eligibility → scope/price mode → location/access → eligible time/request → deposit/full terms → review → confirmed/requested. Fixed diagnostic fee and possible later repair quote are separate agreements. A quote accepted does not reserve staff/time unless the acceptance flow explicitly commits it. Parts/fitting combinations check stock, compatibility and location together. Scope/price additions require a new approved variation before work/charge; no silent open-ended authorisation.

Daily work: route/agenda, customer access, job status, evidence/notes, quoted variation, payment/balance and completion. Relevant staff can record operational evidence; financial authority remains separately scoped. Customer absent, unsafe site, wrong part, overrun and provider cancellation each have clear reschedule/charge/refund review, not an automatic punitive fee.

Acceptance: adjacent jobs cannot consume impossible travel time. Coverage match is not a guarantee of resource availability. Arrival-window copy is consistent in Calendar, Activity and reminders. Changing service address rechecks coverage/travel/price before changing the commitment. Sensitive customer location never becomes a public map point.

### Retail / physical goods

Setup: product, variant options/SKU, price/tax configuration, tracked/untracked/made-to-order stock, dispatch location, delivery/collection eligibility, realistic lead time, product information and returns policy. Variant stock is one source across blocks/collections. Shopify's documented inventory categories reinforce the need to distinguish sellable, committed and unavailable units [R4]; Taplo's exact inventory contract is in spec 63.

Customer: choose valid variant/quantity → scoped bag → delivery/collection/fitting if eligible → address/contact → shipping and full total → review/pay → order record. Adding to a bag does not promise indefinite stock. Payment checkout uses finite holds and revalidation. Made-to-order cannot masquerade as ready-to-dispatch; customer sees production estimate/terms. Do not introduce cross-merchant basket settlement merely to look convenient.

Daily work: accepted order → preparation → collection ready OR dispatch → completed; partial fulfilments explicitly track line quantities. Returns have authorisation, received/inspection/disposition and refund steps. Returned goods go back to sellable stock only after the applicable disposition decision. Refund and restock are independent. Changing an image/title does not change a previous order's snapshot.

Acceptance: two buyers race for the final unit; one wins or gets an explicit recoverable result without double-selling. Removing an offer preserves receipts. Partial return does not refund more than its remaining eligible amount. Mixed collection/delivery is either supported with explicit fulfilment groups or rejected before payment; never silently split charges/fees.

### Workshops / events / classes

Setup: offer/template, dated occurrences, timezone, venue/resource, host, capacity, ticket/participant type, included materials, series versus single occurrence, booking window, minimum-run policy if used, cancellation/transfer and accessibility information. Course purchase spanning all dates is not the same product as independent class tickets. Current Bookwhen documentation demonstrates that waitlist promotion itself needs ordering/expiry/capacity behaviour [R3].

Availability: seats require both participant capacity and necessary room/equipment/host. A quantity of three is one payer and three places; distinguish named attendees where needed. Use one atomic capacity reservation across required constraints. Optional ticket allocations do not create extra total room capacity. Waitlist is a queue, not a confirmed booking or charged place.

Customer: select occurrence/course → quantity/eligible participants → important requirements → review/full price → payment → confirmation. Waitlist clearly states notification/offer conditions. Proposed default: FIFO eligibility, a time-limited offer for the requested quantity, no automatic charge. If a two-seat request cannot fit a one-seat opening, explain the configured fairness rule; do not silently split the party. Provider cancellation notifies attendees and applies the agreed refund/transfer path.

Daily work: attendee roster, participant count, materials/resources, check-in, no-show, transfer/cancellation and message. A changed venue/time requires a preview of affected commitments and communications. Editing a template affects future generated occurrences according to an explicit scope choice; it must not delete active waitlists or accepted tickets invisibly.

Acceptance: owner reduces capacity below committed seats → blocked with a resolution list, not forced overbooking. Waitlist offer expiry releases capacity once. A course attendee can distinguish all-date commitment from individual ticket rights. Class plus product collection shares the merchant identity but reserves goods and capacity under separate constraints.

## Cross-profile rules

Digital memberships, gift cards, vehicle stock, regulated services and complex subscriptions need their own evaluated contracts before enablement; they are not assumed fully defined by the four profiles. Customers, resources, money, communication and appearance remain shared. Capability presets reduce setup while keeping future expansion possible. No additional data field or charge is introduced only because a category template happened to include it.
