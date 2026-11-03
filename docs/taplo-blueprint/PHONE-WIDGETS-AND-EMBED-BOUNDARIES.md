# Taplo · Phone widgets, page blocks and website embeds

Working edition 2.6 · 3 November 2026. These are three different surfaces sharing the same underlying records, not three independent copies of business data. Extends 31, 37, 43, 53–60, 77/81 and current native architecture. Open WALLET-AND-WIDGET-REFERENCE.html for selected fictional visual compositions; it is not WidgetKit/Android code.

## Three meanings of widget

| Surface | Audience/use | Rendering and authority |
| --- | --- | --- |
| Business page blocks | Services, product rails, gallery, reviews, team, rewards | Taplo block/theme engine and existing typed sources/popups |
| Existing website embed/launcher | Add a supported booking/action to an existing site | Controlled published task component/deep route, safe host integration |
| Phone home/lock-screen widget | A quick useful customer/owner glance or shortcut | OS widget runtime with minimal authorised snapshot and current app route |

The page's customisation grammar is not pasted into a phone widget. A business can choose its page blocks, a website owner chooses supported embed placement, and the phone user chooses/install/configures their widget. Native widgets cannot require browsing a twenty-step editor to show one next appointment.

## Useful initial phone widget set

| Widget | Small composition | Medium/expanded composition | Tap/action |
| --- | --- | --- | --- |
| Customer: Next up | One next booking/collection time and safe business label | Same plus permitted next step and last-update context | Opens that authorised Activity task, rechecks access |
| Customer: Saved business | One deliberately selected business identity, no invented avatar | Two/few chosen safe shortcuts | Opens same mini-space; never auto-buys |
| Customer: Rewards | Chosen programme with safe progress if user opts in | Chosen limited programmes and View rewards | Private business return; pass/show-code after authentication |
| Studio: Today | Assigned upcoming work count and next start time | Bounded next items for selected business/location under role | Opens scoped calendar/today, checks current membership |
| Studio: Quick tools | New booking / show business QR shortcut | Scan eligible reward / open today's work / share public page | Opens protected full task; never directly refunds/charges |

Start with customer Next up and Studio Today as reference-priority designs; other widgets remain explicitly specified candidates until supported/validated. No feature is claimed live. Relevant safe widgets are available with the underlying entitlement: no new per-widget fee, staff fee or paid security toggle. Rewards widget requires an eligible existing programme; it does not create Pro entitlement by itself.

## Privacy-first configuration

Choose workspace/business/location and content mode inside the app or OS configuration. Default private previews conceal customer names, exact service/intake details, addresses and money, especially on lock screens. Small label: Next appointment · 14:30 · Open Taplo. Owner default: 3 upcoming · Next 14:30 · Open Studio. Revealing a merchant name can itself be sensitive (clinic/tutor); user selects safe detail level and a neutral option is always available. Never show learner names, clinical notes, card details, private messages or personal redemption barcodes on a lock screen.

Widgets are scoped to one authenticated person and explicit configuration, not the last globally selected merchant in an unrelated app tab. A staff member cannot choose an unassigned location or enable private fields by editing client settings. Sign-out, membership revocation, account deletion and lost-device recovery clear/invalidate sensitive snapshots and trigger provider refresh where possible. OS caching may delay visual replacement: do not promise instant removal from every screen; choose low-sensitive defaults, protected native storage and expiry/redaction.

## Current 2026 implementation options

Current Expo documentation provides **expo-widgets** for iOS/Android home widgets and iOS Live Activities using Expo UI. It requires a development build, has an isolated widget runtime, and Android support uses an explicit configuration/subset [G1]. Do not repeat the older claim that every Expo widget must be handwritten Swift. Select the pinned stable SDK/library and prove platform support on actual devices. Fall back to a maintained native extension/module where a needed feature is unsupported; do not hide a beta-only dependency in the release plan.

WidgetKit and Android/Glance have their own layout/update/privacy rules [G2–G4]. Use the correct extension/target/app-group/signing/data-protection configuration. JS code from the ordinary app, React hooks and live asynchronous state are not simply available inside an isolated widget layout. Server fetch/snapshot preparation and timeline scheduling are deliberate supported jobs, not an interval loop running continuously on the home screen.

System budgets and launcher behaviour mean updates are not guaranteed real-time. Produce future timeline entries from known schedule data, update snapshots after meaningful authenticated app/server changes as supported, show last checked state when relevant and expire private details to a safe placeholder. Appointment cancellation outside the app may not instantly redraw the widget; opening always rechecks authoritative state. Never let a stale widget confirm availability, show paid success or redeem a reward.

Live Activities are a separate optional feature, not the default home widget or an advertising stream. Assess a genuine time-bounded live task, permissions, privacy, update budget and cost before offering one; ordinary booking reminders do not require an always-on live activity. No push spam to force engagement.

## Visual and interaction contract

Frameless hierarchy inside the provider-defined widget container: short label, one dominant time/progress fact, one useful secondary line, no repeated Taplo+merchant logos/names. Safe recognisable neutral background with a restrained chosen accent, readable contrast and supported platform tinted/dark/high-contrast variants. Do not promise arbitrary widget shapes or full merchant-photo backgrounds. Pick sizes/families that preserve comprehension rather than compressing five appointments into a tiny square.

One item gets a clear next action; no item gets a calm empty state and useful Open app route; stale/private/revoked content gets a neutral placeholder. Configure different instances independently. Multiple business memberships show an explicit chosen business label when safe, not an ambiguous global schedule. Accessible names, dynamic text sizing and screen-reader order are designed per platform.

Tap opens the right record/task through verified links or supported app intents, with authentication/authorisation again. Mutating actions that affect bookings/money/rewards require the full protected review flow initially. Widgets do not directly add a charge, cancel work or broadcast a campaign. Safe public sharing can open the official share flow; private/code data remains protected.

## Website embed boundary

Initial supported embed is one bounded published booking/service/action launcher, not a headless site builder. Owner selects business/offer/action, supported appearance and domain/origin configuration, previews narrow/wide state and receives safe generated snippet/link. Source remains Taplo; an embed does not copy stock or customer lists into another site.

Use a controlled iframe/task route or appropriately restricted launcher based on actual hosting/CSP/accessibility requirements. Frame/postMessage origins and message shapes are allowlisted; height events cannot inject arbitrary navigation/code. Payments/provider restrictions and third-party-cookie behaviour are tested; offer a clear first-party full-page fallback. Private account cookies/tokens are not handed to the embedding site. Merchant removal/offer unavailability and theme changes update from source with honest status. Existing Google/other scripts on the host are not automatically approved by Taplo's consent notice.

## Release evidence and costs

Budget native work/builds/device QA, provider update traffic, snapshot storage/expiry and support. Widgets are not a separate cloud provider purchase by default, but are not costless engineering. Validate sizes, iOS/Android/tinted modes, deep-link return, stale/no-network behaviour, sign-out/revocation, shared device/lock screen, selected business/location changes and screen-reader/large text. Native SDK changes and extension configuration can require new store builds.

G1 https://docs.expo.dev/versions/latest/sdk/widgets/ ; G2 https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date ; G3 https://support.apple.com/guide/security/widgetkit-security-secbb0a1f9b4/web ; G4 https://developer.android.com/develop/ui/compose/glance/create-app-widget . Retrieved 3 November 2026. Exact stable-version APIs and platform rendering still require real implementation evidence.
