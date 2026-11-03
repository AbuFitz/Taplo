# Customer journey audit

24 October 2026, Europe/London. Production identity at audit: `4a08d1ffe3c163b21d6b4b2060c602ba18b0ebc8`; see ROUND4-RECONCILIATION.md. Live interactions used fictional inspiration pages. No booking, enquiry, payment or outbound message was submitted.

## J01 — direct service booking skips provider choice

On `/inspiration/marlowe-and-finch`, open Signature cut (£34, 45 minutes), then “Book this”. The flow starts at Step 3 of 5, Choose a time. Back reveals Step 2, Who would you like to see?, with Anyone available and three barbers. The surrounding page describes choosing a barber before a time. Service detail also repeats price/duration between heading and fact blocks.

Source: `src/features/booking/ui/BookingFlow.tsx:49` initializes any valid preselected service to time, independently of eligible provider count.

Required behavior: define the direct-entry policy explicitly. If provider choice matters, show it before times; if Anyone available is the deliberate default, show that selection and a clear change action. Step numbering and Back must reflect the actual entry path. Preserve staff-specific entry separately. This is a context/hierarchy defect, not evidence that availability or booking persistence failed.

## J02 — direct solo-service Back is a no-op

On `/inspiration/ada-okafor-maths`, open Trial lesson (Free, 30 minutes), then Book this. The flow shows Step 2 of 4, Choose a time. Clicking Back leaves the same step and screen. No slot was selected.

Source: `BookingFlow.tsx:84` routes a time-step Back to `preService ? "time" : "service"` when there is no multi-provider branch. That sends this direct entry to its current step.

Required behavior: return to the preceding service/detail context, or omit a previous-step control where no preceding step exists and provide a clear dismissal. A visible Back control must navigate. Verify direct service, general booking, staff entry and solo/multi-provider branches with and without a selected slot.

## J03 — selected vehicle is lost from the in-page enquiry

On `/inspiration/aldous-motor-co`, open Volvo XC40 Recharge (£27,995; 2022; 14,200 miles; electric/automatic), then Enquire about this car. The dialog retains “Ask about Volvo XC40 Recharge”. WhatsApp/email links carry that topic. Expanding Send a message instead shows About (optional): Anything in general, and an empty message.

Source: `src/features/page/widgets/client.tsx:69` passes services and preselected service to EnquiryForm, but does not pass `topic` or an item identity. `src/features/booking/ui/EnquiryForm.tsx:21–32` models name/email/phone/message/serviceId only. Thus the car heading does not become part of the submitted in-page form data unless the user retypes it. No submission was needed to establish this mismatch.

Required behavior: preserve stable item kind/ID/title through the form and received record, including products and vehicles. A compatible explicit message prefix may be sufficient if that avoids an unnecessary backend expansion. Ensure enquiry refers to the same item after Back/retry. Test available/reserved/sold states without enabling an action on unavailable stock.

## J04 — local-only result language contradicts the main success message

Source-confirmed, terminal UI not triggered in the browser: EnquiryForm lines 49–51 render “Enquiry sent” and a promise that the business will reply, followed by smaller text saying it was saved only in this browser and the business was not emailed/texted.

Required behavior: the primary result must match the actual storage/delivery mode. A fictional local demonstration can show a saved demo enquiry and explain how real delivery would work only where supported. Do not promise the owner receives or replies to a record stored solely on the visitor's browser. Verify actual configured production behavior separately; this finding does not establish that a remote delivery integration is configured.

## Still unverified

Complete request/confirmed/enquiry branches; no-slots and stale/conflicting slots; validation/retry; timezone/DST; preserved fields; nested focus/scroll/keyboard; media, stock status transitions, owner receipt, sharing/export, persistence and physical devices. Source state handling and passing suite claims are not substitutes for these checks. These findings supplement the whole-product matrix rather than narrowing the redesign to four fixes.
