import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import path from "node:path"

const looks = [{ id: "open", header: "feature" }, { id: "service", header: "side" }, { id: "personal", header: "centered" }, { id: "ink", header: "minimal" }, { id: "silver", header: "centered" }, { id: "smoke", header: "minimal" }]
for (const width of [320, 390, 1440]) for (const look of looks) test(`${look.id} preserves the business and readable sections at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`/appearance/frame?scenario=station&look=${look.id}`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jay’s Barbers')
  await expect(page.locator('.tp-header')).toHaveAttribute('data-layout', /^(centered|poster|editorial|side|banner|melt|split|bento|type)$/) // retired arrangements fall back to a current one
  await expect(page.locator('[data-widget="priceMenu"]')).toContainText('Haircut')
  await expect(page.locator('[data-widget="priceMenu"]')).toContainText('£22')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  expect(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([])
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? 'test-results', `${look.id}-${width}.png`), fullPage: true })
})

test('section rhythm updates the real page, undoes and survives reload without changing content', async ({ page }) => {
  const { openEditorWithSample, selectPart, previewFrame } = await import('./helpers')
  await openEditorWithSample(page, 'Barber')
  await selectPart(page, 'page')
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('taplo.demo.v2')!))
  const summary = page.locator('summary').filter({ hasText: /^Layout and motion/ })
  await summary.click()
  await page.getByRole('radiogroup', { name: 'Section rhythm', exact: true }).getByText('Spacious', { exact: true }).click()
  const root = previewFrame(page).locator('[data-taplo-page]')
  await expect(root).toHaveAttribute('data-rhythm', 'editorial')
  await expect.poll(() => previewFrame(page).locator('.tp-widgets').evaluate(el => getComputedStyle(el).gap)).toBe('48px')
  await page.getByTestId('undo').click()
  await expect(root).toHaveAttribute('data-rhythm', 'even')
  await page.getByTestId('redo').click()
  await expect(root).toHaveAttribute('data-rhythm', 'editorial')
  await page.reload()
  await expect(previewFrame(page).locator('[data-taplo-page]')).toHaveAttribute('data-rhythm', 'editorial')
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('taplo.demo.v2')!))
  expect(after.content).toEqual(before.content)
  expect(after.page.widgets).toEqual(before.page.widgets)
})
