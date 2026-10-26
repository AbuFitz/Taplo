import { REAL_BUSINESS_STYLES } from "./real-businesses"
import { COLLECTION_BRIEFS, type CollectionScenario } from "./collection"
import { businessContentSchema, type BusinessContent } from "@/features/businesses/content"
import type { PageDoc } from "@/features/page/contracts/page"
import { applySectionTreatment, type SectionTreatmentId } from "@/features/page/section-treatments"
import type { StyleOverrides } from "@/features/page/contracts/style"
import { DEFAULT_THEME_ID, getTheme } from "@/features/page/themes/catalogue"
import { SHOWCASE } from "@/features/inspiration/showcase-set"
import { SCENARIOS, type Scenario } from "./content"
import { applyRecipe, getDesign } from "@/features/page/themes/designs"

/** What the showcase edits: exactly the owner editor's appearance model (starting look + the owner's changes). */
export interface LabConfig {
  scenario: Scenario
  themeId: string
  overrides: StyleOverrides
}

/** The look each example was designed with. */
export const EXAMPLE_LOOK: Record<Scenario, string> = {fixnow:"ink",brightlearn:"open", ...Object.fromEntries(COLLECTION_BRIEFS.map(b=>[b.id,b.look])) as Record<CollectionScenario,string>, corner: "clay", oakfield: "orchard", rowan: "personal", brookfield: "showroom", station: "service", detailer: "ink", barber: "folio", dealer: "showroom", trades: "service", physio: "open", cafe: "clay", tutor: "orchard", gym: "forge" }

/**
 * How each example is arranged on top of its look: the header, how wide the page is and what it does on a computer. These
 * are the owner's own controls (Header and Design tabs), so anything shown in the gallery can be reproduced in the editor.
 */
export const EXAMPLE_OVERRIDES: Record<Scenario, StyleOverrides> = {
  ...REAL_BUSINESS_STYLES,
  ...Object.fromEntries(COLLECTION_BRIEFS.map(b=>[b.id,{header:{actions:"none"}}])) as Record<CollectionScenario,StyleOverrides>,
  corner: { header: { avatarShape: "logo", align: "left" } },
  oakfield: {}, rowan: { header: { avatarShape: "circle" } },
  brookfield: {}, station: {}, detailer: {},
  barber: {},
  physio: { header: { layout: "centered", avatarShape: "logo", align: "left" }, text: { headingFont: "manrope", align: "left", size: "lg" }, layout: { desktop: "split", width: "wide", rhythm: "editorial" } },
  cafe: { header: { layout: "banner", avatarShape: "circle", avatarSize: "md", align: "center" }, layout: { desktop: "columns", width: "wide" } },
  tutor: { header: { layout: "side", avatarShape: "circle", avatarSize: "md", align: "left" }, layout: { desktop: "split" } },
  gym: { header: { layout: "banner", avatarShape: "logo", align: "left", scrim: "strong" },  layout: { desktop: "columns", width: "wide", rhythm: "editorial" } },
  trades: { header: { layout: "banner", avatarShape: "circle", avatarSize: "lg", align: "center" }, layout: { desktop: "centered", width: "regular" } },
  dealer: { layout: { desktop: "columns", width: "wide" } },
}

/** Every business in the gallery is shown on the design chosen for it, so its demo page matches what the gallery shows. */
for (const g of SHOWCASE) for (const item of g.items) {
  const design = getDesign(item.design)
  if (!design || item.scenario === "fixnow" || item.scenario === "brightlearn") continue
  EXAMPLE_LOOK[item.scenario] = design.id
  EXAMPLE_OVERRIDES[item.scenario] = { header: { ...(item.arrangement ? { layout: item.arrangement, align: item.arrangement === "cutout" || item.arrangement === "bento" ? "center" : "left" } : {}), ...(item.logo === false ? { avatarShape: "none" } : {}) } } as StyleOverrides
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
  station: { priceMenu: "spotlight", hours: "raised", faq: "raised" },
  detailer: { serviceList: "raised", serviceArea: "raised", faq: "raised", hours: "raised" },
  brookfield: { faq: "raised", hours: "raised" },
  corner: { priceMenu: "raised", hours: "raised", faq: "raised" },
  oakfield: { serviceList: "raised", serviceArea: "raised", faq: "raised" },
  physio: { serviceList: "raised", team: "raised", faq: "raised", hours: "raised" },
  gym: { featuredService: "spotlight", serviceList: "raised", team: "raised", faq: "raised" },
  rowan: { featuredService: "raised", serviceList: "raised", faq: "raised" },
}
/** Spatial choices are authored per business, independent of the shared surface recipes. */
const SECTION_LAYOUTS: Partial<Record<Scenario,Record<string,Record<string,unknown>>>> = {
  barber:{gallery:{variant:"masonry"}},
  detailer:{serviceList:{variant:"spotlight"},enquiry:{variant:"card"},faq:{variant:"cards"},hours:{variant:"compact"}},
  physio:{serviceList:{variant:"tiles"},hours:{variant:"status"},location:{variant:"compact"}},
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
  // A design brings its own way of presenting each section; the content and the set of sections stay the scenario's.
  const design = getDesign(cfg.themeId)
  const widgets = design ? applyRecipe(widgetsFor(cfg.scenario), design.recipe) : widgetsFor(cfg.scenario)
  return { schemaVersion: 2, themeId: cfg.themeId, appearance: cfg.overrides, meta: { searchVisible: false, primaryAction: "auto" }, widgets, savedLooks: [], savedStyles: [] }
}

export function toContent(cfg: LabConfig): BusinessContent {
  return businessContentSchema.parse(SCENARIOS[cfg.scenario].content)
}

export type LabMessage = { type: "taplo:lab"; scenario: Scenario; themeId: string; overrides: StyleOverrides }
