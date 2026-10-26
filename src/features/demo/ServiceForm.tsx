"use client"

import * as React from "react"
import { ServiceInclusions } from "./ServiceInclusions"
import { isHttpUrl } from "@/lib/validation"
import { ImageField } from "@/features/page/editor/controls"
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
  contact: "Enquiry only: no time is reserved",
  request: "Customer requests a time and I accept it",
  instant: "Customer books a time and it is confirmed",
}

export function serviceErrors(s: ServiceContent): Partial<Record<"name" | "price" | "duration" | "link" | "inclusions", string>> {
  const e: Partial<Record<"name" | "price" | "duration" | "link" | "inclusions", string>> = {}
  if (!s.name.trim()) e.name = "Give the service a name."
  if ((s.priceMode === "fixed" || s.priceMode === "from") && s.priceMinor === undefined) e.price = "Enter a price, or choose “Quote on request”."
  if (!s.externalUrl && s.bookingMode === "instant" && !s.durationMinutes) e.duration = "Instant booking needs a duration."
  if (s.externalUrl && !isHttpUrl(s.externalUrl)) e.link = "Enter a full web address starting with https://."
  if ((s.inclusions?.length ?? 0)>8) e.inclusions="Use up to eight included items."
  else if (s.inclusions?.some(item=>!item.trim() || item.length>140)) e.inclusions="Fill in each included item, or remove the empty row."
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
      <TaploInput label="Service name" placeholder="e.g. Initial consultation" value={service.name} maxLength={120} error={errors.name} onChange={(e) => set({ name: e.target.value })} />
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
      {needsPrice ? <div className="grid gap-1.5">
        <Label htmlFor={`${id}-unit`}>Price is for</Label>
        <Select value={service.priceUnit ?? "once"} onValueChange={value => set({priceUnit: value === "once" ? undefined : value as ServiceContent["priceUnit"]})}>
          <SelectTrigger id={`${id}-unit`} className="min-h-11 w-full"><SelectValue /></SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="once">This service</SelectItem>
            <SelectItem value="hour">One hour</SelectItem>
            <SelectItem value="session">One session</SelectItem>
            <SelectItem value="month">One month</SelectItem>
            <SelectItem value="course">One course</SelectItem>
          </SelectContent>
        </Select>
      </div> : null}
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
        <Textarea id={`${id}-desc`} placeholder="What’s included, who it’s for, and anything to know before booking." rows={3} maxLength={1200} value={service.description ?? ""} onChange={(e) => set({ description: e.target.value || undefined })} />
      </div>
      <ServiceInclusions items={service.inclusions ?? []} onChange={inclusions=>set({inclusions})} error={errors.inclusions} />
      <details className="rounded-2xl bg-muted/40 px-4 py-2">
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">Service photo (optional)</summary>
        <ImageField label="Service photo" value={service.image} onChange={image => set({ image: image ?? undefined })} defaultAlt={service.name || "Service photo"} purpose="photo" samples={false} />
        {service.image ? <div className="grid gap-1.5 py-3">
          <Label htmlFor={`${id}-image-fit`}>Picture fit</Label>
          <Select value={service.image.fit ?? "cover"} onValueChange={fit => set({image:{...service.image!,fit:fit as "cover"|"contain"}})}>
            <SelectTrigger id={`${id}-image-fit`} className="min-h-11 w-full"><SelectValue /></SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="cover">Fill the space</SelectItem>
              <SelectItem value="contain">Show the whole picture</SelectItem>
            </SelectContent>
          </Select>
        </div> : null}
      </details>
      <details className="px-1 py-2">
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">Use an existing website or booking link</summary>
        <div className="grid gap-4 py-3">
          <TaploInput label="Service link" error={errors.link} type="url" placeholder="https://your-website.com/service" value={service.externalUrl ?? ""} onChange={event => set({externalUrl:event.target.value || undefined})} hint="Customers continue on this website instead of opening the Taplo form." />
          {service.externalUrl ? <TaploInput label="Link text" placeholder="e.g. Get a quote" maxLength={60} value={service.externalLabel ?? ""} onChange={event => set({externalLabel:event.target.value || undefined})} /> : null}
        </div>
      </details>
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
      {!service.externalUrl ? <div className="grid gap-1.5">
        <Label htmlFor={`${id}-book`}>How do customers book?</Label>
        <Select value={service.bookingMode} onValueChange={(v) => set({ bookingMode: v as ServiceContent["bookingMode"] })}>
          <SelectTrigger id={`${id}-book`} className="min-h-11 w-full"><SelectValue /></SelectTrigger>
          <SelectContent position="popper">
            {SERVICE_BOOKING_MODES.map((m) => <SelectItem key={m} value={m}>{BOOKING_LABEL[m]}</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">{service.bookingMode === "contact" ? "Customers send you an enquiry. Nothing is reserved." : service.durationMinutes ? "Customers pick a time from your working hours (Bookings, then Hours and rules). Online booking is part of the Pro plan; no payment is taken." : "Add a duration above so customers have a length of time to book."}</p>
      </div> : null}
    </div>
  )
}
