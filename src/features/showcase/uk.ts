import { businessContentSchema, type BusinessContentInput } from "@/features/businesses/content"
import inputs from "../../../docs/taplo-rebuild/fixtures/business-content-inputs.json"
import { hours } from "./helpers"

/** Authored fictional examples. Scheduling is isolated in the existing browser demo adapter;
 * no invented customer reviews, credentials, live contact channels or real availability. */
const INDUSTRY_KEYS: Record<keyof typeof inputs, string> = {
  "stillwater-detailing": "detailer", "common-room-barbers": "barber", "alder-motor-house": "car-dealer",
  "fieldwork-home-care": "handyman", "rowan-learning": "tutor", "sunday-counter": "hospitality",
}
function example(key: keyof typeof inputs, mode: "instant" | "request", logo: string): BusinessContentInput {
  const content = businessContentSchema.parse(inputs[key])
  return {
    ...content,
    identity: { ...content.identity, industryKey: INDUSTRY_KEYS[key], logo: { src: `/taplo-demo/${logo}.svg`, alt: `${content.identity.name} example logo`, width: 240, height: 120 } },
    hours: [...hours(["tue", "wed", "thu", "fri"], "09:00", "18:00"), ...hours(["sat"], "09:00", "16:00")],
    booking: { mode, onlineBookingReady: true },
    services: content.services.map((s) => ({ ...s, bookingMode: s.durationMinutes ? mode : "contact" })),
    staff: content.staff.map((p) => ({ ...p, bookable: true })),
  }
}

const station = example("common-room-barbers", "instant", "station-road-mark")
export const STATION: BusinessContentInput = {
  ...station,
  identity: { ...station.identity, heroImage: { src: "/taplo-demo/station-road-barber-work.png", alt: "Illustrative barber at work in a daylit high-street shop", width: 1536, height: 1024, focal: { x: 54, y: 46 } } },
  gallery: [{ id: "station-work", image: { src: "/taplo-demo/station-road-barber-work.png", alt: "Illustrative scene of a haircut in progress", width: 1536, height: 1024 }, caption: "In the chair · illustrative example" }],
}
export const PARKSIDE = example("stillwater-detailing", "request", "parkside-mark")

const brookfield = example("alder-motor-house", "request", "brookfield-mark")
const STOCK_DESCRIPTIONS: Record<string, string> = {
  "am-golf": "Five-door petrol hatchback with a manual gearbox. Ask for the full specification or arrange a viewing.",
  "am-cx5": "Currently reserved. You can still ask about similar cars or tell us what you are looking for.",
  "am-mini": "This car has sold. Browse the available cars or ask what is coming in.",
}
const STOCK_IMAGES: Record<string, string> = { "am-golf": "golf", "am-cx5": "cx5", "am-mini": "mini" }
export const BROOKFIELD: BusinessContentInput = {
  ...brookfield,
  services: [{ id: "bf-viewing", name: "Arrange a viewing", description: "Tell us which car you would like to see. We will agree the appointment before you travel.", priceMode: "free", currency: "GBP", durationMinutes: 30, delivery: [], bookingMode: "request", sortOrder: 0 }],
  products: (brookfield.products ?? []).filter((p) => STOCK_IMAGES[p.id]).map((p) => ({
    ...p, description: STOCK_DESCRIPTIONS[p.id],
    image: { src: `/taplo-demo/brookfield-${STOCK_IMAGES[p.id]}.png`, alt: `Illustrative example of ${p.name}; not a real vehicle listing`, width: 1536, height: 1024, focal: { x: 50, y: 50 } },
  })),
}
