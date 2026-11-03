import { describe, expect, it } from "vitest";
import { resolveStyle, widgetStyle } from "@/features/page/themes/resolve";
import { contrastRatio } from "@/features/page/themes/color";

/** Desired contracts. These intentionally fail on the audited baseline; no product fix is included. */
describe("theme composition regressions identified by preparation audit", () => {
  it("keeps transparent widget text readable on the actual wallpaper colour", () => {
    const page = resolveStyle("night", {
      background: { kind: "solid", color: "#ffffff" },
      colors: { text: "#000000", muted: "#000000" },
    });
    const widget = widgetStyle(page, { surface: "transparent", text: "#ffffff" });
    const foreground = widget.vars["--tp-foreground"] ?? page.cssVars["--tp-foreground"]!;
    expect(contrastRatio(foreground, page.cssVars["--tp-background"]!)).toBeGreaterThanOrEqual(4.5);
  });

  it("derives outlined button text from the widget's effective background", () => {
    const page = resolveStyle("night");
    const widget = widgetStyle(page, { background: "#ffffff", text: "#000000", buttonFill: "outline" });
    const foreground = widget.vars["--tp-btn-text"] ?? page.cssVars["--tp-btn-text"]!;
    expect(contrastRatio(foreground, "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it("clears inherited glass blur when a widget is set to no surface", () => {
    const page = resolveStyle("night", { cards: { surface: "glass", opacity: 70 } });
    const widget = widgetStyle(page, { surface: "transparent" });
    const blur = widget.vars["--tp-card-blur"] ?? page.cssVars["--tp-card-blur"];
    expect(blur).toBe("0px");
  });
});
