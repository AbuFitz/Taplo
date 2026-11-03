# Taplo · Provider cost envelope

Edition 2.3 · 3 November 2026 · Rough computed examples, not quotations or a complete supplier bill. Reproduce with python3 contracts/calculate-provider-costs.py. Published inputs and scope: PROVIDER-STACK. GBP uses assumed 0.80/USD; taxes/FX charges excluded.

## Email at the current package mix

Assume paid mix 60% Core / 30% Pro / 10% Business; operational sends 150/500/1,500 plus full marketing allowances 250/1,000/3,000. Four active Free accounts per paid, each approximately 40 sends/month. Illustrate two paid Pro accounts with 10,000 critical Taplo sends and remaining merchant delivery, each $20/50k plus $0.90 per additional 1k bucket. This is a cost envelope for an authorised configuration, not proof this exact structure is approved or suitable at this throughput. Critical volume is a simplifying allocation inside total sends, not measured usage.

| Paid / active Free | Total sends | Illustrative USD invoice | GBP equivalent | Existing aggregate email budget | Budget less illustration |
| --- | ---: | ---: | ---: | ---: | ---: |
| 100 / 400 | 130,000 | $103.00 | £82.40 | £94.08 | £11.68 |
| 500 / 2000 | 650,000 | $571.00 | £456.80 | £470.40 | £13.60 |
| 1000 / 4000 | 1,300,000 | $1,156.00 | £924.80 | £940.80 | £16.00 |

The existing aggregate email allowance covers these particular envelope examples, narrowly at scale. It does not prove plan/rate-limit/domain/support eligibility, sender safety, provider tax or actual volume. Domain/API isolation cannot be inferred from this arithmetic. No marketing email provider revenue is added to the business P&L. Paid campaign allowance and operational message count are different concepts.

At very small volume, two $20 minimums cost approximately £32/month even when marginal per-email estimates would be tiny. Fund this from launch/shared runway; do not pretend a near-zero per-send allocation pays the minimum. Higher feature plans or genuine provider isolation can cost more.

## Small stack subset: what the minimums miss

| Component / assumption | Monthly GBP estimate |
| --- | ---: |
| Vercel platform anchor, one included deploying seat; usage extra | £16.00 |
| Neon example: 0.25 CU × 720 hours × $0.106; actual usage differs | £15.26 |
| Neon example: 10 GB × $0.35; history/other items extra | £2.80 |
| Crisp Mini workspace, no WhatsApp promise | £36.00 |
| Monitoring reserve — budget, not a verified supplier quote | £20.00 |
| Backup/security reserve — budget, not a complete disaster-recovery quote | £20.00 |
| Maps reserve — budget, not unlimited map/search usage | £10.00 |
| Subtotal before email, additional usage, labour and unpriced items | £120.06 |

Adding the illustrative £32 small-volume email minimum gives about £152.06 before further usage and all exclusions. This is an illustrative procurement/runway check, not the cost to serve 100/500/1,000 merchants. DB/cloud costs already partly sit inside the existing variable infrastructure allocations; email has its own allocation. Do not add this entire table again to ECONOMICS-RESULTS and double count it. Reconcile actual invoices by cost bucket before replacing the rough shared pools.

## Map usage is a separate growth driver

| Web map loads/month | First-band map cost USD |
| ---: | ---: |
| 25,000 | $0.00 |
| 50,000 | $0.00 |
| 100,000 | $250.00 |

| Native mobile monthly active map users | First-band map cost USD |
| ---: | ---: |
| 10,000 | $0.00 |
| 25,000 | $0.00 |
| 50,000 | $100.00 |

Do not count a native mobile user as a web load or assume both bills exclude other product charges. The £10 reserve above is insufficient for the illustrated 100k web-load case ($250 ≈ £200) by itself. An Explore audience can grow faster than paid merchants; track public map/search cost by user/session, not just merchant count. Default list-first, initialise map on demand, reuse an active instance during permitted interaction and keep attribution. Do not evade legitimate metering, retain prohibited search data or give a blank map when a spend alert triggers; preserve a useful list/manual location path.

## What this changes

Resend remains a plausible low-friction default. The actual costs worth controlling include human support, acquisition, Free activity, image/traffic/map usage and supplier minimums—not email unit price alone. Prices remain the current £0/£12/£24/£49 recommendation. This calculation does not certify profitability; read ECONOMICS-RESULTS for the larger model and its exclusions.

Unpriced readiness items: exact identity/region/backup setup, message stream/account approval, rate-limit changes, monitoring plan, SMS sender costs, Wallet/developer accounts, store submission/maintenance, domain buying/renewal, legal/accounting/insurance, incident coverage and every other omitted company cost. Do not label these free.
