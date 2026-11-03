# Domains: routing, security, SEO and exit

Status: proposed engineering contract. Depends on: 26–27, 36, 39.

Maintain a verified host-to-business binding. An arbitrary Host header must not select a tenant or create redirects. Normalise domains safely, handle IDNs and reserved names, prevent duplicate active claims, prove control and retain audit evidence. Do not permit a user to claim Taplo system domains or another business's verified domain.

States: requested → verification required → DNS pending → certificate pending → active; with actionable failure, disconnected and removal states. Do not label the page Live merely because a provider accepted the API call. Check HTTPS, hostname mapping and correct tenant response. Vercel documents programme-based domain assignment, verification and automatic certificates; its current returned records/settings are authoritative for an implementation. [D4]

Choose an apex/www preference and one primary business host. Redirect equivalent public addresses where appropriate, keeping item paths and meaningful parameters. Maintain canonicals, sitemaps and share URLs consistently. Test domain changes on public item links, popup direct routes, QR/NFC destinations, payment-return URLs and secure customer handovers. A wildcard platform domain and arbitrary customer-owned domains have different certificate/verification arrangements.

Customer authentication cannot rely on a shared cookie spanning unrelated custom domains. Use central account identity with a secure scoped handover, redirect/CSRF validation and intended-return path as appropriate. Never place a long-lived customer session token in a shareable URL. Native app association on every customer domain is not automatically inherited; prefer a controlled Taplo link domain for reliable app handover, and explicitly validate any custom-domain app-link support.

Keep Taplo's NFC accessory redirects on a stable platform-controlled host even if the preferred business destination uses a custom domain. Changing or losing that domain can then fall back safely without physically rewriting every accessory. Prevent open redirects by limiting destinations to validated business-owned/public routes.

Removal: verify the actor → explain effect and fallback → change preferred routing/canonical where needed → detach provider mapping → clear association/caches safely → mark released according to the reclaim policy. Registration transfer/cancellation is a separate explicit workflow. Prevent dangling records/subdomain takeover and require fresh control proof on a later claimant.

Acceptance: two businesses cannot claim the same host; expired ownership does not expose another tenant; www/apex and offer paths remain correct; unknown hosts fail safely; payment returns and sign-in work across the supported domain path; no private records appear in sitemap/HTML. Existing customer receipts and stable NFC links remain accessible under appropriate permissions after domain detachment.

Source D4: https://vercel.com/docs/platforms/multi-tenant-platforms/configuring-domains .
