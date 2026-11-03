#!/usr/bin/env node
// Uses the target project's existing Playwright. Installs nothing.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const plugin = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
function argument(name, fallback) {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : fallback;
}
const root = path.resolve(argument('--root', process.cwd()));
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const confined = rel => {
  const p = path.resolve(root, rel);
  if (p !== root && !p.startsWith(root + path.sep)) throw new Error('Path leaves project');
  const real = fs.existsSync(p) ? fs.realpathSync(p) : p;
  if (real !== root && !real.startsWith(root + path.sep)) throw new Error('Symlink leaves project');
  return p;
};
const active = read(path.join(root, '.taplo-machine/active.json'));
if (!/^[a-zA-Z0-9_-]{1,100}$/.test(active.run_id)) throw new Error('Invalid run id');
const folder = path.join(root, '.taplo-machine/runs', active.run_id);
const attemptId = crypto.randomUUID();
const attemptPath = path.join(folder, 'capture-attempt.json');
const setAttempt = (status, detail = {}) => {
  fs.writeFileSync(attemptPath + '.tmp', JSON.stringify({attempt_id:attemptId, status, time:new Date().toISOString(), ...detail}, null, 2) + '\n');
  fs.renameSync(attemptPath + '.tmp', attemptPath);
};
setAttempt('running');
try {
const spec = read(argument('--spec', path.join(folder, 'capture-spec.json')));
if (!Array.isArray(spec.cases) || !spec.cases.length) throw new Error('No capture cases');
const base = new URL(spec.base_url);
if (!['http:', 'https:'].includes(base.protocol)) throw new Error('http(s) base_url required');
const local = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname);
let servedIdentity = null;
if (spec.runtime_identity) {
  const identityUrl = new URL(spec.runtime_identity.path, base);
  if (identityUrl.origin !== base.origin) throw new Error('Identity endpoint must share application origin');
  const response = await fetch(identityUrl, {signal:AbortSignal.timeout(10000), redirect:'error'});
  if (!response.ok) throw new Error('Runtime identity endpoint failed');
  servedIdentity = await response.json();
}
if (!local && !servedIdentity) throw new Error('Remote capture requires runtime_identity endpoint with current source fingerprint; do not label an unknown deployment as current source');
const req = createRequire(path.join(root, 'package.json'));
let playwright;
for (const name of ['playwright', '@playwright/test', 'playwright-core']) {
  try { playwright = req(name); break; } catch { /* try existing alternatives */ }
}
if (!playwright?.chromium) throw new Error('No project Playwright package. Configure the existing browser tool; no install attempted.');
const py = argument('--python', 'python3');
const machine = (...args) => readJSON(execFileSync(py, [path.join(plugin, 'scripts/machine.py'), '--root', root, ...args], {encoding:'utf8'}));
function readJSON(s) { return JSON.parse(s); }
const build = machine('snapshot');
if (servedIdentity && servedIdentity.fingerprint !== build.fingerprint) throw new Error('Served build identity does not match current source');
const browser = await playwright.chromium.launch({headless:true});
const captures = [];
const ids = new Set();
try {
  for (const item of spec.cases) {
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(item.id) || ids.has(item.id)) throw new Error('Capture ids must be unique and path-safe');
    ids.add(item.id);
    if (!item.state || !item.fixture || !Array.isArray(item.expected_text) || !item.expected_text.length) throw new Error(`${item.id}: state, fixture and expected_text required`);
    const viewport = item.viewport;
    if (!Number.isInteger(viewport?.width) || !Number.isInteger(viewport?.height) || viewport.width < 250 || viewport.height < 250) throw new Error('Invalid viewport');
    const url = new URL(item.path, base);
    if (url.origin !== base.origin) throw new Error('Capture path must stay on configured origin');
    const context = await browser.newContext({viewport, deviceScaleFactor:1, reducedMotion:'reduce',
      ...(item.storage_state ? {storageState:confined(item.storage_state)} : {})});
    if (item.local_storage) {
      await context.addInitScript(({origin, entries}) => {
        if (location.origin === origin) for (const [k,v] of Object.entries(entries)) localStorage.setItem(k, String(v));
      }, {origin:base.origin, entries:item.local_storage});
    }
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    try {
      const response = await page.goto(url.href, {waitUntil:'domcontentloaded', timeout:30000});
      if (!response || response.status() >= 400) throw new Error(`${item.id}: HTTP ${response?.status()}`);
      for (const action of item.actions || []) {
        let locator;
        if (action.test_id) locator = page.getByTestId(action.test_id);
        else if (action.role && action.name) locator = page.getByRole(action.role, {name:action.name, exact:true});
        else if (action.text) locator = page.getByText(action.text, {exact:true});
        else throw new Error('Actions require test_id, role+name, or exact text');
        switch (action.type) {
          case 'click': await locator.click(); break;
          case 'fill': await locator.fill(String(action.value)); break;
          case 'press': await locator.press(String(action.key)); break;
          case 'select': await locator.selectOption(String(action.value)); break;
          case 'visible': await locator.waitFor({state:'visible'}); break;
          default: throw new Error('Unsupported action type: ' + action.type);
        }
      }
      for (const text of item.expected_text) await page.getByText(text, {exact:false}).first().waitFor({state:'visible', timeout:10000});
      await page.evaluate(() => document.fonts.ready);
      // Two paint frames allow a synchronous layout update; no fake loading delay.
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      const target = path.join(folder, 'captures', attemptId, item.id + '.png');
      fs.mkdirSync(path.dirname(target), {recursive:true});
      await page.screenshot({path:target, fullPage:true, animations:'disabled'});
      captures.push({id:item.id, route:item.path, final_url:page.url(), state:item.state, fixture:item.fixture,
        viewport, path:path.relative(root,target).split(path.sep).join('/'), sha256:hash(target),
        full_page:true, captured_at:new Date().toISOString(), assertions_passed:true,
        overflow_x:overflow, page_errors:errors, reduced_motion:true, expected_text:item.expected_text});
      if (errors.length) throw new Error(`${item.id}: browser page errors: ${errors.join('; ')}`);
    } finally { await context.close(); }
  }
  const after = machine('fingerprint');
  if (after.fingerprint !== build.fingerprint) throw new Error('Source changed during captures; discard and recapture');
  const evidence = {version:1, run_id:active.run_id, attempt_id:attemptId, fingerprint:build.fingerprint,
    runtime_identity:servedIdentity, source_correspondence:servedIdentity ? 'served identity matched' : 'local source stable; reviewer must verify dev server is current',
    captured_at:new Date().toISOString(), engine:'playwright-chromium', emulation_limit:'Not a real iPhone/Android or virtual-keyboard test', captures};
  const dest = path.join(folder,'evidence.json');
  fs.writeFileSync(dest+'.tmp',JSON.stringify(evidence,null,2)+'\n');
  fs.renameSync(dest+'.tmp',dest);
  setAttempt('complete', {fingerprint:build.fingerprint});
  console.log(JSON.stringify({evidence:dest, captures:captures.length, fingerprint:build.fingerprint},null,2));
} finally { await browser.close(); }
} catch (error) {
  setAttempt('failed', {error:String(error.message || error)});
  console.error(JSON.stringify({passed:false, error:String(error.message || error)}));
  process.exitCode = 1;
}
