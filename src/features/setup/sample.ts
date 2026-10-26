import type { Scenario } from "@/features/showcase/content"
import { SCENARIOS } from "@/features/showcase/content"
import type { BusinessContentInput } from "@/features/businesses/content"

/** Which worked example best shows a kind of business, so a design can be judged on realistic content before the owner has any. */
const BY_INDUSTRY: Record<string, Scenario> = {
  barber: "barber", hairdresser: "barber", "beauty-therapist": "barber", makeup: "barber", tattoo: "barber", massage: "physio", nails: "lune",
  physio: "physio", dentist: "physio", vet: "physio", hospitality: "corner",
  tutor: "tutor", "music-teacher": "tutor", "language-teacher": "tutor", "driving-instructor": "tutor", coach: "north", "personal-trainer": "gym", "sports-coach": "north",
  plumber: "trades", electrician: "trades", builder: "trades", landscaper: "trades", cleaner: "trades", locksmith: "trades", removals: "trades", handyman: "oakfield", "pest-control": "trades",
  "car-dealer": "dealer", detailer: "detailer", mechanic: "detailer",
  consultant: "good", accountant: "good", solicitor: "good", "financial-adviser": "good", "estate-agent": "good", architect: "ellis", "web-designer": "slate",
  photographer: "sora", designer: "ellis", filmmaker: "pace", illustrator: "field", interiors: "nami", florist: "petal", maker: "form", founder: "maya", "event-services": "alba",
}
export const sampleScenario = (industryKey: string): Scenario => (BY_INDUSTRY[industryKey] ?? "good") as Scenario

/** The owner's own name, logo and description on the sample's content, so a design reads as theirs while showing a full page. */
export function sampleContent(industryKey: string, own: BusinessContentInput): BusinessContentInput {
  const base = structuredClone(SCENARIOS[sampleScenario(industryKey)].content)
  const name = own.identity.name.trim()
  return {
    ...base,
    identity: { ...base.identity, ...(name ? { name } : {}), logo: own.identity.logo, ...(own.identity.tagline ? { tagline: own.identity.tagline } : {}), ...(own.identity.heroImage ? { heroImage: own.identity.heroImage } : {}) },
  }
}
export { SCENARIOS }
