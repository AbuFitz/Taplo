import { test, expect, type Page } from "@playwright/test"
import { cont } from "./helpers"
import { COLOURWAYS } from "../../src/features/page/themes/colourways"

const state = (p: Page) => p.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!))
const frame = (p: Page) => p.frameLocator('iframe[data-testid="setup-live-page"]:visible').first()

async function toLook(page: Page, width: number) {
  await page.setViewportSize({ width, height: width < 600 ? 844 : 950 })
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
  await cont(page, { keepLook: true })
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose a look.")
}

for (const width of [390, 1440]) {
  test(`colours persist across looks, can be reset and undone, and nothing moves until chosen at ${width}`, async ({ page }) => {
    await toLook(page, width)
    // The first recommendation is still.
    const first = (await state(page)).page.appearance.background
    expect(first.motion ?? false).toBe(false)
    await expect(frame(page).locator(".tp-shader[data-active=true]")).toHaveCount(0)

    await page.getByRole("radio", { name: "Colours", exact: true }).check({ force: true })
    await page.getByRole("radio", { name: "Cobalt / ice" }).check({ force: true })
    let s = await state(page)
    expect(s.page.appearance.colors.background).toBe("#101b3b")
    expect(s.page.appearance.background.motion).toBe(false)
    expect(s.setupDrafts.colourway).toBe("cobalt")
    // Movement is offered, off, and only for a treatment that has something to move.
    const motion = page.getByLabel("Subtle background movement")
    await expect(motion).not.toBeChecked()
    await page.getByRole("radio", { name: "Carbon / white" }).check({ force: true })
    await expect(motion).toHaveCount(0)
    await page.getByRole("radio", { name: "Cobalt / ice" }).check({ force: true })

    // Changing the look keeps the chosen colours and the typeface of the new look.
    await page.getByRole("radio", { name: "Looks", exact: true }).check({ force: true })
    const other = page.getByRole("radiogroup", { name: "Looks" }).getByRole("radio").nth(1)
    await other.check({ force: true })
    s = await state(page)
    expect(s.page.appearance.colors.background).toBe("#101b3b")
    expect(s.setupDrafts.colourway).toBe("cobalt")

    // The new look's own palette is an explicit choice, and Undo brings the colours back.
    await page.getByRole("radio", { name: "Colours", exact: true }).check({ force: true })
    await page.getByRole("radio", { name: "This look’s own" }).check({ force: true })
    s = await state(page)
    expect(s.page.appearance.colors.background).not.toBe("#101b3b")
    expect(s.setupDrafts.colourway).toBeUndefined()
    await page.getByRole("button", { name: "Undo last change" }).click()
    s = await state(page)
    expect(s.page.appearance.colors.background).toBe("#101b3b")

    // Deliberate motion, on a colourway that can move.
    await motion.check()
    s = await state(page)
    expect(s.page.appearance.background.motion).toBe(true)
    expect(s.page.content ?? s.content).toBeTruthy()
    expect(s.content.identity.name).toBe("Marlowe & Finch")
  })

  test(`all eight colourways render on the real page with readable text at ${width}`, async ({ page }) => {
    test.setTimeout(240_000)
    await toLook(page, width)
    await page.getByRole("radio", { name: "Colours", exact: true }).check({ force: true })
    let prev = ""
    for (const cw of COLOURWAYS) {
      await page.getByRole("radio", { name: cw.name, exact: true }).check({ force: true })
      const root = frame(page).locator("[data-taplo-page]")
      await expect(root).toHaveAttribute("data-tone", cw.tone, { timeout: 15000 })
      const read = () => root.evaluate((el) => {
        const cs = getComputedStyle(el)
        return { bg: cs.getPropertyValue("--tp-background").trim().toLowerCase(), fg: cs.getPropertyValue("--tp-foreground").trim().toLowerCase() }
      })
      // The engine may derive the page colour from a gradient, so only solid colourways must match exactly; all must have changed.
      await expect.poll(async () => (await read()).bg, { timeout: 15000 }).not.toBe(prev)
      const seen = await read()
      prev = seen.bg
      if (cw.background.kind === "solid") expect(seen.bg).toBe(cw.colors.background!.toLowerCase())
      const lum = (hex: string) => { const n = parseInt(hex.slice(1), 16); const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255) }
      const a = lum(seen.fg), b = lum(seen.bg)
      expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toBeGreaterThanOrEqual(4.5)
      const art = page.locator(`input[aria-label="${cw.name}"]`)
      await expect(art).toBeChecked()
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}

test("the ending is honest: a draft, an account boundary, a testing route to Studio, nothing published", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
  await cont(page); await cont(page)
  await page.getByRole("button", { name: "Barber", exact: true }).click()
  await cont(page); await cont(page)
  await page.getByRole("button", { name: "Skip for now" }).click()
  await page.getByRole("button", { name: "Skip for now" }).click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Room to grow.")
  await cont(page)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Review your page")
  await expect(page.getByTestId("finish-step")).toBeVisible()
  await expect(page.getByRole("button", { name: /Publish/ })).toHaveCount(0)
  await expect(page.getByTestId("draft-note")).toContainText("Accounts aren’t connected")
  await expect(page.getByTestId("dev-route-note")).toContainText("Testing route")
  await expect(page.getByText(/saved to your account|account created|connected\./i)).toHaveCount(0)
  expect((await state(page)).published).toBeNull()
  await page.getByTestId("save-draft").click()
  await expect(page).toHaveURL(/\/dashboard/)
  const list = page.getByTestId("studio-checklist")
  await expect(list).toBeVisible()
  // A name is not missing just because there is no logo.
  await expect(list.getByRole("link", { name: /Name and web address/ })).toContainText("done")
  await expect(list.getByRole("link", { name: /Add a logo or profile picture/ })).toContainText("optional")
  expect((await state(page)).published).toBeNull()
})
