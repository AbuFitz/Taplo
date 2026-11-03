# Taplo · Repositories, apps, domains and deployment

Working edition 2.6 · 3 November 2026. Concrete blueprint default. This is a source/deployment plan, not repositories created, DNS changed or applications deployed. Existing production links/hosts, if any, require an actual inventory and migration before change. Extends 01, 03, 40, 43, 84, 94–95 and customer web architecture.

## One repository, separate deployable applications

Use one private product monorepo with pnpm workspaces and Turborepo as the initial build/task organisation, subject to current repository compatibility. A monorepo is a shared source workspace, not a single inseparable deployment. This avoids copying the pricing/permissions/booking engine into several unrelated projects. Split repositories later only when team/access/release needs justify the coordination cost; Console still has a real deployment/security boundary while sharing audited contracts.

| Proposed source area | Responsibility | Delivery |
| --- | --- | --- |
| apps/web | Main marketing, solutions, examples, public business mini-spaces and customer browser app | Independent public web deployment on Vercel |
| apps/studio | Business owner/member workspace | Independent owner web deployment |
| apps/console | Restricted Taplo operations/support/trust/platform marketing | Independent privileged deployment and workforce access |
| apps/api | First-party auth and authoritative business commands/provider webhooks/jobs | Controlled API deployment; durable asynchronous/reconcile workers as supported |
| apps/customer-mobile | Taplo customer app | One Expo/React Native project with iOS and Android builds |
| apps/studio-mobile | Taplo Studio owner/member app | Separate Expo project with iOS and Android builds |
| packages/contracts | Versioned records, commands, errors and client interfaces | Shared source/version boundaries, no secrets |
| packages/domain | Booking/time/stock/money/policy invariants | Server authoritative; safe shared validation without leaking secrets |
| packages/database | Migrations, typed server data access and tenant constraints | Server only; one migration owner per release |
| packages/auth | Vetted common auth policy/clients and assurance checks | Distinct public/workforce configuration and secret boundaries |
| packages/design-tokens | Typography, colour semantics, spacing, motion, icons | Shared values, separately validated platform output |
| packages/ui-web / ui-native | Appropriate accessible web/native components | Shared design grammar; no promise shadcn/Radix DOM components run in native |
| packages/email | Versioned controlled email templates/rendering | Used by notification workers, not browser-controlled mail sending |
| packages/providers | Server adapters for Stripe/email/SMS/calendar/etc | Provider secrets isolated; interfaces/test fixtures reused |

Directory names are a proposed target, not an instruction to move every existing file blindly. Shared packages need dependency rules so web/mobile cannot import database/provider secrets. Explicit server-only exports and build checks prevent accidental bundling. Native code shares contracts/domain-safe helpers/tokens, not a second copy of payment truth. No separate database/server per merchant, widget, app or custom domain.

## Recommended public address structure

| Address | Purpose | Public/private and search |
| --- | --- | --- |
| mytaplo.com | Main marketing, /solutions, /features, /pricing, /app and legal/help | Public marketing HTML |
| mytaplo.com/<handle> | Canonical Taplo-hosted business mini-space | Public published records, appropriate canonical/metadata |
| mytaplo.com/explore | Customer browser discovery; /saved, /activity, /account for return | Explore public; private routes authenticated/noindex/no-store as appropriate |
| studio.mytaplo.com | Owner/member web workspace | Private application, deliberate entry/auth |
| console.mytaplo.com | Taplo workforce operations | Privileged separate audience/deployment; not public signup |
| api.mytaplo.com | Controlled first-party commands/auth/provider callbacks | API, not a marketing site or public headless offer |
| status.mytaplo.com | Independently reachable incident information | Public status; preferably independent serving path |
| Merchant custom domain | That business's canonical mini-space | Verified routing, no console/API secrets or global session cookies |
| notify/mail sender subdomains | Actual registered email sending purposes | DNS/authentication role, not another set of user-facing websites |

These are proposed production hosts requiring ownership/DNS/TLS verification. One root domain plus subdomains is enough; customers do not need another brand/domain to use Taplo in the browser. Explore is a destination within the customer product. The main marketing site has solution showcases and a clear route to customer Explore, not separate duplicated sites with conflicting pricing/content.

Earlier app.mytaplo.com owner-dashboard ideas are not a reason to create a second active owner URL. Reserve it during route inventory; if actually in use, implement reviewed path-specific redirects to Studio while preserving safe intent. Do not reuse a live host for another audience without auditing old links/auth callbacks/cookies. No redirect blindly forwards private bearer tokens or arbitrary return URLs. Root handle allocation reserves system route words before publication. Existing merchant custom-domain strategy in 40/107 remains authoritative for canonical duplicates and exit.

## One person, several protected contexts

First-party customer web and Studio can use the common identity service while every request verifies actual membership/relationship. API-hosted auth uses strict approved origins, host-only protected cookie handling, CSRF and validated callback/return rules. Do not relax CORS to every merchant custom host or every preview domain. Console uses separate workforce configuration/audience and operator session; an ordinary owner/customer token cannot become operator authority.

A custom-domain customer needing private account activity crosses to a safe first-party task/auth route with minimal context and returns deliberately. No merchant-owned hostname receives a Taplo global session cookie or long-lived access token. The mini-space is a sanitised rendered page, not arbitrary user JavaScript with platform access. Native apps use secure storage and controlled first-party API clients. Apparent shared sign-in convenience never grants a business role by email alone.

The first-party API is internal product infrastructure. It does not create a public supported headless API, Shopify sync or arbitrary customer integration contract. Future external API access requires its own product/security/version/rate/support design.

## Environments, release and compatibility

Separate local, development/test, staging and production credentials/resources. Preview builds get synthetic/seeded data and scoped development services; no production DB/service key copied into a general agent preview. Provider OAuth callbacks have explicit allowed environment URLs rather than wildcards. Native development/staging identifiers, push and deep-link hosts are separate from public production identities.

CI detects changed apps/packages, runs relevant checks and builds affected outputs. Contracts/domain changes can require several app checks even when their UI code did not change. Public web, Studio, Console and API deploy independently; native binaries go through their store pipelines. One source change does not automatically publish all binaries or run a destructive database migration.

Use backward-compatible expand/migrate/contract changes. Add fields/compatible endpoints first, deploy backend, verify, then release clients; remove old behaviour only after supported mobile versions/usage allow it. Store-installed older apps can remain active for weeks; forcing all customers to update immediately is not a migration plan. A minimum-version gate is reserved for genuine incompatibility/security with a clear browser/support path.

Keep migration ordering/authority, durable outbox/event version, webhook verification, idempotency, integration status and rollback/forward-repair in the release packet. A rollback cannot make an older app charge again or misread a newer refund. Payment/reward/appointment invariants remain server-owned across versions.

## Operational ownership and safety

Company-controlled GitHub/Vercel/Expo/store/DNS/provider organisations, at least appropriate recovery/admin redundancy, MFA, least privilege, secret rotation and dependency/licence/security checks. Do not put all signing/registrar control in a freelancer's personal account. Protected branches/review/CODEOWNERS help but do not imply every collaborator can be denied source access inside one private repository; sensitive operational secrets are never source files. Split access later if actual need requires it.

Monitor each deployed surface plus the connected journey. Independent status and incident ownership matter when the primary host fails. Backups, restoration and provider reconciliation are shared data responsibilities, not replicated ad hoc in each app. Jobs need durable execution/retry semantics; no assumption that an unawaited request or a browser tab sends tomorrow's reminder.

Required evidence: dependency boundary scan, preview-secret isolation, cross-tenant/Console access checks, callback/redirect tests, merchant custom host auth boundary, old mobile contract compatibility, actual migrations/restore and provider-event replay. This plan does not create any repositories, branches, cloud projects or DNS records.
