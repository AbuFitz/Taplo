import { businessContentSchema, type BusinessContent } from "@/features/businesses/content"
import type { PageDoc } from "@/features/page/contracts/page"
import type { StyleOverrides } from "@/features/page/contracts/style"
import { SCENARIOS, type Scenario } from "./content"
import { LOOKS } from "./looks"

/** The neutral base every configuration is applied to. Owners never pick it; it only seeds defaults. */
export const BASE_THEME = "studio"

export interface LabConfig {
  scenario: Scenario
  overrides: StyleOverrides
}

export const lookById = (id: string) => LOOKS.find((l) => l.id === id) ?? LOOKS[0]!

export function initialConfig(scenario: Scenario = "barber", lookId = scenario === "dealer" ? "showroom" : "noir"): LabConfig {
  return { scenario, overrides: structuredClone(lookById(lookId).overrides) }
}

/** One stable set of widgets per scenario, so changing appearance never touches content or order. */
const widgetCache = new Map<Scenario, PageDoc["widgets"]>()
function widgetsFor(s: Scenario) {
  if (!widgetCache.has(s)) widgetCache.set(s, SCENARIOS[s].widgets())
  return widgetCache.get(s)!
}

export function toPage(cfg: LabConfig): PageDoc {
  return { schemaVersion: 2, themeId: BASE_THEME, appearance: cfg.overrides, meta: { searchVisible: false }, widgets: widgetsFor(cfg.scenario) }
}

export function toContent(cfg: LabConfig): BusinessContent {
  return businessContentSchema.parse(SCENARIOS[cfg.scenario].content)
}

export type LabMessage = { type: "taplo:lab"; scenario: Scenario; overrides: StyleOverrides }
