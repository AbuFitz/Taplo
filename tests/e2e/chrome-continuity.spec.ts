import { test, expect } from "@playwright/test"
import sharp from "sharp"
import { STARTING_LOOKS } from "../../src/features/page/themes/starting-looks"

/**
 * The browser's own status bar and toolbars can only show one flat colour. This checks what the page does about it, in Chromium with a
 * simulated notch: while a moving background runs, the strip under the status bar stays on the page colour (the same colour the browser
 * is told to use), and the page and document agree. It does not show real iOS or Android chrome.
 */
const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
for (const look of STARTING_LOOKS.filter((l) => l.animated)) test(`${look.name}: top edge meets the flat browser colour while the background moves`, async ({ browser }) => {
  test.setTimeout(90_000)
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets: { top: 47, bottom: 34, left: 0, right: 0 } }).catch(() => undefined)
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
  await page.getByRole("button", { name: "Continue", exact: true }).click()
  await page.getByRole("radio", { name: look.name, exact: true }).check({ force: true })
  // Open the real customer page the preview shows, as a visitor would.
  const src = await page.locator('iframe[data-testid="setup-live-page"]').first().getAttribute("src")
  const view = await ctx.newPage()
  const c2 = await ctx.newCDPSession(view)
  await c2.send("Emulation.setSafeAreaInsetsOverride", { insets: { top: 47, bottom: 34, left: 0, right: 0 } }).catch(() => undefined)
  await view.goto(src!, { waitUntil: "networkidle" })
  await view.waitForTimeout(1500)
  const base = await view.evaluate(() => getComputedStyle(document.querySelector("[data-taplo-page]")!).getPropertyValue("--tp-background").trim())
  const scrim = await view.evaluate(() => getComputedStyle(document.querySelector("[data-taplo-page]")!, "::before").height)
  expect(scrim, "the scrim fills the simulated safe area").toBe("47px")
  const meta = await view.evaluate(() => document.querySelector('meta[name="theme-color"]')?.getAttribute("content"))
  expect(meta?.toLowerCase()).toBe(base.toLowerCase())
  const shots: Buffer[] = []
  for (let i = 0; i < 3; i++) { shots.push(await view.screenshot()); await view.waitForTimeout(1400) }
  const hex = base.replace("#", ""); const br = parseInt(hex.slice(0, 2), 16), bg = parseInt(hex.slice(2, 4), 16), bb = parseInt(hex.slice(4, 6), 16)
  for (const [i, shot] of shots.entries()) {
    const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true })
    // The very top row (inside the safe area) must be the flat page colour, at several points across the width.
    for (const x of [20, 195, 370]) {
      const o = (0 * info.width + x) * info.channels
      const d = Math.abs(lum(data[o]!, data[o + 1]!, data[o + 2]!) - lum(br, bg, bb))
      expect(d, `${look.name} frame ${i} x=${x}: top row differs from the flat colour by ${d.toFixed(1)}`).toBeLessThan(10)
    }
  }
})
