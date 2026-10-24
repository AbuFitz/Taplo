import { expect, test } from "@playwright/test"
import { openEditorWithSample, openStructure, previewFrame, rowOrder, previewOrder } from "./helpers"

const records = (page: import("@playwright/test").Page) => page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!))

test.use({ viewport: { width: 1440, height: 900 } })

test.describe("adding content is one journey", () => {
  test("chooser with suggestions; a content type that needs a record creates it in place, then shows on the page", async ({ page }) => {
    await openEditorWithSample(page, "Unlisted")
    await page.getByTestId("add-widget").click()
    const panel = page.getByTestId("add-content")
    await expect(panel.getByText(/Suggested for/)).toBeVisible()
    await expect(panel.getByTestId("choice").first()).toBeVisible()
    // Anything is allowed for any business, including vehicles for a non-dealer.
    await panel.getByRole("button", { name: "Vehicles", exact: true }).first().click()
    await expect(panel.getByTestId("record-step")).toBeVisible()
    // Validation first; the page is untouched until there is something to show.
    const before = (await records(page)).page.widgets.length
    await panel.getByTestId("record-save").click()
    await expect(panel.getByRole("alert").first()).toBeVisible()
    expect((await records(page)).page.widgets.length).toBe(before)
    await panel.getByRole("textbox", { name: "Name" }).fill("Mini Cooper S")
    await panel.getByTestId("record-save").click()
    await expect(panel).toBeHidden()
    const s = await records(page)
    expect(s.page.widgets.length).toBe(before + 1)
    expect(s.content.products.at(-1)).toMatchObject({ name: "Mini Cooper S", kind: "vehicle", availability: "available" })
    await openStructure(page)
    await expect(page.getByTestId("content-list")).toContainText("Vehicles")
    await expect(previewFrame(page).getByText("Mini Cooper S")).toBeVisible()
    await page.getByTestId("undo").click()
    expect(((await records(page)).content.products ?? []).some((p: { name: string }) => p.name === "Mini Cooper S")).toBe(false)
    expect((await records(page)).page.widgets.length).toBe(before)
    await page.getByTestId("redo").click()
    expect((await records(page)).content.products.at(-1).name).toBe("Mini Cooper S")
    expect((await records(page)).page.widgets.length).toBe(before + 1)
  })

  test("content that already has records is added at once, with no form and no duplicate record", async ({ page }) => {
    await openEditorWithSample(page, "Barber")
    const before = await records(page)
    await page.getByTestId("add-widget").click()
    await page.getByRole("button", { name: "Price menu", exact: true }).first().click()
    await expect(page.getByTestId("add-content")).toBeHidden()
    const after = await records(page)
    expect(after.page.widgets.length).toBe(before.page.widgets.length + 1)
    expect(after.content.services.length).toBe(before.content.services.length)
  })

  test("removing content from the page never deletes the business record", async ({ page }) => {
    await openEditorWithSample(page, "Barber")
    const before = await records(page)
    const id = before.page.widgets.find((w: { type: string }) => w.type === "serviceList" || w.type === "priceMenu").id
    await page.locator(`[data-widget-row-id="${id}"]`).getByTestId("select-widget").click()
    await page.getByRole("button", { name: /Remove from page/ }).click()
    const after = await records(page)
    expect(after.page.widgets.some((w: { id: string }) => w.id === id)).toBe(false)
    expect(after.content.services).toHaveLength(before.content.services.length)
  })

  test("a card with nothing to show offers the one fix in place, not a link to another page", async ({ page }) => {
    await openEditorWithSample(page, "Barber")
    await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("taplo.demo.v2")!); s.content.testimonials = []; localStorage.setItem("taplo.demo.v2", JSON.stringify(s)) })
    await page.reload()
    await expect(page.getByTestId("my-page")).toBeVisible()
    const text = await page.getByTestId("content-list").innerText()
    expect(text).not.toMatch(/Go there|Fix it in Business details/)
    const cta = page.getByTestId("needs-cta").first()
    await expect(cta).toContainText(/Add a review/)
    await cta.click()
    const panel = page.getByTestId("add-content")
    await panel.getByRole("textbox", { name: "What they said" }).fill("Brilliant haircut, quick and friendly.")
    await panel.getByRole("textbox", { name: "Who said it" }).fill("Sam R.")
    await panel.getByTestId("record-save").click()
    await expect(panel.getByRole("alert").filter({ hasText: /permission/ })).toBeVisible()   // consent is required
    await panel.getByRole("checkbox").check()
    await panel.getByTestId("record-save").click()
    await expect(panel).toBeHidden()
    expect((await records(page)).content.testimonials).toHaveLength(1)
    await expect(page.getByTestId("needs-cta")).toHaveCount(0)
  })
})

test.describe("ordering", () => {
  // Ordering has no mode of its own: every row has a handle and a menu of plain moves.
  const menuMove = async (page: import("@playwright/test").Page, n: number, item: RegExp) => {
    await page.locator("[data-widget-row-id]").nth(n).getByTestId("row-menu").click()
    await page.getByRole("menuitem", { name: item }).click()
  }
  test("the row menu moves a row, each move is one undo, and the preview follows", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic")
    const start = await rowOrder(page)
    await menuMove(page, 2, /Up one/)
    const one = await rowOrder(page)
    expect(one).not.toEqual(start)
    expect(one[1]).toBe(start[2])
    await menuMove(page, 3, /To the top/)
    const two = await rowOrder(page)
    expect(two[0]).toBe(one[3])
    // One move = one undo step.
    await page.getByTestId("undo").click()
    expect(await rowOrder(page)).toEqual(one)
    await page.getByTestId("undo").click()
    expect(await rowOrder(page)).toEqual(start)
    await page.getByTestId("redo").click()
    expect(await rowOrder(page)).toEqual(one)
    const visible = await previewOrder(page)
    expect(visible).toEqual(one.filter((t) => visible.includes(t)))
  })

  test("the first row cannot move up and the last cannot move down", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic")
    await page.locator("[data-widget-row-id]").first().getByTestId("row-menu").click()
    await expect(page.getByRole("menuitem", { name: /Up one/ })).toHaveAttribute("aria-disabled", "true")
    await page.keyboard.press("Escape")
    await page.locator("[data-widget-row-id]").last().getByTestId("row-menu").click()
    await expect(page.getByRole("menuitem", { name: /Down one/ })).toHaveAttribute("aria-disabled", "true")
  })

  test("keyboard: the handle picks up, arrows move, space drops, and it is announced", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic")
    const start = await rowOrder(page)
    const handle = page.locator("[data-widget-row-id]").first().getByTestId("drag-handle")
    await handle.focus()
    await page.keyboard.press("Space"); await page.waitForTimeout(120)
    await page.keyboard.press("ArrowDown"); await page.waitForTimeout(120)
    await page.keyboard.press("Space")
    await expect.poll(() => rowOrder(page)).not.toEqual(start)
    expect((await rowOrder(page))[1]).toBe(start[0])
    await expect(page.getByRole("status").filter({ hasText: /moved to position 2/ })).toBeAttached()
  })

  test("Escape during a pick-up cancels it and nothing moves", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic")
    const start = await rowOrder(page)
    const handle = page.locator("[data-widget-row-id]").first().getByTestId("drag-handle")
    await handle.focus()
    await page.keyboard.press("Space"); await page.waitForTimeout(120)
    await page.keyboard.press("ArrowDown"); await page.waitForTimeout(120)
    await page.keyboard.press("Escape"); await page.waitForTimeout(200)
    expect(await rowOrder(page)).toEqual(start)
  })

  test("a mouse drag from the handle reorders, and a click on the row still selects it", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic")
    const start = await rowOrder(page)
    const a = (await page.locator("[data-widget-row-id]").nth(0).getByTestId("drag-handle").boundingBox())!
    const t = (await page.locator("[data-widget-row-id]").nth(2).getByTestId("drag-handle").boundingBox())!
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2)
    await page.mouse.down()
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2 + 12, { steps: 4 })
    await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2 + 10, { steps: 12 })
    await page.mouse.up()
    await expect.poll(() => rowOrder(page)).not.toEqual(start)
    // dnd-kit suppresses clicks just after dropping to avoid activating the dragged card.
    await page.waitForTimeout(150)
    await page.locator("[data-widget-row-id]").first().getByTestId("select-widget").click()
    await expect(page.getByTestId("inspector-widget")).toBeVisible()
  })

  test("the main action is separate from the order: reordering does not change which action is promoted", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic")
    const main = async () => (await records(page)).page.meta.primaryAction
    const before = await main()
    await menuMove(page, 2, /Up one/)
    expect(await main()).toBe(before)
  })
})

test.describe("content editing on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  test("Content shows rows with handles and Add content; a touch drag from the handle reorders", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic")
    await page.getByTestId("tab-content").tap()
    await expect(page.getByTestId("content-list")).toBeVisible()
    await expect(page.getByTestId("add-widget")).toBeVisible()
    await page.waitForTimeout(700)
    const start = await rowOrder(page)
    const a = (await page.locator("[data-widget-row-id]").nth(0).getByTestId("drag-handle").boundingBox())!
    const t = (await page.locator("[data-widget-row-id]").nth(2).getByTestId("drag-handle").boundingBox())!
    const cdp = await page.context().newCDPSession(page)
    const pt = (x: number, y: number) => [{ x, y, id: 1 }]
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pt(a.x + a.width / 2, a.y + a.height / 2) })
    await page.waitForTimeout(260)
    for (let i = 1; i <= 14; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pt(a.x + a.width / 2, a.y + a.height / 2 + ((t.y - a.y + 10) * i) / 14) }); await page.waitForTimeout(16) }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
    await expect.poll(() => rowOrder(page)).not.toEqual(start)
  })
})
