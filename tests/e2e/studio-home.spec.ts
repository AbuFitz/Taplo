import { expect, test } from "@playwright/test"
import { openEditorWithSample } from "./helpers"

// The studio home: one next action, truthful share address, pinned dock, keyboard-safe preview.
const publish = async (page: import("@playwright/test").Page) => {
  await page.getByTestId("studio-next").getByRole("button", { name: "Publish", exact: true }).click()
  await expect(page.getByTestId("studio-share")).toBeVisible()
}

test("the dock is pinned to the bottom of the phone screen, not the page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openEditorWithSample(page)
  await page.goto("/dashboard")
  await expect(page.getByTestId("studio-next")).toBeVisible()
  const box = await page.locator(".studio-dock").boundingBox()
  expect(box!.y + box!.height).toBeLessThanOrEqual(844)
  expect(box!.y).toBeGreaterThan(700)
})

test("the primary action comes before the embedded page and shows a focus ring", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openEditorWithSample(page)
  await page.goto("/dashboard")
  const primary = page.getByTestId("studio-next").getByRole("button", { name: "Publish", exact: true })
  await primary.focus()
  await page.keyboard.press("Shift+Tab"); await page.keyboard.press("Tab")
  const ring = await primary.evaluate((el) => { const cs = getComputedStyle(el); return { style: cs.outlineStyle, width: parseFloat(cs.outlineWidth) } })
  expect(ring.style).not.toBe("none")
  expect(ring.width).toBeGreaterThanOrEqual(2)
})

for (const [w, h] of [[390, 844], [1440, 900]] as const) {
  test(`one address everywhere after publishing, a full-size QR, and Esc returns focus at ${w}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h })
    await openEditorWithSample(page)
    await page.goto("/dashboard")
    await publish(page)
    const shown = (await page.getByTestId("studio-share-url").innerText()).trim()
    expect(shown).toMatch(/\/demo\/p\//)
    const opener = page.getByRole("button", { name: "Show QR" })
    await opener.click()
    await expect(page.getByTestId("share-panel")).toBeVisible()
    await expect(page.getByLabel("Page link")).toHaveValue(shown)
    const qr = await page.getByTestId("qr-preview").locator("svg").boundingBox()
    expect(qr!.width).toBeGreaterThanOrEqual(200)
    await page.keyboard.press("Escape")
    await expect(page.getByTestId("share-panel")).toHaveCount(0)
    await expect(opener).toBeFocused()
  })
}

test("copying says so plainly when the browser refuses", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openEditorWithSample(page)
  await page.goto("/dashboard")
  await publish(page)
  await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) }, configurable: true }) })
  await page.getByRole("button", { name: "Copy link" }).first().click()
  await expect(page.getByRole("alert").filter({ hasText: "Could not copy" })).toBeVisible()
})

test("the incomplete draft names its next step instead of a generic button", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openEditorWithSample(page)
  await page.evaluate(() => { const k = "taplo.demo.v2"; const s = JSON.parse(localStorage.getItem(k)!); s.published = null; s.content.contacts = {}; localStorage.setItem(k, JSON.stringify(s)) })
  await page.goto("/dashboard")
  const next = page.getByTestId("studio-next")
  await expect(next.getByRole("heading")).toHaveText("Add a way to contact you")
  await expect(next.getByRole("link", { name: "Add contact details" })).toBeVisible()
  await expect(next.getByRole("button", { name: "Publish" })).toHaveCount(0)
})

test("with the software keyboard open the dock steps out of the way", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openEditorWithSample(page)
  await page.goto("/dashboard")
  await expect(page.getByTestId("studio-next")).toBeVisible()
  // Emulate the visual viewport shrinking the way an on-screen keyboard does.
  await page.evaluate(() => { const vv = window.visualViewport as any; Object.defineProperty(vv, "height", { value: 340, configurable: true }); vv.dispatchEvent(new Event("resize")) })
  await expect(page.locator(".studio-dock")).toBeHidden()
})
