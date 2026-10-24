import { describe, expect, it } from "vitest"
import { getTheme } from "./catalogue"
import { STARTER_LOOKS } from "./looks"
import { styleOverridesSchema } from "../contracts/style"

describe("neutral business compositions", () => {
  it("keeps historical aliases stable when introducing new compositions", () => {
    expect(getTheme("studio")?.id).toBe("clean")
    expect(getTheme("midnight")?.id).toBe("night")
    expect(getTheme("voltage")?.id).toBe("voltage")
  })
  it("offers distinct profile structures in neutral palettes", () => {
    expect(new Set(STARTER_LOOKS.map(l => l.overrides.header?.layout)).size).toBeGreaterThanOrEqual(5)
    for (const look of STARTER_LOOKS) {
      const s = getTheme(look.id)!.style
      for (const colour of Object.values(s.colors)) {
        const rgb = colour.match(/\w\w/g)!
        expect(new Set(rgb).size, `${look.id}: ${colour}`).toBe(1)
      }
      expect(s.buttons.shape).toBe("pill")
      expect(s.cards.border).toBe("none")
    }
  })
  it("preserves a section rhythm through schema validation and accepts earlier documents", () => {
    expect(styleOverridesSchema.parse({ layout: { rhythm: "editorial", desktop: "split" } })).toEqual({ layout: { rhythm: "editorial", desktop: "split" } })
    expect(styleOverridesSchema.parse({ layout: { desktop: "split" } })).toEqual({ layout: { desktop: "split" } })
  })
})
