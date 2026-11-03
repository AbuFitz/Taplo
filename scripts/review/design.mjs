// Render designs on scenarios. Usage: node scripts/review/design.mjs <set> <ids,comma> <scenarios,comma> [w] [h]
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const [set="d1", ids="borealis", scenarios="barber", W="390", H="900"] = process.argv.slice(2)
const out = new URL(`../../docs/screens/${set}/`, import.meta.url).pathname; mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const base = process.env.BASE_URL ?? "http://localhost:3000"
const ctx = await b.newContext({ viewport: { width: Number(W), height: Number(H) }, reducedMotion: process.env.MOTION ? "no-preference" : "reduce" })
for (const sc of scenarios.split(",")) for (const id of ids.split(",")) {
  const p = await ctx.newPage()
  await p.goto(`${base}/appearance/frame?scenario=${sc}&look=${id}&design=1`); await p.waitForTimeout(1600)
  await p.screenshot({ path: `${out}${sc}-${id}-${W}.png`, fullPage: process.env.FULL === "1" })
  await p.close()
}
await b.close()
