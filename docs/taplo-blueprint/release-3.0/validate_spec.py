"""Static handoff consistency and normative arithmetic checks, not product/provider/security proof.
Install requirements-spec-checks.txt in an isolated dev environment; python validate_spec.py.
"""
from pathlib import Path
import json,re
from jsonschema import Draft202012Validator,FormatChecker
from pglast import parse_sql
R=Path(__file__).resolve().parent;C=R/'contracts'
load=lambda n:json.loads((C/n).read_text())
D=load('records.schema.json');I=load('inputs.schema.json');M=load('commands.json')['commands'];A=load('authorisation.json');P=load('openapi.json')
for schema in [D,I]:Draft202012Validator.check_schema(schema)
def refs(v,defs):
 if isinstance(v,dict):
  if '$ref' in v and v['$ref'].startswith('#/$defs/'):assert v['$ref'].split('/')[-1] in defs,v['$ref']
  for x in v.values():refs(x,defs)
 elif isinstance(v,list):
  for x in v:refs(x,defs)
refs(D,D['$defs']);refs(I,I['$defs'])
names={c['name'] for c in M};assert len(names)==len(M)
assert len({(c['method'],c['path']) for c in M})==len(M)
roles={x for values in A['role_presets'].values() for x in values}
assert {x['command'] for x in A['actions']}==names
for c in M:
 assert c['schema'] in I['$defs'],c['name']
 assert c['returns'] in D['$defs'] or c['returns'] in I['$defs'],c['returns']
 assert c['permission'] in roles,(c['name'],c['permission'])
 assert P['paths'][c['path']][c['method'].lower()]['operationId']==c['name']
for f in C.glob('*.json'):json.loads(f.read_text())
screens=json.loads((R/'design/screens.json').read_text())['screens'];assert len(screens)==67
for s in screens:assert s['command'] in names,s['id'];assert s['source_record'] in D['$defs'],s['source_record']
profiles=load('category-profiles.json')['profiles'];assert len(profiles)==13
for p in profiles:
 for n in p['configuration_records']:assert n in D['$defs'],n
 for required in ['field_source','availability','team_access','checkout','daily_work','cancel_refund','exception_cases']:assert p[required],(p['key'],required)
for w in load('journeys.json')['journeys']:
 assert all(x in names for x in w['steps']),w['id']
packets=load('build-packets.json')['packets'];done=set()
for p in packets:assert set(p['depends_on'])<=done;done.add(p['id'])
assert [p['headline_minor'] for p in load('packages.json')['plans']]==[0,1200,2400,4900]
assert load('packages.json')['platform_transaction_commission_percent']==0
statements=parse_sql((C/'postgres-schema.sql').read_text())
# Normative arithmetic is separate from runtime locks/idempotency/provider behaviour.
fixtures=load('reference-rule-fixtures.json')['cases']
for f in fixtures:
 k=f['kind']
 if k=='deposit':
  value=0 if f['mode']=='none' else f['total_minor'] if f['mode']=='full' else f['value'] if f['mode']=='fixed' else (f['total_minor']*f['value']+5000)//10000
  if f.get('expected_error'):assert value>f['total_minor']
  else:assert value==f['expected_minor'] and 0<=value<=f['total_minor'],f['id']
 elif k=='refund':assert (0<f['requested']<=f['captured']-f['succeeded']-f['pending'])==f['allowed'],f['id']
 elif k=='stock':assert (f['requested']<=f['on_hand']-f['held']-f['committed']-f['unavailable'])==f['allowed'],f['id']
 elif k=='overlap':assert (max(f['a'][0],f['b'][0])<min(f['a'][1],f['b'][1]))==f['expected'],f['id']
 elif k=='reward_reverse':assert max(0,min(f['earned'],f['earned']*f['total_refunded']//f['eligible_spend'])-f['already_reversed'])==f['expected'],f['id']
# Boundary validation for representative new shapes.
v=lambda name:Draft202012Validator({'$ref':'#/$defs/'+name,'$defs':I['$defs']},format_checker=FormatChecker())
assert not list(v('CreatePaymentPolicy').iter_errors({'mode':'none','currency':'GBP','cancellation_policy_ref':'pol_12345678'}))
assert list(v('CreatePaymentPolicy').iter_errors({'mode':'deposit_fixed','currency':'GBP','cancellation_policy_ref':'pol_12345678'}))
assert list(v('CreatePaymentPolicy').iter_errors({'mode':'deposit_percent','basis_points':10001,'currency':'GBP','cancellation_policy_ref':'pol_12345678'}))
assert list(v('SubmitReview').iter_errors({'commitment_id':'book_12345678','rating':6,'body':'x','expected_version':1}))
assert list(v('CreateOfferDraft').iter_errors({'kind':'service','title':'Fade','price_mode':'fixed'}))
print(json.dumps({'static_checks':'passed','record_definitions':len(D['$defs']),'commands':len(M),'screen_families':len(screens),'category_profiles':len(profiles),'journeys':len(load('journeys.json')['journeys']),'postgres_statements_parsed':len(statements),'reference_rule_cases':len(fixtures),'shape_boundary_cases':5,'runtime_provider_legal_customer_results':False},indent=2))
