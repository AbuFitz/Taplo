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
  enquiryEmail: { label: "Each enquiry also emailed to the owner", requires: "messaging", otherwise: "Email notification not sent." },
  appointmentMessages: { label: "Appointment confirmations, changes and cancellations sent to the customer", requires: "messaging", otherwise: "Customer notification not sent." },
  reminders: { label: "Reminders before an appointment", requires: "messaging", otherwise: "Reminder not sent." },
  promotions: { label: "Offers to customers who have opted in", requires: "messaging", otherwise: "Message not sent." },
  publicLinks: { label: "A public address for every page", requires: "publicPublishing", otherwise: "Publish your page to share its public link." },
  payments: { label: "Deposits and payments", requires: "payments", otherwise: "Payment not completed." },
  accounts: { label: "Accounts and sign-in", requires: "accounts", otherwise: "We couldn’t create your account. Please try again." },
  sharedBookings: { label: "Bookings shared across devices", requires: "sharedBookings", otherwise: "No bookings to display yet." },
}

export type FeatureState = "works" | "needs"
export function featureState(id: FeatureId, caps: Capabilities = capabilities()): FeatureState {
  const r = FEATURES[id].requires
  return r === null || caps[r] ? "works" : "needs"
}
export const featureNote = (id: FeatureId) => FEATURES[id].otherwise
