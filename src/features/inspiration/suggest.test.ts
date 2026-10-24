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
    expect(suggestedLooks("barber")[0]!.id).toBe("service")
    expect(suggestedLooks("detailer")[0]!.id).toBe("open")
    expect(suggestedLooks("car-dealer")[0]!.id).toBe("open")
    const dealer = exampleStart("brookfield-motors")!
    expect(dealer.industryKey).toBe("car-dealer")
    expect(dealer.widgets.find((w) => w.type === "products")!.settings.variant).toBe("catalogue")
  })
  it("changing a fresh industry follows its new default without replacing an owner's chosen design", () => {
    const dealer = applyIndustry(initialState(), "car-dealer")
    expect(dealer.page.themeId).toBe("open")
    expect(dealer.page.widgets.find((w) => w.type === "products")!.settings.variant).toBe("catalogue")
    expect(applyIndustry(dealer, "barber").page.themeId).toBe("service")
    const chosen = { ...dealer, page: { ...dealer.page, themeId: "night" } }
    expect(applyIndustry(chosen, "barber").page.themeId).toBe("night")
    const customised = { ...dealer, page: { ...dealer.page, appearance: { colors: { accent: "#334455" } } } }
    expect(applyIndustry(customised, "barber").page.appearance).toEqual(customised.page.appearance)
    expect(applyIndustry(customised, "barber").page.themeId).toBe("open")
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
      expect(EXAMPLES.some((e) => e.slug === slug)).toBe(false)
    }
  })
})
