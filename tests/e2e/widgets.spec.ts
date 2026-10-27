import { expect, test, type Page } from "@playwright/test"
import jsQR from "jsqr"

const FRAME = (s = "barber", look = "night") => `/appearance/frame?scenario=${s}&look=${look}`
const open = async (page: Page, url: string) => { await page.goto(url); await page.evaluate(() => localStorage.clear()); await page.reload(); await expect(page.getByRole("heading", { level: 1 })).toBeVisible() }

test.describe("team", () => {
  test("compact swipe cards open an expanded profile with services, qualifications and booking with that person", async ({ page }) => {
    await open(page, FRAME())
    const cards = page.getByTestId("team-card")
    await expect(cards).toHaveCount(3)
    await cards.first().getByRole("button", { name: /View profile/ }).click()
    const profile = page.getByTestId("team-profile")
    await expect(profile).toBeVisible()
    await expect(profile).toContainText("Jonah Marlowe")
    await expect(profile).toContainText("Services Jonah provides")
    await expect(profile).toContainText("Twelve years cutting hair")
    await expect(profile).toContainText(/Works .*Tue/)
    await expect(profile).not.toContainText("@")                         // no private contact details
    await profile.getByRole("button", { name: /Book with Jonah/ }).click()
    await expect(page.getByTestId("team-profile")).toBeHidden()          // one overlay at a time
    const flow = page.getByTestId("booking-flow")
    await expect(flow).toBeVisible()
    await expect(flow.getByText("What would you like to book?")).toBeVisible()   // opened for Jonah: his services only
    await expect(flow.getByTestId("bk-service").first()).toBeVisible()
  })

  test("a person is only offered for the services they provide", async ({ page }) => {
    await open(page, FRAME())
    await page.getByRole("button", { name: /Book your chair/ }).first().click()
    await page.getByTestId("bk-service").filter({ hasText: "Junior cut" }).click()    // Reece does not do junior cuts
    const flow = page.getByTestId("booking-flow")
    await expect(flow.getByRole("button", { name: /Jonah Marlowe/ })).toBeVisible()
    await expect(flow.getByRole("button", { name: /Mira Okoye/ })).toBeVisible()
    await expect(flow.getByRole("button", { name: /Reece Finch/ })).toHaveCount(0)
  })

  test("the list variant keeps every person to one compact row", async ({ page }) => {
    await open(page, FRAME("trades", "colour"))
    const rows = page.locator(".tp-team-row")
    await expect(rows).toHaveCount(2)
    const h = (await rows.first().boundingBox())!.height
    expect(h).toBeLessThan(110)
  })
})

test.describe("swipe collections", () => {
  test("show that there is more, scroll by button and arrow key, never autoplay, and keep keyboard reachability", async ({ browser }) => {
    // At desktop width three cards fit and there is nothing to scroll, so use a phone-width frame.
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await ctx.newPage()
    await open(page, FRAME())
    const coll = page.locator(".tp-collection").first()
    await expect(coll.locator(".tp-collection-count")).toContainText(/of [2-9]/)
    const track = coll.locator(".tp-collection-track")
    await track.focus()
    await page.keyboard.press("ArrowRight")
    await expect.poll(() => track.evaluate((e) => e.scrollLeft)).toBeGreaterThan(0)
    await page.keyboard.press("ArrowLeft")
    await expect.poll(() => track.evaluate((e) => e.scrollLeft)).toBeLessThan(2)
    await coll.getByRole("button", { name: /^Next in/ }).click()
    await expect.poll(() => track.evaluate((e) => e.scrollLeft)).toBeGreaterThan(0)
    await page.waitForTimeout(800)
    const x1 = await track.evaluate((e) => e.scrollLeft)
    await page.waitForTimeout(1500)
    expect(await track.evaluate((e) => e.scrollLeft)).toBe(x1)             // nothing moves by itself
    await expect(coll.getByRole("button", { name: /^Previous in/ })).toBeEnabled()
    await ctx.close()
  })
  test("vertical page scrolling still works over a swipe collection on touch", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    const page = await ctx.newPage()
    await open(page, FRAME())
    const track = page.locator(".tp-collection-track").first()
    expect(await track.evaluate((e) => getComputedStyle(e).touchAction)).not.toMatch(/none/)
    expect(await track.evaluate((e) => getComputedStyle(e).overflowY)).not.toBe("scroll")
    await ctx.close()
  })
})

test.describe("service detail, gallery, hours, enquiry, share", () => {
  test("a service opens a detail with exact price wording and the right next action", async ({ page }) => {
    await open(page, FRAME())
    await page.getByTestId("service-open").first().click()
    const d = page.getByTestId("service-detail")
    await expect(d).toContainText("Signature cut")
    await expect(d).toContainText("£34")
    await expect(d).toContainText("confirmed straight away")
    await expect(d.getByRole("button", { name: "Book this" })).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(d).toBeHidden()
  })
  test("a quote or contact-only service offers an enquiry, not a booking", async ({ page }) => {
    await open(page, FRAME("dealer", "showroom"))
    await page.getByTestId("service-open").filter({ hasText: "Finance conversation" }).click()
    const d = page.getByTestId("service-detail")
    await expect(d).toContainText("no time is reserved")
    await expect(d.getByTestId("enquiry-form")).toBeVisible()
  })

  test("gallery lightbox: arrows, keyboard, counter, zoom, Escape, and focus returns to the thumbnail", async ({ page }) => {
    await open(page, FRAME())
    const thumbs = page.getByTestId("gallery-open")
    await thumbs.nth(0).click()
    const lb = page.getByTestId("lightbox")
    await expect(lb).toBeVisible()
    await expect(lb).toContainText("1 of 3")
    await page.keyboard.press("ArrowRight")
    await expect(lb).toContainText("2 of 3")
    await lb.getByRole("button", { name: "Zoom to full size" }).click()
    await expect(lb.getByRole("button", { name: "Fit to screen" })).toBeVisible()
    await lb.getByRole("button", { name: "Next picture" }).click()
    await expect(lb).toContainText("3 of 3")
    await page.keyboard.press("Escape")
    await expect(lb).toBeHidden()
    await expect(thumbs.nth(0)).toBeFocused()   // the one that opened it, not the last picture viewed
  })

  test("opening hours highlight today and say whether the business is open now, in the business's own zone", async ({ page }) => {
    await open(page, FRAME())
    const now = page.getByTestId("open-now")
    await expect(now).toBeVisible()
    await expect(now).toHaveText(/(Open now · closes|Closed now)/)
    await expect(page.locator("[data-today]")).toHaveCount(1)
  })

  test("the inline contact form validates, keeps input, and confirms honestly", async ({ page }) => {
    await open(page, FRAME("trades", "colour"))
    const openEnquiry = page.locator('[data-widget="enquiry"] button'); if (await openEnquiry.count()) await openEnquiry.first().click()
    const form = page.getByTestId("enquiry-form")
    await form.getByRole("button", { name: /Send message/ }).click()
    await expect(form.getByRole("alert").first()).toBeVisible()
    await form.getByRole("textbox", { name: "Your name" }).fill("Ruth")
    await form.getByRole("textbox", { name: "Phone (optional)" }).fill("07700 900123")
    await form.getByRole("textbox", { name: "Your message" }).fill("My boiler is leaking, can you come tomorrow?")
    await form.getByRole("button", { name: /Send message/ }).click()
    await expect(page.getByTestId("enquiry-sent")).toContainText("No time was reserved")
    await expect(page.getByTestId("enquiry-sent")).toContainText("not emailed or texted")
  })

  test("simple sharing: a public example code and saved PNG open the same demo", async ({ page }) => {
    await open(page, FRAME());
    await page.getByRole("button", { name: /Share Marlowe/ }).click();
    const panel = page.getByTestId("share-panel");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("tab")).toHaveCount(0);
    await expect(panel.getByRole("radio")).toHaveCount(0);
    const url = await panel.locator("#share-url").inputValue();
    expect(url).toMatch(/\/appearance\/frame\?scenario=barber$/);
    await expect(panel.locator('[data-testid="qr-preview"] svg image')).toHaveCount(1);
    await panel.getByRole("button", { name: "Copy link", exact: true }).click();
    await expect(panel.getByRole("status")).toContainText(/copied|copy the link/);
    const [file] = await Promise.all([page.waitForEvent("download"), panel.getByRole("button", { name: "Save QR code", exact: true }).click()]);
    const sharp = (await import("sharp")).default;
    expect((await sharp(await file.path()).metadata()).width).toBe(1600);
    const {data,info} = await sharp(await file.path()).resize(512,512).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    expect(jsQR(new Uint8ClampedArray(data),info.width,info.height)?.data).toBe(url);
  });
  test("native share cancellation stays quiet", async ({page}) => {
    await page.addInitScript(() => Object.defineProperty(navigator, "share", {value:()=>Promise.reject(Object.assign(new Error("cancelled"),{name:"AbortError"})),configurable:true}));
    await open(page,FRAME());
    await page.getByRole("button", {name:"Share page",exact:true}).click();
    await page.getByRole("button", {name:"Share from this device",exact:true}).click();
    await expect(page.getByTestId("share-panel").getByRole("status")).toHaveText("");
  });
  test("native share is absent when unsupported, and a page without a share block still shares", async ({page}) => {
    await page.addInitScript(() => Object.defineProperty(navigator,"share",{value:undefined,configurable:true}));
    await open(page,FRAME("physio","open"));
    await expect(page.getByRole("link",{name:/Powered by Taplo.*Build your own/})).toHaveAttribute("href","/onboarding");
    await page.getByRole("button",{name:"Share page",exact:true}).click();
    await expect(page.getByRole("button",{name:"Share from this device",exact:true})).toHaveCount(0);
    await expect(page.getByTestId("share-panel").locator("#share-url")).toHaveValue(/scenario=physio$/);
  });

})

test.describe("products, status and payments", () => {
  test("vehicle status stays honest: reserved and sold are labelled, sold has no enquiry button, details open", async ({ page }) => {
    await open(page, FRAME("dealer", "showroom"))
    await expect(page.locator('.tp-product[data-status="reserved"] .tp-badge')).toHaveText("Reserved")
    const sold = page.locator('.tp-product[data-status="sold"]')
    await expect(sold).toContainText("Sold")
    await expect(sold.getByRole("button", { name: /Enquire/ })).toHaveCount(0)
    await page.locator('.tp-product[data-status="available"]').first().getByRole("button", { name: /View details/ }).first().click()
    await expect(page.getByRole("dialog")).toContainText("Year")
  })
  test("an affiliate link is disclosed and opens safely in a new tab", async ({ page }) => {
    await open(page, FRAME())
    const link = page.getByRole("link", { name: /View in shop: .* on example\.com/ })
    await expect(link).toHaveAttribute("rel", /sponsored/)
    await expect(link).toHaveAttribute("target", "_blank")
    await expect(page.getByText(/Affiliate link: .* may earn a commission/)).toBeVisible()
  })
  test("the payment block never shows on a public page while payments are not connected", async ({ page }) => {
    await page.goto(FRAME())
    await expect(page.locator('[data-widget="payment"]')).toHaveCount(0)
  })
})
