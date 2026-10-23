# Marketing and route audit: round four

24 October 2026, Europe/London. Reviewed production version `4a08d1ffe3c163b21d6b4b2060c602ba18b0ebc8`; mutable alias `https://taplo-lilac.vercel.app`. Native browser accessibility inspection covered the homepage, product overview, all ten product routes, pricing and how-it-works. Visual screenshots were inspected for design, booking and vehicles in this pass, at the browser's 1280×720 viewport. That is not a complete mobile, full-scroll visual, keyboard or media-playback audit.

## M01 — catalogue copy is out of sync

Live `/product/design` says “Nine starting looks”, including in Works today. Homepage look switcher and current `src/features/page/themes/looks.ts` contain ten, including Folio. The design page also presents Journal and Clay while current display names are Mono and Terracotta. Stable internal IDs `journal`/`clay` can remain; customer labels and captures should follow the catalogue.

Correction: derive counts/display names and capture metadata from the current catalogue. A revised screenshot must be generated from current content and appearance, not relabelled over the old asset. Include this in the capture/manifest process so future additions don't repeat the mismatch.

## M02 — one status label incorrectly combines unrelated conditions

Design, services, team and gallery/reviews pages label plan restrictions “Needs a connection”. Examples include switching looks on Free, the Free service cap and choosing a person on Business. These are entitlement conditions. Sharing also uses “Needs a connection” for exact social previews, even though its explanation says other apps control and cache the result.

Source: ProductPage Status has only `works | needs`; featureState has the same binary shape. The rendered explanatory text says a clock switches on when a service is connected. A binary available/unavailable flag cannot express all these reasons honestly.

Correction: distinguish current availability, plan entitlement, connection/setup prerequisite, demonstration-only operation and externally controlled outcome. Keep the reason and useful next action visible. A small explicit presentation model may suffice; this does not require inventing a new entitlement/backend system. Preserve actual prices/plan rules.

## M03 — top-level promise contradicts the current demonstration

Homepage says Ready in minutes, Live in a few minutes, From a name to a shared page in eighteen seconds, and describes a booking landing in the owner's diary. How-it-works begins with a shareable-page promise and publish/share step, but its FAQ explicitly says accounts/public publishing are not connected and the page opens in this browser only. Sharing repeats that current public address limit. Pricing says nothing is charged and providers are unconnected, while its Pro summary is Take bookings and payments online.

These are inconsistencies between current rendered messages. Eighteen seconds describes the film length, not a measured real setup time. A plan entitlement can describe intended inclusion, but should not imply the capability is operational on this deployment.

Owner clarification after this finding: backend comes later; the frontend should aim at the intended live product and remain fully accessible for testing. Keep the intended product benefit and strong main action. Make current simulated action outcomes accurate in context; do not blanket-replace sales copy with technical/demo notices. Treat the timing and diary wording as claims to validate and the implementation flow as a complete future-live experience. Reuse capability truth across hero, stories, cards, FAQs and action results, not only the bottom status list. Do not expand this preparation brief into provider/account/payment implementation without scope from the owner.

## M04 — recapture and copy propagation are unfinished

The booking page headline says service/person/time, but its illustrated five-step strip omits the person screen. The inspected screenshot still includes older preview-mode text in tiny captured UI, while current source wording has changed. At the inspected viewport it is a horizontally extending sequence of miniaturised screenshots rather than a focused illustration of provider selection and outcome. The design page is another extending spread of old phone treatments. Vehicle artwork is more legible, but still presents static list/detail captures without demonstrating retained car context (which J03 shows is broken in the actual form).

Team page copy still says no-photo profiles use a silhouette, while the newest review commit specifically changes the expanded profile to hide an empty portrait. Verify exact summary/detail fallback behavior and write/capture it consistently.

Correction: give each capability a distinct visual job from CREATIVE-BRIEF.md, then recapture against the corrected journey. Use readable focal UI at final size. Keep the related captured states, labels and source version in a media manifest. These observations don't establish that every route has the same visual defect.

## M05 — enquiry delivery claims are stronger than the current local form

Enquiries says Every enquiry kept for the owner; Messages says it is kept in the owner's dashboard and Works now. The feature-status entry `enquiryInbox` requires no capability, while the inspected EnquiryForm uses the demo adapter and says the result stays in this browser. A visitor-local record is not proof of receipt by an owner on another device. J04 also records contradictory success text.

Correction: identify storage/recipient/delivery truth per mode. Use accurate demo confirmation and qualify marketing accordingly until shared owner receipt is demonstrated. Verify actual production path separately; do not label local same-browser persistence as remote delivery. No test enquiry or message was sent during this audit.

## M06 — readability claim exceeds demonstrated engine behavior

Design page says Text that stays readable and that Taplo adjusts unreadable colours. ENGINE-PROBE-R4.json reproduces white-on-white widget text and approximately 1.11:1 outlined-button text using the deployed version's source. The whole-page checks passing do not cover those effective widget surfaces.

Correction: fix/verify the effective-surface system and narrow copy to what is actually protected. Don't solve it merely by removing the claim while leaving unreadable customer pages possible.

## Route coverage and next visual job

| Route | Inspected in this pass | Required visual/content emphasis |
|---|---|---|
| `/` | Full accessibility content; earlier round-four visual reference | First useful business page; deliberate hierarchy; truthful next action; full-scroll/mobile and film still open |
| `/product` | Accessibility content and links | Useful overview with demonstrated tasks; don't describe disconnected reminders as current without context |
| `/product/design` | Content and top screenshot | Same content through genuinely different compositions; accurate names/count; effective styling controls |
| `/product/services` | Accessibility content | Scope and fixed/from/quote/free hierarchy; current service detail rather than just old page captures |
| `/product/enquiries` | Accessibility content | Channel/form choice, item context, accurate owner receipt and saved/sent result |
| `/product/booking` | Content and top screenshot | Service → eligible person → time; confirmed/request/enquiry; current readable UI |
| `/product/team` | Accessibility content | People/service relationship and deliberate missing-photo treatment |
| `/product/products` | Accessibility content | Product facts, destination/disclosure and actual enquiry behavior |
| `/product/vehicles` | Content and top screenshot | Matching stock/specs/status → item-specific enquiry |
| `/product/gallery-reviews` | Accessibility content | Useful photo viewer and clear attributed example, not invented proof |
| `/product/sharing` | Accessibility content | Real target/export behavior and limitation before relying on code/link |
| `/product/messages` | Accessibility content | Customer opens own app vs actual form receipt vs provider-delivered messages |
| `/pricing` | Full comparison content | Keep £0/£9.99/£19.99/£39.99 and entitlements; show readiness separately from included-plan status |
| `/how-it-works` | Accessibility content | Match actual steps/current result; resolve public-link contradiction |

The product menu's task groupings and ten feature routes are useful existing structure. Preserve what helps discovery. Legal links were visible throughout; legal page content itself was not reviewed here. Still open: complete phone/desktop visual traversal, menu keyboard/mobile behavior, full film playback, all interaction targets, physical-device checks and measured performance. Route text presence does not prove the associated feature works.
