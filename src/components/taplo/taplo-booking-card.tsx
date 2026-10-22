"use client"

import * as React from "react"
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { telHref, whatsappHref } from "@/lib/validation"
import { TaploButton } from "./taplo-button"
import { TaploModal } from "./taplo-modal"
import { TaploCard } from "./taplo-card"
import { cn } from "@/lib/utils"

export interface BookingChoice {
  id: string
  name: string
}

export interface BookingCardProps {
  businessName: string
  slug: string
  heading: string
  body: string
  ctaLabel: string
  services: BookingChoice[]
  phone?: string
  whatsapp?: string
  email?: string
  /** True only when real online booking is entitled and configured. */
  onlineBooking: boolean
  className?: string
}

/**
 * Request / booking entry point.
 * - Online booking ready: links into the booking flow with the chosen service.
 * - Otherwise: a themed dialog that opens the business's own enabled channels
 *   with the chosen service pre-filled. No form is faked; nothing is submitted
 *   to a backend that does not exist yet.
 */
export function TaploBookingCard(props: BookingCardProps) {
  return (
    <TaploCard className={cn("p-6 sm:p-8", props.className)}>
      <h3 className="font-tp-heading text-2xl font-semibold">{props.heading}</h3>
      <p className="mt-2 max-w-prose text-tp-muted">{props.body}</p>
      <div className="mt-5">
        <BookingTrigger {...props} />
      </div>
    </TaploCard>
  )
}

export function BookingTrigger({
  businessName,
  slug,
  ctaLabel,
  services,
  phone,
  whatsapp,
  email,
  onlineBooking,
  tone = "primary",
}: BookingCardProps & { tone?: "primary" | "secondary" }) {
  const [serviceId, setServiceId] = React.useState<string>("")
  const service = services.find((s) => s.id === serviceId)
  const message = service
    ? `Hi ${businessName}, I'd like to ask about: ${service.name}.`
    : `Hi ${businessName}, I'd like to ask about your services.`

  return (
    <TaploModal
      trigger={
        <TaploButton tone={tone} size="lg">
          {ctaLabel} <ArrowRight aria-hidden="true" />
        </TaploButton>
      }
      title={ctaLabel}
      description={onlineBooking ? "Choose a service to continue to booking." : "Pick a service, then contact us your preferred way."}
    >
      <div className="grid gap-4">
        {services.length > 0 ? (
          <div className="grid gap-1.5">
            <Label htmlFor="tp-service">Service</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger id="tp-service" className="min-h-11 w-full">
                <SelectValue placeholder="Choose a service (optional)" />
              </SelectTrigger>
              <SelectContent position="popper">
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="grid gap-2">
          {onlineBooking ? (
            <TaploButton size="lg" href={`/${slug}/book${serviceId ? `?service=${encodeURIComponent(serviceId)}` : ""}`}>
              Continue to booking <ArrowRight aria-hidden="true" />
            </TaploButton>
          ) : null}
          {phone ? (
            <TaploButton tone={onlineBooking ? "secondary" : "primary"} size="lg" href={telHref(phone)}>
              <Phone aria-hidden="true" /> Call
            </TaploButton>
          ) : null}
          {whatsapp ? (
            <TaploButton tone="secondary" size="lg" href={whatsappHref(whatsapp, message)} external>
              <MessageCircle aria-hidden="true" /> WhatsApp
            </TaploButton>
          ) : null}
          {email ? (
            <TaploButton
              tone="secondary"
              size="lg"
              href={`mailto:${email}?subject=${encodeURIComponent(`Enquiry: ${service?.name ?? businessName}`)}&body=${encodeURIComponent(message)}`}
            >
              <Mail aria-hidden="true" /> Email
            </TaploButton>
          ) : null}
        </div>
      </div>
    </TaploModal>
  )
}
