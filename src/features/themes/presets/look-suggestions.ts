/** New pages start from a neutral composition. Saved designs remain available by their existing IDs. */
const GROUPS: { ids: string[]; looks: string[] }[] = [
  {ids:["designer"],looks:["index","cursor","atelier","journal","canvas"]},
  {ids:["founder"],looks:["founder","social","advisory","personal"]},
  {ids:["maker"],looks:["kiln","archive","clay","open"]},
  {ids:["florist"],looks:["petal","occasion","orchard","folio"]},
  {ids:["filmmaker"],looks:["frame","tempo","ink","smoke"]},
  {ids:["illustrator"],looks:["canvas","index","folio","personal"]},
  {ids:["interiors"],looks:["habitat","atelier","folio","open"]},
  {ids:["car-dealer"],looks:["showroom","open","journal","silver","ink","service"]},
  {ids:["detailer"],looks:["open","smoke","ink","folio","silver","service"]},
  {ids:["hospitality"],looks:["clay","open","silver","personal","service","journal"]},
  {ids:["tutor","music-teacher","language-teacher"],looks:["personal","orchard","open","silver","service","journal"]},
  {ids:["personal-trainer","sports-coach"],looks:["forge","ink","service","open","personal","smoke"]},
  { ids: ["barber", "plumber", "electrician", "builder", "handyman", "mechanic", "cleaner", "locksmith"], looks: ["service", "open", "personal", "ink"] },
  { ids: ["detailer", "car-dealer", "photographer", "architect", "hospitality"], looks: ["open", "service", "personal", "ink"] },
  { ids: ["tutor", "music-teacher", "coach", "personal-trainer", "consultant"], looks: ["personal", "service", "open", "ink"] },
]
export const DEFAULT_LOOKS = ["service", "open", "personal", "ink"]
export function suggestedLookIds(industryKey: string): string[] {
  return GROUPS.find((x) => x.ids.includes(industryKey))?.looks ?? DEFAULT_LOOKS
}
