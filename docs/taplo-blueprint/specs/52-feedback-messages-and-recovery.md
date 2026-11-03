# 52 · Feedback, messages and recovery across the ecosystem

Working contract · Same semantics in Taplo, Studio and Console; density and context can differ.

## Feedback belongs where the user can act

| Situation | Surface | Behaviour |
| --- | --- | --- |
| Save / copy / add | Local state plus brief polite status | Immediate visible result; no modal; avoid competing simultaneous notices |
| Field validation | Beside field, with summary for long forms | Explain what to change, preserve input, focus first problem on submit |
| Action pending | Button/progress region | Describe actual work; prevent duplicate submit; keep safe escape where possible |
| List fetch / map fetch | Local loading / skeleton | Keep layout stable and previous useful result; no fake percent |
| Delayed external result | Persistent record status | “Payment processing”, “Refund pending”; refresh/status check and eventual update |
| Page-wide outage/offline | Relevant persistent banner | Explain affected actions; retry; do not pretend an offline purchase completed |
| Consequential failure | Inline task problem or focused recovery | Clear outcome, retained data and next safe action; support reference when needed |
| Destructive action | Explicit confirmation | Name record, consequence and exact action; no generic “Are you sure?” |
| Long operation | Durable task/activity entry | Safe to leave; notify when outcome known; no infinite blocking spinner |
| Support response | Case/conversation thread | Correct sender/role, record context and response expectations |

Success reflects actual state. “Saved” means persisted; local optimistic states have rollback and truthful pending/retry behaviour. Copied requires clipboard success; otherwise show selectable link. Do not clear an error because a timer expired. Temporary notices never carry the sole copy of a financial result. Undo appears only when a real compensating action is supported and its time limit is clear. Never use success/error colour alone.

## Message composition and threads

Entry points: business page, offer, booking/order detail and support. Every composer has explicit recipient and optional record/offer attachment. Preserve the chosen context without repeating name/logo in every bubble. Provide attachment type/size/error states, upload cancellation, draft status and accessible removal. Do not encourage customer card details or sensitive identity documents in ordinary chat. Requests for sensitive evidence use an appropriate protected route.

Send states are local draft → sending → accepted by service → delivered/read only where evidenced. “Sent” is not “read”; retries use the same message identity. Uncertain timeout gets reconciliation before another send. Draft recovery across closes/devices is an explicit product decision with privacy and retention, not an assumed guarantee. Thread permission follows the merchant/customer/support record; notification links authenticate before private content appears. Guest flow binds an eligible transaction/conversation through a secure verified contact route.

Merchant opening hours and stated reply expectations may appear only from maintained settings; do not invent “usually replies within minutes”. Presence/typing/read receipts require deliberate product/privacy choices. Blocking/reporting covers spam, abusive content and attachments; support escalation preserves evidence and limits access. Message search, export and retention honour account/role policy. Cancellation/refund requests cannot silently change official order/appointment state just because someone typed a message.

## Recovery and navigation

Unsaved-close prompts only when meaningful work would be lost. Repeated errors do not produce repeated stacked dialogs. Consequential updates cannot rely only on disappearing toasts. Pending and offline records stay findable in Activity/Studio. Notifications open the same canonical record, not a disconnected preview. Sign-in interruption preserves safe intent; never replay an expired payment/slot automatically. Account or business switch clears private drafts from the previous principal.

Console can inspect permitted delivery/error metadata and linked case with audit trail, redact sensitive material and perform scoped actions. Support replies are clearly support, not falsely the merchant. Preview/impersonation mode is labelled and cannot silently bypass permission/financial checks. Message, booking, order and support notification preferences are distinct; essential transactional messages and marketing opt-ins are separate.

## Coverage checks

Review initial, empty, loading, sending, success, validation error, server error, timeout, conflict, partial success, offline, permission denied, expired session, unavailable merchant, removed content and cancelled operation across every feature family. Include assistive announcements, reduced motion, focus, text enlargement, keyboard, long translations and double taps. Spec 47 owns cross-surface consistency; this spec owns user-facing feedback. Provider delivery and actual release evidence remain separate from these proposed contracts.
