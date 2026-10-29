---
name: doctor
description: Audit and connect the installed Taplo design machine, its actual agents, local browser and existing connectors. Use to set up the team, verify capabilities or troubleshoot tooling without changing Taplo application code.
disable-model-invocation: true
---

Set up or diagnose the machine only. Do not redesign Taplo screens.

Read `${CLAUDE_PLUGIN_ROOT}/references/tools.md` and the project's current instructions/settings. Run `python3 "${CLAUDE_PLUGIN_ROOT}/scripts/machine.py" doctor` in the actual Taplo checkout. Run init only if project context is missing; it preserves existing settings and contracts.

Verify:
1. The four command skills and seven agent definitions are visible in this runtime. Resolve their actual namespace; restart/reload only when required. A CLI file existing is not proof the cloud harness loads it.
2. A real separate Agent call can read a supplied file and return its identity. Do not simulate another agent inline.
3. Existing local Playwright/browser tooling reaches the real development URL, sets 390×844 and a desktop viewport, writes a screenshot, and a separate image-capable reviewer can open it. Don't start the app merely to decorate a diagnosis if the user only wants tool setup; use a minimal temporary fixture for the capability test.
4. TinyFish executes a named public fetch; distinguish text extraction from screenshot access and dynamic interaction.
5. Enumerate actual Figma/Framer/Lottie/image-generation operations. Test only a relevant read-only operation by default. Do not claim missing capabilities, install a replacement or ask for subscriptions before checking available alternatives.
6. Detect other enabled design orchestrators and broad trigger skills. List conflicts and narrow this machine's role assignments; don't delete or disable unrelated user plugins automatically.
7. Confirm hook configuration loads and is not suppressed by disableAllHooks. Run bundled tests against isolated temporary fixtures. Test native Claude hook handling in the real host when available; label source/schema checks separately when not.

Output one capability table: operation / verified result / exact limitation / next action. Store it as .taplo-machine/capabilities.json after init. Reuse existing dependencies; no automatic dependency installation, no credentials in files, and no global settings replacement.

If the machine is usable, give its exact command to start a bounded build. If a capability is unavailable, explain the specific gap and continue independent setup work. Do not claim installed/live-tested based only on static file validation.
