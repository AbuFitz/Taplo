import type { IndustryId } from "@/features/marketing/ia"
import { FONT_LABELS } from "@/features/page/themes/fonts"
import { LOOKS } from "@/features/page/themes/looks"
import { EXAMPLE_LOOK } from "@/features/showcase/lab-state"
import { SCENARIOS, type Scenario } from "@/features/showcase/content"
import type { WidgetType } from "@/features/page/contracts/widgets"

/**
 * The inspiration gallery. Every example is a fictional business rendered by the real page engine with real
 * widgets; nothing here is a screenshot of something else. An example is a starting point, not a template:
 * "Start from this" fills in a look and a set of content types that can all be changed afterwards.
 */
export interface Example {
  slug: string
  scenario: Scenario
  industry: IndustryId
  /** One line: what is distinctive about this page. */
  hook: string
  /** The page's thinking, in the owner's terms. */
  notes: string[]
  /** Which proof points to show on the example page. */
  highlights: string[]
}

export const EXAMPLES: Example[] = [
  {
    slug: "marlowe-and-finch", scenario: "barber", industry: "beauty",
    hook: "Dark, photographic and made for booking a chair.",
    notes: ["The booking button leads, and customers choose a barber before a time.", "Products sit in a swipe row so the price menu stays short.", "Photography carries the mood, so the type stays quiet."],
    highlights: ["Price menu with durations", "Choose a barber, then a time", "Counter products with an affiliate link"],
  },
  {
    slug: "hollin-physio", scenario: "physio", industry: "health",
    hook: "Quiet, typographic and unhurried. A printed programme, not an app.",
    notes: ["Every appointment is a request, because a clinician decides whether it is the right slot.", "Long appointments, written plainly, with prices up front.", "No photography at all. Type, space and one deep red do the work."],
    highlights: ["Requests that the clinic accepts or declines", "A team grid with services per person", "Questions answered before the call"],
  },
  {
    slug: "pims-kitchen", scenario: "cafe", industry: "food",
    hook: "Warm, rounded and very easy to read on a phone at the counter.",
    notes: ["The menu is a price list, not a booking flow. Only groups of six or more send a request.", "A gallery row makes the food the picture.", "Opening times are compact because that is the question people ask."],
    highlights: ["Menu with prices", "Group table requests", "Opening hours that say open now"],
  },
  {
    slug: "ada-okafor-maths", scenario: "tutor", industry: "learning",
    hook: "Friendly and clear, built around a free trial lesson.",
    notes: ["One person, so no team and no choosing who.", "The free trial is the main action; WhatsApp is the second.", "Credentials appear as plain chips the business supplies itself."],
    highlights: ["A free trial that books instantly", "Online and in-person lessons", "A message form that reserves nothing"],
  },
  {
    slug: "forge-strength", scenario: "gym", industry: "fitness",
    hook: "Loud, condensed and high contrast. Energy first, detail second.",
    notes: ["Headings are capitals in a condensed face with hard shadows.", "Coaches sit in a swipe row because there are four of them.", "The free intro is the one action that matters."],
    highlights: ["Classes, coaching and memberships", "Four coaches, each with their own services", "Member quotes in a swipe row"],
  },
  {
    slug: "northgate-heating", scenario: "trades", industry: "trades",
    hook: "A bold call button, fixed prices and the areas covered.",
    notes: ["Calling is the main action, so it is the biggest thing on the page.", "No address is shown, because the work happens at the customer's.", "Common questions are answered on the page, not behind a contact form."],
    highlights: ["Call first, request a visit second", "Fixed prices by job type", "Service area instead of an address"],
  },
  {
    slug: "aldous-motor-co", scenario: "dealer", industry: "motoring",
    hook: "Crisp and structured, built for specifications and honest status.",
    notes: ["Every car has year, mileage, fuel and gearbox before the price.", "Reserved and sold cars stay visible so the stock list is honest.", "A viewing books straight in; a part-exchange valuation is a request."],
    highlights: ["Vehicle cards with specifications", "Viewings that book instantly", "Reserved and sold shown honestly"],
  },
]

export const bySlug = (slug: string) => EXAMPLES.find((e) => e.slug === slug)

const WIDGET_NAME: Partial<Record<WidgetType, string>> = {
  booking: "Booking", priceMenu: "Price menu", serviceList: "Services", products: "Products", team: "Team", gallery: "Photos", reviews: "Reviews", hours: "Opening hours",
  location: "Location", serviceArea: "Service area", faq: "Questions", enquiry: "Contact form", share: "Share", social: "Social links", call: "Call button", whatsapp: "WhatsApp button", credentials: "Credentials",
}

/** Facts about an example read from the engine's own data, so the page cannot describe something the example does not do. */
export function describe(e: Example) {
  const sc = SCENARIOS[e.scenario]
  const look = LOOKS.find((l) => l.id === EXAMPLE_LOOK[e.scenario])!
  const o = look.overrides
  const stock = (sc.content.products ?? []).length > 0 && (sc.content.products ?? []).every((p) => p.kind === "vehicle")
  const content = [...new Set(sc.widgets().map((w) => (stock && w.type === "products" ? "Vehicle stock" : WIDGET_NAME[w.type as WidgetType])).filter((x): x is string => Boolean(x)))]
  const businessName = sc.content.identity.name
  return {
    name: businessName,
    tagline: sc.content.identity.tagline ?? "",
    industryLabel: sc.content.identity.industryLabel ?? "",
    lookId: look.id,
    lookName: look.name,
    lookBlurb: look.blurb,
    heading: FONT_LABELS[o.text!.headingFont!],
    body: FONT_LABELS[o.text!.bodyFont!],
    header: o.header!.layout!,
    density: o.layout!.density!,
    desktop: o.layout!.desktop!,
    content,
    bookingMode: sc.content.booking?.mode ?? "contact",
    colors: o.colors!,
  }
}
export type ExampleFacts = ReturnType<typeof describe>
