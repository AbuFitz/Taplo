import { test, type Page } from "@playwright/test"
import { cont, openDetails } from "./helpers"
import { COLOURWAYS } from "../../src/features/page/themes/colourways"

// Evidence generator for the follow-up review. Run with TAPLO_SHOTS=1; it does not assert, it photographs the real app.
test.skip(!process.env.TAPLO_SHOTS, "evidence only")
const dir = "docs/review/followup"
const settle = (p: Page) => p.waitForTimeout(1300)

for (const [w, h] of [[390, 844], [1440, 950]] as const) {
  test(`eight colourways on the real page at ${w}`, async ({ browser }) => {
    test.setTimeout(240_000)
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: w < 600, hasTouch: w < 600 })
    const page = await ctx.newPage()
    await page.goto("/onboarding", { waitUntil: "networkidle" })
    await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
    await cont(page, { keepLook: true })
    await page.getByRole("radio", { name: "Colours", exact: true }).check({ force: true })
    for (const cw of COLOURWAYS) {
      await page.getByRole("radio", { name: cw.name, exact: true }).check({ force: true })
      await settle(page)
      await page.screenshot({ path: `${dir}/colour-${cw.id}-${w}.png` })
    }
  })
}

for (const w of [320, 375, 390, 430]) {
  test(`journey at ${w}`, async ({ browser }) => {
    test.setTimeout(240_000)
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    const page = await ctx.newPage()
    const snap = async (n: string) => { await settle(page); await page.screenshot({ path: `${dir}/journey-${n}-${w}.png` }) }
    await page.goto("/onboarding", { waitUntil: "networkidle" })
    await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch Chartered Surveyors"); await snap("1-name")
    await cont(page, { keepLook: true }); await snap("2-look")
    await cont(page); await page.getByRole("button", { name: "Barber", exact: true }).click(); await snap("3-category")
    await cont(page); await snap("4-goals")
    await cont(page); await snap("5-reach")
    await openDetails(page); await snap("6-details")
    await page.getByRole("button", { name: "Skip for now" }).click(); await snap("7-first-content")
    await page.getByRole("button", { name: "Skip for now" }).click(); await snap("8-plan")
    await cont(page); await snap("9-finish")
  })
}

test("desktop journey", async ({ browser }) => {
  test.setTimeout(240_000)
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 1.5 })).newPage()
  const snap = async (n: string) => { await settle(page); await page.screenshot({ path: `${dir}/desktop-${n}.png` }) }
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch"); await snap("1-name")
  await cont(page, { keepLook: true }); await snap("2-look")
  await cont(page); await snap("3a-category-before-choice")
  await page.getByRole("button", { name: "Barber", exact: true }).click(); await page.waitForTimeout(1600); await snap("3b-category-after-choice")
  await cont(page); await snap("4-goals")
  await cont(page); await snap("5-reach")
  await page.getByRole("button", { name: "Skip for now" }).click(); await snap("6-first-content")
  await page.getByRole("button", { name: "Skip for now" }).click(); await snap("7-plan")
  await cont(page); await snap("8-finish")
})
