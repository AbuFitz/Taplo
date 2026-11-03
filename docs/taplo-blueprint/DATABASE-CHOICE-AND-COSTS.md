# Taplo · Database choice and cost breakdown

Founder clarification · 2.6: neither database is configured. No migration cost or installed-backend assumption is used for selection. Current official pricing was rechecked on 3 November 2026; both providers advertise broader backend features. Neon remains the working fit choice; equivalent performance and total operational effort are not proved by the price table. No account was opened.

Working edition 2.5 · 3 November 2026. Reproduce with python3 contracts/calculate-database-options.py. Published tariffs plus explicit workload assumptions, not actual quotes or measured capacities. GBP uses assumed £0.80/USD, not a live exchange rate; taxes/FX charges excluded.

## Recommendation

**Keep Neon Postgres as the greenfield working database choice.** Its metered compute and history/branch model fit the proposed server-owned transaction engine. This is a fit judgement, not proof Neon is always cheaper or that Supabase is unsuitable. Preserve a genuinely functioning Supabase setup where migration would add cost/risk without a measured benefit. No repository/backend migration has been performed in this task.

Current Neon is broader than a bare database: it advertises managed Better Auth, object storage/functions and beta realtime. Supabase similarly bundles Postgres/auth/storage/realtime. The previous shorthand contrasting bundled Supabase with database-only Neon was incomplete. Select the specific production features/regions/maturity/contract, not only the brand. No free-beta capability is required for payment or booking correctness.

## What the Neon example buys

Inputs: Launch compute $0.106/CU-hour; Scale $0.222/CU-hour; database $0.35/GB-month; retained restore history $0.20/GB-month; snapshot $0.09/GB-month. Assume a 720-hour month, average active capacity as shown, distinct billed history volume and one full-size snapshot-equivalent retained for the month. Sources D1–D2. More changes/history/snapshots increase cost.

| Assumed production workload | Average capacity | Database / billed history | Launch USD total | Launch GBP | Scale GBP |
| --- | ---: | --- | ---: | ---: | ---: |
| lean | 0.25 CU | 10 GB / 5 GB | $24.48 | £19.58 | £36.29 |
| steady | 1 CU | 50 GB / 20 GB | $102.32 | £81.86 | £148.67 |
| busier | 2 CU | 100 GB / 50 GB | $206.64 | £165.31 | £298.94 |

These workload labels do not mean 100/500/1,000 merchants. Query patterns, concurrency, indexes, transaction locks, background tasks, geography, retention and public traffic determine capacity. An always-active worker can prevent expected idle savings. Snapshot-equivalent and billed history are explicit assumptions, not the database size magically billed twice.

| Lean Launch breakdown | USD/month |
| --- | ---: |
| compute | $19.08 |
| database storage | $3.50 |
| retained history | $1.00 |
| one snapshot equivalent | $0.90 |
| Total | $24.48 ≈ £19.58 |

Illustrative staging: 0.25 CU active 20 hours + 5 GB database + 2 GB billed history + one 5 GB snapshot-equivalent = $3.13 ≈ £2.50/month. Persistent background jobs or more retained branches change this. Use synthetic data and no copied production secrets.

Neon Launch supports a limited restore-history window; Scale has a larger window and different support/SLA features. Choose by actual recovery/security/support needs, not just the table. The published typical-spend example is not a fixed subscription. Free allowances and promotional credits are not the production financial plan.

## Supabase alternative with recovery included

Published Pro starts at $25/month including a $10 compute credit; compare the actual project compute and included disk. Seven-day point-in-time recovery is a separate roughly $100/month add-on and requires at least Small compute under retrieved docs. Daily backups are not equivalent to continuous point-in-time recovery. Sources D3–D5.

| One production project scenario | USD/month illustration | GBP |
| --- | ---: | ---: |
| micro daily backups | $25.25 | £20.20 |
| small with 7day pitr | $130.25 | £104.20 |
| medium with 7day pitr | $180.25 | £144.20 |

These use rounded monthly catalogue compute/PITR anchors; actual hourly billing/month length differs. They include modelled disk overage above the included 8 GB, one organisation compute credit, and no other projects/overages. The £20.20 Micro example has daily backups; the £104.20 Small example includes the illustrated PITR. Do not compare the first to Neon history and claim identical recovery. Conversely, do not claim equal CU/instance names imply equal performance or that one bundle is universally cheaper.

Supabase may save integration/operating work if its existing auth/storage/realtime/RLS is actually used. Neon may suit the planned independent server-owned engine and recovery economics. Actual total cost includes auth and media, security/backups and developer maintenance—not merely a database invoice. No paid database instance per merchant is proposed; use tenant-scoped shared infrastructure with future isolation paths for evidenced needs.

## Production operating contract

- Start with bounded autoscaling on paid infrastructure and monitor actual load. A working Launch range 0.25–2 CU is an initial engineering budget to validate, not a capacity guarantee. Keep latency/recovery needs explicit; do not allow scale-to-zero to surprise time-sensitive jobs.
- Server-owned money/time/stock commands use atomic database transactions and appropriate concurrency control. Tenant IDs, server authorisation, field projections and defence-in-depth database policies prevent cross-business access. A large database service key is never shipped to the browser.
- Pool connections appropriately for selected runtime/driver; load-test constrained connections and long transactions. Index actual tenant/time/status queries. Keep photos/documents out of relational rows; store access-controlled references.
- Use a separate staging boundary and synthetic fixtures. Do not connect a preview deployment to production secrets by convenience. Version schema migrations and rehearse rollback/forward-repair.
- Working recovery targets: provider-supported point-in-time recovery for small operator mistakes and an encrypted independent backup path for wider provider/account failure. Recovery objectives differ by failure; no claim that a daily off-site copy provides five-minute recovery. Set/test actual RPO/RTO against the selected plan and data volume.
- Reconcile restored payment/refund/message intents against provider truth before replay. A database restore must not resend campaigns, charge again or resurrect a cancellation as active. Preserve idempotency/provider references and audit.
- Measure database CPU/active hours, connection wait/locks, query p95, storage/history growth, backup age, restore time and per-tenant hot spots. Alerts prompt investigation, not an automatic checkout shutdown or deletion of legitimate records.

## Budget and selection gates

Use roughly £20 production database + £3 small staging as the lean illustrated workload, then carry separately priced independent backup/monitoring and other infrastructure. At the steady assumed workload the Launch illustration is about £82, not £20 forever. These replace/reconcile the database component inside existing infrastructure allocations; never add all tables twice to the company model. Current package prices remain unchanged.

Before production: actual supported region and data-transfer terms; required backup/history/support guarantees; auth/session/member scope; object-storage scope; repository dependency inventory; realistic connected load/restore evidence; actual invoice limits/alerts. Do not buy a more expensive plan for a vendor compliance badge without understanding actual data scope, but do not skip a required plan/control to preserve an artificial cheap estimate.

## Current primary sources

D1 https://neon.com/pricing ; D2 https://neon.com/docs/introduction/plans ; D3 https://supabase.com/pricing ; D4 https://supabase.com/docs/guides/platform/manage-your-usage/compute ; D5 https://supabase.com/docs/guides/platform/backups and https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery . Checked 3 November 2026. Neon and Supabase documentation evolve; current tariff/account terms override assumptions before procurement.
