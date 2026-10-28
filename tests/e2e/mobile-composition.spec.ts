import { test, expect, type Page } from "@playwright/test"
import { cont } from "./helpers"

const box = async (p: Page, sel: string) => p.locator(sel).first().boundingBox()

for (const width of [320, 375, 430]) {
  test(`titles never cover their text, rings and labels stay clear of the footer, keyboard keeps the field and actions at ${width}`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width, height: 800 })
    await page.goto("/onboarding", { waitUntil: "networkidle" })
    const noOverlap = async (label: string) => {
      const h = await box(page, "#step-title"), body = await box(page, ".setup-step-body")
      expect(h && body && body.y >= h.y + h.height - 1, `${label}: the title ends before the content begins`).toBe(true)
      const gap = await page.evaluate(() => {
        const b = document.querySelector(".setup-step-body") as HTMLElement
        const first = [...b.querySelectorAll("p,label,button,input,li,h2,h3")].find((e) => (e as HTMLElement).checkVisibility({ checkVisibilityCSS: true }) && e.getBoundingClientRect().height > 0)!
        return first.getBoundingClientRect().top - b.getBoundingClientRect().top
      })
      expect(gap, `${label}: first line not scrolled under the title`).toBeGreaterThanOrEqual(-1)
    }
    const clearOfFooter = async (label: string) => {
      const gap = await page.evaluate(() => {
        const body = document.querySelector(".setup-step-body") as HTMLElement
        body.scrollTop = body.scrollHeight
        const foot = document.querySelector(".setup-next")!.getBoundingClientRect()
        const seen = [...body.querySelectorAll("button,input:not(.sr-only),label,li,p")].filter((e) => (e as HTMLElement).checkVisibility({ checkVisibilityCSS: true, contentVisibilityAuto: true }) && e.getBoundingClientRect().height > 0)
        const last = seen[seen.length - 1]!.getBoundingClientRect()
        body.scrollTop = 0
        return foot.top - last.bottom
      })
      expect(gap, `${label}: the last item ends above the action row`).toBeGreaterThanOrEqual(-1)
    }
    await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch Chartered Surveyors")
    await noOverlap("name"); await clearOfFooter("name")
    await cont(page, { keepLook: true })
    await noOverlap("look")
    // Select a look in the lower rows: its ring and label must sit inside the scrolling area, not under the footer.
    const radios = page.getByRole("radiogroup", { name: "Looks" }).getByRole("radio")
    await radios.nth(6).check({ force: true })
    await radios.nth(6).evaluate((el) => el.closest("label")!.scrollIntoView({ block: "nearest" }))
    const tile = await page.getByRole("radiogroup", { name: "Looks" }).locator("label").nth(6).boundingBox()
    const foot = await box(page, ".setup-next"), body = await box(page, ".setup-step-body")
    expect(tile && foot && tile.y + tile.height <= foot.y + 1, "selected tile and label end above the footer").toBe(true)
    expect(tile && body && tile.y >= body.y - 1, "selected tile starts below the title").toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await clearOfFooter("look")
    await cont(page); await noOverlap("category"); await clearOfFooter("category")
    await page.getByRole("button", { name: "Barber", exact: true }).click()
    await cont(page); await noOverlap("goals"); await clearOfFooter("goals")
    await cont(page); await noOverlap("reach"); await clearOfFooter("reach")
    // The previews stay partly visible on these steps (no unexplained switch to a full-white form).
    await expect(page.locator(".setup-canvas")).toBeVisible()
  })
}

test("with the keyboard open the field and the actions stay visible, and an error is not hidden", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  const field = page.getByLabel("Business name", { exact: true })
  await field.focus()
  await page.setViewportSize({ width: 390, height: 440 }) // an on-screen keyboard leaves about half the height
  await expect(page.locator("main.setup-flow")).toHaveAttribute("data-keyboard", "true")
  await expect(field).toBeInViewport()
  await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeInViewport()
  await page.getByRole("button", { name: "Continue", exact: true }).click()
  const alert = page.locator("#why-disabled")
  await expect(alert).toBeVisible()
  await expect(alert).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && scrollY === 0)).toBe(true)
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator("main.setup-flow")).toHaveAttribute("data-keyboard", "false")
})
