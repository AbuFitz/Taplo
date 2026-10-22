import * as React from "react"
import { SocialIcon } from "./social-icons"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import type { ProductContent } from "@/features/businesses/content"
import { formatDuration, formatMoney, formatPrice, groupServices } from "@/features/services/format"
import { SOURCE_LABEL } from "@/components/taplo/taplo-review-card"
import { TaploAvatar } from "@/components/taplo/taplo-avatar"
import { isHttpUrl } from "@/lib/validation"
import { cn } from "@/lib/utils"
import type { WidgetType } from "../contracts/widgets"
import { ProfileImage } from "../renderer/ProfileImage"
import type { PageViewModel, RenderWidget } from "../renderer/view-model"
import { BookingAction, PaymentAction, VideoEmbed, type BookingActionProps } from "./client"
import { WidgetIcon } from "./WidgetIcon"

type S = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any -- validated per type by settingsSchemas before reaching a renderer
interface P { w: RenderWidget; vm: PageViewModel }

const str = (v: unknown): string => (typeof v === "string" ? v : "")
const pick = <T extends { id: string }>(all: T[], ids: unknown): T[] => (Array.isArray(ids) ? ids.map((id) => all.find((x) => x.id === id)).filter((x): x is T => Boolean(x)) : all)

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
    <a href={href} className="tp-btn" data-variant={variant ?? "button"} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <Thumb w={w} />
      {!w.appearance.thumbnail ? <WidgetIcon name={icon} className="size-5" /> : null}
      <span className="tp-btn-main"><span className="tp-btn-label">{label}</span>{subtitle && variant !== "compact" ? <span className="tp-btn-sub">{subtitle}</span> : null}</span>
      <ArrowUpRight aria-hidden="true" className="size-4 opacity-70" />
    </a>
  )
}

function bookingProps(vm: PageViewModel, extra: Partial<BookingActionProps> & { label: string }): BookingActionProps {
  const b = vm.business
  return {
    businessName: b.identity.name,
    slug: b.identity.slug,
    services: b.services.map((s) => ({ id: s.id, name: s.name })),
    phone: b.contacts.phone,
    whatsapp: b.contacts.whatsapp,
    email: b.contacts.email,
    onlineBooking: vm.onlineBooking,
    ...extra,
  }
}


/* ------------------------------------------------------------------ contact / links */
const CHANNEL: Partial<Record<WidgetType, { icon: string; label: string; href: (vm: PageViewModel) => string | null; external?: boolean }>> = {
  call: { icon: "Phone", label: "Call us", href: (vm) => vm.actions.find((a) => a.kind === "call")?.href ?? null },
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

const SOCIAL_NAME: Record<string, string> = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", linkedin: "LinkedIn", youtube: "YouTube", x: "X" }

function SocialWidget({ w, vm }: P) {
  const s = w.settings as S
  const links = vm.business.contacts.social.filter((x) => !Array.isArray(s.platforms) || s.platforms.includes(x.platform))
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
function ServiceListWidget({ w, vm }: P) {
  const s = w.settings as S
  let list = pick(vm.business.services, s.serviceIds)
  if (s.group) list = list.filter((x) => x.group === s.group)
  if (s.limit) list = list.slice(0, s.limit)
  if (s.variant === "cards") {
    return (
      <Card title={s.title}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {list.map((x) => (
            <li key={x.id} className="rounded-[calc(var(--tp-card-radius)*0.6)] border p-3" style={{ borderColor: "var(--tp-border)" }}>
              <p className="font-semibold leading-snug">{x.name}</p>
              {s.showDescriptions && x.description ? <p className="tp-muted mt-1 text-sm">{x.description}</p> : null}
              <p className="mt-2 text-sm"><span className="tp-price">{s.showPrices ? formatPrice(x) : ""}</span>{s.showDuration && x.durationMinutes ? <span className="tp-muted"> · {formatDuration(x.durationMinutes)}</span> : null}</p>
            </li>
          ))}
        </ul>
      </Card>
    )
  }
  return (
    <Card title={s.title}>
      <ul className="tp-rows">
        {list.map((x) => (
          <li key={x.id} className="tp-row">
            <div className="min-w-0">
              <p className="font-semibold leading-snug [overflow-wrap:anywhere]">{x.name}</p>
              {s.variant !== "compact" && s.showDescriptions && x.description ? <p className="tp-muted text-sm">{x.description}</p> : null}
              {s.variant !== "compact" && s.showDuration && x.durationMinutes ? <p className="tp-muted text-xs">{formatDuration(x.durationMinutes)}</p> : null}
            </div>
            {s.showPrices ? <p className="tp-price text-right">{formatPrice(x)}</p> : null}
          </li>
        ))}
      </ul>
    </Card>
  )
}

function PriceMenuWidget({ w, vm }: P) {
  const s = w.settings as S
  const groups = groupServices(pick(vm.business.services, s.serviceIds))
  return (
    <Card title={s.title}>
      <div className="grid gap-5">
        {groups.map((g) => (
          <div key={g.name ?? "all"}>
            {g.name ? <h3 className="mb-2 text-sm uppercase tracking-wider tp-muted">{g.name}</h3> : null}
            <ul className="grid gap-2.5">
              {g.items.map((x) => (
                <li key={x.id}>
                  <div className="flex items-baseline gap-2"><span className="font-semibold [overflow-wrap:anywhere]">{x.name}</span><span aria-hidden="true" className="tp-leader" /><span className="tp-price">{formatPrice(x)}</span></div>
                  {s.showDescriptions && x.description ? <p className="tp-muted text-sm">{x.description}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  )
}

function FeaturedServiceWidget({ w, vm }: P) {
  const s = w.settings as S
  const svc = vm.business.services.find((x) => x.id === s.serviceId) ?? vm.business.services[0]
  if (!svc) return null
  return (
    <Card>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider tp-muted">{s.headline || "Featured"}</p>
      <h2 style={{ fontSize: "1.375rem" }}>{svc.name}</h2>
      {svc.description ? <p className="tp-muted mb-2">{svc.description}</p> : null}
      <p className="mb-3"><span className="tp-price">{formatPrice(svc)}</span>{svc.durationMinutes ? <span className="tp-muted"> · {formatDuration(svc.durationMinutes)}</span> : null}</p>
      <BookingAction {...bookingProps(vm, { label: s.ctaLabel || vm.industry.terminology.booking, preselect: svc.id })} />
    </Card>
  )
}

function BookingWidget({ w, vm }: P) {
  const s = w.settings as S
  const props = bookingProps(vm, { label: s.label || vm.industry.terminology.booking, preselect: s.serviceId, thumbnail: w.appearance.thumbnail ? <Thumb w={w} /> : undefined, variant: s.variant === "card" ? "card" : "button", subtitle: s.variant === "card" ? (vm.onlineBooking ? "Pick a service and a time" : "Choose how to get in touch") : undefined })
  return <BookingAction {...props} />
}

function ProductCard({ p, vm }: { p: ProductContent; vm: PageViewModel }) {
  const cta = p.mode === "link" && isHttpUrl(p.linkUrl)
    ? <a className="tp-btn" data-variant="compact" href={p.linkUrl} target="_blank" rel="noopener noreferrer"><span className="tp-btn-main"><span className="tp-btn-label">View</span></span><ArrowUpRight aria-hidden="true" className="size-4" /></a>
    : <BookingAction {...bookingProps(vm, { label: "Ask about this", topic: p.name, variant: "compact" })} />
  return (
    <div className="flex h-full flex-col gap-2">
      {p.image ? <div className="tp-media aspect-square"><ProfileImage image={p.image} sizes="(min-width:900px) 20rem, 45vw" /></div> : null}
      <p className="font-semibold leading-snug">{p.name}</p>
      {p.description ? <p className="tp-muted text-sm">{p.description}</p> : null}
      {p.priceMinor !== undefined ? <p className="tp-price">{formatMoney(p.priceMinor, p.currency)}</p> : null}
      <div className="mt-auto">{cta}</div>
    </div>
  )
}

function ProductsWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = pick(vm.business.products.filter((x) => !x.archived), s.productIds)
  return (
    <Card title={s.title}>
      <ul className={cn("grid gap-4", s.variant === "grid" ? "grid-cols-2" : "grid-cols-1")}>{list.map((p) => <li key={p.id}><ProductCard p={p} vm={vm} /></li>)}</ul>
      <p className="tp-muted mt-3 text-xs">Checkout isn’t built yet: products open an enquiry or your own link.</p>
    </Card>
  )
}

function OffersWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = pick(vm.business.offers.filter((o) => !o.archived && (!o.endsAt || o.endsAt >= vm.ctx.today)), s.offerIds)
  return (
    <Card title={s.title || "Offers"}>
      <ul className="tp-rows">
        {list.map((o) => (
          <li key={o.id}>
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
  const summary = svc ? `${svc.name} — ${formatPrice(svc)}` : "Choose what to pay for at checkout."
  return <PaymentAction label={s.label || "Pay a deposit"} summary={summary} thumbnail={w.appearance.thumbnail ? <Thumb w={w} /> : undefined} />
}

/* ------------------------------------------------------------------ trust / people */
function RatingLine({ vm }: { vm: PageViewModel }) {
  const r = vm.business.rating
  if (!r) return null
  const name = r.source[0]!.toUpperCase() + r.source.slice(1)
  const body = <><span aria-hidden="true">★</span> {r.value.toFixed(1)} · {r.count} on {name}</>
  return r.url ? <a className="mb-2 inline-block text-sm underline underline-offset-4" href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${r.value.toFixed(1)} out of 5 from ${r.count} ${name} reviews`}>{body}</a> : <p className="mb-2 text-sm">{body}</p>
}

function ReviewsWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = pick(vm.business.testimonials, s.testimonialIds)
  const [lead, ...rest] = list
  return (
    <Card title={s.title || vm.industry.terminology.reviews}>
      {s.showRating ? <RatingLine vm={vm} /> : null}
      {s.variant === "quote" && lead ? (
        <figure>
          <blockquote className="text-lg leading-snug" style={{ fontFamily: "var(--tp-font-heading)" }}>“{lead.quote}”</blockquote>
          <figcaption className="tp-muted mt-2 text-sm"><strong className="text-[var(--tp-foreground)]">{lead.author}</strong> · {SOURCE_LABEL[lead.source]}</figcaption>
          {rest.length ? <p className="tp-muted mt-3 text-xs">+ {rest.length} more shared by the business</p> : null}
        </figure>
      ) : (
        <ul className="tp-rows">
          {list.map((t) => (
            <li key={t.id}>
              <blockquote className={s.variant === "compact" ? "text-sm" : ""}>“{t.quote}”</blockquote>
              <p className="tp-muted mt-1 text-sm"><strong className="text-[var(--tp-foreground)]">{t.author}</strong> · {t.sourceUrl ? <a className="underline" href={t.sourceUrl} target="_blank" rel="noopener noreferrer">{SOURCE_LABEL[t.source]}</a> : SOURCE_LABEL[t.source]}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

const PLATFORM = { google: "Google", facebook: "Facebook", trustpilot: "Trustpilot" } as const
function LeaveReviewWidget({ w, vm }: P) {
  const s = w.settings as S
  const links = vm.business.reviewLinks.filter((l) => !Array.isArray(s.platforms) || s.platforms.includes(l.platform))
  return (
    <div className="grid gap-2">
      {links.map((l) => <LinkRow key={l.platform} w={w} href={l.url} label={str(s.label) ? `${s.label} (${PLATFORM[l.platform]})` : `Review us on ${PLATFORM[l.platform]}`} icon="ThumbsUp" external variant="button" />)}
    </div>
  )
}

function TeamWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = pick(vm.business.staff, s.staffIds)
  return (
    <Card title={s.title || vm.industry.terminology.team}>
      {s.variant === "avatars" ? (
        <ul className="flex flex-wrap gap-4">{list.map((m) => <li key={m.id} className="w-24 text-center"><TaploAvatar name={m.name} image={m.photo} size="lg" className="mx-auto !size-20" /><p className="mt-1 text-sm font-semibold leading-tight">{m.name}</p>{m.role ? <p className="tp-muted text-xs">{m.role}</p> : null}</li>)}</ul>
      ) : (
        <ul className="tp-rows">
          {list.map((m) => (
            <li key={m.id} className="flex items-start gap-3 text-left">
              <TaploAvatar name={m.name} image={m.photo} size="md" />
              <div className="min-w-0"><p className="font-semibold leading-tight">{m.name}</p>{m.role ? <p className="tp-muted text-sm">{m.role}</p> : null}{m.bio ? <p className="mt-1 text-sm">{m.bio}</p> : null}
                {m.subjects.length ? <p className="mt-1 flex flex-wrap gap-1.5">{m.subjects.map((x) => <span key={x} className="tp-chip">{x}</span>)}</p> : null}</div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function CredentialsWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = vm.business.credentials
  return (
    <Card title={s.title}>
      {s.variant === "list" ? <ul className="grid gap-1.5 text-left">{list.map((c) => <li key={c} className="flex gap-2"><span aria-hidden="true" className="text-[var(--tp-accent)]">✓</span>{c}</li>)}</ul> : <ul className="flex flex-wrap gap-2">{list.map((c) => <li key={c} className="tp-chip">✓ {c}</li>)}</ul>}
    </Card>
  )
}

/* ------------------------------------------------------------------ content */
function TextWidget({ w }: P) {
  const s = w.settings as S
  const paras = str(s.body).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  return <Card title={s.title} className={s.align === "center" ? "text-center" : ""}><div className="grid gap-3">{paras.map((p, i) => <p key={i} className="[overflow-wrap:anywhere]">{p}</p>)}</div></Card>
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
  const items = pick(vm.business.gallery, s.itemIds)
  const title = s.title ? <h2 className="mb-2 px-1 text-[1.125rem]" style={{ fontFamily: "var(--tp-font-heading)", fontWeight: "var(--tp-heading-weight)", textTransform: "var(--tp-heading-case)" as never }}>{s.title}</h2> : null
  if (s.variant === "carousel") {
    return <div>{title}<ul className="tp-scroller" aria-label={s.title || "Gallery"}>{items.map((g) => <li key={g.id}><div className="tp-media aspect-[4/5]"><ProfileImage image={g.image} sizes="80vw" /></div>{g.caption ? <p className="tp-muted mt-1 text-xs">{g.caption}</p> : null}</li>)}</ul></div>
  }
  if (s.variant === "beforeAfter") {
    return (
      <div>{title}<ul className="grid gap-4">{items.map((g) => (
        <li key={g.id}><div className="grid grid-cols-2 gap-1">
          {g.beforeImage ? <div className="tp-media relative aspect-[4/5]"><ProfileImage image={g.beforeImage} sizes="45vw" /><span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-white">Before</span></div> : null}
          <div className={cn("tp-media relative aspect-[4/5]", !g.beforeImage && "col-span-2 aspect-[4/3]")}><ProfileImage image={g.image} sizes="45vw" />{g.beforeImage ? <span className="absolute left-2 top-2 rounded bg-[var(--tp-accent)] px-1.5 py-0.5 text-xs font-semibold text-[var(--tp-accent-foreground)]">After</span> : null}</div>
        </div>{g.caption ? <p className="tp-muted mt-1 text-xs">{g.caption}</p> : null}</li>))}</ul></div>
    )
  }
  return <div>{title}<ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">{items.map((g) => <li key={g.id}><div className="tp-media aspect-square"><ProfileImage image={g.image} sizes="(min-width:900px) 14rem, 33vw" /></div></li>)}</ul></div>
}

function VideoWidget({ w }: P) {
  const s = w.settings as S
  return <div>{s.title ? <p className="mb-1.5 px-1 font-semibold">{s.title}</p> : null}<VideoEmbed url={s.url} title={s.title} /></div>
}

function FaqWidget({ w, vm }: P) {
  const s = w.settings as S
  const list = pick(vm.business.faqs, s.faqIds)
  return (
    <Card title={s.title || "Questions"}>
      <div>{list.map((f) => (
        <details key={f.id} className="group border-b last:border-b-0" style={{ borderColor: "var(--tp-border)" }}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-2 text-left font-semibold [&::-webkit-details-marker]:hidden">{f.question}<ChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform group-open:rotate-180" /></summary>
          <p className="tp-muted pb-3 text-left">{f.answer}</p>
        </details>
      ))}</div>
    </Card>
  )
}

/* ------------------------------------------------------------------ info */
const DAY: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" }
const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

function HoursWidget({ w, vm }: P) {
  const s = w.settings as S
  // Every day is shown; a day without times reads "Closed" rather than disappearing.
  const hours = DAY_ORDER.map((d) => vm.business.hours.find((h) => h.day === d) ?? { day: d as "mon" })
  return (
    <Card title={s.title || "Opening hours"}>
      <dl className={cn("grid grid-cols-[auto_1fr] gap-x-6 gap-y-1", s.variant === "compact" && "text-sm")}>
        {hours.map((h) => <div key={h.day} className="contents"><dt className="font-medium text-left">{DAY[h.day]}</dt><dd className="tp-muted text-left">{h.opens && h.closes ? `${h.opens}–${h.closes}` : "Closed"}</dd></div>)}
      </dl>
    </Card>
  )
}

function LocationWidget({ w, vm }: P) {
  const s = w.settings as S
  const l = vm.business.location
  return (
    <Card title={s.title || "Find us"}>
      <address className="not-italic text-left">{l.addressLine ? <p>{l.addressLine}</p> : null}{l.locality ? <p className="tp-muted">{l.locality}</p> : null}</address>
      {s.showDirections && l.directionsUrl ? <div className="mt-3"><LinkRow w={w} href={l.directionsUrl} label="Get directions" icon="MapPin" external variant="compact" /></div> : null}
    </Card>
  )
}

function ServiceAreaWidget({ w, vm }: P) {
  const s = w.settings as S
  const areas = (vm.business.location.locality ?? "").split(/,| and /).map((x) => x.trim()).filter(Boolean)
  return <Card title={s.title || "Areas we cover"}><ul className="flex flex-wrap gap-2">{areas.map((a) => <li key={a} className="tp-chip">{a}</li>)}</ul><p className="tp-muted mt-2 text-xs">We travel to you. A private address is never published.</p></Card>
}

function AnnouncementWidget({ w }: P) {
  const s = w.settings as S
  const link = isHttpUrl(s.linkUrl) ? s.linkUrl : null
  return (
    <div className="tp-notice" data-tone={s.tone} role="note">
      <Card className="w-full text-left">
        <p className={s.tone === "warning" ? "font-semibold" : ""}>{s.tone === "promo" ? "✦ " : s.tone === "warning" ? "⚠ " : ""}{s.text}</p>
        {link ? <a className="mt-1 inline-block font-semibold underline underline-offset-4" href={link} target="_blank" rel="noopener noreferrer">{s.linkLabel || "Learn more"}</a> : null}
      </Card>
    </div>
  )
}

/** The only place a stored widget type becomes a component. Unknown types render nothing. */
export function renderWidgetBody(w: RenderWidget, vm: PageViewModel): React.ReactNode {
  switch (w.type) {
    case "call": case "whatsapp": case "email": case "directions": return <ChannelWidget w={w} vm={vm} />
    case "social": return <SocialWidget w={w} vm={vm} />
    case "link": return <LinkWidget w={w} vm={vm} />
    case "document": return <DocumentWidget w={w} vm={vm} />
    case "serviceList": return <ServiceListWidget w={w} vm={vm} />
    case "priceMenu": return <PriceMenuWidget w={w} vm={vm} />
    case "featuredService": return <FeaturedServiceWidget w={w} vm={vm} />
    case "booking": return <BookingWidget w={w} vm={vm} />
    case "products": return <ProductsWidget w={w} vm={vm} />
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

