# Taplo · Sign-in, identity and recovery

Working edition 2.6 · 3 November 2026. Adopted blueprint decisions for customer, merchant and staff access. Extends 57, 64, 71–72, 75, 95 and current architecture. Not an installed auth provider or verified secure implementation. Product copy below is production-style; technical readiness remains here.

## Methods chosen

| Audience | Initial sign-in methods | Extra protection and boundaries |
| --- | --- | --- |
| Customers | Continue with Apple; Continue with Google; Continue with email using a one-time code | Guest browsing/eligible transactions remain; optional passkey after sign-in; sensitive changes reverify |
| Business owners | Same Apple/Google/email methods and same person identity | Verified business membership; authenticator/passkey protection and step-up for privileged actions |
| Business staff | Same methods after an authorised invitation | Only invited business/location/assigned work; no implied ownership or finance authority |
| Taplo Console staff | Separate workforce invitation and approved organisation identity/access | Mandatory MFA and separately scoped operator session; no public Console signup |

Use one person account across customer and member contexts, not a different identity for every business. Business is an organisation/membership and legal-seller relationship, not a choice that permanently converts a customer into another type of person. Native Taplo and Taplo Studio use distinct clients and audience-specific journeys against the same person/membership records. Console privilege is a separate controlled workforce relationship.

No SMS sign-in at launch: avoid mandatory phone collection, pumping costs, SIM-related recovery risk and another required bill. No Facebook/Microsoft/LinkedIn buttons without evidenced need. Passwordless email is the initial email option; do not add a password field and reset journey by accident. A passkey is optional customer convenience and a supported security route; Face ID app unlock alone is not server-side step-up or proof a payment was authorised.

## Technical default and current evidence

Retain Neon Postgres as the greenfield database. Select a maintained **Better Auth server deployment** with appropriate Postgres adapter/plugins as the working authentication implementation, hosted with the first-party API; use Resend for the controlled security email stream. Exact stable versions/configuration are pinned and reviewed against the actual repository before implementation. No per-user hosted-auth fee is assumed for the library; compute, email, security/maintenance and any optional managed features still cost money.

Current Neon also offers managed Better Auth and other backend features; it is not database-only. Managed auth is a possible substitution after actual API/native/MFA/recovery/region/contract evidence, not another simultaneous identity store. Supabase Auth remains part of the alternative stack rather than a second parallel provider. Do not change a functioning existing auth stack without a migration/invite/provider-link plan.

Better Auth documents email OTP, Apple setup, Expo integration and 2FA [A1–A4]. Important current limitation: its documented default 2FA enforcement covers selected credential endpoints; social/email-OTP/passwordless routes are not automatically gated. The blueprint therefore requires an explicit server-enforced assurance gate for protected sessions/actions across **every** enabled method. Installing a plugin or enabling passwordless enrolment does not prove enforcement. Prototype/review this integration before treating the auth stack as release-ready.

## Signup and return UX

A shared entry says **Continue to Taplo**, with Apple/Google/email choices, terms/privacy links and a clear back path. Studio says **Sign in to Taplo Studio** with the same methods. Avoid a first-screen Customer or Business account question. A customer returns to the action that requested access; an owner returns to the prepared business draft or member workspace. A provider sign-in cannot silently publish a page, create a paid plan, consent to marketing or grant business access.

Owner registration preserves the recognisable page draft and account-at-end direction. Email/phone required for a booking, fulfilment or legally necessary business contact is collected for that specific purpose, separately from minimal authentication. Google/Apple sign-in is not consent to import contacts/calendars. Calendar OAuth is a separate narrow connection at the actual task.

Email step: **What's your email?** → **Check your email** → one accessible code field, paste/autofill support, masked address, Change email and a countdown resend. Working defaults: six digits, ten-minute expiry, one use, no more than five verification attempts per challenge, thirty-second resend cooldown with layered account/IP/device/global abuse controls. These are product/security defaults to tune with evidence, not a legal standard. Reissuing invalidates the previous challenge; explain Use the latest code. Store challenges with suitable protected hashing/expiry and never log OTPs/tokens. Avoid responses revealing another person's membership/existence.

Public guest checkout remains supported where appropriate. Retrieving/claiming a guest transaction needs proof of the relevant contact/relationship, not only matching the new account's name/email string. A guest claim grants that record, not another family's history. Reviews and private Activity require the defined verified relationship. Marketing preferences remain separately optional.

## Apple/Google identity and safe linking

Server verifies intended client/audience, issuer, nonce/state, signature and expiry; redirect URIs/return targets are allowlisted. Use the supported browser/native flow with PKCE where appropriate; do not collect provider passwords inside a webview. Provider credentials/private keys remain server-side and rotated. Native public clients cannot keep a secret safely.

Identity mapping uses validated provider issuer/subject, not display name or email as universal primary key. Apple's private relay email is a valid contact path and may differ from another provider's email. Name/email may only be supplied at certain provider events; do not overwrite stored identity with blanks or invent initial logos. An owner/staff public professional profile remains separately controlled.

Default: no automatic account merging merely because emails match. An authenticated user adds a provider in Account → Sign-in methods after recent proof, then authenticates the provider; conflicts require proof of both identities and a careful recovery flow. Show existing methods without exposing another person's data. Do not let an attacker use link-account, unverified email or a stale invitation as an account takeover route. Never merge merchant records/seller accounts on a social login event.

Apple relay delivery requires registered/authenticated actual outbound sources [A5]. Configure relevant Resend/security/service sender domains with the Apple team; test replies/bounces, missing real email, forwarding disabled and relay address change. Do not demand a real email solely because the relay looks unusual. Process validated provider revocation/account-change events appropriately; Apple account revocation is not automatic deletion of every lawful transaction obligation.

## Invitations, ownership and membership

Invitation stores business, intended contact, role/action scope, locations/resources, inviter, expiry, status and an unguessable one-use claim reference. Default expiry seven days; revoked/accepted invites cannot be reused. Sender can cancel/reissue; an invite cannot grant a higher scope than the inviter can manage. No public phone/email name search exposes all staff accounts.

The intended invite contact must be proved. If Apple relay differs from the invited address, verify the invited address separately or have an authorised owner reissue/approve the corrected identity; possession of a forwarded invite alone is insufficient. Do not solve mismatch by granting everyone with the same display name. On success show business, access summary and Accept invitation; entering the workspace is a deliberate context switch. No new business signup is required merely to join a team.

Ownership transfer is not ordinary staff role editing. Require current owner authority, recent strong verification, explicit recipient acceptance, impact review and recovery/security notices; financial seller/Stripe responsibility has its own validated process. Removing a membership revokes that business's sessions/grants/queued authorities appropriately and preserves the person's unrelated customer activity and other business memberships. Last-owner deletion/exit needs an appropriate ownership/closure route without using it to deny lawful deletion indefinitely.

## Sessions and privileged actions

Working limits for implementation evaluation: customer idle expiry 30 days/absolute 90 days; Studio idle seven days/absolute 30 days; Console idle 30 minutes/absolute eight hours. Rotation/revocation and current membership checks override remembered sessions. Show active devices and revoke other sessions. Risk/abuse can require earlier reauthentication; do not call an idle limit an assurance guarantee.

Owner/admin/finance access must complete supported strong-factor enrolment before privileged capabilities activate; ordinary safe draft setup can continue. A recent step-up proof (working maximum age five minutes) is required for ownership/grant changes, finance/provider settings, important refunds under policy, sensitive export, authentication/contact changes and account deletion. Scope the proof to intended principal/session/action; a browser toggle cannot mint assurance. Every OAuth/email-code/passkey route must meet the relevant assurance policy, not bypass it via an unguarded endpoint. Backup codes are generated securely, shown once, protected at rest and single-use.

Browser API auth uses tightly controlled first-party origins, host-only Secure/HttpOnly cookies as appropriate, CSRF/origin checks and credentialed CORS only for approved origins. Never set a wildcard parent-domain privileged cookie or allow arbitrary merchant custom domains as credentialed API origins. Native session secrets use platform secure storage; no long-lived auth token in a share link or generic localStorage. Console has a separately restricted session/audience; consumer auth does not open it. REPOSITORIES-DOMAINS-AND-DEPLOYMENT specifies boundaries.

## Recovery, deletion and failure

Lost-provider/factor recovery uses an already linked verified method or restricted recovery process, with notices and proportionate safeguards. Do not let support reset ownership/MFA from a name, public page or emailed screenshot alone. No employees ask for passwords/OTPs. Restrict high-risk changes during account recovery under reviewed policy, without stranding a customer's legitimate refund/access request. Record reasons and appeal/escalation.

In-app Account → Delete account initiates a straightforward deletion flow, with fresh verification and clear lawful-retention/ongoing-commitment information. Google Play also requires the applicable public web deletion route [A6]. Revoke sessions/provider authorisations/tokens as applicable, detach memberships/pass updates and apply purpose-specific retention; business closure, person deletion and purchase cancellation are separate operations. Apple-token revocation must follow the selected supported integration, not simply deleting a local database row.

Required UI states: provider unavailable/cancelled; email delayed/bounced; wrong/expired/latest code; rate limit; no linked method; invitation mismatch/expired/revoked; inaccessible workspace; strong factor missing; changed phone/device; revoked session; pending deletion; active commitments and masked private metadata. Preserve safe return/draft context without preserving secrets in URLs. Do not make push/location/marketing consent a condition of sign-in.

## Required evidence

Apple relay, Google subject/email-change, duplicate account/linking, cross-business role revocation, guest claim, native/browser callback and public-preview privacy, OAuth and email-OTP MFA enforcement, factor recovery, logout/revoke, deleted account and reviewer login must be tested against the pinned real implementation. No live sign-in/provider configuration was performed in this document task.

A1 https://better-auth.com/docs/plugins/email-otp ; A2 https://better-auth.com/docs/authentication/apple ; A3 https://better-auth.com/docs/integrations/expo ; A4 https://better-auth.com/docs/plugins/2fa ; A5 https://developer.apple.com/help/account/capabilities/configure-private-email-relay-service/ ; A6 https://support.google.com/googleplay/android-developer/answer/13327111 . Current first-party guidance checked 3 November 2026. Passkey/native compatibility and recovery enforcement must be proved for the actual stable versions; no beta-only feature is a hidden release dependency.
