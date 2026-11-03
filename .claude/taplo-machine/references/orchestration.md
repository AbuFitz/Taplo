# Taplo machine: operating contract

This plugin constructs and operates a Claude Code design/build workflow. It is not a website, design kit or assurance of aesthetic excellence. The current owner request is machine setup only. Do not start modifying Taplo merely because this plugin has been installed.

## Roles and ownership

The main Claude session is the integrator and dispatcher. It reads the current owner instruction, reconciles the seeded contract with current sources, selects relevant roles and owns the final report. Do not create an eighth generic project manager or make every task traverse every role.

| Role | Input | Output | Write scope |
|---|---|---|---|
| researcher | Target job, research decision, current contract | Small observed reference board | Research artifacts only |
| ux-designer | Contract, actual flow, evidence | Interaction/state/acceptance specification | Task specifications only |
| art-director | UX, content, existing system, references | Concrete composition/tokens/asset jobs | Direction artifacts only |
| asset-director | Reviewed asset job | Local assets and provenance manifest | Granted asset staging only |
| design-engineer | Passed plan gate, reviewed specifications | Actual integrated implementation | Granted product paths |
| visual-critic | Contract, references, raw captures, build identity | Independent evidence-linked visual review | No writes |
| browser-qa | Contract, acceptance matrix, exact build | Independent behavioural/test evidence | Granted tests/evidence only |

Tool lists restrict tool access where declared. Inherited tools on researcher, asset-director and browser-qa preserve available MCP capabilities. Their path and action restrictions are explicit policy; do not describe them as an OS security sandbox. The main session must not pass unnecessary secrets or unrelated source to any role.

## Runtime discovery before promises

Use the installed machine's doctor command, then verify host-only capabilities directly: can a separate agent actually launch, can it open a screenshot, and can the browser reach and resize the exact target? Shell command presence does not prove any of those. Record the result and fallback. Do not label a sequential pass independent, or claim all tools available because connectors appear in settings.

Use the exact commands and JSON templates emitted by the machine CLI. Its schema is authoritative for field names and gate requirements. The artifact meanings below explain the workflow rather than introducing a second schema.

## Compact run artifacts

A run lives under `.taplo-machine/runs/<run-id>/`. Keep these useful and brief:

| Artifact | Required meaning |
|---|---|
| `brief.json` | Current task, surface, primary visitor job, scope classification, editable boundaries, locked decisions and named acceptance cases |
| `references.json` | Small relevant board with URLs/access dates, observed states, evidence and transfer/avoid decisions; explicit access gaps |
| `direction.json` | Implementable hierarchy, layout/type/colour/asset/motion decisions; state coverage and rationale |
| `implementation.json` | Exact source/build identity, changed paths, implemented acceptance cases and real check results |
| `evidence.json` | Captures and tests bound to the source/build; route, viewport, fixture, state, file hashes and reproduction information |
| `visual-review.json` | Visual critic identity, inspected current captures, findings and disposition |
| `qa-review.json` | QA identity, tested cases, test evidence, findings and disposition |

Do not prefill reviews with a passing result. Draft templates must be visibly incomplete. Reference observations, review judgements and test outcomes have different authority.

## Task routing

- **Small refinement/bug fix:** reconcile → engineer → capture → relevant reviews → completion gate. Reuse an unchanged valid direction rather than manufacture three alternatives.
- **Open visual/interaction design:** research and source audit can proceed independently → UX → art direction → plan gate → engineer → current captures → independent reviews → corrections → completion gate.
- **Engine/schema work:** source audit and compatibility cases → engineering plan → implementation → relevant tests, plus rendered review where appearance changes.
- **Asset request:** reviewed art-direction job → asset director → provenance/crop check → engineer integration → rendered review.
- **Tooling-only:** construct/verify tools and agent definitions; do not modify product pages or launch a design project.

For a substantial redesign, begin with one representative connected slice. Three alternatives are warranted only where a material composition question is open; use identical content and compare actual rendered alternatives. Main-session selection within established owner direction is a routine decision. Do not turn every handoff into a user approval ceremony.

## Concrete handoff packet

Every dispatched task includes:

```
Run and target:
Current contract path and relevant decision IDs:
Surface mode and primary visitor job:
Task classification and editable boundaries:
Inputs: exact source/artifact paths, fixture/state and build identity:
Question this role must resolve:
Required output path/schema and acceptance cases:
Known limitations and forbidden external actions:
```

Do not pass the whole conversation. Each agent opens the supplied current files. The visual critic receives raw captured output and the agreed constraints, not the maker's self-praise, previous scores or QA verdict. QA does not see the critic's verdict before completing its own review. They can run in parallel only with separate browser sessions or read-only captures; never fight over a single mutable browser state.

## Meaningful gates

The **plan gate** requires a grounded brief, relevant reference evidence and executable direction. It stops a rewrite from starting with only “make it premium”. Missing inaccessible references are disclosed; choose adequate accessible alternatives rather than invent observations.

The **completion gate** binds implementation, captures, tests and both reviews to the same current source/build. Editing source after capture or review invalidates the evidence until recaptured/reviewed. It rejects missing files, stale source fingerprints, wrong capture hashes, malformed images, declared-versus-actual viewport mismatches, an incomplete/latest-failed capture attempt and unresolved material findings according to the CLI's checks. A failed recapture cannot reuse an earlier completed attempt. The built-in remote adapter additionally requires a matching served runtime identity; local source stability still requires manual confirmation that the running dev server is current.

A machine gate can establish evidence completeness and freshness. It cannot establish that a screenshot was honestly understood, a review identity represents a different human, or a model's aesthetic judgement is correct. The reviewer and main session remain responsible for those claims. Never advertise this workflow as mathematically proving “Apple-level” quality.

If required capabilities are unavailable, continue independent authorised work and report the exact blocked verification. Mark the run blocked or unable-to-assess, not complete. Do not weaken a gate, invent evidence or turn on an auth bypass to make a dashboard reachable.

## Revision and escalation

Fix the highest-impact findings as one coherent pass, then recapture. Re-review the exact new build. After two substantive revisions fail for the same reason, route a direction problem to art/UX rather than applying more polish or adding another library. Record what changed and why.

Use user clarification only for a real unresolved product/commercial decision that cannot be resolved from current sources and materially changes implementation. Missing optional imagery, routine CSS choices and a skill's generic discovery questionnaire are not such blockers. Preserve the owner's publication/merge boundary.

## Delivery

Lead with what works and the reviewable result. Report actual visual and functional findings, meaningful check outcomes, limitations and remaining priorities. Do not substitute role transcripts or artifact counts for a product result. In a tooling-only task, deliver the installed/packageable machine and its self-test results, with honest integration limits; do not build a website as proof.
