import { expect, test } from "@playwright/test"
import { openEditorWithSample, openRow, openSection, previewFrame, selectPart } from "./helpers"
import path from "node:path"

test("header choices render and update the owner's actual content without changing the saved layout", async ({ page }) => {
  await openEditorWithSample(page)
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).page)
  await selectPart(page, "header")
  for (const label of ["Compact", "Cover", "Wide feature", "Image hero", "Text-led"]) {
    const frame = page.frameLocator(`iframe[title="${label} header preview"]`)
    await expect(frame.locator(".tp-name")).toHaveText("Marlowe & Finch")
    await expect(frame.locator(".tp-widget")).toHaveCount(0)
  }
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).page)).toEqual(before)
  await openSection(page, "Your name and description")
  await page.getByLabel("Business name", { exact: true }).fill("Jay’s Barbers Test")
  for (const label of ["Compact", "Cover", "Wide feature", "Image hero", "Text-led"]) {
    await expect(page.frameLocator(`iframe[title="${label} header preview"]`).locator(".tp-name")).toHaveText("Jay’s Barbers Test")
  }
})

for (const width of [390, 1440]) {
  test.describe(`${width}px social editing`, () => {
  test.use({ viewport: { width, height: width === 390 ? 844 : 1000 }, hasTouch: width === 390, isMobile: width === 390 })
  test(`social profiles edit in place and section choices use real content at ${width}px`, async ({ page }) => {
    await openEditorWithSample(page)
    await openRow(page, "social")
    const form = page.getByTestId("social-links-editor")
    await expect(form.getByLabel("Instagram", { exact: true })).toHaveValue(/instagram/)
    const original = await form.getByLabel("Instagram", { exact: true }).inputValue()
    await form.getByLabel("Instagram", { exact: true }).fill("https://instagram.com/stationroadtest")
    await expect(previewFrame(page).getByRole("link", { name: "Instagram", exact: true })).toHaveAttribute("href", "https://instagram.com/stationroadtest")
    await page.getByTestId("undo").click()
    await expect(form.getByLabel("Instagram", { exact: true })).toHaveValue(original)
    await form.getByRole("button", { name: "Add YouTube profile" }).click()
    await expect(form.getByLabel("YouTube", { exact: true })).toBeFocused()
    await form.getByLabel("YouTube", { exact: true }).fill("https://youtube.com/@stationroadtest")
    await expect(previewFrame(page).getByRole("link", { name: "YouTube", exact: true })).toHaveAttribute("href", "https://youtube.com/@stationroadtest")
    await expect(previewFrame(page).locator('[data-widget="social"]')).toBeInViewport({ ratio: 0.5 })
    const icons = page.frameLocator('iframe[title="Icon row section preview"]')
    await expect(icons.getByRole("link", { name: "YouTube", exact: true })).toHaveAttribute("href", "https://youtube.com/@stationroadtest")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `social-editor-${width}.png`), fullPage: true })
  })
  })
}

test("booking configuration opens directly on hours and rules", async ({ page }) => {
  await openEditorWithSample(page)
  await openRow(page, "booking")
  await page.getByRole("link", { name: "Hours and booking rules" }).click()
  await expect(page.getByRole("tab", { name: "Hours and rules" })).toHaveAttribute("aria-selected", "true")
  await expect(page.getByRole("switch", { name: "Accept online bookings" })).toBeVisible()
})

test("direct service booking offers eligible people before times and solo Back navigates", async ({ page }) => {
  await page.goto("/appearance/frame?scenario=barber&look=night")
  await page.getByTestId("service-open").filter({ hasText: "Signature cut" }).click()
  await page.getByTestId("service-detail").getByRole("button", { name: "Book this", exact: true }).click()
  await expect(page.getByTestId("booking-flow").getByRole("heading", { name: "Who would you like to see?" })).toBeVisible()
  await page.goto("/appearance/frame?scenario=tutor&look=journal")
  await page.getByTestId("service-open").filter({ hasText: "Trial lesson" }).click()
  await page.getByTestId("service-detail").getByRole("button", { name: "Book this", exact: true }).click()
  const flow = page.getByTestId("booking-flow")
  await expect(flow.getByRole("heading", { name: "Choose a time" })).toBeVisible()
  await flow.getByRole("button", { name: "← Back", exact: true }).click()
  await expect(flow.getByRole("heading", { name: "What would you like to book?" })).toBeVisible()
})

test("vehicle context reaches the stored enquiry and owner view", async ({ page }) => {
  await openEditorWithSample(page, "Car dealer")
  await page.goto("/demo/preview")
  await page.locator('.tp-product[data-status="available"]').first().getByRole("button", { name: "Enquire about this car" }).click()
  await page.getByText("Send a message instead", { exact: true }).click()
  const form = page.getByTestId("enquiry-form")
  await expect(form.getByRole("combobox")).toHaveCount(0)
  await form.getByLabel("Your name").fill("Example viewer")
  await form.getByLabel("Email", { exact: true }).fill("viewer@example.com")
  await form.getByLabel("Your message").fill("Can I arrange a viewing of this car?")
  await form.getByRole("button", { name: "Send enquiry" }).click()
  await expect(page.getByTestId("enquiry-sent")).toContainText("Volvo XC40 Recharge")
  const enquiry = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.bookings.v1:aldous-motor-co")!).enquiries[0])
  expect(enquiry).toMatchObject({ topic: "Volvo XC40 Recharge", itemId: "v1", itemKind: "vehicle" })
  await page.goto("/dashboard/bookings?section=enquiries")
  await expect(page.getByTestId("enquiries")).toContainText("About: Volvo XC40 Recharge")
})
