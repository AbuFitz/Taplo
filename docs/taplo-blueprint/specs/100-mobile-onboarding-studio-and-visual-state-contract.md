# 100 · Mobile onboarding, Studio and visual-state contract

Working edition 1.8 · 3 November 2026 · Adopted composition rules and required visual evidence. Extends 53–61, 79, 89–93 and 95–97. Written rules are not completed final designs.

## Honest visual research status

The pack has targeted competitor functionality sources, selected visual references, layout atlas and limited live Taplo inspection. It does not yet contain an extensive, systematic visual teardown of every current competing mobile/desktop journey. Do not tell the founder that broad visual research is complete. Research exact tasks and transitions, including failure/keyboard/empty states, not only marketing screenshots.

For each visual study record source/product/date/platform/viewport, entry state, action, resulting composition, information hierarchy, navigation/focus, motion/media, error/recovery and privacy/role implications. Distinguish directly inspected interaction, provider documentation image and inferred behaviour. Use lawful public material or authorised accounts; record limits rather than invent an inaccessible screen.

## Compositions by job

| Screen | Mobile working composition | Desktop working composition | Required interactions/states |
| --- | --- | --- | --- |
| Draft entry/category | One clear question, searchable useful choices, optional mixed/other path | Focused task and meaningful starting preview | Search no-results, selection change, preserved data, keyboard |
| Name/identity | Readable framed preview above controls when useful; short form; no forced upload | Balanced preview/form, no sprawling wizard | Long name, no logo, wide wordmark, upload failure, reserved handle alternatives |
| Look/colours | Coordinated choices with actual preview; advanced controls disclosed | Preview and scoped design controls | Content survives look change; contrast; reset/inheritance; reduced motion |
| Account handover | Preserve useful draft; clear sign-in/create/recovery | Focused secure handover, no repeated form | Existing account, expired session, connection loss, safe merge/ownership |
| First offer | Spacious task, essentials before optional content | Comfortable work canvas, optional preview | Price modes, duration/variant relevance, validation/save/conflict |
| Quick related setup | Inline expansion or full-width comfortable sheet | Anchored editor or focused surface sized to task | Origin draft retained; shared save, no modal cascade |
| Today/My work | Useful agenda/tasks and genuine exceptions first | Work canvas with appropriate contextual detail | Empty/busy, role/location, loading/stale/filtered no-results |
| Calendar | Agenda/day first; deliberate date/resource controls | Week/resource lanes where usable with agenda alternative | Accessible select/edit, overlap, DST, leave impact, stale external input |
| Offers catalogue | Readable rows/cards with status and relevant primary action | Efficient list and scoped detail/editor | Draft/hidden/archived/published distinct; search/filter; no lost edit |
| Order/job detail | Current task summary and next permitted action | Work detail plus related timeline | Partial work, blocked permission, uncertain payment, attachments |
| Customer detail | Necessary relationship and record access | Contextual history with field permissions | No cross-merchant history; payer/learner; restricted notes |
| Team access | Person, role summary, location/scope, navigation preview | Directory plus focused access editor | Pending/revoked/invite/role conflict; no flat mega-permission wall |
| Appearance | Preview and scoped controls; useful full preview; keyboard-safe sheet | Larger preview and grouped controls | Source/inheritance, undo, draft/publish revision, media/logo cases |
| Payments/integrations | Readiness/action and safe provider handover | Status plus permitted account history/actions | Requirements pending, refresh link, disconnected, capability lost |
| Publish review | Real customer view with concise exact blockers | Review canvas plus scoped readiness summary | Intentional publish, stale revision, missing facts, optional improvements |
| Support/Console | Assigned cases, concise fact timeline and permitted actions | Case workbench with scoped records/evidence | Redaction, audit, deadlines, uncertain provider state and escalation |

Category differences alter the task records, wording, fields and permitted work in this matrix; they do not create an unrelated dashboard shell per category. Do not use a fixed side panel as the answer to every screen.

## Mobile invariants

Use a clear main scrolling region; nested scrolling only when the task needs it, such as a deliberate horizontal rail. Sticky navigation and task actions must not cover the final field, validation message or keyboard-focused input. Active control stays visible during keyboard opening/rotation. Close/Back are distinct where they have different consequences, with visible accessible targets and retained focus/context.

Forms use suitable input types/keyboards, explicit labels and local help. Do not depend on placeholder text for meaning. Time/price fields must not trigger page zoom or impossible tiny controls. Support large text and portrait/narrow widths rather than shrinking the whole desktop design. At 320px CSS width, critical content must remain reachable without outer horizontal scrolling; complex tables/calendars need intentional alternate composition.

Show required data near the decision, not behind a tooltip. No sideways product rail for essential checkout/legal facts. Swipe is a convenience, never the only means to reach an action. Focus, keyboard, screen reader and reduced-motion behaviour are specified per surface; one library choice does not complete accessibility.

## Theme, density and visual character

Neutral platform shell; actual merchant accents in controlled context. Strong typography, whitespace by hierarchy, restrained separators, readable selected/error/status states. Avoid repetitive card borders and a large greeting pushing actual work below the fold. Frameless does not mean low contrast or no structure. Keep selected navigation meaning stable and category illustration separate from action icon semantics.

Design Light/Dark/System, missing/blocked assets, long words/names, £/decimals/date/time and empty/populated states. Merchant public-page theme is independent from operator app preference. Payment/permission errors are not hidden by theme or decorative motion.

## Final artefacts required per screen family

Populated mobile and desktop compositions; materially different tablet state; component/tokens/icon/type bindings; exact visible copy; normal/loading/empty/invalid/failed/permission/conflict states; keyboard/focus/Back/scroll; motion start/end/interruption/reduced alternative; source/command and support correlation; realistic content fixtures. Link each to specification and acceptance IDs.

Current reference HTML files demonstrate selected scenes, not the full matrix. Produce remaining artefacts incrementally and inspect actual captures, not just source code. Review should identify a confusing flow or poor hierarchy even when the screenshot technically fits the viewport.

## Visual research work queue

Compare mobile service setup, team invite/permission summary, availability changes, customer booking/cancel and return utility across actual current relevant tools; compare appearance editing, template selection and preview control across compact-page/creator tools. Record an evidence sheet for each and extract mechanisms rather than copying a surface. Then test Taplo's connected composition with users. This is a defined next research programme, not completed evidence in this edition.
