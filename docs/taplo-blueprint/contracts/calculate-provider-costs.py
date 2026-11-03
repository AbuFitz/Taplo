"""Planning envelope only. No network/provider configuration. Standard library."""
import json, math
from pathlib import Path
R=Path(__file__).resolve().parent
A=json.loads((R/'economics-assumptions.json').read_text())
P=json.loads((R/'proposed-packages.json').read_text())
fx=A['gbp_per_usd_assumption_not_live_fx']
assert [p['headline_minor'] for p in P['plans']]==[0,1200,2400,4900]
assert [p['included_marketing_email_sends_monthly'] for p in P['plans']]==[0,250,1000,3000]
# Illustrative two paid accounts: 10k/month critical Taplo messages, remainder merchant.
# Actual allowed structure and throughput must be confirmed; no suspension circumvention.
def resend_pro_usd(sends):
 return 20+math.ceil(max(0,sends-50000)/1000)*.90
cases=[]
for n in [100,500,1000]:
 paid=sum(n*m*(u['operational_emails']+u['marketing_emails']) for m,u in zip(A['paid_plan_mix_assumption'],A['plan_usage']))
 free=n*A['free_per_paid_base_assumption']
 free_sends=free*40 # explicit rough volume; current model allocates money, not this exact count
 total=int(paid+free_sends)
 security=10000
 merchant=max(0,total-security)
 usd=resend_pro_usd(security)+resend_pro_usd(merchant)
 allocation=paid*A['email_gbp_per_send_assumption']+free*A['free_account_cost_assumption']['operational_email']
 row=dict(paid_accounts=n,active_free_accounts=free,total_email_sends=total,critical_account_sends=security,merchant_account_sends=merchant,illustrative_invoice_usd=usd,illustrative_invoice_gbp=usd*fx,existing_email_budget_gbp=allocation,budget_minus_illustrative_invoice_gbp=allocation-usd*fx)
 assert row['total_email_sends']==row['critical_account_sends']+row['merchant_account_sends']
 cases.append(row)
base={
 'vercel_platform_gbp':20*fx,
 'neon_compute_example_gbp':.25*720*.106*fx,
 'neon_storage_example_gbp':10*.35*fx,
 'crisp_mini_gbp':45*fx,
 'monitoring_planning_budget_gbp':20,
 'backup_security_planning_budget_gbp':20,
 'maps_planning_budget_gbp':10
}
base['subtotal_gbp']=sum(base.values())
# First paid Mapbox bands only; geocoding/search excluded, not a full maps invoice.
map_cases=[dict(web_loads=n,web_map_load_cost_usd=max(0,n-50000)/1000*5) for n in [25000,50000,100000]]
mobile_cases=[dict(native_mobile_mau=n,mobile_map_cost_usd=max(0,n-25000)/1000*4) for n in [10000,25000,50000]]
out=dict(edition='2.3',status='rough_envelope_not_actual_invoice_or_full_company_cost',gbp_per_usd_assumption=fx,email_cases=cases,small_stack_subset=base,web_maps_first_band_cases=map_cases,mobile_maps_first_band_cases=mobile_cases,excludes=['supplier_taxes_fx_card_costs','extra_domains_or_higher_feature_tiers','unapproved_account_structure_or_rate_limit_constraints','additional_compute_storage_transfer_operations','geocoding_search_navigation','merchant_card_processing','development_founder_pay_support_labour','legal_accounting_insurance_store_wallet_domains_hardware','all_other_unbudgeted_company_costs'])
(R/'provider-cost-results.json').write_text(json.dumps(out,indent=2)+'\n')
f=lambda x:f'£{x:,.2f}'
lines=['# Taplo · Provider cost envelope','', 'Edition 2.3 · 3 November 2026 · Rough computed examples, not quotations or a complete supplier bill. Reproduce with python3 contracts/calculate-provider-costs.py. Published inputs and scope: PROVIDER-STACK. GBP uses assumed 0.80/USD; taxes/FX charges excluded.','', '## Email at the current package mix','', 'Assume paid mix 60% Core / 30% Pro / 10% Business; operational sends 150/500/1,500 plus full marketing allowances 250/1,000/3,000. Four active Free accounts per paid, each approximately 40 sends/month. Illustrate two paid Pro accounts with 10,000 critical Taplo sends and remaining merchant delivery, each $20/50k plus $0.90 per additional 1k bucket. This is a cost envelope for an authorised configuration, not proof this exact structure is approved or suitable at this throughput. Critical volume is a simplifying allocation inside total sends, not measured usage.','', '| Paid / active Free | Total sends | Illustrative USD invoice | GBP equivalent | Existing aggregate email budget | Budget less illustration |','| --- | ---: | ---: | ---: | ---: | ---: |']
for c in cases:lines.append(f"| {c['paid_accounts']} / {c['active_free_accounts']} | {c['total_email_sends']:,} | ${c['illustrative_invoice_usd']:,.2f} | {f(c['illustrative_invoice_gbp'])} | {f(c['existing_email_budget_gbp'])} | {f(c['budget_minus_illustrative_invoice_gbp'])} |")
lines+=['','The existing aggregate email allowance covers these particular envelope examples, narrowly at scale. It does not prove plan/rate-limit/domain/support eligibility, sender safety, provider tax or actual volume. Domain/API isolation cannot be inferred from this arithmetic. No marketing email provider revenue is added to the business P&L. Paid campaign allowance and operational message count are different concepts.','', 'At very small volume, two $20 minimums cost approximately £32/month even when marginal per-email estimates would be tiny. Fund this from launch/shared runway; do not pretend a near-zero per-send allocation pays the minimum. Higher feature plans or genuine provider isolation can cost more.','', '## Small stack subset: what the minimums miss','', '| Component / assumption | Monthly GBP estimate |','| --- | ---: |']
labels={'vercel_platform_gbp':'Vercel platform anchor, one included deploying seat; usage extra','neon_compute_example_gbp':'Neon example: 0.25 CU × 720 hours × $0.106; actual usage differs','neon_storage_example_gbp':'Neon example: 10 GB × $0.35; history/other items extra','crisp_mini_gbp':'Crisp Mini workspace, no WhatsApp promise','monitoring_planning_budget_gbp':'Monitoring reserve — budget, not a verified supplier quote','backup_security_planning_budget_gbp':'Backup/security reserve — budget, not a complete disaster-recovery quote','maps_planning_budget_gbp':'Maps reserve — budget, not unlimited map/search usage'}
for k,label in labels.items():lines.append(f'| {label} | {f(base[k])} |')
lines += [f"| Subtotal before email, additional usage, labour and unpriced items | {f(base['subtotal_gbp'])} |",'', 'Adding the illustrative £32 small-volume email minimum gives about '+f(base['subtotal_gbp']+32)+' before further usage and all exclusions. This is an illustrative procurement/runway check, not the cost to serve 100/500/1,000 merchants. DB/cloud costs already partly sit inside the existing variable infrastructure allocations; email has its own allocation. Do not add this entire table again to ECONOMICS-RESULTS and double count it. Reconcile actual invoices by cost bucket before replacing the rough shared pools.','', '## Map usage is a separate growth driver','', '| Web map loads/month | First-band map cost USD |','| ---: | ---: |']
for c in map_cases:lines.append(f"| {c['web_loads']:,} | ${c['web_map_load_cost_usd']:,.2f} |")
lines+=['','| Native mobile monthly active map users | First-band map cost USD |','| ---: | ---: |']
for c in mobile_cases:lines.append(f"| {c['native_mobile_mau']:,} | ${c['mobile_map_cost_usd']:,.2f} |")
lines+=['','Do not count a native mobile user as a web load or assume both bills exclude other product charges. The £10 reserve above is insufficient for the illustrated 100k web-load case ($250 ≈ £200) by itself. An Explore audience can grow faster than paid merchants; track public map/search cost by user/session, not just merchant count. Default list-first, initialise map on demand, reuse an active instance during permitted interaction and keep attribution. Do not evade legitimate metering, retain prohibited search data or give a blank map when a spend alert triggers; preserve a useful list/manual location path.','', '## What this changes','', 'Resend remains a plausible low-friction default. The actual costs worth controlling include human support, acquisition, Free activity, image/traffic/map usage and supplier minimums—not email unit price alone. Prices remain the current £0/£12/£24/£49 recommendation. This calculation does not certify profitability; read ECONOMICS-RESULTS for the larger model and its exclusions.','', 'Unpriced readiness items: exact identity/region/backup setup, message stream/account approval, rate-limit changes, monitoring plan, SMS sender costs, Wallet/developer accounts, store submission/maintenance, domain buying/renewal, legal/accounting/insurance, incident coverage and every other omitted company cost. Do not label these free.']
(R.parent/'PROVIDER-COSTS.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'email_cases':cases,'small_subset_before_email':base['subtotal_gbp'],'low_volume_subset_with_email':base['subtotal_gbp']+32},indent=2))
