import { expect, test } from "@playwright/test"
import { closeSheet, look, openSection, previewFrame, selectPart } from "./helpers"

for (const width of [390, 1440]) {
  test.describe(`${width}px native engine`, () => {
    test.use({ viewport: { width, height: 1000 }, reducedMotion: "reduce" })
    test("a service request retains its real context and ends pending", async ({ page }) => {
      await page.goto("/appearance/frame?scenario=oakfield")
      await page.getByTestId("service-open").filter({ hasText: "Small repairs visit" }).click()
      const detail = page.getByTestId("service-detail")
      await expect(detail).toContainText("From £65")
      await detail.getByRole("button", { name: "Request this", exact: true }).click()
      const flow = page.getByTestId("booking-flow")
      await flow.getByTestId("bk-slot").first().click()
      await flow.getByRole("button", { name: /^Request this time/ }).click()
      await flow.getByLabel("Your name", { exact: true }).fill("Example visitor")
      await flow.getByLabel("Email", { exact: true }).fill("visitor@example.com")
      await flow.getByRole("button", { name: "Review", exact: true }).click()
      await expect(flow.getByTestId("bk-outcome")).toContainText(/request/i)
      await flow.getByRole("button", { name: "Send request", exact: true }).click()
      await expect(flow.getByTestId("bk-done")).toHaveAttribute("data-status", "pending")
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.bookings.v1:fieldwork-home-care")!).bookings[0])
      expect(saved).toMatchObject({ serviceName: "Small repairs visit", priceLabel: "From £65", status: "pending" })
    })

    test("an owner changes a visual look, undoes it and keeps their records after reload", async ({ page }) => {
      await page.goto("/dashboard")
      await page.getByRole("button", { name: "Try Jay’s Barbers", exact: true }).click()
      await page.waitForURL("**/dashboard/page")
      const initial = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!))
      await selectPart(page, "page")
      await openSection(page, /^Look/)
      await look(page, "apex").click()
      await closeSheet(page)
      await expect(previewFrame(page).locator("[data-taplo-page]")).toHaveAttribute("data-bg", "solid")
      await page.getByTestId("undo").click()
      await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).page.themeId)).toBe(initial.page.themeId)
      await page.reload()
      await expect(page.getByTestId("my-page")).toBeVisible()
      const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!))
      expect(restored.content).toEqual(initial.content)
      expect(restored.page.widgets).toEqual(initial.page.widgets)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  })
}
