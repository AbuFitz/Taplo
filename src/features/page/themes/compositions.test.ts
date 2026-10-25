import { describe, expect, it } from "vitest"
import { getTheme } from "./catalogue"
import { CURRENT_LOOKS, STARTER_LOOKS } from "./looks"
import { resolveStyle } from "./resolve"
import { styleOverridesSchema } from "../contracts/style"

describe("authored engine compositions", () => {
  it("keeps historical aliases stable when introducing new compositions", () => {
    expect(getTheme("studio")?.id).toBe("clean")
    expect(getTheme("midnight")?.id).toBe("night")
    expect(getTheme("voltage")?.id).toBe("voltage")
  })
  it("offers distinct profile structures and authored commercial palettes", () => {
    expect(new Set(STARTER_LOOKS.map(l => l.overrides.header?.layout)).size).toBe(3)
    for (const look of STARTER_LOOKS) {
      const s = getTheme(look.id)!.style
      expect(styleOverridesSchema.safeParse(look.overrides).success).toBe(true)
      expect(["pill","rounded"]).toContain(s.buttons.shape)
      expect(s.cards.border).toBe("none")
    }
  })
  it("uses the same authored configurations in discovery and the renderer",()=>{
    expect(CURRENT_LOOKS).toHaveLength(12)
    expect(new Set(CURRENT_LOOKS.map(l=>l.overrides.colors?.accent)).size).toBeGreaterThanOrEqual(10)
    expect(new Set(CURRENT_LOOKS.map(l=>l.overrides.header?.layout)).size).toBe(3)
    for(const look of CURRENT_LOOKS) {
      expect(styleOverridesSchema.safeParse(look.overrides).success).toBe(true)
      expect(getTheme(look.id)!.style.background).toEqual(look.overrides.background)
    }
  })
  it("renders retired overlapping profile choices through the reviewed set without changing saved input",()=>{
    const previous={header:{layout:"floating" as const}};
    expect(resolveStyle("open",previous).spec.header.layout).toBe("banner");
    expect(previous.header.layout).toBe("floating");
  })
  it("preserves a section rhythm through schema validation and accepts earlier documents", () => {
    expect(styleOverridesSchema.parse({ layout: { rhythm: "editorial", desktop: "split" } })).toEqual({ layout: { rhythm: "editorial", desktop: "split" } })
    expect(styleOverridesSchema.parse({ layout: { desktop: "split" } })).toEqual({ layout: { desktop: "split" } })
  })
})
