import { expect, test } from "@playwright/test"
import path from "node:path"
import { EXAMPLES } from "../../src/features/inspiration/examples"

for (const width of [390, 1440]) {
  test(`design preview switches real responsive widths without losing a booking at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
    await page.goto("/inspiration/station-road-barbers")
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Jay’s Barbers")
    const preview = page.getByTestId("design-preview")
    const frame = page.frameLocator('iframe[data-testid="design-preview-frame"]')
    await expect(frame.getByRole("heading", { level: 1 })).toHaveText("Jay’s Barbers")
    expect(await frame.locator("body").evaluate(() => innerWidth)).toBeLessThan(450)
    const flow = frame.getByTestId("booking-flow")
    await preview.evaluate((el) => el.scrollIntoView({ block: "center" }))
    // The page inside the frame hydrates after it paints; a tap before that is lost, so tap until the journey is open.
    // Wait for the framed page to say it is interactive: a tap landing while React replays an early click can open and then close the journey.
    await expect(frame.locator("[data-taplo-page]")).toHaveAttribute("data-taplo-ready", "true")
    await page.waitForTimeout(500)
    await frame.getByRole("button", { name: "Book a haircut", exact: true }).click()
    await expect(flow).toBeVisible({ timeout: 10000 })
    await flow.getByTestId("bk-service").filter({ hasText: "Skin fade" }).click()
    await flow.getByRole("button", { name: /Anyone available/ }).click()
    await flow.getByTestId("bk-slot").first().click()
    await flow.getByRole("button", { name: /^Book this time/ }).click()
    await flow.getByRole("textbox", { name: "Your name" }).fill("Example viewer")
    await preview.getByText("Desktop", { exact: true }).click()
    await expect.poll(() => frame.locator("body").evaluate(() => innerWidth)).toBeGreaterThanOrEqual(1024)
    await expect(flow.getByRole("textbox", { name: "Your name" })).toHaveValue("Example viewer")
    await preview.getByText("Phone", { exact: true }).click()
    await expect(flow.getByRole("textbox", { name: "Your name" })).toHaveValue("Example viewer")
    await frame.getByRole("button", { name: "Close", exact: true }).click()
    await expect(flow).not.toBeVisible()
    await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded()
    await expect(preview.getByRole("link", { name: "Open full page" })).toHaveAttribute("target", "_blank")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `design-detail-${width}.png`), fullPage: false })
    await preview.getByText("Desktop", { exact: true }).click()
    await expect.poll(() => frame.locator("body").evaluate(() => innerWidth)).toBeGreaterThanOrEqual(1024)
    await expect.poll(async () => (await page.getByTestId("design-preview-frame").boundingBox())!.width).toBeGreaterThan(width === 1440 ? 900 : 280)
    await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `design-desktop-${width}.png`), fullPage: false })
  })
}
