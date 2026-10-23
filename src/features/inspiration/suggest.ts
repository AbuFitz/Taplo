import { EXAMPLES } from "./examples"
import { LOOKS, type Look } from "@/features/page/themes/looks"
import { SCENARIOS } from "@/features/showcase/content"
import { EXAMPLE_LOOK } from "@/features/showcase/lab-state"

import { suggestedLookIds } from "@/features/themes/presets/look-suggestions"

/** Looks in the order worth showing for a kind of business; every look stays available. */
export function suggestedLooks(industryKey: string): Look[] {
  const g = suggestedLookIds(industryKey)
  const first = g.map((id) => LOOKS.find((l) => l.id === id)!).filter(Boolean)
  return [...first, ...LOOKS.filter((l) => !g.includes(l.id))]
}

/** What "Start from this" needs from an example: the business kind, the look and the content types, never the sample content itself. */
export function exampleStart(slug: string) {
  const e = EXAMPLES.find((x) => x.slug === slug)
  if (!e) return null
  const sc = SCENARIOS[e.scenario]
  return {
    name: sc.content.identity.name,
    industryKey: sc.content.identity.industryKey,
    industryLabel: sc.content.identity.industryLabel ?? "",
    lookId: EXAMPLE_LOOK[e.scenario],
    bookingMode: sc.content.booking?.mode ?? "contact",
    widgets: sc.widgets().map((w) => ({ type: w.type, settings: w.settings as Record<string, unknown> })),
  }
}
