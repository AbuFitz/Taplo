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

## Taplo Machine install (2026-10-29, tooling only)
Installed project-local from the supplied package: 7 agents, 4 commands (`/taplo-doctor`, `/taplo-build`, `/taplo-review`, `/taplo-status`), 2 inert-unless-a-run-is-active hooks (settings merged, nothing else changed), pinned reference files, contract at `.claude/taplo-machine/context/taplo-contract.json` (reconciled).

| Check | Result |
| --- | --- |
| `validate_package.py` | passed: 7 agents, 4 skills, 27 pinned files, no errors |
| Package unit tests | 42 passed |
| `node --check capture.mjs` | ok |
| Hook with no active run | returns `{}` for Stop and PreToolUse (inert) |
| Package agents loadable | Not in the session where they were installed. After the worker restart, `taplo-researcher` spawned, ran separately and read a repo file |
| `/taplo-doctor` | Marked `disable-model-invocation`: only the owner can run it. Not run by Claude; equivalent probes below were run directly |
| Local browser, viewport, screenshots | Playwright on :3200 at 390 and 1440: status 200, `innerWidth` matched |
| Reviewer reading screenshots | A separate agent read both PNGs and returned the exact headline, tab names and sizes |
| TinyFish | search and fetch worked earlier this session; deferred in subagents until ToolSearch |
| Figma | `whoami` worked (starter plan); six images generated earlier; MCP dropped once on a worker restart and reconnected |
| Framer | `list_workspaces` worked (free plan); no project operation tested |
| LottieFiles | `searchPublicAnimations` worked |
| Image generation | Figma `generate_image` works, paid credits |
| Impeccable live-URL detector | Fails as root without `--no-sandbox`; deactivated by design |
| Not verified | Native hook firing on a real Write/Edit under an active run; `claude plugin validate` (not run, project mode used); real devices; virtual keyboard |
