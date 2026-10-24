import type { BusinessContentInput } from "@/features/businesses/content"
import type { PageDoc } from "@/features/page/contracts/page"

import { BROOKFIELD, PARKSIDE, STATION, OAKFIELD, ROWAN, CORNER } from "./uk"
import { hours, newWidget, person, photo, svc } from "./helpers"
import { CAFE, EXTRA_WIDGETS, GYM, PHYSIO, TUTOR } from "./examples"

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
    svc("s6", "Together", "Cut and beard", 4800, 60, "Our most-booked pairing.", 6, "request"),
  ],
  staff: [
    person("jonah", "Jonah Marlowe", "Head barber and co-founder", "Twelve years behind the chair. Jonah does the consultations, the razor work and the long conversations about fades.", null, ["Fades", "Razor shaves"], ["Twelve years cutting hair"]),
    person("reece", "Reece Finch", "Barber and co-founder", "Reece is the classic-cut specialist: scissor work, tapers and the hot-towel shave regulars drive across London for.", ["s1", "s2", "s4", "s5", "s6"], ["Scissor cuts", "Beards"], ["Ten years cutting hair"]),
    person("mira", "Mira Okoye", "Barber", "Mira looks after our younger clients and anyone new to the shop, and is the quickest in the building with a clean skin fade.", ["s1", "s2", "s3", "s5"], ["Kids' cuts", "Skin fades"]),
  ],
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
    {
      id: "p2",
      name: "Boar-bristle shaving brush",
      description: "The brush we use in the shop for hot-towel shaves. We recommend it; it is sold by a maker we trust.",
      priceMinor: 2400,
      currency: "GBP",
      badge: "We recommend",
      facts: [{ label: "Bristle", value: "Boar" }, { label: "Handle", value: "Walnut" }],
      mode: "link",
      linkUrl: "https://example.com/shaving-brush",
      kind: "product",
      availability: "available",
      images: [],
      affiliate: true,
      archived: false,
    },
  ],
  offers: [],
  booking: { mode: "instant", onlineBookingReady: true },
}

const car = (id: string, name: string, priceMinor: number, image: string, w: number, h: number, focal: { x: number; y: number }, alt: string, facts: [string, string][], badge?: string, availability: "available" | "reserved" | "sold" = "available") => ({
  id, name, priceMinor, currency: "GBP", badge, facts: facts.map(([label, value]) => ({ label, value })), image: photo(image, alt, w, h, focal), mode: "enquire" as const, archived: false, kind: "vehicle" as const, availability, images: [], affiliate: false,
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
    { id: "d1", name: "Book a viewing", description: "See a car in person, with no pressure.", priceMode: "free", currency: "GBP", durationMinutes: 30, delivery: [], bookingMode: "instant", sortOrder: 1 },
    { id: "d2", name: "Part-exchange valuation", description: "A straight answer on what your car is worth.", priceMode: "free", currency: "GBP", durationMinutes: 20, delivery: [], bookingMode: "request", sortOrder: 2 },
    { id: "d3", name: "Finance conversation", description: "Plain terms, any budget, no obligation.", priceMode: "free", currency: "GBP", durationMinutes: 30, delivery: [], bookingMode: "contact", sortOrder: 3 },
  ],
  staff: [
    person("ellis", "Ellis Aldous", "Owner and sales", "Ellis started the business after fifteen years selling cars for other people and now picks every car personally.", null, ["Used cars", "Part-exchange"]),
    person("noor", "Noor Haddad", "Sales and aftercare", "Noor handles viewings, handovers and the after-sale questions, and knows the history of every car on the forecourt.", ["d1", "d2"], ["Viewings", "Handover"]),
  ],
  gallery: [],
  testimonials: [{ id: "t1", quote: "Straightforward from the first call. The car was exactly as described, and ready to drive away.", author: "Helen M.", source: "owner_supplied", permissionConfirmed: true }],
  reviewLinks: [],
  faqs: [],
  caseStudies: [],
  products: [
    car("v1", "Volvo XC40 Recharge", 2799500, "car-xc40", 1120, 1400, { x: 50, y: 82 }, "A white compact SUV beside a concrete wall", [["Year", "2022"], ["Mileage", "14,200"], ["Fuel", "Electric"], ["Gearbox", "Auto"]], "Just arrived"),
    car("v2", "Genesis GV60", 3845000, "car-gv60", 1120, 1400, { x: 60, y: 78 }, "A white electric crossover under a modern building", [["Year", "2023"], ["Mileage", "6,900"], ["Fuel", "Electric"], ["Gearbox", "Auto"]]),
    car("v3", "Volkswagen Golf R", 2975000, "car-golf", 1120, 1400, { x: 55, y: 55 }, "A grey hatchback parked beside a field of sunflowers", [["Year", "2020"], ["Mileage", "31,400"], ["Fuel", "Petrol"], ["Gearbox", "DSG"]], undefined, "reserved"),
    car("v4", "BMW X1 xDrive20d", 1799500, "car-x1", 1200, 800, { x: 50, y: 70 }, "A white SUV photographed head-on in a dark showroom", [["Year", "2019"], ["Mileage", "42,800"], ["Fuel", "Diesel"], ["Gearbox", "Auto"]], undefined, "sold"),
  ],
  offers: [],
  booking: { mode: "instant", onlineBookingReady: true },
}

export const TRADES: BusinessContentInput = {
  identity: {
    name: "Northgate Heating & Plumbing",
    slug: "northgate-heating",
    tagline: "Boilers, leaks and bathrooms. Gas Safe engineers, fixed prices, same-day call-outs.",
    logo: { src: "/showcase/northgate-mark.svg", alt: "Northgate mark", width: 256, height: 256 },
    heroImage: photo("trades-hero", "An engineer soldering a pipe fitting under a work light", 1600, 1067, { x: 52, y: 40 }),
    industryKey: "plumber",
    industryLabel: "Heating and plumbing",
  },
  location: { mode: "service_area", locality: "Watford and north-west London", timezone: "Europe/London" },
  contacts: {
    phone: "01923 555 0147",
    whatsapp: "+447700900733",
    email: "jobs@northgate-heating.example",
    social: [{ platform: "facebook", url: "https://facebook.com/northgateheating" }],
  },
  about: "A small team of Gas Safe registered engineers. You get a fixed price before we start, and a tidy finish.",
  credentials: ["Gas Safe registered", "Fully insured", "Same-day call-outs"],
  hours: [...hours(["mon", "tue", "wed", "thu", "fri"], "07:30", "18:30"), ...hours(["sat"], "08:00", "14:00")],
  services: [
    svc("n1", "Heating", "Boiler service", 8500, 60, "Annual safety check and service with a written report.", 1),
    svc("n2", "Heating", "Boiler repair", 9500, 90, "Diagnosis and repair, parts quoted before we fit them.", 2, "request"),
    svc("n3", "Plumbing", "Leak and burst pipe call-out", 11000, 60, "Emergency visit, first hour included.", 3),
    svc("n4", "Plumbing", "Tap, toilet or radiator fix", 7500, 60, "A straightforward fix at a fixed price.", 4),
    { ...svc("n5", "Bathrooms", "Bathroom design visit", 0, 45, "Free survey and written quote.", 5, "request"), priceMode: "free" as const, priceMinor: undefined },
  ],
  staff: [
    person("tomas", "Tomas Nowak", "Gas engineer", "Tomas does most of the boiler repairs and annual services, and is the person who usually answers the emergency line.", ["n1", "n2", "n3", "n4"], ["Boilers", "Heating"], ["Gas Safe registered (fictional example)"]),
    person("kofi", "Kofi Mensah", "Plumber and bathroom fitter", "Kofi covers leaks, bathrooms and anything involving pipes, and is the one to ask about a bathroom quote.", ["n3", "n4", "n5"], ["Leaks", "Bathrooms"]),
  ],
  gallery: [
    { id: "g1", image: photo("trades-tap", "Chrome bathroom taps over a basin", 1600, 1067, { x: 50, y: 50 }), caption: "A bathroom refit" },
    { id: "g2", image: photo("trades-hero", "An engineer soldering a pipe fitting under a work light", 1600, 1067, { x: 52, y: 40 }), caption: "On a call-out" },
  ],
  testimonials: [
    { id: "t1", quote: "Boiler failed on a Sunday night. Someone was here by ten the next morning and it was fixed within the hour.", author: "Amara O.", source: "owner_supplied", permissionConfirmed: true },
    { id: "t2", quote: "Fixed price, on time and they cleaned up after themselves.", author: "Tom H.", source: "owner_supplied", permissionConfirmed: true },
  ],
  reviewLinks: [],
  faqs: [
    { id: "f1", question: "Do you charge a call-out fee?", answer: "Our prices include the first hour. You always get the full price before we start." },
    { id: "f2", question: "Which areas do you cover?", answer: "Watford, Rickmansworth, Harrow, Pinner and the surrounding postcodes." },
  ],
  caseStudies: [],
  products: [],
  offers: [],
  booking: { mode: "instant", onlineBookingReady: true },
}

export type Scenario = "oakfield" | "rowan" | "corner" | "brookfield" | "station" | "detailer" | "barber" | "dealer" | "trades" | "physio" | "cafe" | "tutor" | "gym"
export const SCENARIOS: Record<Scenario, { label: string; content: BusinessContentInput; widgets: () => PageDoc["widgets"] }> = {
  corner: { label: "Neighbourhood café", content: CORNER, widgets: () => [
    newWidget("priceMenu", { title: "At the counter", showDescriptions: true }),
    newWidget("hours", { title: "Come by" }),
    newWidget("faq", { title: "Before you visit" }),
    newWidget("enquiry", { title: "A larger visit?", intro: "Tell us the day, group size and anything you would like to ask. This is an enquiry, not a table reservation.", variant: "inline" }),
    newWidget("share", { label: "Share this café", variant: "button" }),
  ] },
  oakfield: { label: "Local home repairs", content: OAKFIELD, widgets: () => [
    newWidget("booking", { label: "Request a visit", variant: "button" }),
    newWidget("serviceList", { title: "A few things we can help with", variant: "cards" }),
    newWidget("serviceArea", { title: "Where we work" }),
    newWidget("faq", { title: "Before we visit" }),
    newWidget("enquiry", { title: "Tell us about the job", intro: "What needs doing, which town are you in, and is there anything useful to know about the fitting?", variant: "inline" }),
  ] },
  rowan: { label: "Independent maths tutor", content: ROWAN, widgets: () => [
    newWidget("featuredService", { headline: "Start with a conversation", serviceId: "rl-intro" }),
    newWidget("serviceList", { title: "Sessions at your pace", variant: "list", excludeFeatured: true }),
    newWidget("team", { title: "Meet your tutor", variant: "list" }),
    newWidget("faq", { title: "A few questions first" }),
    newWidget("enquiry", { title: "What would you like help with?", variant: "inline" }),
    newWidget("booking", { label: "Request an introduction", variant: "button", serviceId: "rl-intro" }),
  ] },
  brookfield: {
    label: "Independent car dealer", content: BROOKFIELD,
    widgets: () => [
      newWidget("booking", { label: "Arrange a viewing", variant: "button" }),
      newWidget("products", { title: "Current stock", variant: "catalogue" }),
      newWidget("faq", { title: "Before you visit" }),
      newWidget("hours", { title: "Opening hours" }),
      newWidget("enquiry", { title: "Ask about a car", intro: "Tell us which car you have in mind and what you would like to know.", variant: "inline" }),
    ],
  },
  station: {
    label: "High-street barber", content: STATION,
    widgets: () => [
      newWidget("booking", { label: "Book a haircut", variant: "button" }),
      newWidget("priceMenu", { title: "Cuts and prices", showDescriptions: true }),
      newWidget("team", { title: "Choose your barber", variant: "list" }),
      newWidget("products", { title: "From the shop", variant: "swipe" }),
      newWidget("gallery", { title: "The shop", variant: "grid" }),
      newWidget("hours", { title: "When we're open" }),
      newWidget("faq", { title: "Before you visit" }),
      newWidget("share", { label: "Share Jay’s Barbers", variant: "button" }),
    ],
  },
  detailer: {
    label: "Valeting and detailing", content: PARKSIDE,
    widgets: () => [
      newWidget("booking", { label: "Request a valet", variant: "button" }),
      newWidget("serviceList", { title: "A clean that suits your car", variant: "cards" }),
      newWidget("serviceArea", { title: "Where we work" }),
      newWidget("faq", { title: "Good to know" }),
      newWidget("enquiry", { title: "Tell us about your car", intro: "Include the model, condition and the work you have in mind.", variant: "inline" }),
      newWidget("hours", { title: "Working hours" }),
    ],
  },
  physio: { label: "Physiotherapy clinic", content: PHYSIO, widgets: EXTRA_WIDGETS.physio },
  cafe: { label: "Café", content: CAFE, widgets: EXTRA_WIDGETS.cafe },
  tutor: { label: "Tutor", content: TUTOR, widgets: EXTRA_WIDGETS.tutor },
  gym: { label: "Fitness studio", content: GYM, widgets: EXTRA_WIDGETS.gym },
  barber: {
    label: "Barber",
    content: BARBER,
    widgets: () => [
      newWidget("booking", { label: "Book your chair", variant: "button" }),
      newWidget("priceMenu", { title: "Services" }),
      newWidget("team", { title: "The barbers", variant: "swipe" }),
      newWidget("products", { title: "From the shop", variant: "swipe" }),
      newWidget("gallery", { title: "Inside", variant: "grid" }),
      newWidget("reviews", { title: "Kind words", variant: "cards" }),
      newWidget("hours", { title: "Hours" }),
      newWidget("location", { title: "Find us" }),
      newWidget("social", { variant: "icons" }),
      newWidget("share", { label: "Share Marlowe & Finch", variant: "button" }),
    ],
  },
  trades: {
    label: "Plumber",
    content: TRADES,
    widgets: () => [
      newWidget("call", { label: "Call an engineer", variant: "button" }),
      newWidget("booking", { label: "Request a visit", variant: "button" }),
      newWidget("serviceList", { title: "Fixed prices", variant: "cards" }),
      newWidget("team", { title: "Your engineers", variant: "list" }),
      newWidget("gallery", { title: "Recent work", variant: "grid" }),
      newWidget("reviews", { title: "What customers say", variant: "quote" }),
      newWidget("serviceArea", { title: "Where we work" }),
      newWidget("faq", { title: "Questions" }),
      newWidget("enquiry", { title: "Send us a message", intro: "Describe the problem and we will tell you what we can do, and when.", variant: "inline" }),
      newWidget("hours", { title: "Hours" }),
    ],
  },
  dealer: {
    label: "Car dealer",
    content: DEALER,
    widgets: () => [
      newWidget("booking", { label: "Book a viewing", variant: "button" }),
      newWidget("products", { title: "In stock", variant: "list" }),
      newWidget("serviceList", { title: "How we can help", variant: "cards" }),
      newWidget("team", { title: "Who you will meet", variant: "list" }),
      newWidget("reviews", { title: "From our customers", variant: "quote" }),
      newWidget("hours", { title: "Opening hours" }),
      newWidget("location", { title: "Visit us" }),
      newWidget("enquiry", { title: "Ask about a car", intro: "Tell us which car you like and we will get back to you.", buttonLabel: "Ask about a car", variant: "button" }),
      newWidget("social", { variant: "icons" }),
    ],
  },
}
