import { designsFor, getDesign } from "@/features/page/themes/designs"
import { describe, expect, it } from "vitest"
import { exampleStart, suggestedLooks } from "./suggest"
import { EXAMPLES, bySlug } from "./examples"
import { applyIndustry } from "@/features/demo/actions"
import { LOOKS } from "@/features/page/themes/looks"
import { initialState } from "@/features/demo/store"
import { hasIndustryPreset } from "@/features/themes/presets/industries"

describe("design-to-setup contracts", () => {
  it("every displayed example starts with a recognised industry and a complete look", () => {
    for (const e of EXAMPLES) {
      const start = exampleStart(e.slug)!
      expect(hasIndustryPreset(start.industryKey), e.slug).toBe(true)
      expect(LOOKS.some((l) => l.id === start.lookId), e.slug).toBe(true)
    }
  })
  it("new UK designs lead the matching industry suggestions and dealership setup keeps its stock layout", () => {
    expect(suggestedLooks("barber")[0]!.id).toBe("noir")
    for (const key of ["detailer", "car-dealer", "florist", "plumber"]) expect(getDesign(suggestedLooks(key)[0]!.id)!.suits, key).toContain(key)
    const dealer = exampleStart("brookfield-motors")!
    expect(dealer.industryKey).toBe("car-dealer")
    expect(dealer.widgets.find((w) => w.type === "products")!.settings.variant).toBe("catalogue")
  })
  it("choosing a category never replaces the look the page starts with or the one an owner chose", () => {
    const start = initialState()
    const dealer = applyIndustry(start, "car-dealer")
    expect(dealer.page.themeId).toBe(start.page.themeId)
    expect(dealer.page.widgets.find((w) => w.type === "products")!.settings.variant).toBe("catalogue")
    expect(applyIndustry(dealer, "barber").page.themeId).toBe(start.page.themeId)
    const chosen = { ...dealer, page: { ...dealer.page, themeId: "night" } }
    expect(applyIndustry(chosen, "barber").page.themeId).toBe("night")
    const customised = { ...dealer, page: { ...dealer.page, appearance: { colors: { accent: "#334455" } } } }
    expect(applyIndustry(customised, "barber").page.appearance).toEqual(customised.page.appearance)
    expect(applyIndustry(customised, "barber").page.themeId).toBe(dealer.page.themeId)
  })
  it("changing industry keeps section choices that the owner has customised", () => {
    const dealer = applyIndustry(initialState(), "car-dealer")
    const custom = { ...dealer, page: { ...dealer.page, widgets: dealer.page.widgets.map((w) => w.type === "products" ? { ...w, settings: { ...w.settings, title: "Our cars", variant: "list" } } : w) } }
    const changed = applyIndustry(custom, "barber")
    expect(changed.page.widgets).toEqual(custom.page.widgets)
  })
  it("superseded examples remain usable through existing addresses and start links", () => {
    for (const slug of ["marlowe-and-finch", "aldous-motor-co"]) {
      expect(bySlug(slug)).toBeDefined()
      expect(exampleStart(slug)?.lookId).toBeTruthy()
    }
  })
})
