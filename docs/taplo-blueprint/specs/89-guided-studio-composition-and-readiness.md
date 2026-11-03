# 89 · Guided Studio composition and readiness

Working edition 1.3 · 3 November 2026 · Accepted direction: recognisable draft first, then the first useful offer in Studio. Proposed detailed composition; not a deployed redesign.

## A workspace that changes with the task

Do not implement every setup journey as a narrow form trapped beside a small phone. Page appearance editing benefits from a preview; inventory entry, working hours and payment connection need a proper workspace. Studio stays frameless, with strong hierarchy, clear typography and restrained separators rather than a dashboard tiled with repeated setup boxes.

| Task | Mobile composition | Desktop composition |
| --- | --- | --- |
| Identity/look draft | Useful phone preview above scoped controls; keyboard-aware layout | Readable preview and controls with balanced space |
| First service/product | Full-width task, concise essential fields and relevant example; optional customer preview | Comfortable editor canvas; optional preview, not compulsory side panel |
| Working time | Day/week editor appropriate to screen; explicit timezone and exception controls | Usable schedule canvas, resource selector and contextual detail |
| Payment setup | Clear purpose, verified provider handover, return status | Focused setup and account readiness, no shrunken external form |
| Publish review | Customer composition plus concise blockers and Edit links | Larger review canvas with scoped readiness summary |
| Daily work | Agenda/jobs/orders and exceptions relevant to role | Work canvas/calendar/list with consistent contextual detail |

Mobile active field and primary action remain reachable with keyboard; avoid two competing sticky bars and nested scrolling regions. Preview has Fit/actual viewing where useful and a meaningful full preview path. Do not equate frameless with removing focus indicators, readable boundaries or proper form grouping.

## The first useful offer

Carry category/capability intent, identity and design into Studio. Open directly to a clear task such as Add your first service, Add your first product or Set up enquiries. Ask minimum meaningful facts first. Owner enters price themselves; no extracted prices, invented durations or silently activated policies. Then progressively reveal time/resources for booking, fulfilment/stock for goods or participants/capacity for classes.

Save draft is always distinct from Enable online booking/payments and Publish. A merchant can publish an eligible enquiry/contact page before enabling complex transactions. Example content remains clearly distinct and cannot accidentally sell. The initial free/provisional paid-plan choice must not be used to force a pricing decision that is not yet designed/approved.

## Guidance is a dependency system

Each guidance item needs a stable ID, capability/role scope, prerequisite predicate, satisfied predicate, deep destination, consequence, optionality and dismissal semantics. Derive completion from authoritative configuration, not a manually checked UI flag. Steps may become relevant later when another capability is enabled; preserve earlier authored work.

Example: Accept online service deposits depends on an eligible priced service, valid time/assignment, reviewed payment/cancellation setup and provider readiness. If only the provider needs attention, link directly to that task. Explain You can save this service now; connect payments before accepting deposits. No dead-end generic checklist or repeated warning on every screen.

Owner can pause optional tasks without permanent red error badges. Staff sees guidance they can act on; owner-only blockers give a useful request/help path instead of unauthorised controls. Never turn a required safeguard into an ignorable suggestion just to raise completion metrics.

## Daily Studio and navigation

Keep stable semantic areas for Work, Offers, Customers, Page, Growth and Settings as a proposed information architecture to test. Expose relevant subareas based on enabled capabilities and permission, not a mandatory huge sidebar. A mixed business can have appointments and orders without switching unrelated mini-app identities. Avoid moving core destinations unexpectedly when a category changes; explain newly enabled areas.

An owner sees business-level readiness and work; a practitioner sees assigned/own work and permitted profile; front desk sees delegated booking/customer actions; stock staff sees fulfilment/inventory. Changing an icon does not implement permission. Names can adapt meaningfully—Lessons, Services, Sessions—but shared action meanings remain stable.

## Changes, recovery and visual review

Autosave reports Saving/Saved/Save failed accurately and has a recoverable local draft where appropriate. Reload, Back, account handover, lost connection, two tabs, expired session and permission changes must be specified. After a failed provider handover, return to the precise task with current readiness, not a fresh onboarding questionnaire.

Design review must cover at least a 390px phone and useful narrow/wide desktop sizes, Light/Dark/System, long names, missing assets, enlarged text, keyboard/focus, sparse/busy calendars and empty/populated work. Final breakpoints and component tokens remain in the design system and are validated against content. Written composition is not a substitute for finished screen designs; this edition does not claim new production screen mockups.

## In-context quick setup refinement · 1.4

Specs 92–93 refine the deep-link-only interpretation: when a missing prerequisite can be configured safely in context, open a scoped quick editor on the current task. Full settings remain optional for richer configuration. Shared records/validation/permissions prevent quick setup becoming a conflicting second implementation. Hours are the complete reference example; do not conflate public opening, staff working time, collection and availability.
