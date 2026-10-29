import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { openEditorWithSample } from "./helpers"

for (const width of [390, 1440]) {
  test(`analytics shows an honest empty state with one next action at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await openEditorWithSample(page)
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
  await openEditorWithSample(page)
  await page.goto("/dashboard/analytics")
  const paths = page.getByTestId("empty-panel").locator("svg path")
  expect(await paths.count()).toBeGreaterThan(2)
  expect(await paths.first().evaluate((p) => p.getAttribute("style") ?? "")).not.toContain("stroke-dasharray")
})

test("dashboard shows feature loops, look labels and a resume entry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/dashboard")
  await expect(page.getByTestId("first-run")).toBeVisible()
  await expect(page.getByRole("link", { name: /Start setup/ })).toBeVisible()
  await expect(page.locator("section[aria-labelledby=sample-title]").getByText(/ · /).first()).toBeVisible()
  // Start a setup, leave, and come back: the dashboard offers to continue it.
  await page.goto("/onboarding")
  await page.getByLabel("Business name", { exact: true }).fill("North Street Studio")
  await page.getByTestId("setup-exit").click()
  await page.goto("/dashboard")
  await expect(page.getByTestId("continue-setup")).toBeVisible()
  await page.getByTestId("continue-setup").click()
  await expect(page).toHaveURL(/\/onboarding/)
  await expect(page.getByLabel("Business name", { exact: true })).toHaveValue("North Street Studio")
})

test("the studio has three short explainer loops, still under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openEditorWithSample(page)
  await page.goto("/dashboard")
  const loops = page.getByTestId("feature-loops")
  await expect(loops).toBeVisible()
  await expect(loops.getByRole("img")).toHaveCount(3)
  expect(await loops.locator("svg g[style*='opacity: 0']").count()).toBe(0)
})
