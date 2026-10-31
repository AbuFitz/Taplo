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
const toLook = async (page: Page) => { await toName(page); await page.getByLabel("Business name", { exact: true }).fill("Fade Street Barbers"); await cont(page).click(); await expect(title(page)).toHaveText("Style your page.") }

test("the steps run in order with accessible bar-only progress", async ({ page }) => {
  await open(page)
  await expect(title(page)).toHaveText("What do you do?")
  await expect(page.getByRole("progressbar", { name: "Setup progress" })).toHaveAttribute("aria-valuenow", "1")
  await expect(page.getByTestId("setup-progress-text")).toHaveCount(0)
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
  await expect(title(page)).toHaveText("Your draft is ready.")
  await expect(page.getByRole("progressbar", { name: "Setup progress" })).toHaveAttribute("aria-valuenow", "7")
})

for (const [w, h, label] of [[390, 844, "844"], [390, 600, "600"]] as const) {
  test(`setup actions stay within the visible viewport at 390x${label}`, async ({ page }) => {
    await open(page, w, h)
    const measure = async () => {
      const sheet = await page.getByTestId("setup-sheet").boundingBox()
      expect(sheet).not.toBeNull()
      expect(sheet!.y).toBeGreaterThanOrEqual(0)
      expect(sheet!.y + sheet!.height).toBeLessThanOrEqual(h + 2)
      const action = cont(page)
      if (await action.count()) {
        await expect(action).toBeVisible()
        const button = await action.boundingBox()
        expect(button!.y).toBeGreaterThanOrEqual(0)
        expect(button!.y + button!.height).toBeLessThanOrEqual(h + 2)
      }
    }
    await measure()
    await toLook(page); await measure()
    await cont(page).click(); await measure()
    await cont(page).click(); await measure()
    await cont(page).click(); await measure()
    await page.getByRole("button", { name: /^Continue with/ }).click(); await measure()
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
  await page.getByRole("button", { name: "Skip", exact: true }).click()
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
  await page.waitForTimeout(900)
  expect(Math.round((await sheet.boundingBox())!.height)).toBeLessThan(150)
  await expect(grip).toHaveAccessibleName("Return to editing")
  await page.keyboard.press("Escape"); await page.waitForTimeout(900)
  expect(Math.round((await sheet.boundingBox())!.height)).toBeGreaterThan(400)
  await page.keyboard.press("ArrowUp"); await page.waitForTimeout(900)
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
  await expect(page.getByTestId("dev-route")).toContainText(/testing route/i)
  await expect(page.getByTestId("dev-route-note")).toContainText(/testing route/i)
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

test("the logo goes home and the draft stays on the same step", async ({ page }) => {
  await open(page)
  await toName(page)
  await page.getByLabel("Business name", { exact: true }).fill("North Street Barbers")
  await expect(page.getByTestId("setup-logo")).toHaveAttribute("href", "/")
  await expect(page.getByTestId("setup-exit")).toHaveCount(0)
  await page.getByTestId("setup-logo").click()
  await expect(page).toHaveURL(/localhost:\d+\/$/)
  await page.goto("/onboarding")
  await expect(title(page)).toHaveText("What’s it called?")
  await expect(page.getByLabel("Business name", { exact: true })).toHaveValue("North Street Barbers")
})

for (const width of [390, 1440]) {
  test(`a starting example and a plan from the address are kept, and never displace the current question at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto("/onboarding?from=jays-barbers&plan=pro", { waitUntil: "domcontentloaded" })
    await expect(page.getByTestId("from-example")).toBeVisible()
    await expect(page.getByTestId("plan-intent")).toContainText("Pro")
    await expect(title(page)).toBeInViewport({ ratio: 1 })
    const saved = await state(page)
    expect(saved.setupDrafts.planIntent).toBe("pro")
    expect(saved.content.identity.industryKey).toBeTruthy()
  })
}

test("a short viewport keeps the field and the action reachable without moving the page", async ({ page }) => {
  await open(page, 390, 480)
  await toName(page)
  const input = page.getByLabel("Business name", { exact: true })
  expect((await input.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  await expect(cont(page)).toBeInViewport()
  expect(await page.evaluate(() => scrollY)).toBe(0)
})

import AxeBuilder from "@axe-core/playwright"
for (const [w, h] of [[390, 844], [1440, 900]] as const) {
  test(`every step has no WCAG 2.1 A/AA violations and no horizontal scroll at ${w}`, async ({ page }) => {
    test.setTimeout(120000)
    await open(page, w, h)
    const check = async (label: string) => {
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()
      expect(axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })), label).toEqual([])
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label} overflow`).toBe(true)
    }
    await check("type")
    await toLook(page); await check("look")
    await cont(page).click(); await check("action")
    await cont(page).click(); await check("services")
    await cont(page).click(); await check("plan")
    await page.getByRole("button", { name: /^Continue with/ }).click(); await check("finish")
  })
}

test("every look is reachable whatever the business type, and choosing one changes the live page", async ({ page }) => {
  await open(page)
  const counts: number[] = []
  for (const kind of ["car-dealer", "cafe-placeholder"]) {
    if (kind === "cafe-placeholder") { await page.goto("/onboarding"); await page.evaluate((k) => localStorage.removeItem(k), K); await page.reload(); await page.getByTestId("tile-hospitality").click(); await cont(page).click(); await page.getByLabel("Business name", { exact: true }).fill("The Corner Cafe"); await cont(page).click() }
    else { await toLook(page); await page.getByRole("button", { name: "Back" }).click(); await page.getByRole("button", { name: "Back" }).click(); await page.getByTestId("tile-car-dealer").click(); await cont(page).click(); await cont(page).click() }
    await expect(title(page)).toHaveText("Style your page.")
    counts.push(await page.getByRole("radiogroup", { name: "Looks" }).getByRole("radio").count())
  }
  expect(counts[0]).toBeGreaterThanOrEqual(8)
  expect(counts[1]).toBe(counts[0])
  await page.getByRole("radiogroup", { name: "Looks" }).getByRole("radio", { name: "Ink" }).click()
  const frame = page.frameLocator('[data-testid="setup-live-page"]')
  await expect(frame.locator("[data-taplo-page]")).toHaveAttribute("data-tone", "dark")
})

test("on a very short screen the finish action is never covered", async ({ page }) => {
  for (const h of [420, 500]) {
    await open(page, 390, h)
    await toLook(page); await cont(page).click(); await cont(page).click(); await cont(page).click()
    await page.getByRole("button", { name: /^Continue with/ }).click()
    const btn = page.getByTestId("save-draft")
    await btn.scrollIntoViewIfNeeded()
    await expect(btn).toBeInViewport()
    const covered = await btn.evaluate((el) => { const r = el.getBoundingClientRect(); const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return !(top === el || el.contains(top)) })
    expect(covered, `Open Studio is reachable at 390x${h}`).toBe(false)
    await page.evaluate(() => localStorage.clear())
  }
})
