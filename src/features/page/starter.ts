import type { IndustryPreset } from "@/features/themes/contracts/industry";
import { getIndustryPreset } from "@/features/themes/presets/industries";
import type { PageDoc } from "./contracts/page";
import type { WidgetType } from "./contracts/widgets";
import { defaultSettings, getWidget } from "./widgets/registry";
import { DEFAULT_THEME_ID, getTheme } from "./themes/catalogue";

export type StoredWidget = PageDoc["widgets"][number];

let counter = 0;
export function newWidgetId(type: string): string {
  counter += 1;
  return `${type}-${Date.now().toString(36)}${counter.toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

export function newWidget(type: WidgetType, settings: Record<string, unknown> = {}): StoredWidget {
  const def = getWidget(type)!;
  return { id: newWidgetId(type), type, version: def.version, hidden: false, appearance: {}, settings: { ...defaultSettings(type), ...settings } };
}

/** Per-widget tweaks so a starter feels right for the business (still just settings). */
function tune(type: WidgetType, industry: IndustryPreset): Record<string, unknown> {
  const t = industry.terminology;
  switch (type) {
    case "serviceList": return { title: t.services, variant: industry.suggestedThemeId === "classroom" ? "cards" : "list" };
    case "priceMenu": return { title: t.services };
    case "team": return { title: t.team };
    case "reviews": return { title: t.reviews };
    case "text": return { title: "About" };
    case "faq": return { title: "Questions" };
    case "gallery": return { title: "Our work" };
    case "credentials": return { title: "Credentials" };
    case "booking": return { label: t.booking, variant: "button" };
    case "document": return { title: "Download our menu or price list" };
    case "hours": return { title: "Opening hours" };
    case "location": return { title: "Find us" };
    case "serviceArea": return { title: "Areas we cover" };
    default: return {};
  }
}

export function starterWidgets(industryKey: string): StoredWidget[] {
  const industry = getIndustryPreset(industryKey);
  return industry.starterWidgets.map((type) => newWidget(type, tune(type, industry)));
}

export function newPage(industryKey: string): PageDoc {
  const industry = getIndustryPreset(industryKey);
  return {
    schemaVersion: 2,
    themeId: getTheme(industry.suggestedThemeId) ? industry.suggestedThemeId : DEFAULT_THEME_ID,
    appearance: {},
    meta: { searchVisible: true },
    widgets: starterWidgets(industryKey),
  };
}

export interface StarterPlan {
  mode: "add" | "replace";
  /** Final widget list if applied. */
  result: StoredWidget[];
  added: StoredWidget[];
  /** Widgets that would leave the page (replace mode only). Business records are never touched. */
  removed: StoredWidget[];
  kept: StoredWidget[];
}

/**
 * Plan (not apply) a starter arrangement. "add" never removes or reorders anything the owner has;
 * "replace" lists exactly what leaves the page so it can be previewed and undone.
 */
export function planStarter(current: StoredWidget[], industryKey: string, mode: StarterPlan["mode"]): StarterPlan {
  const starter = starterWidgets(industryKey);
  if (mode === "add") {
    const have = new Set(current.map((w) => w.type));
    const added = starter.filter((w) => !have.has(w.type as WidgetType));
    return { mode, result: [...current, ...added], added, removed: [], kept: current };
  }
  // replace: reuse existing instances of the same type (keeps the owner's settings/appearance), re-ordered.
  const pool = [...current];
  const result: StoredWidget[] = [];
  const added: StoredWidget[] = [];
  for (const s of starter) {
    const i = pool.findIndex((w) => w.type === s.type);
    if (i >= 0) result.push(pool.splice(i, 1)[0]!);
    else {
      result.push(s);
      added.push(s);
    }
  }
  return { mode, result, added, removed: pool, kept: result.filter((w) => !added.includes(w)) };
}
