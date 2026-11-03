import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { PageRenderer, buildPageViewModel } from "./renderer"
import { SCENARIOS } from "@/features/showcase/content"
import { widgetsFor } from "@/features/showcase/lab-state"
import { PROFILE_CHOICES } from "./contracts/style"
import { DESIGNS, FINISHES, applyFinish, designsFor } from "./themes/designs"

const page = (layout: string, finish?: (typeof FINISHES)[number]["id"]) => ({
  schemaVersion: 2 as const, themeId: "noir", meta: { searchVisible: false, primaryAction: "auto" as const }, savedLooks: [], savedStyles: [],
  appearance: finish ? applyFinish({ header: { layout } } as never, finish, true) : { header: { layout } }, widgets: widgetsFor("barber"),
})

describe("profile arrangements and materials", () => {
  for (const arrangement of PROFILE_CHOICES) {
    for (const withPhoto of [true, false]) {
      it(`${arrangement.id} renders ${withPhoto ? "with" : "without"} a photograph or logo`, () => {
        const content = structuredClone(SCENARIOS.barber.content)
        if (!withPhoto) { content.identity.heroImage = undefined; content.identity.logo = undefined }
        const vm = buildPageViewModel(content, page(arrangement.id), { plan: "business" })
        const html = renderToStaticMarkup(createElement(PageRenderer, { vm, still: true }))
        expect(html).toContain(`data-layout="${arrangement.id}"`)
        expect(html).toContain("Marlowe")
      })
    }
  }
  it("every material resolves onto the page", () => {
    for (const f of FINISHES) {
      const vm = buildPageViewModel(SCENARIOS.barber.content, page("melt", f.id), { plan: "business" })
      expect(renderToStaticMarkup(createElement(PageRenderer, { vm, still: true }))).toContain(`data-finish="${f.id}"`)
    }
  })
  it("only offers designs made for a kind of business, best first", () => {
    for (const key of ["barber", "plumber", "florist", "tutor", "car-dealer", "accountant", "other"]) {
      const list = designsFor(key, 6)
      expect(list.length, key).toBeGreaterThanOrEqual(3)
    }
    expect(designsFor("barber")[0]!.id).toBe("noir")
    expect(designsFor("barber").map((d) => d.id)).not.toContain("candy")
    expect(DESIGNS.every((d) => d.suits.length > 0)).toBe(true)
  })
})
