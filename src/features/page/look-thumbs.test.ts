import { createHash } from "node:crypto"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { LOOKS as ALL_LOOKS } from "./themes/looks"
import { getDesign } from "./themes/designs"

// Designs are drawn live from the renderer; only the older looks keep a rendered picture.
const LOOKS = ALL_LOOKS.filter((l) => !getDesign(l.id))

/** The look chooser shows pictures of each look. If a look changes, its picture must be regenerated (scripts/marketing/look-thumbs.mjs). */
const MANIFEST = "public/looks/manifest.json"
const hashOf = (l: (typeof LOOKS)[number]) => createHash("sha1").update(JSON.stringify({ id: l.id, name: l.name, o: l.overrides })).digest("hex").slice(0, 12)

describe("look thumbnails", () => {
  const current = Object.fromEntries(LOOKS.map((l) => [l.id, hashOf(l)]))
  if (process.env.UPDATE_LOOK_THUMBS === "1") writeFileSync(MANIFEST, JSON.stringify(current, null, 2) + "\n")
  it("every look has a picture", () => {
    for (const l of LOOKS) expect(existsSync(`public/looks/${l.id}.webp`), l.id).toBe(true)
  })
  it("the pictures show the looks as they are now", () => {
    const recorded = JSON.parse(readFileSync(MANIFEST, "utf8")) as Record<string, string>
    expect(recorded).toEqual(current)
  })
})
