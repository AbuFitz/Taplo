import { getWidget } from "@/features/page/widgets/registry"
import { bySlug } from "./examples"
import { CURRENT_LOOKS, type Look } from "@/features/page/themes/looks"
import { SCENARIOS } from "@/features/showcase/content"
import { EXAMPLE_LOOK, EXAMPLE_OVERRIDES } from "@/features/showcase/lab-state"

import { suggestedLookIds } from "@/features/themes/presets/look-suggestions"

/** Looks in the order worth showing for a kind of business; every look stays available. */
export function suggestedLooks(industryKey: string): Look[] {
  const g = suggestedLookIds(industryKey)
  const first = g.map((id) => CURRENT_LOOKS.find((l) => l.id === id)!).filter(Boolean)
  return [...first, ...CURRENT_LOOKS.filter((l) => !g.includes(l.id))]
}

/** What "Start from this" needs from an example: the business kind, the look and the content types, never the sample content itself. */
export function exampleStart(slug: string) {
  const e = bySlug(slug)
  if (!e) return null
  const sc = SCENARIOS[e.scenario]
  return {
    name: sc.content.identity.name,
    industryKey: sc.content.identity.industryKey,
    industryLabel: sc.content.identity.industryLabel ?? "",
    lookId: EXAMPLE_LOOK[e.scenario],
    overrides: EXAMPLE_OVERRIDES[e.scenario],
    bookingMode: sc.content.booking?.mode ?? "contact",
    widgets: sc.widgets().map((w) => {
      // References belong to the fictional business. A new owner's sections follow their own records.
      const settings = { ...w.settings } as Record<string, unknown>
      for (const field of getWidget(w.type)?.fields ?? []) if (field.kind === "refs" || field.kind === "record") delete settings[field.key]
      // A sample may name itself in its share button; a new owner starts with the neutral label.
      if (w.type === "share") delete settings.label
      return { type: w.type, settings }
    }),
  }
}
