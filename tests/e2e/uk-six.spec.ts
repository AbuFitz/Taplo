import { expect, test } from "@playwright/test"
import path from "node:path"

const businesses = [
  { scenario: "corner", name: "Corner Table Café", slug: "sunday-counter", route: "corner-table-cafe", desktop: "split" },
  { scenario: "oakfield", name: "Oakfield Home Repairs", slug: "fieldwork-home-care", route: "oakfield-home-repairs", desktop: "centered" },
  { scenario: "rowan", name: "Rowan Learning", slug: "rowan-learning", route: "rowan-learning", desktop: "split" },
]
for (const width of [390, 1440]) {
  test.describe(`${width}px new UK examples`, () => {
    test.use({ viewport: { width, height: 1000 }, hasTouch: width === 390, isMobile: width === 390, reducedMotion: "reduce" })
    for (const b of businesses) {
      test(`${b.name} has its own readable composition and current imagery`, async ({ page }) => {
        await page.goto(`/appearance/frame?scenario=${b.scenario}`)
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(b.name)
        await expect(page.locator('[data-taplo-page]')).toHaveAttribute("data-desktop", b.desktop)
        await expect.poll(() => page.locator('img').evaluateAll((imgs) => imgs.filter((i) => i.getBoundingClientRect().top < innerHeight).every((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0))).toBe(true)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        if (b.scenario === "oakfield" && width === 1440) expect((await page.getByTestId("service-open").first().boundingBox())!.y).toBeLessThan(650)
        await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `${b.scenario}-${width}.png`), fullPage: true })
        await page.goto(`/inspiration/${b.route}`)
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(b.scenario === "corner" ? "Counter" : b.scenario === "oakfield" ? "Fieldwork" : "Notebook")
        await expect(page.getByTestId("start-design").first()).toBeVisible()
      })
    }
    test("café menu and group enquiry reserve no appointment", async ({ page }) => {
      await page.goto('/appearance/frame?scenario=corner')
      await page.getByTestId("service-open").filter({ hasText: "Flat white" }).click()
      const detail = page.getByTestId("service-detail")
      await expect(detail).toContainText("£3.60")
      await expect(detail.getByRole("button", { name: "Book this", exact: true })).toHaveCount(0)
      await page.keyboard.press("Escape")
      const form = page.getByTestId("enquiry-form")
      await form.getByLabel("Your name").fill("Example visitor")
      await form.getByLabel("Email", { exact: true }).fill("visitor@example.com")
      await form.getByLabel("Your message").fill("Could a group of six visit on Saturday morning?")
      await form.getByRole("button", { name: "Send message" }).click()
      await expect(page.getByTestId("enquiry-sent")).toContainText("saved in this browser")
      const state = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.bookings.v1:sunday-counter")!))
      expect(state.enquiries).toHaveLength(1)
      expect(state.bookings).toHaveLength(0)
    })
    for (const scenario of ["oakfield", "rowan"]) {
      test(`${scenario} service ends as a pending request with its actual price`, async ({ page }) => {
        await page.goto(`/appearance/frame?scenario=${scenario}`)
        const name = scenario === "oakfield" ? "Small repairs visit" : "Introduction"
        if (scenario === "rowan") await page.locator('[data-widget="featuredService"]').getByRole("button", { name: "Request a time", exact: true }).click()
        else {
          await page.getByTestId("service-open").filter({ hasText: name }).first().click()
          await page.getByTestId("service-detail").getByRole("button", { name: "Request this", exact: true }).click()
        }
        const flow = page.getByTestId("booking-flow")
        await expect(flow.getByRole("heading", { name: "Choose a time" })).toBeVisible()
        await flow.getByTestId("bk-slot").first().click()
        await flow.getByRole("button", { name: /Request this time|Book this time/ }).click()
        await flow.getByLabel("Your name", { exact: true }).fill("Example visitor")
        await flow.getByLabel("Email", { exact: true }).fill("visitor@example.com")
        await flow.getByRole("button", { name: "Review", exact: true }).click()
        await expect(flow.getByTestId("bk-outcome")).toContainText(/request/i)
        await flow.getByRole("button", { name: /Send request|Request booking|Confirm request/ }).click()
        await expect(flow.getByTestId("bk-done")).toHaveAttribute("data-status", "pending")
        const slug = businesses.find((b) => b.scenario === scenario)!.slug
        const state = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), `taplo.demo.bookings.v1:${slug}`)
        expect(state.bookings[0]).toMatchObject({ status: "pending", serviceName: name })
      })
    }
  })
}

for (const width of [390, 768, 1440]) {
  test(`wide feature keeps its photo and identity useful at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/appearance/frame?scenario=oakfield')
    const header = page.locator('.tp-header[data-layout="feature"]')
    await expect(header).toBeVisible()
    const photo = await header.locator('.tp-cover').boundingBox()
    const identity = await header.locator('.tp-cover-body').boundingBox()
    if (width === 390) expect(identity!.y).toBeGreaterThan(photo!.y + photo!.height)
    else expect(identity!.x).toBeGreaterThan(photo!.x + photo!.width)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
