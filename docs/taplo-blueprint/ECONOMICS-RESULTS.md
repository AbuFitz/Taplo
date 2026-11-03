# Taplo · Reproducible rough economics results

Edition 2.2 · Estimates, not actual bills/profit or demand. Read PRICING-DECISION for current scope and spec 108 for sources/assumptions. Re-run contracts/calculate-economics.py after editing the assumptions JSON.

## Selected package unit costs

| Plan | Gross/month | Net after modelled VAT | Direct servicing | Contribution | Margin |
| --- | ---: | ---: | ---: | ---: | ---: |
| core | £12.00 | £10.00 | £4.15 | £5.85 | 58.5% |
| pro | £24.00 | £20.00 | £8.51 | £11.49 | 57.5% |
| business | £49.00 | £40.83 | £17.92 | £22.92 | 56.1% |

Contribution excludes Free subsidy, shared fixed costs, acquisition/onboarding and engineering/company overhead.

## Detailed monthly cost assumptions

| Plan | SaaS card/Billing | Infrastructure | Email | Human support | Included SMS | Reserve |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| core | £0.46 | £0.80 | £0.29 | £2.50 | £0.00 | £0.10 |
| pro | £0.73 | £1.50 | £1.08 | £5.00 | £0.00 | £0.20 |
| business | £1.28 | £3.00 | £3.24 | £10.00 | £0.00 | £0.40 |

## Price and SMS bundle comparison

| Price ladder | SMS allowance Core/Pro/Business | Core contribution | Pro contribution | Business contribution |
| --- | --- | ---: | ---: | ---: |
| lower [9.99, 19.99, 39.99] | [0, 0, 0] | £4.22 | £8.24 | £15.61 |
| lower [9.99, 19.99, 39.99] | [25, 75, 150] | £2.97 | £4.49 | £8.11 |
| lower [9.99, 19.99, 39.99] | [50, 150, 300] | £1.72 | £0.74 | £0.61 |
| lower [9.99, 19.99, 39.99] | [100, 300, 600] | £-0.78 | £-6.76 | £-14.39 |
| balanced [12, 24, 49] | [0, 0, 0] | £5.85 | £11.49 | £22.92 |
| balanced [12, 24, 49] | [25, 75, 150] | £4.60 | £7.74 | £15.42 |
| balanced [12, 24, 49] | [50, 150, 300] | £3.35 | £3.99 | £7.92 |
| balanced [12, 24, 49] | [100, 300, 600] | £0.85 | £-3.51 | £-7.08 |
| higher [15, 29, 59] | [0, 0, 0] | £8.28 | £15.55 | £31.03 |
| higher [15, 29, 59] | [25, 75, 150] | £7.03 | £11.80 | £23.53 |
| higher [15, 29, 59] | [50, 150, 300] | £5.78 | £8.05 | £16.03 |
| higher [15, 29, 59] | [100, 300, 600] | £3.28 | £0.55 | £1.03 |

## Scale scenarios

| Paid | Active Free | Gross billing | Net revenue | Paid contribution | Free servicing | Shared fixed | Left before acquisition/engineering | Replacement acquisition + onboarding | Left before engineering | After extra £3,000 engineering |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 400 | £1,930.00 | £1,608.33 | £924.79 | £180.00 | £150.00 | £594.79 | £200.00 | £394.79 | £-2,605.21 |
| 500 | 2000 | £9,650.00 | £8,041.67 | £4,623.97 | £900.00 | £300.00 | £3,423.97 | £1,000.00 | £2,423.97 | £-576.03 |
| 1000 | 4000 | £19,300.00 | £16,083.33 | £9,247.93 | £1,800.00 | £500.00 | £6,947.93 | £2,000.00 | £4,947.93 | £1,947.93 |

Churn/CAC/onboarding and engineering are explicit assumptions. Replacement acquisition maintains the cohort; it does not include additional growth acquisition. Corporate tax and other unbudgeted overhead are excluded.

## Sensitivities

| Scenario | Core contribution | Pro contribution | Business contribution |
| --- | ---: | ---: | ---: |
| base | £5.85 | £11.49 | £22.92 |
| support_double | £3.35 | £6.49 | £12.92 |
| support_four_times | £-1.65 | £-3.51 | £-7.08 |
| sms_8p | £5.85 | £11.49 | £22.92 |
| infra_three_times | £4.25 | £8.49 | £16.92 |
| email_double | £5.56 | £10.41 | £19.68 |
| combined_stress | £1.46 | £2.41 | £3.68 |

## Free subsidy and payback

Estimated active Free cost: £0.45/month.

| Active Free per paid | Average contribution after Free before fixed/acquisition/engineering |
| ---: | ---: |
| 1 | £8.80 |
| 4 | £7.45 |
| 10 | £4.75 |
| 20 | £0.25 |

£30 acquisition plus 20 minutes at £0.50/min onboarding: estimated payback 5.4 months before fixed/engineering and assuming stable contribution.

## Proposed optional top-ups

| SMS segments | Headline | Net after VAT | Estimated supplier | Card fee | Contribution before support/overhead |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | £9.00 | £7.50 | £5.00 | £0.34 | £2.17 |
| 500 | £39.00 | £32.50 | £25.00 | £0.78 | £6.71 |

## Price required for illustrative 50% margin after allocated Free cost

This target is a design choice, not an industry law or price customers will pay. Includes four active Free accounts per paid account; excludes shared fixed/acquisition/engineering.

| Plan | Implied headline price |
| --- | ---: |
| core | £14.41 |
| pro | £24.78 |
| business | £47.23 |
