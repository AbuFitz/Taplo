import { businessContentSchema, type BusinessContentInput } from "@/features/businesses/content"
import inputs from "../../../docs/taplo-rebuild/fixtures/business-content-inputs.json"
import { hours } from "./helpers"

/** Authored fictional examples. Scheduling is isolated in the existing browser demo adapter;
 * no invented customer reviews, credentials, live contact channels or real availability. */
function example(key: keyof typeof inputs, mode: "instant" | "request", logo: string): BusinessContentInput {
  const content = businessContentSchema.parse(inputs[key])
  return {
    ...content,
    identity: { ...content.identity, logo: { src: `/taplo-demo/${logo}.svg`, alt: `${content.identity.name} example logo`, width: 240, height: 120 } },
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
