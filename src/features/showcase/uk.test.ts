import { describe, expect, it } from "vitest"
import { businessContentSchema } from "@/features/businesses/content"
import { pageDocSchema } from "@/features/page/contracts/page"
import { exampleStart } from "@/features/inspiration/suggest"
import { bySlug, EXAMPLES } from "@/features/inspiration/examples"
import { SCENARIOS, type Scenario } from "./content"
import { initialConfig, toContent, toPage } from "./lab-state"

describe("current UK business examples", () => {
  it("new owners never inherit a fictional business's share-button name", () => {
    for (const slug of [...EXAMPLES.map(e => e.slug), "marlowe-and-finch"]) {
      for (const w of exampleStart(slug)!.widgets.filter(w => w.type === "share")) expect(w.settings.label).toBeUndefined()
    }
    expect(SCENARIOS.station.widgets().find(w => w.type === "share")!.settings.label).toBe("Share Jay’s Barbers")
  })
  for (const [slug, scenario] of [["no-6-coffee", "corner"], ["dans-home-repairs", "oakfield"], ["maths-with-aisha", "rowan"]] as const) {
    it(`${slug} is a real schema-controlled page and a safe starting design`, () => {
      const cfg = initialConfig(scenario)
      expect(businessContentSchema.safeParse(toContent(cfg)).success).toBe(true)
      expect(pageDocSchema.safeParse(toPage(cfg)).success).toBe(true)
      expect(EXAMPLES.some((e) => e.slug === slug)).toBe(true)
      const start = exampleStart(slug)!
      const settings = JSON.stringify(start.widgets)
      expect(settings).not.toContain(SCENARIOS[scenario].content.identity.name)
      expect(settings).not.toContain("/taplo-demo/")
      for (const service of SCENARIOS[scenario].content.services ?? []) expect(settings).not.toContain(service.id)
      expect(toContent(cfg).testimonials).toHaveLength(0)
      expect(toContent(cfg).credentials).toHaveLength(0)
    })
  }
  it("starting from an example carries its section hierarchy without sharing mutable appearance or business records", () => {
    for (const e of EXAMPLES) {
      const page = toPage(initialConfig(e.scenario))
      const start = exampleStart(e.slug)!
      expect(start.widgets.map(w => w.appearance)).toEqual(page.widgets.map(w => w.appearance))
      const first = start.widgets.find(w => Object.keys(w.appearance).length > 0) ?? start.widgets[0]!
      first.appearance.surface = "glass"
      expect(toPage(initialConfig(e.scenario)).widgets.map(w => w.appearance)).toEqual(page.widgets.map(w => w.appearance))
      expect(exampleStart(e.slug)!.widgets.find(w => w.type === first.type)!.appearance.surface).not.toBe("glass")
    }
  })
  it("café menu items never start appointments", () => {
    const cfg = initialConfig("corner")
    const content = toContent(cfg)
    expect(content.booking.onlineBookingReady).toBe(false)
    expect(content.services.every((s) => s.bookingMode === "contact" && !s.durationMinutes)).toBe(true)
    expect(toPage(cfg).widgets.some((w) => w.type === "booking")).toBe(false)
  })
  it("tutor and home repairs are requests rather than immediate confirmations", () => {
    for (const scenario of ["rowan", "oakfield"] as Scenario[]) {
      const c = toContent(initialConfig(scenario))
      expect(c.booking.onlineBookingReady).toBe(true)
      expect(c.services.filter((s) => s.durationMinutes).every((s) => s.bookingMode === "request")).toBe(true)
    }
  })
  it("earlier business addresses remain readable without leading the current gallery", () => {
    for (const slug of ["ada-okafor-maths", "northgate-heating", "pims-kitchen", "station-road-barbers", "parkside-valeting", "brookfield-motors", "corner-table-cafe", "oakfield-home-repairs", "rowan-learning"]) {
      expect(bySlug(slug)).toBeDefined()
    }
  })
})
