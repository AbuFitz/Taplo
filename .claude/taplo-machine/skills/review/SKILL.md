---
name: review
description: Review an existing Taplo implementation through independent visual and browser/functional contexts with source-bound evidence. Use after a design build or to examine a claimed completed screen.
disable-model-invocation: true
argument-hint: "[run id or target screen]"
---

Review $ARGUMENTS. Read `${CLAUDE_PLUGIN_ROOT}/references/orchestration.md`, `design-quality.md`, and `artifact-schemas.md`. Run machine.py status and use the exact active run. Do not change product code during this command.

Verify the current source fingerprint matches build.json and evidence.json. Ensure screenshots really exist, hashes match, routes/states are reached and mobile evidence is a real browser viewport. If stale/missing, use the available browser to recapture; do not ask a critic to pass unseen or obsolete work.

Use fresh visual-critic and browser-qa agent contexts; confirm exact names in the current runtime. Pass the approved owner contract, current fingerprint and evidence path. Keep their findings isolated until both finish. The visual critic must inspect image pixels, evaluate the matching surface rubric and return grounded rationale. QA must exercise actual interactions, persistence and material states, and distinguish inferred risks from reproduced defects.

Write each review in the active run using the documented JSON schema and actual runtime agent IDs. Run machine.py gate to report evidence completeness. Do not change a revise verdict to pass to satisfy the gate. If agents are unavailable, deliver clearly labelled sequential findings; no independent gate pass is available.

Return specific priority findings, source/capture evidence, exact reproduction steps and limits. No mandatory questionnaire: use settled priorities. Do not produce claims about real-user studies or superior conversion from AI review scores. Route fixes to UX, art direction or engineering, identifying whether the problem is in direction or execution.
