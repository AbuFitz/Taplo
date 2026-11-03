// Captures a|b|c x type|name at 390x844 (@2x), audits text <14px (outside the page miniature), buttons <44px, clipped labels,
// and sheet/body overflow, then builds contact.png. Run: node /home/user/taplo/docs/team/form/alt/capture.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const D = __dirname + '/';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const report = {};
  for (const v of ['a', 'b', 'c']) for (const s of ['type', 'name']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await p.goto(`file://${D}${v}.html#${s}`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}${v}-${s}-390.png` });
    report[`${v}-${s}`] = await p.evaluate(() => {
      const o = { small: [], tap: [], clip: [] };
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || el.closest('.pg,svg')) return;
        const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (own && fs < 14) o.small.push(el.textContent.trim().slice(0, 24) + ' ' + fs);
        if (el.matches('button') && (r.width < 44 || r.height < 44)) o.tap.push(el.textContent.trim().slice(0, 24) + ` ${Math.round(r.width)}x${Math.round(r.height)}`);
        if (el.matches('.tl,.inp,.bn,.cf,.row') && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)) o.clip.push(el.className + ` ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`);
      });
      const sb = [...document.querySelectorAll('.sbody')].find(e => e.getBoundingClientRect().height);
      const last = [...sb.children].pop().getBoundingClientRect().bottom;
      o.bodyOverflowPx = Math.round(last - sb.getBoundingClientRect().bottom); // > 0 means content is cut
      o.sheetH = Math.round(document.querySelector('.screen-' + location.hash.slice(1) + ' .sheet').getBoundingClientRect().height);
      return o;
    });
    await p.close();
  }
  fs.writeFileSync(D + 'audit.json', JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1));
  const html = `<body style="margin:0;background:#888"><div style="display:grid;grid-template-columns:repeat(6,390px);gap:12px;padding:12px;width:max-content">` +
    ['a', 'b', 'c'].map(v => ['type', 'name'].map(s => `<img src="${v}-${s}-390.png" width="390" height="844">`).join('')).join('') + `</div>`;
  fs.writeFileSync(D + '_contact.html', html);
  const p = await b.newPage({ viewport: { width: 2412, height: 868 } });
  await p.goto('file://' + D + '_contact.html'); await p.waitForTimeout(400);
  await p.screenshot({ path: D + 'contact.png' });
  fs.unlinkSync(D + '_contact.html');
  await b.close();
})();
