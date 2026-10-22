import { describe, expect, it } from "vitest";
import { FIXTURES, INDUSTRY_FIXTURE_KEYS, getFixture } from "./fixtures";
import { LAYOUT_PRESETS, resolveLayout } from "./presets/layouts";
import { INDUSTRY_PRESETS, getIndustryPreset, searchIndustries } from "./presets/industries";
import { TOKEN_PRESETS } from "./tokens/presets";
import { resolveTokens } from "./tokens/resolve";
import { contrastRatio } from "./tokens/contrast";
import { buildPublicProfileViewModel, visibleBlockTypes } from "./renderer/view-model";
import { businessContentSchema } from "@/features/businesses/content";

const vmFor = (key: string, layoutId: string, plan = getFixture(key)!.plan) => {
  const layout = resolveLayout(layoutId).layout;
  return buildPublicProfileViewModel(getFixture(key)!.content, {
    config: { layoutId, layoutVersion: layout.version, tokenPresetId: layout.tokenPresetId, overrides: {} },
    plan,
  });
};

describe("fixtures", () => {
  it("all validate against the shared business schema", () => {
    for (const f of FIXTURES) expect(() => businessContentSchema.parse(f.content), f.key).not.toThrow();
  });
});

describe("token presets", () => {
  it("every text/background pair clears WCAG AA", () => {
    for (const p of TOKEN_PRESETS) {
      const t = p.tokens;
      expect(contrastRatio(t.background, t.foreground), p.id).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.surface, t.foreground), p.id).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.background, t.mutedForeground), p.id).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.surface, t.mutedForeground), p.id).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.accent, t.accentForeground), p.id).toBeGreaterThanOrEqual(4.5);
    }
  });
  it("rejects low-contrast overrides with a warning and keeps the preset", () => {
    const r = resolveTokens("general-balanced", { background: "#ffffff", foreground: "#eeeeee" });
    expect(r.tokens.foreground).toBe("#1a1a1a");
    expect(r.warnings.map((w) => w.code)).toContain("override_contrast_text");
  });
  it("auto-picks readable accent text and drops invalid keys", () => {
    const r = resolveTokens("general-balanced", { accent: "#ffee00", bogus: "x" } as never);
    expect(contrastRatio(r.tokens.accent, r.tokens.accentForeground)).toBeGreaterThanOrEqual(4.5);
    const bad = resolveTokens("general-balanced", { accent: "red" });
    expect(bad.tokens.accent).toBe("#0f766e");
    expect(bad.warnings.length).toBeGreaterThan(0);
  });
  it("falls back safely for an unknown preset", () => {
    const r = resolveTokens("deleted-preset");
    expect(r.presetId).toBe("general-balanced");
    expect(r.warnings[0]?.code).toBe("token_preset_missing");
  });
});

describe("layout resolution", () => {
  it("has five families, each referencing a real token preset", () => {
    expect(LAYOUT_PRESETS.map((l) => l.family).sort()).toEqual(["beauty", "education", "general", "professional", "trades"]);
    for (const l of LAYOUT_PRESETS) expect(TOKEN_PRESETS.some((t) => t.id === l.tokenPresetId)).toBe(true);
  });
  it("falls back to General with a warning for unknown or outdated layouts", () => {
    expect(resolveLayout("gone-v9").layout.family).toBe("general");
    expect(resolveLayout("gone-v9").warnings[0]?.code).toBe("layout_missing");
    expect(resolveLayout("trades-v1", 0).warnings[0]?.code).toBe("layout_version_changed");
  });
  it("every industry preset points at an existing layout", () => {
    for (const i of INDUSTRY_PRESETS) expect(resolveLayout(i.defaultLayoutId).warnings, i.id).toEqual([]);
  });
  it("unknown industries use General; search always offers Other", () => {
    expect(getIndustryPreset("flamenco-teacher").id).toBe("other");
    expect(searchIndustries("zzzz").map((p) => p.id)).toEqual(["other"]);
    expect(searchIndustries("garden").some((p) => p.id === "landscaper")).toBe(true);
  });
});

describe("render pipeline", () => {
  it("same dataset yields genuinely different compositions per family", () => {
    const sig = LAYOUT_PRESETS.map((l) => {
      const vm = vmFor("barber", l.id);
      return vm.blocks.map((b) => `${b.config.type}:${(b.config as { variant: string }).variant}`).join(",");
    });
    expect(new Set(sig).size).toBe(5);
    const tokenSig = new Set(LAYOUT_PRESETS.map((l) => JSON.stringify(vmFor("barber", l.id).tokens)));
    expect(tokenSig.size).toBe(5);
  });
  it("matches the specified default block order per family", () => {
    const order = (id: string) => vmFor("stress", id).blocks.map((b) => b.config.type).filter((t) => !["team", "faq", "about", "caseStudies", "gallery", "booking", "reviews", "services", "contact", "hero"].includes(t) ? false : true);
    const core = (id: string, keep: string[]) => order(id).filter((t) => keep.includes(t));
    expect(core("trades-v1", ["hero", "services", "booking", "reviews", "gallery", "contact"])).toEqual(["hero", "services", "booking", "reviews", "gallery", "contact"]);
    expect(core("beauty-v1", ["hero", "gallery", "services", "team", "reviews", "booking", "contact"])).toEqual(["hero", "gallery", "services", "team", "reviews", "booking", "contact"]);
    expect(core("education-v1", ["hero", "about", "services", "team", "reviews", "booking", "contact"])).toEqual(["hero", "about", "services", "team", "reviews", "booking", "contact"]);
    expect(core("professional-v1", ["hero", "about", "services", "caseStudies", "reviews", "contact"])).toEqual(["hero", "about", "services", "caseStudies", "reviews", "contact"]);
    expect(core("general-v1", ["hero", "services", "about", "reviews", "gallery", "booking", "contact"])).toEqual(["hero", "services", "about", "reviews", "gallery", "booking", "contact"]);
    expect(vmFor("stress", "professional-v1").blocks.some((b) => b.config.type === "booking")).toBe(false);
  });
  it("drops blocks with no meaningful content and never invents any", () => {
    const vm = vmFor("minimal", "trades-v1");
    expect(vm.blocks.map((b) => b.config.type)).toEqual(["hero", "services", "booking", "contact"]);
    expect(vm.business.rating).toBeUndefined();
    const none = vmFor("no-contacts", "general-v1");
    expect(none.blocks.map((b) => b.config.type)).toEqual(["hero", "services", "about"]);
    expect(none.primaryAction).toBeNull();
    expect(none.contactActions).toEqual([]);
  });
  it("switching theme never changes business content", () => {
    const a = vmFor("mechanic", "trades-v1").business;
    const b = vmFor("mechanic", "beauty-v1").business;
    expect(a).toEqual(b);
  });
  it("applies plan entitlements without mutating content", () => {
    const free = vmFor("mechanic", "trades-v1", "free");
    expect(free.business.services).toHaveLength(3);
    expect(free.business.gallery).toHaveLength(0);
    expect(free.showBranding).toBe(true);
    expect(free.onlineBooking).toBe(false);
    expect(free.primaryAction?.kind).toBe("call");
    expect(free.blocks.some((b) => b.config.type === "gallery")).toBe(false);
    const biz = vmFor("mechanic", "trades-v1", "business");
    expect(biz.business.services).toHaveLength(5);
    expect(biz.onlineBooking).toBe(true);
    expect(biz.showBranding).toBe(false);
  });
  it("free plan cannot switch theme tokens", () => {
    const layout = resolveLayout("trades-v1").layout;
    const vm = buildPublicProfileViewModel(getFixture("minimal")!.content, {
      config: { layoutId: layout.id, layoutVersion: 1, tokenPresetId: "beauty-light", overrides: { accent: "#ff0000" } },
      plan: "free",
    });
    expect(vm.tokens.background).toBe(TOKEN_PRESETS.find((t) => t.id === "trades-dark")!.tokens.background);
  });
  it("never links a service-area business's address and omits dead links", () => {
    const vm = vmFor("detailer", "general-v1");
    expect(vm.contactActions.every((a) => a.href.length > 8)).toBe(true);
    expect(vm.business.location.addressLine).toBeUndefined();
  });
  it("reports content that a layout leaves unplaced, and previews visible sections", () => {
    expect(visibleBlockTypes(getFixture("mechanic")!.content, "professional-v1", "business")).not.toContain("booking");
    expect(vmFor("mechanic", "professional-v1").unplacedContent).toContain("booking");
  });
  it("supports every industry fixture on every family", () => {
    for (const k of INDUSTRY_FIXTURE_KEYS) for (const l of LAYOUT_PRESETS) expect(() => vmFor(k, l.id), `${k}/${l.id}`).not.toThrow();
  });
});
