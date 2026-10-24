import { describe, expect, it } from "vitest";
import { newPage } from "./starter";
import { previewAppearance, previewWidgetStyle } from "./preview-appearance";

describe("read-only look previews", () => {
  it("uses a saved look without changing the draft, its blocks or the saved snapshot", () => {
    const page = newPage("barber");
    page.savedLooks = [
      {
        id: "first",
        name: "My first look",
        themeId: "clay",
        overrides: {
          colors: { accent: "#123456" },
          header: { avatarShape: "arch" },
        },
      },
    ];
    const before = structuredClone(page);
    const preview = previewAppearance(page, { savedLookId: "first" });
    expect(preview.themeId).toBe("clay");
    expect(preview.appearance).toEqual({
      colors: { accent: "#123456" },
      header: { avatarShape: "arch" },
      motion: "none",
    });
    preview.appearance.colors!.accent = "#abcdef";
    expect(page).toEqual(before);
    expect(preview.widgets).toBe(page.widgets);
  });
  it("shows a curated look without carrying the current draft's overrides into it", () => {
    const page = newPage("barber");
    page.appearance = { colors: { accent: "#123456" } };
    expect(previewAppearance(page, { lookId: "night" })).toMatchObject({
      themeId: "night",
      appearance: { motion: "none" },
    });
    expect(page.appearance.colors?.accent).toBe("#123456");
  });
  it("ignores unknown ids and never accepts a URL or arbitrary CSS as a look", () => {
    const page = newPage("barber");
    for (const pose of [
      { lookId: "https://example.com" },
      { savedLookId: "missing" },
      { lookId: "background:red" },
    ])
      expect(previewAppearance(page, pose)).toBe(page);
  });
});

it("saved section style previews copy appearance only onto the selected section", () => {
  const page = newPage("barber");
  const widget = page.widgets[0]!;
  page.savedStyles = [
    {
      id: "blue",
      name: "Blue",
      appearance: { background: "#123456", emphasis: "featured" },
    },
  ];
  const before = structuredClone(page);
  const preview = previewWidgetStyle(page, widget.id, "blue");
  expect(preview.widgets[0]!.appearance).toEqual(
    page.savedStyles[0]!.appearance,
  );
  expect(preview.widgets[0]!.settings).toEqual(widget.settings);
  expect(preview.widgets.slice(1)).toEqual(page.widgets.slice(1));
  preview.widgets[0]!.appearance.background = "#abcdef";
  expect(page).toEqual(before);
  expect(previewWidgetStyle(page, "missing", "blue")).toBe(page);
  expect(previewWidgetStyle(page, widget.id, "missing")).toBe(page);
});
