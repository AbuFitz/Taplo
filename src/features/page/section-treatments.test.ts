import { describe, expect, it } from "vitest"
import { applySectionTreatment, selectedSectionTreatment } from "./section-treatments"
import { previewSectionTreatment } from "./preview-appearance"
import { newPage, newWidget } from "./starter"
import { resolveStyle, widgetStyle } from "./themes/resolve"
import { contrastRatio } from "./themes/color"

describe("section treatment engine", () => {
  it("replaces the surface recipe without losing independent button, accent or image choices", () => {
    const original = { background: "#123456", text: "#ffffff", buttonShape: "pill" as const, accent: "#123456", thumbnail: { src: "/test.png", alt: "Mark" } }
    const next = applySectionTreatment(original, "inline")
    expect(next).toMatchObject({ surface: "transparent", padding: "none", buttonShape: "pill", accent: "#123456", thumbnail: original.thumbnail })
    expect(next.background).toBeUndefined()
    expect(original.background).toBe("#123456")
    expect(selectedSectionTreatment(next)).toBe("inline")
  })
  it("previews only the selected panel and never mutates records or saved appearance", () => {
    const page = newPage("barber")
    const widget = newWidget("priceMenu")
    page.widgets.push(widget)
    const before = structuredClone(page)
    const preview = previewSectionTreatment(page, widget.id, "spotlight")
    expect(preview.widgets.find(w => w.id === widget.id)!.appearance.surface).toBe("accent")
    expect(preview.widgets.find(w => w.id === widget.id)!.settings).toEqual(widget.settings)
    expect(page).toEqual(before)
    expect(previewSectionTreatment(page, widget.id, "invalid")).toBe(page)
  })
  it("derives local separators, muted text, buttons and focus for inverted panels", () => {
    for (const id of ["service", "ink"]) {
      const page = resolveStyle(id)
      const style = widgetStyle(page, applySectionTreatment({}, "spotlight"))
      const bg = style.vars["--tp-card-bg"]!
      expect(contrastRatio(style.vars["--tp-muted"]!, bg)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(style.vars["--tp-btn-text"]!, style.vars["--tp-btn-bg"]!)).toBeGreaterThanOrEqual(4.5)
      expect(style.vars["--tp-focus"]).toBe(style.vars["--tp-foreground"])
      expect(style.vars["--tp-line"]).not.toBe(page.cssVars["--tp-line"])
      expect(style.vars["--tp-card-border-w"]).toBe("0px")
    }
  })
})

it("keeps solid, outline and soft button choices effective on a spotlight surface", () => {
  const page=resolveStyle("service")
  for (const fill of ["solid","outline","soft"] as const) {
    const result=widgetStyle(page,{...applySectionTreatment({},"spotlight"),buttonFill:fill})
    const bg=result.vars["--tp-btn-bg"]!
    expect(result.attrs["data-btn-fill"]).toBe(fill)
    if (fill==='outline') {
      expect(bg).toBe('transparent')
      expect(contrastRatio(result.vars["--tp-btn-text"]!,result.vars["--tp-card-bg"]!)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(result.vars["--tp-btn-text"]!,result.vars["--tp-accent-soft"]!)).toBeGreaterThanOrEqual(4.5)
    } else {
      expect(contrastRatio(result.vars["--tp-btn-text"]!,bg)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(result.vars["--tp-btn-text"]!,result.vars["--tp-btn-hover"]!)).toBeGreaterThanOrEqual(4.5)
    }
  }
})
