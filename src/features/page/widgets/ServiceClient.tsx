"use client"

import * as React from "react"
import { CalendarCheck, Clock, MessageCircle } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { Button } from "@/components/ui/button"
import { EnquiryForm } from "@/features/booking/ui/EnquiryForm"
import { BookingFlow } from "@/features/booking/ui/BookingFlow"
import { OUTCOME, eligibleStaff, isOnlineBookable, modeOf, priceWording, type BookableService, type BookingContext } from "@/features/booking/model"

export interface ServiceGroup { name?: string; items: BookableService[] }
export interface ServiceViewOptions { showPrices: boolean; showDuration: boolean; showDescriptions: boolean }

const mins = (m?: number) => (m ? (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`) : "")

/**
 * Services as the public page shows them: rows, cards, compact rows or a grouped price menu. Every service
 * opens one detail view (description, duration, exact price wording, who provides it, and the right next action).
 * Booking from the detail closes it and opens the booking journey: one overlay at a time.
 */
export function ServiceCollection({ groups, variant, options, ctx, businessName, slug, staffNames }: {
  groups: ServiceGroup[]; variant: "rows" | "cards" | "compact" | "menu"; options: ServiceViewOptions
  ctx?: BookingContext; businessName: string; slug: string; staffNames: Record<string, { id: string; name: string; serviceIds: string[] | null }[]>
}) {
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [book, setBook] = React.useState<string | null>(null)
  const all = groups.flatMap((g) => g.items)
  const svc = all.find((s) => s.id === openId) ?? null
  const open = (id: string) => () => setOpenId(id)
  const price = (s: BookableService) => (options.showPrices ? priceWording(s) : "")

  const row = (s: BookableService) => (
    <button type="button" className="tp-service-open" onClick={open(s.id)} aria-haspopup="dialog" data-testid="service-open">
      {variant === "cards" ? (
        <span className="grid gap-1 text-left">
          <span className="font-semibold leading-snug">{s.name}</span>
          {options.showDescriptions && s.description ? <span className="tp-muted text-sm tp-clamp">{s.description}</span> : null}
          <span className="mt-1 text-sm"><span className="tp-price">{price(s)}</span>{options.showDuration && s.durationMinutes ? <span className="tp-muted"> · {mins(s.durationMinutes)}</span> : null}</span>
        </span>
      ) : variant === "menu" ? (
        <span className="grid gap-0.5 text-left">
          <span className="flex items-baseline gap-2"><span className="font-semibold [overflow-wrap:anywhere]">{s.name}</span><span aria-hidden="true" className="tp-leader" /><span className="tp-price">{price(s)}</span></span>
          {options.showDescriptions && s.description ? <span className="tp-muted text-sm">{s.description}</span> : null}
        </span>
      ) : (
        <span className="tp-row">
          <span className="min-w-0 text-left">
            <span className="block font-semibold leading-snug [overflow-wrap:anywhere]">{s.name}</span>
            {variant !== "compact" && options.showDescriptions && s.description ? <span className="tp-muted block text-sm tp-clamp">{s.description}</span> : null}
            {variant !== "compact" && options.showDuration && s.durationMinutes ? <span className="tp-muted block text-xs">{mins(s.durationMinutes)}</span> : null}
          </span>
          {options.showPrices ? <span className="tp-price text-right">{price(s)}</span> : null}
        </span>
      )}
    </button>
  )

  return (
    <>
      <div className={variant === "menu" ? "grid gap-5" : undefined}>
        {groups.map((g) => (
          <div key={g.name ?? "all"}>
            {g.name ? <h3 className="tp-group-title">{g.name}</h3> : null}
            {variant === "cards" ? <ul className="tp-rows tp-cards-grid">{g.items.map((s) => <li key={s.id} className="tp-subcard">{row(s)}</li>)}</ul>
              : variant === "menu" ? <ul className="grid gap-2.5">{g.items.map((s) => <li key={s.id}>{row(s)}</li>)}</ul>
              : <ul className="tp-rows">{g.items.map((s) => <li key={s.id}>{row(s)}</li>)}</ul>}
          </div>
        ))}
      </div>

      <Overlay tone="page" kind="detail" open={svc !== null} onOpenChange={(o) => !o && setOpenId(null)} title={svc?.name ?? "Service"} description={svc ? [priceWording(svc), mins(svc.durationMinutes)].filter(Boolean).join(" · ") : undefined} testId="service-detail">
        {svc ? <Detail s={svc} ctx={ctx} businessName={businessName} slug={slug} providers={staffNames[svc.id] ?? []} onBook={() => { setOpenId(null); setBook(svc.id) }} /> : null}
      </Overlay>
      {ctx ? <BookingFlow ctx={ctx} serviceId={book ?? undefined} open={book !== null} onOpenChange={(o) => !o && setBook(null)} key={book ?? "none"} title={book ? `Book ${all.find((s) => s.id === book)?.name ?? ""}` : undefined} /> : null}
    </>
  )
}

function Detail({ s, ctx, businessName, slug, providers, onBook }: { s: BookableService; ctx?: BookingContext; businessName: string; slug: string; providers: { id: string; name: string }[]; onBook: () => void }) {
  const m = modeOf(s)
  const canBook = Boolean(ctx && isOnlineBookable(s) && eligibleStaff(ctx, s).length > 0)
  return (
    <div className="grid gap-4">
      {s.description ? <p className="leading-relaxed [overflow-wrap:anywhere]">{s.description}</p> : null}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-2xl border border-tp-border bg-tp-surface p-4 text-sm">
        <div><dt className="text-tp-muted">Price</dt><dd className="font-semibold">{priceWording(s)}</dd></div>
        {s.durationMinutes ? <div><dt className="text-tp-muted">Time</dt><dd className="flex items-center gap-1 font-semibold"><Clock aria-hidden="true" className="size-3.5" />{mins(s.durationMinutes)}</dd></div> : null}
        <div className="col-span-2"><dt className="text-tp-muted">How it works</dt><dd className="font-medium">{m === "instant" ? "Pick a time and it is confirmed straight away." : m === "request" ? "Pick a time and send a request. It is confirmed when the business accepts it." : "Arranged with the business directly. Send an enquiry; no time is reserved."}</dd></div>
        {providers.length > 0 ? <div className="col-span-2"><dt className="text-tp-muted">Provided by</dt><dd className="font-medium">{providers.map((p) => p.name).join(", ")}</dd></div> : null}
      </dl>
      {canBook ? <Button className="min-h-12 bg-tp-accent text-tp-accent-fg hover:bg-tp-accent/90" onClick={onBook}><CalendarCheck />{m === "instant" ? "Book this" : "Request this"}</Button> : (
        <section aria-labelledby={`enq-${s.id}`} className="grid gap-3">
          <h3 id={`enq-${s.id}`} className="flex items-center gap-2 font-semibold"><MessageCircle aria-hidden="true" className="size-4" />{OUTCOME.contact.choose} about {s.name}</h3>
          <EnquiryForm slug={slug} businessName={businessName} services={[{ id: s.id, name: s.name }]} serviceId={s.id} />
        </section>
      )}
    </div>
  )
}
