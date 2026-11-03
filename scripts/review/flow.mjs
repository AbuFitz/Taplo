// Walk every setup step for a category. Usage: node scripts/review/flow.mjs <set> <width> <height> "<Category>" "<Name>"
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const [set="r5", W="1280", H="900", cat="Barber", name="North Street Barbers"] = process.argv.slice(2)
const w = Number(W), h = Number(H), mobile = w < 600
const out = new URL(`../../docs/screens/${set}/flow/`, import.meta.url).pathname
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", hasTouch: mobile, isMobile: mobile })).newPage()
const slug = cat.toLowerCase().replace(/\W+/g, "-")
let n = 0
const snap = async (t) => { await p.waitForTimeout(600); await p.screenshot({ path: `${out}${slug}-${mobile ? "m" : "d"}-${String(++n).padStart(2, "0")}-${t}.png` }) }
await p.goto((process.env.BASE_URL ?? "http://localhost:3000") + "/onboarding"); await p.evaluate(() => localStorage.clear()); await p.reload()
await p.getByLabel("Business name", { exact: true }).fill(name); await snap("business")
for (let i = 0; i < 8; i++) {
  const cat_ = p.getByRole("button", { name: cat, exact: true })
  if (await cat_.count()) await cat_.first().click().catch(() => {})
  const next = p.getByRole("button", { name: /^(Continue|Next)$/ })
  if (!(await next.count()) || !(await next.first().isEnabled())) { await snap("blocked"); break }
  await next.first().click(); await snap("step")
}
await b.close()
