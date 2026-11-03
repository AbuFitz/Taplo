"""Validate selected proposed shapes, not runtime authority. Requires jsonschema."""
import json,copy
from pathlib import Path
from jsonschema import Draft202012Validator,FormatChecker
R=Path(__file__).resolve().parent
S=json.loads((R/'growth-trust-records.json').read_text());Draft202012Validator.check_schema(S)
base={'id':'rec_abcdefgh','version':1,'created_at':'2026-11-03T10:00:00Z','updated_at':'2026-11-03T10:00:00Z'}
legal=base|{'document_key':'privacy','audience':'public','locale':'en-GB','document_version':'1','content_hash':'example_hash','state':'draft','unresolved_fields':['LEGAL_ENTITY']}
consent=base|{'sender_scope':'merchant','business_id':'biz_abcdefgh','recipient_ref':'usr_abcdefgh','channel':'email','purpose':'marketing','basis':'explicit_consent','notice_version':'1','notice_snapshot_ref':'not_abcdefgh','collection_context_ref':'ctx_abcdefgh','collected_at':'2026-11-03T10:00:00Z','status':'active'}
review=base|{'business_id':'biz_abcdefgh','author_ref':'usr_abcdefgh','verification':'not_yet_checked','rating':1,'text':'The merchant cancelled my booking.','public_name':'A customer','state':'submitted','policy_version':'1'}
campaign=base|{'sender_scope':'merchant','business_id':'biz_abcdefgh','channel':'email','audience_definition_ref':'aud_abcdefgh','template_ref':'tpl_abcdefgh','template_version':'1','state':'draft','created_by':'usr_abcdefgh','timezone':'Europe/London','budget_units':10,'budget_minor':0,'currency':'GBP'}
checks=[('LegalDocument',legal,True),('LegalDocument',legal|{'state':'published'},False),('LegalDocument',legal|{'state':'published','unresolved_fields':[],'reviewer_ref':'usr_abcdefgh','review_scope_ref':'scp_abcdefgh','effective_at':'2026-11-03T10:00:00Z'},True),('ConsentEvidence',consent,True),('ConsentEvidence',{k:v for k,v in consent.items() if k!='business_id'},False),('ConsentEvidence',consent|{'status':'withdrawn'},False),('ConsentEvidence',consent|{'basis':'reviewed_products_services_soft_opt_in'},False),('Review',review,True),('Review',review|{'verification':'booked_through_taplo'},False),('Review',review|{'rating':0},False),('Campaign',campaign,True),('Campaign',campaign|{'state':'scheduled'},False),('Campaign',campaign|{'state':'scheduled','approved_by':'usr_abcdefgh','approved_revision':1,'scheduled_at':'2026-11-04T10:00:00Z'},True)]
for name,record,expected in checks:
 schema={'$schema':S['$schema'],'$defs':S['$defs'],'$ref':'#/$defs/'+name}
 errors=list(Draft202012Validator(schema,format_checker=FormatChecker()).iter_errors(record))
 assert (not errors)==expected,(name,expected,[e.message for e in errors])
print(f'Passed {len(checks)} proposed shape cases. No runtime/legal compliance assertion.')
