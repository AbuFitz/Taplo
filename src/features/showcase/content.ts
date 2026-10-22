import type { BusinessContentInput } from "@/features/businesses/content"
import type { PageDoc } from "@/features/page/contracts/page"
import { newWidget as make } from "@/features/page/starter"
import type { WidgetType } from "@/features/page/contracts/widgets"

/** Showcase widgets get fixed ids so server and client render identical markup. */
const newWidget = (type: WidgetType, settings: Record<string, unknown> = {}) => ({ ...make(type, settings), id: `showcase-${type}` })

/**
 * Two fictional businesses used to show the appearance engine. Names, numbers and reviews are
 * invented; photographs are credited in public/showcase/CREDITS.md.
 */
const photo = (name: string, alt: string, w: number, h: number, focal?: { x: number; y: number }) => ({ src: `/showcase/${name}.jpg`, alt, width: w, height: h, focal })
const svc = (id: string, group: string, name: string, priceMinor: number, durationMinutes: number, description: string, sortOrder: number) =>
  ({ id, group, name, description, priceMode: "fixed" as const, priceMinor, currency: "GBP", durationMinutes, delivery: [], bookingMode: "request" as const, sortOrder })
const hours = (days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[], opens: string, closes: string) => days.map((day) => ({ day, opens, closes }))

export const BARBER: BusinessContentInput = {
  identity: {
    name: "Marlowe & Finch",
    slug: "marlowe-and-finch",
    tagline: "Classic cuts and hot-towel shaves, by appointment in the heart of Clerkenwell.",
    logo: { src: "/showcase/marlowe-mark.svg", alt: "Marlowe & Finch mark", width: 256, height: 256 },
    heroImage: photo("barber-hero", "A leather barber chair in a dark, warmly lit shop", 1200, 800, { x: 62, y: 55 }),
    industryKey: "barber",
    industryLabel: "Barbers",
  },
  location: { mode: "premises", locality: "Clerkenwell, London", addressLine: "14 Pickering Yard, London EC1", directionsUrl: "https://maps.google.com/?q=Clerkenwell+London", timezone: "Europe/London" },
  contacts: {
    phone: "020 7946 0318",
    email: "hello@marlowe-finch.example",
    social: [
      { platform: "instagram", url: "https://instagram.com/marlowefinch" },
      { platform: "tiktok", url: "https://tiktok.com/@marlowefinch" },
      { platform: "facebook", url: "https://facebook.com/marlowefinch" },
    ],
  },
  about: "Four chairs, no rush. We cut hair the way it used to be done: a proper consultation, a hot towel, and a finish you can feel.",
  credentials: [],
  hours: [...hours(["tue", "wed", "thu", "fri"], "09:00", "19:00"), ...hours(["sat"], "09:00", "17:00")],
  services: [
    svc("s1", "Hair", "Signature cut", 3400, 45, "Consultation, cut, hot-towel finish and styling.", 1),
    svc("s2", "Hair", "Skin fade", 3200, 40, "Crisp, blended and finished with a straight razor.", 2),
    svc("s3", "Hair", "Junior cut (under 12)", 2200, 30, "Same care, a little less sitting still.", 3),
    svc("s4", "Shave", "Hot-towel shave", 3000, 40, "Warm towels, lather and a slow, close shave.", 4),
    svc("s5", "Shave", "Beard sculpt", 2000, 25, "Shaped, lined and conditioned.", 5),
    svc("s6", "Together", "Cut and beard", 4800, 60, "Our most-booked pairing.", 6),
  ],
  staff: [],
  gallery: [
    { id: "g1", image: photo("barber-shop", "The shop floor: brick, brass and a single leather chair", 933, 1400, { x: 50, y: 60 }), caption: "The shop" },
    { id: "g2", image: photo("barber-cut", "A barber's gloved hands shaping a client's hair with scissors and comb", 933, 1400, { x: 50, y: 40 }), caption: "In the chair" },
    { id: "g3", image: photo("barber-hero", "Leather chairs under warm lights", 1200, 800, { x: 60, y: 60 }), caption: "Evenings" },
  ],
  testimonials: [
    { id: "t1", quote: "The quietest, most careful haircut I've had in years. I booked the next one before I left.", author: "Daniel R.", source: "owner_supplied", permissionConfirmed: true },
    { id: "t2", quote: "The hot-towel shave is worth the trip across London on its own.", author: "Priya S.", source: "owner_supplied", permissionConfirmed: true },
  ],
  reviewLinks: [],
  faqs: [],
  caseStudies: [],
  products: [
    {
      id: "p1",
      name: "Cedar & Citrus beard oil",
      description: "A light, fast-absorbing oil blended in small batches for the shop.",
      priceMinor: 1800,
      currency: "GBP",
      image: photo("barber-oil", "A dark glass dropper bottle of beard oil against a pale blue sky", 933, 1400, { x: 50, y: 62 }),
      badge: "New in",
      facts: [{ label: "Size", value: "30 ml" }, { label: "Scent", value: "Cedar, citrus" }],
      mode: "enquire",
      archived: false,
    },
  ],
  offers: [],
  booking: { mode: "request", onlineBookingReady: false },
}

const car = (id: string, name: string, priceMinor: number, image: string, w: number, h: number, focal: { x: number; y: number }, alt: string, facts: [string, string][], badge?: string) => ({
  id, name, priceMinor, currency: "GBP", badge, facts: facts.map(([label, value]) => ({ label, value })), image: photo(image, alt, w, h, focal), mode: "enquire" as const, archived: false,
})

export const DEALER: BusinessContentInput = {
  identity: {
    name: "Aldous Motor Co.",
    slug: "aldous-motor-co",
    tagline: "Hand-picked used cars, prepared properly and priced honestly.",
    logo: { src: "/showcase/aldous-mark.svg", alt: "Aldous Motor Co. mark", width: 256, height: 256 },
    heroImage: photo("dealer-hero", "A white crossover photographed side-on against a grey wall", 1200, 675, { x: 50, y: 60 }),
    industryKey: "car-dealer",
    industryLabel: "Used cars",
  },
  location: { mode: "premises", locality: "Hatfield, Hertfordshire", addressLine: "Unit 6, Comet Way, Hatfield", directionsUrl: "https://maps.google.com/?q=Hatfield+Hertfordshire", timezone: "Europe/London" },
  contacts: {
    phone: "01707 960 214",
    whatsapp: "+447700900412",
    email: "sales@aldous-motors.example",
    social: [{ platform: "instagram", url: "https://instagram.com/aldousmotorco" }, { platform: "youtube", url: "https://youtube.com/@aldousmotorco" }],
  },
  about: "Every car is inspected on arrival, serviced where needed and sold with a written history. Come for a drive, not a pitch.",
  credentials: [],
  hours: [...hours(["mon", "tue", "wed", "thu", "fri"], "09:00", "18:00"), ...hours(["sat"], "09:00", "16:00")],
  services: [
    { id: "d1", name: "Book a viewing", description: "See a car in person, with no pressure.", priceMode: "free", currency: "GBP", durationMinutes: 30, delivery: [], bookingMode: "request", sortOrder: 1 },
    { id: "d2", name: "Part-exchange valuation", description: "A straight answer on what your car is worth.", priceMode: "free", currency: "GBP", durationMinutes: 20, delivery: [], bookingMode: "request", sortOrder: 2 },
    { id: "d3", name: "Finance conversation", description: "Plain terms, any budget, no obligation.", priceMode: "free", currency: "GBP", durationMinutes: 30, delivery: [], bookingMode: "request", sortOrder: 3 },
  ],
  staff: [],
  gallery: [],
  testimonials: [{ id: "t1", quote: "Straightforward from the first call. The car was exactly as described, and ready to drive away.", author: "Helen M.", source: "owner_supplied", permissionConfirmed: true }],
  reviewLinks: [],
  faqs: [],
  caseStudies: [],
  products: [
    car("v1", "Volvo XC40 Recharge", 2799500, "car-xc40", 1120, 1400, { x: 50, y: 82 }, "A white compact SUV beside a concrete wall", [["Year", "2022"], ["Mileage", "14,200"], ["Fuel", "Electric"], ["Gearbox", "Auto"]], "Just arrived"),
    car("v2", "Genesis GV60", 3845000, "car-gv60", 1120, 1400, { x: 60, y: 78 }, "A white electric crossover under a modern building", [["Year", "2023"], ["Mileage", "6,900"], ["Fuel", "Electric"], ["Gearbox", "Auto"]]),
    car("v3", "Volkswagen Golf R", 2975000, "car-golf", 1120, 1400, { x: 55, y: 55 }, "A grey hatchback parked beside a field of sunflowers", [["Year", "2020"], ["Mileage", "31,400"], ["Fuel", "Petrol"], ["Gearbox", "DSG"]], "Reserved"),
    car("v4", "BMW X1 xDrive20d", 1799500, "car-x1", 1200, 800, { x: 50, y: 70 }, "A white SUV photographed head-on in a dark showroom", [["Year", "2019"], ["Mileage", "42,800"], ["Fuel", "Diesel"], ["Gearbox", "Auto"]]),
  ],
  offers: [],
  booking: { mode: "request", onlineBookingReady: false },
}

export type Scenario = "barber" | "dealer"
export const SCENARIOS: Record<Scenario, { label: string; content: BusinessContentInput; widgets: () => PageDoc["widgets"] }> = {
  barber: {
    label: "Barber",
    content: BARBER,
    widgets: () => [
      newWidget("booking", { label: "Book your chair", variant: "button" }),
      newWidget("priceMenu", { title: "Services" }),
      newWidget("products", { title: "From the shop", variant: "grid" }),
      newWidget("gallery", { title: "Inside", variant: "grid" }),
      newWidget("reviews", { title: "Kind words", variant: "cards" }),
      newWidget("hours", { title: "Hours" }),
      newWidget("location", { title: "Find us" }),
      newWidget("social", { variant: "icons" }),
    ],
  },
  dealer: {
    label: "Car dealer",
    content: DEALER,
    widgets: () => [
      newWidget("booking", { label: "Book a viewing", variant: "button" }),
      newWidget("products", { title: "In stock", variant: "list" }),
      newWidget("serviceList", { title: "How we can help", variant: "cards" }),
      newWidget("reviews", { title: "From our customers", variant: "quote" }),
      newWidget("hours", { title: "Opening hours" }),
      newWidget("location", { title: "Visit us" }),
      newWidget("social", { variant: "icons" }),
    ],
  },
}
