import { test, expect, type Page } from "@playwright/test"
import { cont } from "./helpers"

const state = (p: Page) => p.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!))

async function toPlan(page: Page, width: number) {
  await page.setViewportSize({ width, height: width < 600 ? 844 : 950 })
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
  await cont(page); await cont(page)
  await page.getByRole("button", { name: "Barber", exact: true }).click()
  await cont(page); await cont(page)
  await page.getByRole("button", { name: "Skip for now" }).click()
  await page.getByRole("button", { name: "Skip for now" }).click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Room to grow.")
}

for (const width of [390, 1440]) {
  test(`plan then review and account entry, truthful about what is unavailable, at ${width}`, async ({ page }) => {
    await toPlan(page, width)
    // Free is chosen by default and stays easy to choose; selecting another plan opens its list.
    await expect(page.getByRole("radio", { name: "Choose Free", exact: true })).toBeChecked()
    await page.getByRole("radio", { name: "Choose Pro", exact: true }).check({ force: true })
    await expect(page.getByTestId("setup-plans").getByText("Online bookings")).toBeVisible()
    await cont(page)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Review your page")
    // Account entry: a real form, validation, and honest unavailability.
    await expect(page.getByTestId("draft-note")).toContainText("Accounts aren’t connected")
    await page.getByLabel("Email").fill("bad")
    await page.getByLabel("Password").fill("123")
    await page.getByRole("button", { name: "Create account" }).click()
    await expect(page.getByText("Enter an email address like name@example.com.")).toBeVisible()
    await expect(page.getByText("Use at least 8 characters.")).toBeVisible()
    await page.getByLabel("Email").fill("owner@example.com")
    await page.getByLabel("Password").fill("correct horse battery")
    await page.getByRole("button", { name: "Create account" }).click()
    await expect(page.getByTestId("account-failure")).toContainText("isn’t available in this environment")
    await expect(page.getByText(/account (created|connected)|draft saved/i)).toHaveCount(0)
    expect((await state(page)).published).toBeNull()
    expect((await state(page)).onboarded).toBe(false)
    // The labelled development route is the only way on, and it publishes nothing.
    await expect(page.getByTestId("dev-route")).toContainText("Development route")
    await page.getByTestId("save-draft").click()
    await expect(page).toHaveURL(/\/dashboard/)
    const list = page.getByTestId("studio-checklist")
    await expect(list.getByRole("link", { name: /Name and web address/ })).toContainText("done")
    await expect(list.getByRole("link", { name: /Add a logo or profile picture/ })).toContainText("optional")
    expect((await state(page)).published).toBeNull()
  })
}

test("the account step is there as soon as the page opens, with no loading sequence", async ({ page }) => {
  await toPlan(page, 390)
  await cont(page)
  await expect(page.getByTestId("account-step")).toBeVisible()
})
