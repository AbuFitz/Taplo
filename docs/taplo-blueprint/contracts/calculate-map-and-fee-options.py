"""Original map display/search and commission scenarios; assumptions, not invoices/profit."""
import json
from pathlib import Path
R=Path(__file__).resolve().parent
FX=.8
def tiers(n,allowance,bands):
 remaining=max(0,n-allowance);cost=0
 for capacity,per_thousand in bands:
  take=min(remaining,capacity);cost+=take*per_thousand/1000;remaining-=take
 if remaining:raise ValueError('outside researched model bands')
 return round(cost,6)
def web(n):return tiers(n,50000,[(50000,5),(100000,4)])
def native(n):return tiers(n,25000,[(100000,4),(125000,3.2)])
def standard_search(n):return tiers(n,2500,[(97500,11.5)])
map_cases=[]
for w,m,s in [(10000,1000,2000),(50000,25000,10000),(100000,50000,10000),(150000,150000,50000)]:
 a,b,c=web(w),native(m),standard_search(s)
 map_cases.append(dict(web_loads=w,native_map_mau=m,standard_search_units=s,display_usd=a+b,display_gbp=(a+b)*FX,search_usd=c,search_gbp=c*FX,total_model_gbp=(a+b+c)*FX))
fees=[]
for merchants in [1,100,1000]:
 for per_merchant in [500,2000,10000]:
  for bps in [0,50,100]:
   gmv=merchants*per_merchant;gross=gmv*bps/10000
   fees.append(dict(merchants=merchants,eligible_captured_gmv_per_merchant=per_merchant,basis_points=bps,gross_fee=gross,after_assumed_5pct_refund=gross*.95,after_refund_and_assumed_inclusive_20pct_vat=gross*.95/1.2))
assert web(50000)==0 and web(100000)==250 and web(150000)==450
assert native(25000)==0 and native(50000)==100 and native(150000)==480
assert standard_search(10000)==86.25
free_only=[dict(paid=100,active_free=400,free_payment_adoption=fraction,processing_free=400*fraction,eligible_gmv_per_processing_free=500,bps=100,gross_fee=400*fraction*500*.01,after_refund_vat=400*fraction*500*.01*.95/1.2) for fraction in [.1,.5]]
out={'free_only_alternatives':free_only,'edition':'2.8','status':'original_scenarios_not_actual_invoices_or_profit','fx_assumption_gbp_usd':FX,'map_cases':map_cases,'search_tariff_warning':'confirm_exact_product_account_tariff_and_billing_unit_standard_not_introductory_session_price','map_exclusions':['permanent_coordinate_storage_rights_and_geocoding','other_map_products','merchant_search_server_cost','multiple_app_or_device_counting_differences','tax_fx_engineering_design'],'commission_default_bps':0,'fee_scenarios':fees,'fee_exclusions':['provider_and_connect_cost_changes','support_tax_accounting_refund_administration','conversion_churn_off_platform_displacement','chargeback_losses_and_legal_review'],'hypotheses_not_evidence':True}
(R/'map-and-fee-results.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({'map_cases':map_cases,'fee_scenarios':len(fees)},indent=2))
