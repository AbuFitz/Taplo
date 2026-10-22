"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TaploInput } from "@/components/taplo/taplo-input"
import { DELIVERY_MODES, PRICE_MODES, SERVICE_BOOKING_MODES, type ServiceContent } from "@/features/businesses/content"

const PRICE_LABEL: Record<(typeof PRICE_MODES)[number], string> = {
  fixed: "Fixed price",
  from: "From (starting price)",
  quote: "Quote on request",
  free: "Free",
}
const DELIVERY_LABEL = { premises: "At my premises", mobile: "I travel to the customer", online: "Online" } as const
const BOOKING_LABEL: Record<(typeof SERVICE_BOOKING_MODES)[number], string> = {
  contact: "Contact me (call / WhatsApp / email)",
  request: "Customer requests a time",
  instant: "Instant booking",
}

export function serviceErrors(s: ServiceContent): Partial<Record<"name" | "price" | "duration", string>> {
  const e: Partial<Record<"name" | "price" | "duration", string>> = {}
  if (!s.name.trim()) e.name = "Give the service a name."
  if ((s.priceMode === "fixed" || s.priceMode === "from") && s.priceMinor === undefined) e.price = "Enter a price, or choose “Quote on request”."
  if (s.bookingMode === "instant" && !s.durationMinutes) e.duration = "Instant booking needs a duration."
  return e
}

const toPounds = (minor?: number) => (minor === undefined ? "" : (minor / 100).toFixed(minor % 100 === 0 ? 0 : 2))

export function ServiceForm({ service, onChange, showErrors }: { service: ServiceContent; onChange: (s: ServiceContent) => void; showErrors?: boolean }) {
  const errors = showErrors ? serviceErrors(service) : {}
  const [price, setPrice] = React.useState(toPounds(service.priceMinor))
  const set = (patch: Partial<ServiceContent>) => onChange({ ...service, ...patch })
  const needsPrice = service.priceMode === "fixed" || service.priceMode === "from"
  const id = service.id

  return (
    <div className="grid gap-4">
      <TaploInput label="Service name" value={service.name} maxLength={120} error={errors.name} onChange={(e) => set({ name: e.target.value })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-mode`}>Price</Label>
          <Select
            value={service.priceMode}
            onValueChange={(v) => {
              const m = v as ServiceContent["priceMode"]
              if (m === "quote" || m === "free") setPrice("")
              set({ priceMode: m, priceMinor: m === "quote" || m === "free" ? undefined : service.priceMinor })
            }}
          >
            <SelectTrigger id={`${id}-mode`} className="min-h-11 w-full"><SelectValue /></SelectTrigger>
            <SelectContent position="popper">
              {PRICE_MODES.map((m) => <SelectItem key={m} value={m}>{PRICE_LABEL[m]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {needsPrice ? (
          <TaploInput
            label="Amount (£)"
            inputMode="decimal"
            value={price}
            error={errors.price}
            onChange={(e) => {
              const raw = e.target.value
              if (!/^\d{0,6}(\.\d{0,2})?$/.test(raw)) return
              setPrice(raw)
              set({ priceMinor: raw === "" || raw === "." ? undefined : Math.round(parseFloat(raw) * 100) })
            }}
          />
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TaploInput
          label="Duration (minutes, optional)"
          inputMode="numeric"
          value={service.durationMinutes?.toString() ?? ""}
          error={errors.duration}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "").slice(0, 4)
            const n = raw ? Math.min(parseInt(raw, 10), 1440) : undefined
            set({ durationMinutes: n && n > 0 ? n : undefined })
          }}
        />
        <TaploInput label="Group (optional)" hint="e.g. Hair, Beard" value={service.group ?? ""} maxLength={80} onChange={(e) => set({ group: e.target.value || undefined })} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-desc`}>Description (optional)</Label>
        <Textarea id={`${id}-desc`} rows={3} maxLength={1200} value={service.description ?? ""} onChange={(e) => set({ description: e.target.value || undefined })} />
      </div>
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-medium">Where does it happen?</legend>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {DELIVERY_MODES.map((d) => (
            <label key={d} className="flex min-h-11 items-center gap-2 text-sm">
              <Checkbox
                checked={service.delivery.includes(d)}
                onCheckedChange={(c) => set({ delivery: c ? [...service.delivery, d] : service.delivery.filter((x) => x !== d) })}
              />
              {DELIVERY_LABEL[d]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-book`}>How do customers book?</Label>
        <Select value={service.bookingMode} onValueChange={(v) => set({ bookingMode: v as ServiceContent["bookingMode"] })}>
          <SelectTrigger id={`${id}-book`} className="min-h-11 w-full"><SelectValue /></SelectTrigger>
          <SelectContent position="popper">
            {SERVICE_BOOKING_MODES.map((m) => <SelectItem key={m} value={m}>{BOOKING_LABEL[m]}</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">Online booking and payments are built in a later phase. For now customers contact you directly.</p>
      </div>
    </div>
  )
}
