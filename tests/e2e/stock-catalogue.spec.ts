import { expect, test } from "@playwright/test"
import path from "node:path"
import { openEditorWithSample, openRow, previewFrame } from "./helpers"

for (const width of [390, 1440]) {
  test(`UK stock is readable, image-backed and enquiry-ready at ${width}px`, async ({ page }) => {
    test.setTimeout(120_000) // fullPage screenshot plus image loads is slow when the suite runs in parallel
    await page.setViewportSize({ width, height: 1000 })
    await page.goto("/appearance/frame?scenario=brookfield")
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Harris Cars")
    const cards = page.locator('.tp-product[data-kind="vehicle"]')
    await expect(cards).toHaveCount(3)
    // Measure once the layout has settled (fonts and images change card heights while the page loads).
    await expect(async () => {
      const a = (await cards.nth(0).boundingBox())!
      const b = (await cards.nth(1).boundingBox())!
      if (width === 390) { expect(a.width).toBeGreaterThan(320); expect(b.y).toBeGreaterThan(a.y + a.height - 1) }
      else { expect(a.width).toBeGreaterThan(380); expect(Math.abs(a.y - b.y)).toBeLessThan(2); expect(b.x).toBeGreaterThan(a.x + a.width) }
    }).toPass({ timeout: 15_000 })
    await expect(cards.filter({ hasText: "MINI Cooper" })).toContainText("Sold")
    await expect(cards.filter({ hasText: "Mazda CX-5" })).toContainText("Reserved")
    await expect(cards.filter({ hasText: "MINI Cooper" }).getByRole("button", { name: "Enquire about this car" })).toHaveCount(0)
    for (const img of await cards.locator(".tp-media img").all()) {
      await img.scrollIntoViewIfNeeded()
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
      await expect(img).toHaveAttribute("alt", /(Illustrative|representative model photograph)/)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded()
    await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `brookfield-${width}.png`), fullPage: true })
    await cards.filter({ hasText: "Volkswagen Golf" }).getByRole("button", { name: "Enquire about this car" }).click()
    const dialog = page.getByRole("dialog")
    const form = dialog.getByTestId("enquiry-form")
    const fieldIds = await page.locator("textarea").evaluateAll((els) => els.map((el) => el.id))
    expect(new Set(fieldIds).size).toBe(fieldIds.length)
    await form.getByRole("textbox", { name: "Your name", exact: true }).fill("Example buyer")
    await form.getByLabel("Email", { exact: true }).fill("buyer@example.com")
    await form.getByRole("textbox", { name: "Your message", exact: true }).fill("Can I ask about the Golf and arrange a viewing?")
    await form.getByRole("button", { name: "Send enquiry", exact: true }).click()
    await expect(page.getByTestId("enquiry-sent")).toContainText("Volkswagen Golf 1.5 TSI Style")
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.bookings.v1:harris-cars")!).enquiries[0])
    expect(saved).toMatchObject({ itemId: "am-golf", itemKind: "vehicle", topic: "Volkswagen Golf 1.5 TSI Style" })
  })
}

test("large cards respect section width inside a desktop columns layout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(`/appearance/frame?scenario=brookfield&o=${encodeURIComponent(JSON.stringify({ layout: { desktop: "columns", width: "wide" } }))}`)
  const cards = page.locator('.tp-product[data-kind="vehicle"]')
  await expect(cards).toHaveCount(3)
  const a = (await cards.nth(0).boundingBox())!, b = (await cards.nth(1).boundingBox())!
  expect(a.width).toBeGreaterThan(350)
  expect(b.y).toBeGreaterThan(a.y + a.height - 1)
  expect(Math.abs(a.x - b.x)).toBeLessThan(2)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test("an owner chooses Large cards with real previews, undo, redo and persistence", async ({ page }) => {
  await openEditorWithSample(page, "Car dealer")
  await openRow(page, "products")
  const frame = previewFrame(page)
  const stock = frame.locator('.tp-products').first()
  const before = await stock.getAttribute("data-variant")
  await page.getByRole("tab", { name: /Appearance/ }).click()
  await page.getByText("Large cards", { exact: true }).click()
  await expect(stock).toHaveAttribute("data-variant", "catalogue")
  await expect(page.frameLocator('iframe[title="Large cards section preview"]').locator('.tp-products').first()).toHaveAttribute("data-variant", "catalogue")
  await page.getByTestId("undo").click()
  await expect(stock).toHaveAttribute("data-variant", before!)
  await page.getByTestId("redo").click()
  await expect(stock).toHaveAttribute("data-variant", "catalogue")
  await page.reload()
  await expect(previewFrame(page).locator('.tp-products').first()).toHaveAttribute("data-variant", "catalogue")
})

test("a dealership viewing is a pending request until the business accepts it", async ({ page }) => {
  await page.goto("/appearance/frame?scenario=brookfield")
  await page.getByRole("button", { name: /^(Arrange|Book) a viewing$/ }).click()
  const flow = page.getByTestId("booking-flow")
  await flow.getByTestId("bk-service").first().click()
  await flow.getByTestId("bk-slot").first().click()
  await flow.getByRole("button", { name: /^Request this time/ }).click()
  await flow.getByRole("textbox", { name: "Your name", exact: true }).fill("Example viewer")
  await flow.getByRole("textbox", { name: "Email", exact: true }).fill("viewer@example.com")
  await flow.getByRole("button", { name: "Review", exact: true }).click()
  await expect(flow.getByTestId("bk-outcome")).toContainText("Pending request")
  await flow.getByRole("button", { name: "Send request", exact: true }).click()
  await expect(flow.getByTestId("bk-done")).toHaveAttribute("data-status", "pending")
  const booking = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.bookings.v1:harris-cars")!).bookings[0])
  expect(booking).toMatchObject({ serviceId: "bf-viewing", status: "pending" })
})
