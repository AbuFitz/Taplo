#!/usr/bin/env python3
"""Local Taplo design-run ledger and evidence gates. Python 3.10+, stdlib only.

These are workflow checks, not an authenticity service or security sandbox.
No network, package installs, or product edits are performed by this helper.
"""
from __future__ import annotations
import argparse
import datetime as dt
import fnmatch
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import signal
import struct
import subprocess
import sys
import uuid
import zlib

PLUGIN = Path(__file__).resolve().parents[1]
IGNORE = {'.git', '.taplo-machine', 'node_modules', '.next', '.nuxt', '.turbo',
          'dist', 'build', 'coverage', 'test-results', 'playwright-report', '__pycache__'}
PLACEHOLDER = re.compile(r'^(todo|tbd|placeholder|fill me|unknown|example|pending)\b', re.I)

class GateError(Exception):
    pass

def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()

def dump(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(path.name + '.' + uuid.uuid4().hex + '.tmp')
    temp.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')
    os.replace(temp, path)

def read(path):
    try:
        return json.loads(Path(path).read_text())
    except (OSError, ValueError) as e:
        raise GateError(f'Cannot read {path}: {e}') from e

def obj(path):
    value = read(path)
    if not isinstance(value, dict):
        raise GateError(f'{path}: expected a JSON object')
    return value

def sha(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as f:
        for block in iter(lambda: f.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()

def inside(root, relative):
    p = (root / relative).resolve()
    if not p.is_relative_to(root.resolve()):
        raise GateError(f'Path leaves project: {relative}')
    return p

def git(root, *args):
    try:
        p = subprocess.run(['git', '-C', str(root), *args], capture_output=True,
                           timeout=20, check=False)
        return p.stdout if p.returncode == 0 else None
    except (OSError, subprocess.TimeoutExpired):
        return None

def source_files(root):
    listing = git(root, 'ls-files', '--cached', '--others', '--exclude-standard', '-z')
    if listing is not None:
        candidates = [root / os.fsdecode(p) for p in listing.split(b'\0') if p]
    else:
        candidates = []
        for current, dirs, names in os.walk(root, followlinks=False):
            dirs[:] = [d for d in dirs if d not in IGNORE and not (Path(current) / d).is_symlink()]
            candidates.extend(Path(current) / n for n in names)
    result = []
    for p in candidates:
        rel = p.relative_to(root)
        if any(part in IGNORE for part in rel.parts) or p.name.startswith('.env'):
            continue
        # A project-local copy of this plugin must not invalidate its own run.
        if '.claude' in rel.parts and 'taplo-machine' in rel.parts:
            continue
        if p.is_symlink():
            # Follow no symlinks, including links that point outside the checkout.
            continue
        if p.is_file():
            result.append(p)
        if len(result) > 30000:
            raise GateError('Source set exceeds 30,000 files. Use a bounded checkout or Git ignore generated output.')
    return sorted(set(result))

def fingerprint(root):
    h = hashlib.sha256()
    count = 0
    for p in source_files(root):
        h.update(p.relative_to(root).as_posix().encode())
        h.update(b'\0')
        h.update(bytes.fromhex(sha(p)))
        count += 1
    return {'fingerprint': h.hexdigest(), 'file_count': count}

def machine_dir(root):
    return root / '.taplo-machine'

def active(root):
    a = obj(machine_dir(root) / 'active.json')
    rid = a.get('run_id', '')
    if not re.fullmatch(r'[a-zA-Z0-9_-]{1,100}', rid):
        raise GateError('Invalid active run id')
    folder = machine_dir(root) / 'runs' / rid
    state = obj(folder / 'run.json')
    return folder, state

def record_event(folder, event, **fields):
    with (folder / 'events.jsonl').open('a') as f:
        f.write(json.dumps({'time': now(), 'event': event, **fields}) + '\n')

def nonempty(value):
    return isinstance(value, str) and bool(value.strip()) and not PLACEHOLDER.match(value.strip())

def require_text(obj, key, errors, where):
    if not nonempty(obj.get(key)):
        errors.append(f'{where}.{key}: substantive text required')

def verify_artifact(root, item, errors, where):
    try:
        p = inside(root, item.get('path', ''))
        if not p.is_file() or not item.get('sha256') or sha(p) != item['sha256']:
            errors.append(f'{where}: missing or changed artifact {item.get("path")}')
        return p
    except (GateError, OSError):
        errors.append(f'{where}: invalid artifact path')
        return None

def image_size(path):
    """Validate PNG chunks/CRC or JPEG framing and return actual pixel dimensions."""
    data = Path(path).read_bytes()
    if data.startswith(b'\x89PNG\r\n\x1a\n'):
        offset, size, seen_data = 8, None, False
        while offset + 12 <= len(data):
            length = struct.unpack('>I', data[offset:offset+4])[0]
            tag = data[offset+4:offset+8]
            end = offset + 12 + length
            if end > len(data):
                raise GateError('Truncated PNG')
            body = data[offset+8:offset+8+length]
            crc = struct.unpack('>I', data[offset+8+length:end])[0]
            if zlib.crc32(tag + body) & 0xffffffff != crc:
                raise GateError('PNG checksum mismatch')
            if size is None:
                if tag != b'IHDR' or length != 13:
                    raise GateError('PNG missing first IHDR')
                size = struct.unpack('>II', body[:8])
                if not all(size):
                    raise GateError('PNG has zero dimensions')
            if tag == b'IDAT':
                seen_data = True
            if tag == b'IEND':
                if length or end != len(data) or not seen_data:
                    raise GateError('PNG missing image data or invalid end')
                return size
            offset = end
        raise GateError('PNG missing IEND')
    if data.startswith(b'\xff\xd8') and data.endswith(b'\xff\xd9'):
        offset = 2
        while offset + 4 < len(data):
            if data[offset] != 255:
                raise GateError('Invalid JPEG marker')
            while offset < len(data) and data[offset] == 255:
                offset += 1
            tag = data[offset]
            offset += 1
            if tag in (0xd8, 0xd9, 0x01) or 0xd0 <= tag <= 0xd7:
                continue
            length = int.from_bytes(data[offset:offset+2], 'big')
            if length < 2 or offset + length > len(data):
                raise GateError('Truncated JPEG segment')
            if tag in (0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf):
                height = int.from_bytes(data[offset+3:offset+5], 'big')
                width = int.from_bytes(data[offset+5:offset+7], 'big')
                if width and height:
                    return width, height
                break
            offset += length
    raise GateError('Expected a structurally valid PNG or JPEG capture')

def plan_errors(root, folder):
    errors = []
    brief = obj(folder / 'brief.json')
    refs = obj(folder / 'references.json')
    direction = obj(folder / 'direction.json')
    for key in ('goal', 'primary_task', 'surface', 'scope_kind'):
        require_text(brief, key, errors, 'brief')
    if brief.get('surface') not in ('marketing', 'public-page', 'onboarding', 'studio', 'shared-system'):
        errors.append('brief.surface: invalid surface')
    for key in ('allowed_paths', 'acceptance', 'required_states', 'required_checks', 'constraints'):
        if not isinstance(brief.get(key), list) or not brief[key] or not all(nonempty(x) for x in brief[key]):
            errors.append(f'brief.{key}: nonempty list required')
    for path in brief.get('allowed_paths', []):
        if not isinstance(path, str):
            continue
        if Path(path).is_absolute() or '..' in Path(path).parts or path in ('*', '**', '**/*', '.'):
            errors.append(f'brief.allowed_paths: use bounded project-relative scope, got {path}')
    if brief.get('contract_reconciled') is not True:
        errors.append('brief: reconcile current owner instructions with context/taplo-contract.json')
    minimum_refs = 2 if brief.get('scope_kind') == 'redesign' else 1
    if not isinstance(refs.get('items'), list) or len(refs['items']) < minimum_refs:
        errors.append(f'references: at least {minimum_refs} inspected visual reference(s) required (approved captures may be reused; a bugfix may use its actual repro capture)')
    for i, ref in enumerate(refs.get('items', []) if isinstance(refs.get('items'), list) else []):
        if not isinstance(ref, dict):
            errors.append(f'references[{i}]: object required')
            continue
        for key in ('id', 'url', 'principle', 'adaptation', 'rejected_trait', 'observed_state'):
            require_text(ref, key, errors, f'references[{i}]')
        if not re.match(r'https?://', ref.get('url', '')):
            errors.append(f'references[{i}].url: http(s) source required')
        ref_path = verify_artifact(root, ref, errors, f'references[{i}]')
        if ref_path and ref_path.is_file():
            try:
                image_size(ref_path)
            except GateError as e:
                errors.append(f'references[{i}]: {e}')
        if ref.get('inspected_pixels') is not True:
            errors.append(f'references[{i}]: image inspection must be explicitly recorded')
    for key in ('thesis', 'hierarchy', 'layout', 'typography', 'colour', 'interaction', 'mobile_behaviour', 'asset_strategy'):
        require_text(direction, key, errors, 'direction')
    variants = direction.get('alternatives', [])
    if not isinstance(variants, list) or not variants:
        errors.append('direction.alternatives: at least one considered composition required')
    elif brief.get('scope_kind') == 'redesign' and len(variants) < 3:
        errors.append('direction.alternatives: redesign requires three materially different composition proposals')
    for i, v in enumerate(variants if isinstance(variants, list) else []):
        if not isinstance(v, dict):
            errors.append(f'direction.alternatives[{i}]: object required')
            continue
        for key in ('id', 'composition', 'tradeoff'):
            require_text(v, key, errors, f'direction.alternatives[{i}]')
    variant_ids = [v.get('id') for v in variants if isinstance(v, dict)] if isinstance(variants, list) else []
    if direction.get('selected') not in variant_ids:
        errors.append('direction.selected must name a considered alternative')
    return errors

def completion_errors(root, folder):
    errors = plan_errors(root, folder)
    plan = obj(folder / 'plan-approval.json')
    if plan.get('plan_hash') != plan_hash(folder):
        errors.append('Plan changed: run plan-gate again and reassess implementation')
    build = obj(folder / 'build.json')
    current = fingerprint(root)['fingerprint']
    if build.get('fingerprint') != current:
        errors.append('Source changed after snapshot; recapture and review the current build')
    implementation = obj(folder / 'implementation.json')
    require_text(implementation, 'summary', errors, 'implementation')
    require_text(implementation, 'maker_agent_id', errors, 'implementation')
    evidence = obj(folder / 'evidence.json')
    attempt = obj(folder / 'capture-attempt.json')
    if attempt.get('status') != 'complete' or attempt.get('attempt_id') != evidence.get('attempt_id'):
        errors.append('Latest capture attempt did not complete; old evidence cannot pass')
    if evidence.get('fingerprint') != current:
        errors.append('Evidence is from a different source fingerprint')
    if evidence.get('run_id') != folder.name:
        errors.append('Evidence is from a different run')
    captures = evidence.get('captures', [])
    if not isinstance(captures, list) or not captures:
        errors.append('No screenshots captured')
        captures = []
    ids = set()
    widths = []
    states = set()
    for i, cap in enumerate(captures):
        label = f'evidence.captures[{i}]'
        if not isinstance(cap, dict):
            errors.append(f'{label}: object required')
            continue
        for key in ('id', 'route', 'final_url', 'state', 'fixture', 'captured_at'):
            require_text(cap, key, errors, label)
        if cap.get('id') in ids:
            errors.append(f'{label}: duplicate capture id')
        ids.add(cap.get('id'))
        states.add(cap.get('state'))
        viewport = cap.get('viewport', {})
        if not isinstance(viewport, dict):
            viewport = {}
        w, h = viewport.get('width', 0), viewport.get('height', 0)
        if not isinstance(w, int) or not isinstance(h, int) or w < 250 or h < 250:
            errors.append(f'{label}: invalid viewport')
        else:
            widths.append(w)
        p = verify_artifact(root, cap, errors, label)
        if p and p.is_file():
            try:
                iw, ih = image_size(p)
                if not p.read_bytes().startswith(b'\x89PNG\r\n\x1a\n'):
                    errors.append(f'{label}: app screenshot must be PNG')
                if iw != w or (ih < h if cap.get('full_page') else ih != h):
                    errors.append(f'{label}: actual image {iw}x{ih} does not match declared viewport {w}x{h}')
            except GateError as e:
                errors.append(f'{label}: {e}')
        if cap.get('assertions_passed') is not True:
            errors.append(f'{label}: required state assertions not passed')
        if cap.get('overflow_x') is True:
            errors.append(f'{label}: horizontal overflow detected')
    if not any(w <= 430 for w in widths) or not any(w >= 1024 for w in widths):
        errors.append('Evidence requires actual mobile and desktop viewports')
    brief = read(folder / 'brief.json')
    for state in brief.get('required_states', []):
        if state not in states:
            errors.append(f'Missing required captured state: {state}')
    if not (folder / 'checks.json').exists():
        errors.append('No executed checks recorded; use machine.py check')
        checks = {}
    else:
        checks = obj(folder / 'checks.json')
    for cid in brief.get('required_checks', []):
        check = checks.get(cid)
        if not isinstance(check, dict) or check.get('exit_code') != 0 or check.get('fingerprint') != current:
            errors.append(f'Check {cid}: missing, failing or stale')
        elif not check.get('argv'):
            errors.append(f'Check {cid}: missing executed command')
        else:
            verify_artifact(root, check, errors, f'check.{cid}')
    reviewers = []
    for kind in ('visual', 'qa'):
        review = obj(folder / f'{kind}-review.json')
        require_text(review, 'agent_id', errors, f'{kind}-review')
        if review.get('verdict') != 'pass':
            errors.append(f'{kind}-review: not passed')
        if review.get('fingerprint') != current or review.get('evidence_sha256') != sha(folder / 'evidence.json'):
            errors.append(f'{kind}-review: stale build or evidence')
        reviewed_ids = review.get('inspected_capture_ids', [])
        if not isinstance(reviewed_ids, list) or not set(ids).issubset(set(reviewed_ids)):
            errors.append(f'{kind}-review: not all captures inspected')
        if not isinstance(review.get('findings'), list):
            errors.append(f'{kind}-review.findings: list required')
        else:
            for finding in review['findings']:
                if not isinstance(finding, dict):
                    errors.append(f'{kind}-review.findings: objects required')
                    continue
                if finding.get('severity') in ('P0', 'P1') and finding.get('status') != 'resolved':
                    errors.append(f'{kind}-review: unresolved {finding.get("severity")} finding')
        if kind == 'visual':
            if review.get('pixel_inspection') is not True:
                errors.append('visual-review: actual image inspection not recorded')
            if review.get('independent_context') is not True:
                errors.append('visual-review: independent review context unavailable')
            for dimension in ('hierarchy', 'composition', 'typography', 'content', 'interaction_clarity', 'specificity'):
                rationale = review.get('rationale', {})
                require_text(rationale if isinstance(rationale, dict) else {}, dimension, errors, 'visual-review.rationale')
        else:
            for key in ('interaction_cases', 'limitations'):
                if not isinstance(review.get(key), list):
                    errors.append(f'qa-review.{key}: list required')
            if not review.get('interaction_cases'):
                errors.append('qa-review: interaction cases required')
            for case in review.get('interaction_cases', []) if isinstance(review.get('interaction_cases'), list) else []:
                if not isinstance(case, dict):
                    errors.append('qa-review.interaction_cases: objects required')
                    continue
                if case.get('result') != 'pass' or not nonempty(case.get('steps')) or not nonempty(case.get('observed')):
                    errors.append('qa-review: passing reproduction cases with observed results required')
        reviewers.append(review.get('agent_id'))
    if len(set(reviewers + [implementation.get('maker_agent_id')])) != 3:
        errors.append('Maker, visual reviewer and QA must have distinct recorded runtime agent IDs')
    return errors

def plan_hash(folder):
    return hashlib.sha256(b''.join((folder / p).read_bytes() for p in
                                  ('brief.json', 'references.json', 'direction.json'))).hexdigest()

def init(root):
    base = machine_dir(root)
    base.mkdir(parents=True, exist_ok=True)
    config = base / 'config.json'
    if not config.exists():
        dump(config, {'version': 1, 'hooks_enabled': True, 'notes':
                     'Hooks apply only to explicitly started runs; do not alter existing project settings.'})
    dest = base / 'contract.json'
    if not dest.exists():
        shutil.copyfile(PLUGIN / 'context/taplo-contract.json', dest)
    ignore = base / '.gitignore'
    if not ignore.exists():
        ignore.write_text('runs/\nactive.json\n*.tmp\n')
    return {'initialised': str(base), 'existing_settings_changed': False}

def start(root, args):
    init(root)
    ap = machine_dir(root) / 'active.json'
    if ap.exists():
        _, previous = active(root)
        if previous.get('status') not in ('complete', 'paused'):
            raise GateError('An active run already exists. Resume it, or pause it with an honest reason.')
    rid = dt.datetime.now(dt.timezone.utc).strftime('%Y%m%dT%H%M%S') + '-' + uuid.uuid4().hex[:6]
    folder = machine_dir(root) / 'runs' / rid
    state = {'run_id': rid, 'status': 'planning', 'created_at': now(), 'goal': args.goal}
    dump(folder / 'run.json', state)
    dump(folder / 'brief.json', {'goal': args.goal, 'surface': args.surface,
         'scope_kind': args.kind, 'primary_task': '', 'allowed_paths': args.scope,
         'constraints': [], 'contract_reconciled': False, 'acceptance': [],
         'required_states': [], 'required_checks': ['focused', 'build']})
    dump(folder / 'references.json', {'items': []})
    dump(folder / 'direction.json', {**{k: '' for k in ('thesis', 'hierarchy', 'layout', 'typography',
         'colour', 'interaction', 'mobile_behaviour', 'asset_strategy', 'selected')}, 'alternatives': []})
    dump(folder / 'implementation.json', {'summary': '', 'maker_agent_id': ''})
    review_base = {'agent_id': '', 'verdict': 'unable-to-assess', 'fingerprint': '',
                  'evidence_sha256': '', 'inspected_capture_ids': [], 'findings': []}
    dump(folder / 'visual-review.json', {**review_base, 'pixel_inspection': False, 'independent_context': False,
         'rationale': {k: '' for k in ('hierarchy', 'composition', 'typography', 'content', 'interaction_clarity', 'specificity')}})
    dump(folder / 'qa-review.json', {**review_base, 'interaction_cases': [], 'limitations': []})
    dump(folder / 'capture-spec.json', {'base_url': 'http://127.0.0.1:3000', 'cases': []})
    dump(ap, {'run_id': rid})
    record_event(folder, 'started')
    return {'run_id': rid, 'folder': str(folder), 'status': 'planning'}

def matches_scope(relative, patterns):
    return any(fnmatch.fnmatch(relative, p) or relative.startswith(p.rstrip('/') + '/') for p in patterns)

def _hook(payload):
    root = Path(payload.get('cwd', os.getcwd())).resolve()
    # Locate the project run even when a tool has cd'd into a subdirectory.
    for candidate in (root, *root.parents):
        if (machine_dir(candidate) / 'active.json').exists():
            root = candidate
            break
    if not (machine_dir(root) / 'active.json').exists():
        return {}
    config = obj(machine_dir(root) / 'config.json')
    if config.get('hooks_enabled') is False:
        return {}
    folder, state = active(root)
    if state.get('status') in ('paused', 'complete'):
        return {}
    event = payload.get('hook_event_name')
    if event == 'Stop':
        # Do not trap user interruptions or enter repeated Stop-hook loops.
        if payload.get('stop_hook_active'):
            return {}
        try:
            errors = completion_errors(root, folder)
        except GateError as e:
            errors = [str(e)]
        if errors:
            return {'decision': 'block', 'reason': 'Taplo run is incomplete: ' + '; '.join(errors[:5]) +
                    '. Continue the work, or pause the run with a specific limitation and report it honestly. '
                    'User instructions to stop take precedence.'}
    if event == 'PreToolUse' and payload.get('tool_name') in ('Write', 'Edit', 'MultiEdit'):
        value = payload.get('tool_input', {}).get('file_path')
        if not value:
            return {}
        p = Path(value)
        if not p.is_absolute():
            p = Path(payload.get('cwd', str(root))) / p
        p = p.resolve()
        if not p.is_relative_to(root):
            return {}
        relative = p.relative_to(root).as_posix()
        brief = obj(folder / 'brief.json')
        if matches_scope(relative, brief.get('allowed_paths', [])):
            errors = []
            try:
                errors = plan_errors(root, folder)
                approval = read(folder / 'plan-approval.json')
                if approval.get('plan_hash') != plan_hash(folder):
                    errors.append('Plan changed after plan-gate')
            except GateError as e:
                errors.append(str(e))
            if errors:
                return {'hookSpecificOutput': {'hookEventName': 'PreToolUse', 'permissionDecision': 'deny',
                        'permissionDecisionReason': 'Taplo planning gate: ' + '; '.join(errors[:3]) +
                        '. Complete brief/references/direction, then run plan-gate. This gate is not a request for owner approval.'}}
    return {}

def hook(payload):
    """Turn malformed active-run artifacts into a useful host gate response."""
    try:
        return _hook(payload)
    except (GateError, ValueError, KeyError, TypeError, AttributeError, OSError) as e:
        reason = f'Taplo run artifacts are invalid: {e}. Repair them or pause the run; do not claim a pass.'
        if payload.get('hook_event_name') == 'Stop' and not payload.get('stop_hook_active'):
            return {'decision': 'block', 'reason': reason}
        if payload.get('hook_event_name') == 'PreToolUse':
            return {'hookSpecificOutput': {'hookEventName': 'PreToolUse', 'permissionDecision': 'deny',
                                           'permissionDecisionReason': reason}}
        return {}

def doctor(root):
    return {'python': sys.version.split()[0], 'node': shutil.which('node'),
        'claude': shutil.which('claude'), 'git': shutil.which('git'),
        'playwright_cli': shutil.which('playwright-cli'), 'project_package_json': (root / 'package.json').exists(),
        'plugin_root': str(PLUGIN), 'active_run': (machine_dir(root) / 'active.json').exists(),
        'runtime_probes_required': ['actual separate Agent tool call', 'actual screenshot opened by reviewer',
            'local browser route and viewport resize', 'configured connectors exact operation'],
        'note': 'Executable presence is not a passed runtime capability test. No dependencies installed.'}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', default=os.getcwd())
    sub = parser.add_subparsers(dest='command', required=True)
    for c in ('init', 'doctor', 'status', 'fingerprint', 'snapshot', 'plan-gate', 'gate', 'complete', 'hook'):
        sub.add_parser(c)
    p = sub.add_parser('start')
    p.add_argument('--goal', required=True)
    p.add_argument('--surface', choices=['marketing', 'public-page', 'onboarding', 'studio', 'shared-system'], required=True)
    p.add_argument('--kind', choices=['redesign', 'refinement', 'bugfix'], default='refinement')
    p.add_argument('--scope', nargs='+', required=True)
    p = sub.add_parser('pause')
    p.add_argument('--reason', required=True)
    p = sub.add_parser('check')
    p.add_argument('--id', required=True)
    p.add_argument('--timeout', type=int, default=600)
    p.add_argument('argv', nargs=argparse.REMAINDER)
    args = parser.parse_args()
    root = Path(args.root).resolve()
    try:
        if args.command == 'hook':
            print(json.dumps(hook(json.load(sys.stdin))))
            return 0
        if args.command == 'doctor':
            result = doctor(root)
        elif args.command == 'init':
            result = init(root)
        elif args.command == 'start':
            result = start(root, args)
        elif args.command == 'fingerprint':
            result = fingerprint(root)
        else:
            folder, state = active(root)
            if args.command == 'status':
                result = {'run': state, 'folder': str(folder), 'files': sorted(p.name for p in folder.iterdir())}
            elif args.command == 'pause':
                if not nonempty(args.reason):
                    raise GateError('A substantive reason is required')
                state.update(status='paused', pause_reason=args.reason)
                dump(folder / 'run.json', state)
                record_event(folder, 'paused', reason=args.reason)
                result = state
            elif args.command == 'snapshot':
                result = {**fingerprint(root), 'run_id': folder.name, 'captured_at': now(),
                          'git_commit': (git(root, 'rev-parse', 'HEAD') or b'').decode().strip() or None}
                dump(folder / 'build.json', result)
                record_event(folder, 'snapshot', fingerprint=result['fingerprint'])
            elif args.command == 'plan-gate':
                errors = plan_errors(root, folder)
                if errors:
                    raise GateError('\n'.join(errors))
                result = {'plan_hash': plan_hash(folder), 'time': now(), 'meaning': 'machine workflow gate, not owner approval'}
                dump(folder / 'plan-approval.json', result)
                state['status'] = 'implementing'
                dump(folder / 'run.json', state)
                record_event(folder, 'plan-gate-passed')
            elif args.command in ('gate', 'complete'):
                errors = completion_errors(root, folder)
                if errors:
                    raise GateError('\n'.join(errors))
                result = {'passed': True, 'run_id': folder.name, 'fingerprint': fingerprint(root)['fingerprint'],
                          'limit': 'Artifact integrity and declared review evidence checked; aesthetic truth and reviewer identity are not cryptographically verified.'}
                if args.command == 'complete':
                    state.update(status='complete', completed_at=now())
                    dump(folder / 'run.json', state)
                    record_event(folder, 'completed')
            elif args.command == 'check':
                if not re.fullmatch(r'[a-zA-Z0-9_-]{1,80}', args.id):
                    raise GateError('Check id must contain letters/numbers/_/- only')
                command = args.argv[1:] if args.argv[:1] == ['--'] else args.argv
                if not command:
                    raise GateError('Supply an executable command after --')
                if args.timeout < 1 or args.timeout > 3600:
                    raise GateError('Timeout must be 1–3600 seconds')
                before = fingerprint(root)['fingerprint']
                path = folder / 'checks' / (args.id + '.log')
                path.parent.mkdir(exist_ok=True)
                with path.open('wb') as output:
                    try:
                        p = subprocess.Popen(command, cwd=root, stdout=output, stderr=subprocess.STDOUT,
                                             start_new_session=(os.name == 'posix'))
                        try:
                            code = p.wait(timeout=args.timeout)
                        except subprocess.TimeoutExpired:
                            if os.name == 'posix':
                                os.killpg(p.pid, signal.SIGKILL)
                            else:
                                p.kill()
                            p.wait()
                            code = 124
                            output.write(b'\nCheck timed out; result is incomplete.\n')
                    except subprocess.TimeoutExpired:
                        code = 124
                        output.write(b'\nCheck timed out; result is incomplete.\n')
                    except OSError as e:
                        code = 127
                        output.write(str(e).encode())
                after = fingerprint(root)['fingerprint']
                result = {'argv': command, 'exit_code': code, 'fingerprint': before,
                          'source_stable': before == after, 'finished_at': now(),
                          'path': path.relative_to(root).as_posix(), 'sha256': sha(path)}
                if before != after:
                    result['exit_code'] = 125
                checks = read(folder / 'checks.json') if (folder / 'checks.json').exists() else {}
                checks[args.id] = result
                dump(folder / 'checks.json', checks)
                print(json.dumps(result, indent=2))
                return 0 if result['exit_code'] == 0 else 1
        print(json.dumps(result, indent=2))
        return 0
    except (GateError, ValueError, KeyError, TypeError, AttributeError, OSError) as e:
        print(json.dumps({'passed': False, 'error': str(e)}), file=sys.stderr)
        return 1

if __name__ == '__main__':
    raise SystemExit(main())
