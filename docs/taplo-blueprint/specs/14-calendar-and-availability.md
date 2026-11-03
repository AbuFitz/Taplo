# Calendar as an operational view of scheduling

Status: proposed extension plan. Current-source inventory is in the preserved research report.

The inspected foundation already includes Agenda/Day/Week/Month views, staff filtering, business time zones, weekly windows/breaks, date exceptions, blocks, service buffers, notice/horizon rules, pending holds, booking actions and calendar export. Do not treat a grid screenshot as the full scheduling engine. Source inspection is distinct from an executed test result.

The calendar should support clear distinctions between confirmed work, requests, blocks, classes and unavailable time, with text/icons as well as colour. Mobile defaults to an agenda with a simple route into time selection. Owners can add a genuine manual appointment, not only a block. Dragging a booking is optional enhancement; provide an accessible equivalent and show affected customer/payment implications before committing.

Availability comes from working windows minus breaks/exceptions/blocks and overlapping commitments, constrained by staff, resources, buffers, notice and capacity. Store absolute instants plus relevant IANA time-zone semantics. Day boundaries and DST changes require explicit behaviour, not arithmetic on local clock strings.

External calendar export is not two-way sync. If sync is offered, define source of truth, busy-only privacy, deduplication, deletion, failure and stale-data behaviour separately.

Acceptance: a DST transition does not invent or duplicate a slot. A staff absence identifies affected bookings without silently cancelling them. A customer viewing another time zone sees an unambiguous local time and venue time where needed. Failed sync does not falsely label externally occupied time as verified free.
