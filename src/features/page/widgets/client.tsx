"use client"

import * as React from "react"
import { ArrowRight, CalendarCheck, CreditCard, Mail, MessageCircle, Phone, Play } from "lucide-react"
import { TaploButton } from "@/components/taplo/taplo-button"
import { TaploModal } from "@/components/taplo/taplo-modal"
import { BookingFlow } from "@/features/booking/ui/BookingFlow"
import { EnquiryForm } from "@/features/booking/ui/EnquiryForm"
import type { BookingContext } from "@/features/booking/model"
import { telHref, videoEmbed, whatsappHref } from "@/lib/validation"
import { cn } from "@/lib/utils"

export interface BookingChoice { id: string; name: string }

export interface BookingActionProps {
  businessName: string
  slug: string
  label: string
  subtitle?: string
  services: BookingChoice[]
  preselect?: string | null
  phone?: string
  whatsapp?: string
  email?: string
  onlineBooking: boolean
  /** "Ask about: X" context, e.g. a product. */
  topic?: string
  item?: { id: string; kind: "product" | "vehicle" }
  variant?: "button" | "card" | "compact"
  /** Render as the page's main action (large, accent). */
  hero?: boolean
  thumbnail?: React.ReactNode
  /** Present when online booking is available: opens the stepped booking journey instead of the channel list. */
  booking?: BookingContext
  /** Open the journey with this person already chosen. */
  staffId?: string
}

/** A page row that opens a themed dialog. Online booking links onward; otherwise it opens the business's own channels. */
export function BookingAction(p: BookingActionProps) {
  const service = p.services.find((s) => s.id === p.preselect)
  const subject = p.topic ?? service?.name
  const message = subject ? `Hi ${p.businessName}, I'd like to ask about: ${subject}.` : `Hi ${p.businessName}, I'd like to ask about your services.`
  const trigger = p.variant === "card" ? (
    <button type="button" className="tp-tile tp-booking-tile" data-variant="card">
      <span className="tp-booking-tile-top">{p.thumbnail ?? <CalendarCheck aria-hidden="true" />}<ArrowRight aria-hidden="true" /></span>
      <span className="tp-booking-tile-title">{p.label}</span>
      {p.subtitle ? <span className="tp-muted tp-booking-tile-sub">{p.subtitle}</span> : null}
      <span className="tp-booking-tile-action">{p.booking ? "Find a time" : "Get in touch"}<ArrowRight aria-hidden="true" /></span>
    </button>
  ) : (
    <button type="button" className="tp-btn" data-variant={p.variant ?? "button"} {...(p.hero ? { "data-primary": "", "data-hero": "" } : {})}>
      {p.thumbnail ?? <CalendarCheck aria-hidden="true" className="size-5" />}
      <span className="tp-btn-main"><span className="tp-btn-label">{p.label}</span>{p.subtitle ? <span className="tp-btn-sub">{p.subtitle}</span> : null}</span>
      <ArrowRight aria-hidden="true" className="size-4" />
    </button>
  )
  // Appointments: the stepped journey. A product enquiry (`topic`) is not a booking, so it keeps the contact dialog.
  if (p.booking && !p.topic) return <BookingFlow ctx={p.booking} trigger={trigger} serviceId={p.preselect ?? undefined} staffId={p.staffId} title={p.label} />
  const hasChannel = Boolean(p.phone || p.whatsapp || p.email)
  return (
    <TaploModal trigger={trigger} title={p.topic ? `Ask about ${p.topic}` : p.label} description={hasChannel ? "Choose how you’d like to get in touch, or send a message." : "Send a message and the business will reply."}>
      <div className="grid gap-4">
        {p.topic ? <p className="text-sm text-tp-muted">About: <strong className="text-tp-fg">{p.topic}</strong></p> : null}
        {hasChannel ? (
          <div className="grid gap-2">
            {p.phone ? <TaploButton tone="primary" size="lg" href={telHref(p.phone)}><Phone aria-hidden="true" /> Call</TaploButton> : null}
            {p.whatsapp ? <TaploButton tone="secondary" size="lg" href={whatsappHref(p.whatsapp, message)} external><MessageCircle aria-hidden="true" /> WhatsApp</TaploButton> : null}
            {p.email ? <TaploButton tone="secondary" size="lg" href={`mailto:${p.email}?subject=${encodeURIComponent(`Enquiry: ${subject ?? p.businessName}`)}&body=${encodeURIComponent(message)}`}><Mail aria-hidden="true" /> Email</TaploButton> : null}
          </div>
        ) : null}
        <details className="rounded-xl border border-tp-border p-3 [&[open]>summary]:mb-3" open={!hasChannel}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center font-semibold [&::-webkit-details-marker]:hidden">Send a message instead</summary>
          <EnquiryForm slug={p.slug} businessName={p.businessName} services={p.services} serviceId={p.preselect ?? undefined} topic={p.topic} item={p.item} />
        </details>
      </div>
    </TaploModal>
  )
}
/** Payments are not connected: this is a clearly labelled simulation so the journey can be reviewed. */
export function PaymentAction({ label, summary, thumbnail }: { label: string; summary: string; thumbnail?: React.ReactNode }) {
  return (
    <TaploModal
      trigger={
        <button type="button" className="tp-btn" data-variant="button">
          {thumbnail ?? <CreditCard aria-hidden="true" className="size-5" />}
          <span className="tp-btn-main"><span className="tp-btn-label">{label}</span></span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      }
      title={label}
      description="Demo only. No payment is taken."
    >
      <div className="grid gap-3 text-sm">
        <p role="note" className="rounded-md border border-amber-400 bg-amber-100 px-3 py-2 text-amber-950"><strong>Simulated.</strong> Payments aren’t connected in this demo. On a live Taplo page this opens a secure Stripe checkout and nothing is charged here.</p>
        <p className="text-tp-muted">{summary}</p>
        <TaploButton size="lg" tone="secondary" disabled>Pay now (unavailable in demo)</TaploButton>
      </div>
    </TaploModal>
  )
}

/** Nothing from YouTube/Vimeo loads until the visitor taps play (privacy + performance). */
export function VideoEmbed({ url, title }: { url: string; title?: string }) {
  const [on, setOn] = React.useState(false)
  const v = videoEmbed(url)
  if (!v) return null
  return (
    <div className={cn("tp-media aspect-video w-full")}>
      {on ? (
        <iframe title={title || "Video"} src={v.embedUrl} className="absolute inset-0 size-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="absolute inset-0 grid place-content-center justify-items-center gap-1 text-white" style={{ background: "linear-gradient(135deg,#111,#3b3b3b)" }}>
          <span className="grid size-14 place-items-center rounded-full bg-white text-black"><Play aria-hidden="true" className="ml-0.5 size-6" /></span>
          <span className="mt-1 text-sm font-semibold">Play video{title ? `: ${title}` : ""}</span>
          <span className="text-xs">Loads {v.provider === "youtube" ? "YouTube" : "Vimeo"} when you press play</span>
        </button>
      )}
    </div>
  )
}


export interface DetailImage { src: string; alt: string; focal?: { x: number; y: number } }

/**
 * Item detail view (products, vehicles). It opens in the page's own themed dialog, so it inherits the
 * page's colours, type and corner style, and in the editor preview it stays inside the preview frame.
 */
export function ItemDetail({ trigger, title, price, status, facts, description, images, cta }: {
  trigger: React.ReactNode
  title: string
  price?: string
  status?: string
  facts: { label: string; value: string }[]
  description?: string
  images: DetailImage[]
  cta: React.ReactNode
}) {
  const [i, setI] = React.useState(0)
  const img = images[i]
  return (
    <TaploModal trigger={trigger} title={title} description={[price, status].filter(Boolean).join(" · ") || undefined} wide>
      <div className="grid gap-4">
        {img ? (
          <div className="grid gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} className="aspect-[4/3] w-full rounded-[var(--tp-radius-md,0.75rem)] object-cover" style={img.focal ? { objectPosition: `${img.focal.x}% ${img.focal.y}%` } : undefined} />
            {images.length > 1 ? (
              <ul className="flex gap-2 overflow-x-auto" aria-label="Pictures">
                {images.map((m, n) => (
                  <li key={m.src + n} className="shrink-0">
                    <button type="button" onClick={() => setI(n)} aria-label={`Show picture ${n + 1} of ${images.length}`} aria-current={n === i} className={cn("block size-16 overflow-hidden rounded-lg border-2 outline-none focus-visible:ring-2 focus-visible:ring-tp-accent", n === i ? "border-tp-accent" : "border-transparent opacity-80")}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.src} alt="" className="size-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        {facts.length ? (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
            {facts.map((f) => <div key={f.label}><dt className="text-tp-muted">{f.label}</dt><dd className="font-semibold">{f.value}</dd></div>)}
          </dl>
        ) : null}
        {description ? <p className="text-sm leading-relaxed text-tp-muted">{description}</p> : null}
        <div className="grid gap-2">{cta}</div>
      </div>
    </TaploModal>
  )
}
