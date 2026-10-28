import type { BusinessContentInput } from "@/features/businesses/content"
import { getIndustryPreset } from "@/features/themes/presets/industries"

/**
 * Example content: shown only in the owner's live draft, so a page with nothing on it still shows what it can become. It is
 * built here at render time and never written to the saved business, never published, and every item says it is an example.
 * Nothing in it is a price, a time or a contact detail, so it cannot read as a claim the business made.
 */
export const EXAMPLE_LABEL = "Example"

export function exampleServices(industryKey: string): NonNullable<BusinessContentInput["services"]> {
  const preset = getIndustryPreset(industryKey)
  return preset.suggestedServices.slice(0, 2).map((s, i) => ({
    id: `example-${i}`,
    name: `${s.name} · ${EXAMPLE_LABEL}`,
    description: s.description ? `${s.description} This is an example: replace it with your own.` : "This is an example: replace it with your own.",
    priceMode: "quote" as const,
    currency: "GBP",
    delivery: [],
    bookingMode: "contact" as const,
    sortOrder: i,
    archived: false,
    example: true,
  }))
}

/** The draft as the owner sees it while building: real records first, examples only where a section would otherwise be empty. */
export function withExamples(content: BusinessContentInput): BusinessContentInput {
  const real = (content.services ?? []).filter((s) => !s.archived && !s.example)
  if (real.length) return content
  return { ...content, services: exampleServices(content.identity.industryKey) }
}
