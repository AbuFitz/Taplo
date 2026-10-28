import { test, expect } from "@playwright/test"
import { cont } from "./helpers"

// One page is one business. A business may offer many services, but registration no longer asks for secondary categories.
for (const width of [390, 1440]) test(`category step is business-focused with neutral wording at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 })
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
  await cont(page)
  await expect(page.getByLabel("Business type", { exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Barber", exact: true }).click()
  await expect(page.getByTestId("also-categories")).toHaveCount(0)
  await expect(page.getByText("I also do")).toHaveCount(0)
  await expect(page.getByText(/under the business name/)).toBeVisible()
  const where = page.getByTestId("how-you-work")
  for (const label of ["At a location", "At customers’ locations", "Online"]) await expect(where.getByRole("button", { name: label })).toBeVisible()
  expect(await page.locator("body").innerText()).not.toMatch(/\bI travel\b|\bmy (name|premises)\b/i)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
