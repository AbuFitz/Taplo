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
  const paths = page.getByTestId("empty-panel").locator("svg rect, svg path")
  // The scene is a Lottie file fetched after mount, so wait for it to draw its first frame.
  await expect.poll(() => paths.count(), { timeout: 15000 }).toBeGreaterThan(5)
  expect(await paths.first().evaluate((p) => p.getAttribute("style") ?? "")).not.toContain("stroke-dasharray")
})

test("dashboard shows feature loops, look labels and a resume entry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/dashboard")
  await expect(page.getByTestId("first-run")).toBeVisible()
  await expect(page.getByRole("link", { name: /Start setup/ })).toBeVisible()
  await expect(page.locator("section[aria-labelledby=sample-title]").getByText(/ · /).first()).toBeVisible()
  // Start a setup, leave, and come back: the dashboard offers to continue it.
  await page.goto("/onboarding?step=name")
  await page.getByLabel("Business name", { exact: true }).fill("North Street Studio")
  await page.getByTestId("setup-logo").click()
  await page.goto("/dashboard")
  await expect(page.getByTestId("continue-setup")).toBeVisible()
  await page.getByTestId("continue-setup").click()
  await expect(page).toHaveURL(/\/onboarding/)
  await expect(page.getByLabel("Business name", { exact: true })).toHaveValue("North Street Studio")
})

test("the studio home leads with one next action and hides what has no data", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openEditorWithSample(page)
  await page.goto("/dashboard")
  const next = page.getByTestId("studio-next")
  await expect(next).toBeVisible()
  await expect(page.getByTestId("studio-status")).toContainText("Draft")
  await expect(page.getByTestId("studio-status")).toContainText("Only visible in this browser")
  // one filled primary action, no zero counters, none of the retired cards
  await expect(next.getByRole("button", { name: "Publish", exact: true })).toBeVisible()
  const body = (await page.locator("main").innerText()).toLowerCase()
  for (const gone of ["ready to share", "open sharing", "7 of 7", "get more from your page", "need a reply", "upcoming"]) expect(body).not.toContain(gone)
  await expect(page.getByTestId("feature-loops")).toHaveCount(0)
  // Share only exists after publishing, and the headline takes focus
  await expect(page.getByTestId("studio-share")).toHaveCount(0)
  await next.getByRole("button", { name: "Publish", exact: true }).click()
  await expect(page.getByTestId("studio-status")).toContainText("Published")
  await expect(page.getByTestId("studio-share")).toBeVisible()
})

test("analytics on the free plan explains the upgrade instead of showing an empty chart", async ({ page }) => {
  await openEditorWithSample(page)
  await page.evaluate(() => { const k = "taplo.demo.v2"; const s = JSON.parse(localStorage.getItem(k)!); s.plan = "free"; localStorage.setItem(k, JSON.stringify(s)) })
  await page.goto("/dashboard/analytics")
  const panel = page.getByTestId("empty-panel")
  await expect(panel.getByRole("heading", { name: "Analytics comes with a paid plan" })).toBeVisible()
  await expect(panel.getByRole("link", { name: "See plans" })).toHaveAttribute("href", "/pricing")
})
