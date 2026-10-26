import { getIndustryPreset } from "@/features/themes/presets/industries"
import type { PlanId } from "@/features/subscriptions/plans"
import { setupJourney } from "@/features/demo/setup-journey"

/**
 * What setup suggests once it knows the kind of business. Every suggestion is only a starting point
 * with a stated reason; the owner can always choose differently, and nothing is added without a tap.
 */
export type Goal = "book" | "enquire" | "call" | "message"

const CALL_FIRST = new Set(["plumber", "electrician", "locksmith", "mechanic", "removals", "pest-control", "handyman", "cleaner", "hospitality", "vet"])
const ENQUIRE_FIRST = new Set(["builder", "landscaper", "photographer", "designer", "founder", "maker", "florist", "filmmaker", "illustrator", "interiors", "architect", "web-designer", "event-services", "other", "estate-agent", "consultant", "financial-adviser", "solicitor", "accountant"])

export interface ActionAdvice { id: Goal; label: string; detail: string; recommended: boolean; why?: string }

export function actionAdvice(industryKey: string): ActionAdvice[] {
  const preset = getIndustryPreset(industryKey)
  const j = setupJourney(industryKey)
  const best: Goal = CALL_FIRST.has(preset.id) ? "call" : ENQUIRE_FIRST.has(preset.id) ? "enquire" : "book"
  const why: Record<Goal, string> = {
    book: `Most ${preset.label.toLowerCase()} businesses lead with booking`,
    call: `People usually ring a ${preset.label.toLowerCase()} first`,
    enquire: "Work like this starts with a conversation",
    message: "Quick questions land best as a message",
  }
  const options: Omit<ActionAdvice, "recommended" | "why">[] = [
    { id: "book", label: j.booking, detail: "Customers pick a service and ask for a time" },
    { id: "call", label: "Call you", detail: "One tap rings your phone" },
    { id: "message", label: "Message you", detail: "WhatsApp or email, whichever you add" },
    { id: "enquire", label: "Get in touch", detail: "A short enquiry form and your links" },
  ]
  return options.map((o) => ({ ...o, recommended: o.id === best, ...(o.id === best ? { why: why[best] } : {}) }))
}

export function recommendedAction(industryKey: string): Goal {
  return actionAdvice(industryKey).find((a) => a.recommended)!.id
}

export interface PlanAdvice { plan: PlanId; reasons: string[] }
/** The plan that fits what has been set up so far, with the specific reasons it was chosen. */
export function planAdvice(input: { industryKey: string; goal: Goal; staff: number; hasGallery: boolean; kind: ReturnType<typeof setupJourney>["kind"] }): PlanAdvice {
  const reasons: string[] = []
  if (input.staff > 1) { reasons.push(`${input.staff} people on your team need their own calendars`); return { plan: "business", reasons } }
  if (input.goal === "book") { reasons.push("You chose bookings as your main button", "Online times, deposits and confirmations are on Pro"); return { plan: "pro", reasons } }
  if (input.kind === "photo" || input.kind === "product" || input.kind === "vehicle" || input.hasGallery) { reasons.push("Your work is visual: a gallery and your own look are on Core"); return { plan: "core", reasons } }
  if (input.goal === "call" || input.goal === "message") { reasons.push("Call and message buttons are included free", "Core adds a gallery and your own look when you want them"); return { plan: "free", reasons } }
  reasons.push("Unlimited services and a gallery help people choose you"); return { plan: "core", reasons }
}
