import { ArrowUpRight, CalendarCheck, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { initialsOf } from "@/lib/validation"
import { ProfileImage } from "./ProfileImage"
import type { PageAction, PageViewModel } from "./view-model"

const ICON = { book: CalendarCheck, call: Phone, whatsapp: MessageCircle, email: Mail } as const
const WIDGET_FOR: Partial<Record<PageAction["kind"], string>> = { call: "call", whatsapp: "whatsapp", email: "email" }

function Avatar({ vm }: { vm: PageViewModel }) {
  const { spec } = vm.style
  const { identity } = vm.business
  if (spec.header.avatarShape === "none") return null
  return (
    <span className="tp-avatar" data-shape={spec.header.avatarShape} data-size={spec.header.avatarSize}>
      {identity.logo ? <ProfileImage image={identity.logo} sizes="160px" priority /> : <span aria-hidden="true">{initialsOf(identity.name)}</span>}
    </span>
  )
}

function Actions({ vm }: { vm: PageViewModel }) {
  const mode = vm.style.spec.header.actions
  if (mode === "none") return null
  // Don't repeat a channel the owner already placed as its own widget.
  const placed = new Set(vm.visible.map((w) => w.type as string))
  const actions = vm.actions.filter((a) => !(WIDGET_FOR[a.kind] && placed.has(WIDGET_FOR[a.kind]!)))
  if (!actions.length) return null
  if (mode === "icons") {
    return (
      <ul className="tp-actions" aria-label="Contact">
        {actions.map((a) => {
          const I = ICON[a.kind]
          return <li key={a.kind}><a className="tp-icon-action" href={a.href} aria-label={a.label} data-event={a.event} {...(a.kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}><I aria-hidden="true" className="size-5" /></a></li>
        })}
      </ul>
    )
  }
  return (
    <div className="tp-actions">
      {actions.map((a) => {
        const I = ICON[a.kind]
        return (
          <a key={a.kind} className="tp-btn" data-inline="" {...(a.kind === "book" ? { "data-primary": "" } : {})} data-event={a.event} href={a.href} {...(a.kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
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

/** One header component, five treatments chosen by the page style (not by industry). */
export function PageHeader({ vm }: { vm: PageViewModel }) {
  const { spec } = vm.style
  const h = spec.header
  const cover = vm.business.identity.heroImage

  if (h.layout === "poster") {
    return (
      <header className="tp-header" data-layout="poster" data-align={h.align}>
        <div className="tp-poster">
          {cover ? <ProfileImage image={cover} sizes="(min-width:900px) 24rem, 100vw" priority /> : null}
          <div className="tp-posterbody">
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
      <header className="tp-header" data-layout="cover" data-align={h.align}>
        <div className="tp-cover">{cover ? <ProfileImage image={cover} sizes="(min-width:900px) 40rem, 100vw" priority /> : null}</div>
        <div style={{ paddingInline: "0.25rem" }} className="grid w-full gap-2.5 justify-items-[var(--tp-header-justify)]">
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
