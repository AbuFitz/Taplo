import { EXAMPLES } from "./examples"
import { LOOKS, type Look } from "@/features/page/themes/looks"
import { SCENARIOS } from "@/features/showcase/content"
import { EXAMPLE_LOOK } from "@/features/showcase/lab-state"

/**
 * Looks worth showing first for a kind of business. These are suggestions only: every look stays available,
 * and the order never hides one. The first is simply where the page starts if the owner changes nothing.
 */
const GROUPS: { ids: string[]; looks: string[] }[] = [
  { ids: ["barber", "hairdresser", "nails", "lashes-brows", "beauty-therapist", "massage", "makeup", "tattoo", "photographer"], looks: ["night", "photo", "clay", "clean"] },
  { ids: ["plumber", "electrician", "builder", "landscaper", "cleaner", "locksmith", "removals", "handyman", "pest-control", "mechanic", "detailer"], looks: ["colour", "clean", "showroom", "forge"] },
  { ids: ["tutor", "music-teacher", "language-teacher", "coach", "driving-instructor"], looks: ["orchard", "clean", "journal", "colour"] },
  { ids: ["personal-trainer", "sports-coach"], looks: ["forge", "orchard", "night", "clean"] },
  { ids: ["consultant", "accountant", "solicitor", "architect", "financial-adviser", "estate-agent", "web-designer"], looks: ["journal", "clean", "showroom", "night"] },
  { ids: ["dentist", "physio", "vet"], looks: ["journal", "clean", "orchard", "clay"] },
  { ids: ["hospitality", "event-services"], looks: ["clay", "clean", "night", "colour"] },
]

export function suggestedLooks(industryKey: string): Look[] {
  const g = GROUPS.find((x) => x.ids.includes(industryKey))?.looks ?? ["clean", "clay", "night", "journal"]
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
