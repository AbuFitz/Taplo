import { cont, openDetails, openMoreStyling } from './helpers';
import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import path from "node:path"
import { addWidget } from "./helpers"

for (const width of [390, 1440]) test(`homepage shows the real rendered page in a handset without an embedded frame at ${width}`, async ({ page }) => {
  await page.setViewportSize({width,height:950});await page.goto('/')
  const stage=page.getByTestId('hero-showcase')
  await expect(stage.locator('img')).toHaveAttribute('alt',/Detail Dept\. Taplo page/)
  await expect(stage.locator('iframe')).toHaveCount(0)
})

test('Google review setup preserves old records but never publishes them as Google content', async ({ page }) => {
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Try Jay’s Barbers', exact: true }).click()
  await page.waitForURL('**/dashboard/page')
  const original = await page.evaluate(() => JSON.parse(localStorage.getItem('taplo.demo.v2')!).content.testimonials)
  await page.goto('/dashboard/reviews')
  await expect(page.getByRole('heading', { name: 'Google reviews', exact: true })).toBeVisible()
  await expect(page.getByLabel('Customer name')).toHaveCount(0)
  await expect(page.getByLabel('What they said')).toHaveCount(0)
  await page.getByLabel('Google Maps or review link', { exact: true }).fill('https://www.google.com/maps/place/Example')
  await page.getByLabel('Google Maps or review link', { exact: true }).blur()
  await expect(page.getByRole('link', { name: 'Open on Google' })).toHaveAttribute('href', 'https://www.google.com/maps/place/Example')
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('taplo.demo.v2')!).content.testimonials)).toEqual(original)
  await page.goto('/dashboard/page')
  await addWidget(page, /^Google reviews/)
  await page.goto('/demo/preview')
  await expect(page.locator('[data-widget="reviews"]').getByRole('link')).toHaveAttribute('href', 'https://www.google.com/maps/place/Example')
  for (const review of original ?? []) await expect(page.getByText(review.quote, { exact: true })).toHaveCount(0)
  await expect(page.locator('[data-widget="reviews"]')).not.toContainText(/★|out of 5|Shared by the business/)
})

test('homepage removes the repeated feature wall and keeps direct product discovery',async({page})=>{
 await page.goto('/');await expect(page.locator('section[aria-labelledby="feature-spotlights-title"]')).toHaveCount(0)
 await expect(page.locator('.hero-stage iframe')).toHaveCount(0);await expect(page.locator('a[href="/product/booking#try-booking"]').first()).toBeVisible()
 await page.goto('/product');await expect(page.getByRole('tablist',{name:'What your page can do'})).toBeVisible();await expect(page.getByRole('tabpanel').getByRole('link')).toHaveAttribute('href','/product/gallery-reviews')
})
