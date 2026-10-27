import { test } from "@playwright/test"
import path from "node:path"
import { cont, openDetails } from "./helpers"

/** Captures each setup step at desktop and phone width for the journey audit. Set TAPLO_SHEET=1. */
const OUT = process.env.TAPLO_REVIEW_DIR ?? "docs/review/journey"
for (const width of [1440, 390]) {
  test(`onboarding audit ${width}`, async ({ page }) => {
    test.skip(!process.env.TAPLO_SHEET, "review artefact")
    test.setTimeout(240_000)
    await page.setViewportSize({ width, height: width > 600 ? 900 : 844 })
    let n = 0
    const snap = async (label: string) => { await page.waitForTimeout(700); await page.screenshot({ path: path.join(OUT, `${width}-${String(++n).padStart(2, "0")}-${label}.png`) }) }
    await page.goto("/onboarding", { waitUntil: "networkidle" })
    await snap("start")
    await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
    await snap("name")
    for (let i = 0; i < 7; i++) {
      await cont(page).catch(() => {})
      await openDetails(page).catch(() => {})
      await snap(`step-${i + 1}`)
      const skip = page.getByRole("button", { name: "Skip for now", exact: true })
      if (await skip.isVisible().catch(() => false)) await skip.click().catch(() => {})
    }
  })
}
