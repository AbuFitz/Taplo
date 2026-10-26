import { expect, test } from "@playwright/test"
import path from "node:path"
import { openStructure } from "./helpers"

for (const width of [390, 1440]) {
  test.describe(`${width}px owner entry`, () => {
    test.use({ viewport: { width, height: 950 }, hasTouch: width === 390, isMobile: width === 390 })
    for (const name of ["Jay’s Barbers", "Detail Dept.", "Harris Cars"]) {
      test(`opens ${name} as an editable draft and keeps it after a reload`, async ({ page }) => {
        await page.goto("/dashboard")
        await expect(page.getByRole("heading", { name: "Set up your business page." })).toBeVisible()
        const pictures = page.locator('button[aria-label^="Try "] img')
        await expect(pictures).toHaveCount(6)
        await expect.poll(() => pictures.evaluateAll((imgs) => imgs.filter((i) => i.getBoundingClientRect().top < innerHeight).every((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0))).toBe(true)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        if (name === "Jay’s Barbers") await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `owner-welcome-${width}.png`), fullPage: true })
        await page.getByRole("button", { name: `Try ${name}`, exact: true }).click()
        await page.waitForURL("**/dashboard/page")
        await expect(page.getByTestId("my-page")).toBeVisible()
        const content = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content)
        expect(content.identity.name).toBe(name)
        await page.reload()
        expect(await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content)).toEqual(content)
        await openStructure(page)
        await page.getByTestId("add-widget").click()
        const panel = page.getByTestId("add-content")
        const kind = name === "Harris Cars" ? "vehicles" : "prices"
        const card = panel.locator(`[data-choice-id="${kind}"]`).first()
        await expect(card).not.toContainText("saved records")
        await expect(card).toContainText("Uses your")
        if (kind === "vehicles") await expect(card.locator("img").first()).toBeVisible()
        else await expect(card).toContainText(content.services[0].name)
        if (name === "Jay’s Barbers") { await page.waitForTimeout(350); await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `owner-content-${width}.png`), fullPage: true }) }
      })
    }
  })
}

test("dashboard shows current preview appointments rather than a fixed empty message", async ({ page }) => {
  await page.goto("/dashboard")
  await page.getByRole("button", { name: "Try Jay’s Barbers" }).click()
  await page.waitForURL("**/dashboard/page")
  await page.evaluate(() => {
    const draft = JSON.parse(localStorage.getItem("taplo.demo.v2")!)
    const startsAt = Date.now() + 86400000
    const base = { id: "dashboard-test", serviceId: draft.content.services[0].id, serviceName: "Haircut preview", staffId: "", startsAt, endsAt: startsAt + 1800000, blockStart: startsAt, blockEnd: startsAt + 1800000, status: "pending", mode: "request", customer: { name: "Test customer", email: "test@example.com" }, durationMinutes: 30, priceLabel: "£22", createdAt: Date.now(), expiresAt: startsAt, idempotencyKey: "dashboard-test", manageToken: "test-token" }
    localStorage.setItem(`taplo.demo.bookings.v1:${draft.content.identity.slug}`, JSON.stringify({ bookings: [base, { ...base, id: "cancelled", serviceName: "Cancelled appointment", status: "cancelled" }], enquiries: [], holds: [] }))
  })
  await page.goto("/dashboard")
  const upcoming = page.getByTestId("upcoming-bookings")
  await expect(upcoming).toContainText("Haircut preview")
  await expect(upcoming).toContainText("1 awaiting your reply")
  await expect(upcoming).not.toContainText("Cancelled appointment")
  await expect(upcoming.getByRole("link", { name: "Open bookings" })).toHaveAttribute("href", "/dashboard/bookings")
})
