# 50 · Overlay families and interaction depth

Working contract · Extends specs 04, 32, 35 and 45. Products are one member of the overlay system.

## Choose by task

| Family | Examples | Required content and actions |
| --- | --- | --- |
| Information/detail | Product, service, class, team, delivery, opening times, policies | Clear task title, concise facts, progressive detail, relevant next step |
| Choice | Product option, staff, time, location, fulfilment, filters | Current value, constraints, price/time impact, explicit apply where necessary |
| Multi-step transaction | Booking, quote, checkout, membership | Step and Back, preserved input, full total/terms before commitment, authoritative outcome |
| Relationship | Message composer, rewards, review, report, customer help | Correct merchant/record context, privacy, eligibility, acknowledgement |
| Sharing and handover | Share/QR, install, Wallet preflight, NFC/device handover | Destination/purpose, platform-specific next action, return and fallback |
| Owner configuration | Asset upload, block settings, domain, NFC claim, preview | Scope, inheritance, validation, saved/draft state, recovery |
| Consequential confirmation | Cancel booking, refund, delete, discard edits | Exact impact, reversible alternative if available, explicit destructive action |
| Transient feedback | Saved, copied, added, connection restored | Brief status; no modal and no interruption |

Simple forms can fit a sheet. A long checkout/calendar/resource task may expand into a focused route using the same visual system. Do not cram every feature into a tiny popup to preserve a visual gimmick. Full view remains available for keyboards, accessibility or long content.

## Shared shell and behaviour

Same rounded geometry, stable close position, sufficient safe-area clearance, task title, readable neutral text surfaces and restrained owner treatment. Clear / Colour cap / Split tone apply across eligible merchant overlays. System security, permissions and Console confirmations retain platform safety styling. Payment, Wallet and native share controls follow their provider.

One active overlay with an internal navigation stack. Product → option → bag or service → time → details → review replaces/advances content; avoid piled-up nested sheets. Back reverses one step, restores values and announces the new heading. Close exits the task; it does not mean Back. Use an actual labelled Close control; native back and Escape follow the same state rules. A drag handle alone is never the only way out. Desktop popover, mobile sheet and focused route share state semantics.

Capture opener, focus return, originating route, merchant/offer ID and version, filter/query/list position, unsaved values, cart scope and task step. Dialog opening moves focus into relevant content; closing returns it to the correct opener or a safe surviving heading. Parent is inactive while a modal is open. Do not announce every transient layout update. Re-opening a completed task does not replay its transaction.

## Before closing

Reading product details closes immediately. Added bag items remain. Unsaved message/quote/configuration asks once whether to keep editing or discard; optional durable drafts must have a clear retention policy. A selected uncommitted time is not a confirmed booking. Expiring holds show the real expiry and release behaviour. Payment in flight gets a safe “check status” recovery path; closing UI never assumes a charge was cancelled. Submit guards and idempotency prevent repeat bookings/payments/messages.

## Booking details

Resolve service → delivery mode → eligible location/coverage → staff preference/resources → date/time → required customer details → policy/deposit/full total → review → payment if needed → actual request/confirmation. Order can adapt to capability constraints. Show timezone, duration, lead time, travel/setup buffers, capacity, price changes and cancellation terms when relevant. No false availability, no “Booked” before authoritative confirmation. Slot loss preserves details and offers valid alternatives. Reschedule checks availability before releasing the old appointment; failure preserves the original. Cancellation reflects actual policy and refund state. Calendar, Studio, Activity and reminders consume the same appointment version.

## Wider acceptance examples

Options change price and availability before Add. Device keyboard does not cover primary action. Validation targets the relevant field. Closing composer with text prompts; closing empty composer does not. Browser Back restores Explore query and list position. Error retry preserves form values and does not duplicate effects. Direct item URL works without an already-open parent. Permissions denied leave a useful manual route. Deep links cannot expose another customer's conversation. Popup variants change appearance without changing wording or behavioural guarantees.
