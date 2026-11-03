# Taplo · Working-hours exact contract and migration

Working edition 2.8 · 3 November 2026. Closes spec 93's missing typed input/output and impact protocol for the deliberately limited weekly quick editor. JSON Schema and local validator fixtures are documentary/validation work, not live API/database/concurrency proof. Full advanced recurrence and other capabilities remain separate.

## Scope and existing-record reconciliation

Use contracts/availability-v2.schema.json and working-hours-commands-v2.json. Resource, business and membership stay existing authoritative records. The existing AvailabilityRule.local_rule is a free-form string; it must not become a competing second saved schedule. Introduce a versioned canonical weekly-interval format with explicit migration/adapter. A legacy rule with unsupported advanced recurrence or multiple jointly targeted resources requires full-editor/migration handling; quick setup returns ADVANCED_PATTERN_REQUIRED and retains its draft. No best-effort destructive conversion. Any compatibility string is derived from canonical data, never independently edited.

WorkingPattern: all seven ISO weekdays, each explicitly carrying zero or more ordered, same-day intervals in integer local minutes. Zero intervals means closed. Start 0–1439, end 1–1440, end strictly later; max eight intervals/day as a quick-editor scope bound, not a charge. Adjacent intervals are allowed; overlaps/duplicate weekdays invalid. End 1440 means midnight following that local day. Overnight start/end crossing requires full-editor path. Timezone is actual supported IANA identifier; validate with pinned timezone data, not string format alone. Effective date is a valid local calendar date resolved in that timezone; it isn't a client UTC-midnight assumption.

## Impact and apply

1. POST impact with exact resource/location/rule/current version and proposed pattern. Current authenticated business membership must allow schedule.manage in that resource/location. A guessed ID is not permission. Rule ID null and version zero only for no existing rule; an existing rule uses current ID/version.
2. Server validates and loads current advanced rules, exceptions, accepted commitments and aggregate accepted-work revision under appropriate read/locking/isolation. Inspect all relevant accepted future commitments on/after the effect date, not a hidden arbitrary 180-day cutoff. Response exposes counts/safe context, not unpermitted names/notes.
3. Return opaque impact ID bound server-side to actor/business/resource/location, canonical payload hash, current rule/accepted-work revisions, exact impact and expiry (working default five minutes). A count does not itself authorise customer cancellation. Store impact attempt with minimal scope/retention and no unnecessary customer data.
4. Owner reviews changed availability and preserved accepted work. Submit apply with unchanged proposal, impact ID and explicit acknowledgement where impact exists; use stable idempotency key and consistent If-Match for existing rule.
5. In one authoritative transaction, recheck actor/scope/token binding/expiry/hash, lock/recheck rule and accepted-work revisions, validate semantics and preserve advanced fields/accepted commitments, write new rule version + attributed audit + outbox event. If work or rules changed since preview, 409 IMPACT_CHANGED/RULE_VERSION_CHANGED; show new impact instead of silently applying stale acknowledgement.
6. Return applied/recomputing with operation ID/revision/next action. Lost response queries existing operation using original key. Same key/different payload conflicts; no blind second apply. Projection retries reuse event/operation IDs. New booking commands always enforce current authoritative constraints; stale cached slots cannot bypass them.

No public opening-hours change, staff invitation, accepted-booking cancellation, reprice or customer message is sent merely by saving working time. Historic/accepted agreements preserve snapshots and can stay valid outside a new general pattern; deliberate work changes are separate authorised commands. Changing timezone does not silently retime accepted occurrences. A closed pattern can be saved but cannot satisfy ready-to-book availability.

## Data/events/errors

Canonical pattern stores schema version, target resource/location, timezone, effective local date, weekly intervals, rule revision, audit origin and preserved exception references. DB migration must enforce the relevant FKs/tenant/unique-current-rule/version constraints and explicit effective-period overlap rule; JSON shape alone does not create them. Store rule history; don't overwrite the original weekly pattern inside old booking agreements.

Event availability.working_pattern_changed.v2 carries event_id, business_id, resource_id, location_id, rule_id, old/new version, effective local date, timezone, occurred_at and source operation, with no customer PII. Consumer checks current relevant version before replacing an availability projection; out-of-order old events do not regress it. Exact retention, transport and DB DDL are still implementation handoff items.

400 INVALID_INPUT for malformed shape; 422 for invalid timezone/day/interval/overlap or advanced pattern rule; 401 verification required; 403 current permission denied; 404 absent/not permitted without enumeration; 409 version/impact/idempotency conflict; 429 rate limit; 503 temporarily unavailable before definite commit. If outcome may have committed, expose/retrieve the stable operation rather than an instruction to save again. Errors contain safe field paths/message keys and request ID, not another tenant's revisions or private booking facts.

## UX and verification

Quick editor is the same engine as full settings, scoped to resource/location; service draft remains separate. Before save: Monday 09:00–17:00, Chapter / Sam, Europe/London, starts 4 November, two existing appointments kept. After confirmed save: Hours saved, with recomputing/next dependency if needed. Permission loss keeps entered draft recoverable without disclosing now-forbidden context; unknown result offers Check status. More settings carries exact scope/draft; browser Back works.

Local fixtures cover structural/semantic validity, seven explicit days, split/adjacent shifts, all-closed, invalid timezone/date, duplicate days, zero/overnight/overlapping intervals, unknown fields and malformed minutes. Those passing tests prove only this validator boundary. Real auth/transactions/locks/impact freshness/worker/device tests remain unexecuted and required. No claim that every platform command is now exact is made.
