import type { WidgetAppearance } from "./contracts/style"

/** Complete surface recipes over the same section engine; record selection and button styling stay independent. */
export const SECTION_TREATMENTS = [
  { id: "inline", label: "Open", description: "Content sits directly on the page.", appearance: { surface: "transparent", radius: "lg", border: "none", shadow: "none", padding: "none", emphasis: "normal" } },
  { id: "soft", label: "Soft", description: "A quiet tonal surface groups the content.", appearance: { surface: "soft", radius: "lg", border: "none", shadow: "none", padding: "comfortable", emphasis: "normal" } },
  { id: "raised", label: "Raised", description: "A rounded surface with restrained depth.", appearance: { surface: "solid", radius: "xl", border: "none", shadow: "soft", padding: "roomy", emphasis: "normal" } },
  { id: "spotlight", label: "Spotlight", description: "A stronger surface for your most important section.", appearance: { surface: "accent", radius: "xl", border: "none", shadow: "soft", padding: "roomy", emphasis: "featured" } },
] as const satisfies readonly { id: string; label: string; description: string; appearance: WidgetAppearance }[]
export type SectionTreatmentId = (typeof SECTION_TREATMENTS)[number]["id"]
const KEYS = ["surface", "radius", "border", "shadow", "padding", "emphasis", "background", "text"] as const
export const sectionTreatment = (id?: string) => SECTION_TREATMENTS.find(t => t.id === id)
export function applySectionTreatment(current: WidgetAppearance, id: SectionTreatmentId): WidgetAppearance {
  const next = { ...current }
  for (const key of KEYS) delete next[key]
  return { ...next, ...sectionTreatment(id)!.appearance }
}
export function selectedSectionTreatment(a: WidgetAppearance): SectionTreatmentId | undefined {
  return SECTION_TREATMENTS.find(t => KEYS.every(key => a[key] === (t.appearance as WidgetAppearance)[key]))?.id
}

/** Only panel sections use these recipes; collection items and action-only buttons have their own presentation contracts. */
export function supportsSectionTreatment(type: string): boolean {
  return ["serviceList", "priceMenu", "featuredService", "offers", "reviews", "credentials", "text", "faq", "hours", "location", "serviceArea", "announcement"].includes(type)
}
