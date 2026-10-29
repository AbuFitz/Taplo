import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

for (const width of [390, 1440]) {
  test(`analytics shows an honest empty state with one next action at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto("/dashboard/analytics")
    const panel = page.getByTestId("empty-panel")
    await expect(panel).toBeVisible()
    await expect(panel.getByRole("heading", { name: "No numbers yet" })).toBeVisible()
    await expect(panel.getByRole("link", { name: "Share your page" })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const results = await new AxeBuilder({ page }).include("[data-testid=empty-panel]").analyze()
    expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([])
  })
}

test("illustrations are static when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/dashboard/analytics")
  const paths = page.getByTestId("empty-panel").locator("svg path")
  expect(await paths.count()).toBeGreaterThan(2)
  expect(await paths.first().evaluate((p) => p.getAttribute("style") ?? "")).not.toContain("stroke-dasharray")
})
