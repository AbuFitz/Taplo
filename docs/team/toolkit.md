# Creative toolkit: installed, available, missing (2026-10-29, setup only)

No Taplo screens were built or changed by this setup. Status words: **Tested** = an operation was run and its result seen; **Present** = installed/exposed but not run; **Needs sign-in** = the user must authenticate; **Not installed** = deliberately not added.

## Skills
| Skill | Status | Evidence / note |
| --- | --- | --- |
| Impeccable 4.8.0 (engine 0.1.18) | Installed, project scope, **no hooks** | Apache-2.0. `npx impeccable install --providers=claude --scope=project --no-hooks`. Engine downloaded and checksum-verified. 4 `impeccable-*` agents added. Lead UI playbook per the sheet; the Taplo Machine's earlier "no second director" note is superseded by the owner's latest sheet. Its detector's live-URL mode needs `--no-sandbox` as root, so source scans only. |
| emil-design-eng, animate (+RECIPES.md), review-animations (+STANDARDS.md), animation-performance | Installed | emilkowalski/skills @ a81dbca (matches the research pin). Markdown only, no scripts or hooks. `review-animations` is user-invoked only. `animate` mentions `improve-animations`, which was not requested and is not installed. |
| component-canvas | Installed | ibelick/ui-skills @ 59193a7 (matches the pin). No canvas route created. |
| agentation | Installed (skill only) | benjitaylor/agentation @ 0e3236e (matches the pin). Toolbar not mounted, MCP server not added, package not added to `package.json`. PolyForm Shield licence, not MIT. |
| canvas-design, algorithmic-art | Already available | Provided by the `anthropic-skills` plugin in this environment; not reinstalled. Plugin commit not determined. |
| frontend-design | Already installed | Kept; give it a distinct role from Impeccable (not both restyling one target). |
| hyperframes, hyperframes-cli, hyperframes-registry, media-use | Already installed (user level) | One film pipeline; no duplicate plugin install. |

Hashes for the CLI-installed skills are in `skills-lock.json`. All six non-Impeccable skills were read before use: only markdown, no executables, no `allowed-tools`, no hooks.

## Tools
| Tool | Status | Proof |
| --- | --- | --- |
| Figma (connector) | **Tested** | `whoami` (starter plan); `create_session`; `list_shaders` returned 35 first-party shaders; `get_libraries` returned 9 subscribed libraries; `get_motion_context` answered for a node (no keyframes on it); `get_figma_skill skill://index.json` lists 17 official skills incl. figma-use, figma-generate-design, figma-generate-library, figma-use-motion, figma-implement-motion, figma-shaders. Earlier in this session: `use_figma` built variables, screens and a FigJam; `generate_image` produced six photographs. Not tested now: motion or shader authoring (writes). A second entry `plugin:design:figma` shows Needs sign-in; no duplicate added. |
| Figma image generation | Present, **credits exhausted** | "Insufficient Figma AI credits" after 4 generations; resets 2026-10-30 00:00 UTC. |
| fal MCP relay | Added, **needs sign-in** | `claude mcp add --transport http fal https://mcp.fal.ai/mcp-relay` accepted, scope Local (private to this environment); `claude mcp get fal` reports Needs authentication. Discovery, schema and pricing could not be tested until OAuth is done in `/mcp`. No paid job. |
| HyperFrames CLI 0.8.217 | **Tested** | `hyperframes doctor`: Node 22.22, FFmpeg 6.1.1, FFprobe, headless Chrome, Docker present. Optional whisper-cpp, Kokoro TTS and MusicGen not installed (not needed). |
| Local browser (Playwright, Chromium) | **Tested** | Fixture page (temporary, not Taplo): `innerWidth/innerHeight` reported 390x844 then 1440x900 after a viewport resize; screenshots saved. |
| Reviewer reading screenshots | **Tested** | A separate agent opened both PNGs and returned the exact code text `TOOLKIT-PROOF-7421` and the printed viewport sizes. This proves tooling only, not Taplo's design. |
| TinyFish (external research) | **Tested** | `fetch_content` on example.com returned its text. Kept for public references, never for localhost claims. |
| Motion, CSS/SVG/WAAPI | Present | `motion` 14.6.0 in `package.json`. |
| GSAP, Remotion, React Three Fiber, Stitch, Lottie/Rive authoring, Context7 | Not installed | Task-driven additions only. Three 0.186 is already a dependency. LottieFiles search was tested earlier. |
| Agentation MCP | Not added | Needs a scoped dev-tool task. |

## Notes
- Skills teach an operation; a runtime executes it. Nothing here proves Taplo's design quality.
- The 11 agents are `taplo-*` (7) and `impeccable-*` (4). Project agents load at session start.
- Not done on purpose: no canvas route, no Agentation mount, no paid generation, no GSAP/3D/Stitch.
