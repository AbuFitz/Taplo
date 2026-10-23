import { capabilities, type Capabilities } from "./capabilities"

/**
 * What each customer-facing feature needs before it works for real. Marketing, product pages and setup read this one list,
 * so connecting a service means changing a capability, not rewriting copy. A feature whose requirement is missing is still
 * described plainly; it is never shown as working, and nothing may imply a message was delivered when it was not.
 */
export type FeatureId =
  | "textApp" | "enquiryInbox" | "enquiryEmail" | "appointmentMessages" | "reminders" | "promotions"
  | "publicLinks" | "payments" | "accounts" | "sharedBookings"

interface Feature { label: string; /** Which capability it waits for; null means it needs nothing external. */ requires: keyof Capabilities | null; /** Said where someone tries it without the capability. */ otherwise: string }

export const FEATURES: Record<FeatureId, Feature> = {
  textApp: { label: "Text us: opens the customer’s own messages app with the words ready", requires: null, otherwise: "" },
  enquiryInbox: { label: "A contact form that keeps each enquiry for the owner", requires: null, otherwise: "" },
  enquiryEmail: { label: "Each enquiry also emailed to the owner", requires: "messaging", otherwise: "Enquiries are kept in the dashboard. Email delivery switches on when an email service is connected." },
  appointmentMessages: { label: "Appointment confirmations, changes and cancellations sent to the customer", requires: "messaging", otherwise: "The booking is confirmed on screen. The message to the customer switches on when a messaging service is connected." },
  reminders: { label: "Reminders before an appointment", requires: "messaging", otherwise: "Reminders switch on when a messaging service is connected." },
  promotions: { label: "Offers to customers who have opted in", requires: "messaging", otherwise: "Promotional messages switch on when a messaging service is connected, with opt-in and opt-out." },
  publicLinks: { label: "A public address for every page", requires: "publicPublishing", otherwise: "Your page opens in this browser. A public address needs publishing, which is not connected yet." },
  payments: { label: "Deposits and payments", requires: "payments", otherwise: "Nothing is charged: payments are not connected." },
  accounts: { label: "Accounts and sign-in", requires: "accounts", otherwise: "Accounts are not connected yet, so what you make stays in this browser." },
  sharedBookings: { label: "Bookings shared across devices", requires: "sharedBookings", otherwise: "Bookings are saved in this browser only." },
}

export type FeatureState = "works" | "needs"
export function featureState(id: FeatureId, caps: Capabilities = capabilities()): FeatureState {
  const r = FEATURES[id].requires
  return r === null || caps[r] ? "works" : "needs"
}
export const featureNote = (id: FeatureId) => FEATURES[id].otherwise
