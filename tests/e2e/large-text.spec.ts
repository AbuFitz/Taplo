import { test, expect } from "@playwright/test"

// Large text (browser font-size 150% and 200%) on a small phone, and WCAG reflow at 400% zoom: every step keeps its action reachable and fits sideways.
const STEPS = ["type", "name", "look", "action", "services", "plan", "finish"]
async function walk(page: import("@playwright/test").Page, label: string) {
  await page.getByTestId("tile-barber").click()
  for (let i = 0; i < STEPS.length; i++) {
    const heading = page.locator("#step-title")
    await expect(heading, `${label} ${STEPS[i]}: title`).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label} ${STEPS[i]}: no sideways scroll`).toBe(true)
    const box = await heading.boundingBox()
    expect(box && box.y >= -1, `${label} ${STEPS[i]}: title not clipped at the top`).toBe(true)
    if (STEPS[i] === "name") await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
    const last = STEPS[i] === "finish"
    const action = last ? page.getByTestId("save-draft") : page.getByRole("button", { name: /^Continue/ })
    await action.scrollIntoViewIfNeeded()
    await expect(action, `${label} ${STEPS[i]}: action reachable`).toBeVisible()
    const at = await action.boundingBox(); const foot = await page.locator(".sf-foot").boundingBox()
    if (!last) expect(at && at.y + at.height <= (foot ? foot.y + foot.height + 1 : 9999), `${label} ${STEPS[i]}: action inside the footer`).toBe(true)
    if (!last) await action.click()
  }
}
for (const scale of [150, 200]) test(`setup stays usable with ${scale}% text on a small phone`, async ({ page }) => {
  test.setTimeout(120_000)
  await page.setViewportSize({ width: 320, height: 640 })
  await page.addInitScript((pct) => { document.documentElement.style.fontSize = `${pct}%` }, scale)
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await walk(page, `${scale}%`)
})
test("setup reflows at 400% zoom (320 x 256) with every action reachable", async ({ page }) => {
  test.setTimeout(120_000)
  await page.setViewportSize({ width: 320, height: 256 })
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await walk(page, "400%")
})
