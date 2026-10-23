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
    await panel.getByTestId("choice").filter({ hasText: /^Vehicles/ }).first().click()
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
  })

  test("content that already has records is added at once, with no form and no duplicate record", async ({ page }) => {
    await openEditorWithSample(page, "Barber")
    const before = await records(page)
    await page.getByTestId("add-widget").click()
    await page.getByTestId("choice").filter({ hasText: /^Price menu/ }).first().click()
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

test.describe("organise", () => {
  test("move buttons and the menu reorder, each move is one undo, Cancel puts everything back, the preview follows", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic")
    await page.getByTestId("organise").click()
    const start = await rowOrder(page)
    const list = page.getByTestId("widget-list")
    await list.locator("[data-widget-row-id]").nth(2).getByTestId("move-up").click()
    const one = await rowOrder(page)
    expect(one).not.toEqual(start)
    await list.locator("[data-widget-row-id]").nth(3).getByRole("button", { name: /More ways to move/ }).click()
    await page.getByRole("menuitem", { name: "Move to the top" }).click()
    const two = await rowOrder(page)
    expect(two[0]).toBe(start[3])
    await page.getByTestId("organise-cancel").click()
    expect(await rowOrder(page)).toEqual(start)
    await page.getByTestId("organise-done").click()
    await expect(page.getByTestId("organise-panel")).toBeHidden()
    // One move = one undo step.
    await page.getByTestId("organise").click()
    await page.locator("[data-widget-row-id]").nth(1).getByTestId("move-down").click()
    const moved = await rowOrder(page)
    await page.getByTestId("undo").click()
    expect(await rowOrder(page)).toEqual(start)
    expect(moved).not.toEqual(start)
    await page.getByTestId("redo").click()
    expect(await rowOrder(page)).toEqual(moved)
    const visible = await previewOrder(page)
    expect(visible).toEqual(moved.filter((t) => visible.includes(t)))
  })

  test("keyboard: the handle picks up, arrows move, space drops, and it is announced", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic")
    await page.getByTestId("organise").click()
    const start = await rowOrder(page)
    const handle = page.locator("[data-widget-row-id]").first().getByTestId("drag-handle")
    await handle.focus()
    await page.keyboard.press("Space"); await page.waitForTimeout(120)
    await page.keyboard.press("ArrowDown"); await page.waitForTimeout(120)
    await page.keyboard.press("Space")
    await expect.poll(() => rowOrder(page)).not.toEqual(start)
    expect((await rowOrder(page))[1]).toBe(start[0])
    await expect(page.getByRole("status").filter({ hasText: /moved to position 2/ })).toBeVisible()
  })

  test("the main action is separate from the order: reordering does not change which action is promoted", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic")
    const main = async () => (await records(page)).page.meta.primaryAction
    const before = await main()
    await page.getByTestId("organise").click()
    await page.locator("[data-widget-row-id]").nth(2).getByTestId("move-up").click()
    expect(await main()).toBe(before)
  })
})

test.describe("content editing on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  test("Content shows cards and Add content; Organise has handles and alternatives; touch drag reorders", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic")
    await page.getByTestId("tab-content").tap()
    await expect(page.getByTestId("content-list")).toBeVisible()
    expect(await page.locator('[data-testid="content-list"] [data-testid="drag-handle"]').count()).toBe(0)   // no handles while just editing
    await expect(page.getByTestId("add-widget")).toBeVisible()
    await page.getByTestId("organise").tap()
    await expect(page.getByTestId("organise-panel")).toBeVisible()
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
