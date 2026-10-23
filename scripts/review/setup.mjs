// Setup walk-through. Usage: BASE_URL=... node scripts/review/setup.mjs <set> [width] [height]
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const set = process.argv[2] ?? "r3"
const W = Number(process.argv[3] ?? 1280), H = Number(process.argv[4] ?? 900)
const base = process.env.BASE_URL ?? "http://localhost:3000"
const out = new URL(`../../docs/screens/${set}/`, import.meta.url).pathname
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const mobile = W < 600
const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: "reduce", hasTouch: mobile, isMobile: mobile })
const p = await ctx.newPage()
const tag = mobile ? "390" : String(W)
const snap = async (n) => { await p.waitForTimeout(700); await p.screenshot({ path: `${out}setup-${tag}-${n}.png` }); console.log("ok", n) }
await p.goto(base + "/onboarding", { waitUntil: "load" }); await p.evaluate(() => localStorage.clear()); await p.goto(base + "/onboarding", { waitUntil: "load" })
await snap("1-identity")
await p.getByLabel(/Business name/).fill("Ridgeway Physio")
await p.getByRole("button", { name: "Continue" }).click()
await p.getByRole("button", { name: "Physio / therapist" }).click()
await snap("2-what")
await p.getByLabel("Phone (optional)").fill("07700 900123")
await p.getByLabel("Phone (optional)").blur()
await snap("2b-reach")
await p.getByRole("button", { name: "Continue" }).click()
await snap("3-design")
await p.getByRole("button", { name: "Continue" }).click()
await snap("4-content-empty")
await p.getByLabel("Service 1 name").fill("Initial assessment")
await p.getByLabel("Service 1 price").fill("65")
await p.getByLabel("Service 1 minutes").fill("45")
await p.getByRole("button", { name: "Add another" }).click()
await p.waitForTimeout(300)
await snap("4-content")
await p.getByRole("button", { name: "Continue" }).click()
await snap("5-review")
await b.close()
