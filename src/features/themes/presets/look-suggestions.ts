/**
 * Looks worth showing first for a kind of business. Suggestions only: every look stays available, and the order never
 * hides one. The first is where a new page starts if the owner changes nothing. Pure data (no UI), so the page model can use it.
 */
const GROUPS: { ids: string[]; looks: string[] }[] = [
  { ids: ["barber"], looks: ["highstreet", "night", "folio", "photo"] },
  { ids: ["detailer"], looks: ["workbay", "showroom", "photo", "clean"] },
  { ids: ["hairdresser", "nails", "lashes-brows", "beauty-therapist", "massage", "makeup", "tattoo", "photographer"], looks: ["folio", "night", "photo", "clay"] },
  { ids: ["plumber", "electrician", "builder", "landscaper", "cleaner", "locksmith", "removals", "handyman", "pest-control", "mechanic"], looks: ["colour", "clean", "showroom", "forge"] },
  { ids: ["tutor", "music-teacher", "language-teacher", "coach", "driving-instructor"], looks: ["orchard", "clean", "journal", "colour"] },
  { ids: ["personal-trainer", "sports-coach"], looks: ["forge", "orchard", "night", "clean"] },
  { ids: ["consultant", "accountant", "solicitor", "architect", "financial-adviser", "estate-agent", "web-designer"], looks: ["journal", "clean", "showroom", "night"] },
  { ids: ["dentist", "physio", "vet"], looks: ["journal", "clean", "orchard", "clay"] },
  { ids: ["hospitality", "event-services"], looks: ["clay", "clean", "night", "colour"] },
  { ids: ["car-dealer"], looks: ["forecourt", "showroom", "clean", "night"] },
]
export const DEFAULT_LOOKS = ["clean", "journal", "night", "colour"]

export function suggestedLookIds(industryKey: string): string[] {
  return GROUPS.find((x) => x.ids.includes(industryKey))?.looks ?? DEFAULT_LOOKS
}
