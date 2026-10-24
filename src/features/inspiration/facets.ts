import type { ExampleFacts } from "./examples"

/**
 * What a design looks like and what its page does, read from the design's own configuration so a filter can never
 * describe something the page does not have. These describe the design. The business it is shown with is separate:
 * any design works for any business.
 */
export const STYLE_TAGS = ["Dark", "Light", "Bold colour", "Photo-led", "Type-led"] as const
export const CAPABILITY_TAGS = ["Booking", "Team", "Products", "Vehicles", "Photos", "Reviews", "Messages"] as const
export type StyleTag = (typeof STYLE_TAGS)[number]
export type CapabilityTag = (typeof CAPABILITY_TAGS)[number]

const rgb = (hex: string) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const }
const luminance = (hex: string) => { const [r, g, b] = rgb(hex).map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r! + 0.7152 * g! + 0.0722 * b! }
const saturation = (hex: string) => { const [r, g, b] = rgb(hex).map((v) => v / 255); const mx = Math.max(r!, g!, b!), mn = Math.min(r!, g!, b!); const l = (mx + mn) / 2; return mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1)) }

export function styleTags(f: Pick<ExampleFacts, "colors" | "header">): StyleTag[] {
  const bg = f.colors.background ?? "#ffffff"
  const tags: StyleTag[] = [luminance(bg) < 0.25 ? "Dark" : "Light"]
  if (saturation(bg) > 0.35) tags.push("Bold colour")
  tags.push(f.header === "cover" || f.header === "poster" || f.header === "feature" || f.header === "floating" || f.header === "portrait" || f.header === "banner" ? "Photo-led" : "Type-led")
  return tags
}

const CAP_FROM_CONTENT: Record<string, CapabilityTag> = { Booking: "Booking", Team: "Team", Products: "Products", "Vehicle stock": "Vehicles", Photos: "Photos", Reviews: "Reviews", "Contact form": "Messages" }
export function capabilityTags(content: string[]): CapabilityTag[] {
  return [...new Set(content.map((c) => CAP_FROM_CONTENT[c]).filter((x): x is CapabilityTag => Boolean(x)))]
}
