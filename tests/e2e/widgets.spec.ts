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
    await expect(coll.locator(".tp-collection-count")).toContainText("of 3")
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

  test("share: link, branded QR that decodes to the link, preview honesty, exported files decode", async ({ page }) => {
    await open(page, FRAME())
    await page.getByRole("button", { name: /Share Marlowe/ }).click()
    const panel = page.getByTestId("share-panel")
    await expect(panel).toBeVisible()
    await expect(panel.getByTestId("share-demo-note")).toContainText("only work in this browser")
    const url = await panel.locator("#share-url").inputValue()
    expect(url).toMatch(/\/demo\/p\/marlowe-and-finch$/)
    await panel.getByRole("button", { name: "Copy link" }).click()
    await expect(panel.getByRole("status")).toContainText(/copied|Press copy/)

    const sharp = (await import("sharp")).default
    // jsQR is a strict decoder that loses large images to its own thresholding, so a file is decoded at a camera-like working size (the dimensions are asserted on the file itself).
    const decodeFile = async (path: string, max = 512) => {
      const { data, info } = await sharp(path, { density: 144 }).resize(max, max, { fit: "inside", withoutEnlargement: true }).flatten({ background: "#ffffff" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
      return { text: jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data, w: info.width, h: info.height }
    }

    // The on-screen code: rasterise it as shown and decode it. Every business gets the Taplo mark in the middle.
    await expect(panel.locator('[data-testid="qr-preview"] svg image')).toHaveCount(1)
    const px = await panel.locator("[data-testid=qr-preview] svg").evaluate(async (svg) => {
      const s = new XMLSerializer().serializeToString(svg)
      const img = new Image(); img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`
      await img.decode()
      const c = document.createElement("canvas"); c.width = c.height = 520
      const ctx = c.getContext("2d")!; ctx.imageSmoothingEnabled = false; ctx.drawImage(img, 0, 0, 520, 520)
      return Array.from(ctx.getImageData(0, 0, 520, 520).data)
    })
    expect(jsQR(new Uint8ClampedArray(px), 520, 520)?.data).toBe(url)

    // Every export: file name, exact size and the destination it decodes to.
    const [dl] = await Promise.all([page.waitForEvent("download"), panel.getByRole("button", { name: /QR code · Screen/ }).click()])
    expect(dl.suggestedFilename()).toBe("marlowe-and-finch-preview-qr-1024px.png")
    expect((await decodeFile(await dl.path())).text, "screen PNG").toBe(url)
    expect((await sharp(await dl.path()).metadata()).width).toBe(1024)
    const [big] = await Promise.all([page.waitForEvent("download"), panel.getByRole("button", { name: /QR code · Print/ }).click()])
    expect(big.suggestedFilename()).toBe("marlowe-and-finch-preview-qr-3000px.png")
    const bf = await decodeFile(await big.path())
    expect(bf.text).toBe(url)
    expect((await sharp(await big.path()).metadata()).width).toBe(3000)

    const [svgDl] = await Promise.all([page.waitForEvent("download"), panel.getByRole("button", { name: /QR code · SVG/ }).click()])
    expect(svgDl.suggestedFilename()).toBe("marlowe-and-finch-preview-qr.svg")
    const svgText = (await import("node:fs")).readFileSync(await svgDl.path(), "utf8")
    expect(svgText).toContain('href="data:image/')          // the logo travels inside the file
    expect(svgText).not.toMatch(/href="https?:/)
    expect((await decodeFile(await svgDl.path())).text).toBe(url)

    await panel.getByTestId("share-tab-card").click()
    await expect(panel.getByTestId("share-card-preview")).toBeVisible()
    const [shareDl] = await Promise.all([page.waitForEvent("download"), panel.getByRole("button", { name: /Share image/ }).click()])
    expect(shareDl.suggestedFilename()).toBe("marlowe-and-finch-preview-share-post.png")
    const sf = await decodeFile(await shareDl.path(), 700)
    expect((await sharp(await shareDl.path()).metadata()).width).toBe(1080)
    expect(sf.text).toBe(url)
  });

  test("native share is offered only when the browser supports it, and cancelling is not an error", async ({ page }) => {
    await page.addInitScript(() => { Object.defineProperty(navigator, "share", { value: () => Promise.reject(Object.assign(new Error("cancelled"), { name: "AbortError" })), configurable: true }) })
    await open(page, FRAME())
    await page.getByRole("button", { name: /Share Marlowe/ }).click()
    await page.getByTestId("share-tab-card").click()
    const native = page.getByRole("button", { name: "Share from this device" })
    await expect(native).toBeVisible()
    await native.click()
    await expect(page.getByText("Sharing is not available here")).toHaveCount(0)
  })
  test("without native share the button is absent", async ({ page }) => {
    await page.addInitScript(() => { Object.defineProperty(navigator, "share", { value: undefined, configurable: true }) })
    await open(page, FRAME())
    await page.getByRole("button", { name: /Share Marlowe/ }).click()
    await page.getByTestId("share-tab-card").click()
    await expect(page.getByRole("button", { name: "Share from this device" })).toHaveCount(0)
  })

  test("QR options: transparent is real, a business logo and colour survive export, repeated downloads work, nothing goes stale", async ({ page }) => {
    await open(page, FRAME())
    await page.getByRole("button", { name: /Share Marlowe/ }).click()
    const panel = page.getByTestId("share-panel")
    const url = await panel.locator("#share-url").inputValue()
    const sharp = (await import("sharp")).default
    const fs = await import("node:fs")
    const decodeOn = async (path: string, bg: string) => {
      const { data, info } = await sharp(path).resize(512, 512, { fit: "inside", withoutEnlargement: true }).flatten({ background: bg }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
      return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data
    }
    const png = async (name: RegExp) => { const [d] = await Promise.all([page.waitForEvent("download"), panel.getByRole("button", { name }).click()]); return d }

    // Transparent: the file has no background pixels at all, and decodes on every light surface.
    await panel.getByRole("radio", { name: "Transparent" }).click()
    const t = await png(/QR code · Screen/)
    expect(t.suggestedFilename()).toBe("marlowe-and-finch-preview-qr-transparent-1024px.png")
    const raw = await sharp(await t.path()).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const alphaAt = (x: number, y: number) => raw.data[(y * raw.info.width + x) * 4 + 3]
    expect(alphaAt(2, 2), "corner").toBe(0)
    expect(alphaAt(raw.info.width - 3, raw.info.height - 3), "far corner").toBe(0)
    expect((raw.data.filter((_, i) => i % 4 === 3 && raw.data[i] === 255)).length, "dark modules are opaque").toBeGreaterThan(1000)
    for (const bg of ["#ffffff", "#f1f1f1", "#fbf3e2"]) expect(await decodeOn(await t.path(), bg), `on ${bg}`).toBe(url)
    const clearSvg = fs.readFileSync(await (await png(/QR code · SVG/)).path(), "utf8")
    expect(clearSvg).not.toMatch(/<rect width="\d+" height="\d+" fill=/)

    // A business logo and its own colour, as a self-contained SVG that still decodes.
    await panel.getByRole("radio", { name: "White" }).click()
    const taploSvg = fs.readFileSync(await (await png(/QR code · SVG/)).path(), "utf8")
    await panel.getByRole("radio", { name: "Your logo" }).click()
    await panel.getByRole("radio", { name: "Dots" }).click()
    await panel.getByRole("radio", { name: "Your colour" }).click()
    const mine = await png(/QR code · SVG/)
    const mineSvg = fs.readFileSync(await mine.path(), "utf8")
    expect(mineSvg).toContain('href="data:image/')
    expect(mineSvg).not.toMatch(/href="https?:/)
    expect(mineSvg, "different artwork from the Taplo mark").not.toBe(taploSvg)
    const fg = /<path d="[^"]*" fill="(#[0-9a-f]{6})"/i.exec(mineSvg)?.[1]
    expect(fg).toBeTruthy()
    const lum = (c: string) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i]!, 0) }
    expect((1.05) / (lum(fg!) + 0.05), "7:1 on white").toBeGreaterThanOrEqual(7)
    expect(await decodeOn(await mine.path(), "#ffffff")).toBe(url)

    // The preview is the export: the same drawing, not a second one that can drift.
    const previewPath = await panel.locator('[data-testid="qr-preview"] svg path').first().getAttribute("d")
    expect(mineSvg).toContain(previewPath!)

    // Repeated downloads work, and each reflects what is chosen now.
    for (let i = 0; i < 3; i++) expect(await decodeOn(await (await png(/QR code · Screen/)).path(), "#ffffff"), `download ${i + 1}`).toBe(url)
    await panel.getByRole("radio", { name: "Classic" }).click()
    const after = fs.readFileSync(await (await png(/QR code · SVG/)).path(), "utf8")
    expect(after, "a changed style is never exported stale").not.toBe(mineSvg)
  })
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
    const link = page.getByRole("link", { name: /View on example\.com/ })
    await expect(link).toHaveAttribute("rel", /sponsored/)
    await expect(link).toHaveAttribute("target", "_blank")
    await expect(page.getByText(/Affiliate link: .* may earn a commission/)).toBeVisible()
  })
  test("the payment widget never shows on a public page while payments are not connected", async ({ page }) => {
    await page.goto(FRAME())
    await expect(page.locator('[data-widget="payment"]')).toHaveCount(0)
  })
})
