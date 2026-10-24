/** New pages start from a neutral composition. Saved designs remain available by their existing IDs. */
const GROUPS: { ids: string[]; looks: string[] }[] = [
  { ids: ["barber", "plumber", "electrician", "builder", "handyman", "mechanic", "cleaner", "locksmith"], looks: ["service", "open", "personal", "ink"] },
  { ids: ["detailer", "car-dealer", "photographer", "architect", "hospitality"], looks: ["open", "service", "personal", "ink"] },
  { ids: ["tutor", "music-teacher", "coach", "personal-trainer", "consultant"], looks: ["personal", "service", "open", "ink"] },
]
export const DEFAULT_LOOKS = ["service", "open", "personal", "ink"]
export function suggestedLookIds(industryKey: string): string[] {
  return GROUPS.find((x) => x.ids.includes(industryKey))?.looks ?? DEFAULT_LOOKS
}
