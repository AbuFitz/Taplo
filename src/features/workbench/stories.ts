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
export interface WidgetUse { type: WidgetType; settings?: Record<string, unknown>; /** Real local fixture resolved against this request's origin. */ assetPath?: string }
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
  /** Reproducible expiry fixtures; never changes a merchant's clock. */
  now?: string
  /** Cases where the correct public result is to hide the section. */
  expectedState?: "empty" | "locked"
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
for (const variant of ["grid", "list", "swipe", "catalogue"]) {
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
both({ id: "vehicles--catalogue", group: "Vehicles", title: "Large vehicle cards", scenario: "brookfield", widgets: [{ type: "products", settings: { title: "Current stock", variant: "catalogue" } }] })
add({ id: "vehicles--catalogue-desktop", group: "Vehicles", title: "Large stock cards on desktop", scenario: "brookfield", vp: 1280, widgets: [{ type: "products", settings: { title: "Current stock", variant: "catalogue" } }] })
add({ id: "vehicles--catalogue-one", group: "Vehicles", title: "One large vehicle card", scenario: "brookfield", widgets: [{ type: "products", settings: { variant: "catalogue", productIds: ["am-golf"] } }] })
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
for (const variant of ["cards", "compact"]) {
  both({ id: `reviews--${variant}`, group: "Reviews", title: `Google reviews: ${variant}`, scenario: "trades", content: c => ({ ...c, reviewLinks: [{ platform: "google", url: "https://www.google.com/maps" }] }), widgets: [{ type: "reviews", settings: { title: "Google reviews", variant } }] })
}
add({ id: "reviews--legacy-only", group: "Reviews", title: "Legacy quotes and ratings are not Google reviews", scenario: "trades", content: c => ({ ...c, reviewLinks: [] }), widgets: [{ type: "reviews" }], expectedState: "empty" })

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

// ---- Profile header arrangements
const layouts = [["side", "Compact identity"], ["cover", "Cover"], ["feature", "Wide feature"], ["poster", "Image hero"], ["centered", "Text-led"]] as const
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
add({ id: "header--feature--desktop", group: "Header", title: "Wide feature on a laptop", scenario: "oakfield", vp: 1280, header: true, appearance: { header: { layout: "feature" } }, widgets: [{ type: "serviceList" }] })

// ---- Previously uncovered types: real content, safe destinations and actual unavailable states.
both({ id: "sms", group: "Links", title: "Text-message action", scenario: "station", content: c => ({ ...c, contacts: { ...c.contacts, phone: "07700 900123" } }), widgets: [{ type: "sms", settings: { label: "Text the shop", variant: "card", subtitle: "Opens your own messaging app" } }] })
both({ id: "link", group: "Links", title: "Custom link", scenario: "corner", widgets: [{ type: "link", settings: { label: "See this design", variant: "card", subtitle: "The actual cafe example" }, assetPath: "/inspiration/corner-table-cafe" }] })
both({ id: "document", group: "Downloads", title: "Real printable cafe menu", scenario: "corner", widgets: [{ type: "document", settings: { title: "No. 6 Coffee menu", description: "A real one-page PDF with the example's actual prices" }, assetPath: "/workbench/corner-table-menu.pdf" }] })
for (const shape of ["rounded", "square", "wide"] as const) add({ id: `image--${shape}`, group: "Media", title: `Single image: ${shape}`, scenario: "corner", widgets: [{ type: "image", settings: { image: { src: "/taplo-demo/corner-table-cafe.png", alt: "Illustrative coffee and breakfast at No. 6 Coffee", width: 1536, height: 1024 }, shape, caption: "A fictional cafe, using original illustrative artwork." } }] })
add({ id: "image--empty", group: "Media", title: "No picture selected: hidden", scenario: "corner", widgets: [{ type: "image" }], expectedState: "empty" })
both({ id: "video", group: "Media", title: "Video: provider loads only after Play", scenario: "corner", widgets: [{ type: "video", settings: { title: "Open movie provider example", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" } }] })
add({ id: "video--unsupported", group: "Media", title: "Unsupported video link: hidden", scenario: "corner", widgets: [{ type: "video", settings: { title: "Unsupported link", url: "https://example.com/video" } }], expectedState: "empty" })
both({ id: "leave-review", group: "Reviews", title: "Owner-supplied review destination", scenario: "corner", content: c => ({ ...c, reviewLinks: [{ platform: "google", url: "https://www.google.com/maps" }] }), widgets: [{ type: "leaveReview", settings: { label: "Example review link" } }] })
add({ id: "leave-review--empty", group: "Reviews", title: "No review destination: hidden", scenario: "corner", content: c => ({ ...c, reviewLinks: [] }), widgets: [{ type: "leaveReview" }], expectedState: "empty" })
const dated = "2026-10-24T12:00:00Z"
const offerContent = (c: Content): Content => ({ ...c, offers: [{ id: "wb-offer", title: "Coffee at the counter", description: "An illustrative notice supplied by the fictional cafe.", endsAt: "2026-10-25", archived: false }] })
both({ id: "offers", group: "Offers", title: "Active offer at the fixture date", scenario: "corner", now: dated, content: offerContent, widgets: [{ type: "offers", settings: { title: "At the counter" } }] })
add({ id: "offers--expired", group: "Offers", title: "Expired offer: hidden", scenario: "corner", now: "2026-10-26T12:00:00Z", content: offerContent, widgets: [{ type: "offers" }], expectedState: "empty" })
add({ id: "offers--missing-selection", group: "Offers", title: "Selected offer removed: hidden", scenario: "corner", now: dated, content: offerContent, widgets: [{ type: "offers", settings: { offerIds: ["removed"] } }], expectedState: "empty" })
for (const tone of ["info", "promo", "warning"] as const) add({ id: `announcement--${tone}`, group: "Notices", title: `Announcement: ${tone}`, scenario: "corner", now: dated, widgets: [{ type: "announcement", settings: { text: "Illustrative notice: the kitchen finishes half an hour before the counter.", tone, endsAt: "2026-10-25" } }] })
add({ id: "announcement--expired", group: "Notices", title: "Expired announcement: hidden", scenario: "corner", now: "2026-10-26T12:00:00Z", widgets: [{ type: "announcement", settings: { text: "This past notice must not appear.", endsAt: "2026-10-25" } }], expectedState: "empty" })
add({ id: "payment--not-connected", group: "Availability", title: "Unconnected payments: hidden", scenario: "station", widgets: [{ type: "payment" }], expectedState: "locked" })
add({ id: "payment--plan", group: "Availability", title: "Plan excludes payments: hidden", scenario: "station", plan: "free", widgets: [{ type: "payment" }], expectedState: "locked" })

// A selected record can be removed without removing other records. No empty panel or silent substitute.
for (const [type, key, scenario] of [
  ["priceMenu", "serviceIds", "station"], ["products", "productIds", "brookfield"],
  ["team", "staffIds", "station"], ["gallery", "itemIds", "station"],
  ["faq", "faqIds", "oakfield"],
  ["social", "platforms", "barber"],
] as const) add({ id: `${type}--missing-selection`, group: "Availability", title: `${type}: selected records no longer available`, scenario, widgets: [{ type, settings: { [key]: ["removed"] } }], expectedState: "empty" })
add({ id: "featured-service--missing-selection", group: "Availability", title: "Featured service removed: no silent replacement", scenario: "station", widgets: [{ type: "featuredService", settings: { serviceId: "removed" } }], expectedState: "empty" })

add({ id: "header--minimal--saved", group: "Header", title: "Earlier saved minimal header", scenario: "station", header: true, appearance: { header: { layout: "minimal" } }, widgets: [{ type: "priceMenu" }] })

export const STORIES: Story[] = stories
export const storyById = (id: string) => STORIES.find(s => s.id === id)
export const GROUPS = [...new Set(STORIES.map(s => s.group))]
