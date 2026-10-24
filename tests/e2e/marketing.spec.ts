import { expect, test, type Page } from "@playwright/test"
import { PLAN_IDS } from "../../src/features/subscriptions/plans"
import { resolveEntitlements } from "../../src/features/subscriptions/entitlements"
import { PRODUCT_LINKS } from "../../src/features/marketing/ia"

const EXAMPLE_SLUGS = ["station-road-barbers", "parkside-valeting", "marlowe-and-finch", "hollin-physio", "pims-kitchen", "ada-okafor-maths", "forge-strength", "northgate-heating", "aldous-motor-co"]

// The marketing site: navigation, product pages, inspiration, pricing, the film and "start from this".
const noSideScroll = async (page: Page) => expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

test.describe("navigation", () => {
  test("Product opens a real menu from the keyboard; every entry is a real page; Escape closes and returns focus; Designs is a plain link", async ({ page }) => {
    await page.goto("/")
    const nav = page.getByRole("navigation", { name: "Primary" })
    const product = nav.getByRole("button", { name: "Product" })
    await product.focus()
    await page.keyboard.press("Enter")
    await expect(product).toHaveAttribute("aria-expanded", "true")
    for (const l of PRODUCT_LINKS) await expect(nav.getByRole("link", { name: new RegExp(`^${l.label}`) })).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(product).toHaveAttribute("aria-expanded", "false")
    await expect(product).toBeFocused()
    await page.keyboard.press("Tab")
    await expect(nav.getByRole("link", { name: "Designs" })).toBeFocused()
    await expect(nav.getByRole("link", { name: "Designs" })).toHaveAttribute("href", "/inspiration")
  })

  test("with a mouse, hovering opens a menu and moving away closes it", async ({ page }) => {
    await page.goto("/")
    const nav = page.getByRole("navigation", { name: "Primary" })
    await nav.getByRole("button", { name: "Product" }).hover()
    await expect(nav.getByRole("link", { name: /Everything Taplo does/ })).toBeVisible()
    await page.mouse.move(640, 700)
    await expect(nav.getByRole("link", { name: /Everything Taplo does/ })).toBeHidden()
  })

  test("the header offers Pricing, Log in and the one primary action", async ({ page }) => {
    await page.goto("/pricing")
    const header = page.locator("header").first()
    await expect(header.getByRole("link", { name: "Pricing" })).toHaveAttribute("aria-current", "page")
    await expect(header.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/dashboard")
    await expect(header.getByRole("link", { name: "Make your Taplo" })).toHaveAttribute("href", /\/onboarding|\/pricing/)
  })

  test("on a phone the menu is a sheet with sections, a visible primary action, Escape and focus return", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await ctx.newPage()
    await page.goto("/")
    const trigger = page.getByRole("button", { name: "Menu" })
    await trigger.click()
    const sheet = page.getByRole("dialog")
    await expect(sheet).toBeVisible()
    await sheet.getByText("Product", { exact: true }).click()
    await expect(sheet.getByRole("link", { name: "Booking" })).toBeVisible()
    await expect(sheet.getByRole("link", { name: "Make your Taplo" })).toBeInViewport()
    await page.keyboard.press("Escape")
    await expect(sheet).toBeHidden()
    await expect(trigger).toBeFocused()
    await ctx.close()
  })

  test("earlier marketing addresses still lead somewhere sensible", async ({ page }) => {
    await page.goto("/features/make-it-yours")
    await expect(page).toHaveURL(/\/product\/design$/)
    await page.goto("/for/car-dealers")
    await expect(page).toHaveURL(/\/inspiration\?industry=motoring$/)
  })
})

test.describe("product pages", () => {
  for (const l of PRODUCT_LINKS) {
    test(`${l.label}: loads, says what works today, and has no sideways scroll on a phone`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
      const page = await ctx.newPage()
      await page.goto(l.href)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      await expect(page.getByTestId("status").getByRole("listitem").first()).toBeVisible()
      await noSideScroll(page)
      await ctx.close()
    })
  }
  test("what is not connected is said in words, never implied", async ({ page }) => {
    await page.goto("/product/booking")
    const s = page.getByTestId("status")
    await expect(s).toContainText("Email or text confirmations")
    await expect(s).toContainText("Needs an email or text provider")
    await expect(s).toContainText("Deposits and payment")
    await expect(s).toContainText("Needs a payment provider")
  })
})

test.describe("inspiration", () => {
  test("every example has its own page with a live phone and a way to start from it", async ({ page }) => {
    for (const slug of EXAMPLE_SLUGS) {
      await page.goto(`/inspiration/${slug}`)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      await expect(page.locator("iframe")).toHaveCount(1)
      await expect(page.getByTestId("start-design")).toHaveAttribute("href", `/onboarding?from=${slug}`)
    }
  })
  test("the gallery leads with large previews, and filters narrow it by style and by what the page has", async ({ page }) => {
    await page.goto("/inspiration")
    const cards = page.getByTestId("design-card")
    await expect(cards).toHaveCount(EXAMPLE_SLUGS.length)
    // The first preview is above the fold, not behind an introduction.
    const top = (await cards.first().locator("img").first().boundingBox())!.y
    expect(top).toBeLessThan(900)
    await page.getByRole("button", { name: "Filters", exact: true }).click()
    await page.getByRole("button", { name: "Dark", exact: true }).click()
    const dark = await cards.count()
    expect(dark).toBeGreaterThan(0)
    expect(dark).toBeLessThan(EXAMPLE_SLUGS.length)
    await page.getByRole("button", { name: "Vehicles", exact: true }).click()
    await expect(cards).toHaveCount(0)             // no dark design has vehicle stock
    await page.getByRole("button", { name: "Dark", exact: true }).click()
    await expect(cards).toHaveCount(1)
    await expect(page.getByRole("heading", { name: "Showroom" })).toBeVisible()
    await page.getByRole("button", { name: "Clear filters" }).click()
    await expect(cards).toHaveCount(EXAMPLE_SLUGS.length)
  })
  test("industry never locks a design: 'Shown with' only changes the example business, and a deep link preselects it", async ({ page }) => {
    await page.goto("/inspiration?industry=food")
    await expect(page.getByLabel("Shown with")).toHaveValue("food")
    await expect(page.getByTestId("design-card")).toHaveCount(1)
    await expect(page.getByText("Every design works for any business.")).toBeVisible()
    await page.goto("/inspiration?industry=nonsense")
    await expect(page.getByTestId("design-card")).toHaveCount(EXAMPLE_SLUGS.length)
  })
  test("phone and desktop previews are two real captures of each page", async ({ page }) => {
    await page.goto("/inspiration")
    const first = page.getByTestId("design-card").first().locator("img").first()
    await expect(first).toHaveAttribute("src", /ex-station-road-barbers-phone/)
    await page.getByRole("radio", { name: "Desktop" }).check({ force: true })
    await expect(page.getByTestId("design-card").first().locator("img").first()).toHaveAttribute("src", /ex-station-road-barbers-desk/)
  })
  test("using a design on an existing page changes the look and arrangement only; the owner's content and widget order stay", async ({ page }) => {
    await page.goto("/dashboard")
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.getByRole("button", { name: /^Barber/ }).first().click()
    await page.waitForURL("**/dashboard/page")
    const before = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("taplo.demo.v2")!); return { content: s.content, order: s.page.widgets.map((w: { id: string }) => w.id), themeId: s.page.themeId } })
    await page.goto("/inspiration")
    await page.getByTestId("design-card").filter({ hasText: "Mono" }).getByTestId("apply-look").click()
    await page.waitForURL("**/dashboard/page")
    const after = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("taplo.demo.v2")!); return { content: s.content, order: s.page.widgets.map((w: { id: string }) => w.id), themeId: s.page.themeId, appearance: s.page.appearance } })
    expect(after.content).toEqual(before.content)
    expect(after.order).toEqual(before.order)
    expect(after.themeId).toBe("journal")
    expect(after.themeId).not.toBe(before.themeId)
    expect(after.appearance.layout.desktop).toBe("split")
    // The change is one undo away.
    await page.getByTestId("undo").click()
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).page.themeId)).toBe(before.themeId)
  })
  test("the live phone is the real page: its booking button opens the journey inside the frame", async ({ page }) => {
    await page.goto("/inspiration/marlowe-and-finch")
    const f = page.frameLocator("iframe")
    await f.getByRole("button", { name: /Book your chair/ }).first().click()
    await expect(f.getByTestId("booking-flow")).toBeVisible()
  })
  test("Start from this carries the look and content types, never the sample content, and a refresh keeps the owner's work", async ({ page }) => {
    await page.goto("/onboarding")
    await page.evaluate(() => localStorage.clear())
    await page.goto("/onboarding?from=hollin-physio&plan=pro")
    await expect(page.getByTestId("from-example")).toContainText("Hollin Physiotherapy")
    await expect(page.getByTestId("plan-intent")).toContainText("Pro")
    await page.getByLabel("Business name").fill("Ridgeway Physio")
    await page.getByRole("button", { name: "Continue" }).click()          // → what you do
    await expect(page.getByTestId("goal")).toBeVisible()
    await page.getByLabel("Phone (optional)").fill("01632 960987")
    await page.getByLabel("Phone (optional)").blur()
    await page.getByRole("button", { name: "Continue" }).click()          // → design
    await expect(page.getByTestId("look-picker").getByRole("radio", { name: /Mono/ })).toBeChecked()
    await expect(page.locator("section[aria-labelledby=step-title]")).not.toContainText("Hollin")
    await page.getByTestId("look-picker").getByText("Orchard").click()
    await page.reload()
    await expect(page.getByTestId("look-picker").getByRole("radio", { name: /Orchard/ })).toBeChecked()   // a refresh does not re-apply the example
  })
})

test.describe("pricing", () => {
  test("the comparison table is generated from the entitlements: it cannot claim what a plan does not allow", async ({ page }) => {
    await page.goto("/pricing")
    const table = page.getByTestId("plan-table")
    const row = (label: string) => table.getByRole("row").filter({ has: page.getByRole("rowheader", { name: label }) })
    for (const [i, id] of PLAN_IDS.entries()) {
      const e = resolveEntitlements(id, "active")
      const cell = row("Photo gallery").getByRole("cell").nth(i)
      await expect(cell).toContainText(e.gallery ? "Included" : "Not included")
      const book = row("Online bookings and requests").getByRole("cell").nth(i)
      await expect(book).toContainText(e.onlineBooking ? "Included" : "Not included")
    }
    await expect(page.locator("main")).not.toContainText(/full editor/i)
  })
  test("a plan's button carries it into setup", async ({ page }) => {
    await page.goto("/pricing")
    await page.getByRole("link", { name: "Start with Pro" }).click()
    await expect(page).toHaveURL(/\/onboarding\?plan=pro$/)
    await expect(page.getByTestId("plan-intent")).toContainText("Pro")
  })
})

test.describe("film", () => {
  test("never autoplays or loads until asked, and the story is written out beside it", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("video")).toHaveCount(0)
    await expect(page.getByRole("button", { name: /Play the 18-second film/ })).toBeVisible()
    await expect(page.getByText("Setting up is quick")).toBeVisible()
    await page.getByRole("button", { name: /Play the 18-second film/ }).click()
    const v = page.locator("video")
    await expect(v).toHaveCount(1)
    await expect(v).toHaveAttribute("controls", "")
    expect((await page.request.head("/marketing/film/taplo-intro.mp4")).ok()).toBe(true)
    expect((await page.request.head("/marketing/film/poster.webp")).ok()).toBe(true)
  })
})

test.describe("home and widths", () => {
  for (const w of [360, 390, 430, 768, 1024, 1280, 1536]) {
    test(`home, product, inspiration and pricing fit at ${w}px`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } })
      const page = await ctx.newPage()
      for (const u of ["/", "/product", "/inspiration", "/pricing", "/how-it-works"]) { await page.goto(u); await noSideScroll(page) }
      await ctx.close()
    })
  }
  test("the home page claims nothing that is not connected", async ({ page }) => {
    await page.goto("/")
    const t = (await page.locator("main").innerText()).toLowerCase()
    for (const bad of ["emailed to", "we email", "pay online", "secure payments", "go live", "trusted by", "thousands of"]) expect(t, bad).not.toContain(bad)
    await expect(page.locator("main")).toContainText("switch on when you connect messaging")
  })
})
