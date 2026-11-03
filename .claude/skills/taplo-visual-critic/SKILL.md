---
name: taplo-visual-critic
description: Independent visual review that replaces a human eye. Captures real screens, scores them against docs/team/critic-rubric.md and the reference images, and sends work back until it passes. Use before showing the user any screen, form step, dashboard, illustration or marketing section.
---

# Visual critic

The author never grades their own work. Do this every time a screen changes:

1. Build and serve the app, then run `node scripts/critic/capture.mjs <dir> <url>=<name> ...` for the screens changed (390px and 1440px).
2. Spawn a fresh subagent (Agent tool, general-purpose, no inherited context). Give it only: the screenshot paths, the rubric at `docs/team/critic-rubric.md`, the images in `.claude/refs/`, and the instruction to be blunt and specific. Ask for a score per row, the exact element behind every score under 5, and the three highest-impact fixes.
3. Fix the listed items, recapture, and review again with a fresh subagent. Stop only at the pass bar (no row under 4, average 4.3+) or after three rounds, then report the remaining gaps plainly.
4. Show the user the final screenshots next to the scores, including rows that did not reach 5.

Limits to state honestly: this catches craft, hierarchy, copy and flow defects well, but it is calibrated to the references, not to the user's taste. Where the user disagrees, add their reason to `docs/team/critic-rubric.md` so the next review uses it.
