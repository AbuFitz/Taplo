# Artifact and command reference

These shapes match `scripts/machine.py` and `scripts/capture.mjs`. Start with the CLI's generated files; do not copy example facts into a real run. Empty/false fields below are deliberately incomplete. The machine should reject them until real work supplies evidence.

All paths in artifact records are project-relative and remain within the project. The active run folder is `.taplo-machine/runs/<run-id>`. Capture and log hashes are SHA-256 of exact file bytes, not a model-generated identifier.

## Lifecycle

From the target project, with `PLUGIN` set to the actual installed plugin path:

```bash
python3 "$PLUGIN/scripts/machine.py" --root "$PWD" doctor
python3 "$PLUGIN/scripts/machine.py" --root "$PWD" init
python3 "$PLUGIN/scripts/machine.py" --root "$PWD" start --goal "Specific authorised task" --surface onboarding --kind refinement --scope src/onboarding src/components/preview
python3 "$PLUGIN/scripts/machine.py" --root "$PWD" status
```

`--surface` is `marketing`, `public-page`, `onboarding`, `studio` or `shared-system`. Use `shared-system` for an inspiration/gallery renderer task and name the precise target in the brief. `--kind` is `redesign`, `refinement` or `bugfix`. Machine construction/setup itself uses doctor/init; it must not start a product run.

The scope paths above are illustrative. Discover actual source paths. Broad roots such as `.` and `**/*` are invalid. Never replace an existing active run silently; resume it or pause with a specific reason.

## `brief.json`

```json
{
  "goal": "",
  "surface": "onboarding",
  "scope_kind": "refinement",
  "primary_task": "",
  "allowed_paths": [],
  "constraints": [],
  "contract_reconciled": false,
  "acceptance": [],
  "required_states": [],
  "required_checks": ["focused", "build"]
}
```

Every list must contain substantive strings. `required_states` names exact capture-state values, not a vague test promise. `required_checks` names executed check IDs that will be logged through the machine. Reconcile the contract with actual current owner instructions before setting `contract_reconciled` true. The gate requires two inspected visual references for a redesign; refinement/bugfix may use one relevant existing approved capture or actual repro screenshot. Reuse evidence rather than conducting redundant research.

## `references.json`

```json
{
  "items": [
    {
      "id": "",
      "url": "",
      "principle": "",
      "adaptation": "",
      "rejected_trait": "",
      "observed_state": "",
      "path": "",
      "sha256": "",
      "inspected_pixels": false,
      "accessed_at": "",
      "limitations": []
    }
  ]
}
```

Two entries are required for redesign; one is sufficient for a bounded refinement/bugfix. `url` must be an actual HTTP(S) source. `path` and `sha256` identify its retained, structurally valid PNG or JPEG capture. The validator checks image framing/dimensions, PNG chunks and checksums; this is not a full image-decoding or authenticity service. Set `inspected_pixels` true only after opening the image. Captions or official help text alone do not qualify as inspected visual references. `accessed_at` and `limitations` are useful additional provenance; do not omit access gaps merely because the current CLI does not validate those keys.

## `direction.json`

```json
{
  "thesis": "",
  "hierarchy": "",
  "layout": "",
  "typography": "",
  "colour": "",
  "interaction": "",
  "mobile_behaviour": "",
  "asset_strategy": "",
  "alternatives": [
    {"id": "", "composition": "", "tradeoff": ""}
  ],
  "selected": ""
}
```

All listed text fields must be substantive. `selected` must match a considered alternative's ID. A redesign requires at least three materially different composition proposals; a settled refinement/bug fix can document one retained composition and its tradeoff. The gate checks presence, not whether the proposals are genuinely different: art direction must establish that.

After filling and reviewing the plan:

```bash
python3 "$PLUGIN/scripts/machine.py" --root "$PWD" plan-gate
```

This writes `plan-approval.json` containing `plan_hash`, `time` and `meaning`. It is a workflow gate, not owner approval. Changing any brief/reference/direction bytes requires rerunning the gate and reassessing the implementation.

## `implementation.json`

```json
{
  "summary": "",
  "maker_agent_id": "",
  "changed_paths": [],
  "implemented_acceptance": [],
  "decisions": [],
  "limitations": []
}
```

The CLI requires the first two fields; maintain the remaining fields to make review useful. Use the actual returned runtime agent identifier where exposed, not “engineer” as a title. If the host cannot provide an independent agent context, report the limitation rather than inventing identities or setting an independence claim true.

The CLI can check that recorded maker/visual/QA IDs differ. It does not authenticate them. Distinct strings alone are not evidence of distinct executions.

## `capture-spec.json`

```json
{
  "base_url": "http://127.0.0.1:3000",
  "cases": [
    {
      "id": "identity-mobile",
      "path": "/onboarding",
      "state": "identity-no-images",
      "fixture": "isolated-fictional-business-no-media",
      "viewport": {"width": 390, "height": 844},
      "expected_text": ["A real visible phrase from the seeded state"],
      "actions": [],
      "local_storage": {},
      "storage_state": ".taplo-machine/fixtures/authorised-test-state.json"
    }
  ]
}
```

Use the actual dev server and valid routes. Omit `storage_state` unless that existing project-relative file is needed; do not insert a fake file. Each case gets an isolated context. Local-storage entries are seeded only for the configured origin. The adapter stays on that origin for the initial route. Never seed credentials or bypass production authorisation to make a screenshot pass.

The built-in adapter accepts localhost/127.0.0.1/[::1] without a runtime-identity endpoint. Any remote `base_url` requires this optional top-level field in `capture-spec.json`:

```json
{"runtime_identity": {"path": "/actual-existing-test-build-identity-endpoint"}}
```

That same-origin endpoint must actually return JSON containing the exact current local source `fingerprint`. The adapter rejects a missing, failing, redirected or mismatched identity for remote capture. Do not invent the endpoint or weaken authentication; use an existing suitable dev/test identity mechanism or report remote verification blocked. The endpoint itself is declared evidence, not a cryptographic proof that every served byte came from the checkout.

Supported action shapes:

```json
[
  {"type": "fill", "role": "textbox", "name": "Business name", "value": "Fictional Studio"},
  {"type": "click", "role": "button", "name": "Continue"},
  {"type": "press", "test_id": "business-name", "key": "Tab"},
  {"type": "select", "test_id": "profile-arrangement", "value": "existing-arrangement-id"},
  {"type": "visible", "text": "Actual expected visible copy"}
]
```

Use selectors observed in the app; do not add every example action. Every action needs `test_id`, exact `role`+`name`, or exact `text`. There is no arbitrary script-evaluation action. Each case requires a nonempty `expected_text` list that identifies the intended rendered state.

```bash
node "$PLUGIN/scripts/capture.mjs" --root "$PWD"
```

The adapter resolves an already installed project Playwright package, installs nothing, snapshots source, opens Chromium with reduced motion, checks visible expected text and writes full-page PNGs. It records browser errors and detects horizontal overflow. A fresh `evidence.json` is written only after successful cases and a stable source fingerprint. Local source stability alone does not establish that a dev server is current: the reviewer must verify the running server and intended state. Capture ordinary-motion behaviour separately where motion itself is under review; the baseline still capture is not a motion test.

Every invocation first writes `capture-attempt.json` with a fresh UUID and status `running`, then changes it to `failed` or `complete`. Failed recaptures invalidate an earlier passing evidence set rather than silently leaving it usable:

```json
{
  "attempt_id": "",
  "status": "running",
  "time": ""
}
```

A completed attempt also records `fingerprint`; a failed attempt records `error`. Capture paths include the attempt ID. Other browser adapters must create equivalent latest-attempt metadata and bind their evidence to it; never hand-change a failed attempt to complete.

## `build.json` and `evidence.json`

`machine.py snapshot` writes a current `build.json`; the capture adapter also snapshots automatically. It includes `fingerprint`, `file_count`, `run_id`, `captured_at` and nullable `git_commit`. It fingerprints actual source bytes, including uncommitted changes in the included source set.

Capture-generated evidence has this shape:

```json
{
  "version": 1,
  "run_id": "",
  "attempt_id": "",
  "fingerprint": "",
  "runtime_identity": null,
  "source_correspondence": "local source stable; reviewer must verify dev server is current",
  "captured_at": "",
  "engine": "playwright-chromium",
  "emulation_limit": "Not a real iPhone/Android or virtual-keyboard test",
  "captures": [
    {
      "id": "",
      "route": "",
      "final_url": "",
      "state": "",
      "fixture": "",
      "viewport": {"width": 390, "height": 844},
      "path": "",
      "sha256": "",
      "full_page": true,
      "captured_at": "",
      "assertions_passed": false,
      "overflow_x": false,
      "page_errors": [],
      "reduced_motion": true,
      "expected_text": []
    }
  ]
}
```

Do not hand-populate a passing screenshot record. An alternative existing browser adapter must provide equivalent real evidence, attempt metadata and hashes. Completion requires the latest attempt to be `complete` and its `attempt_id` to match evidence, at least one actual mobile width ≤430 and desktop width ≥1024, structurally valid PNGs, no declared overflow and coverage of every `required_states` entry. Actual PNG width must equal the declared viewport width; a viewport screenshot's height must match, while a `full_page` screenshot's height may exceed but cannot be less than viewport height. The complete matrix may require more states/viewports than this minimum.

## Executed checks

```bash
python3 "$PLUGIN/scripts/machine.py" --root "$PWD" check --id focused -- npm test -- --run relevant-test-file
python3 "$PLUGIN/scripts/machine.py" --root "$PWD" check --id build -- npm run build
```

These are illustrative commands, not claims about this repository's scripts. Use its actual package manager and meaningful tests. The command after `--` is executed as an argument array without a shell. Results are written to `checks.json` with `argv`, `exit_code`, `fingerprint`, `source_stable`, `finished_at`, `path` and `sha256`; logs live in `checks/`. A timeout produces code 124, unavailable command 127, and source mutation during the check 125. None is a pass. Keep generated build output ignored so it does not alter the source fingerprint.

## `visual-review.json`

```json
{
  "agent_id": "",
  "verdict": "unable-to-assess",
  "fingerprint": "",
  "evidence_sha256": "",
  "inspected_capture_ids": [],
  "pixel_inspection": false,
  "independent_context": false,
  "rationale": {
    "hierarchy": "",
    "composition": "",
    "typography": "",
    "content": "",
    "interaction_clarity": "",
    "specificity": ""
  },
  "findings": [],
  "limitations": []
}
```

`evidence_sha256` hashes the entire current `evidence.json` file. `inspected_capture_ids` must include every current capture ID. Open the actual PNGs before setting `pixel_inspection`. Each rationale dimension needs evidence-specific substantive text. Verdict is pass/revise/unable-to-assess; only pass can complete. Independence is a declared fact that the main session must substantiate with the actual separate context.

## `qa-review.json`

```json
{
  "agent_id": "",
  "verdict": "unable-to-assess",
  "fingerprint": "",
  "evidence_sha256": "",
  "inspected_capture_ids": [],
  "interaction_cases": [
    {"id": "", "steps": "", "observed": "", "result": "pending"}
  ],
  "findings": [],
  "limitations": []
}
```

Every interaction case must have passing actual reproduction, with substantive `steps` and `observed`, before completion. The case IDs should correspond to the brief's acceptance scenarios; the current CLI checks nonempty passing cases, not full semantic test coverage. QA and the integrator must verify coverage honestly.

For either review, useful finding shape:

```json
{
  "id": "",
  "severity": "P1",
  "status": "open",
  "capture_id": "",
  "region": "",
  "problem": "",
  "consequence": "",
  "required_fix": ""
}
```

Current gates reject P0/P1 findings unless `status` is `resolved`. Do not relabel material issues as P2 or mark them resolved without current evidence. A P2/P3 finding may remain honestly recorded when it does not invalidate the required outcome.

## Completion and stopping

```bash
python3 "$PLUGIN/scripts/machine.py" --root "$PWD" gate
python3 "$PLUGIN/scripts/machine.py" --root "$PWD" complete
python3 "$PLUGIN/scripts/machine.py" --root "$PWD" pause --reason "Specific unverified capability or owner instruction to stop"
```

`gate` validates without completing; `complete` records completion only after the same checks pass. Product-source edits after snapshot invalidate captures/reviews and executed checks until refreshed. Plan edits invalidate the plan hash. The machine does not automatically edit product code, install packages, deploy, merge or prove aesthetics.

The pre-write hook checks declared in-scope Write/Edit/MultiEdit requests against the planning gate. It is not a universal path firewall or a Bash sandbox. Stop performs one completion check; a subsequent `stop_hook_active` invocation is not blocked again. Honour a user stop instruction and pause/report the limitation; never create a repeated stop-hook trap or fabricate evidence to finish.
