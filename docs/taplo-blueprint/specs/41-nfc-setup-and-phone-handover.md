# NFC setup: make the normal path require no writing

Status: recommended convenience-first workflow, with researched native/web capability boundaries.

## Recommended ordinary Taplo product

Factory-encode each accessory with a short, stable HTTPS URL tied to its own inventory identity, plus a printed QR fallback. The owner claims the accessory securely and selects its permitted destination in Studio. Later destination changes update the server mapping. The owner normally does not need to rewrite the chip or install an app just to change their page link.

The public tag URL is not a secret claim credential. Pair the accessory to an order/account and a separate protected claim code or verified release process. Scanning a public card must not let a passer-by reassign it. Model unclaimed, claimed, active, suspended, lost, replaced and released states, with traceable transitions.

## Website-to-phone journey

On a phone: Studio → Cards & tags → Add accessory → tap/scan or enter claim reference → verify owner/account access → choose business/location/action → review → activate → test NFC and QR. For the desktop owner, show a short-lived QR/resume code for the setup task. The phone opens the relevant HTTPS task, requires its own authenticated membership and displays the business and operation before continuing. Desktop can observe completion; the QR is not a transferable signed-in session.

If a native capability is required, present Open Taplo Studio and a web/store fallback. Use verified universal/App Links and an explicit resume code where installation interrupts the task. Do not promise that a store installation magically retains every pending link. A customer tapping an active accessory should reach useful business content without an installation gate.

## Blank/compatible accessory writing

Native Studio apps can use iOS Core NFC and Android NFC APIs to inspect/write supported writable NDEF tags. Check device capability, tag format, writable state and available payload size; ask for the explicit scan/write action; write the approved stable URL; read back and test it. Apple documents writable-status checks and NDEF write APIs; Android documents NDEF writing. [N1–N2]

Chrome on Android documents Web NFC for NDEF under device/browser/permission conditions. It is a supported-path option, not a universal iPhone/desktop browser promise. Feature detection alone does not prove physical NFC hardware is present. Keep native/QR/manual recovery paths for unsupported browsers. Installing a PWA alone does not create Core NFC access. [N3]

## Failures and safeguards

Handle NFC disabled, unsupported device/tag, read-only tag, insufficient capacity, interrupted write, multiple nearby tags, network loss, wrong account, duplicate claim, expired handover and denied permission. An irreversible lock/write-protection operation needs a separate deliberately designed provisioning decision, not an accidental owner toggle. Do not treat a successful URI read as payment or proof that a reward should be issued.

Acceptance: factory card claim, blank tag write/read-back and server-side destination change on a real supported iPhone/Android matrix; desktop-to-phone resume signed-in/out and app installed/uninstalled; stable public behaviour after handle/domain change; stolen QR/code cannot claim another owner's hardware.

Sources: N1 https://developer.apple.com/documentation/corenfc/ and https://developer.apple.com/documentation/corenfc/nfcndeftag/writendef(_:completionhandler:) ; N2 https://developer.android.com/develop/connectivity/nfc/advanced-nfc ; N3 https://developer.chrome.com/docs/capabilities/nfc and https://developer.mozilla.org/en-US/docs/Web/API/Web_NFC_API .
