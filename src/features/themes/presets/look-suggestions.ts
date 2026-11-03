import { designsFor } from "@/features/page/themes/designs"
/** New pages start from a neutral composition. Saved designs remain available by their existing IDs. */
export const DEFAULT_LOOKS = ["quartz", "paper", "monochrome", "glasshouse"]
/** The designs that belong to a kind of business, best first. Retired looks are no longer suggested anywhere. */
export function suggestedLookIds(industryKey: string): string[] {
  return designsFor(industryKey, 8).map((d) => d.id)
}
