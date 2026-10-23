import { describe, expect, it } from "vitest";
import { contrastRatio } from "./color";
import { resolveStyle, widgetStyle } from "./resolve";

describe("effective widget surfaces", () => {
  it("keeps transparent widget text readable after changing the wallpaper independently of the palette", () => {
    const page = resolveStyle("night", { background: { kind: "solid", color: "#ffffff" }, colors: { text: "#000000" } });
    const widget = widgetStyle(page, { surface: "transparent", text: "#ffffff" });
    expect(contrastRatio(widget.vars["--tp-foreground"]!, "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it("resolves outlined buttons against their widget background", () => {
    const page = resolveStyle("night");
    const widget = widgetStyle(page, { background: "#ffffff", text: "#000000", buttonFill: "outline" });
    expect(widget.vars["--tp-btn-bg"]).toBe("transparent");
    expect(contrastRatio(widget.vars["--tp-btn-text"]!, "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it("removes inherited glass effects when a widget has no surface", () => {
    const page = resolveStyle("night", { cards: { surface: "glass" } });
    const widget = widgetStyle(page, { surface: "transparent" });
    expect(page.cssVars["--tp-card-blur"]).toBe("22px");
    expect(widget.vars["--tp-card-blur"]).toBe("0px");
    expect(widget.vars["--tp-card-filter"]).toBe("none");
  });

  it("resolves page outline text against a separately chosen wallpaper too", () => {
    const page = resolveStyle("night", { background: { kind: "solid", color: "#ffffff" }, colors: { text: "#000000" }, buttons: { fill: "outline" } });
    expect(contrastRatio(page.cssVars["--tp-btn-text"]!, "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it("a solid section does not inherit a glass border/effect from the page", () => {
    const page = resolveStyle("night", { cards: { surface: "glass" } });
    const widget = widgetStyle(page, { surface: "solid", border: "thin" });
    expect(widget.vars["--tp-card-filter"]).toBe("none");
    expect(widget.vars["--tp-card-border-color"]).toBe("var(--tp-border)");
  });

  it("does not mutate the page or stored widget appearance", () => {
    const page = resolveStyle("night");
    const appearance = { surface: "transparent" as const, text: "#ffffff" };
    const before = structuredClone({ page, appearance });
    widgetStyle(page, appearance);
    expect({ page, appearance }).toEqual(before);
    expect(widgetStyle(page, {})).toEqual({ vars: {}, attrs: {} });
  });
});
