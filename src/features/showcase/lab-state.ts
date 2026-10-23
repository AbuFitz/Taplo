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
export const EXAMPLE_LOOK: Record<Scenario, string> = { barber: "night", dealer: "showroom", trades: "colour", physio: "journal", cafe: "clay", tutor: "orchard", gym: "forge" }

export function initialConfig(scenario: Scenario = "barber", lookId: string = EXAMPLE_LOOK[scenario]): LabConfig {
  return { scenario, themeId: getTheme(lookId) ? lookId : DEFAULT_THEME_ID, overrides: {} }
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
