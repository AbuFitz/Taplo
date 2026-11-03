import { describe, expect, it } from "vitest"
import { initialState } from "@/features/demo/store"
import { applyIndustry } from "@/features/demo/actions"
import { migratePage } from "../migrate"
import { buildPageViewModel } from "../renderer/view-model"
import { getFixture } from "@/features/themes/fixtures"
import { applyStartingLook, STARTING_LOOKS } from "./starting-looks"
import { resolveStyle } from "./resolve"

describe("signature setup", () => {
  it("starts white with black rounded actions and floating blocks", () => {
    const s = initialState()
    const style = resolveStyle(s.page.themeId, s.page.appearance)
    expect(style.spec.colors.background).toBe("#ffffff")
    expect(style.spec.colors.accent).toBe("#141414")
    expect(style.spec.text.headingFont).toBe("geist")
    expect(style.spec.header.layout).toBe("lifted")
    expect(style.spec.buttons.shape).toBe("rounded")
    expect(style.spec.cards.shadow).toBe("soft")
  })
  it("preserves a chosen look after serialising and loading every selection", () => {
    const page = initialState().page
    for (const look of STARTING_LOOKS) {
      const next = applyStartingLook(page, look)
      const loaded = migratePage(JSON.parse(JSON.stringify(next)), "barber").page
      expect(resolveStyle(loaded.themeId, loaded.appearance).spec.colors.background, look.name).toBe(look.colourway.colors.background)
      expect(loaded.widgets.map(w => w.id), look.name).toEqual(page.widgets.map(w => w.id))
    }
  })
  it("shows the chosen design while drafting on Free and keeps publishing rules separate", () => {
    const f = getFixture("barber")!
    const page = applyStartingLook(initialState().page, STARTING_LOOKS.find(l => l.id === "ink")!)
    const draft = buildPageViewModel(f.content, page, { plan: "free", themeOverride: page.themeId })
    const published = buildPageViewModel(f.content, page, { plan: "free" })
    expect(draft.style.spec.colors.background).toBe("#090b0d")
    expect(published.style.spec.colors.background).toBe("#ffffff")
    expect(published.showBranding).toBe(true)
  })
  it("adapts unedited starter content to a dealer without losing the neutral composition", () => {
    const dealer = applyIndustry(initialState(), "car-dealer")
    expect(dealer.page.widgets.find(w => w.type === "products")?.settings.variant).toBe("catalogue")
    expect(dealer.page.appearance.header?.layout).toBe("lifted")
  })
})
