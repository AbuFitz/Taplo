import { test, expect, type Page } from "@playwright/test"
import { cont } from "./helpers"
import { recommendArrangement } from "../../src/features/page/themes/arrangement"

const COMBOS = [
  { id: "none", logo: false, cover: false },
  { id: "logo", logo: true, cover: false },
  { id: "cover", logo: false, cover: true },
  { id: "both", logo: true, cover: true },
] as const
const NAMES = { short: "Finch", long: "Marlowe & Finch Chartered Surveyors and Valuers" }
const img = (src: string, alt: string) => ({ src, alt, width: 600, height: 600 })

async function seed(page: Page, combo: (typeof COMBOS)[number], name: string) {
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await page.getByLabel("Business name", { exact: true }).fill(name)
  await cont(page, { keepLook: true })
  await page.evaluate(({ logo, cover }) => {
    const s = JSON.parse(localStorage.getItem("taplo.demo.v2")!)
    s.content.identity.logo = logo ? { src: "/logo/apple-touch-icon.png", alt: "Logo", width: 180, height: 180 } : undefined
    s.content.identity.heroImage = cover ? { src: "/photography/barber.webp", alt: "Cover", width: 1200, height: 800 } : undefined
    localStorage.setItem("taplo.demo.v2", JSON.stringify(s))
  }, { logo: combo.logo, cover: combo.cover })
  await page.reload({ waitUntil: "networkidle" })
}

for (const width of [320, 390, 430, 1440]) for (const [nameKey, name] of Object.entries(NAMES)) for (const combo of COMBOS) {
  test(`${combo.id} assets with a ${nameKey} name use the suggested arrangement cleanly at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 800 : 950 })
    await seed(page, combo, name)
    // The suggestion follows the pictures and is a suggestion: the page keeps its own arrangement until it is chosen.
    const want = recommendArrangement({ name, logo: combo.logo ? (img("/x", "x") as never) : undefined, heroImage: combo.cover ? (img("/y", "y") as never) : undefined })
    const before = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).page.appearance.header.layout)
    expect(before).not.toBe("")
    await page.getByTestId("more-styling").locator("summary").click({ force: true })
    await expect(page.getByTestId("arrangement-suggestion")).toContainText(want.why)
    if (before !== want.id) await page.getByTestId("arrangement-suggestion").getByRole("button", { name: "Use this" }).click()
    const frame = page.frameLocator('iframe[data-testid="setup-live-page"]:visible').first()
    await expect(frame.locator("[data-taplo-page]")).toHaveAttribute("data-header", want.id, { timeout: 15000 })
    await page.waitForTimeout(700)
    const root = frame.locator("[data-taplo-page]")
    const h1 = frame.getByRole("heading", { level: 1 })
    await expect(h1).toBeVisible()
    const fits = await root.evaluate((el) => {
      const w = el.ownerDocument.documentElement.clientWidth
      const box = el.querySelector("h1")!.getBoundingClientRect()
      const wide = [...el.querySelectorAll("*")].filter((n) => { const r = (n as HTMLElement).getBoundingClientRect(); return r.width > 0 && r.right > w + 1 && getComputedStyle(n).position !== "fixed" && !(n as HTMLElement).closest("[aria-hidden=true]") }).length
      return { h1Inside: box.left >= -1 && box.right <= w + 1, wide, empty: [...el.querySelectorAll("img")].filter((i) => !i.getAttribute("src")).length }
    })
    expect(fits.h1Inside, "name stays inside the page").toBe(true)
    expect(fits.wide, "nothing spills sideways").toBe(0)
    expect(fits.empty, "no empty image boxes").toBe(0)
    if (width === 390 || width === 1440) await page.locator(".setup-canvas").first().screenshot({ path: `docs/review/arrangements/${combo.id}-${nameKey}-${width}.png` }).catch(() => undefined)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
