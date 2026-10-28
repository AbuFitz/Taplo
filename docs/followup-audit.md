# Onboarding follow-up: what changed, how it was checked, what is not done

Branch `claude/modest-cerf-4tont1`. Nothing here is deployed or merged.

## Scope kept

Existing fonts, widgets, illustrations, arrangements and agreed titles (including **Choose a look.** and **Review your page**) are unchanged. The colour reference was used for colour and background only. Legacy saved designs still resolve; no customer page is recoloured.

## 1. The eight colour directions

`src/features/page/themes/colourways.ts`: Carbon / white, Cobalt / ice, Black / ember, Plum / pearl, Blue / violet, Silver / ink, White / electric blue, Rose / warm white. Tokens come from the brief's table (base, surface, text, accent, action text). Muted text and borders were added by us and are checked too.

- Backgrounds use the existing engine (solid, gradient, still shader fallback). Shaders gained an optional `anchors` field so the ember and blue/violet glows sit where the reference puts them. Without anchors nothing changes.
- A shader with movement off no longer mounts WebGL, so the still design is exactly the approved one.
- Contrast: unit tests check text/surface, text/background, muted/surface, muted/background and action text/accent for all eight (all ≥ 4.5:1). The Playwright check on the real preview confirms the page tone and readable foreground per colourway. This is not a WCAG certification: text over every gradient location, focus/disabled states and images are not exhaustively sampled.

## 2. One picker: Looks / Colours

`SetupLook.tsx` replaces Starting theme, Page finish, Background & colours and Material in registration.

- Looks and Colours tabs, two roomy columns at every width, small calm illustrations drawn from each option's own colours (the style of the reference sheet). The order of the options is frozen while choosing.
- Chosen colours stay when the look changes. "This look's own" is an explicit alternative. "Undo last change" restores the previous colours.
- Movement is off, offered only where there is something to move, never on the first recommendation, and follows reduced-motion.
- A logo-derived palette is offered with **Use these colours**, only when it reads well, never applied silently.
- Arrangement is optional under "Profile arrangement". A deterministic suggestion (`arrangement.ts`) follows which pictures exist (none, logo, cover, both; long names prefer type-led). It suggests; it never replaces the owner's choice.

## 3. Mobile

Findings addressed: sheet height now follows content up to a ceiling (category, goals, contact, look keep the page visible above); selection ring and tile labels no longer clipped; Skip sits in the action row instead of adding a footer row; the keyboard state takes the full visible area; the sheet is the same white as the desktop card; top-edge/status-bar colour follows the page (`ChromeColour`, covered by `mobile-chrome-colour.spec.ts`). Desktop: after a category is chosen the handset eases out to show the whole page inside the card (not before; no motion with reduced motion).

## 4. Wording and category

Removed "I also do". "Search businesses" is now **Business type**. "Show category under the business name", "At a location / At customers' locations / Online". "See my work" is now "See the work".

## 5. Plans and ending

Plans: compact comparison with Free selectable, no illustration, no "See how it looks", no theme-limit claims. Prices and limits are labelled provisional. **They are not approved and the source of truth still holds the exploratory values (£9.99 / £19.99 / £39.99, 3 services). That is an open commercial decision.** Choosing a plan stores a preference only.

Ending: plan, then Review your page: the draft is shown whole, non-interactive, and an honest account block. Accounts are not connected here, so the screen says so and offers a clearly labelled testing route to Studio. `account.ts` is the single boundary (`session()` for already signed-in users, `connect()` for sign-up); with no provider it reports not-configured. Confirmation only appears after a real success. Nothing is published automatically; Publish lives in Studio.

Studio: checklist separates name (done when entered) from logo (optional).

## Tests

- Unit: 359 pass (colourways, arrangement suggestion included).
- New e2e: `registration-looks`, `profile-assets` (4 asset combinations x short/long name x 320/390/430/1440), `mobile-chrome-colour`; repaired `journeys`, `redesign`, `registration-coherent`, `curated-setup-blocks`, `category-plan-journeys`, `also-categories`, `master-navigation`, `modern-setup`, `mobile-setup-priority`, `expanded-collection`.
- Evidence screenshots: `docs/review/followup/` (eight colourways at 390 and 1440, journey at 320/375/390/430, desktop journey). Generated with `TAPLO_SHOTS=1`.

## Not done / not verified

- No real iPhone or Android was available. Everything mobile ran in Chromium emulation. The soft-keyboard state is simulated by shrinking the viewport; iOS toolbar and visual-viewport behaviour is unconfirmed. Firefox and WebKit were not re-run for this change.
- No sign-up provider exists, so account creation, persistence after sign-up and the success confirmation are UI and state boundaries only.
- Plan prices, limits and any industry theme restriction need an owner decision.
- Marketing films still embed CC BY-SA car photos (owner decision, see `docs/asset-licences.md`).
- The full e2e suite was not re-run end to end after the final change; focused suites were.
- Large-text and zoom checks were not run beyond the narrow-width and short-viewport cases.
