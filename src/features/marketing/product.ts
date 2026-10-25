/**
 * Product pages. Every claim here is checked against docs/messaging.md ("Supported now").
 * Capability records remain separate from the public marketing copy.
 */
import { CURRENT_LOOKS } from "@/features/page/themes/looks"
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
    title: "Make it your own.",
    lead: "Choose a design, add your logo and adjust the colours, fonts and layout. Preview your changes as you edit.",
    status: [
      { label: `${CURRENT_LOOKS.length} starting looks, each usable for any business`, state: "works" },
      { label: "Colours, fonts, header, buttons, cards, wallpaper", state: "works" },
      { label: "Changes to one section, with a reset", state: "works" },
      { label: "Contrast suggestions while you choose colours", state: "works", note: "The editor helps you spot low-contrast combinations and suggests a readable option." },
      { label: "Switching to another starting look", state: "needs", requirement: "plan", note: "Free keeps the look chosen for your kind of business. Paid plans switch freely." },
    ],
    related: ["services", "sharing", "team"],
  },
  {
    slug: "services", label: "Services and prices", eyebrow: "Services and prices",
    title: "Show what you offer.",
    lead: "List your services, explain what’s included and show your prices. Customers can open each service to find out more or book.",
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
    lead: "Let customers call, message or send an enquiry from your page. Questions about a service or product include the item they’re asking about.",
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
    title: "Let customers book from your page.",
    lead: "Let customers choose a service, a person and a time. Take the booking straight away or agree the request first, whichever fits the way you work.",
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
    title: "Introduce your team.",
    lead: "Add a photo, a short introduction and each person’s services. Customers can choose who they want to book with.",
    status: [
      { label: "Swipe, grid, list and avatar layouts", state: "works" },
      { label: "Profiles with services, working days and qualifications you supply", state: "works" },
      { label: "Private staff contact details stay private", state: "works" },
      { label: "Customers choosing a person when booking", state: "needs", requirement: "plan", note: "Pro includes up to three staff calendars; Business has no staff-calendar cap." },
    ],
    related: ["booking", "gallery-reviews", "design"],
  },
  {
    slug: "products", label: "Products and links", eyebrow: "Products and links",
    title: "Put your products on your page.",
    lead: "Add product photos, prices and descriptions. Link each item to your existing shop or let customers ask you about it.",
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
    title: "Give buyers a closer look.",
    lead: "List your vehicles with photos, specifications and prices. Mark stock as available, reserved or sold, and let buyers enquire about a specific car.",
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
    title: "Show customers your work.",
    lead: "Build a gallery customers can browse and open full screen. Add a link to your Google reviews so they can read what others think.",
    status: [
      { label: "Photo grid and swipe rows, with a full-screen viewer", state: "works" },
      { label: "A Google reviews destination and a Google review invitation", state: "works" },
      { label: "Imported Google ratings and individual reviews", state: "needs", requirement: "connection", note: "Needs a Google data connection with the required attribution. Reviews and ratings cannot be entered manually." },
      { label: "Photos and review links", state: "needs", requirement: "plan", note: "Free has neither. Paid plans do." },
    ],
    related: ["team", "products", "sharing"],
  },
  {
    slug: "sharing", label: "Sharing and QR codes", eyebrow: "Sharing and QR codes",
    title: "Share your page anywhere.",
    lead: "Copy your link, share it from your phone or save a QR code for your printed materials. Counter plaques and digital wallet cards are coming later.",
    status: [
      { label: "A scannable Taplo QR code you can save as a PNG", state: "works" },
      { label: "Share from a phone with the system share sheet", state: "works" },
      { label: "A public address for every page", state: "needs", feature: "publicLinks" },
      { label: "Exact link previews in social apps", state: "needs", requirement: "platform", note: "Apps decide this and cache it. Taplo cannot guarantee it." },
    ],
    related: ["design", "enquiries", "gallery-reviews"],
  },
  {
    slug: "messages", label: "Messages and reminders", eyebrow: "Messages and reminders",
    title: "Keep customers informed.",
    lead: "Give customers a direct way to contact you. Prepare booking confirmations and reminders with the date, time and appointment details included.",
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
