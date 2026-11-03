# Research board: first-run Studio home (phone, draft just created)
Researcher: taplo-researcher. Accessed 2026-10-29. Contract read first (draft and publish separate, no fake data, monochrome UI).
Labels: [O] observed, [S] source statement (vendor text I read), [I] inference.
Limitation: all admin screens sit behind logins, so I saw NO live or screenshot first-run screens for any product. Everything below is vendor help text/docs fetched via TinyFish, plus my reading of the Taplo capture (base-studio-m-full.png, 390px, observed).

## Taplo baseline (observed from capture)
- [O] Order: phone preview, Draft pill + Publish, black "ready to share" card with tiny QR, three 0 counters, "7 of 7 done" checklist, "Get more" card with line drawings, bottom dock.
- [O] Three zero counters take more height than any action. Completed checklist still takes a card. Two cards (share, Get more) both say "share". Draft status and the "Open sharing" promise point at different things (Publish is not done, yet the card says "ready to share").
- [I] Lifeless because every card has equal weight and equal chrome; nothing is ranked, and the only moving part (next step) is not obvious.

## Ref 1. Shopify: one setup guide, ordered, ends in "launch" (help.shopify.com general-checklist)
- Source: https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/new-to-shopify-checklists/general-checklist. No screenshot; help text only.
- [S] Checklist groups run set up, organise, test, launch, then add channels and promote; "Preview your store" precedes "Launch your store". "After you launch your store, it's publicly visible. Make sure ... finalized before going live."
- [S] Promotion steps are listed after launch, not before.
- [I] Principle: the home screen is a single ordered path whose end is a deliberate publish; promotion belongs after it.
- Taplo application: top of Studio = one "next step" row (state-driven: Review page, then Publish, then Share, then Add first photo). Publish is the headline action while draft; sharing/QR appears as the step after publishing. Sample copy is labelled, nothing invented.
- Rejected: Shopify's long multi-section checklist. Too many steps for a one-person trade; Taplo already has a 7-step setup that is complete.

## Ref 2. Stripe: Home leads with what needs attention; analytics are an opt-in overview (docs.stripe.com/dashboard/basics, /get-started/account/set-up)
- Source: https://docs.stripe.com/dashboard/basics and https://docs.stripe.com/get-started/account/set-up. No screenshot; docs only.
- [S] "Home ... surfaces important notifications, like unresolved disputes or identity verifications"; widgets under "Your overview" can be added or removed by the user.
- [S] After creating an account you can test in a sandbox; live mode needs verification. Test and live are distinct states.
- [I] Principle: notifications that need action sit above numbers; numbers are optional widgets; test/draft state is explicit and separate from live.
- Taplo application: while counts are zero, hide the three counters entirely. Show "Need a reply" only when it is above zero (a banner row at the top). Show Upcoming / Enquiries once there is at least one real record. Draft vs Live is a persistent status line (Draft, not public) separate from the Publish action.
- Rejected: Stripe's customisable widget grid. Wrong weight for a phone and for owners who never customise.

## Ref 3. Linktree: the share artefact is the product; link plus QR live behind one Share button (linktr.ee help articles)
- Sources: https://linktr.ee/help/en/articles/5434136-sharing-your-linktree and https://linktr.ee/help/articles/5434152-create-qr-code (search snippets only; I did not fetch full text, so details below are what the snippets state).
- [S] "Go to the Links page under My Linktree and click the Share button"; QR is created by choosing Share then "My Linktree QR code", downloadable as PNG or SVG. [S] QR is "ready to customize, share, and download on the Links page".
- [I] Principle: one Share entry, and the QR is a destination inside it, not a hero image. Contract note: Linktree is comparative only; Taplo does not copy its flow.
- Taplo application: replace the black card plus tiny QR with one quiet "Share" row (link, copy, QR inside a sheet). QR is full size when opened, not a 40px thumbnail. Only offered once published; before that, the row reads "Publish to get your link". Honest: today's draft opens in this browser only.
- Rejected: Linktree's preview-first admin layout; Taplo's preview is already on top and is the strongest element.

## Ref 4. Calendly: share is per-thing, copy-first, with plain instruction (calendly.com/help/how-to-share-your-scheduling-link)
- Source: https://calendly.com/help/how-to-share-your-scheduling-link (fetched, updated Aug 20, 2026). No screenshot.
- [S] Copy link is the default action on each event card; "Share availability" by email is paid-plan only; additional places named: website embed, email signature.
- [I] Principle: the primary share action is Copy link; extra channels are secondary and plan-gated ones are not led with.
- Taplo application: Booking section on Studio shows a real "Copy booking link" and "Open bookings" only when booking is enabled. Zero state is a single sentence plus one action ("Try a test booking"), no counters. Plan-locked sharing features (if any) stay out of the first-run view.
- Rejected: per-event-type cards; Taplo has no event-type model on this screen.

## Ref 5. Squarespace: draft is private by default (limited evidence)
- [S, weak] Third-party blog snippet (silvabokis.com, Feb 2024) says a trial site is not public by default. I did not reach official Squarespace help (search returned no support.squarespace.com result), so treat as unverified.
- [I] Principle: "private until published" should be stated as a status, not buried in body text.
- Taplo application: the current helper line ("opens in this browser only... not connected yet") should become a short status next to the Draft pill; the long sentence goes to a secondary disclosure.
- Rejected: password-protected preview links; no server support and out of scope.
- Not accessed: Notion, Canva, Cal.com home screens (no useful public page reached). Gap, not a finding.

## Cross-cutting findings for the designer
1. [I] Lead with one ranked next action, not seven equal cards.
2. [I] Zero counters are noise; hide until a real record exists (also satisfies no-fake-data).
3. [I] Completed checklist collapses to one line or disappears; do not keep a "7 of 7" card.
4. [I] Draft status is a state line; Publish is its own control; Share becomes real after publish.
5. [I] "Get more from your page" tips: show at most one, driven by what is missing (e.g. no photos), not three static explainers.

## Open risks
- Evidence is documentation, not observed screens; the visual-critic should review mockups against the Taplo capture, not against these products.
- Stripe notification-first claim comes from one sentence of docs.
