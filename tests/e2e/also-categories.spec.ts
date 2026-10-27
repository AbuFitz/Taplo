import { test, expect } from "@playwright/test"
import { cont } from "./helpers"
for (const width of [390, 1440]) test(`a business can add up to two further kinds of work at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 })
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
  await cont(page)
  await page.getByRole("button", { name: "Barber", exact: true }).click()
  const also = page.getByTestId("also-categories")
  await expect(also).toBeVisible()
  await also.getByRole("button", { name: "Tutor" }).click()
  await also.getByRole("button", { name: "Personal trainer" }).click()
  await expect(also.getByRole("button", { pressed: true })).toHaveCount(2)
  const free = also.getByRole("button", { pressed: false }).first()
  await expect(free).toBeDisabled()
  const keys = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.identity.alsoKeys)
  expect(keys).toHaveLength(2)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
