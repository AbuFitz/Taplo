import { businessContentSchema, type BusinessContent } from "@/features/businesses/content"
import type { PageDoc } from "@/features/page/contracts/page"
import { applySectionTreatment, type SectionTreatmentId } from "@/features/page/section-treatments"
import type { StyleOverrides } from "@/features/page/contracts/style"
import { DEFAULT_THEME_ID, getTheme } from "@/features/page/themes/catalogue"
import { SCENARIOS, type Scenario } from "./content"

/** What the showcase edits: exactly the owner editor's appearance model (starting look + the owner's changes). */
export interface LabConfig {
  scenario: Scenario
  themeId: string
  overrides: StyleOverrides
}

/** The look each example was designed with. */
export const EXAMPLE_LOOK: Record<Scenario, string> = { corner: "open", oakfield: "service", rowan: "personal", brookfield: "open", station: "service", detailer: "ink", barber: "folio", dealer: "showroom", trades: "service", physio: "open", cafe: "clay", tutor: "orchard", gym: "ink" }

/**
 * How each example is arranged on top of its look: the header, how wide the page is and what it does on a computer. These
 * are the owner's own controls (Header and Design tabs), so anything shown in the gallery can be reproduced in the editor.
 */
export const EXAMPLE_OVERRIDES: Record<Scenario, StyleOverrides> = {
  corner: { header: { layout: "cover", avatarShape: "logo", align: "left" }, layout: { desktop: "centered", width: "wide", rhythm: "editorial" } },
  oakfield: { header: { layout: "side", avatarShape: "logo", align: "left" }, layout: { desktop: "centered", width: "wide", rhythm: "editorial" } },
  rowan: { header: { layout: "centered", avatarShape: "circle", avatarSize: "lg", align: "left" }, text: { align: "left" }, layout: { desktop: "split", width: "wide", rhythm: "editorial" } },
  brookfield: { header: { layout: "feature", avatarShape: "logo", align: "left" }, layout: { width: "wide", desktop: "columns", rhythm: "editorial" } },
  station: { header: { layout: "banner", avatarShape: "logo", align: "left" }, layout: { desktop: "split", width: "wide", rhythm: "even" } },
  detailer: { header: { layout: "poster", avatarShape: "logo", align: "left" }, layout: { desktop: "centered", width: "wide", rhythm: "editorial" } },
  barber: {},
  physio: { header: { layout: "editorial", avatarShape: "logo", align: "left" }, text: { headingFont: "manrope", align: "left", size: "lg" }, layout: { desktop: "split", width: "wide", rhythm: "editorial" } },
  cafe: { header: { layout: "cover", avatarShape: "circle", avatarSize: "md", align: "center" }, layout: { desktop: "columns", width: "wide" } },
  tutor: { header: { layout: "cover", avatarShape: "circle", avatarSize: "md", align: "left" }, layout: { desktop: "split" } },
  gym: { header: { layout: "feature", avatarShape: "logo", align: "left", scrim: "strong" }, text: { headingFont: "spaceGrotesk", headingCase: "normal", size: "lg" }, layout: { desktop: "columns", width: "wide", rhythm: "editorial" } },
  trades: { header: { layout: "cover", avatarShape: "circle", avatarSize: "lg", align: "center" }, layout: { desktop: "centered", width: "regular" } },
  dealer: { layout: { desktop: "columns", width: "wide" } },
}

/** A scenario on its own look opens as the designed example; an explicit look (the looks sheet, the lab) shows that look plain. */
export function initialConfig(scenario: Scenario = "barber", lookId?: string): LabConfig {
  const id = lookId ?? EXAMPLE_LOOK[scenario]
  return { scenario, themeId: getTheme(id) ? id : DEFAULT_THEME_ID, overrides: lookId === undefined ? structuredClone(EXAMPLE_OVERRIDES[scenario]) : {} }
}

/** One stable set of widgets per scenario, so changing appearance never touches content or order. */
const widgetCache = new Map<Scenario, PageDoc["widgets"]>()
/** Authored hierarchy, using exactly the same section treatments offered in the editor. */
const SECTION_COMPOSITIONS: Partial<Record<Scenario, Record<string, SectionTreatmentId>>> = {
  station: { priceMenu: "spotlight", hours: "soft", faq: "inline" },
  detailer: { serviceList: "raised", serviceArea: "soft", faq: "inline", hours: "soft" },
  brookfield: { faq: "inline", hours: "soft" },
  corner: { priceMenu: "raised", hours: "soft", faq: "inline" },
  oakfield: { serviceList: "raised", serviceArea: "soft", faq: "inline" },
  physio: { serviceList: "raised", team: "soft", faq: "inline", hours: "raised" },
  gym: { featuredService: "spotlight", serviceList: "raised", team: "soft", faq: "inline" },
  rowan: { featuredService: "raised", serviceList: "soft", faq: "inline" },
}
/** Spatial choices are authored per business, independent of the shared surface recipes. */
const SECTION_LAYOUTS: Partial<Record<Scenario,Record<string,Record<string,unknown>>>> = {
  barber:{gallery:{variant:"masonry"}},
  detailer:{serviceList:{variant:"spotlight"},enquiry:{variant:"card"},faq:{variant:"cards"},hours:{variant:"compact"}},
  physio:{serviceList:{variant:"cards"},hours:{variant:"status"},location:{variant:"compact"}},
  cafe:{priceMenu:{variant:"panels"},hours:{variant:"compact"},location:{variant:"visit"}},
  corner:{priceMenu:{variant:"panels"},hours:{variant:"compact"}},
  tutor:{serviceList:{variant:"cards"},text:{variant:"note",collapsible:true}},
  rowan:{serviceList:{variant:"cards"},faq:{variant:"cards"}},
  trades:{enquiry:{variant:"card"},faq:{variant:"cards"},hours:{variant:"status"}},
  gym:{serviceList:{variant:"spotlight"},offers:{variant:"cards"}},
}
export function widgetsFor(s: Scenario) {
  if (!widgetCache.has(s)) widgetCache.set(s, SCENARIOS[s].widgets().map(w => {
    const treatment = SECTION_COMPOSITIONS[s]?.[w.type]
    const settings = SECTION_LAYOUTS[s]?.[w.type]
    return { ...w, ...(settings ? {settings:{...w.settings,...settings}} : {}), ...(treatment ? {appearance:applySectionTreatment(w.appearance,treatment)} : {}) }
  }))
  return widgetCache.get(s)!
}

export function toPage(cfg: LabConfig): PageDoc {
  return { schemaVersion: 2, themeId: cfg.themeId, appearance: cfg.overrides, meta: { searchVisible: false, primaryAction: "auto" }, widgets: widgetsFor(cfg.scenario), savedLooks: [], savedStyles: [] }
}

export function toContent(cfg: LabConfig): BusinessContent {
  return businessContentSchema.parse(SCENARIOS[cfg.scenario].content)
}

export type LabMessage = { type: "taplo:lab"; scenario: Scenario; themeId: string; overrides: StyleOverrides }
