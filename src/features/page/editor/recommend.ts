import type { BusinessContent } from "@/features/businesses/content"
import type { PageDoc } from "../contracts/page"
import type { WidgetType } from "../contracts/widgets"
import { getWidget } from "../widgets/registry"

/**
 * Optional suggestions derived from the owner's own records and page. Pure: it reads, never writes.
 * Each suggestion names ONE change the owner can accept; nothing is applied automatically and
 * no suggestion ever touches a choice the owner has already made.
 */
export type Recommendation =
  | { id: string; title: string; why: string; action: "addWidget"; label: string; widget: WidgetType }
  | { id: string; title: string; why: string; action: "open"; label: string; target: "header" | "details" }
  | { id: string; title: string; why: string; action: "resetColours"; label: string }

export interface RecommendInput {
  business: BusinessContent
  page: PageDoc
  onlineBooking: boolean
  /** Readability notices from the style resolver (colour choices that had to be adjusted). */
  readabilityNotices: number
}

export function recommend({ business: b, page, onlineBooking, readabilityNotices }: RecommendInput): Recommendation[] {
  const has = (t: WidgetType) => page.widgets.some((w) => w.type === t)
  const out: Recommendation[] = []
  /** Widgets that already show the same records count as covering them. */
  const COVERS: Partial<Record<WidgetType, WidgetType[]>> = { serviceList: ["priceMenu", "featuredService"], booking: ["featuredService"] }
  const covered = (t: WidgetType) => has(t) || (COVERS[t] ?? []).some(has)
  const add = (widget: WidgetType, why: string) => {
    const def = getWidget(widget)
    if (def && !covered(widget)) out.push({ id: `add:${widget}`, title: `Add ${def.label.toLowerCase()}`, why, action: "addWidget", label: `Add ${def.label}`, widget })
  }

  if (readabilityNotices > 0 && page.appearance.colors && Object.keys(page.appearance.colors).length) {
    out.push({ id: "colours:reset", title: "Some of your colours are hard to read", why: "Taplo adjusted text so it stays readable. You can go back to colours that work together.", action: "resetColours", label: "Reset colours" })
  }
  if (!b.identity.logo) out.push({ id: "logo", title: "Add a logo or profile picture", why: "People recognise a face or a mark faster than a name.", action: "open", label: "Add a picture", target: "header" })
  if (b.services.some((s) => !s.archived)) {
    add("serviceList", "You have services but nothing on the page lists them.")
    if (onlineBooking) add("booking", "Customers can book you online, but there is no booking button yet.")
  }
  if (b.testimonials.length) add("reviews", "You have reviews saved. Showing them builds trust.")
  if (b.contacts.social.length) add("social", "You added social profiles that visitors can’t see yet.")
  if (b.hours.length) add("hours", "You set opening hours that aren’t shown yet.")
  if (b.faqs.some((f) => f.question.trim() && f.answer.trim())) add("faq", "You have answers to common questions that aren’t shown yet.")
  if (b.gallery.length) add("gallery", "You uploaded photos that aren’t shown on the page.")
  if (!b.contacts.phone && !b.contacts.whatsapp && !b.contacts.email) {
    out.push({ id: "contact", title: "Add a way to contact you", why: "Visitors need at least a phone number, WhatsApp or email.", action: "open", label: "Add contact details", target: "details" })
  }
  return out
}
