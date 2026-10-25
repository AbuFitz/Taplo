import { SOCIAL_PLATFORMS } from "../social-platforms"
import * as React from "react"
import { referencedRecords as pick, selectedPlatforms, selectedService } from "./selection"
import { serviceListItems } from "./service-list"
import { SocialIcon } from "./social-icons"
import { ArrowUpRight, Check, ChevronDown, MapPin, Megaphone, Quote, TriangleAlert, Tag } from "lucide-react"
import type { ProductContent, ServiceContent } from "@/features/businesses/content"
import { formatDuration, formatMoney, formatPrice, groupServices } from "@/features/services/format"
import { googleReviewUrl } from "./google-reviews"
import { siGoogle } from "simple-icons"
import { isHttpUrl, smsHref } from "@/lib/validation"
import { cn } from "@/lib/utils"
import type { WidgetType } from "../contracts/widgets"
import { ProfileImage } from "../renderer/ProfileImage"
import type { PageViewModel, RenderWidget } from "../renderer/view-model"
import { BookingAction, ItemDetail, PaymentAction, VideoEmbed, type BookingActionProps } from "./client"
import { WidgetIcon } from "./WidgetIcon"
import { buildPlanContext, priceWording } from "@/features/booking/model"
import { TeamMembers, type TeamMemberData } from "./TeamClient"
import { ServiceCollection } from "./ServiceClient"
import { Gallery } from "./GalleryClient"
import { Hours } from "./HoursClient"
import { Collection } from "./Collection"
import { ShareButton } from "./ShareClient"
import { EnquiryButton } from "./EnquiryButton"
import { EnquiryForm } from "@/features/booking/ui/EnquiryForm"
import type { BookableService } from "@/features/booking/model"

type S = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any -- validated per type by settingsSchemas before reaching a renderer
interface P { w: RenderWidget; vm: PageViewModel }

const str = (v: unknown): string => (typeof v === "string" ? v : "")

function Card({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("tp-card", className)}>
      {title ? <h2>{title}</h2> : null}
      {children}
    </div>
  )
}

function Thumb({ w }: { w: RenderWidget }) {
  const t = w.appearance.thumbnail
  return t ? <span className="tp-btn-thumb"><ProfileImage image={t} sizes="48px" /></span> : null
}

function LinkRow({ w, href, label, subtitle, icon, external, variant }: { w: RenderWidget; href: string; label: string; subtitle?: string; icon: string; external?: boolean; variant?: string }) {
  return (
    <a href={href} className={variant === "card" ? "tp-tile tp-link-tile" : "tp-btn"} data-variant={variant ?? "button"} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <Thumb w={w} />
      {!w.appearance.thumbnail ? <WidgetIcon name={icon} className="size-5" /> : null}
      <span className="tp-btn-main"><span className="tp-btn-label">{label}</span>{subtitle && variant !== "compact" ? <span className="tp-btn-sub">{subtitle}</span> : null}</span>
      <ArrowUpRight aria-hidden="true" className="size-4 opacity-70" />
    </a>
  )
}

export function bookingProps(vm: PageViewModel, extra: Partial<BookingActionProps> & { label: string }): BookingActionProps {
  const b = vm.business
  return {
    businessName: b.identity.name,
    slug: b.identity.slug,
    services: b.services.map((s) => ({ id: s.id, name: s.name })),
    phone: b.contacts.phone,
    whatsapp: b.contacts.whatsapp,
    email: b.contacts.email,
    onlineBooking: vm.onlineBooking,
    // The scheduling context (services with timing, people when the plan allows choosing, hours) travels with the action,
    // so the booking journey needs nothing else from the page.
    booking: vm.onlineBooking ? buildPlanContext(b, vm.ent) : undefined,
    ...extra,
  }
}


/* ------------------------------------------------------------------ contact / links */
const CHANNEL: Partial<Record<WidgetType, { icon: string; label: string; href: (vm: PageViewModel) => string | null; external?: boolean }>> = {
  call: { icon: "Phone", label: "Call us", href: (vm) => vm.actions.find((a) => a.kind === "call")?.href ?? null },
  sms: { icon: "MessageSquare", label: "Text us", href: (vm) => (vm.business.contacts.phone ? smsHref(vm.business.contacts.phone, `Hi ${vm.business.identity.name}, I'd like to ask about your services.`) : null) },
  whatsapp: { icon: "MessageCircle", label: "Message us on WhatsApp", href: (vm) => vm.actions.find((a) => a.kind === "whatsapp")?.href ?? null, external: true },
  email: { icon: "Mail", label: "Email us", href: (vm) => vm.actions.find((a) => a.kind === "email")?.href ?? null },
  directions: { icon: "MapPin", label: "Get directions", href: (vm) => vm.business.location.directionsUrl ?? null, external: true },
}

function ChannelWidget({ w, vm }: P) {
  const c = CHANNEL[w.type]!
  const href = c.href(vm)
  const s = w.settings as S
  if (!href) return null
  return <LinkRow w={w} href={href} label={str(s.label) || c.label} subtitle={s.subtitle} icon={c.icon} external={c.external} variant={s.variant} />
}

const SOCIAL_NAME: Record<string,string> = Object.fromEntries(SOCIAL_PLATFORMS.map(p=>[p.id,p.label]))

function SocialWidget({ w, vm }: P) {
  const s = w.settings as S
  const links = selectedPlatforms(vm.business.contacts.social, s.platforms)
  if (s.variant === "list") {
    return <div className="grid gap-2">{links.map((l) => <LinkRow key={l.platform} w={w} href={l.url} label={SOCIAL_NAME[l.platform] ?? l.platform} icon="AtSign" external variant="compact" />)}</div>
  }
  return (
    <ul className="tp-actions" aria-label="Social profiles">
      {links.map((l) => (
        <li key={l.platform}>
          <a className="tp-icon-action text-sm font-bold" href={l.url} target="_blank" rel="noopener noreferrer"><SocialIcon platform={l.platform} /><span className="sr-only">{SOCIAL_NAME[l.platform] ?? l.platform}</span></a>
        </li>
      ))}
    </ul>
  )
}

function LinkWidget({ w }: P) {
  const s = w.settings as S
  if (!isHttpUrl(s.url)) return null
  return <LinkRow w={w} href={s.url} label={s.label} subtitle={s.subtitle} icon="Link" external variant={s.variant} />
}

function DocumentWidget({ w }: P) {
  const s = w.settings as S
  if (!isHttpUrl(s.url)) return null
  return <LinkRow w={w} href={s.url} label={s.title} subtitle={s.description} icon="FileDown" external variant={s.description ? "card" : "button"} />
}

/* ------------------------------------------------------------------ services / sales */
function bookable(x: ServiceContent): BookableService {
  return { id: x.id, name: x.name, description: x.description, group: x.group, priceMode: x.priceMode, priceMinor: x.priceMinor, currency: x.currency, durationMinutes: x.durationMinutes, bookingMode: x.bookingMode }
}

/** Who provides each service, so the detail view can say so. People with serviceIds null provide every service. */
function providersByService(vm: PageViewModel) {
  const out: Record<string, { id: string; name: string; serviceIds: string[] | null }[]> = {}
  for (const s of vm.business.services) out[s.id] = vm.business.staff.filter((p) => p.bookable !== false && (p.serviceIds == null || p.serviceIds.includes(s.id))).map((p) => ({ id: p.id, name: p.name, serviceIds: p.serviceIds ?? null }))
  return out
}

function serviceCtx(vm: PageViewModel) {
  return vm.onlineBooking ? buildPlanContext(vm.business, vm.ent) : undefined
}

function ServiceListWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = serviceListItems(vm.business.services, s, vm.ctx.featuredServiceIds)
  return (
    <Card title={s.title}>
      <ServiceCollection groups={[{ items: list.map(bookable) }]} variant={s.variant === "tiles" ? "tiles" : s.variant === "cards" ? "cards" : s.variant === "compact" ? "compact" : s.variant === "spotlight" ? "spotlight" : "rows"} options={{ showPrices: s.showPrices !== false, showDuration: s.showDuration !== false, showDescriptions: s.showDescriptions !== false }}
        ctx={serviceCtx(vm)} businessName={vm.business.identity.name} slug={vm.business.identity.slug} staffNames={providersByService(vm)} />
    </Card>
  )
}

function PriceMenuWidget({ w, vm }: P) {
  const s = w.settings as S
  const groups = groupServices(pick(vm.business.services, s.serviceIds)).map((g) => ({ name: g.name ?? undefined, items: g.items.map(bookable) }))
  return (
    <Card title={s.title}>
      <ServiceCollection groups={groups} variant={s.variant === "panels" ? "menu-panels" : s.variant === "compact" ? "menu-compact" : "menu"} options={{ showPrices: true, showDuration: false, showDescriptions: Boolean(s.showDescriptions) }}
        ctx={serviceCtx(vm)} businessName={vm.business.identity.name} slug={vm.business.identity.slug} staffNames={providersByService(vm)} />
    </Card>
  )
}

function FeaturedServiceWidget({ w, vm }: P) {
  const s = w.settings as S
  const svc = selectedService(vm.business.services, s.serviceId)
  if (!svc) return null
  return <Card className="tp-featured-service">
    {s.headline ? <p className="tp-muted tp-featured-eyebrow">{s.headline}</p> : null}
    <h2>{svc.name}</h2>
    {svc.description ? <p className="tp-muted tp-featured-description">{svc.description}</p> : null}
    <div className="tp-featured-terms"><span className="tp-price">{formatPrice(svc)}</span>{svc.durationMinutes ? <span className="tp-muted">{formatDuration(svc.durationMinutes)}</span> : null}</div>
    <BookingAction {...bookingProps(vm, { label: s.ctaLabel || (vm.onlineBooking && svc.bookingMode === "request" ? "Request a time" : vm.onlineBooking && svc.bookingMode === "instant" ? "Book a time" : "Ask about this"), preselect: svc.id })} />
  </Card>
}

function BookingWidget({ w, vm }: P) {
  const s = w.settings as S
  const props = bookingProps(vm, { label: s.label || vm.industry.terminology.booking, preselect: s.serviceId, thumbnail: w.appearance.thumbnail ? <Thumb w={w} /> : undefined, variant: s.variant === "card" ? "card" : "button", subtitle: s.variant === "card" ? (vm.onlineBooking ? "Pick a service and a time" : "Choose how to get in touch") : undefined })
  return <BookingAction {...props} />
}

const STATUS_LABEL = { reserved: "Reserved", sold: "Sold", unavailable: "Not available" } as const

function hostOf(url: string) { try { return new URL(url).hostname.replace(/^www\./, "") } catch { return "" } }

/** The action for an item: honest about what it does (enquiry, someone else's shop, an affiliate link, or nothing when it is gone). */
function ItemAction({ p, vm, compact }: { p: ProductContent; vm: PageViewModel; compact?: boolean }) {
  if (p.availability === "sold" || p.availability === "unavailable")
    return <span className="tp-status-note" data-status={p.availability}>{p.availability === "sold" ? (p.kind === "vehicle" ? "Sold" : "Sold out") : "Not available right now"}</span>
  if (p.mode === "link" && isHttpUrl(p.linkUrl)) {
    const host = hostOf(p.linkUrl!)
    return (
      <div className="tp-link-out">
        <a className="tp-btn" data-variant={compact ? "compact" : "button"} href={p.linkUrl} target="_blank" rel={p.affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}>
          <span className="tp-btn-main"><span className="tp-btn-label">{host ? `View on ${host}` : "View"}</span></span><ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
        {p.affiliate ? <p className="tp-affiliate">Affiliate link: {vm.business.identity.name} may earn a commission.</p> : null}
      </div>
    )
  }
  return <BookingAction {...bookingProps(vm, { label: p.kind === "vehicle" ? (p.availability === "reserved" ? "Ask about similar cars" : "Enquire about this car") : "Ask about this", topic: p.name, item: { id: p.id, kind: p.kind === "vehicle" ? "vehicle" : "product" }, variant: compact ? "compact" : "button" })} />
}

function ProductCard({ p, vm, large = false }: { p: ProductContent; vm: PageViewModel; large?: boolean }) {
  const images = [p.image, ...p.images].filter((x): x is NonNullable<typeof p.image> => Boolean(x))
  const statusText = p.availability !== "available" ? STATUS_LABEL[p.availability] : null
  const badge = statusText ?? p.badge
  const price = p.priceMinor !== undefined ? formatMoney(p.priceMinor, p.currency) : undefined
  const facts = p.facts.filter((f) => f.label.trim() && f.value.trim())
  const open = (children: React.ReactNode) => (
    <ItemDetail
      trigger={<button type="button" className="tp-product-open" data-testid="product-open" aria-label={`View details: ${p.name}`}>{children}</button>}
      title={p.name} price={price} status={statusText ?? undefined} facts={facts} description={p.description}
      images={images.map((m) => ({ src: m.src, alt: m.alt, focal: m.focal }))} cta={<ItemAction p={p} vm={vm} />}
    />
  )
  return (
    <div className="tp-product" data-status={p.availability} data-kind={p.kind}>
      {p.image ? <div className="tp-media">{badge ? <span className="tp-badge" data-status={statusText ? p.availability : undefined}>{badge}</span> : null}{open(<ProfileImage image={p.image} sizes={large ? "(min-width:900px) 40vw, 90vw" : "(min-width:900px) 20rem, 90vw"} />)}</div> : null}
      <div className="tp-product-body">
        <p className="tp-product-name">{!p.image && badge ? <span className="tp-badge tp-badge-inline" data-status={statusText ? p.availability : undefined}>{badge}</span> : null}{p.image ? p.name : open(<span>{p.name}</span>)}</p>
        {price ? <p className="tp-product-price">{price}</p> : null}
        {facts.length ? <ul className="tp-facts" aria-label="Details">{facts.map((f) => <li key={f.label} className="tp-fact">{f.label} <b>{f.value}</b></li>)}</ul> : null}
        {p.description ? <p className="tp-muted text-sm tp-clamp">{p.description}</p> : null}
      </div>
      <div className="tp-product-cta"><ItemAction p={p} vm={vm} compact /></div>
    </div>
  )
}

function ProductsWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = pick(vm.business.products.filter((x) => !x.archived), s.productIds)
  // Group by the owner's collection names, in first-seen order. One group (or none) renders exactly as before.
  const groups: { name: string; items: ProductContent[] }[] = []
  for (const p of list) {
    const name = p.collection?.trim() ?? ""
    const g = groups.find((x) => x.name === name)
    if (g) g.items.push(p)
    else groups.push({ name, items: [p] })
  }
  const grouped = groups.length > 1 || (groups.length === 1 && groups[0]!.name !== "")
  return (
    <Card title={s.title}>
      {groups.map((g) => (
        <div key={g.name} className={grouped ? "tp-product-group" : undefined}>
          {grouped && g.name ? <h3 className="tp-group-title">{g.name}</h3> : null}
          {s.variant === "swipe" && g.items.length > 1
            ? <Collection label={g.name || s.title || "Products"}>{g.items.map((p) => <ProductCard key={p.id} p={p} vm={vm} large={s.variant === "catalogue"} />)}</Collection>
            : <ul className="tp-products" data-variant={s.variant === "catalogue" ? "catalogue" : s.variant === "grid" ? "grid" : "list"} data-count={Math.min(g.items.length, 3)}>{g.items.map((p) => <li key={p.id}><ProductCard p={p} vm={vm} /></li>)}</ul>}
        </div>
      ))}
    </Card>
  )
}

function OffersWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = pick(vm.business.offers.filter((o) => !o.archived && (!o.endsAt || o.endsAt >= vm.ctx.today)), s.offerIds)
  return (
    <Card title={s.title || "Offers"}>
      <ul className={s.variant === "cards" ? "tp-offer-tiles" : "tp-rows"}>
        {list.map((o) => (
          <li key={o.id} className={s.variant === "cards" ? "tp-tile tp-offer-tile" : undefined}>
            <p className="font-semibold">{o.title}</p>
            {o.description ? <p className="tp-muted text-sm">{o.description}</p> : null}
            <p className="mt-1 flex flex-wrap gap-2 text-sm">{o.code ? <span className="tp-chip">Code: {o.code}</span> : null}{o.endsAt ? <span className="tp-muted">Until {o.endsAt}</span> : null}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function PaymentWidget({ w, vm }: P) {
  const s = w.settings as S
  const svc = vm.business.services.find((x) => x.id === s.serviceId)
  const summary = svc ? `${svc.name} · ${formatPrice(svc)}` : "Choose what to pay for at checkout."
  return <PaymentAction label={s.label || "Pay a deposit"} summary={summary} thumbnail={w.appearance.thumbnail ? <Thumb w={w} /> : undefined} />
}

/* ------------------------------------------------------------------ trust / people */
function GoogleMark() {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d={siGoogle.path} /></svg>
}
function ReviewsWidget({ w, vm }: P) {
  const url = googleReviewUrl(vm.business)
  if (!url) return null
  const s = w.settings as S
  const compact = s.variant === "compact"
  return <Card title={s.title || undefined} className="tp-review-card"><a href={url} target="_blank" rel="noopener noreferrer" className="tp-google-review" data-compact={compact}>
    <span className="tp-google-mark"><GoogleMark /></span><span className="tp-review-copy"><strong role={s.title ? undefined : "heading"} aria-level={s.title ? undefined : 2}>{compact ? "Our Google reviews" : "A little word of mouth."}</strong><span className="tp-muted">Read our reviews on Google</span></span><ArrowUpRight className="tp-review-arrow" aria-hidden="true" />
  </a></Card>
}

function LeaveReviewWidget({ w, vm }: P) {
  const url = googleReviewUrl(vm.business)
  return url ? <LinkRow w={w} href={url} label={str(w.settings.label) || "Review us on Google"} icon="ThumbsUp" external variant="button" /> : null
}

function firstSentences(text: string | undefined, max = 110): string {
  const t = (text ?? "").trim().replace(/\s+/g, " ")
  if (!t) return ""
  const m = t.match(/^(.+?[.!?])(\s|$)/)
  const s = m ? m[1]! : t
  return s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`
}

function TeamWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = pick(vm.business.staff, s.staffIds).filter((m) => m.bookable !== false || true)
  const svcById = new Map(vm.business.services.filter((x) => !x.archived).map((x) => [x.id, x]))
  const members: TeamMemberData[] = list.map((m) => ({
    id: m.id, name: m.name, role: m.role, bio: m.bio, summary: firstSentences(m.bio), photo: m.photo ? { src: m.photo.src, alt: m.photo.alt, focal: m.photo.focal } : undefined,
    subjects: m.subjects, credentials: m.credentials ?? [], bookable: m.bookable !== false,
    services: [...svcById.values()].filter((x) => m.serviceIds === null || m.serviceIds === undefined || m.serviceIds.includes(x.id)).map((x) => ({ id: x.id, name: x.name, price: priceWording({ ...x, bookingMode: x.bookingMode } as never), minutes: x.durationMinutes })),
  }))
  const ctx = vm.onlineBooking ? buildPlanContext(vm.business, vm.ent) : undefined
  return (
    <Card title={s.title || vm.industry.terminology.team}>
      <TeamMembers members={members} variant={(s.variant as "list" | "swipe" | "grid" | "avatars") ?? "list"} ctx={ctx} />
    </Card>
  )
}

function CredentialsWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = vm.business.credentials
  return (
    <Card title={s.title}>
      {s.variant === "list" ? <ul className="grid gap-1.5 text-left">{list.map((c) => <li key={c} className="flex gap-2"><Check aria-hidden="true" className="size-4 shrink-0 mt-0.5" />{c}</li>)}</ul> : <ul className="flex flex-wrap gap-2">{list.map((c) => <li key={c} className="tp-chip gap-1.5"><Check aria-hidden="true" className="size-3.5" />{c}</li>)}</ul>}
    </Card>
  )
}

/* ------------------------------------------------------------------ content */
function TextWidget({ w }: P) {
  const s = w.settings as S
  const paras = str(s.body).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const [first, ...rest] = paras
  return <Card title={s.title} className={cn("tp-text-block", s.align === "center" && "text-center", `tp-text-${s.variant || "body"}`)}>
    {s.variant === "note" ? <Quote aria-hidden="true" className="tp-note-mark" /> : null}
    <div className="tp-text-copy"><p>{first}</p>{s.collapsible && rest.length ? <details className="tp-text-more"><summary>Read more<ChevronDown aria-hidden="true" /></summary><div>{rest.map((p, i) => <p key={i}>{p}</p>)}</div></details> : rest.map((p, i) => <p key={i}>{p}</p>)}</div>
  </Card>
}

function ImageWidget({ w }: P) {
  const s = w.settings as S
  if (!s.image) return null
  const body = (
    <figure>
      <div className={cn("tp-media w-full", s.shape === "square" ? "aspect-square" : s.shape === "wide" ? "aspect-[16/9]" : "aspect-[4/3]")} style={s.shape === "rounded" ? { borderRadius: "var(--tp-card-radius)" } : undefined}><ProfileImage image={s.image} sizes="(min-width:900px) 40rem, 100vw" /></div>
      {s.caption ? <figcaption className="tp-muted mt-1.5 text-sm">{s.caption}</figcaption> : null}
    </figure>
  )
  return isHttpUrl(s.linkUrl) ? <a href={s.linkUrl} target="_blank" rel="noopener noreferrer">{body}</a> : body
}

function GalleryWidget({ w, vm }: P) {
  const s = w.settings as S
  const items = pick(vm.business.gallery, s.itemIds).map((g) => ({ id: g.id, caption: g.caption, image: { src: g.image.src, alt: g.image.alt, width: g.image.width, height: g.image.height, focal: g.image.focal }, before: g.beforeImage ? { src: g.beforeImage.src, alt: g.beforeImage.alt, width: g.beforeImage.width, height: g.beforeImage.height, focal: g.beforeImage.focal } : undefined }))
  const title = s.title ? <h2 className="mb-2 px-1 text-[1.125rem]" style={{ fontFamily: "var(--tp-font-heading)", fontWeight: "var(--tp-heading-weight)", textTransform: "var(--tp-heading-case)" as never }}>{s.title}</h2> : null
  return <div>{title}<Gallery items={items} fit={s.fit === "contain" ? "contain" : "cover"} variant={s.variant === "mosaic" ? "mosaic" : s.variant === "filmstrip" ? "filmstrip" : s.variant === "carousel" ? "carousel" : s.variant === "beforeAfter" ? "beforeAfter" : s.variant === "masonry" ? "masonry" : "grid"} title={s.title} /></div>
}

function VideoWidget({ w }: P) {
  const s = w.settings as S
  return <div>{s.title ? <p className="mb-1.5 px-1 font-semibold">{s.title}</p> : null}<VideoEmbed url={s.url} title={s.title} /></div>
}

function FaqWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = pick(vm.business.faqs, s.faqIds)
  return <Card title={s.title || "Questions"}>
    <div className="tp-faqs" data-faq-layout={s.variant || "list"}>{list.map(f => <details key={f.id} className={s.variant === "cards" ? "tp-tile tp-faq" : "tp-faq"}>
      <summary><span>{f.question}</span><ChevronDown aria-hidden="true" /></summary><div className="tp-faq-answer"><p>{f.answer}</p></div>
    </details>)}</div>
  </Card>
}

/* ------------------------------------------------------------------ info */
const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

function HoursWidget({ w, vm }: P) {
  const s = w.settings as S
  const hours = <Hours hours={DAY_ORDER.map((d) => vm.business.hours.find((h) => h.day === d) ?? { day: d as "mon" })} tz={vm.business.location.timezone || "Europe/London"} variant={s.variant === "compact" ? "compact" : s.variant === "status" ? "status" : "list"} />
  return s.variant === "status" ? hours : <Card title={s.title || "Opening hours"}>{hours}</Card>
}

function LocationWidget({ w, vm }: P) {
  const s = w.settings as S
  const l = vm.business.location
  const compact = s.variant === "compact"
  const address = <address className="tp-visit-address">{l.addressLine ? <p>{l.addressLine}</p> : null}{l.locality ? <p className="tp-muted">{l.locality}</p> : null}</address>
  const directions = s.showDirections && l.directionsUrl
  return <Card title={compact ? undefined : s.title || "Find us"} className={`tp-visit tp-visit-${s.variant || "card"}`}>
    {compact ? <div className="tp-address-row"><MapPin aria-hidden="true" />{address}{directions ? <a href={l.directionsUrl} target="_blank" rel="noopener noreferrer" className="tp-address-action" aria-label="Get directions"><ArrowUpRight aria-hidden="true" /></a> : null}</div> : <>
      {s.variant === "visit" ? <div className="tp-visit-pin" aria-hidden="true"><MapPin /></div> : null}
      {address}
      {directions ? <div className="mt-4"><LinkRow w={w} href={l.directionsUrl!} label="Get directions" icon="MapPin" external variant="compact" /></div> : null}
    </>}
  </Card>
}

function ServiceAreaWidget({ w, vm }: P) {
  const s = w.settings as S
  const areas = (vm.business.location.locality ?? "").split(/,| and /).map((x) => x.trim()).filter(Boolean)
  return <Card title={s.title || "Areas we cover"}><ul className="flex flex-wrap gap-2">{areas.map((a) => <li key={a} className="tp-chip">{a}</li>)}</ul><p className="tp-muted mt-2 text-xs">We come to you.</p></Card>
}

function EnquiryWidget({ w, vm }: P) {
  const s = w.settings as S
  const b = vm.business
  const services = b.services.filter((x) => !x.archived).map((x) => ({ id: x.id, name: x.name }))
  if (s.variant === "inline")
    return (
      <Card title={s.title || "Send us a message"}>
        {s.intro ? <p className="tp-muted mb-3 text-left">{s.intro}</p> : null}
        <EnquiryForm slug={b.identity.slug} businessName={b.identity.name} services={services} submitLabel={str(s.buttonLabel) || "Send message"} />
      </Card>
    )
  return <EnquiryButton variant={s.variant === "card" ? "card" : "button"} label={str(s.buttonLabel) || "Send us a message"} subtitle={str(s.intro) || undefined} title={s.title || "Send us a message"} slug={b.identity.slug} businessName={b.identity.name} services={services} />
}

function ShareWidget({ w, vm }: P) {
  const s = w.settings as S
  return <ShareButton data={{ name: vm.business.identity.name, tagline: vm.business.identity.tagline, slug: vm.business.identity.slug, logo: vm.business.identity.logo?.src, action: vm.onlineBooking ? "Scan to book" : undefined }} label={str(s.label) || "Share this page"} variant={s.variant === "card" ? "card" : "button"} />
}

function AnnouncementWidget({ w }: P) {
  const s = w.settings as S
  const link = isHttpUrl(s.linkUrl) ? s.linkUrl : null
  return (
    <div className="tp-notice" data-tone={s.tone} role="note">
      <Card className="w-full text-left tp-notice-body">
        {s.tone === "warning" ? <TriangleAlert aria-hidden="true" /> : s.tone === "promo" ? <Tag aria-hidden="true" /> : <Megaphone aria-hidden="true" />}<p className={s.tone === "warning" ? "font-semibold" : ""}>{s.text}</p>
        {link ? <a className="mt-1 inline-block font-semibold underline underline-offset-4" href={link} target="_blank" rel="noopener noreferrer">{s.linkLabel || "Learn more"}</a> : null}
      </Card>
    </div>
  )
}

/** The only place a stored widget type becomes a component. Unknown types render nothing. */
export function renderWidgetBody(w: RenderWidget, vm: PageViewModel): React.ReactNode {
  switch (w.type) {
    case "call": case "sms": case "whatsapp": case "email": case "directions": return <ChannelWidget w={w} vm={vm} />
    case "social": return <SocialWidget w={w} vm={vm} />
    case "link": return <LinkWidget w={w} vm={vm} />
    case "document": return <DocumentWidget w={w} vm={vm} />
    case "serviceList": return <ServiceListWidget w={w} vm={vm} />
    case "priceMenu": return <PriceMenuWidget w={w} vm={vm} />
    case "featuredService": return <FeaturedServiceWidget w={w} vm={vm} />
    case "booking": return <BookingWidget w={w} vm={vm} />
    case "products": return <ProductsWidget w={w} vm={vm} />
    case "enquiry": return <EnquiryWidget w={w} vm={vm} />
    case "share": return <ShareWidget w={w} vm={vm} />
    case "offers": return <OffersWidget w={w} vm={vm} />
    case "payment": return <PaymentWidget w={w} vm={vm} />
    case "reviews": return <ReviewsWidget w={w} vm={vm} />
    case "leaveReview": return <LeaveReviewWidget w={w} vm={vm} />
    case "team": return <TeamWidget w={w} vm={vm} />
    case "credentials": return <CredentialsWidget w={w} vm={vm} />
    case "text": return <TextWidget w={w} vm={vm} />
    case "image": return <ImageWidget w={w} vm={vm} />
    case "gallery": return <GalleryWidget w={w} vm={vm} />
    case "video": return <VideoWidget w={w} vm={vm} />
    case "faq": return <FaqWidget w={w} vm={vm} />
    case "hours": return <HoursWidget w={w} vm={vm} />
    case "location": return <LocationWidget w={w} vm={vm} />
    case "serviceArea": return <ServiceAreaWidget w={w} vm={vm} />
    case "announcement": return <AnnouncementWidget w={w} vm={vm} />
  }
}

