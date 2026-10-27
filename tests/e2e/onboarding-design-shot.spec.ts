import { test, expect } from "@playwright/test"
import path from "node:path"
import { cont, openDetails } from "./helpers"
const OUT = process.env.TAPLO_REVIEW_DIR ?? "docs/review/journey"
for (const width of [1440, 390]) test(`design step ${width}`, async ({ page }) => {
  test.skip(!process.env.TAPLO_SHEET, "review artefact"); test.setTimeout(120_000)
  await page.setViewportSize({ width, height: width > 600 ? 900 : 844 })
  await page.goto("/onboarding?from=hollin-physio", { waitUntil: "networkidle" })
  await page.getByLabel("Business name", { exact: true }).fill("North Studio")
  await cont(page); await cont(page); await openDetails(page)
  await page.getByLabel("Email", { exact: true }).fill("owner@example.com"); await cont(page)
  await page.getByRole("button", { name: "Skip for now", exact: true }).click()
  const profiles = page.getByTestId("setup-profile-choices"); await profiles.scrollIntoViewIfNeeded(); await page.waitForTimeout(2500)
  await expect(profiles.getByRole("radio")).toHaveCount(9)
  await page.screenshot({ path: path.join(OUT, `design-${width}.png`), fullPage: true })
})
