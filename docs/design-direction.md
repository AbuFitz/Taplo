# Design direction

> **Reference inspection status: NOT DONE.** The spec asks for concrete observations from Stripe, Linear, Vercel, Booksy, Linktree, Framer, Tesla and Fresha. No browsing of those sites was performed in this milestone, so no observations are recorded for them and none are claimed. The section below is the design *intent* implemented so far; add real reference notes (with what was seen and what was deliberately not copied) before Phase 2 is signed off.

## Three surfaces
1. **Business profiles** (`[data-taplo-theme]`) — themed per layout family; the product's showpiece.
2. **Dashboard** — neutral shadcn tokens, dense and calm. Not built yet.
3. **Taplo marketing** — placeholder home + pricing only.

## Product shape (direction 2)
A compact, expressive business presence: identity, short description, location/online status, immediate actions, then widgets the owner arranges. Linktree is the reference for **setup, customisation and mobile usability** (claim → identity → look → widgets → arrange → publish); Taplo keeps its own richer widgets (services, booking, reviews, team, products) and identity. Desktop is designed, not stretched: three arrangements (centred column; sticky header beside widgets; header over two columns).

## The eight themes (all work for every industry)
| Theme | Header | Type | Background | Buttons | Cards | Desktop |
|---|---|---|---|---|---|---|
| Studio | centred, arch portrait | Fraunces + Manrope | warm paper + grain | soft, rounded, soft shadow | solid, round, soft shadow | name left, widgets right |
| Midnight | poster (text over cover photo) | Barlow Condensed caps | dark gradient + glow | outline, rounded | frosted glass | name left, widgets right |
| Workshop | cover banner, square picture | Barlow Condensed caps | concrete + diagonal stripes | square, filled, hard offset shadow | square, thick border, hard shadow | two columns |
| Candy | centred, circle | Lexend bold | pink→lavender gradient + dots | pill, filled, soft shadow | frosted, very round, roomy | centred column |
| Editorial | text only | Source Serif | paper | square outline, no icons | borderless rules | name left, widgets right |
| Ocean | side by side | Manrope bold | teal gradient, slowly drifting | pill, filled | frosted | centred column |
| Classroom | cover banner, rounded picture | Lexend large | pale blue + grid | rounded filled | solid, thin border | centred column |
| Garden | side by side, arch | Fraunces bold | sage | rounded filled, soft shadow | solid, round, soft shadow | two columns |

## Reference inspection status: NOT DONE
No reference site (Linktree, Stripe, Linear, Vercel, Booksy, Framer, Tesla, Fresha) was opened in this work, so no observations are recorded and none are claimed. The decisions above come from the brief and from reviewing the renders. Add real reference notes before treating the visual direction as signed off.

## Visual QA performed
Renders reviewed by me (not by a designer): all eight themes for the café (phone) and the tutor (desktop), four businesses on phone and six on desktop, onboarding look/widgets steps, the editor on desktop and at 390px with the preview sheet. Problems found and fixed from those reviews: list text inheriting centred alignment, an oversized cover banner on desktop, horizontal overflow of the editor on phones (shrinkable grid tracks), a text-only header that could not show a chosen picture. Automated: no horizontal overflow, console errors, broken images, dead links or sub-40px tap targets across the matrix; axe (WCAG 2.1 A/AA + best practice) clean.
