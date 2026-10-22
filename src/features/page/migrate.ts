import { pageDocSchema, PAGE_SCHEMA_VERSION, type PageDoc } from "./contracts/page";
import type { StyleOverrides } from "./contracts/style";
import { DEFAULT_THEME_ID, canonicalThemeId, getTheme } from "./themes/catalogue";
import { getWidget } from "./widgets/registry";
import { newPage, type StoredWidget } from "./starter";

export interface MigrationResult {
  page: PageDoc;
  /** Plain-language notes shown to the owner (never technical identifiers). */
  notes: string[];
  changed: boolean;
}

/** Legacy v1 token preset ids -> nearest current theme. */
const LEGACY_THEME: Record<string, string> = {
  "trades-dark": "night",
  "beauty-light": "clean",
  "education-clean": "colour",
  "professional-refined": "clean",
  "general-balanced": "clean",
};

interface LegacyConfig {
  tokenPresetId?: string;
  overrides?: Record<string, string>;
}

/** v1 {layoutId, tokenPresetId, overrides{accent,headingFont,...}} -> v2, keeping the owner's colour/font choices. */
export function fromLegacyConfig(legacy: LegacyConfig, industryKey: string): PageDoc {
  const page = newPage(industryKey);
  if (legacy.tokenPresetId && LEGACY_THEME[legacy.tokenPresetId]) page.themeId = LEGACY_THEME[legacy.tokenPresetId]!;
  const o = legacy.overrides ?? {};
  const appearance: StyleOverrides = {};
  const colors: NonNullable<StyleOverrides["colors"]> = {};
  if (/^#[0-9a-f]{6}$/i.test(o.accent ?? "")) colors.accent = o.accent;
  if (/^#[0-9a-f]{6}$/i.test(o.accentForeground ?? "")) colors.accentText = o.accentForeground;
  if (/^#[0-9a-f]{6}$/i.test(o.background ?? "")) colors.background = o.background;
  if (/^#[0-9a-f]{6}$/i.test(o.foreground ?? "")) colors.text = o.foreground;
  if (Object.keys(colors).length) appearance.colors = colors;
  const fonts = ["inter", "barlowCondensed", "fraunces", "sourceSerif", "manrope", "lexend"];
  const text: NonNullable<StyleOverrides["text"]> = {};
  if (fonts.includes(o.headingFont ?? "")) text.headingFont = o.headingFont as never;
  if (fonts.includes(o.bodyFont ?? "")) text.bodyFont = o.bodyFont as never;
  if (Object.keys(text).length) appearance.text = text;
  page.appearance = appearance;
  return page;
}

/**
 * Bring any stored page up to the current schema without losing owner content:
 * unknown widget types are kept in the list as hidden "unavailable" is NOT done (they could not render);
 * instead they are dropped from view and reported, and invalid settings fall back to defaults per widget.
 */
export function migratePage(raw: unknown, industryKey = "other"): MigrationResult {
  const notes: string[] = [];
  const r = (raw ?? {}) as Record<string, unknown>;

  if (!raw || typeof raw !== "object") return { page: newPage(industryKey), notes: ["A fresh page was created."], changed: true };
  if (r.schemaVersion !== PAGE_SCHEMA_VERSION) {
    notes.push("Your page was updated to the latest design system. Your content is unchanged; please check how it looks.");
    return { page: fromLegacyConfig(r as LegacyConfig, industryKey), notes, changed: true };
  }

  const strict = pageDocSchema.safeParse(raw);
  let page: PageDoc;
  if (strict.success) page = strict.data;
  else {
    const widgets = Array.isArray(r.widgets) ? (r.widgets as unknown[]) : [];
    page = {
      schemaVersion: PAGE_SCHEMA_VERSION,
      themeId: typeof r.themeId === "string" ? r.themeId : DEFAULT_THEME_ID,
      appearance: (typeof r.appearance === "object" && r.appearance ? r.appearance : {}) as StyleOverrides,
      meta: { searchVisible: (r.meta as { searchVisible?: boolean } | undefined)?.searchVisible !== false, primaryAction: ((r.meta as { primaryAction?: string } | undefined)?.primaryAction ?? "auto") as PageDoc["meta"]["primaryAction"] },
      widgets: widgets
        .filter((w): w is Record<string, unknown> => !!w && typeof w === "object" && typeof (w as { type?: unknown }).type === "string" && typeof (w as { id?: unknown }).id === "string")
        .map((w) => ({ id: String(w.id), type: String(w.type), version: Number(w.version) || 1, hidden: Boolean(w.hidden), appearance: (w.appearance ?? {}) as StoredWidget["appearance"], settings: (w.settings ?? {}) as Record<string, unknown> })),
    };
    notes.push("Some saved page settings were repaired.");
  }

  const canon = canonicalThemeId(page.themeId);
  if (canon && canon !== page.themeId) {
    notes.push("Starting looks were redesigned. Your content and your own style changes are kept; check how the page looks.");
    page = { ...page, themeId: canon };
  }
  if (!getTheme(page.themeId)) {
    notes.push("The theme you used is no longer available, so a standard look is shown. Pick a theme in Design.");
    page = { ...page, themeId: DEFAULT_THEME_ID };
  }

  // Per-widget: drop unknown types, run migrations for older versions, de-duplicate ids.
  const seen = new Set<string>();
  const widgets: StoredWidget[] = [];
  let dropped = 0;
  for (const w of page.widgets) {
    const def = getWidget(w.type);
    if (!def) { dropped += 1; continue; }
    let settings = w.settings;
    if (w.version < def.version && def.migrate) settings = def.migrate(settings, w.version);
    let id = w.id;
    if (seen.has(id)) id = `${id}-${seen.size}`;
    seen.add(id);
    widgets.push({ ...w, id, version: def.version, settings });
  }
  if (dropped) notes.push(`${dropped} item${dropped === 1 ? "" : "s"} on your page used a feature that is no longer available and ${dropped === 1 ? "was" : "were"} removed from view.`);
  page = { ...page, widgets };
  return { page, notes, changed: notes.length > 0 };
}
