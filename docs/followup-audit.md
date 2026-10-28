# Onboarding follow-up: third review round

Branch `claude/modest-cerf-4tont1` (remote `AbuFitz/taplo`). Nothing is deployed or merged by this work.

## What changed

- **Choose a look** has a Looks | Colours toggle. Looks are the eight approved starting designs; Colours are a small set of coordinated palettes per look (background tones, surfaces, text, borders, action), the look's own palette, Undo, and a deliberate palette that stays when the look changes.
- **Look pictures** follow the reference tile: the look's own background, a card with a rounded mark and two lines, a quiet bar and a thin action pill. No name, logo or tick; selection is a ring. Sizes derive from tile width (container units), so they hold from a 320px phone to a monitor.
- **Colour pictures** follow the second reference: wide pill cards on the palette ground with a surface disc and an accent disc, name centred below; three columns on desktop, two on phones.
- **Form scaling:** the setup card fills laptops (1280x720 to 1920x1080) and scales up in steps on 2560x1440, 3440x1440 and larger; tablets use the phone sheet layout.
- **Room to grow** is in the pricing page's language; features come from entitlements; prices and limits are marked provisional.
- **Reveal removed**; the flow goes plan to **Review your page**. Account creation reports honestly that no provider is connected; the labelled development route to Studio remains.
- **Preview framing** is gentler (94% height, short transition).

## Verified, simulated, not verified

- Verified (Chromium, production build): looks, motion rules, palettes (analytic and rendered contrast), ending, mobile composition. Unit tests pass.
- Simulated: keyboard (viewport shrink), notch (safe-area override), reduced motion.
- Not verified: real iPhone or Android, native browser chrome, WebKit for this round's picture changes.
- Not built: real account creation. Plan prices are placeholders.

## Reported separately: licensing

The marketing films still embed CC BY-SA car photos (`docs/asset-licences.md`). Not resolved, not swapped.
