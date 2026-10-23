// Walks the setup journey and captures every step: node scripts/review/onboarding.mjs <set> [width] [height]
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const set = process.argv[2] ?? "after", w = +(process.argv[3] ?? 1280), h = +(process.argv[4] ?? 800)
const base = process.env.BASE_URL ?? "http://localhost:3200"
const out = new URL(`../../docs/screens/${set}/`, import.meta.url).pathname
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", hasTouch: w < 600, isMobile: w < 600 })
const p = await ctx.newPage()
const snap = async (n) => { await p.waitForTimeout(700); await p.screenshot({ path: `${out}setup-${w}-${n}.png` }) }
await p.goto(base + "/onboarding", { waitUntil: "networkidle" }); await p.evaluate(() => localStorage.clear()); await p.goto(base + "/onboarding?plan=pro", { waitUntil: "networkidle" })
await p.getByLabel("Business name").fill("Ridgeway Physio"); await snap("1-name")
await p.getByRole("button", { name: "Continue" }).click()
await p.getByRole("button", { name: "Physio / therapist" }).click(); await p.getByText("Ask for a time").click(); await snap("2-what")
await p.getByRole("button", { name: "Continue" }).click(); await snap("3-start")
await p.getByRole("button", { name: "Continue" }).click()
await p.getByLabel("Phone").fill("0113 496 0123"); await p.getByLabel("Town or area").fill("Headingley, Leeds"); await snap("4-contact")
await p.getByRole("button", { name: "Continue" }).click(); await snap("5-review")
await b.close()
