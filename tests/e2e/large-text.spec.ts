import { test, expect } from "@playwright/test"
import { cont } from "./helpers"

// Large text (browser font-size 150% and 200%) on a small phone: every step must keep its action reachable and fit sideways.
for (const scale of [150, 200]) test(`setup stays usable with ${scale}% text on a small phone`, async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.addInitScript((pct) => { document.documentElement.style.fontSize = `${pct}%` }, scale)
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await page.evaluate((pct) => { document.documentElement.style.fontSize = `${pct}%` }, scale)
  const check = async (label: string) => {
    await expect(page.getByRole("button", { name: "Continue", exact: true }), `${label}: Continue reachable`).toBeVisible()
    await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeInViewport()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: no sideways scroll`).toBe(true)
    const heading = await page.getByRole("heading", { level: 1 }).boundingBox()
    expect(heading && heading.y >= -1, `${label}: heading not clipped at the top`).toBe(true)
  }
  await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
  await check("name")
  await cont(page, { keepLook: true }); await check("look")
  await cont(page); await check("category")
  await page.getByRole("button", { name: "Barber", exact: true }).click(); await cont(page); await check("goals")
  await cont(page); await check("reach")
})
