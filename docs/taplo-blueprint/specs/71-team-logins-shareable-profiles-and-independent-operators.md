# 71 · Team logins, shareable profiles and independent operators

Edition 1.0 · Recommendation responding to the barber/team-profile use case. Good scope: a merchant-scoped professional profile. Avoid silently creating a separate business/page-builder/payment system for every employee.

## Honest assessment

A barber benefits from a personal social link, portfolio and rebooking identity while customers still transact with the right shop. Current Fresha professional-profile documentation already describes shareable profiles, portfolios and direct booking [R12]; Square separately documents bookable staff and permissions [R13]. This is a useful established workflow, not by itself an unprecedented Taplo differentiator. Taplo can make it coherent with the shop's mini-space, customisation, direct links and simple staff workspace.

## Four concepts, not one overloaded account

1. User: person who signs in; can have personal customer activity and multiple authorised business memberships.
2. Membership: permitted staff role within one merchant, with assigned locations/resources and explicit access.
3. Bookable professional/resource: person eligible to supply specified services at eligible times/locations. Can exist before login invitation is accepted.
4. Public TeamProfile: merchant-scoped presentation of that professional; not a second merchant or unrestricted public version of the staff account.

Owner invites a member with role/location/services → invitation accepted securely → account links to membership → member sees permitted work/profile tasks. Invitation does not grant owner/finance/export authority. Owner can set up bookable staff without forcing every practitioner into full administration; public profile and login are related but not the same object. One user working at two businesses has separate membership/profile contexts and cannot automatically move customer data between them.

## Public page and link

Recommend a merchant-nested route such as `/b/{business-handle}/team/{profile-slug}` and `/team/{profile-slug}` on that merchant's custom domain. Stable TeamProfile ID resolves changes behind the route. Exact final route convention remains adjustable with the wider domain model. Link has a useful web view without app installation; app handover opens the same merchant/profile context.

Page composition: small clear parent-business attribution/link, professional name, optional actual photo, role/specialties, concise bio, portfolio/gallery, eligible services and primary “Book with [name]”. Same merchant typography/colours/popup family/rounded grammar. One name per identity context; no fabricated avatar initials. Parent shop is context, not another giant logo/title panel. No full independent menu, shop, pricing system or domain settings for an employee. Optional genuine social links can be allowed with merchant policy/visibility controls.

## Controlled customisation

| Setting | Owner/manager | Professional's own permitted edits |
| --- | --- | --- |
| Public name, photo, bio, specialties | Approve/manage | Edit own allowed fields; submit for review if configured |
| Portfolio/gallery | Moderate/reorder/remove | Upload/manage own permitted assets, with consent/right-to-use confirmation |
| Cover/layout module | Choose supported profile composition | Optional one approved arrangement/cover choice; no free-form second builder |
| Brand/popup theme | Merchant defaults | Inherited; only deliberately owner-approved accent option if later supported |
| Services/prices/duration | Assign and configure permitted service/staff variations | View; no arbitrary price or policy rewrite |
| Availability | Working schedule policy and approval | Request changes or edit within explicit grant; existing commitments protected |
| Calendar/customer access | Role/assignment scoped | Own assigned work and necessary customer context |
| Payouts, business domain, team roles | Separately privileged owner/admin | No access by profile ownership alone |

Recommended default: member content changes are drafts pending approval; owner can explicitly enable auto-publish for low-risk own-profile fields. Show Draft/Published, preview and result; no vague promise that every edit is immediately public. Changes to key pricing/booking settings remain controlled even where content auto-publish is allowed.

## Booking and relationship

Staff link preselects the professional and merchant. Only eligible assigned services and locations appear. Availability intersects staff, service, venue/resources and existing commitments. “Any available professional” is a separate explicit choice. If the chosen person has no suitable time, show later dates or deliberately choose someone else; never silently switch the staff member to win a conversion. Staff-specific price/duration, if supported, is disclosed before commitment and stored in agreement/booking snapshots.

Customer Activity names both shop and booked professional when relevant. Merchant owns the transaction relationship under the chosen commercial model; a customer can separately save the business and/or follow a professional when that feature is defined. Reviews are backed by an eligible experience and clear subject attribution; no copied shop review score becomes a personal rating. Team-link attribution can help analytics, but creates no automatic commission, ownership of all clients or marketing permission.

## Privacy, media and communications

Portfolio uploads require appropriate rights/consent, including identifiable client images. Do not embed private appointment/customer data in filenames, alt text or public galleries. Use attachment scanning/asset processing and merchant moderation. Professional contact can route through the merchant's authorised conversation system rather than expose a personal phone/email by default. Staff sees assigned necessary data, not every colleague's client notes. Profile visit/public-link analytics use the platform's privacy rules.

## Leaving, suspension and reassignment

Owner disables new booking/access → review future appointments, authored drafts, profile link and assets → reassign/cancel through appropriate customer communication and agreement handling. Never silently replace the booked barber. Public old profile shows an honest no-longer-bookable state or safe parent-business destination according to policy; it must not advertise current employment or expose whereabouts without a basis. Historical records preserve the professional actually booked/supplied. Membership revocation removes private access promptly.

Do not automatically transfer customer lists, reviews, images or appointments to the person's next business. Separate personal-authored media portability rights from merchant/client permissions and contracts. A publicly shared social link is not a transferable database ownership claim. If a future portable professional identity is introduced, design it deliberately with affiliation/history/privacy rules; do not smuggle it into the employee-profile feature.

## Employee versus independent chair renter

This is an operational distinction, not a classification based solely on a label. Ask who sells, sets prices/policies, takes payment, bears refunds/disputes and controls the customer relationship. If the shop is seller and pays staff internally, merchant-scoped profile fits. If the independent sells and gets paid directly, model a separate merchant/seller with an explicit venue relationship if supported. Shared premises/resources must still prevent double booking. The UI must identify the actual seller; a decorative staff flag cannot safely split settlement or obligations.

Payroll, tips, commissions, rent, personal domains and multi-business portable profiles are separate possible extensions with costs/rules; this proposal does not commit them. Employee profiles should not force the team into a more complex accounting model.

## Beyond barbers

Tutors, coaches, therapists where appropriately supported, repair specialists and class instructors can reuse the underlying professional/service/assignment model. The visible sections adapt: tutor expertise/eligible classes, repair specialist skills or maker/instructor work. Do not force a barber-style portfolio or personal public profile on every category/staff member. Enable the public profile only where useful; private team access remains available independently.
