# Engine and experience specification

Proposal based on inspected baseline; reconcile with Claude's incoming push first. Preserve pricing, entitlements, existing business records and saved page documents. No framework, authentication or database replacement is proposed.

## 1. Strengthen the existing engine

The pipeline already separates BusinessContent, PageDoc, migration, style resolution, entitlements, view model and renderer. Keep one real renderer across editor, examples, published pages and screenshot sources. Marketing can crop and compose that output; it must not imply controls or states the renderer cannot produce.

Define four explicit operations in product terms:

| Operation | Changes | Must preserve |
|---|---|---|
| Try a look | Temporary visual defaults in preview | Saved content and saved appearance until Apply |
| Apply a look | Theme/look values according to a documented override policy | Records, widget IDs/order, hidden state, availability and entitlements |
| Apply a starting arrangement | Previewable widget/composition plan | Records and look; identify removals and offer undo |
| Create an example | Isolated fictional demo records plus a composition | Every real business draft and published version |

The current editor look picker uses `useAppearanceModel.applyLook`, which replaces page-level style overrides and then offers Undo. An older `setTheme` helper preserves them, so older documentation must not be used to infer picker behavior. A live reversible demo check confirmed replacement and Undo restoration. Make the scope of applying a complete look clear before the action, use the owner's actual content in its preview, and consider an explicit keep-customizations option where useful. Do not replace business records with demo content. See ENGINE-AUDIT.md for the current code paths and evidence.

Audit `themes/catalogue.ts`, `themes/looks.ts`, `showcase/lab-state.ts`, inspiration examples, onboarding and marketing manifests. Use one catalogue of authoritative look IDs and stable design IDs; derive counts and thumbnail metadata. Retain legacy aliases and versioned migrations. A deleted showcase should not break an existing saved look.

Composition is more than a palette. Support the finite, intentional variants needed by the flagship briefs: compact profile, controlled image header, service menu, image service cards, stock collection and typographic profile. Extend schemas only when a brief proves the current vocabulary insufficient. Unknown/corrupt config must degrade safely with an actionable owner notice.

Readability must include real image crops, gradients, translucent surfaces, focus states and overlays. Checking a single background hex is not sufficient. Keep allowed choices finite and safe; do not introduce stored arbitrary CSS to gain variety.

## 2. Widget design contracts

Every supported type in the current registry needs a row in the evidence matrix, including types not explicitly named below. Keep the existing workbench and extend its cases. Avoid designing all types as the same rounded card.

| Group | Default information | Detail / action | Required edge cases |
|---|---|---|---|
| Identity/header | Name, short proposition, locality and one useful main action | Channel alternatives, image crop/identity editing | Wide logo, no logo, long name, no photo, high-contrast image, no available action |
| Services | Name, exact/from/quote/free wording, duration where meaningful | Included work, provider, book/request/ask action | No price, variable duration, unavailable service, archived item, long title |
| Booking | Selected service and clear mode | Eligible staff, availability, customer details, review, actual result | No staff, no slots, slot conflict, service changed, network retry, request-only, missing provider |
| Team | Portrait or designed initials, name, role | Bio, relevant services and filtered booking | No portraits, one person, many people, long bios, unavailable staff |
| Products/affiliate | Accurate image, name, price and status | Useful details and correct purchase/enquiry/outbound action | Missing image, out of stock, archived, affiliate disclosure, unsafe URL |
| Vehicle stock | Model, year, mileage/unit, fuel, gearbox, price and stock status | Multiple relevant images, specifications, stock-specific enquiry/viewing | Available/reserved/sold, price on request, no images, mismatched photo, long model |
| Gallery/media | Intentional crop and content type | Accessible lightbox, caption, navigation and close | One/many/missing images, video consent, failed load, zoom |
| Reviews | Readable quote and honest source | Optional detail/source link | No reviews, long quote, business-submitted source, demo review, no invented verification |
| Contact/enquiry | Relevant channel and expected outcome | Preserved form state, useful validation and real delivery status | Network error, draft retry, no channel, attachment not supported |
| Hours/location | Open state in business timezone; premises or service area | Week schedule, exceptions, appropriate directions | Overnight hours, closed days, DST, appointment-only, no public address |
| Sharing | Real share destination and clear export choice | Code, card, native share/copy, preview/export parity | Unpublished draft, stale URL, blocked clipboard, decoding failure |

The generated example image is illustrative; it must not be presented as an actual service before/after, a real customer result or a specific dealer stock photo.

## 3. Overlay experience

Use the existing accessible primitives unless a reproduced limitation requires change. A mobile detail sheet has stable title/close, one scrolling content area, and an action area that stays reachable above the software keyboard and safe area. Desktop uses a well-proportioned dialog. Navigation back within booking goes back one meaningful step and preserves selections.

Verify keyboard focus entry/trap/return, Escape, browser back where supported, deliberate outside-tap behavior, no background scroll, and no horizontal carousel/sheet gesture conflict. Long content must scroll; never clip it to make marketing cleaner. Restore the underlying page scroll after closing. Prefer one overlay stack manager over multiple nested independent modals.

Do not add a fake iOS system payment sheet. Use the actual payment provider UI only when configured; otherwise explain unavailable payment contextually. A booking request is never labelled confirmed. Demo journeys can be interactive with one restrained demo label and honest terminal states.

## 4. Owner editing

Primary loop: choose content → edit its information → see result → adjust presentation → return. An owner should not need to understand registry/settings/records architecture.

Desktop: task navigation, one focused inspector, persistent rendered page. Selecting a section visibly selects the corresponding editor item. Separate content editing from section presentation inside that inspector with clear tabs/labels, without copying records. A record reused by multiple sections should make that relationship clear.

Phone: a useful page view and a predictable edit sheet; avoid stacking a navigation drawer, editor sheet and detail dialog. Keep return path and selection. Reorder from handles with insertion feedback, sensible activation thresholds and auto-scroll; also provide Move up/down. Keep undo/redo, accurate saving feedback, reload persistence, last-published state and recoverable save errors.

Visual choices should show actual current content where useful, not tiny abstract diagrams. Show the selection and result immediately; defer specialist controls until needed. Use finite controls with plain names. Never add numerous advanced sliders as a proxy for a better default.

## 5. Setup

Outcome: an owner gets a credible first draft using their own information, understands what remains before launch, and can return later.

Suggested flow: business name/address → purpose and contact → visual starting choice → first meaningful content → review and next actions. Adapt first content to the business: a barber service, detailing package or stock item. Industry recommendations do not restrict available themes or features.

Show the page forming from the user's actual input early. Collect optional photography progressively; a missing cover must have a good designed fallback. Preserve back navigation, validation values and reload progress. Do not imply a three-second business scrape exists; use manual entry first, with authorized imports only when the real integration is available.

Make publishing readiness actionable: add contact, configure availability if booking is promised, inspect appearance. Never fabricate account creation, domain ownership, public publishing or payment success. Preserve established account/auth setup boundaries.

## 6. Gallery and customer pages

Mobile previews are the default across gallery widths. Start with enough legible content to show identity plus a useful widget. On narrow screens, use a simple main filter and a secondary filter drawer; show active choices and clear-all. Keep stable, bookmarkable detail pages and an obvious use-design action.

Design detail: phone preview first, try a service/product interaction, then optional desktop view and short design details. Applying to an existing business previews its own content, never the fictional business.

Customer desktop layout preserves identity, content order and primary action. It can widen collection grids deliberately; do not stretch a phone line to full monitor width or automatically turn every profile into a different split website. Test long menus, large stock and no images at desktop as well as mobile.

## 7. Verification model

Visual review and engineering checks are separate. An attractive screenshot does not prove booking; a passing test does not approve composition. For each accepted pattern capture the same seeded business, viewport and state before/after. Use 390 and 1440 as core art-direction review widths, plus boundary widths such as 320/768/1024 and actual browser zoom. These are proposed review dimensions, not completed tests.

Test migration/theme switch/content preservation, widget add/edit/hide/reorder/undo/reload, preview/public parity, booking state branches, overlay focus and media fallback. Use current tests rather than recreating every assertion. Rebaseline a screenshot only after reviewing why it changed.

Run representative Chromium, WebKit and Firefox journeys where available; report missing environments. Physical iOS keyboard/safe-area, Android touch and camera QR tests remain distinct from emulation. Use perf traces for heavy marketing scenes and field measurement when live traffic exists. Never describe unrun checks as passed.
