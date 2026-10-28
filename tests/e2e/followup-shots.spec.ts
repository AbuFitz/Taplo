import { test, type Page } from "@playwright/test"
import { cont } from "./helpers"
import { STARTING_LOOKS } from "../../src/features/page/themes/starting-looks"

// Evidence generator for the visual review. Run with TAPLO_SHOTS=1; it asserts nothing, it photographs the real app.
test.skip(!process.env.TAPLO_SHOTS, "evidence only")
const dir = "docs/review/followup"
const settle = (p: Page) => p.waitForTimeout(1500)
const mobile = (w: number, h = 844) => ({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })

for (const [w, h] of [[390, 844], [1440, 950]] as const) {
  test(`eight looks at ${w}`, async ({ browser }) => {
    test.setTimeout(300_000)
    const page = await (await browser.newContext(w < 600 ? mobile(w, h) : { viewport: { width: w, height: h }, deviceScaleFactor: 1.5 })).newPage()
    await page.goto("/onboarding", { waitUntil: "networkidle" })
    await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
    await cont(page, { keepLook: true }); await settle(page)
    await page.screenshot({ path: `${dir}/picker-top-${w}.png` })
    for (const look of STARTING_LOOKS) {
      await page.getByRole("radio", { name: look.name, exact: true }).check({ force: true })
      await settle(page); await page.waitForTimeout(900)
      await page.screenshot({ path: `${dir}/look-${look.id}-${w}.png` })
    }
    await page.getByTestId("setup-look").evaluate((el) => el.closest(".setup-step-body")!.scrollTo({ top: 99999 }))
    await settle(page); await page.screenshot({ path: `${dir}/picker-scrolled-${w}.png` })
    await page.getByTestId("adjust-colours").click(); await settle(page)
    await page.screenshot({ path: `${dir}/adjust-colours-${w}.png` })
  })
}

for (const w of [320, 375, 430]) {
  test(`journey at ${w}`, async ({ browser }) => {
    test.setTimeout(240_000)
    const page = await (await browser.newContext(mobile(w, 800))).newPage()
    await page.goto("/onboarding", { waitUntil: "networkidle" })
    await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch Chartered Surveyors")
    await settle(page); await page.screenshot({ path: `${dir}/journey-1-name-${w}.png` })
    await cont(page, { keepLook: true }); await settle(page); await page.screenshot({ path: `${dir}/journey-2-look-${w}.png` })
    await cont(page); await page.getByRole("button", { name: "Barber", exact: true }).click(); await settle(page); await page.screenshot({ path: `${dir}/journey-3-category-${w}.png` })
    await cont(page); await settle(page); await page.screenshot({ path: `${dir}/journey-4-goals-${w}.png` })
    await cont(page); await settle(page); await page.screenshot({ path: `${dir}/journey-5-reach-${w}.png` })
    await page.getByRole("button", { name: "Skip for now" }).click(); await settle(page); await page.screenshot({ path: `${dir}/journey-6-first-content-${w}.png` })
    await page.getByRole("button", { name: "Skip for now" }).click(); await settle(page); await page.screenshot({ path: `${dir}/journey-7-plan-${w}.png` })
    await page.getByRole("radio", { name: "Choose Pro" }).check({ force: true }); await settle(page); await page.screenshot({ path: `${dir}/journey-7b-plan-selected-${w}.png` })
    await cont(page); await page.waitForTimeout(450); await page.screenshot({ path: `${dir}/journey-8-reveal-${w}.png` })
    await page.waitForTimeout(2200); await page.screenshot({ path: `${dir}/journey-9-account-${w}.png` })
  })
}

test("keyboard and error states at 390", async ({ browser }) => {
  test.setTimeout(120_000)
  const page = await (await browser.newContext(mobile(390))).newPage()
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  const field = page.getByLabel("Business name", { exact: true })
  await field.focus(); await page.setViewportSize({ width: 390, height: 440 }); await settle(page)
  await page.screenshot({ path: `${dir}/keyboard-open-390.png` })
  await page.getByRole("button", { name: "Continue", exact: true }).click(); await settle(page)
  await page.screenshot({ path: `${dir}/keyboard-error-390.png` })
})

test("desktop journey and Studio handoff", async ({ browser }) => {
  test.setTimeout(240_000)
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 1.5 })).newPage()
  const snap = async (n: string) => { await settle(page); await page.screenshot({ path: `${dir}/desktop-${n}.png` }) }
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch"); await snap("1-name")
  await cont(page, { keepLook: true }); await snap("2-look")
  await cont(page); await snap("3a-category-before-choice")
  await page.getByRole("button", { name: "Barber", exact: true }).click(); await page.waitForTimeout(1800); await snap("3b-category-after-choice")
  await cont(page); await snap("4-goals")
  await cont(page); await snap("5-reach")
  await page.getByRole("button", { name: "Skip for now" }).click(); await snap("6-first-content")
  await page.getByRole("button", { name: "Skip for now" }).click(); await snap("7-plan")
  await cont(page); await page.waitForTimeout(500); await page.screenshot({ path: `${dir}/desktop-8-reveal.png` })
  await page.waitForTimeout(2300); await page.screenshot({ path: `${dir}/desktop-9-account.png` })
  await page.getByLabel("Email").fill("bad"); await page.getByLabel("Password").fill("123")
  await page.getByRole("button", { name: "Create account" }).click(); await snap("10-account-errors")
  await page.getByLabel("Email").fill("owner@example.com"); await page.getByLabel("Password").fill("correct horse battery")
  await page.getByRole("button", { name: "Create account" }).click(); await snap("11-account-unavailable")
  await page.getByTestId("save-draft").click(); await page.waitForURL(/dashboard/); await snap("12-studio")
})
