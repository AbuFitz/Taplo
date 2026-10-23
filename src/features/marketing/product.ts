/**
 * Product pages. Every claim here is checked against docs/messaging.md ("Supported now").
 * `status` is shown on each page so what works today and what needs a connection are never blurred.
 */
import { featureNote, featureState, type FeatureId } from "@/lib/feature-status"
export type Status = { label: string; state: "works" | "needs"; note?: string; /** When set, state and note come from the central feature-status list. */ feature?: FeatureId }

export interface ProductPage {
  slug: "design" | "services" | "enquiries" | "booking" | "team" | "products" | "vehicles" | "gallery-reviews" | "sharing" | "messages"
  label: string
  eyebrow: string
  title: string
  lead: string
  status: Status[]
  related: ProductPage["slug"][]
}

export const PRODUCT_PAGES: ProductPage[] = [
  {
    slug: "design", label: "Looks and design", eyebrow: "Looks and design",
    title: "Nine starting looks. Every one of them changeable.",
    lead: "A look sets colours, type, header, buttons, cards and wallpaper in one go. Then each of those is yours to change, for the whole page or for one section.",
    status: [
      { label: "Nine starting looks, none tied to an industry", state: "works" },
      { label: "Colours, fonts, header, buttons, cards, wallpaper", state: "works" },
      { label: "Changes to one section, with a reset", state: "works" },
      { label: "Text that stays readable", state: "works", note: "Taplo adjusts unreadable colours and tells you." },
      { label: "Switching looks on the Free plan", state: "needs", note: "Free keeps the look chosen for your kind of business. Paid plans switch freely." },
    ],
    related: ["services", "sharing", "team"],
  },
  {
    slug: "services", label: "Services and prices", eyebrow: "Services and prices",
    title: "Prices people can read in a glance.",
    lead: "List what you do with a price, a duration and a description. Group it, show it as a menu or as cards, and let a tap open the detail.",
    status: [
      { label: "Fixed, from, quote and free pricing, worded exactly", state: "works" },
      { label: "Grouped price menus, lists and cards", state: "works" },
      { label: "A detail view for every service", state: "works" },
      { label: "Services you can list on the Free plan", state: "needs", note: "Free allows three. Paid plans are unlimited." },
    ],
    related: ["booking", "enquiries", "design"],
  },
  {
    slug: "enquiries", label: "Contact and enquiries", eyebrow: "Contact and enquiries",
    title: "A message that cannot be mistaken for a booking.",
    lead: "Call, WhatsApp, email and a contact form. A message says plainly that nothing is reserved, and keeps what was typed if something goes wrong.",
    status: [
      { label: "Call, WhatsApp, email and directions buttons", state: "works" },
      { label: "A contact form with validation and clear confirmation", state: "works" },
      { label: "Every enquiry kept for the owner", state: "works", feature: "enquiryInbox" },
      { label: "Each enquiry also emailed to the owner", state: "needs", feature: "enquiryEmail" },
    ],
    related: ["booking", "services", "sharing"],
  },
  {
    slug: "booking", label: "Booking", eyebrow: "Booking",
    title: "Service, person, time, details. Done.",
    lead: "Customers choose what they want, who with, and when. The journey says whether the time is confirmed, only requested, or just an enquiry, and means it.",
    status: [
      { label: "Service, person, date and time, details, review, result", state: "works" },
      { label: "Working hours, breaks, leave, buffers, notice and booking window", state: "works" },
      { label: "Business time zone and clock changes", state: "works" },
      { label: "Owner calendar: agenda, day, week, month, blocked time", state: "works" },
      { label: "Server-checked booking with no double-booking", state: "needs", note: "Written and tested on Postgres. Needs a connected database to run live. In preview, bookings stay in this browser." },
      { label: "Email or text confirmations", state: "needs", note: "Needs an email or text provider. None is sent." },
      { label: "Deposits and payment", state: "needs", note: "Needs a payment provider. Nothing is charged." },
    ],
    related: ["team", "services", "enquiries"],
  },
  {
    slug: "team", label: "Team profiles", eyebrow: "Team profiles",
    title: "Introduce the people. Book with them.",
    lead: "A compact card for each person, a fuller profile when opened, and a booking that only offers the services they actually do.",
    status: [
      { label: "Swipe, grid, list and avatar layouts", state: "works" },
      { label: "Profiles with services, working days and qualifications you supply", state: "works" },
      { label: "No private contact details shown", state: "works" },
      { label: "Customers choosing a person when booking", state: "needs", note: "Needs the Business plan." },
    ],
    related: ["booking", "gallery-reviews", "design"],
  },
  {
    slug: "products", label: "Products and links", eyebrow: "Products and links",
    title: "Your products, or the ones you recommend.",
    lead: "Photos, a price and the facts that matter. Each product leads to an enquiry or to a shop you already use, and affiliate links say so.",
    status: [
      { label: "Products with photos, facts and a clear status", state: "works" },
      { label: "Enquire, or open your own shop in a new tab", state: "works" },
      { label: "Affiliate links disclosed to the visitor", state: "works" },
      { label: "Checkout and payment on Taplo", state: "needs", note: "Not connected. A payment provider is needed, so there is no pretend buy button." },
    ],
    related: ["vehicles", "enquiries", "gallery-reviews"],
  },
  {
    slug: "vehicles", label: "Vehicle stock", eyebrow: "Vehicle stock",
    title: "Every car on the forecourt, with its specifications.",
    lead: "Photos, price and the facts buyers ask first: year, mileage, fuel, gearbox. Mark a car reserved or sold and it stays on the page, honestly.",
    status: [
      { label: "Vehicle cards with specifications and a detail view", state: "works" },
      { label: "Available, reserved and sold shown honestly", state: "works" },
      { label: "Viewings and valuations as services", state: "works" },
      { label: "Live stock feeds and finance checks", state: "needs", note: "Not connected. Stock is entered by hand." },
    ],
    related: ["products", "booking", "gallery-reviews"],
  },
  {
    slug: "gallery-reviews", label: "Photos and reviews", eyebrow: "Photos and reviews",
    title: "A lightbox that works, and words with their source.",
    lead: "Photos open large, with arrows, zoom and the keyboard. Reviews always say where the words came from, and Taplo never makes one up.",
    status: [
      { label: "Photo grid and swipe rows, with a full-screen viewer", state: "works" },
      { label: "Quotes shown with who supplied them", state: "works" },
      { label: "Review links to Google, Facebook and Trustpilot", state: "works" },
      { label: "Photos and review links on the Free plan", state: "needs", note: "Free has neither. Paid plans do." },
    ],
    related: ["team", "products", "sharing"],
  },
  {
    slug: "sharing", label: "Sharing and QR codes", eyebrow: "Sharing and QR codes",
    title: "One link, and a code for the counter.",
    lead: "Copy the link, download a Taplo QR code, make a share image, or send it from your phone.",
    status: [
      { label: "A Taplo QR code with the Taplo mark in the middle, as PNG for screens, PNG for print and SVG", state: "works" },
      { label: "A share image with your name, your logo and the code", state: "works" },
      { label: "Share from a phone with the system share sheet", state: "works" },
      { label: "A public address for every page", state: "needs", feature: "publicLinks" },
      { label: "Exact link previews in social apps", state: "needs", note: "Apps decide this and cache it. Taplo cannot guarantee it." },
    ],
    related: ["design", "enquiries", "gallery-reviews"],
  },
  {
    slug: "messages", label: "Messages and reminders", eyebrow: "Messages and reminders",
    title: "Five kinds of message, each one called what it is.",
    lead: "Opening a customer’s text app, sending an enquiry, confirming an appointment, reminding them, and telling opted-in customers about an offer are different things. Taplo keeps them apart.",
    status: [
      { label: "Text us: opens the customer’s own messages app with the words ready", state: "works", feature: "textApp" },
      { label: "A contact form that keeps each enquiry for the owner", state: "works", feature: "enquiryInbox" },
      { label: "Appointment confirmations, changes and cancellations", state: "needs", feature: "appointmentMessages" },
      { label: "Reminders before an appointment", state: "needs", feature: "reminders" },
      { label: "Offers to customers who have opted in", state: "needs", feature: "promotions" },
    ],
    related: ["enquiries", "booking", "sharing"],
  },
]

/** A product page's status lines with anything tied to a feature resolved from the central list. */
export function resolveStatus(list: Status[]): Status[] {
  return list.map((x) => (x.feature ? { ...x, state: featureState(x.feature), note: featureState(x.feature) === "needs" ? featureNote(x.feature) : x.note } : x))
}

export const pageBySlug = (slug: string) => PRODUCT_PAGES.find((p) => p.slug === slug)
