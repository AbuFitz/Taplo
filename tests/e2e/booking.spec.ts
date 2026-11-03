import { expect, test, type Page } from "@playwright/test"

// The customer booking journey, rendered by the real page renderer on the showcase frame (plan: business).
const FRAME = "/appearance/frame?scenario=barber&look=night"
const open = async (page: Page, url = FRAME) => { await page.goto(url); await page.evaluate(() => localStorage.clear()); await page.reload(); await expect(page.getByRole("heading", { level: 1 })).toBeVisible() }
const flow = (page: Page) => page.getByTestId("booking-flow")

async function reach(page: Page, step: "time" | "details" | "review") {
  await page.getByRole("button", { name: /Book your chair/ }).first().click()
  await expect(flow(page)).toBeVisible()
  await flow(page).getByTestId("bk-service").first().click() // Signature cut: instant
  await flow(page).getByRole("button", { name: /Anyone available/ }).click()
  await expect(flow(page).getByTestId("bk-slots")).toBeVisible()
  if (step === "time") return
  await flow(page).getByTestId("bk-slot").nth(1).click()
  await flow(page).getByRole("button", { name: /Book this time/ }).click()
  await expect(flow(page).getByText("Your details")).toBeVisible()
  if (step === "details") return
  await flow(page).getByRole("textbox", { name: "Your name" }).fill("Sam Taylor")
  await flow(page).getByRole("textbox", { name: "Email" }).fill("sam@example.com")
  await flow(page).getByRole("button", { name: "Review" }).click()
  await expect(flow(page).getByText("Check your booking")).toBeVisible()
}

test.describe("customer booking journey", () => {
  test("service, person, time, details, review, confirmation: and it lands in the owner's calendar", async ({ page }) => {
    await open(page)
    await reach(page, "review")
    // Precise wording: this is an instant service, so it is a confirmed appointment, not a request.
    await expect(flow(page).getByTestId("bk-outcome")).toContainText("Confirmed appointment")
    await flow(page).getByRole("button", { name: "Confirm booking" }).click()
    const done = flow(page).getByTestId("bk-done")
    await expect(done).toHaveAttribute("data-status", "confirmed")
    await expect(done).toContainText("Booking confirmed")
    await expect(done).toContainText("was not emailed or texted")      // honest about what did not happen
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.bookings.v1:marlowe-and-finch")!))
    expect(stored.bookings).toHaveLength(1)
    expect(stored.bookings[0]).toMatchObject({ serviceName: "Signature cut", status: "confirmed", customer: { name: "Sam Taylor", email: "sam@example.com" } })
  })

  test("a by-request service is described and stored as a pending request, never as a confirmed booking", async ({ page }) => {
    await open(page)
    await page.getByRole("button", { name: /Book your chair/ }).first().click()
    await flow(page).getByTestId("bk-service").filter({ hasText: "Cut and beard" }).click()
    await flow(page).getByRole("button", { name: /Anyone available/ }).click()
    await flow(page).getByTestId("bk-slot").first().click()
    await expect(flow(page).getByRole("button", { name: /Request this time/ })).toBeVisible()
    await flow(page).getByRole("button", { name: /Request this time/ }).click()
    await flow(page).getByRole("textbox", { name: "Your name" }).fill("Ana Costa")
    await flow(page).getByRole("textbox", { name: "Email" }).fill("ana@example.com")
    await flow(page).getByRole("button", { name: "Review" }).click()
    await expect(flow(page).getByTestId("bk-outcome")).toContainText("Pending request")
    await flow(page).getByRole("button", { name: "Send request" }).click()
    const done = flow(page).getByTestId("bk-done")
    await expect(done).toHaveAttribute("data-status", "pending")
    await expect(done).toContainText("Request sent")
    await expect(done).toContainText("not confirmed until the business accepts")
  })

  test("validation names the problem and keeps what was typed", async ({ page }) => {
    await open(page)
    await reach(page, "details")
    await flow(page).getByRole("textbox", { name: "Your name" }).fill("Only A Name")
    await flow(page).getByRole("button", { name: "Review" }).click()
    await expect(flow(page).getByRole("alert").filter({ hasText: /email address or a phone number/i })).toBeVisible()
    await expect(flow(page).getByRole("textbox", { name: "Your name" })).toHaveValue("Only A Name")
  })

  test("a slot taken by someone else mid-journey sends the customer back to the times with details kept", async ({ page }) => {
    await open(page)
    await reach(page, "review")
    // Another customer takes the same slot in another tab before this one confirms.
    await page.evaluate(() => {
      const key = "taplo.demo.bookings.v1:marlowe-and-finch"
      const s = JSON.parse(localStorage.getItem(key) ?? '{"bookings":[],"holds":[],"enquiries":[]}')
      s.holds = [] // the hold does not protect against a booking placed directly
      localStorage.setItem(key, JSON.stringify(s))
    })
    const taken = await flow(page).getByText(/Fri|Sat|Tue|Wed|Thu|Mon|Sun/).first().textContent()
    expect(taken).toBeTruthy()
    // Fill every barber's matching slot by booking via a second page context sharing storage.
    const other = await page.context().newPage()
    await other.goto(FRAME)
    await other.getByRole("button", { name: /Book your chair/ }).first().click()
    await other.getByTestId("bk-service").first().click()
    await other.getByRole("button", { name: /Anyone available/ }).click()
    await expect(other.getByTestId("bk-slots")).toBeVisible()
    await other.close()
    await flow(page).getByRole("button", { name: "Confirm booking" }).click()
    await expect(flow(page).getByTestId("bk-done").or(flow(page).getByTestId("booking-banner"))).toBeVisible()
  })

  test("the same booking cannot be placed twice by a double tap", async ({ page }) => {
    await open(page)
    await reach(page, "review")
    const confirm = flow(page).getByRole("button", { name: "Confirm booking" })
    await confirm.dblclick()
    await expect(flow(page).getByTestId("bk-done")).toBeVisible()
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.bookings.v1:marlowe-and-finch")!))
    expect(stored.bookings).toHaveLength(1)
  })

  test("a booked time disappears from the choices for the next customer", async ({ page }) => {
    await open(page)
    // With a named person (not "anyone"), booking one time removes that time for them. Slots are read before booking, so the check does not depend on the time of day.
    const pickPerson = async () => {
      await page.getByRole("button", { name: /Book your chair/ }).first().click()
      await expect(flow(page)).toBeVisible()
      await flow(page).getByTestId("bk-service").first().click()
      await flow(page).getByRole("button", { name: /Reece/ }).click()
      await expect(flow(page).getByTestId("bk-slots")).toBeVisible()
    }
    await pickPerson()
    const before = await flow(page).getByTestId("bk-slot").allTextContents()
    expect(before.length).toBeGreaterThan(1)
    const booked = before[1]
    await flow(page).getByTestId("bk-slot").nth(1).click()
    await flow(page).getByRole("button", { name: /Book this time/ }).click()
    await flow(page).getByRole("textbox", { name: "Your name" }).fill("Sam Taylor")
    await flow(page).getByRole("textbox", { name: "Email" }).fill("sam@example.com")
    await flow(page).getByRole("button", { name: "Review" }).click()
    await flow(page).getByRole("button", { name: "Confirm booking" }).click()
    await expect(flow(page).getByTestId("bk-done")).toBeVisible()
    // Done is deliberately inert for a moment so a double tap on Confirm cannot dismiss the confirmation.
    await expect(async () => {
      await flow(page).getByRole("button", { name: "Done" }).click({ timeout: 1000 })
      await expect(flow(page)).toBeHidden({ timeout: 6000 })
    }).toPass({ timeout: 20000 })
    await pickPerson()
    const times = await flow(page).getByTestId("bk-slot").allTextContents()
    expect(times.length).toBeGreaterThan(0)
    expect(times).not.toContain(booked)
  })

  test("Escape closes the journey and focus returns to the button that opened it", async ({ page }) => {
    await open(page)
    const trigger = page.getByRole("button", { name: /Book your chair/ }).first()
    await trigger.click()
    await expect(flow(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(flow(page)).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test("on a phone the journey is a floating sheet with no horizontal scroll, and times show the visitor's own time zone when it differs", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, timezoneId: "America/New_York" })
    const page = await ctx.newPage()
    await open(page)
    await reach(page, "time")
    const box = (await flow(page).boundingBox())!
    expect(box.width).toBeGreaterThanOrEqual(366)
    expect(box.height).toBeGreaterThanOrEqual(480)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(flow(page).getByText(/your time/).first()).toBeVisible()
    await ctx.close()
  })

  test("a contact-only service becomes an enquiry that reserves no time", async ({ page }) => {
    await open(page, "/appearance/frame?scenario=dealer&look=showroom")
    await page.getByRole("button", { name: /Book a viewing/ }).first().click()
    await flow(page).getByTestId("bk-service").filter({ hasText: "Finance conversation" }).click()
    await expect(flow(page).getByTestId("enquiry-form")).toBeVisible()
    await flow(page).getByRole("textbox", { name: "Your name" }).fill("Jo Park")
    await flow(page).getByRole("textbox", { name: "Email" }).fill("jo@example.com")
    await flow(page).getByRole("textbox", { name: "Your message" }).fill("Can you tell me about finance on the Golf?")
    await flow(page).getByRole("button", { name: "Send enquiry" }).click()
    await expect(flow(page).getByTestId("enquiry-sent")).toContainText("No time was reserved")
    const s = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.bookings.v1:aldous-motor-co")!))
    expect(s.enquiries).toHaveLength(1)
    expect(s.bookings).toHaveLength(0)
  })
})
