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
    await expect(page.getByRole("radio", { name: "Paper", exact: true })).toHaveCount(0)
    await expect(page.getByTestId("setup-look")).not.toContainText("✓")
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

  test(`colours are curated palettes for the chosen look, kept across looks, reset and undone at ${width}`, async ({ page }) => {
    await toLook(page, width)
    // Looks and Colours are two different things: the toggle is there, and Colours is not the eight look cards again.
    await expect(page.getByRole("radiogroup", { name: "What to change" })).toBeVisible()
    await page.getByRole("radio", { name: "Black / ember", exact: true }).check({ force: true })
    await page.getByRole("radio", { name: "Colours", exact: true }).check({ force: true })
    const palettes = page.getByRole("radiogroup", { name: "Colours" }).getByRole("radio")
    await expect(palettes).toHaveCount(6) // the look's own plus five dark palettes
    await expect(page.getByRole("radio", { name: "Carbon / white", exact: true })).toHaveCount(0)
    await expect(page.getByRole("radio", { name: "This look’s own colours" })).toBeChecked()
    const own = (await state(page)).page.appearance.colors.background
    await page.getByRole("radio", { name: "Wine & rose", exact: true }).check({ force: true })
    let s = await state(page)
    expect(s.page.appearance.colors.background).toBe("#140a0f")
    expect(s.page.appearance.colors.accent).toBe("#f4a9c0")
    // The look's character stays: still the ember look's smoke effect, still moving.
    expect(s.page.appearance.background.kind).toBe("shader")
    expect(s.page.appearance.background.style).toBe("smoke")
    expect(s.page.appearance.background.motion).toBe(true)
    expect(s.page.themeId).toBe("noir")
    // A palette chosen on purpose stays when the look changes (same tone).
    await page.getByRole("radio", { name: "Looks", exact: true }).check({ force: true })
    await page.getByRole("radio", { name: "Plum / pearl", exact: true }).check({ force: true })
    s = await state(page)
    expect(s.page.appearance.colors.background).toBe("#140a0f")
    expect(s.page.themeId).toBe("maison")
    expect(s.page.appearance.background.style).toBe("orbs")
    // Into a look of the other tone the palette is not forced on: the new look uses its own colours.
    await page.getByRole("radio", { name: "Silver / ink", exact: true }).check({ force: true })
    s = await state(page)
    expect(s.page.appearance.colors.background).toBe("#e4e6ea")
    await expect(page.getByRole("status")).toContainText("different tone")
    // Back on a dark look, choose a palette, then reset to the look's own and undo.
    await page.getByRole("radio", { name: "Black / ember", exact: true }).check({ force: true })
    await page.getByRole("radio", { name: "Colours", exact: true }).check({ force: true })
    await page.getByRole("radio", { name: "Forest & jade", exact: true }).check({ force: true })
    expect((await state(page)).page.appearance.colors.background).toBe("#0a130d")
    await page.getByRole("radio", { name: "This look’s own colours" }).check({ force: true })
    expect((await state(page)).page.appearance.colors.background).toBe(own)
    await page.getByRole("button", { name: "Undo last change" }).click()
    s = await state(page)
    expect(s.page.appearance.colors.background).toBe("#0a130d")
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
