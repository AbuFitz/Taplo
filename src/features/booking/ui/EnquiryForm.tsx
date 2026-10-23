"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { TaploInput } from "@/components/taplo/taplo-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { newId, newKey, useBookingState } from "../demo-adapter"
import { submitEnquiry } from "../engine"
import { enquiryInput } from "../types"

type Field = "name" | "email" | "phone" | "message"

/**
 * The contact form: name, a way to reply, and a message. An enquiry reserves no time and is not a booking, and
 * the screen says so. Input is never cleared on an error, a retry cannot create a second enquiry (idempotency key),
 * and in preview mode the confirmation says it was saved in this browser, not sent.
 */
export function EnquiryForm({ slug, businessName, services, serviceId, submitLabel = "Send enquiry", onDone }: { slug: string; businessName: string; services: { id: string; name: string }[]; serviceId?: string; submitLabel?: string; onDone?: () => void }) {
  const { update } = useBookingState(slug)
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", message: "", serviceId: serviceId ?? "" })
  const [errors, setErrors] = React.useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle")
  const key = React.useRef(newKey())
  const sent = React.useRef<HTMLHeadingElement>(null)
  React.useEffect(() => { if (status === "sent") sent.current?.focus() }, [status])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const p = enquiryInput.safeParse({ ...form, serviceId: form.serviceId || undefined })
    if (!p.success) {
      const next: typeof errors = {}
      for (const i of p.error.issues) next[(i.path[0] as Field) ?? "email"] ??= i.message
      setErrors(next)
      return
    }
    setErrors({}); setStatus("sending")
    const ok = update((s) => submitEnquiry(s, p.data, { now: Date.now(), key: key.current, newId: () => newId("enq") }))
    if (!ok) { setStatus("error"); return }
    setStatus("sent"); onDone?.()
  }

  if (status === "sent")
    return (
      <div className="grid gap-3" role="status" data-testid="enquiry-sent">
        <div className="grid size-11 place-items-center rounded-full bg-tp-accent text-tp-accent-fg"><Check aria-hidden="true" className="size-5" /></div>
        <h3 ref={sent} tabIndex={-1} className="font-tp-heading text-xl outline-none">Enquiry sent</h3>
        <p className="text-sm text-tp-muted">{businessName} will reply to the contact details you gave. No time was reserved.</p>
        <p className="text-xs text-tp-muted">Preview mode: saved in this browser only. {businessName} was not emailed or texted.</p>
      </div>
    )

  return (
    <form onSubmit={submit} noValidate className="grid gap-4" data-testid="enquiry-form">
      {status === "error" ? <p role="alert" className="rounded-xl border border-amber-500/50 bg-amber-50 px-3 py-2 text-sm text-amber-950">Your browser could not save this (storage is full or blocked). Your message is still here; try again.</p> : null}
      <TaploInput label="Your name" autoComplete="name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <TaploInput label="Email" type="email" autoComplete="email" inputMode="email" value={form.email} error={errors.email} hint="Email or phone is enough." onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <TaploInput label="Phone (optional)" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} error={errors.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      {services.length > 0 && !serviceId ? (
        <div className="grid gap-1.5">
          <Label htmlFor="enq-service">About (optional)</Label>
          <Select value={form.serviceId} onValueChange={(v) => setForm({ ...form, serviceId: v === "_" ? "" : v })}>
            <SelectTrigger id="enq-service" className="min-h-11 w-full"><SelectValue placeholder="Anything in general" /></SelectTrigger>
            <SelectContent position="popper"><SelectItem value="_">Anything in general</SelectItem>{services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      ) : null}
      <div className="grid gap-1.5">
        <Label htmlFor="enq-message">Your message</Label>
        <Textarea id="enq-message" rows={4} maxLength={1200} value={form.message} aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? "enq-message-err" : undefined} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        {errors.message ? <p id="enq-message-err" role="alert" className="text-sm text-destructive">{errors.message}</p> : null}
      </div>
      <Button type="submit" className="min-h-12" disabled={status === "sending"}>{status === "sending" ? "Sending…" : submitLabel}</Button>
      <p className="text-xs text-tp-muted">Sending this does not reserve a time. {businessName} replies using the details you give.</p>
    </form>
  )
}
