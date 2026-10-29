#!/usr/bin/env python3
"""Offline package integrity checks. Does not substitute for Claude's validator."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]

def validate():
    errors=[]
    manifest=json.loads((ROOT/'.claude-plugin/plugin.json').read_text())
    if manifest.get('name')!='taplo-machine' or not re.fullmatch(r'\d+\.\d+\.\d+',manifest.get('version','')):
        errors.append('Invalid plugin name/version')
    expected={'taplo-researcher','taplo-ux-designer','taplo-art-director','taplo-asset-director','taplo-design-engineer','taplo-visual-critic','taplo-browser-qa'}
    agents=set()
    for p in sorted((ROOT/'agents').glob('*.md'))+sorted((ROOT/'skills').glob('*/SKILL.md')):
        text=p.read_text()
        if not text.startswith('---\n') or '\n---\n' not in text[4:]:
            errors.append(f'{p.relative_to(ROOT)}: missing frontmatter');continue
        header=text.split('---',2)[1]
        match=re.search(r'^name:\s*([a-z0-9-]+)\s*$',header,re.M)
        if not match or not re.search(r'^description:\s*\S',header,re.M):
            errors.append(f'{p.relative_to(ROOT)}: missing name/description')
        if p.parent.name=='agents' and match:agents.add(match.group(1))
        if 'model:' in header:errors.append(f'{p.name}: unintended model override')
        if p.name=='SKILL.md' and 'disable-model-invocation: true' not in header:
            errors.append(f'{p}: orchestration must be explicitly invoked')
    if agents!=expected:errors.append('Agent inventory mismatch')
    lock=json.loads((ROOT/'vendor/sources.lock.json').read_text())
    for item in lock['sources']:
        p=ROOT/'vendor'/item['local']
        if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest()!=item['sha256']:
            errors.append(f'Vendor source changed: {item["local"]}')
        if not re.fullmatch(r'[0-9a-f]{40}',item['commit']):errors.append('Unpinned source')
    hooks=json.loads((ROOT/'hooks/hooks.json').read_text())['hooks']
    if set(hooks)!={'PreToolUse','Stop'}:errors.append('Unexpected hook inventory')
    for groups in hooks.values():
        for group in groups:
            for h in group['hooks']:
                if h.get('type')!='command' or 'scripts/machine.py' not in h.get('command',''):
                    errors.append('Unexpected hook command')
    for p in ROOT.rglob('*'):
        if p.is_symlink():errors.append(f'Unexpected packaged symlink: {p}')
    return {'passed':not errors,'agents':len(agents),'skills':len(list((ROOT/'skills').glob('*/SKILL.md'))),
            'pinned_source_files':len(lock['sources']),'errors':errors,
            'limit':'Offline integrity/schema checks only. Native Claude plugin loading must be tested in Claude Code.'}

if __name__=='__main__':
    result=validate();print(json.dumps(result,indent=2));sys.exit(0 if result['passed'] else 1)
