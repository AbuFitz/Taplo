import type { BusinessContent } from "@/features/businesses/content"
import { formatMoney } from "@/features/services/format"
import type { WidgetType } from "../contracts/widgets"
import type { StoredWidget } from "../starter"
import { getWidget } from "../widgets/registry"
import type { WidgetContext } from "../widgets/types"

/**
 * How the editor talks about page content. The page stores widgets; owners think in "Services", "Photos"
 * and "Vehicles". This is the single mapping from one to the other, used by the content cards, the Add
 * content chooser and the inline record dialogs, so the words are the same everywhere.
 */

export type RecordKind = "service" | "product" | "vehicle" | "review" | "staff" | "faq" | "photo" | "social" | "credential" | "phone" | "whatsapp" | "email" | "directions" | "offer"

export type MiniArt = "list" | "cards" | "grid" | "avatars" | "button" | "text" | "map" | "photos" | "stars" | "tag" | "video" | "clock" | "links" | "bell" | "card"

export interface ContentChoice {
  id: string
  type: WidgetType
  /** Settings applied when added (heading, style). */
  settings?: Record<string, unknown>
  name: string
  blurb: string
  group: "offer" | "show" | "trust" | "reach" | "info"
  art: MiniArt
  /** A record this content cannot show without. Created inside the add flow, never on another page. */
  needs?: RecordKind
  /** Industry keys this is suggested for, in addition to the preset's own starter list. */
  suggestFor?: string[]
  /** Why it cannot be added yet (an integration that is not connected). Shown, not hidden. */
  blocked?: string
}

export const GROUP_LABEL: Record<ContentChoice["group"], { title: string; hint: string }> = {
  offer: { title: "What you offer", hint: "Services, products and stock" },
  show: { title: "Show your work", hint: "Photos, words and files" },
  trust: { title: "Build trust", hint: "Reviews, people and answers" },
  reach: { title: "Get in touch", hint: "Buttons that start a conversation" },
  info: { title: "Find and visit", hint: "Hours, place and notices" },
}

export const CHOICES: ContentChoice[] = [
  { id: "prices", type: "priceMenu", name: "Price menu", blurb: "Your services and prices, tidily grouped.", group: "offer", art: "list", needs: "service" },
  { id: "services", type: "serviceList", settings: { variant: "cards" }, name: "Service cards", blurb: "Each service on its own card, with a description.", group: "offer", art: "cards", needs: "service" },
  { id: "featured", type: "featuredService", name: "Featured service", blurb: "Spotlight the one thing you most want booked.", group: "offer", art: "card", needs: "service" },
  { id: "products", type: "products", settings: { variant: "grid" }, name: "Products", blurb: "Things you sell or recommend, with photos and prices.", group: "offer", art: "grid", needs: "product" },
  { id: "vehicles", type: "products", settings: { title: "In stock", variant: "list" }, name: "Vehicles", blurb: "Stock with photos, price and the facts buyers ask about.", group: "offer", art: "cards", needs: "vehicle", suggestFor: ["car-dealer"] },
  { id: "offers", type: "offers", name: "Offers", blurb: "A current deal. Expired offers hide themselves.", group: "offer", art: "tag", needs: "offer" },
  { id: "booking", type: "booking", name: "Book or enquire", blurb: "A button to ask for a time or get in touch.", group: "offer", art: "button" },
  { id: "payment", type: "payment", name: "Pay or deposit", blurb: "Take a deposit or payment. Needs a payment provider connected, which this environment does not have yet.", group: "offer", art: "button", blocked: "Payments are not connected yet" },

  { id: "photos", type: "gallery", name: "Photos", blurb: "A set of pictures of your work or your place.", group: "show", art: "photos", needs: "photo" },
  { id: "image", type: "image", name: "One picture", blurb: "A single image with a caption.", group: "show", art: "photos" },
  { id: "text", type: "text", name: "Text", blurb: "A short message, heading or about section.", group: "show", art: "text" },
  { id: "video", type: "video", name: "Video", blurb: "Embed a video from YouTube or Vimeo.", group: "show", art: "video" },
  { id: "document", type: "document", name: "Download", blurb: "A menu, price list or brochure to download.", group: "show", art: "list" },

  { id: "reviews", type: "reviews", name: "Reviews", blurb: "Words from customers who agreed to share them.", group: "trust", art: "stars", needs: "review" },
  { id: "leave-review", type: "leaveReview", name: "Ask for a review", blurb: "Link to where customers can review you.", group: "trust", art: "button" },
  { id: "team", type: "team", name: "Team", blurb: "Introduce the people behind the work.", group: "trust", art: "avatars", needs: "staff" },
  { id: "credentials", type: "credentials", name: "Credentials", blurb: "Qualifications and facts you can stand behind.", group: "trust", art: "tag", needs: "credential" },
  { id: "faq", type: "faq", name: "Questions", blurb: "Answers to what customers always ask.", group: "trust", art: "list", needs: "faq" },

  { id: "call", type: "call", name: "Call button", blurb: "A one-tap call button.", group: "reach", art: "button", needs: "phone" },
  { id: "whatsapp", type: "whatsapp", name: "WhatsApp", blurb: "Open a WhatsApp chat with you.", group: "reach", art: "button", needs: "whatsapp" },
  { id: "email", type: "email", name: "Email", blurb: "Start an email to you.", group: "reach", art: "button", needs: "email" },
  { id: "social", type: "social", name: "Social links", blurb: "Your profiles as icons or a list.", group: "reach", art: "links", needs: "social" },
  { id: "enquiry", type: "enquiry", name: "Contact form", blurb: "A form for questions. It reserves no time.", group: "reach", art: "text" },
  { id: "share", type: "share", name: "Share button", blurb: "A link, QR code and image for your page.", group: "reach", art: "links" },
  { id: "link", type: "link", name: "Link", blurb: "Link to your shop, a menu or a form.", group: "reach", art: "links" },

  { id: "hours", type: "hours", name: "Opening hours", blurb: "When you are open.", group: "info", art: "clock" },
  { id: "location", type: "location", name: "Location", blurb: "Where to find you.", group: "info", art: "map" },
  { id: "directions", type: "directions", name: "Directions", blurb: "A button that opens the map.", group: "info", art: "button", needs: "directions" },
  { id: "area", type: "serviceArea", name: "Areas you cover", blurb: "Where you work, without showing an address.", group: "info", art: "map" },
  { id: "announcement", type: "announcement", name: "Notice", blurb: "A short announcement at the top of your page.", group: "info", art: "bell" },
]

export const choiceFor = (w: StoredWidget): ContentChoice | undefined => {
  const t = (w.settings as { title?: string; variant?: string }) ?? {}
  if (w.type === "products") return CHOICES.find((c) => c.id === (t.title === "In stock" ? "vehicles" : "products"))
  return CHOICES.find((c) => c.type === w.type)
}

/** The name an owner sees for a block on their page. Never the internal widget name. */
export function contentName(w: StoredWidget, records: BusinessContent | null): string {
  if (w.type === "products" && records) {
    const shown = records.products.filter((p) => !p.archived)
    if (shown.length && shown.every((p) => p.kind === "vehicle")) return "Vehicles"
    return "Products"
  }
  return choiceFor(w)?.name ?? getWidget(w.type)?.label ?? "Content"
}

const gbp = (minor: number) => formatMoney(minor, "GBP")

export interface ContentSummary {
  name: string
  /** One line saying what is in it. */
  summary: string
  thumb: { src: string; alt: string } | null
  /** Set when the block cannot show anything yet, and what would fix it. */
  needs: { kind: RecordKind; cta: string } | { kind: "details" | "self"; cta: string } | null
  locked: string | null
}

function pickIds<T extends { id: string }>(all: T[], ids: unknown): T[] {
  return Array.isArray(ids) ? all.filter((x) => ids.includes(x.id)) : all
}

export function summarise(w: StoredWidget, records: BusinessContent | null, ctx: WidgetContext | null): ContentSummary {
  const def = getWidget(w.type)!
  const st = ctx ? def.status(w.settings as Record<string, unknown>, ctx) : { state: "ready" as const }
  const name = contentName(w, records)
  const s = w.settings as Record<string, unknown>
  const r = records
  let summary = ""
  let thumb: ContentSummary["thumb"] = null
  let need: ContentSummary["needs"] = null

  if (r) {
    switch (w.type) {
      case "priceMenu": case "serviceList": {
        const list = pickIds(r.services.filter((x) => !x.archived), s.serviceIds)
        const prices = list.map((x) => x.priceMinor).filter((x): x is number => x !== undefined)
        summary = `${list.length} ${list.length === 1 ? "service" : "services"}${prices.length ? ` · from ${gbp(Math.min(...prices))}` : ""}`
        thumb = list.find((x) => x.image)?.image ? { src: list.find((x) => x.image)!.image!.src, alt: "" } : null
        break
      }
      case "featuredService": { const x = r.services.find((v) => v.id === s.serviceId) ?? r.services[0]; summary = x ? x.name : ""; break }
      case "products": {
        const list = pickIds(r.products.filter((x) => !x.archived), s.productIds)
        const sold = list.filter((x) => x.availability === "sold").length
        const noun = list.length && list.every((x) => x.kind === "vehicle") ? ["vehicle", "vehicles"] : ["item", "items"]
        summary = `${list.length} ${list.length === 1 ? noun[0] : noun[1]}${sold ? ` · ${sold} sold` : ""}`
        const withImg = list.find((x) => x.image)
        thumb = withImg?.image ? { src: withImg.image.src, alt: "" } : null
        break
      }
      case "gallery": { const list = pickIds(r.gallery, s.itemIds); summary = `${list.length} ${list.length === 1 ? "photo" : "photos"}`; thumb = list[0] ? { src: list[0].image.src, alt: "" } : null; break }
      case "reviews": { const n = pickIds(r.testimonials, s.testimonialIds).length; summary = r.rating ? `${r.rating.value}★ from ${r.rating.count} on ${r.rating.source}` : `${n} ${n === 1 ? "review" : "reviews"}`; break }
      case "team": { const list = pickIds(r.staff, s.staffIds); summary = `${list.length} ${list.length === 1 ? "person" : "people"}`; break }
      case "faq": { const n = pickIds(r.faqs, s.faqIds).length; summary = `${n} ${n === 1 ? "question" : "questions"}`; break }
      case "social": summary = r.contacts.social.map((x) => x.platform).join(", "); break
      case "credentials": summary = r.credentials.slice(0, 3).join(", "); break
      case "offers": {
        // Expired offers hide themselves, so they are not counted as showing.
        const today = ctx?.today ?? ""
        const live = r.offers.filter((o) => !o.archived && (!o.endsAt || !today || o.endsAt >= today)).length
        const expired = r.offers.filter((o) => !o.archived).length - live
        summary = live ? `${live} ${live === 1 ? "offer" : "offers"}` : expired ? `${expired} expired` : ""
        break
      }
      case "call": summary = r.contacts.phone ?? ""; break
      case "whatsapp": summary = r.contacts.whatsapp ?? ""; break
      case "email": summary = r.contacts.email ?? ""; break
      case "directions": case "location": summary = r.location.locality ?? ""; break
      case "hours": { const open = r.hours.filter((h) => h.opens).length; summary = open ? `Open ${open} ${open === 1 ? "day" : "days"} a week` : ""; break }
      case "text": summary = String(s.body ?? "").slice(0, 70); break
      case "image": { const img = s.image as { src?: string } | undefined; summary = String(s.caption ?? ""); thumb = img?.src ? { src: img.src, alt: "" } : null; break }
      case "booking": summary = String(s.label ?? "") || "Ask for a time"; break
      case "announcement": summary = String(s.text ?? s.message ?? "").slice(0, 70); break
      case "link": summary = String(s.label ?? ""); break
      default: break
    }
  }

  if (st.state === "empty") {
    const kind = choiceFor(w)?.needs
    const fix = "fix" in st ? st.fix : undefined
    if (kind) need = { kind, cta: needCta(kind) }
    else if (fix === "profile" || fix === "settings") need = { kind: "details", cta: "Finish this in Business details" }
    // Nothing to fill in elsewhere: the widget's own settings are what is missing (a video address, some text, a link).
    else if (!fix) need = { kind: "self", cta: "Finish setting this up" }
  }
  return { name, summary, thumb, needs: need, locked: st.state === "locked" ? st.reason : null }
}

export const needCta = (k: RecordKind): string => ({
  service: "Add your first service", product: "Add your first product", vehicle: "Add your first vehicle", review: "Add a review", staff: "Add a team member", faq: "Add a question",
  photo: "Add photos", social: "Add a social profile", credential: "Add a credential", phone: "Add your phone number", whatsapp: "Add your WhatsApp number", email: "Add your email", directions: "Add a directions link", offer: "Add an offer",
}[k])
