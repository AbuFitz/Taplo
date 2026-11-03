# Release validation

The machine was tested with isolated synthetic projects. No Taplo application screens were built or modified.

## Passed

- 42 automated tests: run planning/completion, stale source and evidence, failed latest recapture, actual image dimensions and PNG structure, missing states, failure/timeout/log handling, declared reviewer separation, review evidence, hooks and installation.
- Offline package validation: seven agents, four skills, hook structure, manifest metadata and all 27 pinned source-file hashes.
- Python syntax and Node capture-helper syntax checks.
- Fresh-project dry-run and installation, settings/permission preservation, duplicate-hook avoidance, refusal to overwrite user changes, portable project paths and included test files.
- Independent setup trial: installation, doctor/init, direct execution of installed hook commands with realistic event input, plus an actual separate agent call in the available Codex host.
- Independent helper review found and drove fixes for non-image references, fake/mismatched PNGs, stale evidence after failed recapture, malformed artifacts, generated-tree traversal and timeout child cleanup.

## Not passed or not available here

- Claude CLI is absent. Native `claude plugin validate`, command/agent registration and the actual Claude hook lifecycle were not executed. Direct hook-process tests do not establish native host loading.
- The runtime has Playwright but no installed Chromium executable. An actual capture attempt failed at browser launch and was reported as failed. No successful screenshot/navigation/viewport/image-review end-to-end claim is made for this host.
- A real separate Codex agent call does not prove these seven Claude agent definitions load in another host. `/taplo-doctor` must perform that check in the target environment.
- Figma/Framer/Lottie authoring operations were not exposed here. They are optional adapters, not claimed working integrations. No asset-generation operation was needed for the tooling-only task.

The target-repository setup command is deliberately required to report these runtime capabilities honestly. The package does not silently install a browser, override permissions or fake a visual pass.

## What a gate result means

A passing fixture test demonstrates the software's handling of that fixture. A passing production run gate demonstrates the completeness/freshness of supplied evidence and declared reviews. Neither certifies aesthetic excellence, human preference, real-user testing, or honest declarations from a model. Current user instructions remain authoritative.
