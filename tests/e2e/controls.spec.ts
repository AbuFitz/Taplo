import { expect, test, type Page } from "@playwright/test"
import { openEditorWithSample, previewFrame, selectPart } from "./helpers"

/**
 * The design control matrix. Every control the owner editor offers is operated through the real editor and must
 * (1) change the rendered page, (2) undo, (3) survive a reload. The probe reads what the page actually computed:
 * a CSS token on the page root, a data attribute the stylesheet keys off, or a computed style.
 */
type Probe = (page: Page) => Promise<string>
const root = (page: Page) => previewFrame(page).locator("[data-taplo-page]")
const cv = (name: string): Probe => (page) => root(page).evaluate((el, n) => getComputedStyle(el).getPropertyValue(n).trim(), name)
const at = (name: string): Probe => (page) => root(page).evaluate((el, n) => el.getAttribute(n) ?? "", name)
const sub = (selector: string, attr: string): Probe => (page) => previewFrame(page).locator(selector).first().evaluate((el, a) => el.getAttribute(a) ?? "", attr).catch(() => "")
const count = (selector: string): Probe => async (page) => String(await previewFrame(page).locator(selector).count())
const css = (selector: string, prop: string): Probe => (page) => previewFrame(page).locator(selector).first().evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop).catch(() => "")

async function disclosure(page: Page, title: string) {
  // The disclosure whose own summary matches (a `has` filter would also match an outer one that contains it).
  const sum = page.locator("summary", { hasText: new RegExp(`^${title}`) }).first()
  const open = await sum.evaluate((el) => (el.parentElement as HTMLDetailsElement).open)
  if (!open) await sum.click()
}
const radio = (group: string, value: string) => async (page: Page) => { await page.getByRole("radiogroup", { name: group, exact: true }).locator("label", { has: page.locator(`input[value="${value}"]`) }).first().click() }
const toggle = (label: string) => async (page: Page) => { await page.getByRole("switch", { name: label }).click() }
const MORE = new Set(["Secondary text", "Text on accent", "Borders"])
const hex = (label: string, value: string) => async (page: Page) => {
  if (MORE.has(label)) await disclosure(page, "More colours")
  const i = page.getByRole("textbox", { name: `${label} hex value`, exact: true }); await i.fill(value); await i.blur()
}
const slider = (label: string, value: number) => async (page: Page) => { await page.getByRole("slider", { name: label }).fill(String(value)) }

interface Control { id: string; part: "page" | "header"; open?: string; also?: (page: Page) => Promise<void>; run: (page: Page) => Promise<void>; probe: Probe; expect?: string }

const C: Control[] = [
  // Look and palette
  { id: "look", part: "page", run: radio("Look", "colour"), probe: cv("--tp-background"), expect: "#3a3af5" },
  { id: "palette", part: "page", open: "Colour", run: radio("Palette", "sand-amber"), probe: cv("--tp-background") },
  // Colours
  { id: "colour-page", part: "page", open: "Colour", run: hex("Page", "#102030"), probe: cv("--tp-background"), expect: "#102030" },
  { id: "colour-text", part: "page", open: "Colour", run: hex("Text", "#fafafa"), probe: cv("--tp-foreground"), expect: "#fafafa" },
  { id: "colour-secondary", part: "page", open: "Colour", run: hex("Secondary text", "#c0c4cc"), probe: cv("--tp-muted"), expect: "#c0c4cc" },
  { id: "colour-accent", part: "page", open: "Colour", run: hex("Accent", "#0057ff"), probe: cv("--tp-accent"), expect: "#0057ff" },
  { id: "colour-on-accent", part: "page", open: "Colour", run: hex("Text on accent", "#000000"), probe: cv("--tp-accent-foreground"), expect: "#000000" },
  { id: "colour-cards", part: "page", open: "Colour", run: hex("Cards", "#202530"), probe: cv("--tp-surface"), expect: "#202530" },
  { id: "colour-borders", part: "page", open: "Colour", run: hex("Borders", "#445566"), probe: cv("--tp-border"), expect: "#445566" },
  // Type
  { id: "type-pair", part: "page", open: "Type", run: radio("Font pair", "warm"), probe: cv("--tp-font-heading") },
  { id: "type-size", part: "page", open: "Type", run: radio("Text size", "lg"), probe: cv("--tp-scale"), expect: "1.1" },
  { id: "type-case", part: "page", open: "Type", run: radio("Heading case", "upper"), probe: cv("--tp-heading-case"), expect: "uppercase" },
  { id: "type-weight", part: "page", open: "Type", run: radio("Heading weight", "regular"), probe: cv("--tp-heading-weight"), expect: "500" },
  { id: "type-align", part: "page", open: "Type", run: radio("Text alignment", "center"), probe: cv("--tp-text-align"), expect: "center" },
  // Wallpaper
  { id: "wallpaper-gradient", part: "page", open: "Wallpaper", run: radio("Wallpaper", "gradient"), probe: at("data-bg"), expect: "gradient" },
  { id: "wallpaper-shader", part: "page", open: "Wallpaper", run: radio("Wallpaper", "aurora"), probe: at("data-bg"), expect: "shader" },
  { id: "wallpaper-drift", part: "page", open: "Wallpaper", also: radio("Wallpaper", "gradient"), run: toggle("Slowly drifting colours"), probe: at("data-motion"), expect: "drift" },
  { id: "wallpaper-angle", part: "page", open: "Wallpaper", also: radio("Wallpaper", "gradient"), run: slider("Angle", 90), probe: css(".tp-bg-gradient", "background-image") },
  { id: "pattern", part: "page", open: "Wallpaper", run: radio("Pattern", "dots"), probe: at("data-decoration"), expect: "dots" },
  // Header
  { id: "header-layout", part: "header", run: radio("Header arrangement", "poster"), probe: at("data-header"), expect: "poster" },
  { id: "header-shape", part: "header", run: radio("Logo shape", "circle"), probe: sub(".tp-avatar", "data-shape"), expect: "circle" },
  { id: "header-size", part: "header", run: radio("Logo size", "lg"), probe: sub(".tp-avatar", "data-size"), expect: "lg" },
  { id: "header-align", part: "header", run: radio("Header alignment", "center"), probe: sub(".tp-header", "data-align"), expect: "center" },
  { id: "header-actions", part: "header", run: radio("Contact actions", "icons"), probe: count(".tp-header .tp-actions-primary, .tp-header .tp-quick") },
  { id: "header-location", part: "header", run: toggle("Show location under the name"), probe: count(".tp-meta svg") },
  { id: "header-fade", part: "header", also: radio("Header arrangement", "poster"), run: radio("Photo fade", "strong"), probe: cv("--tp-fade"), expect: "74%" },
  // Buttons
  { id: "button-style", part: "page", open: "Buttons", run: radio("Button style", "outline"), probe: at("data-btn-fill"), expect: "outline" },
  { id: "button-shape", part: "page", open: "Buttons", run: radio("Button shape", "square"), probe: cv("--tp-btn-radius") },
  { id: "button-shadow", part: "page", open: "Buttons", run: radio("Button shadow", "hard"), probe: cv("--tp-btn-shadow") },
  { id: "button-icons", part: "page", open: "Buttons", run: toggle("Icons on buttons"), probe: at("data-btn-icons"), expect: "off" },
  // Cards
  { id: "card-surface", part: "page", open: "Cards", run: radio("Card surface", "glass"), probe: at("data-card-surface"), expect: "glass" },
  { id: "card-corners", part: "page", open: "Cards", run: radio("Corners", "none"), probe: cv("--tp-card-radius"), expect: "0px" },
  { id: "card-border", part: "page", open: "Cards", run: radio("Border", "thick"), probe: cv("--tp-card-border-w"), expect: "2.5px" },
  { id: "card-shadow", part: "page", open: "Cards", run: radio("Card shadow", "hard"), probe: cv("--tp-card-shadow") },
  { id: "card-padding", part: "page", open: "Cards", run: radio("Spacing inside", "roomy"), probe: cv("--tp-card-pad"), expect: "1.5rem" },
  // Layout and motion
  { id: "layout-width", part: "page", open: "Layout and motion", run: radio("Content width", "wide"), probe: cv("--tp-width"), expect: "44rem" },
  { id: "layout-desktop", part: "page", open: "Layout and motion", run: radio("On a computer", "split"), probe: at("data-desktop"), expect: "split" },
  { id: "layout-spacing", part: "page", open: "Layout and motion", run: radio("Spacing", "compact"), probe: cv("--tp-gap"), expect: "0.625rem" },
  { id: "layout-motion", part: "page", open: "Layout and motion", run: radio("Motion", "lively"), probe: at("data-motion-level"), expect: "lively" },
]

async function go(page: Page, c: Control) {
  await selectPart(page, c.part)
  if (c.open) await disclosure(page, c.open)
  if (c.also) await c.also(page)
}

test.describe("design controls change the rendered page, undo, and persist", () => {
  for (const c of C) {
    test(c.id, async ({ page }) => {
      await openEditorWithSample(page, "Barber")
      await page.waitForTimeout(600)
      await go(page, c)
      const before = await c.probe(page)
      await c.run(page)
      await expect.poll(() => c.probe(page), { message: `${c.id}: rendered value should change` }).not.toBe(before)
      const after = await c.probe(page)
      if (c.expect !== undefined) expect(after).toBe(c.expect)

      // Undo returns the page to how it was, and redo brings the change back.
      await page.getByTestId("undo").click()
      await expect.poll(() => c.probe(page), { message: `${c.id}: undo` }).toBe(before)
      await page.getByTestId("redo").click()
      await expect.poll(() => c.probe(page), { message: `${c.id}: redo` }).toBe(after)

      // Persistence: reload the editor; the draft comes back with the same rendered result.
      await page.reload()
      await expect(page.getByTestId("my-page")).toBeVisible()
      await page.waitForTimeout(800)
      await go(page, { ...c, also: undefined })
      expect(await c.probe(page), `${c.id}: survives a reload`).toBe(after)
    })
  }
})
