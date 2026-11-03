# Privacy and permission boundaries

Status: proposed security/data design; jurisdiction-specific review needed.

Separate personal account identity, business membership, business customer relationship and transaction participant. A parent, payer, attendee and recipient can be different people. Access requires an explicit relationship and role; matching email strings is insufficient.

Use least-privilege business roles and server-side tenant checks. Location-specific roles can constrain schedules, customers and fulfilment. Internal support access is separately authorised. Exports, account recovery and role changes require special attention because they can bypass normal UI boundaries.

Define data purpose, lawful basis, controller/processor roles, retention and deletion treatment before launch. Account deletion does not automatically erase records that must lawfully remain; retained material should be minimised and access-limited. Backups, exports, logs and third-party processors are part of the lifecycle.

Customer communication distinguishes operational notices from marketing. Do not share one merchant's customer list with another. Location permission is optional for discovery. Optional analytics and tracking follow applicable consent requirements; NFC taps do not bypass them.

Acceptance: changing a URL or business ID cannot reveal another tenant's records. An authorised export contains only the intended business scope. Removing an employee revokes active sessions or permissions appropriately. Deleted account flows explain retained transaction records accurately. Sensitive professional notes are not included in routine messaging or general support exports. Permission denials give useful recovery without revealing whether a private customer record exists.
