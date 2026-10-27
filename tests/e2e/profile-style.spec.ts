import { expect, test } from "@playwright/test"
import { openEditorWithSample, previewFrame, selectPart } from "./helpers"
import path from "node:path"

for (const width of [390, 1440]) {
  test(`picture choices show the owner's image and preserve history at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
    await openEditorWithSample(page, "Barber")
    await selectPart(page, "header")
    await page.getByRole("radiogroup", { name: "Header arrangement", exact: true }).locator('label[data-choice="bento"]').click() // an arrangement that shows the profile picture
    const choices = page.getByRole("radiogroup", { name: "Picture style", exact: true })
    await expect(choices).toBeVisible()
    const image = previewFrame(page).locator(".tp-header .tp-avatar img, .tp-header .tp-logo").first()
    const source = await image.getAttribute("src")
    await expect(choices.locator("img").first()).toHaveAttribute("src", source!)
    await expect(choices.locator('input[value="arch"]')).toHaveCount(0)
    const avatar = previewFrame(page).locator(".tp-header .tp-avatar")
    const before = await previewFrame(page).locator(".tp-header .tp-avatar").count()
    const start = before ? await avatar.getAttribute("data-shape") : null
    const target = start === "circle" ? "rounded" : "circle" // always move to a shape the design is not already using
    await choices.locator(`label[data-choice="${target}"]`).click()
    await expect(avatar).toHaveAttribute("data-shape", target)
    await page.getByTestId("undo").click()
    if (start) await expect(avatar).toHaveAttribute("data-shape", start)
    else await expect(avatar).not.toHaveAttribute("data-shape", target)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `profile-picker-${width}.png`), fullPage: true })
  })
}
