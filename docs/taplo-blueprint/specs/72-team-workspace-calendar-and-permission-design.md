# 72 · Team workspace, calendar and permission design

Edition 1.0 · Detailed recommendation. Extends the basic role sets in spec 64; named permissions here supersede coarse “schedule.manage” as the target design for implementation.

## Research implications

Current Fresha roles separate own/all calendars, sales, client visibility, reports, team, catalogue and workspace areas [R14]. Square distinguishes practitioner/front-desk/manager calendar access and recurring versus one-off availability [R13, R15]. TutorCruncher separates lesson-report visibility [R17]; Shopify supports role examples for distinct work functions [R18]. Bookwhen documents leader roles for instructors [R19]. These sources support granular scopes, not a requirement to copy every competitor setting or pricing model.

## Team member lifecycle

Create person/resource → assign services, location and work role → choose login access/public profile separately → send time-limited invitation if access is intended → verify/accept → establish membership → land on permitted workspace → review role changes → suspend/revoke → resolve future work → archive. Invitation acceptance cannot increase the granted role. Reinvite invalidates old claim links; changing email/person requires verification rather than handing one person's account to a replacement. Public professional record and pending appointments can exist without an accepted login.

Use individual logins and attributable actions. Shared shop-device convenience, if implemented, needs authenticated device/session scope, individual staff switching and re-verification for sensitive operations; a short local PIN is not a universal web sign-in or permission bypass. Device logout, lost phone and staff departure invalidate appropriate sessions/notifications/downloads.

## What team access consists of

| Area | View scopes | Separate actions | Default professional recommendation |
| --- | --- | --- | --- |
| Calendar | None / own / assigned location / all authorised locations | Create, reschedule, cancel, mark attendance, reassign | Own work; completion/attendance; changes within policy or request approval |
| Availability | Own working pattern, exceptions, colleagues' busy-only where needed | Request leave, add own block, change pattern, approve team changes | Request changes; own nonconflicting block if granted |
| Appointments/jobs | Own assigned / location queue / merchant-wide | Accept, start, complete, change scope, attach evidence | Assigned operational actions; no hidden price changes |
| Customer identity/contact | Name only / necessary assigned details / broader role access | Edit, merge, contact, export | Needed assigned work only; export denied |
| Notes/documents | Public-to-customer / internal / restricted-purpose | Create, amend, approve/share, delete | Own permitted notes and necessary assigned context |
| Messages | Assigned conversation / queue / all permitted | Reply, assign, attach, escalate | Relevant customer threads, attributed as staff |
| Orders/fulfilment | Assigned/location / all | Prepare, collect, dispatch, cancel remaining | Relevant work only; no arbitrary refund |
| Money | None / own operational totals / approved finance | Discount, record payment, request/approve refund, payout settings | No bank/payout access; payment actions only by explicit grant |
| Catalogue | Read assigned offers / merchant catalogue | Edit details, price, stock, publish | View assigned services; no automatic pricing authority |
| Profile/gallery | Own / team | Draft edit, publish, moderate | Own permitted draft; merchant-theme inheritance |
| Reports | Own / team / financial | Download/export separately controlled | Own useful work counts, no business-wide revenue by default |
| Page/marketing | Preview / editor | Publish, campaign, export audience | Own profile only; no global marketing/client export |
| Team/settings | Limited directory / management | Invite, grant role, remove, change locations | No role grants or ownership administration |
| Connected services | Assigned task / admin | Domain, NFC claim, Wallet configuration | No admin by default; relevant read-only task context |

Owner setup should start with understandable presets, e.g. Practitioner, Front desk, Fulfilment, Finance, Manager, then reveal detailed permissions. Presets are recommendations, not a single opaque “staff access” switch. Show a plain-language summary of what this person can see/do, plus a preview of their navigation. Managers cannot grant permissions beyond their own delegation boundary. Changes affect APIs, realtime, exports and background jobs as well as the UI.

## Calendar anatomy and capability rules

Personal calendar defaults to own work and clear current business/location. Manager/scheduler can choose staff and resource lanes only within scope. Day/agenda is useful on mobile; week/resource comparison on wide screens, with a readable agenda alternative. Busy blocks for colleagues can reveal occupancy without disclosing private customer details. Permission to see a colleague's time does not imply permission to see their client name, notes or money.

Working hours define potential work; shift/availability exceptions refine them; bookings/reservations consume time/capacity. Leave approval, travel/setup, room/equipment and external busy time affect eligibility. A staff block cannot silently cancel an existing paid appointment. The UI previews conflicts and requests resolution. Drag/drop is a proposed change with accessible alternative; a materially changed appointment is not silently edited by a mouse gesture. Reassign checks service qualification, location, capacity, price/duration and customer agreement/notification.

Separate calendar actions:

- View: constrained date range and permitted fields.
- Create: choose actual service/customer/resources, current terms and required payment rule.
- Reschedule: atomic replacement plan; preserve old agreement until replacement succeeds.
- Cancel: evaluate customer/merchant actor, accepted policy, refund/credit and capacity consequences.
- Attendance/completion: status and chargeability separate; reason/evidence where needed.
- Availability: one occurrence/date exception versus recurring pattern; review affected work first.
- Staff reassignment: qualified replacement and explicit customer communication; no silent named-professional substitution.
- Export/sync: separate permission, least data and revocable connection; not an implied privilege of View.

## External calendars

Distinguish a calendar subscription/export, one-way availability import and two-way schedule editing. Do not advertise all three as “calendar sync” until supported. Recommended initial evaluation: staff-authorised free/busy import with minimal detail and clear last-sync status. External private event titles/attendees need not be copied into merchant customer records. Stale/unavailable sync uses an explicit conservative availability policy and warning; it never invents conflict-free time.

Store provider account/calendar mapping, scopes, sync cursor/version, event origin and last successful sync; deduplicate retries and prevent feedback loops. A destructive external change is not automatically permission to cancel a Taplo paid booking. Reconnect/removed permission/account switch/offboarding revoke access appropriately. Private iCalendar URLs behave as bearer secrets if used; disclose scope and provide rotation/revocation. Exported data cannot always be clawed back from an external calendar, which affects data minimisation and user explanation. Exact provider integration requires current API review before implementation.

## Workspace by business role

Barber: My day, My bookings, permitted clients/messages, My profile; eligible own availability request. Front desk: location-wide calendar, booking/reassignment workflow, limited client contact; no automatic payroll/refund privileges. Tutor: assigned lessons/learners, attendance, authorised reports and joining links; no unrelated learners or blanket payer finances. Mobile technician: assigned jobs, access/location, travel context, evidence and approved scope; no full customer export. Retail assistant: collection/preparation queue and necessary customer contact; calendar only if appointments are used. Workshop instructor: assigned sessions, roster, capacity/check-in and permitted attendee messages; no whole-business financial access. Manager: relevant team/work views and exception approvals; ownership/payout transfer remains separately privileged.

## Team notifications

Send changes to the actual assigned member(s) and responsible queue, with record deep links and minimal lock-screen content. Assignment/permission changes invalidate obsolete notifications/links at read time. Do not notify every employee of every client message or duplicate email/push for the same event without an intentional channel policy. Members choose permitted personal channels; owners define essential operational routing and escalation. “Delivered/read” is shown only from evidence.

## Tests that matter

Own calendar user requests colleague details → denied/redacted according to scope. Front desk can reschedule but cannot export clients or change bank settings. Practitioner submits leave over paid work → impact review, no silent cancellations. Revoked login cannot open old push link. One user at two shops sees explicit context and no data bleed. Instructor sees assigned roster, not private tutor notes. Owner can preview permission changes before saving. Team size pricing, if introduced, is explained before adding billable seats; no price is fixed here.

## Category and pricing refinement · 1.8

Spec 99 deepens category-specific team tasks and privacy boundaries; team login/bookable member access is included rather than billed per person. Shared permission templates remain scoped and need specialist field/action extensions where identified. category-team-presets.json is a proposed mapping, not executable authorisation. Mobile team editor composition and required visual evidence are in 100.
