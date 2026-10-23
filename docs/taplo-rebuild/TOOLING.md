# Tooling with a job to do

This is a setup plan plus staged skills, not a claim that every integration is installed. Verify the incoming commit and lockfile before changing packages. Read repository AGENTS.md and the installed Next docs before framework edits.

## Keep and use first

| Existing capability | Concrete job | Proof of successful setup |
|---|---|---|
| Taplo `/workbench`, stories and Playwright/axe | Inspect every widget and state through real renderer | Agent opens a named story, changes a real parameter, captures its new state and runs its interaction |
| Motion | Selection, opening, state transitions, limited storytelling | Reduced motion and low-cost imports verified; no duplicate UI animation framework |
| Base UI/Radix wrappers | Dialog, sheet, menu and field behavior | Keyboard and touch interaction documented for actual wrapper, not just vendor demo |
| dnd-kit | Page ordering | Pointer, keyboard, touch and Move up/down produce the same saved order |
| Radix Colors/Culori | Semantic palette derivation and readable states | Contrast inspected on actual composite surfaces and images |
| Current capture/film scripts | Fresh marketing source material | Real current UI, deterministic seed, readable output, source/export manifest |
| Existing Zod contracts and migrations | New finite theme choices and safe data preservation | Old drafts load; switch/apply/reset do not erase records |

## Staged now

`repo-prep/.claude/skills/frontend-design/`: upstream skill and Apache license, unmodified; provenance in UPSTREAM.md. Not installed into the running session.

`repo-prep/.claude/skills/taplo-design-review/`: custom review workflow tied to real examples and evidence. Read the main SKILL.md; its references route into the preparation documents. It cannot authorize implementation during this research-only task.

To integrate later: inspect `.claude/skills` in the actual latest repository, compare existing names, then copy only missing or intentionally updated skill folders and `docs/taplo-rebuild`. Preserve existing project instructions. Do not overwrite CLAUDE.md, global settings, credentials or unrelated skills. Confirm discovery by inspecting the client skill list or asking for a read-only explanation only when the owner chooses to start Claude; do not launch a test run here.

## Conditional additions

**Storybook MCP:** useful if the current workbench lacks component docs/agent discoverability. First prove the gap with one real widget. Official current documentation uses `npx storybook add @storybook/addon-mcp` in a configured Storybook project, exposes `/mcp` on the Storybook port, and describes `componentsManifest` for supported frameworks. Taplo baseline is not a Storybook project; that command alone is not a valid installation plan. Pilot outside the main app, verify framework/version compatibility and compare authoring overhead. Prefer extending the existing workbench if it solves the task more simply.

**Penpot MCP:** useful if a shared visual canvas will be actively maintained. Requires actual Penpot access, selected file/page and an authorized connection. Verify read-only inspection and an export before editing; never write placeholder tokens into config. No connected Penpot server has been established in this preparation pass. A populated browser workbench remains sufficient to proceed.

**Chrome DevTools for agents/MCP:** add only for trace/network/console needs not covered by the existing browser. Verify official current setup, a disposable browser profile, localhost scope where appropriate and one useful trace. A server entry in a JSON file is not proof of a connection.

**HyperFrames:** inspect the existing marketing project first. Pilot a 6-second service→booking clip and export at 16:9 and 9:16 with separate layout. Keep its rendering tools in authoring/dev, not the customer bundle. Inspect upstream skills/manifest before importing; retain licenses and review any external generation costs. It is researched here, not installed or used for a finished film.

**React Three Fiber/Drei:** use only if the chosen marketing storyboard benefits from a specific camera/light/depth scene. Pilot with a poster fallback and demand rendering; measure on a constrained device. It is not required for ordinary sheet interactions, and adding it does not improve the theme engine by itself.

**Puck or other editor:** not recommended by default. Demonstrate a material limitation of the current typed renderer before an isolated comparison. Migrate only with page-schema compatibility and a clear owner-task improvement. Keep one page renderer.

## Cost and license register

The frontend-design skill's included license is verified. No other full license audit has been completed. For each proposed dependency record exact package/version, upstream license, transitive obligations, runtime/authoring classification, whether paid services are optional, and why an existing dependency is insufficient. Pin the reviewed version through the project lockfile; do not blindly install latest.

Stock photos, fonts, music, synthetic voices, device models and generated images need their own provenance. An open-source rendering tool does not license third-party media. Do not claim all proposed tooling is free or connected.

Sources and current docs are linked in RESEARCH.md. No mandatory new commercial runtime is proposed.
