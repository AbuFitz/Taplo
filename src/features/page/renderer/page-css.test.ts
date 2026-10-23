import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

/**
 * The widget rules draw sizes and gaps from two scales (see the top of page.css). A raw rem value in a widget rule would
 * quietly start a fifteenth font size, so this fails when one appears. Display sizes (the name, avatar initials) are
 * the only exceptions, and they are written with clamp() or sit on the avatar.
 */
const css = readFileSync("src/features/page/renderer/page.css", "utf8")
const widgetRules = css.slice(css.indexOf("/* ---------- buttons (rows) ---------- */"))

describe("page.css widget system", () => {
  it("uses only the type scale for font sizes", () => {
    const raw = [...widgetRules.matchAll(/font-size:\s*([^;}]+)/g)].map((m) => m[1]!.trim()).filter((v) => !v.startsWith("var(--tp-t-") && !v.startsWith("clamp(") && !v.startsWith("calc("))
    expect(raw).toEqual([])
  })
  it("uses only the spacing scale for gaps, padding and margins", () => {
    const bad: string[] = []
    for (const m of widgetRules.matchAll(/((?:row-|column-)?gap|padding(?:-[a-z]+)?|margin(?:-[a-z]+)?)\s*:\s*([^;}]+)/g)) {
      const value = m[2]!.replace(/var\([^)]*\)/g, "").replace(/calc\([^)]*\)/g, "")
      if (/[0-9.]+rem/.test(value)) bad.push(`${m[1]}: ${m[2]}`)
    }
    expect(bad).toEqual([])
  })
  it("defines each scale step once", () => {
    for (const t of ["--tp-s-1", "--tp-s-8", "--tp-t-xs", "--tp-t-2xl"]) expect(css.split(`${t}:`).length - 1).toBe(1)
  })
})
