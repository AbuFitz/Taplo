import { businessContentSchema, type BusinessContent } from "@/features/businesses/content"
import type { PageDoc } from "@/features/page/contracts/page"
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
export const EXAMPLE_LOOK: Record<Scenario, string> = { station: "highstreet", detailer: "workbay", barber: "folio", dealer: "showroom", trades: "colour", physio: "journal", cafe: "clay", tutor: "orchard", gym: "forge" }

/**
 * How each example is arranged on top of its look: the header, how wide the page is and what it does on a computer. These
 * are the owner's own controls (Header and Design tabs), so anything shown in the gallery can be reproduced in the editor.
 */
export const EXAMPLE_OVERRIDES: Record<Scenario, StyleOverrides> = {
  station: {},
  detailer: {},
  barber: {},
  physio: { header: { align: "left" }, layout: { desktop: "split" } },
  cafe: { header: { layout: "cover", avatarShape: "circle", avatarSize: "md", align: "center" }, layout: { desktop: "columns", width: "wide" } },
  tutor: { header: { layout: "cover", avatarShape: "circle", avatarSize: "md", align: "left" }, layout: { desktop: "split" } },
  gym: { header: { layout: "poster", avatarShape: "square", avatarSize: "sm", align: "left", scrim: "strong" }, layout: { desktop: "columns", width: "wide" } },
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
function widgetsFor(s: Scenario) {
  if (!widgetCache.has(s)) widgetCache.set(s, SCENARIOS[s].widgets())
  return widgetCache.get(s)!
}

export function toPage(cfg: LabConfig): PageDoc {
  return { schemaVersion: 2, themeId: cfg.themeId, appearance: cfg.overrides, meta: { searchVisible: false, primaryAction: "auto" }, widgets: widgetsFor(cfg.scenario), savedLooks: [], savedStyles: [] }
}

export function toContent(cfg: LabConfig): BusinessContent {
  return businessContentSchema.parse(SCENARIOS[cfg.scenario].content)
}

export type LabMessage = { type: "taplo:lab"; scenario: Scenario; themeId: string; overrides: StyleOverrides }
