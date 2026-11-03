// Reference page captures: the actual page (phone, desktop), full length.
import { chromium } from "@playwright/test"
const base = process.env.BASE_URL ?? "http://localhost:3000"
const sc = process.argv[2] ?? "barber"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
for (const [tag, w, h, dsf] of [["phone", 390, 844, 2], ["tablet", 820, 1100, 1], ["desk", 1440, 900, 1]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, reducedMotion: "reduce" }); const p = await c.newPage()
  await p.goto(`${base}/appearance/frame?scenario=${sc}`, { waitUntil: "load" }); await p.waitForLoadState("networkidle").catch(() => {}); await p.waitForTimeout(1500)
  await p.screenshot({ path: `/home/user/taplo/docs/screens/r4/ref-${sc}-${tag}.png`, fullPage: true }); await c.close()
}
await b.close()
