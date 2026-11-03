/**
 * Marketing information architecture: the one place that decides what the navigation, footer and index pages link to.
 * Every destination here is a real page. Add a page, then add it here.
 */
export interface NavLink { href: string; label: string; blurb: string }
export interface NavGroup { title: string; links: NavLink[] }

export const PRODUCT_GROUPS: NavGroup[] = [
  {
    title: "Build your page",
    links: [
      { href: "/product/design", label: "Looks and design", blurb: "Choose a design and make it your own." },
      { href: "/product/services", label: "Services and prices", blurb: "Price menus people can read at a glance." },
      { href: "/product/enquiries", label: "Contact and enquiries", blurb: "A clear way to ask a question or request a time." },
      { href: "/product/messages", label: "Messages and reminders", blurb: "Manage appointment confirmations and reminders." },
    ],
  },
  {
    title: "Take bookings",
    links: [
      { href: "/product/booking", label: "Booking", blurb: "Pick a service, a person and a time." },
      { href: "/product/team", label: "Team profiles", blurb: "Introduce your team and their services." },
    ],
  },
  {
    title: "Show what you offer",
    links: [
      { href: "/product/products", label: "Products and links", blurb: "Your products, or ones you recommend." },
      { href: "/product/vehicles", label: "Vehicle stock", blurb: "Vehicle photos, specifications and availability." },
      { href: "/product/gallery-reviews", label: "Photos and reviews", blurb: "Show your work and link to customer reviews." },
    ],
  },
  {
    title: "Share it",
    links: [{ href: "/product/sharing", label: "Sharing and QR codes", blurb: "Share your page with a link or QR code." }],
  },
]

export const INDUSTRY_FILTERS = [
  { id: "portfolios", label: "Portfolios and creatives" },
  { id: "entrepreneurs", label: "Founders and independents" },
  { id: "makers", label: "Makers and shops" },
  { id: "beauty", label: "Barbers and salons" },
  { id: "health", label: "Clinics and practitioners" },
  { id: "food", label: "Cafés and food" },
  { id: "learning", label: "Tutors and teachers" },
  { id: "fitness", label: "Fitness and studios" },
  { id: "trades", label: "Trades and home services" },
  { id: "motoring", label: "Car dealers and garages" },
] as const
export type IndustryId = (typeof INDUSTRY_FILTERS)[number]["id"]

export const PRODUCT_LINKS = PRODUCT_GROUPS.flatMap((g) => g.links)
