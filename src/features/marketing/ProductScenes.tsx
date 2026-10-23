import { ArrowRight } from "lucide-react"
import { Shot } from "./Shot"
import { YoursScene } from "./YoursScene"
import { cn } from "@/lib/utils"
import type { ProductPage } from "./product"
import { featureNote, featureState, type FeatureId } from "@/lib/feature-status"

/**
 * One composition per product page, each built differently on purpose: a strip of looks, a journey timeline,
 * a before-and-after, a variant comparison. Every image is a real capture of the page renderer after real
 * clicks (scripts/marketing/capture-states.mjs), never a mock-up.
 */
function Label({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm font-medium text-foreground/70">{children}</p>
}

const LOOKS = [["look-night", "Night"], ["look-journal", "Journal"], ["look-clay", "Clay"], ["look-forge", "Forge"], ["look-orchard", "Orchard"], ["look-showroom", "Showroom"]] as const

function Design() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-24">
      <div>
        <p className="max-w-2xl text-lg text-foreground/70">The same business, six of the nine starting looks. Nothing but the look changed.</p>
        <ul className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:thin]" aria-label="One business in six looks">
          {LOOKS.map(([id, name], n) => (
            <li key={id} className={cn("shrink-0 snap-start", n % 2 === 1 && "mt-10")}>
              <Shot id={id} alt={`The same barber's page in the ${name} look`} width={260} cropTo={400} />
              <Label>{name}</Label>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 md:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="font-display font-display-tight text-[clamp(1.75rem,3.4vw,2.75rem)]">What a look sets</h2>
          <p className="mt-4 text-foreground/70">Each of these is its own control, so you can keep a look and change one thing, or build your own from nothing.</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-5 text-[0.9375rem]">
          {[["Colours", "Page, text, cards, accent, borders."], ["Type", "Heading and body fonts, size, case, weight."], ["Header", "Five layouts, avatar shape and size."], ["Buttons", "Shape, fill, shadow, icons."], ["Cards", "Surface, corners, border, padding."], ["Wallpaper", "Solid, gradient, photo or a gentle animation."]].map(([t, d]) => (<div key={t}><dt className="font-semibold">{t}</dt><dd className="text-foreground/65">{d}</dd></div>))}
        </dl>
      </div>
      <div>
        <h2 className="font-display font-display-tight text-[clamp(1.75rem,3.4vw,2.75rem)]">From a look to your own</h2>
        <div className="mt-10"><YoursScene /></div>
      </div>
    </div>
  )
}

function Services() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-14 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h2 className="sr-only">A service opens a detail</h2>
        <Shot id="svc-detail" alt="A service detail: Signature cut, £34, 45 minutes, with the booking button" width={620} frame="none" className="max-w-full" />
        <Label>Tap a service for the detail. The price wording and the next step are exact.</Label>
        <dl className="mt-8 grid max-w-xl grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[0.9375rem]">
          <dt className="font-semibold">£34</dt><dd className="text-foreground/65">A fixed price.</dd>
          <dt className="font-semibold">From £60</dt><dd className="text-foreground/65">A starting price, when the job varies.</dd>
          <dt className="font-semibold">Quote on request</dt><dd className="text-foreground/65">No number shown, and an enquiry is the next step.</dd>
          <dt className="font-semibold">Free</dt><dd className="text-foreground/65">Said as it is.</dd>
        </dl>
      </div>
      <div className="grid grid-cols-2 gap-5 lg:col-span-5">
        {([["svc-menu-barber", "Menu, dark", "A barber's price menu"], ["svc-menu-cafe", "Menu, warm", "A café's menu"], ["svc-menu-physio", "List, typographic", "A clinic's appointments"], ["svc-menu-gym", "Cards, loud", "A studio's classes and memberships"]] as const).map(([id, label, alt], n) => (
          <figure key={id} className={cn(n % 2 === 1 && "mt-12")}><Shot id={id} alt={alt} width={300} frame="none" className="w-full" /><figcaption className="mt-2 text-sm text-foreground/65">{label}</figcaption></figure>
        ))}
      </div>
    </div>
  )
}

function Booking() {
  const steps = [["bk-1-service", "Choose a service"], ["bk-2-time", "Pick a day and time"], ["bk-3-details", "Add your details"], ["bk-4-review", "Check it"], ["bk-5-done", "Done"]] as const
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-24">
      <ol className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:thin]" aria-label="The booking journey in five steps">
        {steps.map(([id, label], n) => (
          <li key={id} className="w-[19rem] shrink-0 snap-start">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><span className="grid grid-cols-[minmax(0,1fr)] size-6 place-items-center rounded-full bg-foreground text-xs text-background">{n + 1}</span>{label}</p>
            <Shot id={id} alt={`Booking step ${n + 1}: ${label}`} width={304} frame="none" cropTo={n === 1 ? 420 : undefined} className="w-full" />
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display font-display-tight text-[clamp(1.75rem,3.4vw,2.75rem)]">Three outcomes, three sets of words</h2>
          <dl className="mt-8 grid gap-6 text-[0.9375rem]">
            <div><dt className="font-semibold">Confirmed appointment</dt><dd className="mt-1 text-foreground/70">The time is reserved straight away. Buttons say <b>Book this time</b> and <b>Confirm booking</b>.</dd></div>
            <div><dt className="font-semibold">Pending request</dt><dd className="mt-1 text-foreground/70">The business accepts or declines. Buttons say <b>Request this time</b> and <b>Send request</b>, and nothing is called booked.</dd></div>
            <div><dt className="font-semibold">Enquiry</dt><dd className="mt-1 text-foreground/70">No time is reserved. It says so in the form and in the confirmation.</dd></div>
          </dl>
        </div>
        <div>
          <Shot id="bk-request-review" alt="A request review screen that says Pending request, not booked" width={520} frame="none" className="w-full" />
          <Label>A request, reviewed. It never claims the time is booked.</Label>
        </div>
      </div>
      <div>
        <h2 className="font-display font-display-tight text-[clamp(1.75rem,3.4vw,2.75rem)]">The rules behind the times</h2>
        <ul className="mt-8 grid gap-x-12 gap-y-3 text-[0.9375rem] text-foreground/75 sm:grid-cols-2 lg:grid-cols-3">
          {["Working hours for each person", "Breaks, leave and one-off dates", "Time before and after each appointment", "Minimum notice and how far ahead", "Who can do which service", "Cancel and move rules, in plain words", "Your time zone, with clock changes", "The customer's own time when it differs", "No two bookings for the same time"].map((r) => <li key={r} className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-signal" />{r}</li>)}
        </ul>
      </div>
    </div>
  )
}

function Team() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-20">
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 md:grid-cols-3">
        <figure><Shot id="team-swipe" alt="A team as a swipe row of portrait cards" width={300} frame="none" className="w-full" /><Label>Swipe: for a handful of people.</Label></figure>
        <figure className="md:mt-16"><Shot id="team-grid" alt="A team as a grid of portrait cards" width={300} frame="none" className="w-full" /><Label>Grid: for a small clinic.</Label></figure>
        <figure className="md:mt-32"><Shot id="team-list" alt="A team as a compact list" width={300} frame="none" className="w-full" /><Label>List: when space matters.</Label></figure>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="font-display font-display-tight text-[clamp(1.75rem,3.4vw,2.75rem)]">Open a card for the whole story</h2>
          <p className="mt-4 text-lg text-foreground/70">Biography, the services they provide with prices, qualifications you supplied, the days they work and the next free day. Then book with them.</p>
          <p className="mt-4 text-[0.9375rem] text-foreground/60">No photo yet? A plain silhouette shows until you add one. Phone numbers and email addresses are never shown on a profile.</p>
        </div>
        <div className="lg:col-span-7"><Shot id="team-profile" alt="An expanded team profile with services, qualifications and a Book with button" width={680} frame="none" className="w-full" /></div>
      </div>
    </div>
  )
}

function Products() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-14 lg:grid-cols-12">
      <div className="lg:col-span-5"><Shot id="prod-swipe" alt="A row of products with prices and facts" width={420} frame="none" className="w-full" /><Label>Products in a swipe row, so a short page stays short.</Label></div>
      <div className="lg:col-span-7">
        <Shot id="prod-detail-affiliate" alt="A product detail that says it is an affiliate link and opens the maker's shop" width={680} frame="none" className="w-full" />
        <Label>A product you recommend but do not sell sends people to the maker, and says so.</Label>
        <p className="mt-8 max-w-xl text-[0.9375rem] leading-relaxed text-foreground/70">There is no checkout on Taplo yet, and nothing pretends there is. A product either takes an enquiry or opens a shop you already use, in a new tab.</p>
      </div>
    </div>
  )
}

function Vehicles() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-14 lg:grid-cols-12">
      <div className="lg:col-span-4"><Shot id="cap-vehicles" alt="Vehicle cards with year, mileage, fuel and gearbox" width={360} cropTo={820} frame="none" className="w-full" /><Label>The list: facts first, then the price.</Label></div>
      <div className="lg:col-span-8">
        <Shot id="veh-detail" alt="A vehicle detail with photos, specifications and an enquiry button" width={720} frame="none" className="w-full" />
        <Label>The detail: every photo, every specification and a clear way to ask.</Label>
        <ul className="mt-8 flex flex-wrap gap-2 text-sm"><li className="rounded-full border border-foreground/15 px-3 py-1">Available</li><li className="rounded-full border border-foreground/15 px-3 py-1">Reserved</li><li className="rounded-full border border-foreground/15 px-3 py-1">Sold</li></ul>
        <p className="mt-3 max-w-xl text-[0.9375rem] text-foreground/65">A reserved or sold car stays on the page with its status, so the stock list tells the truth.</p>
      </div>
    </div>
  )
}

function GalleryReviews() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-14 lg:grid-cols-12">
      <div className="lg:col-span-8"><Shot id="gal-lightbox" alt="A photo open in the full-screen viewer with arrows and zoom" width={760} frame="none" className="w-full" /><Label>Arrow keys, swipe and zoom. Closing returns you to the photo you opened.</Label></div>
      <div className="lg:col-span-4"><Shot id="rev-quote" alt="A customer quote shown with who supplied it" width={340} frame="none" className="w-full" /><Label>Every quote says who supplied it.</Label>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-foreground/65">Taplo never invents a review or a rating. A star rating only appears when it comes from a real source you name.</p></div>
    </div>
  )
}

function Enquiries() {
  return (
    <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-center">
      <figure><Shot id="enq-inline" alt="A contact form on the page" width={340} frame="none" className="w-full" /><Label>The form on the page.</Label></figure>
      <ArrowRight aria-hidden="true" className="size-8 shrink-0 rotate-90 text-foreground/40 md:mt-40 md:rotate-0" />
      <figure className="md:mt-10"><Shot id="enq-sent" alt="The confirmation after sending, which says no time was reserved" width={340} frame="none" className="w-full" /><Label>The confirmation: honest about what happened.</Label></figure>
    </div>
  )
}

function Sharing() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-12">
      <div className="lg:col-span-5"><Shot id="share-sheet" alt="The share sheet with a link, a QR code and download buttons" width={440} frame="none" className="w-full" /></div>
      <div className="lg:col-span-7">
        <h2 className="font-display font-display-tight text-[clamp(1.75rem,3.4vw,2.75rem)]">Four ways to put it in front of people</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2">{[["Copy the link", "For a bio, a message or an email."], ["Print the QR code", "A print-ready SVG for the window, the van or a menu."], ["Make a share image", "Your name and link in one picture for social posts."], ["Share from your phone", "Straight into any app, where your phone supports it."]].map(([t, d], n) => (<li key={t}><p className="font-display text-3xl tabular-nums text-foreground/25">{String(n + 1).padStart(2, "0")}</p><p className="mt-1 font-semibold">{t}</p><p className="text-[0.9375rem] text-foreground/65">{d}</p></li>))}</ol>
      </div>
    </div>
  )
}

const MESSAGE_KINDS: { id: FeatureId; kind: string; from: string; text: string; who: string }[] = [
  { id: "textApp", kind: "Text us", from: "Opens the customer’s own messages app", text: "Hi Marlowe & Finch, I’d like to ask about your services.", who: "The customer reads it, edits it and sends it from their own phone." },
  { id: "enquiryInbox", kind: "Enquiry", from: "Sent from the contact form", text: "Thanks. Marlowe & Finch will reply to the number you gave. Nothing is reserved.", who: "Kept in the owner’s dashboard with the customer’s details." },
  { id: "appointmentMessages", kind: "Appointment message", from: "Sent by the business, about one booking", text: "Confirmed: Signature cut with Jonah, Thursday 23 October at 10:30.", who: "Confirmations, changes and cancellations." },
  { id: "reminders", kind: "Reminder", from: "Sent before the appointment", text: "Reminder: Signature cut tomorrow at 10:30. Reply to change it.", who: "A nudge that cuts missed appointments." },
  { id: "promotions", kind: "Offer", from: "Sent only to customers who opted in", text: "Spring offer: 10% off a first cut. Reply STOP to opt out.", who: "Needs consent, and a clear way out, every time." },
]

function Messages() {
  return (
    <ol className="grid grid-cols-[minmax(0,1fr)] gap-px overflow-hidden rounded-3xl bg-foreground/10" aria-label="The five kinds of message">
      {MESSAGE_KINDS.map((m, n) => {
        const live = featureState(m.id) === "works"
        return (
          <li key={m.id} className="grid grid-cols-[minmax(0,1fr)] items-center gap-6 bg-background p-6 sm:p-8 md:grid-cols-[3rem_1fr_1.2fr]" data-testid="message-kind" data-state={live ? "works" : "needs"}>
            <p className="font-display text-4xl tabular-nums text-foreground/20 max-md:hidden">{n + 1}</p>
            <div>
              <h2 className="font-display font-display-tight text-[clamp(1.5rem,2.6vw,2.125rem)]">{m.kind}</h2>
              <p className="mt-1 text-foreground/65">{m.from}</p>
              <p className="mt-3 text-sm text-foreground/60">{m.who}</p>
              <p className={cn("mt-4 inline-flex rounded-full px-3 py-1 text-sm font-medium", live ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900")}>{live ? "Works now" : "Switches on when messaging is connected"}</p>
              {live ? null : <p className="mt-2 max-w-sm text-sm text-foreground/60">{featureNote(m.id)}</p>}
            </div>
            <div className="max-w-md justify-self-start md:justify-self-end">
              <p className={cn("rounded-3xl rounded-bl-md px-5 py-4 text-[0.9375rem] leading-relaxed", live ? "bg-signal text-white" : "bg-foreground/[0.06] text-foreground/80")}>{m.text}</p>
              <p className="mt-2 text-xs text-foreground/50">{live ? "Sample of what the customer sees" : "Sample of what it will say. Nothing is sent yet."}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export const SCENES: Record<ProductPage["slug"], () => React.ReactNode> = {
  design: Design, services: Services, booking: Booking, team: Team, products: Products, vehicles: Vehicles, "gallery-reviews": GalleryReviews, enquiries: Enquiries, sharing: Sharing, messages: Messages,
}
