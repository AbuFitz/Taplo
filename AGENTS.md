<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Taplo blueprint and implementation direction

For Taplo product, design, backend, operations and integration work, begin with `docs/taplo-blueprint/README.md` and `docs/taplo-blueprint/release-3.0/CODEX-START-HERE.md`. Read the relevant dependency-ordered packet in `docs/taplo-blueprint/release-3.0/contracts/build-packets.json` before coding. The full earlier blueprint is retained alongside the consolidated 3.0 handoff. Preserve these Next.js instructions and inspect current repository code/data before applying proposed migrations. Record conflicts and actual verification; reference designs/specification checks do not establish production provider, security, device, legal or customer evidence.
## Taplo customer-facing wording (project convention)

Taplo is intentionally frontend-first. Write customer-facing copy as the finished product should read in production, throughout marketing, onboarding, Studio, forms, booking/payment flows, empty states, notifications and email templates. Use direct wording for agreed scope, such as “Accept bookings”, “Send reminders”, “Manage customer enquiries” and “Take deposits”.

Do not add development-status copy (“planned”, “intended capability”, “once the backend is connected”, “stored in this browser”, “nothing is sent or charged”, provider requirements or implementation explanations). Keep unfinished integrations, backend requirements and engineering limitations in internal development documentation. Include them when reporting engineering progress or launch readiness, not repeatedly when reviewing design or describing offerings.

Necessary preview-only notices must use the central `NEXT_PUBLIC_TAPLO_PREVIEW_NOTICES=1` presentation setting. This setting must never change capability checks, integrations or transaction behaviour. Preserve meaningful example-content labels, required customer information and accurate transaction states: do not claim delivery, payment, publication or account creation succeeded without the corresponding result. Production copy does not establish implementation, expand scope, authorise guarantees or decide pricing.

User follow-ups are additive unless explicitly replacing or cancelling a requirement. Track all active requirements and report any incomplete work clearly.

## Branch workflow

The founder confirmed `claude/modest-cerf-4tont1` is the canonical working branch on 3 November 2026. Work directly on that branch; do not create routine feature branches or switch to the branch literally named `main`. The temporary consolidation on `main` was an agent misunderstanding; its work is preserved on the canonical branch. Preserve unrelated changes and record actual packet progress.
