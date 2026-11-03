"""Calculate initial SMS pack purchases for the package decision; not billing code."""
import json, math
from pathlib import Path
R=Path(__file__).resolve().parent
A=json.loads((R/'economics-assumptions.json').read_text())
packs=A['sms_topups']
assert [(p['segments'],p['headline']) for p in packs]==[(100,9),(500,39)]
def purchase(required):
    assert isinstance(required,int) and required>=0
    choices=[]
    for big in range(math.ceil(required/500)+1):
        small=math.ceil(max(required-big*500,0)/100)
        units=big*500+small*100;cost=big*39+small*9
        choices.append((cost,units-required,small,big))
    cost,left,small,big=min(choices)
    return {'required':required,'small_packs':small,'large_packs':big,'sms_purchase':cost,'units_remaining':left}
assert purchase(0)['sms_purchase']==0
assert purchase(100)['sms_purchase']==9
assert purchase(300)['sms_purchase']==27
assert purchase(600)['sms_purchase']==48
assert purchase(1000)['sms_purchase']==78
cases=[('solo_email','core',12,0),('solo_100','core',12,100),('busy_solo_600','core',12,600),('team_1000','core',12,1000),('retailer_email','pro',24,0),('workshop_email','core',12,0)]
results=[dict(case=name,plan=plan,subscription=price,**purchase(n),initial_total=price+purchase(n)['sms_purchase']) for name,plan,price,n in cases]
(R/'package-bill-fixtures.json').write_text(json.dumps({'status':'illustrative_cash_bills_no_opening_units_no_processing_domain_hardware','cases':results},indent=2)+'\n')
print(json.dumps(results,indent=2))
