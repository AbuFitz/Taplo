import { applySectionTreatment, sectionTreatment, supportsSectionTreatment } from "./section-treatments";
import type { PageDoc } from "./contracts/page";
import { getTheme } from "./themes/catalogue";

/** A read-only presentation pose. Business content, sections and stored styles are never replaced. */
export function previewAppearance(
  page: PageDoc,
  pose: { lookId?: string; savedLookId?: string },
): PageDoc {
  const saved = pose.savedLookId
    ? page.savedLooks.find((l) => l.id === pose.savedLookId)
    : undefined;
  if (saved)
    return {
      ...page,
      themeId: saved.themeId,
      appearance: { ...structuredClone(saved.overrides), motion: "none" },
    };
  if (pose.lookId && getTheme(pose.lookId))
    return { ...page, themeId: pose.lookId, appearance: { motion: "none" } };
  return page;
}

/** Preview a saved section style on this section's current records. Applying it remains explicit. */
export function previewWidgetStyle(
  page: PageDoc,
  widgetId?: string,
  savedStyleId?: string,
): PageDoc {
  const saved = page.savedStyles.find((s) => s.id === savedStyleId);
  if (!saved || !page.widgets.some((w) => w.id === widgetId)) return page;
  return {
    ...page,
    appearance: { ...page.appearance, motion: "none" },
    widgets: page.widgets.map((w) =>
      w.id === widgetId
        ? { ...w, appearance: structuredClone(saved.appearance) }
        : w,
    ),
  };
}

/** Preview curated section surfaces without changing the owner document. */
export function previewSectionTreatment(page: PageDoc, widgetId?: string, treatmentId?: string): PageDoc {
  const treatment = sectionTreatment(treatmentId);
  if (!treatment || !page.widgets.some(w => w.id === widgetId && supportsSectionTreatment(w.type))) return page;
  return { ...page, appearance: { ...page.appearance, motion: "none" }, widgets: page.widgets.map(w => w.id === widgetId ? { ...w, appearance: applySectionTreatment(w.appearance, treatment.id) } : w) };
}
