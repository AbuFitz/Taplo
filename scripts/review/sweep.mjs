// Width sweep: every surface at every width must fit without sideways scrolling. 640px is a 200% browser zoom on a 1280px screen and
// 320px is 400% zoom on 1280px (the WCAG reflow case). Zoom is emulated by viewport width: media queries then respond exactly as they
// do under zoom. A text-size-only setting (the OS or browser default font size) cannot be set from here and is not claimed.
// Usage: BASE_URL=http://localhost:3100 node scripts/review/sweep.mjs   (Chromium; see docs/delivery-corrective.md for what is emulation)
import { chromium } from "@playwright/test"
const base = process.env.BASE_URL ?? "http://localhost:3100"
const widths = [320, 360, 390, 430, 640, 768, 1024, 1280, 1536]
const routes = ["/", "/product/booking", "/product/design", "/product/sharing", "/inspiration", "/inspiration/hollin-physio", "/pricing", "/how-it-works", "/onboarding", "/demo-barber", "/demo-tutor", "/demo-cafe", "/demo-mechanic", "/appearance", "/dashboard/page"]
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
let bad = 0, n = 0
for (const text of [100]) {
  for (const w of widths) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" })
    const p = await ctx.newPage()
    await p.goto(base + "/dashboard"); await p.evaluate(() => localStorage.clear()); await p.getByText("More sample businesses", { exact: true }).click(); await p.getByRole("button", { name: /^Barber/ }).first().click(); await p.waitForURL(/dashboard\/page/)
    for (const r of routes) {
      await p.goto(base + r, { waitUntil: "load" }); await p.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {})
      if (text !== 100) await p.addStyleTag({ content: `html { font-size: ${text}% !important; }` })
      await p.waitForTimeout(250)
      const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      n++
      if (over > 0) { bad++; console.log("OVERFLOW", `${text}%`, w, r, `+${over}px`) }
    }
    await ctx.close()
  }
}
console.log(`${n} checks, ${bad} overflowing`)
await b.close()
