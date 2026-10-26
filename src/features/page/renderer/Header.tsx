import { ArrowUpRight, CalendarCheck, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { BookingAction } from "../widgets/client"
import { bookingProps } from "../widgets/renderers"
import { ProfileImage } from "./ProfileImage"
import { ProfileMark } from "./ProfileMark"
import { HeaderStatus } from "./HeaderStatus"
import { initialsOf } from "@/lib/validation"
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

function Actions({ vm, only }: { vm: PageViewModel; /** Show just the main action; the other channels are placed elsewhere in the arrangement. */ only?: "primary" }) {
  const mode = only ? "primary" : vm.style.spec.header.actions
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
            <div className="tp-primary-slot" data-widget-id={vm.promotedWidgetId}><BookingAction {...bookingProps(vm, { label: p.label, variant: "button", hero: true, preselect: String(vm.widgets.find(w=>w.id===vm.promotedWidgetId)?.settings.serviceId || "") || undefined })} /></div>
          ) : (
            <a className="tp-btn" data-hero="" data-primary="" data-event={p.event} href={p.href} {...external(p.kind)}>
              {PI ? <PI aria-hidden="true" className="size-5" /> : null}<span className="tp-btn-main"><span className="tp-btn-label">{p.label}</span></span><ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          )
        ) : null}
        {rest.length && !only ? <IconActions vm={vm} list={rest} label="More ways to reach us" /> : null}
      </div>
    )
  }
  if (!actions.length) return null
  if (mode === "icons") return <IconActions vm={vm} list={actions} label="Contact" />
  return (
    <div className="tp-actions">
      {actions.map((a) => {
        const I = ICON[a.kind]
        if (a.kind === "book" && vm.promotedWidgetId) return <div key={a.kind} className="tp-primary-slot" data-widget-id={vm.promotedWidgetId} style={{ width: "auto" }}><BookingAction {...bookingProps(vm, { label: String(vm.widgets.find((w) => w.id === vm.promotedWidgetId)?.settings.label || a.label), preselect: String(vm.widgets.find(w=>w.id===vm.promotedWidgetId)?.settings.serviceId || "") || undefined, variant: "button" })} /></div>
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

      </p>
    </>
  )
}

/** Without a photograph the arrangement stays designed: a drifting colour field and the business monogram, never an empty upload box. */
function Art({ vm }: { vm: PageViewModel }) {
  return <div className="tp-art" aria-hidden="true"><span>{initialsOf(vm.business.identity.name)}</span></div>
}

function Shoulder({ vm }: { vm: PageViewModel }) {
  const list = headerActions(vm).filter((a) => a.kind !== "book")
  const map = vm.business.location.directionsUrl
  if (!list.length && !map) return null
  return (
    <ul className="tp-actions tp-quick tp-shoulder" aria-label="Contact">
      {list.map((a) => { const I = ICON[a.kind]; return <li key={a.kind}><a className="tp-icon-action" href={a.href} aria-label={a.label} data-event={a.event} {...external(a.kind)}><I aria-hidden="true" className="size-5" /></a></li> })}
      {map ? <li><a className="tp-icon-action" href={map} aria-label="Directions" target="_blank" rel="noopener noreferrer"><MapPin aria-hidden="true" className="size-5" /></a></li> : null}
    </ul>
  )
}

/** The five arrangements: structure only. Colour, surface and typography come from the finish. */
function Arrangement({ vm }: { vm: PageViewModel }) {
  const h = vm.style.spec.header
  const id = vm.business.identity
  const cover = id.heroImage
  const label = `${id.name} business profile`
  const b = vm.business
  if (h.layout === "melt") return (
    <header aria-label={label} className="tp-header" data-layout="melt" data-align={h.align} data-cover={cover ? "" : undefined}>
      <div className="tp-melt-media">{cover ? <ProfileImage image={cover} sizes="(min-width:900px) 40rem, 100vw" priority /> : <Art vm={vm} />}</div>
      <div className="tp-melt-body">{id.logo ? <Avatar vm={vm} /> : null}<Text vm={vm} /><Actions vm={vm} /></div>
    </header>
  )
  if (h.layout === "cutout") {
    const subject = id.heroCutout ?? cover
    return (
      <header aria-label={label} className="tp-header" data-layout="cutout" data-align="center" data-cut={id.heroCutout ? "true" : subject ? "photo" : undefined}>
        <div className="tp-cut-stage">
          <span className="tp-cut-type" aria-hidden="true">{id.name}</span>
          <div className="tp-cut-subject">{subject ? <ProfileImage image={subject} sizes="(min-width:900px) 32rem, 90vw" priority className="object-contain object-bottom" /> : <Art vm={vm} />}</div>
        </div>
        <div className="tp-cut-body"><Text vm={vm} /><Actions vm={vm} /></div>
      </header>
    )
  }
  if (h.layout === "split") return (
    <header aria-label={label} className="tp-header" data-layout="split" data-align="left" data-cover={cover ? "" : undefined}>
      <div className="tp-split-cover">{cover ? <ProfileImage image={cover} sizes="(min-width:900px) 40rem, 100vw" priority /> : <Art vm={vm} />}</div>
      <div className="tp-split-shoulder">{id.logo ? <div className="tp-split-badge"><Avatar vm={vm} /></div> : <span />}<Shoulder vm={vm} /></div>
      <div className="tp-split-body"><Text vm={vm} /><Actions vm={vm} only="primary" /></div>
    </header>
  )
  if (h.layout === "bento") return (
    <header aria-label={label} className="tp-header" data-layout="bento" data-align="left">
      <div className="tp-bento-card">
        <div className="tp-bento-top"><Avatar vm={vm} /><div className="tp-bento-id"><h1 className="tp-name">{id.name}</h1>{id.tagline ? <p className="tp-bio">{id.tagline}</p> : null}</div></div>
        <div className="tp-bento-meta">
          <HeaderStatus hours={b.hours} tz={b.location.timezone} />
          {b.rating ? <span className="tp-badge-rating"><b>{b.rating.value.toFixed(1)}</b> · {b.rating.count} reviews on {b.rating.source[0]!.toUpperCase() + b.rating.source.slice(1)}</span> : null}
          {h.showLocation && vm.locationLine ? <span className="tp-badge-place"><MapPin aria-hidden="true" className="size-3.5" />{vm.locationLine}</span> : null}
        </div>
        <Actions vm={vm} />
      </div>
    </header>
  )
  return (
    <header aria-label={label} className="tp-header" data-layout="type" data-align="left">
      <div className="tp-type-art" aria-hidden="true" />
      <p className="tp-type-kicker">{id.industryLabel}{h.showLocation && vm.locationLine ? ` · ${vm.locationLine}` : ""}</p>
      <h1 className="tp-name tp-type-name">{id.name}</h1>
      {id.tagline ? <p className="tp-bio tp-type-bio">{id.tagline}</p> : null}
      <Actions vm={vm} />
    </header>
  )
}

/** One header component, with schema-controlled arrangements chosen by the page style rather than the industry. */
export function PageHeader({ vm }: { vm: PageViewModel }) {
  const { spec } = vm.style
  const h = spec.header
  const cover = vm.business.identity.heroImage

  if (h.layout === "melt" || h.layout === "cutout" || h.layout === "split" || h.layout === "bento" || h.layout === "type") return <Arrangement vm={vm} />
  if (h.layout === "floating") return <header aria-label={`${vm.business.identity.name} business profile`} className="tp-header" data-layout="floating" data-align={h.align} data-cover={cover ? "" : undefined}>
    {cover ? <div className="tp-floating-cover"><ProfileImage image={cover} sizes="(min-width:900px) 50vw, 100vw" priority /></div> : null}
    <div className="tp-floating-intro"><Avatar vm={vm} /><Text vm={vm} /><Actions vm={vm} /></div>
  </header>;
  if (h.layout === "portrait") return <header aria-label={`${vm.business.identity.name} business profile`} className="tp-header" data-layout="portrait" data-align="left" data-cover={cover ? "" : undefined}>
    <div className="tp-portrait-intro"><Avatar vm={vm} /><Text vm={vm} /></div>
    {cover ? <div className="tp-identity-portrait"><ProfileImage image={cover} sizes="(min-width:900px) 20rem, 40vw" priority /></div> : null}
    <Actions vm={vm} />
  </header>;

  if (h.layout === "editorial" || h.layout === "banner") {
    return (
      <header aria-label={`${vm.business.identity.name} business profile`} className="tp-header" data-layout={h.layout} data-align={h.align} data-cover={cover ? "" : undefined}>
        {h.layout === "banner" && cover ? <div className="tp-profile-photo"><ProfileImage image={cover} sizes="(min-width:900px) 50vw, 100vw" priority /></div> : null}
        <div className="tp-profile-intro">
          <Avatar vm={vm} />
          <Text vm={vm} />
          <Actions vm={vm} />
        </div>
        {h.layout === "editorial" && cover ? <div className="tp-profile-photo"><ProfileImage image={cover} sizes="(min-width:900px) 50vw, 100vw" priority /></div> : null}
      </header>
    )
  }
  if (h.layout === "poster") {
    // Image hero: the photograph runs to the edges and fades into the page colour, so the text below always sits on the page colour.
    return (
      <header aria-label={`${vm.business.identity.name} business profile`} className="tp-header" data-layout="poster" data-align={h.align} data-cover={cover ? "" : undefined}>
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
  if (h.layout === "cover" || h.layout === "feature") {
    return (
      <header aria-label={`${vm.business.identity.name} business profile`} className="tp-header" data-layout={h.layout} data-align={h.align} data-cover={cover ? "" : undefined}>
        {cover ? <div className="tp-cover"><ProfileImage image={cover} sizes="(min-width:900px) 40rem, 100vw" priority /></div> : null}
        <div style={{ paddingInline: "0.25rem", justifyItems: "var(--tp-header-justify)" }} className="tp-cover-body grid w-full gap-2.5">
          <Avatar vm={vm} />
          <Text vm={vm} />
          <Actions vm={vm} />
        </div>
      </header>
    )
  }
  if (h.layout === "side") {
    return (
      <header aria-label={`${vm.business.identity.name} business profile`} className="tp-header" data-layout="side" data-align={h.align}>
        <div className="tp-sidehead">
          <Avatar vm={vm} />
          <div className="grid min-w-0 gap-1.5"><Text vm={vm} /></div>
        </div>
        <Actions vm={vm} />
      </header>
    )
  }
  return (
    <header aria-label={`${vm.business.identity.name} business profile`} className="tp-header" data-layout={h.layout} data-align={h.align}>
      {h.layout === "centered" || h.layout === "minimal" ? <Avatar vm={vm} /> : null}
      <Text vm={vm} />
      <Actions vm={vm} />
    </header>
  )
}
