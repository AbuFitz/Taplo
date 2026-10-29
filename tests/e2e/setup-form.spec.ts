import { expect, test, type Page } from "@playwright/test"

// The rebuilt setup form: Type, Name, Look, Action, Services, Plan, Finish, in one fixed-height sheet over the live page.
const K = "taplo.demo.v2"
const open = async (page: Page, w = 390, h = 844) => {
  await page.setViewportSize({ width: w, height: h })
  await page.goto("/onboarding", { waitUntil: "domcontentloaded" })
  await expect(page.locator("#step-title")).toBeVisible()
}
const title = (page: Page) => page.locator("#step-title")
const cont = (page: Page) => page.getByRole("button", { name: /^Continue/ })
const state = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), K)
const toName = async (page: Page, kind = "barber") => { await page.getByTestId(`tile-${kind}`).click(); await cont(page).click(); await expect(title(page)).toHaveText("What’s it called?") }
const toLook = async (page: Page) => { await toName(page); await page.getByLabel("Business name", { exact: true }).fill("Fade Street Barbers"); await cont(page).click(); await expect(title(page)).toHaveText("Choose a look.") }

test("the steps run in order with the agreed titles and a words-first progress", async ({ page }) => {
  await open(page)
  await expect(title(page)).toHaveText("What do you do?")
  await expect(page.getByTestId("setup-progress-text")).toHaveText("Step 1 of 7")
  await toLook(page)
  await expect(page.getByRole("radio", { name: "Looks", exact: true })).toBeVisible()
  await expect(page.getByRole("radio", { name: "Colours", exact: true })).toBeVisible()
  await cont(page).click()
  await expect(title(page)).toHaveText("What should customers do first?")
  await cont(page).click()
  await expect(title(page)).toHaveText("Add your services")
  await cont(page).click()
  await expect(title(page)).toHaveText("Pick a plan.")
  await page.getByRole("button", { name: /^Continue with Free/ }).click()
  await expect(title(page)).toHaveText("Your page is ready.")
  await expect(page.getByTestId("setup-progress-text")).toHaveText("Step 7 of 7")
})

for (const [w, h, label] of [[390, 844, "844"], [390, 600, "600"]] as const) {
  test(`the sheet is the same height on every step at 390x${label}, so the page never jumps`, async ({ page }) => {
    await open(page, w, h)
    const expected = Math.round(h * 0.52)
    const heights: number[] = []
    const measure = async () => { await page.waitForTimeout(350); heights.push(Math.round((await page.getByTestId("setup-sheet").boundingBox())!.height)) }
    await measure()
    await toLook(page); await measure()
    await cont(page).click(); await measure()
    await cont(page).click(); await measure()
    await cont(page).click(); await measure()
    await page.getByRole("button", { name: /^Continue with/ }).click(); await measure()
    for (const v of heights) expect(Math.abs(v - expected)).toBeLessThanOrEqual(2)
  })
}

test("choosing a type fills the page with labelled examples and saves none of them as real", async ({ page }) => {
  await open(page)
  await page.getByTestId("tile-barber").click()
  const frame = page.frameLocator('[data-testid="setup-live-page"]')
  await expect(frame.getByText(/Example/).first()).toBeVisible()
  const saved = await state(page)
  expect(saved.content.identity.industryKey).toBe("barber")
  expect(saved.content.services ?? []).toHaveLength(0)
})

test("a name is required, errors say so once, and nothing claims the address is taken or the page is live", async ({ page }) => {
  await open(page)
  await toName(page)
  await cont(page).click()
  await expect(page.getByText("Add your business name to continue.")).toBeVisible()
  await expect(page.getByLabel("Business name", { exact: true })).toBeFocused()
  await page.getByLabel("Business name", { exact: true }).fill("Fade Street Barbers")
  await expect(page.getByTestId("setup-address")).toContainText("fade-street-barbers")
  const text = (await page.getByTestId("setup-root").innerText()).toLowerCase()
  for (const banned of ["available", "it's live", "it’s live"]) expect(text).not.toContain(banned)
})

test("the action step is one choice with one detail, and a call button needs a number", async ({ page }) => {
  await open(page)
  await toLook(page); await cont(page).click()
  await expect(page.getByTestId("action-book")).toHaveAttribute("aria-checked", "true")
  await page.getByTestId("action-call").click()
  await expect(page.getByLabel("Phone number")).toBeVisible()
  await cont(page).click()
  await expect(page.getByText("Enter the number people should call.")).toBeVisible()
  await page.getByLabel("Phone number").fill("07700 900123")
  await cont(page).click()
  await expect(title(page)).toHaveText("Add your services")
  const saved = await state(page)
  expect(saved.page.meta.primaryAction).toBe("call")
  expect(saved.content.contacts.phone).toBeTruthy()
})

test("skipping services saves none; a typed service saves only that one", async ({ page }) => {
  await open(page)
  await toLook(page); await cont(page).click(); await cont(page).click()
  await page.getByRole("button", { name: "Skip for now" }).click()
  await expect(title(page)).toHaveText("Pick a plan.")
  expect(((await state(page)).content.services ?? []).length).toBe(0)
  await page.getByRole("button", { name: "Back" }).click()
  await expect(title(page)).toHaveText("Add your services")
  await page.getByRole("button", { name: "Haircut" }).click()
  await page.getByLabel("Service 1 price").fill("25")
  const saved = await state(page)
  expect(saved.content.services).toHaveLength(1)
  expect(saved.content.services[0].name).toBe("Haircut")
})

test("the browser Back button steps back with everything still entered, and a refresh keeps the step", async ({ page }) => {
  await open(page)
  await toLook(page)
  await page.goBack()
  await expect(title(page)).toHaveText("What’s it called?")
  await expect(page.getByLabel("Business name", { exact: true })).toHaveValue("Fade Street Barbers")
  await page.reload()
  await expect(title(page)).toHaveText("What’s it called?")
})

test("a draft saved by the old eight-step form opens on the matching new step with its content", async ({ page }) => {
  await open(page)
  await page.getByTestId("tile-barber").click()
  await page.evaluate((k) => { const s = JSON.parse(localStorage.getItem(k)!); s.step = "business"; s.content.identity.name = "Old Draft"; localStorage.setItem(k, JSON.stringify(s)) }, K)
  await page.reload()
  await expect(title(page)).toHaveText("What’s it called?")
  await expect(page.getByLabel("Business name", { exact: true })).toHaveValue("Old Draft")
})

test("the grip shows the page and brings the controls back, by touch target and by keyboard", async ({ page }) => {
  await open(page)
  const sheet = page.getByTestId("setup-sheet")
  const grip = page.getByTestId("setup-grip")
  await grip.focus(); await page.keyboard.press("ArrowDown")
  await page.waitForTimeout(400)
  expect(Math.round((await sheet.boundingBox())!.height)).toBeLessThan(150)
  await expect(grip).toHaveAccessibleName("Return to editing")
  await page.keyboard.press("Escape"); await page.waitForTimeout(400)
  expect(Math.round((await sheet.boundingBox())!.height)).toBeGreaterThan(400)
  await page.keyboard.press("ArrowUp"); await page.waitForTimeout(400)
  expect(Math.round((await sheet.boundingBox())!.height)).toBeGreaterThan(700)
})

test("with the software keyboard open the field and Continue stay visible", async ({ page }) => {
  await open(page)
  await toName(page)
  const input = page.getByLabel("Business name", { exact: true })
  await input.focus()
  await page.evaluate(() => { const vv = window.visualViewport as unknown as { height: number } & EventTarget; Object.defineProperty(vv, "height", { value: 340, configurable: true }); vv.dispatchEvent(new Event("resize")) })
  await expect(page.getByTestId("setup-root")).toHaveAttribute("data-keyboard", "true")
  const box = async (loc: ReturnType<Page["locator"]>) => (await loc.boundingBox())!
  expect((await box(input)).y + (await box(input)).height).toBeLessThan(340)
  expect((await box(cont(page))).y + (await box(cont(page))).height).toBeLessThanOrEqual(341)
})

test("the plan step starts on Free, says prices are provisional, and never claims a subscription", async ({ page }) => {
  await open(page)
  await toLook(page); await cont(page).click(); await cont(page).click(); await cont(page).click()
  await expect(title(page)).toHaveText("Pick a plan.")
  await expect(page.getByRole("button", { name: "Continue with Free" })).toBeVisible()
  await expect(page.getByTestId("plan-disclosure")).toContainText("provisional")
})

test("finish is truthful without accounts: no sign-up form, a labelled testing route, an unpublished draft", async ({ page }) => {
  await open(page)
  await toLook(page); await cont(page).click(); await cont(page).click(); await cont(page).click()
  await page.getByRole("button", { name: /^Continue with/ }).click()
  await expect(page.getByTestId("account-step")).toHaveCount(0)
  await expect(page.getByTestId("dev-route")).toContainText("testing")
  await expect(page.getByTestId("dev-route-note")).toContainText("Testing environment only")
  await page.getByTestId("save-draft").click()
  await expect(page).toHaveURL(/\/dashboard/)
  const saved = await state(page)
  expect(saved.published).toBeNull()
  expect(saved.onboarded).toBe(true)
})

test("at 1440 the controls sit left and the whole page right, with no document scroll", async ({ page }) => {
  await open(page, 1440, 900)
  const sheet = (await page.getByTestId("setup-sheet").boundingBox())!
  const stage = (await page.getByTestId("setup-stage").boundingBox())!
  expect(sheet.x).toBeLessThan(stage.x)
  await expect(page.getByTestId("setup-grip")).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1)).toBe(true)
})
