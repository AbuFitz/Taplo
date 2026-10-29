#!/usr/bin/env python3
"""Install this external Claude Code package into a project, preserving settings.

Does not install Codex personal skills, launch Claude, download dependencies,
start builds, or edit application files. Refuses conflicting file overwrites.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import os
from pathlib import Path
import tempfile

SOURCE = Path(__file__).resolve().parents[1]

def digest(data):
    return hashlib.sha256(data).hexdigest()

def atomic(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as f:
        temp = Path(f.name)
        f.write(data)
    os.replace(temp, path)

def install(project, dry_run=False):
    project = project.resolve()
    if not project.is_dir():
        raise ValueError('Project directory must already exist')
    dest = project / '.claude/taplo-machine'
    if SOURCE == dest or SOURCE.is_relative_to(dest):
        raise ValueError('Run installer from the unpacked package, not its installed mirror')
    prior_path = dest / 'install-manifest.json'
    prior = json.loads(prior_path.read_text()) if prior_path.exists() else {'files': {}}
    planned = {}
    for p in sorted(SOURCE.rglob('*')):
        rel = p.relative_to(SOURCE)
        if any(s in ('.git', '__pycache__', '.test-artifacts') for s in rel.parts) or p.is_symlink() or not p.is_file():
            continue
        if p.suffix in ('.zip', '.pyc') or p.name == 'install-manifest.json':
            continue
        planned[dest / rel] = p.read_bytes()
    replacement = '${CLAUDE_PROJECT_DIR}/.claude/taplo-machine'
    for p in sorted((SOURCE / 'skills').glob('*/SKILL.md')):
        skill = p.parent.name
        text = p.read_text().replace('${CLAUDE_PLUGIN_ROOT}', replacement)
        # Project installation uses its explicit taplo- prefix; plugin install is namespaced.
        text = text.replace('\nname: ' + skill + '\n', '\nname: taplo-' + skill + '\n', 1)
        planned[project / '.claude/skills' / ('taplo-' + skill) / 'SKILL.md'] = text.encode()
    for p in sorted((SOURCE / 'agents').glob('*.md')):
        planned[project / '.claude/agents' / p.name] = p.read_bytes()
    conflicts = []
    for p, data in planned.items():
        if not p.resolve().is_relative_to(project) or p.is_symlink():
            conflicts.append(str(p))
        elif p.exists() and p.read_bytes() != data:
            rel = p.relative_to(project).as_posix()
            if digest(p.read_bytes()) != prior.get('files', {}).get(rel):
                conflicts.append(str(p))
    if conflicts:
        raise ValueError('Existing files differ and are not unmodified files from an earlier installation. Nothing written: ' + ', '.join(conflicts))
    settings_path = project / '.claude/settings.json'
    if not settings_path.resolve().is_relative_to(project) or settings_path.is_symlink():
        raise ValueError('Refusing to replace symlinked project settings')
    settings = json.loads(settings_path.read_text()) if settings_path.exists() else {}
    if not isinstance(settings, dict):
        raise ValueError('Project settings must be a JSON object')
    hooks = json.loads((SOURCE / 'hooks/hooks.json').read_text())['hooks']
    configured = settings.setdefault('hooks', {})
    if not isinstance(configured, dict):
        raise ValueError('Existing settings.hooks must be an object')
    for event, groups in hooks.items():
        target = configured.setdefault(event, [])
        if not isinstance(target, list):
            raise ValueError(f'Existing hooks.{event} must be an array')
        for group in groups:
            group = json.loads(json.dumps(group).replace('${CLAUDE_PLUGIN_ROOT}', replacement))
            if group not in target:
                target.append(group)
    result = {'installed': not dry_run, 'dry_run': dry_run, 'project': str(project),
              'file_count': len(planned), 'commands': ['/taplo-doctor', '/taplo-build', '/taplo-review', '/taplo-status'],
              'hooks_disabled_by_existing_setting': settings.get('disableAllHooks') is True,
              'next': 'Reload/start Claude in this project and run /taplo-doctor. No application build has started.'}
    if dry_run:
        return result
    # All conflict/schema checks finish before the first write.
    for p, data in planned.items():
        atomic(p, data)
    atomic(settings_path, (json.dumps(settings, indent=2) + '\n').encode())
    manifest = {'version': 1, 'files': {p.relative_to(project).as_posix(): digest(data) for p, data in planned.items()}}
    atomic(prior_path, (json.dumps(manifest, indent=2) + '\n').encode())
    return result

if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--project', required=True, type=Path)
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()
    try:
        print(json.dumps(install(args.project, args.dry_run), indent=2))
    except (ValueError, OSError) as e:
        print(json.dumps({'installed':False, 'error':str(e)}))
        raise SystemExit(1)
