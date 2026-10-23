import { demoModeEnabled } from "./env"

/**
 * What this deployment can actually do. The frontend asks here instead of scattering "preview" and "demo" wording
 * through screens: when a service is connected, flip it here (or derive it from the environment) and every screen that
 * depends on it changes together. Nothing in the UI may claim a capability that is false here.
 */
export interface Capabilities {
  /** Everything is stored in this browser and no one else can see it. */
  sandbox: boolean
  /** Owners can create accounts and sign in. */
  accounts: boolean
  /** A published page has a public address anyone can open. */
  publicPublishing: boolean
  /** Confirmation and notification emails and texts are sent. */
  messaging: boolean
  /** Deposits and payments are taken. */
  payments: boolean
  /** Bookings are written to a shared database with server-side conflict checks. */
  sharedBookings: boolean
}

export function capabilities(): Capabilities {
  const sandbox = demoModeEnabled()
  return { sandbox, accounts: !sandbox, publicPublishing: !sandbox, messaging: false, payments: false, sharedBookings: !sandbox }
}

/** Said at the point of the action, never as a banner: what happens instead when a capability is missing. */
export const WHEN_UNAVAILABLE = {
  publicPublishing: "Your page opens in this browser only. A public address needs accounts and publishing, which are not connected yet.",
  messaging: "Nothing is emailed or texted.",
  payments: "Nothing is charged: payments are not connected.",
  accounts: "Accounts are not connected yet, so what you make stays in this browser.",
  sharedBookings: "Bookings are saved in this browser only.",
} as const

export const SANDBOX_SUMMARY = "You are using Taplo in a sandbox. What you make stays in this browser and nobody else can see it."
export const SANDBOX_MISSING = ["Accounts and sign-in", "A public address for your page", "Emails and texts to customers", "Payments and deposits"] as const
