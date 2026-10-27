import { expect, test } from "@playwright/test"
import path from "node:path"

test.use({ reducedMotion: "reduce" })

for (const width of [390, 1440]) {
  test(`new UK examples render real layouts and working assets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    for (const [scenario, name, booking] of [["station", "Jay’s Barbers", "Book a haircut"], ["detailer", "Detail Dept.", "Request a valet"]]) {
      await page.goto(`/appearance/frame?scenario=${scenario}`)
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(name)
      await expect(page.getByRole("button", { name: booking, exact: true })).toBeVisible()
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images).filter((i) => i.loading !== "lazy").map((i) => i.decode())) })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `${scenario}-${width}.png`), fullPage: false })
    }
  })
}

test("UK examples keep haircut confirmations and valet requests distinct", async ({ page }) => {
  for (const [scenario, label, serviceName, hasPeople, finalLabel, status, slug] of [
    ["station", "Book a haircut", "Haircut", true, "Confirm booking", "confirmed", "jays-barbers"],
    ["detailer", "Request a valet", "Maintenance valet", false, "Send request", "pending", "detail-dept"],
  ] as const) {
    await page.goto(`/appearance/frame?scenario=${scenario}`)
    await page.getByRole("button", { name: label, exact: true }).click()
    const flow = page.getByTestId("booking-flow")
    await flow.getByTestId("bk-service").filter({ has: page.getByText(serviceName, { exact: true }) }).click()
    if (hasPeople) await flow.getByRole("button", { name: /Anyone available/ }).click()
    await flow.getByTestId("bk-slot").first().click()
    await flow.getByRole("button", { name: /^(Book|Request) this time/ }).click()
    await flow.getByRole("textbox", { name: "Your name" }).fill("Example customer")
    await flow.getByRole("textbox", { name: "Email", exact: true }).fill("customer@example.com")
    await flow.getByRole("button", { name: "Review", exact: true }).click()
    await flow.getByRole("button", { name: finalLabel, exact: true }).click()
    await expect(flow.getByTestId("bk-done")).toHaveAttribute("data-status", status)
    await expect(flow.getByTestId("bk-done")).toContainText("not emailed or texted")
    const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(`taplo.demo.bookings.v1:${key}`)!).bookings[0], slug)
    expect(saved).toMatchObject({ status, serviceName })
  }
})

