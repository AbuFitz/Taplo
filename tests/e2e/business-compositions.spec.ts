import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import path from "node:path"

for (const width of [320, 390, 768, 1440]) test(`six business compositions remain usable at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const scenario of ["station", "detailer", "brookfield", "corner", "oakfield", "rowan"]) {
    await page.goto(`/appearance/frame?scenario=${scenario}`)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i => i.loading !== "lazy").map(i => i.decode())) })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), scenario).toBe(true)
    // A customer must be able to reach every section, without a separate scrolling frame.
    const last = page.locator("[data-widget]").last()
    await last.scrollIntoViewIfNeeded()
    await expect(last).toBeInViewport()
    expect(await page.locator("iframe").count()).toBe(0)
    if (width === 390 || width === 1440) {
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()
      expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), scenario).toEqual([])
      await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `complete-${scenario}-${width}.png`), fullPage: true })
    }
  }
})

for (const width of [390, 1440]) test(`starting with a business design preserves section styling through setup and reload at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 950 })
  await page.goto('/onboarding?from=jays-barbers')
  await expect(page.getByTestId('from-example')).toContainText('Jay’s Barbers')
  const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('taplo.demo.v2')!))
  await expect.poll(async () => (await read()).page.themeId).toBe('paper')
  const start = await read()
  const menu = start.page.widgets.find((w: { type: string }) => w.type === 'priceMenu')
  expect(menu.appearance.surface).toBe('accent')
  expect(menu.settings.serviceIds ?? null).toBeNull()
  expect(start.content.identity.logo).toBeUndefined()
  await page.getByLabel('Business name', { exact: true }).fill('North Street Barbers')
  await page.reload()
  await expect(page.getByLabel('Business name', { exact: true })).toHaveValue('North Street Barbers')
  expect((await read()).page.widgets.find((w: { type: string }) => w.type === 'priceMenu').appearance).toEqual(menu.appearance)
})
