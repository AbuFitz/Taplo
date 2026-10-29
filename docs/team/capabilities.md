# Verified capabilities (2026-10-29)

| Capability | Operation tested | Result | Fallback |
| --- | --- | --- | --- |
| Separate subagents | Spawned four independent reviewers this session; each read images and returned reports | Works | Sequential labelled passes |
| Project agents and skills load | `.claude/skills/*` loaded as skills; `.claude/agents/*` added this session | Skills load. Project agents created mid-session do NOT load (`Agent type 'taplo-researcher' not found`); they load after a session restart | Dispatch general-purpose agents with the role file in `.claude/agents/<role>.md` as the brief |
| Browser reaches localhost | Playwright against `next start` on :3100 | Works | none needed |
| Viewport change | 390x844 and 1440x900 captures | Works | none needed |
| Screenshots | Playwright PNG capture | Works | none needed |
| Reviewer opens images | Reviewer subagents read PNG paths | Works | none needed |
| Seed exact draft state | `openEditorWithSample` helper and localStorage key `taplo.demo.v2` | Works | Seed localStorage directly |
| Figma file and variables | Earlier: created foundations, nine screens, FigJam flow | Works | Code-derived tokens in repo |
| Figma image generation | Generated six no-people photographs with `gemini-3.1-flash-image` | Works, paid credits, quality good | Licensed stock with recorded licence |
| LottieFiles | Searched and downloaded four animations | Works | Original SVG or CSS |
| Framer | Connected earlier; no operation tested this session | Not verified | Not needed for this slice |
| TinyFish | `search` and `fetch_content` on Linktree help, nicelydone, GitHub | Works for text and pages; image hosts sometimes blocked | Playwright for localhost only |
| Impeccable detector (source) | `impeccable detect src/...` | Works: regex rules only | Run on a built page where Chrome allows |
| Impeccable detector (live URL) | `impeccable detect http://localhost:3100` | Fails: Chrome refuses to run as root without `--no-sandbox` | Playwright `--no-sandbox` captures plus manual review |
| Real devices | Not available | Not available | Browser emulation only, labelled as such |
| Embedded phone preview as mobile test | Not a viewport test | Treated as a design surface only | 390px real viewport captures |
