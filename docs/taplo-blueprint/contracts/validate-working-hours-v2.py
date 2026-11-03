"""Validate the proposed quick-hours input boundary, not live scheduling/provider behaviour.
Requires jsonschema (Draft202012Validator); run with the selected project's pinned dev dependency.
"""
import json,datetime
from pathlib import Path
from zoneinfo import ZoneInfo,ZoneInfoNotFoundError
from jsonschema import Draft202012Validator,FormatChecker
R=Path(__file__).resolve().parent
schema=json.loads((R/'availability-v2.schema.json').read_text())
Draft202012Validator.check_schema(schema)
validator=Draft202012Validator({'$schema':schema['$schema'],'$ref':'#/$defs/ImpactRequest','$defs':schema['$defs']},format_checker=FormatChecker())
def valid(v):
 if list(validator.iter_errors(v)):return False
 p=v['pattern']
 try:ZoneInfo(p['timezone']);datetime.date.fromisoformat(p['effective_local_date'])
 except (ZoneInfoNotFoundError,ValueError):return False
 if (v['rule_id'] is None)!=(v['expected_rule_version']==0):return False
 if sorted(d['weekday'] for d in p['days'])!=list(range(1,8)):return False
 for d in p['days']:
  last=-1
  for interval in d['intervals']:
   start,end=interval['start_minute'],interval['end_minute']
   if start>=end or start<last:return False
   last=end
 return True
fixtures=json.loads((R/'working-hours-fixtures-v2.json').read_text())
for c in fixtures['cases']:assert valid(c['input'])==c['expected_valid'],c['id']
print(f"Passed {len(fixtures['cases'])} proposed schema/semantic boundary cases; no runtime/API/provider test executed.")
