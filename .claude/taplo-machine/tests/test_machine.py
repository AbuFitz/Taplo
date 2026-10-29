"""Isolated synthetic fixtures: these tests do not verify Taplo UI or aesthetics."""
import argparse
import copy
import importlib.util
import json
import shutil
from pathlib import Path
import struct
import subprocess
import sys
import tempfile
import unittest
import zlib

BASE = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('machine', BASE / 'scripts/machine.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
spec2 = importlib.util.spec_from_file_location('installer', BASE / 'scripts/install.py')
installer = importlib.util.module_from_spec(spec2)
spec2.loader.exec_module(installer)

def png(path, width=390, height=844):
    def chunk(tag, body):
        return struct.pack('>I', len(body)) + tag + body + struct.pack('>I', zlib.crc32(tag+body) & 0xffffffff)
    raw = (b'\0' + b'\xff\xff\xff' * width) * height
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', width,height,8,2,0,0,0)) + chunk(b'IDAT',zlib.compress(raw)) + chunk(b'IEND',b''))

class MachineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root/'src').mkdir()
        (self.root/'src/page.tsx').write_text('original source\n')
        m.start(self.root, argparse.Namespace(goal='Improve the setup screen', surface='onboarding', kind='refinement', scope=['src/**']))
        self.folder, self.state = m.active(self.root)

    def valid_plan(self):
        brief = m.read(self.folder/'brief.json')
        brief.update(primary_task='Choose a look and see the result', contract_reconciled=True,
                     constraints=['Account creation remains at the end'], acceptance=['A selection updates the real preview'],
                     required_states=['identity/no-assets'], required_checks=['focused'])
        m.dump(self.folder/'brief.json',brief)
        refs=[]
        for i in range(2):
            p=self.folder/f'ref-{i}.png';png(p)
            refs.append({'id':f'ref-{i}','url':f'https://reference.test/{i}', 'principle':'Clear primary action',
                         'adaptation':'Preview responds beside the relevant control', 'rejected_trait':'Mandatory signup before showing value',
                         'observed_state':'First setup step', 'path':p.relative_to(self.root).as_posix(),
                         'sha256':m.sha(p),'inspected_pixels':True})
        m.dump(self.folder/'references.json',{'items':refs})
        direction={k:'A concrete design decision' for k in ('thesis','hierarchy','layout','typography','colour','interaction','mobile_behaviour','asset_strategy')}
        direction.update(selected='a', alternatives=[{'id':'a','composition':'Preview above movable sheet','tradeoff':'Less simultaneous form space'}])
        m.dump(self.folder/'direction.json',direction)
        m.dump(self.folder/'plan-approval.json',{'plan_hash':m.plan_hash(self.folder)})

    def valid_completion(self):
        self.valid_plan()
        fp=m.fingerprint(self.root)['fingerprint']
        m.dump(self.folder/'build.json',{'fingerprint':fp})
        m.dump(self.folder/'implementation.json',{'summary':'Implemented the setup controls','maker_agent_id':'test-maker'})
        caps=[]
        for name,w,h in [('mobile',390,844),('desktop',1440,1000)]:
            p=self.folder/f'{name}.png';png(p,w,h)
            caps.append({'id':name,'route':'/onboarding','final_url':'http://localhost:3000/onboarding',
                         'state':'identity/no-assets','fixture':'unit-fixture','captured_at':m.now(),
                         'viewport':{'width':w,'height':h},'path':p.relative_to(self.root).as_posix(),
                         'sha256':m.sha(p),'assertions_passed':True,'overflow_x':False,'full_page':False})
        m.dump(self.folder/'capture-attempt.json',{'status':'complete','attempt_id':'fixture-attempt'})
        m.dump(self.folder/'evidence.json',{'run_id':self.folder.name,'attempt_id':'fixture-attempt','fingerprint':fp,'captures':caps})
        log=self.folder/'check.log';log.write_text('unit-fixture check log')
        m.dump(self.folder/'checks.json',{'focused':{'argv':[sys.executable,'fixture.py'],'exit_code':0,'fingerprint':fp,
               'path':log.relative_to(self.root).as_posix(),'sha256':m.sha(log)}})
        common={'verdict':'pass','fingerprint':fp,'evidence_sha256':m.sha(self.folder/'evidence.json'),
                'inspected_capture_ids':['mobile','desktop'],'findings':[]}
        visual=copy.deepcopy(common)
        visual.update(agent_id='test-visual',pixel_inspection=True,independent_context=True,
                      rationale={k:'Specific unit fixture rationale' for k in ('hierarchy','composition','typography','content','interaction_clarity','specificity')})
        qa=copy.deepcopy(common)
        qa.update(agent_id='test-qa',limitations=['Synthetic fixture only'],interaction_cases=[{'steps':'Select look and refresh', 'observed':'Selected look persists','result':'pass'}])
        m.dump(self.folder/'visual-review.json',visual);m.dump(self.folder/'qa-review.json',qa)

    def change(self,name,fn):
        p=self.folder/name;value=m.read(p);fn(value);m.dump(p,value)

    def test_plan_rejects_empty_templates(self):
        self.assertTrue(m.plan_errors(self.root,self.folder))

    def test_plan_accepts_complete_plan(self):
        self.valid_plan();self.assertEqual(m.plan_errors(self.root,self.folder),[])

    def test_redesign_requires_three_structural_alternatives(self):
        self.valid_plan();self.change('brief.json',lambda d:d.update(scope_kind='redesign'))
        self.assertTrue(any('three' in x for x in m.plan_errors(self.root,self.folder)))

    def test_non_image_reference_rejected(self):
        self.valid_plan();p=self.folder/'ref-0.png';p.write_text('not a photograph')
        self.change('references.json',lambda d:d['items'][0].update(sha256=m.sha(p)))
        self.assertTrue(any('PNG or JPEG' in x for x in m.plan_errors(self.root,self.folder)))

    def test_null_reference_is_structured_failure(self):
        self.valid_plan();m.dump(self.folder/'references.json',{'items':[None,None]})
        self.assertTrue(any('object required' in x for x in m.plan_errors(self.root,self.folder)))

    def test_reference_changed_rejected(self):
        self.valid_plan();png(self.folder/'ref-0.png',400,844)
        self.assertTrue(any('changed artifact' in x for x in m.plan_errors(self.root,self.folder)))

    def test_reference_escape_rejected(self):
        self.valid_plan();self.change('references.json',lambda d:d['items'][0].update(path='../outside.png'))
        self.assertTrue(any('invalid artifact' in x for x in m.plan_errors(self.root,self.folder)))

    def test_blanket_scope_rejected(self):
        self.valid_plan();self.change('brief.json',lambda d:d.update(allowed_paths=['**/*']))
        self.assertTrue(any('bounded' in x for x in m.plan_errors(self.root,self.folder)))

    def test_completion_passes_valid_fixture(self):
        self.valid_completion();self.assertEqual(m.completion_errors(self.root,self.folder),[])

    def test_source_edit_stales_reviews(self):
        self.valid_completion();(self.root/'src/page.tsx').write_text('changed source')
        self.assertTrue(any('Source changed' in x for x in m.completion_errors(self.root,self.folder)))

    def test_changed_plan_stales_approval(self):
        self.valid_completion();self.change('direction.json',lambda d:d.update(layout='Another composition'))
        self.assertTrue(any('Plan changed' in x for x in m.completion_errors(self.root,self.folder)))

    def test_evidence_changed_stales_review(self):
        self.valid_completion();self.change('evidence.json',lambda d:d.update(extra='changed'))
        self.assertTrue(any('stale build or evidence' in x for x in m.completion_errors(self.root,self.folder)))

    def test_failed_latest_capture_invalidates_old_evidence(self):
        self.valid_completion();m.dump(self.folder/'capture-attempt.json',{'status':'failed','attempt_id':'new'})
        self.assertTrue(any('Latest capture' in x for x in m.completion_errors(self.root,self.folder)))

    def test_declared_mobile_must_match_image_pixels(self):
        self.valid_completion();p=self.folder/'mobile.png';png(p,1440,1000)
        self.change('evidence.json',lambda d:d['captures'][0].update(sha256=m.sha(p)))
        self.assertTrue(any('actual image' in x for x in m.completion_errors(self.root,self.folder)))

    def test_fake_png_signature_rejected(self):
        p=self.folder/'fake.png';p.write_bytes(b'\x89PNG\r\n\x1a\n')
        with self.assertRaises(m.GateError):m.image_size(p)

    def test_corrupt_png_crc_rejected(self):
        p=self.folder/'bad.png';png(p);data=bytearray(p.read_bytes());data[30]^=1;p.write_bytes(data)
        with self.assertRaises(m.GateError):m.image_size(p)

    def test_required_state_missing(self):
        self.valid_completion();self.change('brief.json',lambda d:d.update(required_states=['keyboard-open']))
        self.assertTrue(any('Missing required captured state' in x for x in m.completion_errors(self.root,self.folder)))

    def test_horizontal_overflow_rejected(self):
        self.valid_completion();self.change('evidence.json',lambda d:d['captures'][0].update(overflow_x=True))
        self.assertTrue(any('horizontal overflow' in x for x in m.completion_errors(self.root,self.folder)))

    def test_failed_check_rejected(self):
        self.valid_completion();self.change('checks.json',lambda d:d['focused'].update(exit_code=1))
        self.assertTrue(any('Check focused' in x for x in m.completion_errors(self.root,self.folder)))

    def test_changed_test_log_rejected(self):
        self.valid_completion();(self.folder/'check.log').write_text('edited result')
        self.assertTrue(any('changed artifact' in x for x in m.completion_errors(self.root,self.folder)))

    def test_same_maker_reviewer_rejected(self):
        self.valid_completion();self.change('visual-review.json',lambda d:d.update(agent_id='test-maker'))
        self.assertTrue(any('distinct' in x for x in m.completion_errors(self.root,self.folder)))

    def test_unseen_image_cannot_pass(self):
        self.valid_completion();self.change('visual-review.json',lambda d:d.update(pixel_inspection=False))
        self.assertTrue(any('image inspection' in x for x in m.completion_errors(self.root,self.folder)))

    def test_unresolved_major_finding_rejected(self):
        self.valid_completion();self.change('visual-review.json',lambda d:d.update(findings=[{'severity':'P1','status':'open'}]))
        self.assertTrue(any('unresolved P1' in x for x in m.completion_errors(self.root,self.folder)))

    def test_no_real_interaction_record_cannot_pass_qa(self):
        self.valid_completion();self.change('qa-review.json',lambda d:d.update(interaction_cases=[]))
        self.assertTrue(any('interaction cases required' in x for x in m.completion_errors(self.root,self.folder)))

    def test_hook_blocks_scoped_edits_before_plan(self):
        r=m.hook({'cwd':str(self.root),'hook_event_name':'PreToolUse','tool_name':'Edit','tool_input':{'file_path':'src/page.tsx'}})
        self.assertEqual(r['hookSpecificOutput']['permissionDecision'],'deny')

    def test_hook_allows_plan_artifact_writes(self):
        self.assertEqual(m.hook({'cwd':str(self.root),'hook_event_name':'PreToolUse','tool_name':'Write','tool_input':{'file_path':str(self.folder/'brief.json')}}),{})

    def test_hook_allows_scoped_edit_after_plan(self):
        self.valid_plan();self.assertEqual(m.hook({'cwd':str(self.root),'hook_event_name':'PreToolUse','tool_name':'Edit','tool_input':{'file_path':'src/page.tsx'}}),{})

    def test_malformed_json_stops_with_useful_hook_reason(self):
        (self.folder/'brief.json').write_text('{bad')
        r=m.hook({'cwd':str(self.root),'hook_event_name':'PreToolUse','tool_name':'Edit','tool_input':{'file_path':'src/page.tsx'}})
        self.assertEqual(r['hookSpecificOutput']['permissionDecision'],'deny')

    def test_stop_blocks_missing_gate_once(self):
        self.assertEqual(m.hook({'cwd':str(self.root),'hook_event_name':'Stop'}).get('decision'),'block')
        self.assertEqual(m.hook({'cwd':str(self.root),'hook_event_name':'Stop','stop_hook_active':True}),{})

    def test_paused_run_does_not_trap_user(self):
        state=m.read(self.folder/'run.json');state['status']='paused';m.dump(self.folder/'run.json',state)
        self.assertEqual(m.hook({'cwd':str(self.root),'hook_event_name':'Stop'}),{})

    def test_no_active_run_is_noop(self):
        (self.root/'.taplo-machine/active.json').unlink()
        self.assertEqual(m.hook({'cwd':str(self.root),'hook_event_name':'Stop'}),{})

    def test_generated_files_do_not_stale_fingerprint(self):
        before=m.fingerprint(self.root)
        p=self.root/'node_modules/generated.js';p.parent.mkdir();p.write_text('generated')
        self.assertEqual(m.fingerprint(self.root),before)

    def test_actual_check_command_and_failed_exit_recorded(self):
        p=subprocess.run([sys.executable,str(BASE/'scripts/machine.py'),'--root',str(self.root),'check','--id','focused','--',sys.executable,'-c','print("ran fixture"); raise SystemExit(3)'],capture_output=True,text=True)
        self.assertEqual(p.returncode,1)
        result=m.read(self.folder/'checks.json')['focused']
        self.assertEqual(result['exit_code'],3)
        self.assertIn('ran fixture',m.inside(self.root,result['path']).read_text())

    def test_actual_check_timeout_recorded_incomplete(self):
        p=subprocess.run([sys.executable,str(BASE/'scripts/machine.py'),'--root',str(self.root),'check','--id','focused','--timeout','1','--',sys.executable,'-c','import time; time.sleep(8)'],capture_output=True,text=True)
        self.assertEqual(p.returncode,1)
        self.assertEqual(m.read(self.folder/'checks.json')['focused']['exit_code'],124)

    @unittest.skipUnless(shutil.which('node'),'Node unavailable')
    def test_failed_capture_attempt_invalidates_prior_success(self):
        self.valid_completion()
        m.dump(self.folder/'capture-spec.json',{'base_url':'http://127.0.0.1:1','cases':[]})
        p=subprocess.run(['node',str(BASE/'scripts/capture.mjs'),'--root',str(self.root)],capture_output=True,text=True)
        self.assertNotEqual(p.returncode,0)
        attempt=m.read(self.folder/'capture-attempt.json')
        self.assertEqual(attempt['status'],'failed')
        self.assertTrue(any('Latest capture' in x for x in m.completion_errors(self.root,self.folder)))

class InstallerTests(unittest.TestCase):
    def setUp(self):
        self.t=tempfile.TemporaryDirectory();self.addCleanup(self.t.cleanup);self.root=Path(self.t.name)

    def test_install_preserves_settings_and_existing_hooks(self):
        p=self.root/'.claude/settings.json';p.parent.mkdir();p.write_text(json.dumps({'permissions':{'deny':['Bash(rm *)']},'hooks':{'Stop':[{'hooks':[{'type':'command','command':'existing-check'}]}]}}))
        installer.install(self.root)
        result=json.loads(p.read_text())
        self.assertEqual(result['permissions']['deny'],['Bash(rm *)'])
        self.assertEqual(len(result['hooks']['Stop']),2)
        self.assertTrue((self.root/'.claude/skills/taplo-build/SKILL.md').exists())

    def test_install_idempotent(self):
        installer.install(self.root);installer.install(self.root)
        settings=m.read(self.root/'.claude/settings.json')
        self.assertEqual(len(settings['hooks']['Stop']),1)

    def test_install_refuses_user_modified_agent(self):
        installer.install(self.root)
        agent=next((self.root/'.claude/agents').glob('*.md'));agent.write_text('my customised agent')
        with self.assertRaises(ValueError):installer.install(self.root)
        self.assertEqual(agent.read_text(),'my customised agent')

    def test_dry_run_does_not_write(self):
        installer.install(self.root,True)
        self.assertFalse((self.root/'.claude').exists())

    def test_installed_skill_has_portable_project_path(self):
        installer.install(self.root)
        text=(self.root/'.claude/skills/taplo-build/SKILL.md').read_text()
        self.assertNotIn('${CLAUDE_PLUGIN_ROOT}',text)
        self.assertIn('${CLAUDE_PROJECT_DIR}/.claude/taplo-machine',text)
        self.assertIn('name: taplo-build',text)

    def test_installed_doctor_has_bundled_tests(self):
        installer.install(self.root)
        self.assertTrue((self.root/'.claude/taplo-machine/tests/test_machine.py').is_file())

    def test_install_refuses_symlinked_configuration_directory(self):
        other=tempfile.TemporaryDirectory();self.addCleanup(other.cleanup)
        (self.root/'.claude').symlink_to(other.name,target_is_directory=True)
        with self.assertRaises(ValueError):installer.install(self.root)
        self.assertEqual(list(Path(other.name).iterdir()),[])

if __name__=='__main__':unittest.main(verbosity=2)
