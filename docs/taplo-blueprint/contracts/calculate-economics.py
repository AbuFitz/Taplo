"""Reproduce the blueprint's rough economics. Standard library only; no network."""
import json, math
from pathlib import Path
ROOT=Path(__file__).resolve().parent
A=json.loads((ROOT/'economics-assumptions.json').read_text())
def plan(i, price, sms, sms_cost=None, support_factor=1, infra_factor=1, email_factor=1):
    p=A['plan_usage'][i];net=price/(1+A['vat_registered_standard_rate_scenario'])
    costs={
      'subscription_fees': price*(A['subscription_card_fee_fraction']+A['subscription_billing_fraction'])+A['subscription_card_fee_fixed'],
      'infrastructure':p['variable_infrastructure']*infra_factor,
      'email':(p['operational_emails']+p['marketing_emails'])*A['email_gbp_per_send_assumption']*email_factor,
      'support':p['support_minutes']*A['support_gbp_per_minute_assumption']*support_factor,
      'sms':sms*(A['sms_gbp_per_segment_buffered_assumption'] if sms_cost is None else sms_cost),
      'reserve':p['saas_loss_reserve']}
    direct=sum(costs.values());return dict(plan=p['id'],gross=price,net=net,sms=sms,costs=costs,direct=direct,contribution=net-direct,margin=(net-direct)/net)
comparison=[]
for name, prices in A['price_ladders'].items():
 for bundle, sends in A['sms_bundles'].items():
  comparison.append(dict(ladder=name,bundle=bundle,plans=[plan(i,price,sends[i]) for i,price in enumerate(prices)]))
prices=A['price_ladders'][A['recommended_ladder']];sends=A['sms_bundles'][A['recommended_bundle']]
selected=[plan(i,p,sends[i]) for i,p in enumerate(prices)]
mix=A['paid_plan_mix_assumption'];assert abs(sum(mix)-1)<1e-9
f=A['free_account_cost_assumption'];free_cost=f['variable_infrastructure']+f['operational_email']+f['support_minutes']*A['support_gbp_per_minute_assumption']+f['other']
avg=lambda field:sum(p[field]*m for p,m in zip(selected,mix))
cohorts=[]
for c in A['cohort_shared_overhead_assumptions']:
 n=c['paid'];free=n*A['free_per_paid_base_assumption'];contrib=n*avg('contribution');free_bill=free*free_cost
 replacement=n*A['monthly_paid_churn_assumption']*(A['cac_assumption']+A['one_time_onboarding_minutes_assumption']*A['support_gbp_per_minute_assumption'])
 left=contrib-free_bill-c['fixed']
 cohorts.append(dict(paid=n,free=free,gross=n*avg('gross'),net=n*avg('net'),paid_contribution=contrib,free_cost=free_bill,shared_fixed=c['fixed'],before_acquisition_engineering=left,replacement_acquisition_and_onboarding=replacement,after_replacement_before_engineering=left-replacement,after_replacement_and_3000_engineering=left-replacement-3000))
sensitivity=[]
for label,kw in [('base',{}),('support_double',{'support_factor':2}),('support_four_times',{'support_factor':4}),('sms_8p',{'sms_cost':.08}),('infra_three_times',{'infra_factor':3}),('email_double',{'email_factor':2}),('combined_stress',{'support_factor':2,'sms_cost':.08,'infra_factor':3,'email_factor':2})]:
 sensitivity.append(dict(case=label,plans=[plan(i,p,sends[i],**kw) for i,p in enumerate(prices)]))
ratio_sensitivity=[dict(free_per_paid=r,contribution_after_free=avg('contribution')-r*free_cost) for r in [1,4,10,20]]
topups=[]
for t in A['sms_topups']:
 net=t['headline']/1.2;fees=t['headline']*A['subscription_card_fee_fraction']+A['subscription_card_fee_fixed'];cost=t['segments']*A['sms_gbp_per_segment_buffered_assumption'];left=net-fees-cost
 topups.append(dict(**t,net=net,supplier_estimate=cost,card_fees=fees,contribution=left,margin=left/net))
def margin_floor(i,target=.5,free_ratio=4):
 p=selected[i];other=p['direct']-p['costs']['subscription_fees']
 return (other+A['subscription_card_fee_fixed']+free_ratio*free_cost)/((1-target)/1.2-A['subscription_card_fee_fraction']-A['subscription_billing_fraction'])
unit_after_free=avg('contribution')-A['free_per_paid_base_assumption']*free_cost
out=dict(assumptions=A,selected=selected,comparisons=comparison,free_cost=free_cost,cohorts=cohorts,sensitivities=sensitivity,free_ratio_sensitivities=ratio_sensitivity,topups=topups,price_floors_for_50pct_after_free_before_fixed=[margin_floor(i) for i in range(3)],paid_contribution_average=avg('contribution'),paid_contribution_after_free=unit_after_free,cac_plus_onboarding_payback_months=(A['cac_assumption']+A['one_time_onboarding_minutes_assumption']*A['support_gbp_per_minute_assumption'])/unit_after_free if unit_after_free>0 else None)
for row in selected:
 assert abs(row['net']-row['direct']-row['contribution'])<1e-9
 assert row['direct']>=0
assert all(v['contribution']>0 for v in topups)
(ROOT/'economics-results.json').write_text(json.dumps(out,indent=2)+'\n')
fmt=lambda v:f'£{v:,.2f}'
lines=['# Taplo · Reproducible rough economics results','', 'Edition 2.2 · Estimates, not actual bills/profit or demand. Read PRICING-DECISION for current scope and spec 108 for sources/assumptions. Re-run contracts/calculate-economics.py after editing the assumptions JSON.','', '## Selected package unit costs','', '| Plan | Gross/month | Net after modelled VAT | Direct servicing | Contribution | Margin |','| --- | ---: | ---: | ---: | ---: | ---: |']
for p in selected:lines.append(f"| {p['plan']} | {fmt(p['gross'])} | {fmt(p['net'])} | {fmt(p['direct'])} | {fmt(p['contribution'])} | {p['margin']:.1%} |")
lines+=['','Contribution excludes Free subsidy, shared fixed costs, acquisition/onboarding and engineering/company overhead.','', '## Detailed monthly cost assumptions','', '| Plan | SaaS card/Billing | Infrastructure | Email | Human support | Included SMS | Reserve |','| --- | ---: | ---: | ---: | ---: | ---: | ---: |']
for p in selected:lines.append('| '+p['plan']+' | '+' | '.join(fmt(p['costs'][k]) for k in ['subscription_fees','infrastructure','email','support','sms','reserve'])+' |')
lines+=['','## Price and SMS bundle comparison','', '| Price ladder | SMS allowance Core/Pro/Business | Core contribution | Pro contribution | Business contribution |','| --- | --- | ---: | ---: | ---: |']
for c in comparison:lines.append('| '+c['ladder']+' '+str(A['price_ladders'][c['ladder']])+' | '+str(A['sms_bundles'][c['bundle']])+' | '+' | '.join(fmt(p['contribution']) for p in c['plans'])+' |')
lines+=['','## Scale scenarios','', '| Paid | Active Free | Gross billing | Net revenue | Paid contribution | Free servicing | Shared fixed | Left before acquisition/engineering | Replacement acquisition + onboarding | Left before engineering | After extra £3,000 engineering |','| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |']
for c in cohorts:lines.append('| '+str(c['paid'])+' | '+str(c['free'])+' | '+' | '.join(fmt(c[k]) for k in ['gross','net','paid_contribution','free_cost','shared_fixed','before_acquisition_engineering','replacement_acquisition_and_onboarding','after_replacement_before_engineering','after_replacement_and_3000_engineering'])+' |')
lines+=['','Churn/CAC/onboarding and engineering are explicit assumptions. Replacement acquisition maintains the cohort; it does not include additional growth acquisition. Corporate tax and other unbudgeted overhead are excluded.','', '## Sensitivities','', '| Scenario | Core contribution | Pro contribution | Business contribution |','| --- | ---: | ---: | ---: |']
for s in sensitivity:lines.append('| '+s['case']+' | '+' | '.join(fmt(p['contribution']) for p in s['plans'])+' |')
lines+=['','## Free subsidy and payback','',f'Estimated active Free cost: {fmt(free_cost)}/month.', '', '| Active Free per paid | Average contribution after Free before fixed/acquisition/engineering |','| ---: | ---: |']
for s in ratio_sensitivity:lines.append(f"| {s['free_per_paid']} | {fmt(s['contribution_after_free'])} |")
lines+=['',f"£30 acquisition plus 20 minutes at £0.50/min onboarding: estimated payback {out['cac_plus_onboarding_payback_months']:.1f} months before fixed/engineering and assuming stable contribution.", '', '## Proposed optional top-ups','', '| SMS segments | Headline | Net after VAT | Estimated supplier | Card fee | Contribution before support/overhead |','| ---: | ---: | ---: | ---: | ---: | ---: |']
for t in topups:lines.append('| '+str(t['segments'])+' | '+' | '.join(fmt(t[k]) for k in ['headline','net','supplier_estimate','card_fees','contribution'])+' |')
lines+=['','## Price required for illustrative 50% margin after allocated Free cost','', 'This target is a design choice, not an industry law or price customers will pay. Includes four active Free accounts per paid account; excludes shared fixed/acquisition/engineering.', '', '| Plan | Implied headline price |','| --- | ---: |']
for p,floor in zip(selected,out['price_floors_for_50pct_after_free_before_fixed']):lines.append(f"| {p['plan']} | {fmt(floor)} |")
(ROOT.parent/'ECONOMICS-RESULTS.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'selected':[{k:p[k] for k in ['plan','gross','direct','contribution','margin']} for p in selected],'cohorts':cohorts,'free_cost':free_cost,'payback':out['cac_plus_onboarding_payback_months']},indent=2))
