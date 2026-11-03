# 93 · Working-hours quick setup: complete reference contract

Working edition 1.4 · 3 November 2026 · Proposed reference feature for the guidance pattern. Extends 14, 62, 72, 89 and 92. No new live UI or executed scheduling logic is claimed.

## Clarify the meaning before collecting times

Public opening hours, staff working time, bookable availability, collection windows and travel capacity are different. Do not put a generic Hours field in onboarding then secretly reuse it for all five. In service setup the task can be Add working hours for [professional/location]. In a retail pickup task it is Set collection times. A merchant can explicitly choose to reuse a suitable existing pattern, but no category assumption makes public opening hours the team's availability.

## Entry and scope

From a first service editor, the scheduling area says Add working hours with a short explanation of the resource/location involved. Clicking opens an inline editor or comfortable sheet without losing service name/price/duration edits. Solo business can use its actual bookable resource; do not create a staff login merely to schedule the owner. Multiple locations/resources require an explicit target before saving.

The header contains task title and resource/location context, not repeated business branding. The core form has timezone, selected weekdays, per-day time intervals, copy-to-days action, review summary and Save hours. Advanced link leads to breaks, exceptions, different weeks and other full availability controls. Existing break/exception rules remain in force; the quick editor identifies that they affect the result and does not overwrite them.

## Field rules

| Input | Rule and visible behaviour |
| --- | --- |
| Timezone | Named supported IANA zone, initially suggested from verified relevant configuration; owner can correct; browser timezone is not silent authority |
| Day | Explicit enabled/closed state; no assumed weekday schedule |
| Intervals | Local start/end; valid precision; disallow zero-length/overlap; multiple intervals for lunch/gaps |
| Overnight work | Do not reinterpret end before start silently; quick editor directs to a supported overnight/full editor with draft intact |
| Copy days | Copies only the chosen intervals to explicit target days; preview replacement; never fills every day automatically |
| Effective date | Explicit application start in the resource timezone; safe proposed default Today shown to owner, not silently retroactive |
| Existing pattern | Current revision loaded; unchanged advanced fields preserved; update requires expected version |
| Scope | Exact resource/location/rule IDs resolved server-side; unauthorised client IDs rejected |

No extracted website hours or guessed working time. Display suggestions as choices, not saved facts. A schedule without any enabled time cannot be marked ready for instant booking. Save as closed/unavailable is valid if deliberate, but it does not satisfy an available-to-book prerequisite.

## Save sequence

1. Validate local inputs and show an accurate summary: named resource, location, timezone, days/intervals and effect date.
2. Authorise the actor and load current rule version, existing appointments and relevant exceptions.
3. Detect changes affecting accepted work. Show the impact and preserve those commitments; do not auto-cancel or delete bookings to fit the new pattern.
4. Submit a scoped version-checked mutation with idempotency protection as appropriate. Save weekly working pattern; scheduling rules decide actual availability.
5. Recompute relevant availability/readiness. Surface Saved plus the next missing dependency if one exists; do not label online booking ready simply because times were entered.
6. Keep the owner on the originating task, retain their service draft, and offer More availability settings. Full editor opens the exact scope without requiring duplicate entry.

The quick editor cannot silently change service duration, staff assignment, deposit rules, existing appointment agreements or public opening times. Public copy reflects only the intended published facts. Concurrent changes produce Reload changes/Review conflict, with recoverable entered values, not a blind overwrite.

## Worked paths

Solo barber: adds actual Monday/Tuesday intervals; existing service duration and staff eligibility determine candidate slots. No chair availability or deposit readiness is inferred from entered hours. An employee editing own time needs the relevant grant; owner approval can remain required by business policy.

Mobile repair: working intervals define potential work, but coverage, travel buffers, assignment and task duration still constrain visits. Do not show every five-minute start as a real appointment. One service address must not leak into public hours/Explore.

Tutor: local recurring working time is separate from an accepted series, learner/payer relationship and joining-link access. DST handling uses the session/rule timezone; an external busy calendar may further restrict availability.

Retail: collection window uses a separate fulfilment-rule editor, not the staff calendar rule with a renamed heading. Lead time, preparation capacity, location opening/closures and actual stock remain distinct dependencies.

## Edge states and support

Permission removed while editing; past effective date; invalid timezone; deleted resource; concurrent update; request accepted but response lost; no working days; split shift; DST gap/fold; existing booking outside new hours; calendar connection stale; mobile keyboard; closes with unsaved work. Each has a defined non-destructive outcome. Console sees mutation/audit revision, evaluated scope and error reason; it does not edit hours without an authorised audited action.

## Engineering/design handover boundary

Bind this design to existing AvailabilityRule, AvailabilityChange and version/permission contracts where appropriate; extend them deliberately for required missing fields. This reference is not an already exact command/API schema. Handover must supply typed input/output, validation codes, conflict payload, impact-query result, screenshot/component specification and meaningful scenario tests before assigning a supposedly implementation-only task.

## Typed weekly quick-editor boundary · 2.8

[WORKING-HOURS-EXACT-CONTRACT.md](../WORKING-HOURS-EXACT-CONTRACT.md), contracts/availability-v2.schema.json and working-hours-commands-v2.json now specify request/impact/apply/error shapes and migration rules. Local boundary fixtures are separate from actual server concurrency/provider proof. Advanced recurrence and full database DDL still need their handoff.
