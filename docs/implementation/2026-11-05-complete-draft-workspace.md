# P03: complete private draft workspace

## Changed requirements and connected slice

P03 / `UpsertOnboardingDraft`, `ClaimOnboardingDraft`, Finish review → saved draft → Studio entry; P01 scoped storage and current authority. The previous server command preserved only four summary fields. The optional `workspace_snapshot` now carries validated business content, the page document (block order/settings, appearance, images, saved looks/styles), and unfinished onboarding form text. Existing business/page/progress schemas are reused. The local store imports the shared progress schema rather than duplicating it.

The snapshot is a private compatibility envelope, not a published page or canonical operational offer configuration. Login, membership, actual subscription tier, publication and transaction outcomes cannot be supplied through it. A selected plan inside unfinished form text is intent only. Unknown nested fields, unsupported versions, duplicate record/widget IDs, invalid time zones, excessive depth/complexity and snapshots over 2 MiB fail without silently dropping choices. Uploaded raster data already supported by the editor is bounded within that aggregate; provider-backed asset upload is still a separate integration.

The schema files' optional `PrivateWorkspaceSnapshot` envelope is an implementation-driven, backward-compatible extension of the imported 3.0 draft command/record. Detailed content/page validation remains in the existing Zod contracts; it is not a second parallel model. The original blueprint import remains available in Git history.

## Actual behaviour

- The existing opaque HttpOnly, same-origin draft credential and optimistic version/idempotency rules still protect saves. Metadata-only clients still work with old drafts, including before migration 0005. Once a complete workspace exists, a summary-only write cannot discard or desynchronise it.
- Finish review opts into the server adapter only with `NEXT_PUBLIC_TAPLO_SERVER_DRAFTS=1`. It verifies the returned full snapshot, not merely a 200 status. Failed or uncertain writes retain the local document and operation key; reading back identical committed content confirms an uncertain save without creating another draft.
- A different saved version requires an explicit choice. “Use saved draft” restores the complete document and unfinished price text; “Keep this draft” applies to exactly the version shown. Newer intervening changes conflict again. The UI retains input, focuses errors/choices, and does not navigate after its initiating view unmounts or the local draft changes during the request.
- Migration 0005 adds the nullable anonymous snapshot and a private `business_workspace`. Claim copies the saved snapshot inside the existing owner/membership/receipt/audit/outbox transaction, then removes the redundant anonymous snapshot. A copy failure rolls the whole claim back. The claimed business retains the validated business time zone.
- Database RLS constrains the claim copy to the actual credential-bound source snapshot and new owner's business. Reading the claimed workspace requires an active user and owner/manager profile permission, as well as the merchant audience. Revoked, foreign-tenant, ordinary practitioner and customer access is denied. No ordinary runtime mutation grant on claimed workspaces is added.
- `GET /v1/businesses/{business_id}/workspace` uses the current server-verified principal and returns private `no-store`/ETag headers. An anonymous draft cookie does not authenticate this endpoint. Source-draft cleanup can clear its foreign key without erasing the owned document.

## Rollout and limits

The existing public review portals and live sign-in configuration are unchanged. No hosted database migration, credential, provider, Vercel environment or production feature flag was changed for this slice. Migration 0005 must be installed and verified in the intended isolated provider environment before enabling the client adapter there. The server draft routes retain `TAPLO_SERVER_DRAFTS=1` as their readiness gate.

Local metadata-only save/claim compatibility is tested before the workspace migration, so deploying code ahead of that optional schema does not break those existing paths. Full snapshot requests require the new migration; failures do not claim successful backup.

Remaining P03 work: connect verified account completion to the claim command and authenticated Studio workspace selection/edit commands; define versioned claimed-workspace saves and canonical offer/configuration mapping. This slice does not pretend that ongoing Studio changes, published pages, booking availability, live goods stock or billing are server-backed merely because a private snapshot exists. Expired/claimed anonymous bindings are not silently recreated as a second business. The owner must use the appropriate account/recovery journey. Full merchant-exit/retention worker execution and provider asset handling remain tracked integration work.

## Verification

- Current full local unit/integration suite after storage/replay follow-through: **643 passed**, including real isolated PostgreSQL transactions, RLS, concurrent writes, receipt retries, rollback and legacy pre-migration compatibility. Local PostgreSQL binary: 18.6; CI independently uses PostgreSQL 16.
- TypeScript and targeted lint passed; the explicitly configured Next production build passed.
- Local Chromium launch was blocked by the workspace Unix-socket sandbox before any browser test could execute. That is environment evidence, not a product test result.
- Added a separate configured browser suite/CI job with a throwaway PostgreSQL 16 service, real migration/API writes, and six phone/desktop save, conflict, restore, replacement and retry checks. Its actual committed results and screenshots must be reviewed; do not infer a pass from test definitions.
- Previous app commit `07f7a211fcdf20e54eb18ac611a30a8a04488334`: all primary 615 unit/database and 175 selected browser checks passed. Its wider regression finished with **724 passed, 98 failed and 5 skipped** in run 42069834538. That wider recovery is still open and is not superseded by the new focused suite.

## Storage/replay follow-through

Draft command receipts retain only the small acknowledgement metadata, rather than duplicating the complete document and inline images on every save. A permitted retry rehydrates the document under a row lock only while its stored version still matches that receipt. A newer edit returns a conflict, and claimed/expired drafts remain hidden. A targeted database case checks both the absence of a snapshot blob in the receipt and refusal to replay an obsolete version. Other commands retain their existing full-receipt behaviour. Per-origin/credential quotas, provider asset storage and retention-worker execution are still activation prerequisites; this change does not claim to supply a complete abuse-control system.

Browser-runner follow-through: the first configured CI job stalled while installing Chromium/dependencies before reaching the tests. The configured suite now detects the runner's installed Google Chrome and records its version, falling back to Playwright Chromium if unavailable. Primary verification retains its pinned Chromium coverage. The configured job has bounded installation/job timeouts. Browser launch/runtime results remain distinct from device/provider proof.
