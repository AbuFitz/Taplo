# Taplo cards, tags and physical sharing products

Status: proposed separate business workflow. Evidence: modern NFC profile systems in source record.

Distinguish the merchant goods sold on Taplo from Taplo-branded NFC cards, plaques, stickers and similar accessories. Taplo is the seller for its own hardware order under the applicable business model; these orders need their own fulfilment, returns, replacements and support.

Prefer a durable HTTPS redirect per accessory with a supported QR fallback. The hardware identity resolves to an authorised destination rather than permanently encoding a mutable business handle. Destination changes require authentication and permissions. Validate hardware compatibility, NFC behaviour across devices and QR printing before promising universality.

Workflow: order hardware → manufacture/provision → fulfil → verified claim → bind to business/location or approved action → test tap/scan → activate. Staff can manage permitted destination changes. A lost card can be revoked or redirected; a replacement retains the business destination through a new accessory identity. Ownership transfer uses a verified release/claim process, not possession of the printed public URL.

Do not treat a tap as a payment authorisation, identity proof or marketing consent. Analytics must distinguish approximate link opens from verified transactions, minimise data and avoid fingerprinting visitors.

Acceptance: renaming the business does not break cards. A stolen public URL cannot reassign an accessory. A replacement is traceable without exposing secret claim tokens. A closed business does not redirect customers to an unrelated new owner by default. A broken tag still has an appropriate QR/short-link route and a clear replacement support path.
