# Taplo · Flexible connections, clear boundaries and useful support

Working edition 2.3 · 3 November 2026. Extends 67, 77, 81, 84, 95, 99–101 and 109. These are adopted blueprint defaults, not deployed connections or a promise to integrate every requested product.

## Flexibility through supported workflows

A business should choose how it works within clear capabilities: optional deposits, bookable people/resources, pickup or shipping, classes or appointments, one category or several. That is useful flexibility. Allowing arbitrary third-party code to redefine payment, availability and inventory rules creates a different product and support obligation.

| Connection | Decision | What it actually does | What it must not imply |
| --- | --- | --- | --- |
| Existing website | Yes | Direct task links, optional supported widget/launcher, merchant subdomain | Automatic import/sync of prices, stock, orders or legal policies |
| Shopify | Ordinary outbound link allowed; no native sync connector in launch scope | Business may link to its independent external shop; return path clearly labelled | Shared basket, rewards, inventory, refunds or order tracking across systems |
| Headless/custom frontend | No public launch API or arbitrary customer-hosted checkout | Taplo-owned responsive task routes and controlled embeds | Anything can be built on top of Taplo under ordinary subscription support |
| Custom implementation requests | Capture use case; no default bespoke development promise | Look for a reusable extension many merchants need | A sales inbox that commits cheap subscription customers to custom software projects |
| Google and Outlook | Yes, paid calendar connection | Busy intervals into scheduling; Taplo appointment export | Unrestricted bidirectional editing of Taplo bookings from any calendar |
| Apple Calendar | Add-to-calendar/calendar-file export | Customer/staff event visibility | A private Apple calendar is now a reliable booking availability input |
| Accounting | Deliberate exports first; candidate connector after evidence | Clearly scoped financial data with reconciliation | Tax filing/accountant advice or guaranteed ledger sync |
| WhatsApp | Later supported channel; not bundled at launch | Potential Taplo support channel and separately assessed merchant notifications | Free/unlimited messaging or permission inherited from SMS/email |
| Public webhooks / Zapier / Make | Later bounded event catalogue | Signed least-data events under merchant permission | Any caller can execute financial or scheduling commands |
| Video meetings | Investigate when tutor/remote-service workflow needs it | Provider-owned session, attendee access and failure rules | Generic calendar integration creates a safe private class automatically |

Shopify interoperability could become worthwhile if measured demand outweighs synchronisation/support costs. Do not reject it for ideological reasons, but do not advertise it now. Merchants can sell distinct offers in Taplo and elsewhere; warn against selling the same finite stock without a supported authority/sync contract. A manual link does not solve double-selling.

Do not create a public contact-us-for-headless offer at launch. Internally record the requested outcome, category, volume and blocked task. Prefer a reusable widget, task link or product improvement. A future managed project would need separate pricing, acceptance criteria, support ownership, data authority, maintenance and exit; it must use the same protected commands, never a fork of the payment engine. Saying no to an unsupported mode is compatible with a flexible product.

## Calendar depth that deserves retention

Everyday paid scheduling includes staff hours/leave, breaks, duration/buffers, service-to-person/resource eligibility, lead time and booking horizon, request versus instant-confirm mode, group capacity/waitlist where enabled, cancellation/reschedule and manual staff entry. Pro adds advanced series/package automation; team access, basic protection and a competent daily calendar are not Pro bait.

Category differences: barber chair/person and processing time; tutor payer/learner and series; mobile technician service area/travel buffers/quote-before-confirm; workshop participants/capacity/material resources; retailer pickup windows and stock. These share primitives but need distinct wording, rules and screens. A calendar cannot make every category operational merely by changing icons.

Connection wizard asks only calendar owner → calendars that block availability → export destination → privacy preview. Member authorises own access; admin cannot expose private event titles through a team permission toggle. Default import is busy time, not private content. Taplo appointments remain owned by Taplo. External deletion does not cancel a paid booking; a dragged export opens a Taplo review path rather than silently changing an agreement.

Working freshness contract: mark last successful busy sync older than five minutes as Needs check for public instant confirmation on resources relying on that connection. Attempt a bounded refresh when presenting/confirming an affected slot. If freshness cannot be restored, stop that instant-confirm path and offer a clearly labelled request where supported. This is a conservative product default to validate against actual provider quotas/latency, not a guarantee external writes propagate instantly. Studio/manual booking shows conflict/health and requires an authorised explicit review rather than concealing stale input.

Final confirmation revalidates Taplo capacity atomically and uses the latest available external busy state. Provider lag means external collision risk cannot be mathematically removed; record detected late conflicts and an owner resolution task. Reconciliation cannot silently cancel already accepted work. Google sync tokens and Microsoft delta cursors remain provider-specific [P11–P12]; expiration/full reconciliation, recurring exceptions, DST, revoked consent, write echo and disconnect are acceptance cases.

## One connection health model

States: Not connected → Connecting → Checking → Healthy; attention states Permission needed, Stale, Rate limited, Provider outage and Disconnecting. Each connection records tenant, owning user/seller/resource, provider, scopes/config version, last verified success, cursor, pending jobs and recovery owner. Display impact and a specific next action, not just a green badge.

Connect/save cannot erase a draft. Return from OAuth resumes the same task/tenant; account switching requires explicit context. Successful consent is not successful initial sync. On disconnect explain what stops, which accepted obligations remain and what data is retained/deleted under lawful policy. Reconnect only through an authorised owner; Console cannot manufacture provider consent.

## Support must exist from launch

Taplo owns platform reliability, billing, access, integration faults and safety/reporting routes. Merchants own service delivery, ordinary order fulfilment and their customer policy decisions within law. The customer must not be bounced endlessly: Taplo records the case, identifies the owner and monitors escalation even when a merchant must decide the commercial remedy.

Working launch channel: in-product help plus email, backed by Crisp Mini and Console. A named human support owner, coverage hours, incident rota and response expectations must be assigned before paid launch. Priority Business means a staffed queue priority, not 24/7 or a legal-rights advantage. All plans have a route for security, payment failures and inaccessible accepted work. A public status page can use separately hosted static infrastructure initially; independently monitored updates matter more than buying another app.

| Layer | Automated help | Escalation and authority |
| --- | --- | --- |
| Contextual help | Relevant short answer/clip and a safe quick setup action in the originating task | User can open full editor or ask for help without restarting |
| Deterministic diagnosis | Check connection health, failed delivery, plan/allowance and known incident status | Explain only verified facts; never invent payment success |
| Case preparation | Collect issue type, record reference, device details and relevant redacted history | Show what will be shared; no bank/card/intake secrets in support payload |
| Human case | Unified thread, accountable owner, updates and permitted next action | Human verifies financial/access authority; no password collection |
| Optional AI assistant | Later grounded on versioned approved help and authorised minimal case facts | Can draft/route; cannot independently refund, charge, change policy, impersonate a merchant or close a disputed case |

Do not buy an AI resolution package simply to claim automated support. First automate recurring verifiable questions and fix their product causes. Measure contacts per active account, resolution/reopen rate, escalation delay, misleading answers, support minutes and cost—not tickets deflected alone. A wrong automated answer can cost more than human handling.

WhatsApp is a later convenience when support demand/cost/privacy justify it. Crisp Essentials currently lists the omnichannel tier at $95/month versus Mini $45 [P7]; channel/provider/template charges and consent can add to that. Do not buy it now or promise it is covered by the SMS balance. Any future WhatsApp thread maps into the same case; notify before transferring sensitive context and verify identity before account-specific facts/actions. Email remains available; customers need not install WhatsApp.

## Studio composition: hide provider complexity, show decisions

Connections live in one Studio hub, but the relevant quick setup appears where needed: connect Stripe while configuring booking protection; choose a calendar while editing availability; choose reminder channel while reviewing notifications. Keep original draft and show a short result summary. Do not redirect a half-written offer into a multi-tab configuration maze.

Per panel: purpose → essential options → preview/impact → save → quiet confirmation. Advanced choices progressively revealed, with saved-state/permission/provider status visibly distinct. A member lacking finance permission sees Request owner setup, not a broken Connect button. Relevant error keeps entered values and offers a scoped retry; no repeated whole-onboarding wizard. Merchant preferences, plan entitlements and provider readiness are different explanations in UI.

Core quick flows needing designed states: no bank yet; Stripe action required; calendar clash; revoked calendar; unknown payment outcome; insufficient refund funds; no SMS balance; campaign quota reached; domain verification pending; inaccessible staff account; downgrade with future work; provider outage. Mobile must retain focus and summary near the action, use full-height task surface when the form requires it, and keep a human-help route available.

## Release evidence

Required fixtures: existing-site task link retains return context; external-shop link does not create a Taplo order; export deletion leaves booking intact; stale busy source stops affected instant confirmation; forged callback cannot change tenant; staff departure disconnects only authorised scopes; support request survives lost network without duplicate case; automation cannot perform forbidden finance action; customer question does not leak another merchant's data; outages route to the actual responsible person. These are specified expectations, not evidence that integrations already pass.

Sources: P7 in PROVIDER-STACK. P11 https://developers.google.com/workspace/calendar/api/guides/sync ; P12 https://learn.microsoft.com/en-us/graph/delta-query-overview . Exact endpoints/scopes/subscription renewals remain pinned implementation contracts, not generic API promises.
