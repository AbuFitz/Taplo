"use client"

import * as React from "react"
import { ArrowRight, CalendarCheck, CreditCard, Mail, MessageCircle, Phone, Play } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaploButton } from "@/components/taplo/taplo-button"
import { TaploModal } from "@/components/taplo/taplo-modal"
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
  variant?: "button" | "card" | "compact"
  thumbnail?: React.ReactNode
}

/** A page row that opens a themed dialog. Online booking links onward; otherwise it opens the business's own channels. */
export function BookingAction(p: BookingActionProps) {
  const [serviceId, setServiceId] = React.useState<string>(p.preselect ?? "")
  const service = p.services.find((s) => s.id === serviceId)
  const subject = p.topic ?? service?.name
  const message = subject ? `Hi ${p.businessName}, I'd like to ask about: ${subject}.` : `Hi ${p.businessName}, I'd like to ask about your services.`
  return (
    <TaploModal
      trigger={
        <button type="button" className="tp-btn" data-variant={p.variant ?? "button"}>
          {p.thumbnail ?? <CalendarCheck aria-hidden="true" className="size-5" />}
          <span className="tp-btn-main"><span className="tp-btn-label">{p.label}</span>{p.subtitle ? <span className="tp-btn-sub">{p.subtitle}</span> : null}</span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      }
      title={p.label}
      description={p.onlineBooking ? "Choose a service to continue to booking." : "Choose how you’d like to get in touch."}
    >
      <div className="grid gap-4">
        {p.services.length > 0 && !p.topic ? (
          <div className="grid gap-1.5">
            <Label htmlFor="tp-service">Service</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger id="tp-service" className="min-h-11 w-full"><SelectValue placeholder="Choose a service (optional)" /></SelectTrigger>
              <SelectContent position="popper">{p.services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        ) : null}
        {p.topic ? <p className="text-sm text-tp-muted">About: <strong className="text-tp-fg">{p.topic}</strong></p> : null}
        <div className="grid gap-2">
          {p.onlineBooking ? <TaploButton size="lg" href={`/${p.slug}/book${serviceId ? `?service=${encodeURIComponent(serviceId)}` : ""}`}>Continue to booking <ArrowRight aria-hidden="true" /></TaploButton> : null}
          {p.phone ? <TaploButton tone={p.onlineBooking ? "secondary" : "primary"} size="lg" href={telHref(p.phone)}><Phone aria-hidden="true" /> Call</TaploButton> : null}
          {p.whatsapp ? <TaploButton tone="secondary" size="lg" href={whatsappHref(p.whatsapp, message)} external><MessageCircle aria-hidden="true" /> WhatsApp</TaploButton> : null}
          {p.email ? <TaploButton tone="secondary" size="lg" href={`mailto:${p.email}?subject=${encodeURIComponent(`Enquiry: ${subject ?? p.businessName}`)}&body=${encodeURIComponent(message)}`}><Mail aria-hidden="true" /> Email</TaploButton> : null}
        </div>
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
      description="Demo only — no payment is taken."
    >
      <div className="grid gap-3 text-sm">
        <p role="note" className="rounded-md border border-amber-400 bg-amber-100 px-3 py-2 text-amber-950"><strong>Simulated.</strong> Payments aren’t connected in this demo. On a live Taplo page this opens a secure Stripe checkout and nothing is charged here.</p>
        <p className="text-tp-muted">{summary}</p>
        <TaploButton size="lg" tone="secondary" disabled>Pay now — not available in demo</TaploButton>
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
