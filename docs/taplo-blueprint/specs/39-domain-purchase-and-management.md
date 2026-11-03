# Buy, connect and manage a domain inside Studio

Status: viable researched product direction; provider/commercial agreement still to choose. Registration, DNS, hosting assignment and legal registrant ownership are separate concerns.

## Owner experience

Studio → Domains → Buy a domain / Connect a domain I own. For purchase: enter a name → current availability and full term-specific quote → see registration and renewal price, currency/taxes, premium status and auto-renew choice → correct TLD-specific registrant details → explicit purchase confirmation/payment → tracked registrar order → verification → DNS/hosting/certificate activation → choose preferred public address.

For an existing domain, no purchase or transfer is required just to connect. Show the actual required DNS/verification records from the selected hosting project. Explain where to enter them and preserve unrelated email/MX/TXT records. An optional assisted DNS provider flow can reduce effort where securely supported. Do not blindly replace nameservers or display one hardcoded IP/CNAME for every deployment.

## Provider comparison

| Candidate | Verified capability | Taplo assessment |
| --- | --- | --- |
| Vercel Domains Registrar API | Search/pricing, purchases/order status, transfers, renewals, auto-renew and nameservers | Natural technical candidate beside current hosting. Confirm commercial permission, end-customer ownership/export and operational terms before using it as a resale service |
| OpenSRS Domains API | Explicit embedded/white-label reseller offering with registration, renewals, transfers and contact management | Strong commercial-model candidate for selling domains inside Studio. Assess integration complexity, funding, API access/network requirements and support responsibilities |

Vercel's current registrar documentation and OpenSRS's current reseller/API material support the capabilities above. They do not establish Taplo's final margins or contractual arrangements. Do not mix OpenSRS's different API products' authentication or endpoints. [D1–D3]

## Data and operations

Separate DomainRegistration, RegistrarOrder, DomainConnection, DNSVerification, CertificateStatus, RenewalPreference and customer billing records. A domain can be registered but not connected, connected but awaiting certificate, expired at registry while still present in a local table, or owned outside Taplo.

Purchase is an asynchronous, financially consequential process. Quote expiry, an availability race, rejected contacts, provider timeout, insufficient reseller balance, customer payment failure and registry rejection need explicit states. Reconcile the registrar order before retrying; avoid duplicate charges. Define authorisation/capture/refund/credit behaviour with the provider rather than promising every domain order is reversible.

## Ownership and renewal

Record the merchant as the appropriate registrant using their genuine information and document the provider-account arrangement. Give owners a clear transfer/export route, security checks and the actual registry/TLD restrictions. Leaving Taplo hosting must not silently mean losing the domain. SaaS cancellation, domain auto-renew and domain cancellation are distinct choices.

Display renewal date, current auto-renew state, expected price when known and a billing/notification timeline. Failed renewal has escalating owner/support actions. Grace/redemption/transfer rules vary by TLD/provider; fetch them rather than inventing one universal window. Domain email hosting is a separate service and must not be implied by registration.

Acceptance: test purchase race and timeout reconciliation in a provider test environment; connect an existing domain without breaking email; recover from failed DNS/certificate activation; transfer out under authorised ownership; explain upcoming renewal; retain an available Taplo address when a custom domain is lost.

Sources: D1 https://vercel.com/docs/domains/registrar-api ; D2 https://opensrs.com/api/overview ; D3 https://support.opensrs.com/support/solutions/articles/201000063205-reseller-quickstart-guide and https://domains.opensrs.guide/ .
