# Setup flow redesign: where it stands

Mockup: `docs/team/mockups/setup-flow.html` (clickable, 390px). Screens: type, name, look, live.

Independent critic scores (rubric `docs/team/critic-rubric.md`, pass = no row under 4 and average 4.3+):

| Version | Average | Notes |
| --- | --- | --- |
| Current app form | 2.9 | Name first, empty preview, 8 steps |
| Mockup v1 | 3.5 | Type first, live phone preview |
| v2 | 3.9 | Line icons, honest preview, payoff screen |
| v3 | 3.7 | Fixed phone position; reviewer variance about 0.2-0.3 |
| v4 | 3.7 | Populated sample, scroll cue, live screen |

Stable findings: information capture 5 (type, then name, then look is right). Imagery stays at 2-3 in every round: it needs real photography or illustration, not CSS. Motion cannot be scored from stills.

Open fixes, all small: raise preview and helper text to 14px or more with darker grey; stop the slug wrapping beside Copy on the live screen; show the preview phone uncropped as a deliberate hero; design the keyboard-open state; storyboard the preview morph.

Not built in the app. Rebuilding the real form replaces the 8-step flow and the specs that depend on it, so it waits for an imagery decision.

Blocked on the user: illustration and photo source (Figma image generation spends paid credits and was not approved), the Linktree flow after plan selection, and which "theme examples" were meant.
