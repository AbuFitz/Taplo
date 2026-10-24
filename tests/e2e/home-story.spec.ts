import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import path from "node:path"

for (const width of [390, 1440]) test(`current UK business story and voluntary keyboard walkthrough at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.goto("/")
  const range = page.locator('section[aria-labelledby="businesses-h"]')
  for (const slug of ["jays-barbers", "detail-dept", "harris-cars"]) await expect(range.locator(`a[href="/inspiration/${slug}"]`)).toBeVisible()
  const tabs = page.getByRole("tablist", { name: "From a price to a booking" })
  const first = tabs.getByRole("tab", { name: "See what it costs" })
  await first.click()
  await expect(page.getByRole("tabpanel")).toHaveCount(1)
  await expect(page.getByRole("tabpanel").locator("img")).toHaveAttribute("src", /svc-menu-barber/)
  await first.focus()
  await page.keyboard.press("End")
  await expect(tabs.getByRole("tab", { name: "Know what happens next" })).toBeFocused()
  await expect(page.getByRole("tabpanel").locator("img")).toHaveAttribute("src", /bk-5-done/)
  await page.keyboard.press("ArrowDown")
  await expect(first).toBeFocused()
  // No automatic advancement or viewport-driven state changes.
  await page.locator("footer").scrollIntoViewIfNeeded()
  await expect(first).toHaveAttribute("aria-selected", "true")
  await tabs.scrollIntoViewIfNeeded()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  // Scan the settled interface; entrance-frame opacity is assessed separately by reduced-motion checks.
  await page.emulateMedia({ reducedMotion: "reduce" })
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze()
  expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([])
  await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `home-booking-story-${width}.png`), fullPage: false })
  await range.scrollIntoViewIfNeeded()
  await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `home-business-story-${width}.png`), fullPage: false })
})

for (const width of [390, 1440]) test(`product story replaces the boxed film and respects reduced motion at ${width}`, async ({ page }) => {
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/')
  const story=page.getByTestId('product-story');await story.scrollIntoViewIfNeeded();await expect(story.locator('video')).toHaveCount(0)
  await expect(story).toHaveAttribute('data-running','false');await expect(story.locator('.product-story-action')).toHaveAttribute('href','/inspiration/detail-dept')
  await expect(page.getByText('Read the film',{exact:true})).toHaveCount(0)
})
