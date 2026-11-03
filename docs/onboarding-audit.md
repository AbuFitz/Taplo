# Onboarding audit (traced in the repository)

Branch `claude/modest-cerf-4tont1`. Sandbox deployment: `capabilities()` in `src/lib/capabilities.ts` reports no accounts, no public publishing, no messaging, no payments.

## The journey before this pass
`src/features/demo/store.ts` `ONBOARDING_STEPS`: business, industry, (goal folded into reach), reach, contacts (first content), widgets (look), plan, publish.
| Step | Captured | Gate |
|---|---|---|
| business | logo (optional), name, generated link (editable), description, cover photo | name + valid link |
| industry | category (search over `keywords`, 4 popular + "different type"), Other write-in, optional "I also do" (max 2) | a category label |
| reach | goal intent (multi-select), main button, website, email, phone, WhatsApp, socials | **at least one contact channel was required** |
| contacts | first service(s): name, price, minutes | complete rows |
| widgets | starting look and colour, arrangements | none |
| plan | plan intent (Free selectable) | none |
| publish | review + publish | all required readiness items |
State: one localStorage document (`taplo.demo.v2`), written on every change, so refresh and back keep everything. Link generated from the name; manual edits are preserved (`slugEdited`).

## Findings
- **Working:** autosave and resume; mobile bottom sheet with a labelled grip button, Arrow/Escape keys and drag; link handling; Other write-in; "I also do"; goals stored as intent separate from configuration; plan step with Free selectable; sandbox honesty copy.
- **Confusing / wrong for the brief:** the look came after first content and contact details; the first screen asked for description and cover photo on a second phone screen; a contact channel was mandatory; the category label was always shown publicly; there was no "where do you work" question; the preview showed empty sections rather than a realistic page.
- **Not implemented, and not claimed:** accounts and sign-in (sandbox), payments, importing from or syncing with another platform (only a link is stored), public publishing.

## Category tailoring (48 presets, `src/features/themes/presets/industries`)
- 45 have 3 to 5 suggested services with names and short descriptions; 17 have a bespoke 4-widget to 8-widget starter set; `maker` and `illustrator` have no suggested services; `other` has none by design.
- Each preset carries terminology (services/team/booking/reviews labels), a suggested booking mode, a ranked list of 3 to 6 designs (suggestion only) and search keywords.
- No category has bespoke arrangements or bespoke example imagery. Tailoring is vocabulary, starter sections and suggested items.

## After this pass
See `docs/brief-audit.md` for verification and the onboarding report in the final message.
