import { layoutPresetSchema, type LayoutPreset, type LayoutFamily } from "../../contracts/layout";

/**
 * Layout presets: ordered block instances + presentation variants.
 * Optional blocks (About, Team, FAQ, Case studies…) sit at sensible
 * positions in every layout and simply disappear when they have no content,
 * so content added later appears without any layout change.
 */

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: "trades-v1",
    version: 1,
    family: "trades",
    label: "Trades",
    tokenPresetId: "trades-dark",
    mobileAction: "contact",
    blocks: [
      { id: "hero", type: "hero", variant: "bold" },
      { id: "services", type: "services", variant: "list" },
      { id: "booking", type: "booking", variant: "band" },
      { id: "reviews", type: "reviews", variant: "strip" },
      { id: "gallery", type: "gallery", variant: "grid" },
      { id: "about", type: "about", variant: "text" },
      { id: "team", type: "team", variant: "cards" },
      { id: "faq", type: "faq", variant: "accordion" },
      { id: "caseStudies", type: "caseStudies", variant: "list" },
      { id: "contact", type: "contact", variant: "actions" },
    ],
  },
  {
    id: "beauty-v1",
    version: 1,
    family: "beauty",
    label: "Beauty",
    tokenPresetId: "beauty-light",
    mobileAction: "booking",
    blocks: [
      { id: "hero", type: "hero", variant: "editorial" },
      { id: "gallery", type: "gallery", variant: "editorial" },
      { id: "services", type: "services", variant: "imageCards" },
      { id: "team", type: "team", variant: "portraits" },
      { id: "reviews", type: "reviews", variant: "quote" },
      { id: "booking", type: "booking", variant: "card" },
      { id: "about", type: "about", variant: "split" },
      { id: "faq", type: "faq", variant: "accordion" },
      { id: "caseStudies", type: "caseStudies", variant: "feature" },
      { id: "contact", type: "contact", variant: "details" },
    ],
  },
  {
    id: "education-v1",
    version: 1,
    family: "education",
    label: "Education",
    tokenPresetId: "education-clean",
    mobileAction: "contextual",
    blocks: [
      { id: "hero", type: "hero", variant: "trust" },
      { id: "about", type: "about", variant: "credentials" },
      { id: "services", type: "services", variant: "subjects" },
      { id: "team", type: "team", variant: "tutors" },
      { id: "reviews", type: "reviews", variant: "testimonials" },
      { id: "booking", type: "booking", variant: "card" },
      { id: "faq", type: "faq", variant: "columns" },
      { id: "gallery", type: "gallery", variant: "grid" },
      { id: "caseStudies", type: "caseStudies", variant: "list" },
      { id: "contact", type: "contact", variant: "details" },
    ],
  },
  {
    id: "professional-v1",
    version: 1,
    family: "professional",
    label: "Professional",
    tokenPresetId: "professional-refined",
    mobileAction: "contact",
    blocks: [
      { id: "hero", type: "hero", variant: "refined" },
      { id: "about", type: "about", variant: "split" },
      { id: "services", type: "services", variant: "consulting" },
      { id: "caseStudies", type: "caseStudies", variant: "feature" },
      { id: "reviews", type: "reviews", variant: "quote" },
      { id: "team", type: "team", variant: "cards" },
      { id: "faq", type: "faq", variant: "columns" },
      { id: "gallery", type: "gallery", variant: "grid" },
      { id: "contact", type: "contact", variant: "details" },
    ],
  },
  {
    id: "general-v1",
    version: 1,
    family: "general",
    label: "General",
    tokenPresetId: "general-balanced",
    mobileAction: "contextual",
    blocks: [
      { id: "hero", type: "hero", variant: "simple" },
      { id: "services", type: "services", variant: "cards" },
      { id: "about", type: "about", variant: "text" },
      { id: "reviews", type: "reviews", variant: "cards" },
      { id: "gallery", type: "gallery", variant: "grid" },
      { id: "booking", type: "booking", variant: "card" },
      { id: "team", type: "team", variant: "cards" },
      { id: "faq", type: "faq", variant: "accordion" },
      { id: "caseStudies", type: "caseStudies", variant: "list" },
      { id: "contact", type: "contact", variant: "actions" },
    ],
  },
].map((l) => layoutPresetSchema.parse(l));

export const FALLBACK_LAYOUT_ID = "general-v1";

/** Renamed/removed layout ids map forward here so published profiles never break. */
const LAYOUT_ALIASES: Record<string, string> = {};

const byId = new Map(LAYOUT_PRESETS.map((l) => [l.id, l]));

export interface ResolvedLayout {
  layout: LayoutPreset;
  warnings: { code: string; message: string }[];
}

export function resolveLayout(layoutId: string, storedVersion?: number): ResolvedLayout {
  const warnings: ResolvedLayout["warnings"] = [];
  const id = LAYOUT_ALIASES[layoutId] ?? layoutId;
  let layout = byId.get(id);
  if (!layout) {
    warnings.push({
      code: "layout_missing",
      message: `Layout "${layoutId}" is no longer available; showing the General layout instead.`,
    });
    layout = byId.get(FALLBACK_LAYOUT_ID)!;
  } else if (storedVersion !== undefined && storedVersion !== layout.version) {
    warnings.push({
      code: "layout_version_changed",
      message: `Layout "${layout.label}" was updated (v${storedVersion} → v${layout.version}). Review your page.`,
    });
  }
  return { layout, warnings };
}

export function getLayoutForFamily(family: LayoutFamily): LayoutPreset {
  return LAYOUT_PRESETS.find((l) => l.family === family)!;
}
