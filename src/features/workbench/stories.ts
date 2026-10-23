import type { WidgetType } from "@/features/page/contracts/widgets"
import type { Scenario } from "@/features/showcase/content"
import type { StyleOverrides } from "@/features/page/contracts/style"
import type { PlanId } from "@/features/subscriptions/plans"
import { variants as v, type Content } from "./data"

/**
 * The component workbench. A story is one real shared component in one state: the real page renderer, real example
 * content and the real widget settings, never a replica. `/workbench` renders them at true size; the Playwright
 * spec (`tests/e2e/workbench.spec.ts`) walks every story, plays its interaction, checks accessibility and takes screenshots.
 */
export type Surface = "light" | "dark" | "brand"
export type Step =
  | { click: { role: string; name: string } }
  | { click: { testid: string; nth?: number } }
  | { fill: { label: string; value: string } }
  | { press: string }
export interface WidgetUse { type: WidgetType; settings?: Record<string, unknown> }
export interface Story {
  id: string
  group: string
  title: string
  scenario: Scenario
  content?: (c: Content) => Content
  widgets: WidgetUse[]
  /** Viewport width in CSS px: a phone, a tablet or a laptop. */
  vp: 390 | 768 | 1280
  surface: Surface
  header?: boolean
  /** Appearance choices layered over the surface look (what the owner would have changed). */
  appearance?: StyleOverrides
  plan?: PlanId
  /** Interaction that gets the component into the state being shown (an open dialog, an error). */
  play?: Step[]
  /** What the screenshot should clip to after the interaction. */
  shoot?: "page" | "dialog"
}

/** Look per surface: a light neutral, a dark graphite and a colour-led page, all real starting looks. */
export const SURFACE_LOOK: Record<Surface, string> = { light: "clean", dark: "night", brand: "colour" }

const ABOUT = { title: "About", body: "Four chairs, no rush. We cut hair the way it used to be done: a proper consultation, a hot towel and a finish you can feel. Walk-ins are welcome when there is a free chair." }
const stories: Story[] = []
const add = (s: Omit<Story, "vp" | "surface"> & Partial<Pick<Story, "vp" | "surface">>) => { stories.push({ vp: 390, surface: "light", ...s }) }
const both = (s: Omit<Story, "vp" | "surface" | "id"> & { id: string }) => {
  for (const surface of ["light", "dark"] as const) add({ ...s, id: `${s.id}--${surface}`, title: `${s.title} (${surface})`, surface })
}

// ---- Services and prices
const barber: Scenario = "barber"
both({ id: "price-menu", group: "Services", title: "Price menu", scenario: barber, widgets: [{ type: "priceMenu", settings: { title: "Services" } }] })
add({ id: "price-menu--long", group: "Services", title: "Price menu, long text", scenario: barber, content: v.long, widgets: [{ type: "priceMenu", settings: { title: "Services", showDescriptions: true } }] })
add({ id: "price-menu--one", group: "Services", title: "Price menu, one service", scenario: barber, content: v.one, widgets: [{ type: "priceMenu" }] })
add({ id: "price-menu--many", group: "Services", title: "Price menu, eighteen services", scenario: barber, content: v.many, widgets: [{ type: "priceMenu" }] })
add({ id: "price-menu--modes", group: "Services", title: "Every price wording", scenario: barber, content: v.prices, widgets: [{ type: "priceMenu", settings: { showDescriptions: true } }] })
for (const variant of ["list", "cards", "compact"]) {
  add({ id: `service-list--${variant}`, group: "Services", title: `Service list: ${variant}`, scenario: "trades", widgets: [{ type: "serviceList", settings: { title: "Fixed prices", variant } }] })
}
add({ id: "service-list--long", group: "Services", title: "Service list, long text", scenario: "trades", content: v.long, widgets: [{ type: "serviceList", settings: { variant: "cards" } }] })
add({ id: "service-detail", group: "Services", title: "Service detail", scenario: barber, widgets: [{ type: "serviceList", settings: { variant: "list" } }], play: [{ click: { testid: "service-open" } }], shoot: "dialog" })
add({ id: "featured-service", group: "Services", title: "Featured service", scenario: barber, widgets: [{ type: "featuredService" }] })

// ---- Booking
add({ id: "booking--button", group: "Booking", title: "Booking button", scenario: barber, widgets: [{ type: "booking", settings: { label: "Book your chair", variant: "button" } }] })
add({ id: "booking--card", group: "Booking", title: "Booking card", scenario: barber, widgets: [{ type: "booking", settings: { label: "Book your chair", variant: "card" } }] })
add({ id: "booking--service", group: "Booking", title: "Booking journey: choose a service", scenario: barber, widgets: [{ type: "booking", settings: { label: "Book your chair" } }], play: [{ click: { role: "button", name: "Book your chair" } }], shoot: "dialog" })
add({ id: "booking--service-desktop", group: "Booking", title: "Booking journey on a laptop", scenario: barber, vp: 1280, widgets: [{ type: "booking", settings: { label: "Book your chair" } }], play: [{ click: { role: "button", name: "Book your chair" } }], shoot: "dialog" })
add({ id: "booking--unavailable", group: "Booking", title: "Online booking off: falls back to the business's own channels", scenario: barber, content: v.bookingOff, widgets: [{ type: "booking", settings: { label: "Book your chair" } }], play: [{ click: { role: "button", name: "Book your chair" } }], shoot: "dialog" })
add({ id: "enquiry--inline", group: "Forms", title: "Contact form", scenario: "trades", widgets: [{ type: "enquiry", settings: { title: "Send us a message", variant: "inline" } }] })
add({ id: "enquiry--errors", group: "Forms", title: "Contact form: validation", scenario: "trades", widgets: [{ type: "enquiry", settings: { title: "Send us a message", variant: "inline" } }], play: [{ click: { role: "button", name: "Send message" } }] })
add({ id: "enquiry--sent", group: "Forms", title: "Contact form: sent", scenario: "trades", widgets: [{ type: "enquiry", settings: { title: "Send us a message", variant: "inline" } }], play: [{ fill: { label: "Your name", value: "Ruth" } }, { fill: { label: "Phone (optional)", value: "07700 900123" } }, { fill: { label: "Your message", value: "My boiler is leaking. Can you come tomorrow?" } }, { click: { role: "button", name: "Send message" } }] })
add({ id: "enquiry--button", group: "Forms", title: "Contact button opens a dialog", scenario: "dealer", widgets: [{ type: "enquiry", settings: { title: "Ask about a car", buttonLabel: "Ask about a car", variant: "button" } }], play: [{ click: { role: "button", name: "Ask about a car" } }], shoot: "dialog" })

// ---- Products, vehicles
for (const variant of ["grid", "list", "swipe"]) {
  both({ id: `products--${variant}`, group: "Products", title: `Products: ${variant}`, scenario: barber, widgets: [{ type: "products", settings: { title: "From the shop", variant } }] })
}
add({ id: "products--one", group: "Products", title: "One product", scenario: barber, content: v.one, widgets: [{ type: "products", settings: { variant: "swipe" } }] })
add({ id: "products--many", group: "Products", title: "Ten products", scenario: barber, content: v.many, widgets: [{ type: "products", settings: { variant: "swipe" } }] })
add({ id: "products--long", group: "Products", title: "Products, long text", scenario: barber, content: v.long, widgets: [{ type: "products", settings: { variant: "grid" } }] })
add({ id: "products--no-images", group: "Products", title: "Products without pictures", scenario: barber, content: v.noImages, widgets: [{ type: "products", settings: { variant: "grid" } }] })
add({ id: "products--detail-affiliate", group: "Products", title: "Affiliate product detail", scenario: barber, widgets: [{ type: "products", settings: { variant: "swipe" } }], play: [{ click: { testid: "product-open", nth: 1 } }], shoot: "dialog" })
for (const variant of ["list", "swipe"]) {
  add({ id: `vehicles--${variant}`, group: "Vehicles", title: `Vehicles: ${variant}`, scenario: "dealer", widgets: [{ type: "products", settings: { title: "In stock", variant } }] })
}
add({ id: "vehicles--statuses", group: "Vehicles", title: "Vehicle statuses", scenario: "dealer", content: v.statuses, widgets: [{ type: "products", settings: { variant: "list" } }] })
add({ id: "vehicles--desktop", group: "Vehicles", title: "Vehicles on a laptop", scenario: "dealer", vp: 1280, widgets: [{ type: "products", settings: { variant: "list" } }] })
add({ id: "vehicles--detail", group: "Vehicles", title: "Vehicle detail", scenario: "dealer", widgets: [{ type: "products", settings: { variant: "list" } }], play: [{ click: { testid: "product-open", nth: 0 } }], shoot: "dialog" })

// ---- Team
for (const variant of ["list", "swipe", "grid", "avatars"]) {
  both({ id: `team--${variant}`, group: "Team", title: `Team: ${variant}`, scenario: "gym", widgets: [{ type: "team", settings: { title: "Your coaches", variant } }] })
}
add({ id: "team--one", group: "Team", title: "One person", scenario: "gym", content: v.one, widgets: [{ type: "team", settings: { variant: "grid" } }] })
add({ id: "team--many", group: "Team", title: "Ten people", scenario: "gym", content: v.many, widgets: [{ type: "team", settings: { variant: "swipe" } }] })
add({ id: "team--long", group: "Team", title: "Team, long text", scenario: "gym", content: v.long, widgets: [{ type: "team", settings: { variant: "swipe" } }] })
add({ id: "team--grid-desktop", group: "Team", title: "Team grid on a laptop", scenario: "physio", vp: 1280, widgets: [{ type: "team", settings: { variant: "grid" } }] })
add({ id: "team--profile", group: "Team", title: "Team profile", scenario: "gym", widgets: [{ type: "team", settings: { variant: "swipe" } }], play: [{ click: { testid: "team-card", nth: 0 } }], shoot: "dialog" })

// ---- Gallery and reviews
for (const variant of ["grid", "carousel"]) {
  both({ id: `gallery--${variant}`, group: "Gallery", title: `Gallery: ${variant}`, scenario: barber, widgets: [{ type: "gallery", settings: { title: "Inside", variant } }] })
}
add({ id: "gallery--one", group: "Gallery", title: "One photo", scenario: barber, content: v.one, widgets: [{ type: "gallery", settings: { variant: "grid" } }] })
add({ id: "gallery--many", group: "Gallery", title: "Twelve photos", scenario: barber, content: v.many, widgets: [{ type: "gallery", settings: { variant: "grid" } }] })
add({ id: "gallery--lightbox", group: "Gallery", title: "Lightbox", scenario: barber, widgets: [{ type: "gallery", settings: { variant: "grid" } }], play: [{ click: { testid: "gallery-open", nth: 0 } }], shoot: "dialog" })
for (const variant of ["cards", "quote", "compact", "swipe"]) {
  add({ id: `reviews--${variant}`, group: "Reviews", title: `Reviews: ${variant}`, scenario: "trades", widgets: [{ type: "reviews", settings: { title: "What customers say", variant } }] })
}
add({ id: "reviews--long", group: "Reviews", title: "Reviews, long quotes", scenario: "trades", content: v.long, widgets: [{ type: "reviews", settings: { variant: "cards" } }] })
add({ id: "reviews--one-dark", group: "Reviews", title: "One review (dark)", scenario: "trades", surface: "dark", content: v.one, widgets: [{ type: "reviews", settings: { variant: "quote" } }] })

// ---- Hours, place, questions, sharing, links
for (const variant of ["list", "compact"]) both({ id: `hours--${variant}`, group: "Hours and place", title: `Opening hours: ${variant}`, scenario: "cafe", widgets: [{ type: "hours", settings: { variant } }] })
add({ id: "location--premises", group: "Hours and place", title: "Location", scenario: barber, widgets: [{ type: "location", settings: { title: "Find us" } }] })
add({ id: "location--area", group: "Hours and place", title: "Service area", scenario: "trades", widgets: [{ type: "serviceArea", settings: { title: "Where we work" } }] })
both({ id: "faq", group: "Questions", title: "Questions", scenario: "physio", widgets: [{ type: "faq", settings: { title: "Before you book" } }] })
add({ id: "faq--long", group: "Questions", title: "Questions, long text", scenario: "physio", content: v.long, widgets: [{ type: "faq" }] })
add({ id: "faq--many", group: "Questions", title: "Nine questions", scenario: "physio", content: v.many, widgets: [{ type: "faq" }] })
add({ id: "share--button", group: "Sharing", title: "Share button", scenario: barber, widgets: [{ type: "share", settings: { label: "Share Marlowe & Finch", variant: "button" } }] })
add({ id: "share--card", group: "Sharing", title: "Share card", scenario: barber, widgets: [{ type: "share", settings: { label: "Share Marlowe & Finch", variant: "card" } }] })
add({ id: "share--panel", group: "Sharing", title: "Share panel", scenario: barber, widgets: [{ type: "share", settings: { label: "Share Marlowe & Finch", variant: "button" } }], play: [{ click: { role: "button", name: "Share Marlowe & Finch" } }], shoot: "dialog" })
add({ id: "share--panel-desktop", group: "Sharing", title: "Share panel on a laptop", scenario: barber, vp: 1280, widgets: [{ type: "share", settings: { label: "Share Marlowe & Finch", variant: "button" } }], play: [{ click: { role: "button", name: "Share Marlowe & Finch" } }], shoot: "dialog" })
for (const variant of ["button", "card", "compact"]) add({ id: `contact--${variant}`, group: "Links", title: `Call, WhatsApp, email and directions: ${variant}`, scenario: "dealer", widgets: [{ type: "call", settings: { variant } }, { type: "whatsapp", settings: { variant } }, { type: "email", settings: { variant } }, { type: "directions", settings: { variant } }] })
add({ id: "social--icons", group: "Links", title: "Social: icons", scenario: barber, widgets: [{ type: "social", settings: { variant: "icons" } }] })
add({ id: "social--list", group: "Links", title: "Social: list", scenario: barber, widgets: [{ type: "social", settings: { variant: "list" } }] })
add({ id: "credentials--chips", group: "Text", title: "Credentials", scenario: "tutor", widgets: [{ type: "credentials", settings: { title: "Experience", variant: "chips" } }] })
add({ id: "text--about", group: "Text", title: "Text", scenario: barber, widgets: [{ type: "text", settings: ABOUT }] })

export const STORIES: Story[] = stories
export const storyById = (id: string) => STORIES.find((s) => s.id === id)
export const GROUPS = [...new Set(STORIES.map((s) => s.group))]

// ---- Profile header arrangements
const layouts = [["side", "Compact identity"], ["cover", "Cover"], ["poster", "Image hero"], ["centered", "Text-led"]] as const
for (const [layout, name] of layouts) {
  for (const surface of ["light", "dark"] as const) {
    add({ id: `header--${layout}--photo--${surface}`, group: "Header", title: `${name}, with a photo (${surface})`, scenario: "barber", surface, header: true, appearance: { header: { layout } }, widgets: [{ type: "text", settings: ABOUT }] })
  }
  add({ id: `header--${layout}--no-photo`, group: "Header", title: `${name}, no photo or logo`, scenario: "barber", content: v.noImages, header: true, appearance: { header: { layout } }, widgets: [{ type: "text", settings: ABOUT }] })
  add({ id: `header--${layout}--wide-logo`, group: "Header", title: `${name}, wide logo`, scenario: "barber", content: v.wideLogo, header: true, appearance: { header: { layout } }, widgets: [{ type: "text", settings: ABOUT }] })
  add({ id: `header--${layout}--long`, group: "Header", title: `${name}, long name and tagline`, scenario: "barber", content: v.long, header: true, appearance: { header: { layout } }, widgets: [{ type: "text", settings: ABOUT }] })
}
for (const scrim of ["soft", "medium", "strong"] as const) {
  add({ id: `header--poster--fade-${scrim}`, group: "Header", title: `Image hero, ${scrim} fade`, scenario: "barber", header: true, appearance: { header: { layout: "poster", scrim } }, widgets: [{ type: "text", settings: ABOUT }] })
}
add({ id: "header--poster--desktop", group: "Header", title: "Image hero on a laptop", scenario: "barber", vp: 1280, header: true, appearance: { header: { layout: "poster" } }, widgets: [{ type: "priceMenu" }] })
add({ id: "header--cover--desktop", group: "Header", title: "Cover on a laptop", scenario: "barber", vp: 1280, header: true, appearance: { header: { layout: "cover" } }, widgets: [{ type: "priceMenu" }] })
