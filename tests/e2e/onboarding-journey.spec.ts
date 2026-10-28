import { test, expect, type Page } from "@playwright/test"
import path from "node:path"
import { cont, openDetails } from "./helpers"

const OUT = process.env.TAPLO_REVIEW_DIR ?? "docs/review/onboarding"
const state = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!))
const snap = async (page: Page, name: string) => { if (process.env.TAPLO_SHEET) { await page.waitForTimeout(700); await page.screenshot({ path: path.join(OUT, `${name}.png`) }) } }
const preview = (page: Page) => page.frameLocator('iframe[title="Your page, live"]')

for (const width of [390, 1440]) {
  test.describe(`new journey at ${width}`, () => {
    test.use({ viewport: { width, height: width > 600 ? 900 : 844 } })

    test("a name alone makes a designed page; the look comes next; category never overwrites it; examples stay out of the saved business", async ({ page }) => {
      test.setTimeout(180_000)
      await page.goto("/onboarding", { waitUntil: "networkidle" })
      // 1 name: the field is there at once, no logo or photo needed
      const name = page.getByLabel("Business name", { exact: true })
      await expect(name).toBeVisible()
      await name.fill("Marlowe & Finch")
      await expect(preview(page).getByRole("heading", { level: 1 })).toHaveText("Marlowe & Finch")
      await snap(page, `${width}-1-name`)
      await cont(page)
      // 2 look: a strong look is already applied; pick another and recolour
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose a look.")
      const themes = page.getByRole("radiogroup", { name: "Starting theme" })
      await expect(themes.getByRole("radio").first()).toBeVisible()
      const before = (await state(page)).page.themeId
      const other = themes.getByRole("radio").nth(1)
      await other.check({ force: true })
      const chosen = (await state(page)).page.themeId
      expect(chosen).not.toBe(before)
      await snap(page, `${width}-2-look`)
      await cont(page)
      // 3 category: choosing one must not replace the chosen look; the descriptor is opt-in
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("What do you do?")
      await page.getByRole("button", { name: "Barber", exact: true }).click()
      expect((await state(page)).page.themeId).toBe(chosen)
      expect((await state(page)).content.identity.showCategory).toBe(false)
      await expect(preview(page).locator(".tp-meta")).not.toContainText("Barber")
      await page.getByLabel(/Show “Barber” under my name/).check()
      await expect(preview(page).locator(".tp-meta")).toContainText("Barber")
      await snap(page, `${width}-3-category`)
      // examples are visible in the draft but not in the saved business
      await expect(preview(page).getByText("Example").first()).toBeAttached()
      expect((await state(page)).content.services ?? []).toHaveLength(0)
      await cont(page)
      // 4 goals: intent only
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("What would you like customers to do?")
      await page.getByRole("button", { name: "Book an appointment" }).click()
      await page.getByRole("button", { name: "Get in touch" }).click()
      expect((await state(page)).setupDrafts.goals).toEqual(expect.arrayContaining(["book", "contact"]))
      await snap(page, `${width}-4-goals`)
      await cont(page)
      // 5 contact is skippable; 6 first content is skippable
      await expect(page.getByRole("button", { name: "Skip for now" })).toBeVisible()
      await page.getByRole("button", { name: "Skip for now" }).click()
      await page.getByRole("button", { name: "Skip for now" }).click()
      // 7 plan: Free is a real choice
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Room to grow.")
      await cont(page)
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Review your page")
      await snap(page, `${width}-5-review`)
    })
  })
}
