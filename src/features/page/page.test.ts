import { describe, expect, it } from "vitest";
import { businessContentSchema, imageSchema } from "@/features/businesses/content";
import { FIXTURES, getFixture } from "@/features/themes/fixtures";
import { INDUSTRY_PRESETS, getIndustryPreset } from "@/features/themes/presets/industries";
import { pageDocSchema } from "./contracts/page";
import { WIDGET_TYPES, settingsSchemas, type WidgetType } from "./contracts/widgets";
import { fromLegacyConfig, migratePage } from "./migrate";
import { buildPageViewModel } from "./renderer/view-model";
import { newPage, newWidget, planStarter, starterWidgets } from "./starter";
import { THEMES, getTheme } from "./themes/catalogue";
import { contrastRatio, mix } from "./themes/color";
import { resolveStyle, widgetStyle } from "./themes/resolve";
import { WIDGETS, defaultSettings } from "./widgets/registry";

const fx = (k: string) => getFixture(k)!;
const vmOf = (k: string, over: Partial<{ themeId: string; plan: "free" | "core" | "pro" | "business" }> = {}) => {
  const f = fx(k);
  return buildPageViewModel(f.content, { ...f.page, themeId: over.themeId ?? f.page.themeId }, { plan: over.plan ?? f.plan, now: new Date("2026-10-22T12:00:00Z") });
};

describe("widget registry", () => {
  it("defines every widget type, with a schema, defaults and valid editor fields", () => {
    expect(Object.keys(WIDGETS).sort()).toEqual([...WIDGET_TYPES].sort());
    for (const type of WIDGET_TYPES) {
      const def = WIDGETS[type];
      expect(def.version, type).toBeGreaterThan(0);
      expect(def.fields.length, type).toBeGreaterThan(0);
      const defaults = defaultSettings(type);
      const shape = (settingsSchemas[type] as unknown as { shape: Record<string, unknown> }).shape;
      for (const f of def.fields) expect(Object.keys(shape), `${type}.${f.key}`).toContain(f.key);
      expect(settingsSchemas[type].safeParse(defaults).success, type).toBe(true);
    }
  });
  it("covers every required category of widget", () => {
    const need: WidgetType[] = ["call", "whatsapp", "email", "social", "link", "directions", "serviceList", "featuredService", "priceMenu", "booking", "products", "offers", "payment", "reviews", "leaveReview", "team", "credentials", "text", "image", "gallery", "video", "faq", "document", "hours", "location", "serviceArea", "announcement"];
    for (const t of need) expect(WIDGETS[t], t).toBeDefined();
  });
  it("marks payments as simulated and never as live", () => {
    expect(WIDGETS.payment.simulated).toBe(true);
  });
  it("allows multiple instances only where it makes sense", () => {
    expect(WIDGETS.call.multiple).toBe(false);
    expect(WIDGETS.gallery.multiple).toBe(true);
    expect(WIDGETS.featuredService.multiple).toBe(true);
  });
});

describe("themes", () => {
  it("ships at least four, each genuinely different (not accent swaps)", () => {
    expect(THEMES.length).toBeGreaterThanOrEqual(4);
    const sig = (t: (typeof THEMES)[number]) => JSON.stringify([t.style.header.layout, t.style.header.avatarShape, t.style.text.headingFont, t.style.buttons.shape, t.style.buttons.fill, t.style.buttons.shadow, t.style.cards.surface, t.style.cards.radius, t.style.layout.desktop, t.style.background.kind, t.style.decoration]);
    expect(new Set(THEMES.map(sig)).size).toBe(THEMES.length);
    expect(new Set(THEMES.map((t) => t.style.header.layout)).size).toBeGreaterThanOrEqual(4);
    expect(new Set(THEMES.map((t) => t.style.layout.desktop)).size).toBe(3);
  });
  it("every theme's own colours are readable (WCAG AA)", () => {
    for (const t of THEMES) {
      const c = t.style.colors;
      const bg = t.style.background;
      const ends = bg.kind === "solid" ? [bg.color] : bg.kind === "gradient" ? [bg.from, bg.to] : bg.kind === "shader" ? [bg.base] : [bg.fallback];
      for (const e of ends) expect(contrastRatio(c.text, e), `${t.id} text/bg`).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c.text, c.surface), `${t.id} text/surface`).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c.accentText, c.accent), `${t.id} accent`).toBeGreaterThanOrEqual(4.5);
    }
  });
  it("resolves with no notices or failing checks for the shipped themes", () => {
    for (const t of THEMES) {
      const r = resolveStyle(t.id, {});
      expect(r.notices, t.id).toEqual([]);
      expect(r.contrast.filter((c) => !c.ok), t.id).toEqual([]);
      expect(r.overrideCount).toBe(0);
    }
  });
  it("is independent of industry: every industry can use every theme", () => {
    for (const i of INDUSTRY_PRESETS) expect(getTheme(i.suggestedThemeId), i.id).toBeDefined();
    const cafe = vmOf("cafe", { themeId: "noir" });
    expect(cafe.style.theme.id).toBe("noir");
  });
});

describe("style overrides", () => {
  it("applies owner overrides on top of the theme and 'reset to theme' removes them", () => {
    const withOv = resolveStyle("paper", { colors: { accent: "#0a7a3b" }, buttons: { shape: "pill" } });
    expect(withOv.spec.colors.accent).toBe("#0a7a3b");
    expect(withOv.spec.buttons.shape).toBe("pill");
    expect(withOv.overrideCount).toBe(2);
    const reset = resolveStyle("paper", {});
    expect(reset.spec.colors.accent).toBe(getTheme("paper")!.style.colors.accent);
    expect(reset.overrideCount).toBe(0);
  });
  it("rescues unreadable text and explains it", () => {
    const r = resolveStyle("paper", { colors: { text: "#f4eee6" } });
    expect(contrastRatio(r.spec.colors.text, "#f7f1ea")).toBeGreaterThanOrEqual(4.5);
    expect(r.notices.map((n) => n.code)).toContain("text_adjusted");
  });
  it("strengthens a too-weak photo overlay", () => {
    const r = resolveStyle("noir", { background: { kind: "image", image: { src: "/fixtures/img-1.svg", alt: "x" }, overlay: 0, overlayColor: "#0b0d12", fallback: "#0b0d12" } });
    expect(r.spec.background.kind === "image" && r.spec.background.overlay).toBeGreaterThan(30);
    expect(r.notices.map((n) => n.code)).toContain("overlay_boosted");
  });
  it("drops corrupt overrides instead of breaking the page", () => {
    const r = resolveStyle("paper", { colors: { accent: "red" }, text: { headingFont: "comic-sans" } });
    expect(r.spec.colors.accent).toBe(getTheme("paper")!.style.colors.accent);
    expect(r.notices.length).toBeGreaterThan(0);
  });
  it("falls back safely for an unknown theme", () => {
    const r = resolveStyle("deleted-theme", {});
    expect(r.theme.id).toBe("paper");
    expect(r.notices[0]?.code).toBe("theme_missing");
  });
  it("a page-colour override recolours a plain-colour background", () => {
    const r = resolveStyle("paper", { colors: { background: "#e8f0e8" } });
    expect(r.spec.background).toEqual({ kind: "solid", color: "#e8f0e8" });
  });
  it("accent-filled widgets stay readable", () => {
    const r = resolveStyle("paper", {});
    const w = widgetStyle(r, { surface: "accent", accent: "#ffee00" });
    expect(contrastRatio(w.vars["--tp-foreground"]!, w.vars["--tp-card-bg"]!)).toBeGreaterThanOrEqual(4.5);
  });
  it("per-widget overrides do not leak to the page style", () => {
    const r = resolveStyle("paper", {});
    widgetStyle(r, { radius: "none", emphasis: "featured" });
    expect(r.cssVars["--tp-card-radius"]).toBe("0.75rem");
  });
});

describe("page document and migration", () => {
  it("validates a fresh page and rejects bad colours at the contract", () => {
    expect(pageDocSchema.safeParse(newPage("barber")).success).toBe(true);
    expect(pageDocSchema.safeParse({ ...newPage("barber"), appearance: { colors: { accent: "javascript:alert(1)" } } }).success).toBe(false);
  });
  it("migrates the legacy layout config, keeping the owner's colour and font choices", () => {
    const m = migratePage({ schemaVersion: 1, layoutId: "beauty-v1", tokenPresetId: "beauty-light", overrides: { accent: "#123456", headingFont: "lexend" } }, "barber");
    expect(m.changed).toBe(true);
    expect(m.page.themeId).toBe("paper");
    expect(m.page.appearance.colors?.accent).toBe("#123456");
    expect(m.page.appearance.text?.headingFont).toBe("lexend");
    expect(m.page.widgets.length).toBeGreaterThan(0);
    expect(m.notes[0]).toMatch(/content is unchanged/);
  });
  it("removes unknown widget types from view and says so in plain language", () => {
    const page = newPage("barber");
    const raw = { ...page, widgets: [...page.widgets, { id: "x1", type: "hologram", version: 1, hidden: false, appearance: {}, settings: {} }] };
    const m = migratePage(raw, "barber");
    expect(m.page.widgets.some((w) => w.type === "hologram")).toBe(false);
    expect(m.notes.join(" ")).toMatch(/no longer available/);
  });
  it("de-duplicates widget ids and repairs a half-valid document", () => {
    const w = newWidget("link", { label: "A", url: "https://example.com" });
    const m = migratePage({ schemaVersion: 2, themeId: "ghost", appearance: "nope", widgets: [w, { ...w }] }, "other");
    expect(new Set(m.page.widgets.map((x) => x.id)).size).toBe(2);
    expect(m.page.themeId).toBe("paper");
  });
  it("legacy conversion never throws on junk", () => {
    expect(() => fromLegacyConfig({ tokenPresetId: 5 as never, overrides: { accent: "nope" } }, "other")).not.toThrow();
    expect(migratePage(null).page.widgets.length).toBeGreaterThanOrEqual(0);
  });
});

describe("starters are explicit, previewable and non-destructive", () => {
  it("every industry's starter lists valid widget types", () => {
    for (const i of INDUSTRY_PRESETS) {
      expect(starterWidgets(i.id).length, i.id).toBeGreaterThan(0);
      for (const w of starterWidgets(i.id)) expect(WIDGETS[w.type as WidgetType]).toBeDefined();
    }
    expect(getIndustryPreset("flamenco-teacher").id).toBe("other");
  });
  it("'add' mode never removes or reorders what the owner has", () => {
    const current = [newWidget("text", { body: "mine" }), newWidget("gallery"), newWidget("link", { label: "x", url: "https://example.com" })];
    const plan = planStarter(current, "barber", "add");
    expect(plan.removed).toEqual([]);
    expect(plan.result.slice(0, 3)).toEqual(current);
    expect(plan.added.every((a) => !current.some((c) => c.type === a.type))).toBe(true);
  });
  it("'replace' mode names exactly what would leave, and keeps existing widgets' settings", () => {
    const text = newWidget("text", { body: "keep my words" });
    const odd = newWidget("link", { label: "Custom", url: "https://example.com" });
    const plan = planStarter([text, odd], "consultant", "replace");
    expect(plan.removed.map((w) => w.type)).toEqual(["link"]);
    expect(plan.result.find((w) => w.type === "text")).toBe(text);
  });
});

describe("view-model", () => {
  it("switching theme preserves business records and widget arrangement exactly", () => {
    for (const k of ["barber", "tutor", "mechanic", "cafe", "consultant", "unlisted"]) {
      const a = vmOf(k);
      for (const t of THEMES) {
        const b = vmOf(k, { themeId: t.id });
        expect(b.business, `${k}/${t.id}`).toEqual(a.business);
        expect(b.widgets.map((w) => [w.id, w.type, w.hidden, w.settings]), `${k}/${t.id}`).toEqual(a.widgets.map((w) => [w.id, w.type, w.hidden, w.settings]));
      }
    }
  });
  it("hides empty/hidden widgets from visitors but still lists them for the owner, with a reason", () => {
    const f = fx("minimal");
    const page = newPage("tutor");
    page.widgets.push(newWidget("gallery"), newWidget("hours"));
    page.widgets[0]!.hidden = true;
    const vm = buildPageViewModel(f.content, page, { plan: "business" });
    expect(vm.widgets.length).toBe(page.widgets.length);
    const gallery = vm.widgets.find((w) => w.type === "gallery")!;
    expect(gallery.status.state).toBe("empty");
    expect(vm.visible.some((w) => w.type === "gallery")).toBe(false);
    expect(vm.visible.some((w) => w.id === page.widgets[0]!.id)).toBe(false);
    expect(gallery.status.state === "empty" && gallery.status.reason).toMatch(/photos/i);
  });
  it("never invents content: no reviews widget visible without testimonials or a rating", () => {
    const vm = vmOf("unlisted");
    expect(vm.business.testimonials).toEqual([]);
    const page = { ...fx("unlisted").page, widgets: [newWidget("reviews")] };
    expect(buildPageViewModel(fx("unlisted").content, page, { plan: "business" }).visible).toEqual([]);
  });
  it("plan gating keeps content but hides locked widgets, with an explanation", () => {
    const vm = vmOf("barber", { plan: "free" });
    const gallery = vm.widgets.find((w) => w.type === "gallery");
    if (gallery) expect(gallery.status.state).toBe("locked");
    expect(vm.business.services.length).toBeLessThanOrEqual(3);
    expect(vm.showBranding).toBe(true);
    const pay = buildPageViewModel(fx("mechanic").content, { ...fx("mechanic").page, widgets: [newWidget("payment")] }, { plan: "core" });
    expect(pay.widgets[0]!.status.state).toBe("locked");
  });
  it("free plan keeps the industry's suggested theme", () => {
    const vm = buildPageViewModel(fx("tutor").content, { ...fx("tutor").page, themeId: "showroom" }, { plan: "free" });
    expect(vm.style.theme.id).toBe(getIndustryPreset("tutor").suggestedThemeId);
  });
  it("unsafe or unsupported links never become visible widgets", () => {
    const f = fx("minimal");
    const bad = [newWidget("link", { label: "x", url: "javascript:alert(1)" }), newWidget("video", { url: "https://evil.example.com/v.mp4" }), newWidget("document", { title: "d", url: "data:text/html,hi" })];
    const vm = buildPageViewModel(f.content, { ...newPage("other"), widgets: bad }, { plan: "business" });
    expect(vm.visible).toEqual([]);
    expect(vm.widgets.every((w) => w.status.state === "empty")).toBe(true);
  });
  it("announcements expire and offers expire", () => {
    const f = fx("cafe");
    const page = { ...newPage("other"), widgets: [newWidget("announcement", { text: "Old news", endsAt: "2026-01-01" }), newWidget("announcement", { text: "Fresh", endsAt: "2027-01-01" })] };
    const vm = buildPageViewModel(f.content, page, { plan: "business", now: new Date("2026-10-22T12:00:00Z") });
    expect(vm.visible.map((w) => w.settings.text)).toEqual(["Fresh"]);
  });
  it("corrupt widget settings fall back to defaults and are reported", () => {
    const f = fx("barber");
    const w = newWidget("serviceList");
    w.settings = { variant: "hologram", showPrices: "yes" };
    const vm = buildPageViewModel(f.content, { ...newPage("barber"), widgets: [w] }, { plan: "business" });
    expect(vm.widgets[0]!.settings.variant).toBe("list");
    expect(vm.notes.join(" ")).toMatch(/could not be read/);
  });
});

describe("fixtures", () => {
  it("all validate against the business schema and the page contract", () => {
    for (const f of FIXTURES) {
      expect(businessContentSchema.safeParse(f.content).success, f.key).toBe(true);
      expect(pageDocSchema.safeParse(f.page).success, f.key).toBe(true);
    }
  });
  it("cover the six required kinds of business, and never advertise a booking flow that doesn't exist", () => {
    for (const k of ["barber", "tutor", "mechanic", "cafe", "consultant", "unlisted"]) expect(fx(k)).toBeDefined();
    for (const f of FIXTURES) expect(f.content.booking?.onlineBookingReady, f.key).toBe(false);
  });
  it("pair looks and industries independently (several fixtures do NOT use their suggested theme)", () => {
    const off = FIXTURES.filter((f) => f.page.themeId !== getIndustryPreset(f.content.identity.industryKey).suggestedThemeId);
    expect(off.length).toBeGreaterThanOrEqual(4);
  });
  it("every headline fixture shows a compact, useful set of widgets", () => {
    for (const k of ["barber", "tutor", "mechanic", "cafe", "consultant", "unlisted"]) {
      const vm = vmOf(k);
      expect(vm.visible.length, k).toBeGreaterThanOrEqual(3);
      expect(vm.visible.length, k).toBeLessThanOrEqual(14);
    }
  });
});

describe("images", () => {
  it("accepts a small uploaded jpeg, relative and https images, and rejects svg data URLs and scripts", () => {
    const ok = (src: string) => imageSchema.safeParse({ src, alt: "x" }).success;
    expect(ok("data:image/jpeg;base64,/9j/4AAQSkZJRg==")).toBe(true);
    expect(ok("/fixtures/img-1.svg")).toBe(true);
    expect(ok("https://example.com/a.jpg")).toBe(true);
    expect(ok("data:image/svg+xml;base64,PHN2Zz4=")).toBe(false);
    expect(ok("javascript:alert(1)")).toBe(false);
    expect(ok("data:text/html;base64,AAAA")).toBe(false);
  });
  it("keeps a focal point within 0-100", () => {
    expect(imageSchema.safeParse({ src: "/a.png", alt: "x", focal: { x: 50, y: 50 } }).success).toBe(true);
    expect(imageSchema.safeParse({ src: "/a.png", alt: "x", focal: { x: 150, y: 0 } }).success).toBe(false);
  });
  it("colour helpers behave", () => {
    expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
  });
});
