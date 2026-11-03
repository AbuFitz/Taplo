---
name: taplo-status
description: Report the actual Taplo design-machine run, missing gates, source/evidence freshness and next action without modifying product code.
disable-model-invocation: true
---

Run `python3 "${CLAUDE_PROJECT_DIR}/.claude/taplo-machine/scripts/machine.py" status` in the actual checkout. If no run exists, say so; do not create one automatically. Inspect its artifacts, source fingerprint and gate output. Distinguish planning, implementing, paused and complete.

Report: intended outcome, actual completed artifacts, whether visual/QA reviews saw the current build, required checks and next concrete action. A screenshot filename, a test still running, a partial suite or a review of an earlier fingerprint does not constitute verification. Do not edit product code, install tools or launch additional builds merely to produce a status update.
