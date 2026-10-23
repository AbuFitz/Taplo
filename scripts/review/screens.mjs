// Captures the surfaces that matter, at the sizes people use them. Usage: BASE_URL=... node scripts/review/screens.mjs <before|after>
// Output: docs/screens/<set>/<name>.png (viewport captures, 1x). Physical-device testing is separate; this is Chromium desktop and emulated phones.
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const set = process.argv[2] ?? "after"
const base = process.env.BASE_URL ?? "http://localhost:3100"
const out = new URL(`../../docs/screens/${set}/`, import.meta.url).pathname
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const only = process.argv.slice(3)
const shot = async (name, vp, run, full = false) => {
  if (only.length && !only.includes(name)) return
  const ctx = await b.newContext({ viewport: { width: vp[0], height: vp[1] }, reducedMotion: "reduce", hasTouch: vp[0] < 600, isMobile: vp[0] < 600 })
  const p = await ctx.newPage()
  try { await run(p); await p.waitForTimeout(700); await p.screenshot({ path: `${out}${name}.png`, fullPage: full }); console.log("ok", name) } catch (e) { console.log("FAILED", name, String(e.message).split("\n")[0]) }
  await ctx.close()
}
const go = async (p, u) => { await p.goto(base + u, { waitUntil: "load" }); await p.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {}); await p.evaluate(() => document.fonts.ready) }
const sample = async (p, label = "Barber") => {
  await go(p, "/onboarding"); await p.evaluate(() => localStorage.clear()); await go(p, "/onboarding")
  await p.getByLabel(/Business name/).fill("Marlowe & Finch").catch(() => {})
  for (let i = 0; i < 2; i++) await p.getByRole("button", { name: "Continue" }).click().catch(() => {})
  await p.getByRole("button", { name: label, exact: true }).last().click().catch(() => {})
  await p.waitForURL(/dashboard/, { timeout: 15000 }).catch(() => {})
  await p.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {})
}
await shot("home-1280", [1280, 800], (p) => go(p, "/"))
await shot("home-390", [390, 844], (p) => go(p, "/"))
await shot("inspiration-1280", [1280, 800], (p) => go(p, "/inspiration"))
await shot("pricing-1280", [1280, 800], (p) => go(p, "/pricing"))
await shot("onboarding-1-1280", [1280, 800], async (p) => { await go(p, "/onboarding"); await p.evaluate(() => localStorage.clear()); await go(p, "/onboarding") })
await shot("onboarding-1-390", [390, 844], async (p) => { await go(p, "/onboarding"); await p.evaluate(() => localStorage.clear()); await go(p, "/onboarding") })
await shot("onboarding-3-1280", [1280, 900], async (p) => { await go(p, "/onboarding?from=hollin-physio"); await p.evaluate(() => localStorage.clear()); await go(p, "/onboarding"); await p.getByLabel(/Business name/).fill("Ridgeway Physio"); for (let i = 0; i < 2; i++) await p.getByRole("button", { name: "Continue" }).click() })
await shot("editor-1440", [1440, 900], (p) => sample(p))
await shot("editor-1280", [1280, 800], (p) => sample(p))
await shot("editor-390", [390, 844], (p) => sample(p))
await shot("profile-barber-390", [390, 900], (p) => go(p, "/appearance/frame?scenario=barber"))
await shot("profile-barber-full-390", [390, 900], (p) => go(p, "/appearance/frame?scenario=barber"), true)
await shot("profile-physio-full-390", [390, 900], (p) => go(p, "/appearance/frame?scenario=physio"), true)
await shot("profile-dealer-full-390", [390, 900], (p) => go(p, "/appearance/frame?scenario=dealer"), true)
await shot("profile-barber-1280", [1280, 800], (p) => go(p, "/appearance/frame?scenario=barber"))
await b.close()
