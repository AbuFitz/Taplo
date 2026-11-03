# Taplo · Whole-ecosystem visual experience guide

Working edition 0.9 · 31 October 2026 · All recommendations remain revisable.

This guide connects composition, behaviour and visual review across customer Taplo, Studio, Console, public business spaces and external handovers. It expands the blueprint; it is not a claim that every screen or provider integration has been produced.

**Open [VISUAL-EXPERIENCE-ATLAS.html](VISUAL-EXPERIENCE-ATLAS.html) for 13 layout schematics with mobile/tablet/desktop and light/dark previews.** The atlas explains regions and hierarchy. It is deliberately labelled as a schematic, particularly the map viewport; finished UI, real geography and actual provider/device evidence remain distinct work.

## The visual directive

Frameless platform layouts, recognisable merchant blocks, horizontal product shelves and beautifully readable elevated popups. One deliberate identity per context; optional genuine assets; no silently generated initials. Platform navigation stays calm while the merchant's own space carries personality. Light and dark are personal app settings. Rich customisation has clear scope, safe defaults and reversible choices. Nothing becomes an approved final colour, price or launch commitment because it appears in a mockup.

## Screen-family coverage map

| Family | Composition and behaviour to design | Specific details that must not disappear |
| --- | --- | --- |
| Customer first launch | Public browse or exact task entry; optional welcome | No forced permissions, account or installation for ordinary browsing |
| Signup/sign-in/recovery | Focused verification with return intent | Wrong contact, expired code, resend, existing account, shared device |
| Optional preference step | Small theme/area choice after task recovery | System default, Light/Dark, Skip, later Settings route |
| Explore list | Search + relevant filters + business windows | Query/area context, no images, many capabilities, saved state |
| Explore map | Mobile map/selection; desktop results rail/map | Coverage/private/online semantics, attribution, selected state |
| Location search | Manual area suggestions and explicit device request | Ambiguity, approximate/denied permission, retry, privacy |
| Search/filter results | Applied filters, count, recoverable empty | Clear query versus clear all; stale-response protection |
| Saved | Deliberate businesses/offers; useful return | Unsaved/deleted/paused items and accurate empty state |
| Merchant identity/page | Flexible block composition with one principal identity | Name-only/wordmark/photo, long name, dark/light shell transition |
| Product shelf/browse | Sideways bounded rail; optional focused catalogue | Continuation cue, keyboard, retained shelf position |
| Product detail/options | Useful essential facts, selection, price, Add | Image fit, sold out, option validity, stock/price changes |
| Service/quote detail | Delivery mode, price mode, scope, eligible next action | Booking versus enquiry; no false confirmation |
| Booking/class selection | Service/resources/date/time/details/review | Timezone, capacity, travel/setup, joining/location information |
| Bag/checkout | Merchant lines, fulfilment, required details, full total | Delivery/collection/fitting eligibility; cart persistence boundaries |
| Payment handover | Review, provider challenge, return/status | Pending/uncertain/failure reconciliation and duplicate guard |
| Confirmation/receipt | Authoritative result and management route | Correct merchant/reference, terms snapshot, printable output |
| Activity overview | Attention then meaningful records | Real deadlines, no fabricated personal examples or urgency |
| Order/booking/quote record | Status/timeline and relevant management | Cancel/reschedule/refund/accept impacts; historical continuity |
| Membership/package | Entitlement, usage, cadence and manage | Renewal/cancellation, remaining credits and payment state |
| Messages | Recipient/context, thread, composer | Draft, attachments, send uncertainty, report/block, keyboard |
| Rewards | Real balance/eligibility and clear next step | Reversals, redemption, expiry; no false progress graphics |
| Reviews/reporting | Eligible contribution, moderation outcome | Verified relationship rules, edit/report, no invented ratings |
| Wallet | Eligible pass design, preflight, official handover | Issued/updated/installed states distinct; readable brand treatment |
| Share/QR | Public destination, copy/native share/download | Clipboard failure, public/private distinction, actual return |
| Install/deep link | Useful explanation and native/web fallback | No gate, correct task restoration, sign-in interruption |
| Account/settings | Discoverable section hierarchy | Appearance, notifications, privacy, region, addresses, help |
| Permissions | Just-in-time rationale and fallback | Permission denied versus account preference; no repeated nagging |
| Customer support | Linked issue, evidence and case status | Financial/merchant/platform responsibility, no duplicated story |
| Owner onboarding | Business comes to life through supported optional steps | Skip, missing imagery, recommended look, no accidental publish |
| Studio first run/Today | Next meaningful setup/work task | Relevant capability tools; empty revenue charts not the focus |
| Studio offers | Type-aware source editors and useful lists | Shared record, price/delivery mode, variants, visibility |
| Studio calendar | Day/agenda/week/resource compositions | Overlap, conflict, blocked time, reschedule and timezone |
| Studio fulfilment | Queue, order detail, preparation/dispatch/collection | Partial fulfilment, stock reservation, failed handover |
| Studio customer/team | Permission-scoped relationship and work history | Sensitive notes, role-limited data, staff/resource availability |
| Studio page/design | Scope → composition/look → brand → optional advanced | Inherited/override, Reset, Undo, actual popup previews |
| Studio preview/publish | Exact draft/public state and outcome | No automatic publish; failed publish preserves work |
| Studio money/policies | Clear financial records and responsible actions | Pending balances/refunds, fees, role checks, real totals |
| Studio domains | Search/connect/buy/verify/renew/exit | Registrant/ownership, email DNS, pending provider state |
| Studio NFC/products | Purchase/claim/configure/test/manage | Stable destination, lost item, device capability, private proof |
| Console triage/case | Queue, linked detail, evidence and action | Operator role, privacy, audit, responsibility and deadline |
| Console exception | Payment/dispute/moderation/access recovery | No fake success or provider-truth overwrite |
| External channels | Email/push/native/provider/print | Same wording/status/reference, safe public/private payload |

Each row inherits cross-cutting requirements below and maps to the detailed specifications. A row records intended design coverage, not completion of every composition.

## Connected visual stories to produce

**Discover and buy:** Explore query → eligible result → same merchant mini-space → product sheet/options → scoped bag → fulfilment → full review/payment → confirmed or pending result → customer Activity → Studio preparation → support if needed. Preserve identity, price/stock version, fulfilment choice and return origin. Refunds connect back through the same financial/rewards records.

**Arrange a service:** direct QR/NFC or Explore → service/request mode → coverage/location → time/resource eligibility → customer details → policy/deposit/review → request or confirmed booking → Calendar/Today/Activity/reminder → reschedule/cancel or message. Every stage distinguishes intention from commitment.

**Return to a relationship:** save or completed work → find business/record → contextual reorder/rebook/reward suggestion → inspect current terms → new deliberate commitment. No silent marketing consent or autocharge. The customer understands what carried forward and what must be chosen again.

**Owner builds once:** onboarding → supplied identity and optional assets → type-aware offer → compact page composition → preview across sizes and active overlays → publish → public/Explore share the same facts → customer action appears as work. Studio theme changes the workspace, not the published business design.

**Physical/external handover:** owner claims genuine NFC item or configures pass/domain → customer reaches stable destination → optional native action → return/recovery. Check actual external state, safe destination, provider branding limits and failure path. Visual polish cannot hide an unresolved claim, domain verification or pass issuance.

## Design details that apply everywhere

- Identity: principal name/wordmark once, genuine optional assets, meaningful merchant/platform/support attribution.
- Colour: semantic app tokens; separate merchant tokens; no provisional green lock; Light/Dark/System in Settings.
- Layout: mobile/tablet/desktop recipes; open hierarchy; bounded forms; one primary scroll; useful density, not more panels.
- Overlays: all task families; clear Back/Close, safe retained progress, same rounded grammar, no stacked-sheet maze.
- Input: keyboard/safe-area, focus order, text scaling, touch/keyboard parity, accessible control names and error targets.
- Content: truthful statuses, clear price/time/terms, long names/localisation, no decorative ambiguity about outcomes.
- State: empty/loading/pending/error/offline/conflict/permission/expiry/success and recovery where applicable.
- Motion: task continuity, no whole-page zoom gimmicks, reduced-motion support, no autoplay shelves.
- Continuity: stable record and return intent; correct account/business, private cache boundaries, no duplicate submissions.
- Trust: appropriate responsible party, safe public/private share, privacy-preserving discovery and support access.

## Smartness visible to the customer

Make the next useful action obvious from actual commitments; let customers resume safe drafts, return to businesses and repeat eligible work with current terms. Show why a result or reminder is relevant. No forced AI chat, opaque score or notification noise. New users get a calm start; established users get continuity. Smart defaults are reversible. Sensitive or financial decisions remain deliberate.

## What is and is not decided

The user's preference establishes Light/Dark settings and a careful full-ecosystem visual approach. System-first and optional post-task signup preferences are recommendations. Exact brand palette, map vendor, final wireframes, breakpoints, styling tokens, supported launch capabilities, pricing and operational commitments remain open. Existing specs 01–52 remain active where compatible; specs 53–60 add detail and supersede ambiguous theme/composition assumptions. Use spec 60 to record the evidence needed before calling a journey complete.


## Deeper construction and coverage revision · 1.0

Edition 1.0 adds VISUAL-REFERENCE.html (ten selected designed screens), specs 61–76, team access/profile/calendar detail, typed contracts and a coverage audit. The region atlas remains a structural reference; neither artifact means all final screens are complete.

## Connected-journey companion · 1.7

JOURNEY-REFERENCE.html adds three selected populated scenes with local interactions: owner quick-hours setup, customer return/appointment detail and support timeline. It has narrow/wide and Light/Dark compositions. It illustrates parts of 97, not its complete state set. The hours example supports Monday/Tuesday in this reference; other days/advanced rules remain full-editor design work. No new font files/provider icon assets are supplied; CSS uses the working font names with system fallbacks.
