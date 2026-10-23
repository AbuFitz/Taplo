# Round four: independently reconciled state

24 October 2026, Europe/London. This is a preparation audit, not product implementation.

## Version identity

Connected Vercel deployment lookup for `taplo-lilac.vercel.app` returned production deployment `dpl_8qgKEWW7mvpAjTSymFrUDSndKFL4`, READY, with Git SHA `4a08d1ffe3c163b21d6b4b2060c602ba18b0ebc8`, branch `claude/modest-cerf-4tont1`, repository AbuFitz/Taplo. Canonical deployment hostname: `taplo-9a5v82gq3-abufitz-49f3a2e4.vercel.app`. This establishes the reviewed production identity at this lookup; the mutable alias may change later.

The incoming pair is `af227ded86be2abcb04c036d0de45fad1ad65f42` followed by `4a08d1ffe3c163b21d6b4b2060c602ba18b0ebc8`. Baseline `e4cee6d1f169cfbd9ffcd76a39b8965e5fea4c52` remains historical evidence.

## Changes and limits

| Area | Evidence and classification | Remaining work |
|---|---|---|
| Platform direction | Live cobalt/Geist hero, new navigation/footer and booking story; source/checklist identifies reference treatment | Assess complete routes, mobile menus, hierarchy and meaningful first-screen content |
| Customer composition | Folio replaces the barber example treatment; adaptive desktop changes in source | Compare same content at phone/desktop, all saved modes, all other compositions |
| Gallery | Live gallery still defaults to Desktop and displays seven businesses | Mobile-led discovery and substantially different populated compositions remain open |
| Detail page | Desktop capture precedes useful interactive phone example; technical font information remains prominent | Reorder around choosing and using a design |
| Owner editing/setup | Handles/menu and cover-photo step reported in upstream checklist/source | Fresh/resumed owner task and narrow-width validation not independently completed |
| Theme resolver | Actual latest resolver and look sources executed: E01–E03 persist in ENGINE-PROBE-R4.json | Correct effective-surface contrast and transparent effects; verify real rendered cases |
| Customer actions | Live booking and vehicle enquiry observations plus latest source | See CUSTOMER-JOURNEY-AUDIT.md; problems remain beneath the presentation |
| Feature pages/films | Upstream checklist leaves propagation, per-feature artwork and new film formats open | Complete capability-specific stories and editable/exported assets |

The upstream checklist is preserved in `evidence/ROUND4-UPSTREAM-CHECKLIST.md`. It explicitly uses “reference” for work built once and awaiting propagation. Its reported type/lint/build, 209 unit and 302 browser checks, and 135 width cases are attributed claims: this preparation pass did not rerun that suite. Chromium/width checks do not establish physical-phone or WebKit behavior, aesthetic quality, or coverage of every transition.

## Product decision requiring care

The upstream checklist proposes retiring saved split/columns layouts during propagation. Do not silently turn that into approval to flatten every saved customer page. Compare the current centered/adaptive reference with representative saved documents. Define supported composition choices, preservation/migration, content order and fallback behavior together. Intentional responsive composition remains required even if old layout names are retired.

This reconciliation does not close the full audit. All ten workstreams in SCOPE.md remain applicable.
