# NFC hardware selection and provisioning

Status: candidate specification, not a committed supplier or compatibility guarantee. Buy samples and validate the complete physical product before a production order.

A short HTTPS NDEF URI on a genuine NFC Forum Type 2 tag is a sensible baseline candidate. NXP's NTAG213/215/216 family provides 144/504/888 bytes of user memory respectively. NTAG213 is a candidate for a short stable redirect payload if the actual encoded NDEF fits; larger memory is not automatically needed or a guarantee of better reading. Validate the actual record overhead and URL length. [N4]

Do not choose by chip name alone. Antenna size/tuning, enclosure, printing, intended placement and phone positioning affect the real experience. Cards, desk plaques, stickers and wearable products need separate sample tests. Metal-mounted products require an appropriate on-metal/ferrite construction validated with the supplier. Specify physical dimensions, read placement artwork, materials, durability, batch traceability, encoding and print tolerances.

## Provisioning pipeline

Order line/batch → generate accessory identity and stable URL → encode NDEF → verify exact read-back → print matching QR/short reference → test scan/tap → apply chosen protection policy → record quality result → fulfil → verified customer claim. Keep printed public references separate from private claim secrets. Vendor encoding files and claim-token exports require controlled access and destruction/retention rules.

If tags are locked read-only after correct factory provisioning, dynamic destination changes still work through the redirect. That lock is normally irreversible and must happen only after verification and an approved product policy. A writable/BYO product requires different instructions and abuse considerations.

Ordinary URL tags can be copied; a visible UID or NDEF link is not strong authenticity or identity proof. If anti-cloning becomes a real requirement, assess secure-chip designs, server validation and supply-chain implications separately. Do not market a basic tag as secure payment/access hardware. Wallet NFC redemption involves separate Apple/Google programmes and reader compatibility.

## Acceptance matrix and supplier brief

Test representative supported iPhones and Android devices, cases, tap positions, disabled/locked states, cold/warm launches, QR under print/lighting conditions, actual mounting surfaces and repeated read cycles. Record measured success, failures and recovery instructions, not an invented universal range. Ship a truthful compatibility statement and clear “where to tap” guidance.

Source N4: https://www.nxp.com/products/NTAG213_215_216 and https://docs.nxp.com/bundle/NTAG213_215_216 .
