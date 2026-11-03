// Editor walk-through captures. Usage: BASE_URL=... node scripts/review/editor.mjs <set> [label]
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const set = process.argv[2] ?? "r3"
const label = process.argv[3] ?? "Barber"
const base = process.env.BASE_URL ?? "http://localhost:3000"
const out = new URL(`../../docs/screens/${set}/`, import.meta.url).pathname
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
async function open(w, h, mobile) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", hasTouch: mobile, isMobile: mobile })
  const p = await ctx.newPage()
  await p.goto(base + "/dashboard", { waitUntil: "load" }); await p.evaluate(() => localStorage.clear()); await p.goto(base + "/dashboard", { waitUntil: "load" })
  await p.getByRole("button", { name: new RegExp(`^${label}`) }).first().click()
  await p.waitForURL(/dashboard\/page/, { timeout: 20000 })
  await p.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {})
  await p.waitForTimeout(1200)
  return p
}
const snap = async (p, n) => { await p.waitForTimeout(500); await p.screenshot({ path: `${out}${n}.png` }); console.log("ok", n) }
{
  const p = await open(1440, 900, false)
  await snap(p, "editor-1440-list")
  await p.getByTestId("select-widget").nth(1).click(); await snap(p, "editor-1440-item")
  await p.getByTestId("back-to-content").click()
  await p.getByTestId("add-widget").click(); await snap(p, "editor-1440-add")
  await p.keyboard.press("Escape")
  await p.getByTestId("tab-header").click(); await snap(p, "editor-1440-header")
  await p.getByTestId("tab-design").click(); await snap(p, "editor-1440-design")
}
{
  const p = await open(390, 844, true)
  await snap(p, "editor-390-page")
  await p.getByTestId("tab-content").click(); await snap(p, "editor-390-content")
  await p.getByTestId("select-widget").nth(1).click().catch(() => {}); await snap(p, "editor-390-item")
}
await b.close()
