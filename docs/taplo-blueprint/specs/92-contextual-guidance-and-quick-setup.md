# 92 · Contextual guidance and quick setup

Working edition 1.4 · 3 November 2026 · Founder direction: complete useful setup in context, with optional access to the full feature afterwards. Extends 07, 50, 58, 79 and 89; supersedes any interpretation that every missing setting must redirect to another page.

## Guidance is not one popup style

Help the owner complete the task before explaining the entire platform. A short contextual editor is often more useful than a tour, video or floating assistant. Keep the active work visible where practical; do not use a permanent side panel that compresses every screen or a repeated modal on every visit. The visual approach remains frameless and deliberate, with readable elevated task surfaces only where useful.

| Need | Preferred pattern | Avoid |
| --- | --- | --- |
| Missing simple value in current task | Inline expansion next to the relevant setting | Redirect away and lose form context |
| Small related set of values | Anchored editor on roomy screens; comfortable sheet on mobile | Tiny floating form with hidden fields/keyboard collisions |
| Setup needs more room | Focused task surface preserving safe draft and return context | Pretending a complicated workflow fits three dropdowns |
| Explain a concept | One short example/diagram, optional demonstration | Mandatory feature tour before useful work |
| Point to a new control | Dismissible anchored hint, infrequent and correctly targeted | Multiple competing coach marks and dimming unrelated work |
| High-consequence permission/payment change | Explicit scoped review/confirmation | Decorative confetti or click-through encouragement |
| Everyday routine | No guidance unless requested or a real issue occurs | Replaying onboarding after every sign-in |

## Quick setup is the real editor in a smaller scope

One record, one validation/permission model and one command family serve quick and full editing. The quick form edits a declared subset. It must preserve unshown fields and never reset advanced settings to defaults. The full page reads the saved result immediately; both contexts enforce the same constraints and version conflict rules.

Quick setup lifecycle: available → open → editing → validating → saving → saved or error/conflict. Guidance eligibility and completion are computed separately: seeing/opening/dismissing a prompt does not complete setup. Save acknowledges authoritative persistence; if a device-local draft was retained instead, say that precisely in internal behaviour and do not present successful business configuration.

After success, return focus to the relevant task/result. Offer a secondary More settings action. Do not force navigation after save, reopen a promotional popup, or mark unrelated readiness complete. Changing hours might complete working-time setup but still leave a service unavailable because duration, assignment or resources are missing.

## Opening, closing and draft ownership

Keep origin route, selected merchant/location/resource, scroll/focus target and safe unsaved task draft. Close/Escape/Back have the same documented meaning: discard uncommitted changes only after an appropriate unsaved-change choice. Save failures keep entered values and explain retry/recovery. No hidden autosave commits when a destructive change requires review. Do not nest quick editors inside an already active modal; replace its internal step or use inline expansion while retaining a clear back path.

Permissions are evaluated when the prompt is shown, on opening and on save. A practitioner without business-hours access sees their own permitted hours or an owner-contact explanation. A support operator does not acquire edit authority by opening a guidance component. Tenant/role changes invalidate the current context safely.

## Motion, illustration and demonstration

Use visuals to explain a specific effect: what a booking window changes, how a rail swipes, or how a customer sees a deposit. Prefer a clean still/interactive example first, with Play example if a short motion demonstration adds understanding. Optional short muted autoplay inside a deliberately opened help region can be evaluated; it must be bounded, controllable, respect reduced-motion/data preferences and never block the real task. No floating autoplay tutorial following the owner around Studio by default.

No endless loop, unexpected audio, flashing or camera movement. Provide static equivalent and meaningful text; captions/transcript for narrated instruction. A sample illustration must not masquerade as live merchant/customer state. Do not load expensive media before it is needed or make completion depend on watching. W3C guidance explains pause/stop/hide obligations for applicable moving content; no claim that a short duration alone makes all motion accessible. [R62]

For a modal, follow focus containment, accessible labelling, keyboard close and logical focus restoration; an anchored non-modal hint must not trap focus or claim modal semantics. Keep mobile close control visible and fields above the keyboard. W3C APG supplies the interaction baseline, not a complete branded visual design. [R63]

## Frequency and tone

Priority: blocking safety/authority issue, missing task prerequisite, optional useful improvement, then education. Display one relevant suggestion at a time. Optional help can be dismissed/snoozed and reopened through Help; new policy requirements may need a new versioned notice rather than resetting all dismissed tips. Do not introduce a made-up completion percentage combining optional branding with mandatory financial checks.

Copy names the outcome: Add your working hours; Choose collection times; Set a deposit. Explain the smallest consequence in plain language. Avoid Learn the power of Taplo and generic AI-style praise. Labels match the full feature vocabulary; business-specific terms adapt only where the meaning is clear.

## Guidance record and governance

Proposed GuidanceDefinition fields: stable ID/version, owner, capability/role scope, trigger predicate, exclusion/satisfied predicates, quick-editor ID, full-settings destination, allowed field subset, help asset/version, priority, dismissal policy, localisation key and acceptance scenario IDs. Proposed progress stores tenant/user/scope, seen/dismissed state and definition version; actual completion is derived from source configuration. Exact typed schemas remain required before implementation.

Media/copy are versioned with the UI they describe. Remove or revise guidance when controls move. Agents can suggest content changes, but cannot edit eligibility/permissions or declare compliance by rewriting prose. Console can identify why a prompt appeared, what prerequisite failed and which error blocked save without accessing unnecessary entered private data.

## Acceptance

Same task completed without navigation; quick save reflected in full settings; advanced values preserved; denied role; two-tab conflict; validation error; offline save; keyboard/large text; reduced motion; replay/dismiss; origin removed; merchant switched; expired session; form closes with edits; source changes while hint is open. Test effect on task completion/errors, not merely whether a tooltip rendered.
