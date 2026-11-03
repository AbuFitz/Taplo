# 78 · Assisted website and Google profile setup

Edition 1.1 · Revised 3 November 2026. Optional future Studio basic-content assistance; deferred from initial onboarding and not required for launch. Spec 79 supersedes the earlier import-first suggestion. A submitted URL starts a bounded review workflow, not publication, ownership verification or a promise of complete live synchronisation.

## Website link: the practical starting point

Optional future Studio action: “Use details from my website”. Manual setup remains the primary path; no onboarding extraction fork. Ask the user to confirm they are authorised to use the business content. Import an initial draft from suitable accessible pages; keep independently verified business/account/domain ownership checks separate.

Suggested pipeline: validate/normalise URL → inspect permitted public homepage and a bounded set of relevant same-site pages → extract structured data and explicit visible facts → identify field candidates and conflicts → preview source-backed draft → owner chooses/edits fields and confirms rights → apply approved changes under version guard → validate operational readiness → publish separately. This is technically achievable, but extraction quality varies by website; “paste a link and everything works” would overpromise.

| Candidate | Draft treatment | Required review / limit |
| --- | --- | --- |
| Trading name and short introduction | Source-backed text candidate | Avoid legal-name inference, duplicate slogans or generated identity |
| Logo/photos | Offer clearly identified candidates | Owner confirms usage rights; image presence does not prove it is a logo or reusable |
| Contact and social links | Extract explicit business links | Check current purpose and public/private visibility; no verification claim |
| Address/coverage | Configure manually outside this basic-content assistant | Owner chooses premises, service area and public/private visibility |
| Opening/working hours | Excluded from this basic-content assistant | Owner configures public hours and actual scheduling rules deliberately |
| Offers, prices and operational settings | Excluded from this content assistant | Owner manually creates offers and configures prices, duration, booking mode, stock, payment and fulfilment |
| Visual palette | Optional suggestion from appropriate merchant assets | Accessible preview; no forced recolouring or invented mark |
| Reviews/ratings/credentials | Excluded from ordinary automatic import | Separate rights, verification, attribution and moderation rules |
| Policies/legal pages | Do not adopt as an approved Taplo policy | Actual transaction/jurisdiction and reviewed terms required |
| Customer lists, orders, staff access, saved cards | Not obtained from public website extraction | Separate authorised migration/provider workflow |

Structured data is a useful input, not guaranteed truth. If homepage, structured data and contact page disagree, surface the conflict and source; do not silently pick the most convenient identity/contact. Empty or unsupported fields remain incomplete. AI can help propose a short description/classification, but cannot invent a credential, duration, cancellation policy or bookable slot.

## Google link: a different integration

A Maps/Business Profile link can identify a candidate business; it does not authenticate its owner. Google's Business Profile API access requires an approved project and user authorisation [R35–R36]. Its published policies also restrict permitted use and content storage [R37]. Therefore do not promise unrestricted permanent copying into Taplo merely because an owner signs in or confirms a suggested value. Confirm the intended use/licensing with Google before enabling a Google-derived import; manual/merchant-website-sourced setup remains available.

If a compliant Google management feature is adopted: explicit Connect Google → consent → select an authorised location → review supported permitted data and account scope → apply only supported approved operations → clear disconnect/revocation. Import permission is not permission to edit the Google listing, reply to reviews, add a manager or publish. Each consequential external write requires the appropriate explicit authority and separate workflow.

Places API public lookup is distinct from owner-authorised Business Profile access. Its content has storage/display/attribution conditions [R38]; it is not a freely reusable database for permanently populating Taplo profiles, reviews or a non-Google discovery map. Changing the API, asking the user to click Confirm, or paraphrasing API content does not remove those restrictions. Owner independently provides facts/assets from a source they can authorise where required. No scraped Google reviews or Photos silently become Taplo-native reviews/gallery.

## Review experience

Keep a useful editable preview alongside a short list of suggested fields. Source badges identify website/manual/upload/connected source; show conflicts as “Needs checking”, not invented confidence percentages. Let the owner deselect candidates, edit and undo. Save a partial draft, resume a failed import and continue manually. Do not overwrite a later manual edit on retry/reimport. Prefer “We found these details—check they’re right” over claiming the page is verified or ready to transact.

Fetch failure, unsupported site, wrong business match, redirect loop, multiple branches, no imagery, restricted content, protected pages, permission refusal and rate/cost limits all have explicit manual recovery. Do not bypass login, CAPTCHA or paywalls. Do not submit website forms or mutate the source as part of reading it.

## Engineering and safety

Website fetching accepts untrusted URLs/content. Use an isolated controlled fetcher with appropriate SSRF protections [R39]: restrict schemes, block internal/metadata/private destinations, validate DNS/network targets and every redirect, bound requests/bytes/time, and validate separately fetched assets. Never execute arbitrary source scripts in the app origin or treat page text as instructions to an agent. Sanitise/validate media; no active HTML/SVG/remote content is pasted into the public page unchecked. Respect applicable website terms/rights and the user's actual authorisation.

ImportJob tracks owner/business, source type/URL, status, fetch/parse version, candidates, warnings, approved application version and expiry. ImportCandidate tracks target field/object, source reference, extraction method, candidate value/reference, conflict flag, rights/retention restriction and owner decision. Restrict raw source retention; provider terms determine what may be stored. Public projections do not expose private source tokens or rejected personal information. An owner-confirmation event is not a mechanism for laundering restricted third-party content into unrestricted merchant content.

Apply command verifies membership, current draft version, selected candidates, source/rights rules and a strict basic-brand-content field allowlist. It rejects prices, offer creation, duration, working hours, availability, stock, policies, payment and fulfilment configuration even if an extraction or model proposed them. It creates/updates drafts only. It cannot enable payments, publish, claim a domain or grant staff permissions. Repeated application is idempotent and partial application has a clear result/undo policy. Ongoing sync is a separate optional design with field authority, refresh, stale state, conflict and disconnect rules—not an implied consequence of a one-time import.

## Recommended sequence

First: excellent manual guided setup and Studio first-offer creation. Defer website extraction from launch unless evidence justifies it. If introduced later, keep a basic-content-only Studio assistant. Google-assisted features remain separately subject to approval/policy review. Explicit migration/sync products are separate scope decisions. The user experience can feel simple while the system remains honest about incomplete or restricted data.
