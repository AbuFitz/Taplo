import { expect, test } from "@playwright/test"
import { openEditorWithSample, previewFrame, selectPart } from "./helpers"
import path from "node:path"

for (const width of [390, 1440]) {
  test(`picture choices show the owner's image and preserve history at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
    await openEditorWithSample(page, "Barber")
    await selectPart(page, "header")
    const choices = page.getByRole("radiogroup", { name: "Picture style", exact: true })
    await expect(choices).toBeVisible()
    const image = previewFrame(page).locator(".tp-header .tp-avatar img, .tp-header .tp-logo").first()
    const source = await image.getAttribute("src")
    await expect(choices.locator("img").first()).toHaveAttribute("src", source!)
    await expect(choices.locator('input[value="arch"]')).toHaveCount(0)
    await choices.locator('label[data-choice="circle"]').click()
    await expect(previewFrame(page).locator(".tp-header .tp-avatar")).toHaveAttribute("data-shape", "circle")
    await page.getByTestId("undo").click()
    await expect(previewFrame(page).locator(".tp-header .tp-avatar")).toHaveAttribute("data-shape", "square")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `profile-picker-${width}.png`), fullPage: true })
  })
}
