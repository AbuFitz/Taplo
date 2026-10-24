import { describe, expect, it } from "vitest"
import { businessContentSchema } from "@/features/businesses/content"
import { pageDocSchema } from "@/features/page/contracts/page"
import { exampleStart } from "@/features/inspiration/suggest"
import { bySlug, EXAMPLES } from "@/features/inspiration/examples"
import { SCENARIOS, type Scenario } from "./content"
import { initialConfig, toContent, toPage } from "./lab-state"

describe("current UK business examples", () => {
  for (const [slug, scenario] of [["corner-table-cafe", "corner"], ["oakfield-home-repairs", "oakfield"], ["rowan-learning", "rowan"]] as const) {
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
    for (const slug of ["ada-okafor-maths", "northgate-heating", "pims-kitchen"]) {
      expect(bySlug(slug)).toBeDefined()
      expect(EXAMPLES.some((e) => e.slug === slug)).toBe(false)
    }
  })
})
