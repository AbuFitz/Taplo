import { test, expect, type Page } from "@playwright/test"
import { cont } from "./helpers"
import { STARTING_LOOKS } from "../../src/features/page/themes/starting-looks"

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
  test(`one collection of eight looks; the first recommendation is solid and still at ${width}`, async ({ page }) => {
    await toLook(page, width)
    const group = page.getByRole("radiogroup", { name: "Looks" })
    await expect(group.getByRole("radio")).toHaveCount(8)
    await expect(page.getByRole("radio", { name: "Colours", exact: true })).toHaveCount(0)
    await expect(page.getByRole("radio", { name: "Paper", exact: true })).toHaveCount(0)
    const first = (await state(page)).page.appearance.background
    expect(first.kind).toBe("solid")
    await expect(frame(page).locator(".tp-bg-gradient[data-animate=true]")).toHaveCount(0)
  })

  test(`gradient looks move when chosen, solid looks stay still, and reduced motion is still at ${width}`, async ({ page }) => {
    test.setTimeout(240_000)
    await toLook(page, width)
    for (const look of STARTING_LOOKS) {
      await page.getByRole("radio", { name: look.name, exact: true }).check({ force: true })
      const bg = (await state(page)).page.appearance.background
      if (look.animated) expect(bg.motion, `${look.name} moves`).toBe(true)
      else expect(bg.motion ?? false, `${look.name} is still`).toBe(false)
      await expect(frame(page).locator(".tp-bg-gradient")).toHaveAttribute("data-animate", look.animated ? "true" : "false", { timeout: 15000 })
    }
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.getByRole("radio", { name: "Black / ember", exact: true }).check({ force: true })
    await expect(frame(page).locator(".tp-shader")).toHaveAttribute("data-active", "false", { timeout: 15000 })
  })

  test(`adjusted colours are kept across looks, can be reset to the look's own, and undone at ${width}`, async ({ page }) => {
    await toLook(page, width)
    await page.getByRole("radio", { name: "Cobalt / ice", exact: true }).check({ force: true })
    await page.getByTestId("adjust-colours").click()
    await page.getByRole("radiogroup", { name: "Accent colour" }).locator("label").nth(1).click()
    await page.getByRole("button", { name: "Done", exact: true }).click()
    await expect(page.getByRole("dialog")).toBeHidden()
    let s = await state(page)
    expect(s.page.appearance.colors.accent).toBe("#0f766e")
    await page.getByRole("radio", { name: "Rose / warm white", exact: true }).check({ force: true })
    s = await state(page)
    expect(s.page.appearance.colors.accent).toBe("#0f766e")
    expect(s.page.appearance.colors.background).toBe("#f4e9e7")
    await page.getByTestId("adjust-colours").click()
    await page.getByRole("button", { name: "Use this look’s original colours" }).click()
    await page.getByRole("button", { name: "Done", exact: true }).click()
    await expect(page.getByRole("dialog")).toBeHidden()
    s = await state(page)
    expect(s.page.appearance.colors.accent).toBe("#79434e")
    await page.getByRole("button", { name: "Undo last change" }).click()
    s = await state(page)
    expect(s.page.appearance.colors.accent).toBe("#0f766e")
    expect(s.content.identity.name).toBe("Marlowe & Finch")
  })

  test(`all eight looks render on the real page with readable text at ${width}`, async ({ page }) => {
    test.setTimeout(240_000)
    await toLook(page, width)
    let prev = ""
    for (const look of STARTING_LOOKS) {
      await page.getByRole("radio", { name: look.name, exact: true }).check({ force: true })
      const root = frame(page).locator("[data-taplo-page]")
      await expect(root).toHaveAttribute("data-tone", look.colourway.tone, { timeout: 15000 })
      const read = () => root.evaluate((el) => { const cs = getComputedStyle(el); return { bg: cs.getPropertyValue("--tp-background").trim().toLowerCase(), fg: cs.getPropertyValue("--tp-foreground").trim().toLowerCase() } })
      await expect.poll(async () => (await read()).bg, { timeout: 15000 }).not.toBe(prev)
      const seen = await read()
      prev = seen.bg
      const lum = (hex: string) => { const n = parseInt(hex.slice(1), 16); const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255) }
      const a = lum(seen.fg), b = lum(seen.bg)
      expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), look.name).toBeGreaterThanOrEqual(4.5)
      await expect(page.locator(`input[aria-label="${look.name}"]`)).toBeChecked()
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
