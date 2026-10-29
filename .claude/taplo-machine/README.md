# Taplo Machine

A Claude Code toolchain for designing and implementing Taplo with a persistent product contract, scoped specialist agents, real browser evidence and explicit review gates. This package builds the team and workflow. Installing it does not build or change Taplo's application screens.

## Start in the actual Taplo repository

Give Claude this package and the instruction in `BOOTSTRAP.md`. It should inspect the files, install project-local tooling and run doctor only. No account credentials, API key, global configuration replacement or package installation is required by the installer.

Preferred project installation, from the unpacked package:

```bash
python3 /absolute/path/taplo-machine/scripts/install.py --project /absolute/path/taplo
```

Reload Claude Code in that project and run:

```text
/taplo-doctor
```

Project commands are `/taplo-build`, `/taplo-review`, `/taplo-status`, `/taplo-doctor`. The installer preserves unrelated settings and hooks, is idempotent, refuses conflicting/user-modified files, and writes only under the project's `.claude/` directory. Doctor/init create `.taplo-machine/` for the run ledger. Commit the installed configuration and contract as appropriate; run screenshots, logs and local state are ignored by the ledger's own `.gitignore`.

Alternatively, in a CLI environment that supports native plugins:

```bash
claude --plugin-dir /absolute/path/taplo-machine
```

Native commands are `/taplo-machine:doctor`, `/taplo-machine:build`, `/taplo-machine:review`, `/taplo-machine:status`. Choose one installation mode; do not load both. Native plugin/agent names can be namespaced, so the coordinator resolves actual loaded names. Cloud/managed Claude environments may handle plugin and project skill loading differently; doctor must verify rather than assume support.

## What's inside

- Seven real agent definitions: research, UX, art direction, assets/motion, design engineering, independent visual critique and browser QA.
- Four explicitly invoked orchestration skills, with progressive reference loading.
- A Taplo-specific product contract preserving prior owner decisions, subject to newer explicit instructions.
- Distinct craft rubrics for marketing, public profiles, onboarding, Studio and the gallery.
- 27 pinned upstream text/reference files from Impeccable, Sumi and Vercel, with original notices/licences and a source integrity lock. No upstream runtime, detector, binary or installer is enabled.
- Python run-ledger and gate helper; Node screenshot adapter using existing project Playwright; project installer and offline validator.
- Automated fixture tests. Fixtures are machine tests, not a validation of Taplo screens or aesthetic quality.

## What the machine checks

`start` creates one bounded run. `plan-gate` checks the brief, current constraints, inspected references and executable visual direction before scoped Write/Edit operations. A redesign requires three composition proposals and two visual references; refinement/bugfix can reuse one current approved/repro capture.

`capture.mjs` records actual mobile/desktop screenshots with route, state, fixture, assertions, dimensions and byte hashes. A failed latest capture attempt invalidates older success. `check` executes actual argument-array commands and records exit status, source stability and hashed logs. `gate`/`complete` require current source/evidence, all required states/checks, actual pixel-inspection declarations, separate recorded maker/critic/QA identities and resolved material findings.

The active-run Stop hook reports missing evidence once; recursion protection and `pause --reason` keep it from trapping the user. Outside an explicitly started run, hooks are inert. User instructions to stop always take precedence. Paused is never presented as passed.

## Operational limits

These checks enforce workflow completeness and artifact freshness, not artistic truth, reviewer honesty or OS permissions. Agent IDs and visual-inspection fields are declared evidence, not authenticated attestations. Write/Edit hooks cover scoped direct tool operations; Bash and other write mechanisms are not a filesystem sandbox. Existing host permissions remain in force.

Local source hashes do not alone prove a dev server served that source. QA must check correspondence. The built-in adapter requires a matching same-origin runtime-identity endpoint for a remote URL, otherwise it refuses to label an unknown deployment as the current source. It never adds an auth bypass or invents such an endpoint.

Real separate agents, image-reading, connector capabilities, browser availability and native Claude hook handling must be verified in the target runtime. Missing paid imagery/Figma/motion tools does not block thoughtful hierarchy, typography or complete no-image layouts. Browser emulation is not a real-device or virtual-keyboard test. AI review scores cannot certify Apple-level design or superior customer conversion.

Python 3.10+ is required. The optional capture adapter requires Node with fetch/AbortSignal support (Node 18+), an existing project Playwright package and installed Chromium. It downloads nothing. Existing MCP/browser tooling may supply equivalent evidence. Run the project's existing build/test commands, not generic no-op commands.

## Local verification

```bash
python3 scripts/validate_package.py
python3 -m unittest discover -s tests -v
node --check scripts/capture.mjs
```

When the Claude CLI is available, additionally run `claude plugin validate /absolute/path/taplo-machine`. Offline validation is not a replacement for that native check. See `VALIDATION.md` for the checks actually performed on this release.

Nothing in this package authorises merging, public deployment, paid subscriptions or external messages. Follow the user's current task and repository instructions.
