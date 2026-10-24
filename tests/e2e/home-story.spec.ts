import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import path from "node:path"

for (const width of [390, 1440]) test(`current UK business story and voluntary keyboard walkthrough at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.goto("/")
  const range = page.locator('section[aria-labelledby="businesses-h"]')
  for (const slug of ["station-road-barbers", "parkside-valeting", "brookfield-motors"]) await expect(range.locator(`a[href="/inspiration/${slug}"]`)).toBeVisible()
  const tabs = page.getByRole("tablist", { name: "From a price to a booking" })
  const first = tabs.getByRole("tab", { name: "See what it costs" })
  await first.click()
  await expect(page.getByRole("tabpanel")).toHaveCount(1)
  await expect(page.getByRole("tabpanel").locator("img")).toHaveAttribute("src", /story-1-menu/)
  await first.focus()
  await page.keyboard.press("End")
  await expect(tabs.getByRole("tab", { name: "Know what happens next" })).toBeFocused()
  await expect(page.getByRole("tabpanel").locator("img")).toHaveAttribute("src", /story-4-done/)
  await page.keyboard.press("ArrowDown")
  await expect(first).toBeFocused()
  // No automatic advancement or viewport-driven state changes.
  await page.locator("footer").scrollIntoViewIfNeeded()
  await expect(first).toHaveAttribute("aria-selected", "true")
  await tabs.scrollIntoViewIfNeeded()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze()
  expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([])
  await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `home-booking-story-${width}.png`), fullPage: false })
  await range.scrollIntoViewIfNeeded()
  await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `home-business-story-${width}.png`), fullPage: false })
})

for (const width of [390, 1440]) test(`film decodes the authored ${width < 640 ? "portrait" : "landscape"} file at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.goto("/")
  await expect(page.locator("video")).toHaveCount(0)
  await page.getByRole("button", { name: "Play, 18 seconds" }).click()
  const video = page.locator("video")
  await expect.poll(async () => video.evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThanOrEqual(2)
  expect(await video.evaluate((v: HTMLVideoElement) => ({ width: v.videoWidth, height: v.videoHeight, seconds: Math.round(v.duration), file: new URL(v.currentSrc).pathname }))).toEqual(width < 640 ? { width: 1080, height: 1920, seconds: 18, file: "/marketing/film/taplo-portrait.mp4" } : { width: 1920, height: 1080, seconds: 18, file: "/marketing/film/taplo-intro.mp4" })
  await expect(page.getByText("Read the film", { exact: true })).toBeVisible()
})
