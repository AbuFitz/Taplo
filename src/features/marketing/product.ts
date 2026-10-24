/**
 * Product pages. Every claim here is checked against docs/messaging.md ("Supported now").
 * `status` is shown on each page so what works today and what needs a connection are never blurred.
 */
import { LOOKS } from "@/features/page/themes/looks"
import { featureNote, featureState, type FeatureId } from "@/lib/feature-status"
export type Status = { label: string; state: "works" | "needs"; requirement?: "connection" | "plan" | "platform"; note?: string; /** When set, state and note come from the central feature-status list. */ feature?: FeatureId }

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
    title: "A page that feels like your business.",
    lead: "Start with a look you like. Bring your own photos, choose your colours and make the layout work for what you do. See every choice on your page as you go.",
    status: [
      { label: `${LOOKS.length} starting looks, each usable for any business`, state: "works" },
      { label: "Colours, fonts, header, buttons, cards, wallpaper", state: "works" },
      { label: "Changes to one section, with a reset", state: "works" },
      { label: "Contrast suggestions while you choose colours", state: "works", note: "The editor helps you spot low-contrast combinations and suggests a readable option." },
      { label: "Switching to another starting look", state: "needs", requirement: "plan", note: "Free keeps the look chosen for your kind of business. Paid plans switch freely." },
    ],
    related: ["services", "sharing", "team"],
  },
  {
    slug: "services", label: "Services and prices", eyebrow: "Services and prices",
    title: "Good work. Clear prices.",
    lead: "Put what you offer in one useful place. A quick price list, a menu with the detail, or packages people can compare before they get in touch.",
    status: [
      { label: "Fixed, from, quote and free pricing, worded exactly", state: "works" },
      { label: "Grouped price menus, lists and cards", state: "works" },
      { label: "A detail view for every service", state: "works" },
      { label: "Three services on Free; unlimited on paid plans", state: "works" },
    ],
    related: ["booking", "enquiries", "design"],
  },
  {
    slug: "enquiries", label: "Contact and enquiries", eyebrow: "Contact and enquiries",
    title: "Make it easy to ask.",
    lead: "A question about a car. A quote for a job. A first hello. Give customers a clear way to reach you, with the right details attached.",
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
    title: "Less back and forth. More booked in.",
    lead: "Let customers choose a service, a person and a time. Take the booking straight away or agree the request first — whichever fits the way you work.",
    status: [
      { label: "Service, person, date and time, details, review, result", state: "works" },
      { label: "Working hours, breaks, leave, buffers, notice and booking window", state: "works" },
      { label: "Business time zone and clock changes", state: "works" },
      { label: "Owner calendar: agenda, day, week, month, blocked time", state: "works" },
      { label: "Bookings kept in sync across devices", state: "needs", note: "Needs the live booking service. Preview bookings stay in this browser until it is connected." },
      { label: "Email or text confirmations", state: "needs", note: "Needs an email or text provider. None is sent." },
      { label: "Deposits and payment", state: "needs", note: "Needs a payment provider. Nothing is charged." },
    ],
    related: ["team", "services", "enquiries"],
  },
  {
    slug: "team", label: "Team profiles", eyebrow: "Team profiles",
    title: "Put a face to the good work.",
    lead: "Introduce your people with a photo, a little about them and the services they offer. Let customers find someone they feel comfortable booking with.",
    status: [
      { label: "Swipe, grid, list and avatar layouts", state: "works" },
      { label: "Profiles with services, working days and qualifications you supply", state: "works" },
      { label: "Private staff contact details stay private", state: "works" },
      { label: "Customers choosing a person when booking", state: "needs", requirement: "plan", note: "Needs the Business plan." },
    ],
    related: ["booking", "gallery-reviews", "design"],
  },
  {
    slug: "products", label: "Products and links", eyebrow: "Products and links",
    title: "From your shop to their shortlist.",
    lead: "Show the things you sell with good photos, clear prices and useful details. Take an enquiry, link to your own shop or share a recommendation.",
    status: [
      { label: "Products with photos, facts and a clear status", state: "works" },
      { label: "Enquire, or open your own shop in a new tab", state: "works" },
      { label: "Affiliate links disclosed to the visitor", state: "works" },
      { label: "Checkout and payment on Taplo", state: "needs", note: "Needs a connected payment provider. Nothing is charged in the preview." },
    ],
    related: ["vehicles", "enquiries", "gallery-reviews"],
  },
  {
    slug: "vehicles", label: "Vehicle stock", eyebrow: "Vehicle stock",
    title: "A proper home for your stock.",
    lead: "Give every car room to be seen. Big photos, the facts buyers ask for and a clear way to arrange a viewing. Keep available, reserved and sold stock easy to recognise.",
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
    title: "Let your work do the talking.",
    lead: "A good picture deserves more than a tiny thumbnail. Show your space, your people and your work, alongside customer words with a clear source.",
    status: [
      { label: "Photo grid and swipe rows, with a full-screen viewer", state: "works" },
      { label: "Quotes shown with who supplied them", state: "works" },
      { label: "Review links to Google, Facebook and Trustpilot", state: "works" },
      { label: "Photos and review links", state: "needs", requirement: "plan", note: "Free has neither. Paid plans do." },
    ],
    related: ["team", "products", "sharing"],
  },
  {
    slug: "sharing", label: "Sharing and QR codes", eyebrow: "Sharing and QR codes",
    title: "Found here. Shared everywhere.",
    lead: "Your bio, your counter, your next message. Carry the same page wherever customers find you, with a link, a branded QR code and a share card of your own.",
    status: [
      { label: "A Taplo QR code with the Taplo mark in the middle, as PNG for screens, PNG for print and SVG", state: "works" },
      { label: "A share image with your name, your logo and the code", state: "works" },
      { label: "Share from a phone with the system share sheet", state: "works" },
      { label: "A public address for every page", state: "needs", feature: "publicLinks" },
      { label: "Exact link previews in social apps", state: "needs", requirement: "platform", note: "Apps decide this and cache it. Taplo cannot guarantee it." },
    ],
    related: ["design", "enquiries", "gallery-reviews"],
  },
  {
    slug: "messages", label: "Messages and reminders", eyebrow: "Messages and reminders",
    title: "Keep the conversation moving.",
    lead: "Make it easy to ask a question now. Bring confirmations, reminders and opted-in offers into the same customer journey when your messaging service is connected.",
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
