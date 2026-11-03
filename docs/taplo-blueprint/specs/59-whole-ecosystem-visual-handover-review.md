# 59 · Whole-ecosystem visual handover review

Edition 0.9 · Presentation must make the shared system understandable at every handover. Spec 47 owns data/state contracts.

| Journey | Customer surface | Studio surface | Console/recovery | Visual continuity rule |
| --- | --- | --- | --- | --- |
| Publish offer | Merchant widget, Explore projection, canonical detail | Offer editor → Page preview → publish result | Publication/visibility problem | Same identity, image, price mode and delivery mode; draft marker stays internal |
| Buy product | Detail → merchant bag → checkout → Activity | Order preparation, inventory and fulfilment | Payment/order mismatch | One reference; totals and pending/completed wording agree |
| Book service/class | Service → eligibility → time → review → confirmation | Calendar, attendees/resources, Today | Missing/duplicate/changed appointment | Same timezone, venue, duration and status |
| Request quote | Intent/details → acknowledgement → quote | Enquiry → scoped quote/version | Message/acceptance issue | Request is never visually promoted to confirmed work |
| Message about work | Linked record and conversation | Customer thread and related work | Permission-bound case/escalation | Recipient and context preserved; no repeated avatar/name clutter |
| Amend/cancel | Review impact → authoritative result | Updated calendar/order with consequences | Refund/policy exception | Old and new agreement distinguishable; no success before commit |
| Rewards | Benefit, progress and redemption | Rules, eligible transactions, adjustments | Disputed earn/reversal | Same ledger-backed value; no decorative progress that lies |
| Wallet | Pass preview → official add → management | Pass appearance/eligibility | Issuance/update help | Recognisable merchant, safe contrast; OS surface remains OS-owned |
| QR/NFC | Immediate business/offer destination | Claim/configure → verify → test scan | Lost/claimed/wrong-target issue | Destination identity obvious; stable link survives ordinary rebranding |
| Domain | Branded custom-domain page | Search/connect/buy → verify → renew/exit | Registrar/DNS/security issue | Clear ownership/state; no fake “connected” after order accepted |
| Install/deep link | Useful web task → optional app handover | Relevant owner-phone task when applicable | Broken-route/device help | Same record/step; sign-in preserves safe intent |
| Return/refund/dispute | Eligibility, evidence, progress, outcome | Actionable case and financial state | Authorised evidence/work queue | Refund pending/completed and dispute states stay distinct |

## Operational visual experience

Studio Today prioritises work, not decoration: the task, why it matters, deadline and next action. Calendar shows the same commitments; resources/staff are a view of operational truth. Offer editing separates facts from appearance. Page design starts with composition/look, then branding and content; advanced overrides disclose scope and Reset. Preview includes product/booking/share/Wallet states rather than only the idle page. Draft, published and unsaved are clearly different; undoing an editor change does not imply reversing a completed customer payment.

Console starts with triage and a linked case. It shows permitted evidence, timeline, responsible operator and next action. Role restrictions must be visible where meaningful without cluttering every row. Financially consequential actions need exact impact, reason and audit; a “fix everything” button cannot overwrite provider truth. Mobile Console may prioritise review/triage over dense evidence manipulation, with a clear route to supported full tasks rather than silently missing functions.

## External continuity

Review the full visual transition to payment authentication, Wallet, native share, calendar export, directions, email verification, domain confirmation and app stores. Clearly distinguish leaving Taplo from opening an internal sheet where useful. Return/cancel/failure retains the safe context. Do not promise these third-party screens match merchant styling. Links to private records request appropriate verification; public share cards contain only public details.

## Lifecycle and safety without clutter

Withdrawn listings, renamed merchants, expired domains, lost NFC items, removed team members and customer deletion requests all have user-readable outcomes across public/private surfaces. Historical commitments remain accessible according to policy. Show enough responsible-party information on transactions, receipts and support to make action trustworthy; suppressing redundant marketing branding must not remove required attribution. Automation reduces duplicate entry but cannot hide actual pending work or unresolved responsibility.
