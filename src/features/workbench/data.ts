import { businessContentSchema, type BusinessContent } from "@/features/businesses/content"
import { BARBER, DEALER, SCENARIOS, TRADES, type Scenario } from "@/features/showcase/content"

/** Content variants for stories. Each takes real example content and changes one thing, so a story shows a state, not a different business. */
export type Content = BusinessContent
const LONG_NAME = "Marlowe, Finch & Associates Heritage Barbering and Grooming Rooms of Clerkenwell"
const LONG_TEXT = "A deliberately long description that keeps going well past what fits on one line, so wrapping, clamping and the space around it can be judged at the size people actually see it, on a small phone with a large text setting."

export const base = (s: Scenario): Content => businessContentSchema.parse(structuredClone(SCENARIOS[s].content))

const clone = <T,>(arr: T[], n: number, edit: (x: T, i: number) => T): T[] => (arr.length ? Array.from({ length: n }, (_, i) => edit(structuredClone(arr[i % arr.length]!), i)) : [])

export const variants = {
  /** Long names, descriptions, roles and quotes everywhere. */
  long: (c: Content): Content => ({
    ...c,
    identity: { ...c.identity, name: LONG_NAME, tagline: LONG_TEXT.slice(0, 158) },
    services: c.services.map((s, i) => ({ ...s, name: `${s.name}, the extended appointment with consultation ${i + 1}`, description: LONG_TEXT })),
    products: c.products.map((p) => ({ ...p, name: `${p.name} in the large presentation size with gift packaging`, description: LONG_TEXT, badge: "Limited run" })),
    staff: c.staff.map((m) => ({ ...m, name: `${m.name}-Whitcombe-Hargreaves`, role: "Senior practitioner and head of training and development", bio: `${LONG_TEXT} ${LONG_TEXT}`, credentials: ["A long qualification name that needs to wrap onto more than one line"] })),
    testimonials: c.testimonials.map((t) => ({ ...t, quote: `${t.quote} ${LONG_TEXT}`, author: "A customer with a rather long display name" })),
    faqs: c.faqs.map((f) => ({ ...f, question: `${f.question} ${LONG_TEXT.slice(0, 150)}`, answer: `${LONG_TEXT} ${LONG_TEXT}` })),
    gallery: c.gallery.map((g) => ({ ...g, caption: LONG_TEXT })),
  }),
  /** No photographs, logo or cover anywhere. */
  noImages: (c: Content): Content => ({
    ...c,
    identity: { ...c.identity, logo: undefined, heroImage: undefined },
    products: c.products.map((p) => ({ ...p, image: undefined, images: [] })),
    staff: c.staff.map((m) => ({ ...m, photo: undefined })),
    gallery: [],
    services: c.services.map((s) => ({ ...s, image: undefined })),
  }),
  /** One of everything. */
  one: (c: Content): Content => ({ ...c, services: c.services.slice(0, 1), products: c.products.slice(0, 1), staff: c.staff.slice(0, 1), gallery: c.gallery.slice(0, 1), testimonials: c.testimonials.slice(0, 1), faqs: c.faqs.slice(0, 1) }),
  /** Many of everything. */
  many: (c: Content): Content => ({
    ...c,
    services: clone(c.services, 18, (s, i) => ({ ...s, id: `${s.id}-m${i}`, name: i < c.services.length ? s.name : `${s.name} ${i}`, sortOrder: i })),
    products: clone(c.products, 10, (p, i) => ({ ...p, id: `${p.id}-m${i}`, name: i < c.products.length ? p.name : `${p.name} ${i}` })),
    staff: clone(c.staff, 10, (m, i) => ({ ...m, id: `${m.id}-m${i}`, slug: `${m.slug}-m${i}`, name: i < c.staff.length ? m.name : `${m.name.split(" ")[0]} ${["Hart", "Quill", "Ng", "Abara", "Voss", "Lund", "Okoro"][i % 7]}` })),
    gallery: clone(c.gallery, 12, (g, i) => ({ ...g, id: `${g.id}-m${i}` })),
    testimonials: clone(c.testimonials, 8, (t, i) => ({ ...t, id: `${t.id}-m${i}` })),
    faqs: clone(c.faqs.length ? c.faqs : [{ id: "f", question: "A question?", answer: "An answer." }], 9, (f, i) => ({ ...f, id: `${f.id}-m${i}`, question: `${f.question} (${i + 1})` })),
  }),
  /** Every price mode in one list. */
  prices: (c: Content): Content => ({
    ...c,
    services: [
      { ...c.services[0]!, id: "px1", name: "Fixed price", priceMode: "fixed" as const, priceMinor: 3400, description: "A fixed price." },
      { ...c.services[0]!, id: "px2", name: "Starting price", priceMode: "from" as const, priceMinor: 6000, description: "From a starting price." },
      { ...c.services[0]!, id: "px3", name: "Quote on request", priceMode: "quote" as const, priceMinor: undefined, description: "No number shown." },
      { ...c.services[0]!, id: "px4", name: "Free consultation", priceMode: "free" as const, priceMinor: undefined, description: "Said as it is." },
      { ...c.services[0]!, id: "px5", name: "Contact only", priceMode: "fixed" as const, priceMinor: 9900, bookingMode: "contact" as const, description: "No online booking." },
    ].map((s, i) => ({ ...s, sortOrder: i })),
  }),
  /** A wordmark-shaped logo, to prove wide logos are never cropped like faces. */
  wideLogo: (c: Content): Content => ({ ...c, identity: { ...c.identity, logo: { src: "/logo/taplo-wordmark-black.svg", alt: "A wide wordmark logo", width: 1000, height: 390 } } }),
  /** Online booking switched off, so the booking button falls back to the business's own channels. */
  bookingOff: (c: Content): Content => ({ ...c, booking: { ...c.booking, onlineBookingReady: false } }),
  /** A product list with every status. */
  statuses: (c: Content): Content => ({ ...c, products: c.products.map((p, i) => ({ ...p, availability: (["available", "reserved", "sold", "unavailable"] as const)[i % 4], badge: i === 0 ? "Just in" : p.badge })) }),
}
export const BARBER_BASE = BARBER
export const DEALER_BASE = DEALER
export const TRADES_BASE = TRADES
