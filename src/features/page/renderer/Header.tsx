import { ArrowUpRight, CalendarCheck, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { BookingAction } from "../widgets/client"
import { bookingProps } from "../widgets/renderers"
import { ProfileImage } from "./ProfileImage"
import { ProfileMark } from "./ProfileMark"
import type { PageAction, PageViewModel } from "./view-model"

const ICON = { book: CalendarCheck, call: Phone, whatsapp: MessageCircle, email: Mail } as const
const WIDGET_FOR: Partial<Record<PageAction["kind"], string>> = { call: "call", whatsapp: "whatsapp", email: "email" }

function Avatar({ vm }: { vm: PageViewModel }) {
  const { spec } = vm.style
  const { identity } = vm.business
  return <ProfileMark image={identity.logo} name={identity.name} shape={spec.header.avatarShape} size={spec.header.avatarSize} priority />
}

/** Channels the owner already placed as their own widget are not repeated in the header. */
function headerActions(vm: PageViewModel) {
  const placed = new Set(vm.visible.map((w) => w.type as string))
  const icons = vm.style.spec.header.actions === "icons"
  // In icons mode a booking link would repeat the booking widget that is still on the page.
  return vm.actions.filter((a) => !(WIDGET_FOR[a.kind] && placed.has(WIDGET_FOR[a.kind]!)) && !(icons && a.kind === "book" && placed.has("booking")))
}

const external = (kind: PageAction["kind"]) => (kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})

function IconActions({ vm, list, label }: { vm: PageViewModel; list: PageAction[]; label: string }) {
  void vm
  return (
    <ul className="tp-actions tp-quick" aria-label={label}>
      {list.map((a) => {
        const I = ICON[a.kind]
        return <li key={a.kind}><a className="tp-icon-action" href={a.href} aria-label={a.label} data-event={a.event} {...external(a.kind)}><I aria-hidden="true" className="size-5" /></a></li>
      })}
    </ul>
  )
}

function Actions({ vm }: { vm: PageViewModel }) {
  const mode = vm.style.spec.header.actions
  if (mode === "none") return null
  const actions = headerActions(vm)

  if (mode === "primary") {
    const p = vm.primary
    const rest = actions.filter((a) => a.kind !== p?.kind)
    if (!p && !rest.length) return null
    const PI = p ? ICON[p.kind] : null
    return (
      <div className="tp-actions tp-actions-primary">
        {p ? (
          p.kind === "book" && vm.promotedWidgetId ? (
            // The wrapper has a box of its own, so a tap on the main action selects the booking widget while editing
            // (buttons ignore the pointer in the editor).
            <div className="tp-primary-slot" data-widget-id={vm.promotedWidgetId}><BookingAction {...bookingProps(vm, { label: p.label, variant: "button", hero: true })} /></div>
          ) : (
            <a className="tp-btn" data-hero="" data-primary="" data-event={p.event} href={p.href} {...external(p.kind)}>
              {PI ? <PI aria-hidden="true" className="size-5" /> : null}<span className="tp-btn-main"><span className="tp-btn-label">{p.label}</span></span><ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          )
        ) : null}
        {rest.length ? <IconActions vm={vm} list={rest} label="More ways to reach us" /> : null}
      </div>
    )
  }
  if (!actions.length) return null
  if (mode === "icons") return <IconActions vm={vm} list={actions} label="Contact" />
  return (
    <div className="tp-actions">
      {actions.map((a) => {
        const I = ICON[a.kind]
        if (a.kind === "book" && vm.promotedWidgetId) return <div key={a.kind} className="tp-primary-slot" data-widget-id={vm.promotedWidgetId} style={{ width: "auto" }}><BookingAction {...bookingProps(vm, { label: String(vm.widgets.find((w) => w.id === vm.promotedWidgetId)?.settings.label || a.label), variant: "button" })} /></div>
        return (
          <a key={a.kind} className="tp-btn" data-inline="" {...(a.kind === "book" ? { "data-primary": "" } : {})} data-event={a.event} href={a.href} {...external(a.kind)}>
            <I aria-hidden="true" className="size-4" /><span className="tp-btn-label">{a.label}</span><ArrowUpRight aria-hidden="true" className="size-3.5 opacity-70" />
          </a>
        )
      })}
    </div>
  )
}

function Text({ vm }: { vm: PageViewModel }) {
  const b = vm.business
  const h = vm.style.spec.header
  return (
    <>
      <h1 className="tp-name">{b.identity.name}</h1>
      {b.identity.tagline ? <p className="tp-bio">{b.identity.tagline}</p> : null}
      <p className="tp-meta">
        <span>{b.identity.industryLabel}</span>
        {h.showLocation && vm.locationLine ? <span className="inline-flex items-center gap-1"><MapPin aria-hidden="true" className="size-3.5" />{vm.locationLine}</span> : null}
        {b.rating && vm.ent.reviewLinks ? <span><span aria-hidden="true">★</span> {b.rating.value.toFixed(1)} · {b.rating.count}</span> : null}
      </p>
    </>
  )
}

/** One header component, four arrangements chosen by the page style (not by industry): compact identity, cover, image hero, and text-led. */
export function PageHeader({ vm }: { vm: PageViewModel }) {
  const { spec } = vm.style
  const h = spec.header
  const cover = vm.business.identity.heroImage

  if (h.layout === "poster") {
    // Image hero: the photograph runs to the edges and fades into the page colour, so the text below always sits on the page colour.
    return (
      <header className="tp-header" data-layout="poster" data-align={h.align} data-cover={cover ? "" : undefined}>
        <div className="tp-hero">
          <div className="tp-hero-media">{cover ? <ProfileImage image={cover} sizes="(min-width:900px) 40rem, 100vw" priority /> : null}</div>
          <div className="tp-herobody">
            <Avatar vm={vm} />
            <Text vm={vm} />
            <Actions vm={vm} />
          </div>
        </div>
      </header>
    )
  }
  if (h.layout === "cover") {
    return (
      <header className="tp-header" data-layout="cover" data-align={h.align} data-cover={cover ? "" : undefined}>
        {cover ? <div className="tp-cover"><ProfileImage image={cover} sizes="(min-width:900px) 40rem, 100vw" priority /></div> : null}
        <div style={{ paddingInline: "0.25rem", justifyItems: "var(--tp-header-justify)" }} className="grid w-full gap-2.5">
          <Avatar vm={vm} />
          <Text vm={vm} />
          <Actions vm={vm} />
        </div>
      </header>
    )
  }
  if (h.layout === "side") {
    return (
      <header className="tp-header" data-layout="side" data-align={h.align}>
        <div className="tp-sidehead">
          <Avatar vm={vm} />
          <div className="grid min-w-0 gap-1.5"><Text vm={vm} /></div>
        </div>
        <Actions vm={vm} />
      </header>
    )
  }
  return (
    <header className="tp-header" data-layout={h.layout} data-align={h.align}>
      {h.layout === "centered" || h.layout === "minimal" ? <Avatar vm={vm} /> : null}
      <Text vm={vm} />
      <Actions vm={vm} />
    </header>
  )
}
