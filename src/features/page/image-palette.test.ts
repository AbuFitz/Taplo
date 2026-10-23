import { describe, expect, it } from "vitest"
import { dominantAccent, paletteFromAccent, readsWell } from "./themes/image-palette"

const fill = (r: number, g: number, b: number, n: number) => Array.from({ length: n }, () => [r, g, b, 255]).flat()
const px = (...parts: number[][]) => new Uint8ClampedArray(parts.flat())

describe("colour suggestions from a picture", () => {
  it("finds the vivid colour, not the grey or the white", () => {
    const a = dominantAccent(px(fill(230, 230, 230, 500), fill(90, 90, 90, 300), fill(220, 60, 40, 120)))!
    expect(a.startsWith("#")).toBe(true)
    const [r, g, b] = [a.slice(1, 3), a.slice(3, 5), a.slice(5, 7)].map((x) => parseInt(x, 16))
    expect(r!).toBeGreaterThan(g! + 60)
    expect(r!).toBeGreaterThan(b! + 60)
  })
  it("says nothing for a picture with no colour in it", () => {
    expect(dominantAccent(px(fill(240, 240, 240, 400), fill(30, 30, 30, 400)))).toBeNull()
  })
  it("builds a readable palette in both tones for any accent", () => {
    for (const accent of ["#e8452c", "#2f6bff", "#18a058", "#f2c230", "#8a3ffc"]) {
      for (const dark of [false, true]) {
        const p = paletteFromAccent(accent, dark)
        expect(readsWell(p), `${accent} ${dark ? "dark" : "light"}`).toBe(true)
      }
    }
  })
})
