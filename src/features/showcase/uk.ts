import { businessContentSchema, type BusinessContentInput } from "@/features/businesses/content"
import inputs from "../../../docs/taplo-rebuild/fixtures/business-content-inputs.json"
import { hours } from "./helpers"

/** Authored fictional examples. Scheduling is isolated in the existing browser demo adapter;
 * no invented customer reviews, credentials, live contact channels or real availability. */
const INDUSTRY_KEYS: Record<keyof typeof inputs, string> = {
  "stillwater-detailing": "detailer", "common-room-barbers": "barber", "alder-motor-house": "car-dealer",
  "fieldwork-home-care": "handyman", "rowan-learning": "tutor", "sunday-counter": "hospitality",
}
const PUBLIC_SLUGS: Record<keyof typeof inputs, string> = {
  "stillwater-detailing": "detail-dept", "common-room-barbers": "jays-barbers", "alder-motor-house": "harris-cars",
  "fieldwork-home-care": "dans-home-repairs", "rowan-learning": "maths-with-aisha", "sunday-counter": "no-6-coffee",
}
function example(key: keyof typeof inputs, mode: "instant" | "request", logo: string): BusinessContentInput {
  const content = businessContentSchema.parse(inputs[key])
  return {
    ...content,
    identity: { ...content.identity, slug: PUBLIC_SLUGS[key], industryKey: INDUSTRY_KEYS[key], logo: { src: `/taplo-demo/${logo}.svg`, alt: `${content.identity.name} example logo`, width: 240, height: 120 } },
    hours: [...hours(["tue", "wed", "thu", "fri"], "09:00", "18:00"), ...hours(["sat"], "09:00", "16:00")],
    booking: { mode, onlineBookingReady: true },
    services: content.services.map((s) => ({ ...s, bookingMode: s.durationMinutes ? mode : "contact" })),
    staff: content.staff.map((p) => ({ ...p, bookable: true })),
  }
}

const station = example("common-room-barbers", "instant", "station-road-mark")
export const STATION: BusinessContentInput = {
  ...station,
  products: (station.products ?? []).map(p => ({ ...p, image: undefined })),
  staff: (station.staff ?? []).map(p => ({ ...p, photo: undefined })),
  identity: { ...station.identity, heroImage: { src: "/photography/barber.webp", alt: "Barber working with clippers; photograph by Glib Albovsky", width: 1600, height: 2000, focal: { x: 50, y: 55 } } },
  gallery: [{ id: "station-work", image: { src: "/photography/barber.webp", alt: "Barber at work; photograph by Glib Albovsky", width: 1600, height: 2000 }, caption: "In the chair" }],
}
const parkside = example("stillwater-detailing", "request", "parkside-mark")
export const PARKSIDE: BusinessContentInput = { ...parkside, identity: { ...parkside.identity, heroImage: { src: "/photography/valet.webp", alt: "A car being washed; photograph by Avenir Visuals", width: 1600, height: 900, focal: { x: 50, y: 50 } } } }

const brookfield = example("alder-motor-house", "request", "brookfield-mark")
const STOCK_DESCRIPTIONS: Record<string, string> = {
  "am-golf": "Five-door petrol hatchback with a manual gearbox. Ask for the full specification or arrange a viewing.",
  "am-cx5": "Currently reserved. You can still ask about similar cars or tell us what you are looking for.",
  "am-mini": "This car has sold. Browse the available cars or ask what is coming in.",
}
const STOCK_IMAGES: Record<string, string> = { "am-golf": "brookfield-golf", "am-cx5": "brookfield-cx5", "am-mini": "brookfield-mini" }
export const BROOKFIELD: BusinessContentInput = {
  ...brookfield,
  services: [{ id: "bf-viewing", name: "Arrange a viewing", description: "Tell us which car you would like to see. We will agree the appointment before you travel.", priceMode: "free", currency: "GBP", durationMinutes: 30, delivery: [], bookingMode: "request", sortOrder: 0 }],
  products: (brookfield.products ?? []).filter((p) => STOCK_IMAGES[p.id]).map((p) => ({
    ...p, description: STOCK_DESCRIPTIONS[p.id],
    name: p.id === "am-golf" ? "Volkswagen Golf 1.5 TSI Style" : p.id === "am-cx5" ? "Mazda CX-5 2.2 SE-L Nav+" : "MINI Cooper 1.5",
    facts: (p.facts ?? []).map(f => f.label === "Year" ? { ...f, value: p.id === "am-golf" ? "2020" : p.id === "am-cx5" ? "2019" : "2017" } : p.id === "am-cx5" && f.label === "Fuel" ? { ...f, value: "Diesel" } : f),
    image: { src: `/taplo-demo/${STOCK_IMAGES[p.id]}.png`, alt: `Illustrative ${p.id === "am-golf" ? "hatchback" : p.id === "am-cx5" ? "crossover" : "small hatchback"}; generated artwork, not a vehicle on offer`, width: 1536, height: p.id === "am-golf" ? 1024 : p.id === "am-cx5" ? 1024 : 1024, focal: { x: 50, y: 50 } },
  })),
}

const oakfield = example("fieldwork-home-care", "request", "oakfield-mark")
export const OAKFIELD: BusinessContentInput = {
  ...oakfield,
  identity: { ...oakfield.identity, heroImage: { src: "/taplo-demo/oakfield-shelf.png", alt: "Illustrative shelf-fitting work in a British home", width: 1536, height: 1024, focal: { x: 70, y: 44 } } },
  about: "The small jobs that make a home work better. Tell us what needs attention, where you are and anything useful about the wall or fittings. We will agree the scope before a visit.",
  hours: hours(["mon", "tue", "wed", "thu", "fri"], "09:00", "17:00"),
  faqs: [
    { id: "oak-area", question: "Which areas do you cover?", answer: "We cover Hertfordshire. Include your town when you enquire so the visit can be agreed." },
    { id: "oak-price", question: "What does the from price include?", answer: "A small-repairs visit starts from £65. Materials and longer jobs are agreed separately, before work starts." },
    { id: "oak-photos", question: "What should I send with an enquiry?", answer: "Tell us what needs fixing and the type of wall or fitting. We can ask for photographs when discussing the job." },
  ],
}

const rowan = example("rowan-learning", "request", "rowan-mark")
const rowanMark = { src: "/taplo-demo/rowan-mark.svg", alt: "Maths with Aisha wordmark", width: 240, height: 120 }
export const ROWAN: BusinessContentInput = {
  ...rowan,
  identity: { ...rowan.identity, logo: rowanMark },
  about: "Maths at a pace you can follow. We work through the question, find the sticking point and leave you with something clear to practise next.",
  hours: [...hours(["tue", "wed", "thu"], "16:00", "20:00"), ...hours(["sat"], "09:00", "13:00")],
  staff: (rowan.staff ?? []).map((p) => ({ ...p, photo: undefined, bio: "One-to-one maths support, from a first conversation to focused GCSE and A-level sessions. We start with what you would like help with." })),
  services: (rowan.services ?? []).map((s) => ({ ...s, delivery: ["online", "premises"] })),
  faqs: [
    { id: "rowan-online", question: "Can we work online?", answer: "Yes. We offer online and local sessions. Mention your preference in the request." },
    { id: "rowan-intro", question: "What happens in the introduction?", answer: "A free 20-minute conversation about the learner, the topics they find difficult and what they would like to achieve. A session time is agreed after the request." },
    { id: "rowan-start", question: "Do I need to know exactly what help I need?", answer: "No. Bring a question or a topic that feels difficult and we can start there." },
  ],
}

const corner = businessContentSchema.parse(inputs["sunday-counter"])
export const CORNER: BusinessContentInput = {
  ...corner,
  identity: { ...corner.identity, slug: PUBLIC_SLUGS["sunday-counter"], industryKey: "hospitality", logo: { src: "/taplo-demo/corner-table-mark.svg", alt: "No. 6 Coffee example wordmark", width: 280, height: 120 }, heroImage: { src: "/photography/coffee.webp", alt: "A neighbourhood café interior; photograph by Jan Wright", width: 1600, height: 1067, focal: { x: 50, y: 50 } } },
  about: "A coffee, a proper breakfast, a little time at the table. Browse the menu, check the opening times or ask about a larger visit.",
  hours: [...hours(["tue", "wed", "thu", "fri"], "08:00", "16:00"), ...hours(["sat"], "09:00", "16:00"), ...hours(["sun"], "09:00", "15:00")],
  booking: { mode: "contact", onlineBookingReady: false },
}
