import { test, expect } from "@playwright/test"

/**
 * On a phone the browser draws its status bar and overscroll from `theme-color` and the document background. They must match what the
 * page itself paints at the top edge, or a white strip shows above dark screens (and a dark one above light screens).
 */
const ROUTES = ["/", "/pricing", "/how-it-works", "/inspiration", "/product/booking", "/dashboard"]

const channels = (css: string) => (css.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
const close = (a: number[], b: number[]) => a.length === 3 && b.length === 3 && a.every((v, i) => Math.abs(v - b[i]) <= 12)

for (const route of ROUTES) test(`phone chrome colour matches the top edge of ${route}`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(route)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(600)
  const seen = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="theme-color"]')?.getAttribute("content") ?? ""
    const probe = document.createElement("i"); probe.style.color = meta || "#fff"; document.body.append(probe)
    const metaRgb = getComputedStyle(probe).color; probe.remove()
    // The first opaque background painted under the top edge of the viewport.
    let top = "rgb(255, 255, 255)"
    for (const el of document.elementsFromPoint(195, 3)) {
      const bg = getComputedStyle(el).backgroundColor
      const m = bg.match(/[\d.]+/g)
      if (m && (m.length === 3 || Number(m[3]) >= 0.98)) { top = bg; break }
    }
    return { metaRgb, top }
  })
  expect(close(channels(seen.metaRgb), channels(seen.top)), `${route}: theme-color ${seen.metaRgb} vs top edge ${seen.top}`).toBe(true)
})
