# 81 · A useful companion to an existing website

Working edition 1.2 · 3 November 2026 · Product recommendations, not implemented integrations. Extends 77; preserves native Taplo commerce and the basic-content-only import boundary in 78–80.

## The proposition

An established website explains the business. Taplo can handle the compact action and everything the customer needs afterwards: booking, paying a balance, checking a job, collecting an order, changing an appointment, messaging or redeeming a reward. The merchant need not replace their site or ask every visitor to install an app.

The distinctive opportunity is continuity across website, social link, professional link and physical touchpoint. This is a hypothesis to test, not a proven market gap or a claim competitors cannot do it.

## Useful entry patterns

| Pattern | Customer experience | Merchant setup | Boundary and recovery |
| --- | --- | --- | --- |
| Action link | Website's existing Book button opens the relevant service/person, not a generic homepage | Choose an existing published action; copy link; approve website return destination | Product/service still available and price rechecked; unavailable item explains alternatives |
| Small action launcher | Website button opens an accessible Taplo action panel | Optional script or link; choose one to three actions and contrast-safe accent | No entire mini-site squeezed inside a popup; link fallback if script blocked |
| Contextual next action | After a quote, customer approves scope and pays the required amount in one private task | Merchant issues a scoped proposal/task link | No identity, price or entitlement trusted from a public URL parameter |
| Private return space | Customer finds their appointment, balance, instructions and messages together | Created from the underlying transaction | Account optional where safe; protected actions verify access; no public customer directory |
| Repeat shortcut | Repeat an eligible service with the usual professional or reorder available items | Enable repeat capability; choose availability/variant rules | Fresh quote and current terms; never blindly recharge or reuse an old price |
| Location-aware action | Visitor chooses branch or checks service postcode before seeing eligible options | Explicit location/service-area rules | Manual postcode/location path; no forced geolocation or disclosure of home addresses |
| Physical-to-digital continuation | Counter QR opens collection instructions, reward or aftercare | Assign stable destination to the actual merchant/location/action | No private booking in a public QR; hardware link survives handle changes under declared terms |

No external shop connection is implied. A merchant selling the same physical items elsewhere must allocate stock or use an explicitly designed future synchronisation integration before Taplo can claim shared stock accuracy.

## Studio composition

Website tools belong under Sharing → Website, with a recommended plain link first. Show destination/action selector, live compact preview, copy link, optional integration instructions and a Test action. The preview uses current merchant identity, not a second independently editable profile. Advanced launcher settings stay collapsed.

Test action checks a published destination, eligible offer, merchant identity, mobile fallback and validated return URL. It cannot certify an external website deployment unless actually tested there. Copying code is not installation success. Use states Not installed, Instructions copied, Test observed, Needs attention; never fake a green connection indicator.

The public action view has one principal merchant identity, task heading, readable price/conditions and a restrained return link. Customer-app visitors retain Explore/Saved navigation context; a website visitor does not get forced into Explore. Popup families retain the same geometry and neutral readable bodies from specs 35/45. Embedded mode is not a second booking engine.

## Security and privacy rules

Allowlist installed host origins and message origins; restrict iframe permissions and validate postMessage type, origin and payload. Do not send customer PII, tokens or order details to the host website through analytics callbacks. Signed private links are revocable and time-bounded where needed; redact tokens from analytics, logs and referrers. Ordinary action links contain only public merchant/offer identifiers and optional non-sensitive campaign IDs.

Payments may require top-level navigation or provider challenge UI. Preserve the safe task ID before handover; on return, verify server state. Third-party cookie or storage failure must not strand a customer. Cover focus restoration, browser Back, keyboard, dynamic height, nested scrolling, screen-reader announcements and reduced motion. Start with links; enable embeds only after their separate acceptance cases pass.

## Smart opportunities worth prototyping

1. **One action, many placements:** configure a service once and reuse it on the website, profile rail, staff link, NFC and email. Changing its price updates future quotes across placements without rewriting old agreements.
2. **Useful return card:** the customer sees their next task with this business, rather than repeatedly browsing its public content. Public visitors cannot see personal cards; shared-device sign-out clears private state.
3. **Opening-aware launcher:** show Request a quote, Book, or Join the list based on explicit merchant capability and actual availability. Never invent urgency or substitute a different commercial action silently.
4. **Recovery without spam:** an interrupted task can resume safely on the same device. Cross-device reminders require a lawful contact purpose and appropriate authorisation; a website visit alone is not permission to message.

These are proposed combinations of established patterns. SavvyCal already documents inline/popup embeds, calendar overlay and scheduling controls; HoneyBook documents connected client actions in smart files; Bookwhen documents a return portal. Research ledger R45–R47 records those findings without claiming Taplo invented them.

## Acceptance scenarios

Book from an existing website without installing Taplo; lose third-party cookies and continue through the fallback; remove an offer after the link is shared; rename a professional without breaking a stable link; open an expired private task; return to the approved website; revoke an installed host; purchase through an external shop without creating a fictitious Taplo order. Each must have a truthful visible outcome and a diagnosable support trace.
