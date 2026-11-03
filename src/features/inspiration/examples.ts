import { COLLECTION_BRIEFS } from "@/features/showcase/collection"
import { googleReviewUrl } from "@/features/page/widgets/google-reviews"
import type { IndustryId } from "@/features/marketing/ia"
import { FONT_LABELS } from "@/features/page/themes/font-metadata"
import { ALL_SHOWCASE } from "./showcase-set"
import { LOOKS } from "@/features/page/themes/looks"
import { EXAMPLE_LOOK, EXAMPLE_OVERRIDES } from "@/features/showcase/lab-state"
import { SCENARIOS, type Scenario } from "@/features/showcase/content"
import type { WidgetType } from "@/features/page/contracts/widgets"

/**
 * The inspiration gallery. Fictional examples and owner-authorised real businesses use the real page engine with real
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

const CATALOGUE: Example[] = [
  {slug:"fixnowmechanics",scenario:"fixnow",industry:"motoring",hook:"Mobile diagnostics and repairs, with compact prices and a direct quote link.",notes:["A lifted business profile keeps contact details easy to reach.","Compact services open full details and the existing quote destination.","Actual workshop and product content supplied by FixNow’s websites."],highlights:["Compact service prices","Existing quote and tracking links","Real dash cam products"]},
  {slug:"brightlearn",scenario:"brightlearn",industry:"learning",hook:"Online maths tuition with monthly programmes and a free introduction.",notes:["A clear tutor identity and a separate introductory service.","Group and one-to-one programmes show the monthly price and lesson details.","Existing programme and contact destinations remain available."],highlights:["Monthly programme prices","Small-group and one-to-one tuition","Existing programme links"]},
  ...COLLECTION_BRIEFS.map(b=>({slug:b.slug,scenario:b.id,industry:b.sector,hook:b.line,notes:[b.bio,"An original identity and a page composed with the editable Taplo engine.","All sample content is illustrative. Start from this design with your own details."],highlights:[b.label,"Original brand mark",b.sector==="portfolios"?"Selected work and project enquiries":"Clear offers and enquiries"]})),
  { slug: "no-6-coffee", scenario: "corner", industry: "food", hook: "A neighbourhood café. The menu, the opening times and a place at the table.", notes: ["An open menu keeps drinks and food easy to scan; opening times sit on a quiet separate surface.", "Coffee and food show prices without starting appointment bookings.", "A larger visit starts an enquiry, not a confirmed reservation."], highlights: ["A proper grouped menu", "Opening times at a glance", "Group enquiries without booking menu items"] },
  { slug: "dans-home-repairs", scenario: "oakfield", industry: "trades", hook: "Small repairs, shelves and fittings. Explain the job before agreeing the visit.", notes: ["The compact introduction puts the business and the next step before the service details.", "Service cards explain from prices, estimates and first conversations.", "Requests and enquiries let the scope be agreed before the visit."], highlights: ["From and quote prices", "Visit requests", "Service area instead of a private address"] },
  { slug: "maths-with-aisha", scenario: "rowan", industry: "learning", hook: "A familiar face and a clear first step. Maths sessions at a pace you can follow.", notes: ["A clear personal wordmark introduces the tutor without a synthetic portrait.", "A free first conversation sits before the paid sessions.", "Session requests leave room to agree the learner’s needs and delivery."], highlights: ["Free introduction", "Online and local sessions", "A personal tutor profile"] },
  {
    slug: "jays-barbers", scenario: "station", industry: "beauty",
    hook: "A proper local barber. Clear prices, a familiar face and your next haircut sorted.",
    notes: ["A full-width shop photograph introduces the barber; cuts and prices have their own clear focal point.", "A simple price menu works just as well on a phone as beside the counter.", "Choose a barber, see available demonstration times and try booking."],
    highlights: ["Prices and durations together", "Barber-specific service choices", "Real booking demonstration"],
  },
  {
    slug: "detail-dept", scenario: "detailer", industry: "motoring",
    hook: "The work up front. Valeting packages with room to explain what is included.",
    notes: ["A real work photograph leads into a true-black service page with clear white type.", "Services explain the work before asking for a booking.", "A request allows the business to agree the job and price first."],
    highlights: ["From prices with proper detail", "Appointment requests", "Service area and questions"],
  },
  {
    slug: "harris-cars", scenario: "brookfield", industry: "motoring",
    hook: "An independent forecourt, with the photographs and facts a buyer needs first.",
    notes: ["Large stock cards give each car room on a phone and pair up on a wider page.", "Available, reserved and sold stay visibly different.", "An enquiry keeps the selected car attached; a viewing is a request for the business to agree."],
    highlights: ["Readable stock cards", "Clear reserved and sold states", "Enquiries about a particular car"],
  },
  {
    slug: "marlowe-and-finch", scenario: "barber", industry: "beauty",
    hook: "Dark, photographic and made for booking a chair.",
    notes: ["The booking button leads, and customers choose a barber before a time.", "Products sit in a swipe row so the price menu stays short.", "Photography carries the mood, so the type stays quiet."],
    highlights: ["Price menu with durations", "Choose a barber, then a time", "Counter products with an affiliate link"],
  },
  {
    slug: "hollin-physio", scenario: "physio", industry: "health",
    hook: "A calm clinic introduction, clear appointment prices and space to meet the team.",
    notes: ["Every appointment is a request, because a clinician decides whether it is the right slot.", "Long appointments, written plainly, with prices up front.", "An editorial introduction and aligned appointment rows keep the page calm without relying on photography."],
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
    hook: "A bold training studio. Start with an introduction, then explore classes and coaching.",
    notes: ["An open photographic introduction pairs with true black, clear white type and curved controls.", "Coaches sit in a swipe row because there are four of them.", "The free intro is the one action that matters."],
    highlights: ["Classes, coaching and memberships", "Four coaches, each with their own services", "Classes and coaching with clear prices"],
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

// Commercial examples lead the catalogue; personal and creative starts remain available.
const EXAMPLE_ORDER = ["jays-barbers", "hollin-physio", "harris-cars", "lune-nail-studio", "no-6-coffee", "detail-dept", "fixnowmechanics", "brightlearn", "forge-strength", "dans-home-repairs", "maths-with-aisha", "sora-fields", "form-objects", "maya-builds"];
// Superseded example routes remain available; the gallery leads with their new UK replacements.
const publishedExamples = CATALOGUE.filter(e=>LOOKS.some(look=>look.id===EXAMPLE_LOOK[e.scenario]) && (COLLECTION_BRIEFS.some(b=>b.id===e.scenario) || ALL_SHOWCASE.some(i=>i.scenario===e.scenario) || ["fixnow","brightlearn"].includes(e.scenario)));
export const EXAMPLES = publishedExamples.sort((a,b) => {
  const rank = (slug: string) => { const index = EXAMPLE_ORDER.indexOf(slug); return index < 0 ? EXAMPLE_ORDER.length : index; };
  return rank(a.slug) - rank(b.slug);
});

const LEGACY_SLUGS: Record<string, string> = {"station-road-barbers": "jays-barbers", "parkside-valeting": "detail-dept", "brookfield-motors": "harris-cars", "corner-table-cafe": "no-6-coffee", "oakfield-home-repairs": "dans-home-repairs", "rowan-learning": "maths-with-aisha"}
export const exampleForScenario = (scenario: Scenario) => CATALOGUE.find((e) => e.scenario === scenario)
export const bySlug = (slug: string) => CATALOGUE.find((e) => e.slug === (LEGACY_SLUGS[slug] ?? slug))

const WIDGET_NAME: Partial<Record<WidgetType, string>> = {
  booking: "Booking", priceMenu: "Price menu", serviceList: "Services", products: "Products", team: "Team", gallery: "Photos", reviews: "Reviews", hours: "Opening hours",
  location: "Location", serviceArea: "Service area", faq: "Questions", enquiry: "Contact form", share: "Share", social: "Social links", call: "Call button", whatsapp: "WhatsApp button", credentials: "Credentials",
}

/** Facts about an example read from the engine's own data, so the page cannot describe something the example does not do. */
export function describe(e: Example) {
  const sc = SCENARIOS[e.scenario]
  const look = LOOKS.find((l) => l.id === EXAMPLE_LOOK[e.scenario])!
  const o = { ...look.overrides, colors: { ...look.overrides.colors, ...EXAMPLE_OVERRIDES[e.scenario].colors }, text: { ...look.overrides.text, ...EXAMPLE_OVERRIDES[e.scenario].text }, header: { ...look.overrides.header, ...EXAMPLE_OVERRIDES[e.scenario].header }, layout: { ...look.overrides.layout, ...EXAMPLE_OVERRIDES[e.scenario].layout } }
  const stock = (sc.content.products ?? []).length > 0 && (sc.content.products ?? []).every((p) => p.kind === "vehicle")
  const content = [...new Set(sc.widgets().map((w) => ((w.type === "reviews" || w.type === "leaveReview") && !googleReviewUrl(sc.content) ? undefined : stock && w.type === "products" ? "Vehicle stock" : WIDGET_NAME[w.type as WidgetType])).filter((x): x is string => Boolean(x)))]
  const businessName = sc.content.identity.name
  return {
    name: businessName,
    assetSlug: Object.keys(LEGACY_SLUGS).find(key => LEGACY_SLUGS[key] === e.slug) ?? e.slug,
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
    overrides: EXAMPLE_OVERRIDES[e.scenario],
  }
}
export type ExampleFacts = ReturnType<typeof describe>
