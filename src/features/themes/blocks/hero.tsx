import { MapPin } from "lucide-react"
import type { BlockOf } from "../contracts/blocks"
import { TaploAvatar } from "@/components/taplo/taplo-avatar"
import { TaploBadge } from "@/components/taplo/taplo-badge"
import { TaploCard } from "@/components/taplo/taplo-card"
import { ActionButton, ProfileImage, RatingLine, locationLine, type BlockProps } from "./shared"
import { BookingTrigger } from "@/components/taplo/taplo-booking-card"
import { bookingPropsFor } from "./booking-props"

/** Bold: dark, condensed uppercase type, huge actions, image as a darkened backdrop. */
function BoldHero({ vm }: BlockProps<BlockOf<"hero">>) {
  const { business: b, primaryAction, secondaryActions } = vm
  const loc = locationLine(vm)
  return (
    <section id="top" className="relative isolate overflow-hidden border-b border-tp-border">
      {b.identity.heroImage ? (
        <>
          <ProfileImage image={b.identity.heroImage} sizes="100vw" priority className="-z-20 opacity-60" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-tp-bg via-tp-bg/70 to-tp-bg/30" />
        </>
      ) : (
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,var(--tp-surface),var(--tp-background))]" />
      )}
      <div className="tp-container flex min-h-[78svh] flex-col justify-end py-10 sm:py-16">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <TaploBadge tone="accent" className="uppercase tracking-wider">{b.identity.industryLabel}</TaploBadge>
          {loc ? (
            <TaploBadge tone="neutral"><MapPin className="size-3" aria-hidden="true" />{loc}</TaploBadge>
          ) : null}
        </div>
        <h1 className="max-w-5xl text-balance font-tp-heading text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">{b.identity.name}</h1>
        {b.identity.tagline ? <p className="mt-5 max-w-2xl text-lg text-tp-fg/85 sm:text-xl">{b.identity.tagline}</p> : null}
        <RatingLine vm={vm} className="mt-3 text-tp-fg/90" />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {primaryAction ? <ActionButton action={primaryAction} size="lg" className="sm:min-w-52" /> : null}
          {secondaryActions.map((a) => <ActionButton key={a.kind} action={a} tone="secondary" size="lg" />)}
        </div>
      </div>
    </section>
  )
}

/** Editorial: image-led split with an arched photo, large serif, pill action. */
function EditorialHero({ vm }: BlockProps<BlockOf<"hero">>) {
  const { business: b, primaryAction, secondaryActions } = vm
  const loc = locationLine(vm)
  return (
    <section id="top" className="tp-section pt-8 sm:pt-12">
      <div className="tp-container grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-tp-muted">
            {b.identity.industryLabel}{loc ? ` · ${loc}` : ""}
          </p>
          <h1 className="text-balance font-tp-heading text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">{b.identity.name}</h1>
          {b.identity.tagline ? <p className="mt-6 max-w-md text-lg leading-relaxed text-tp-muted">{b.identity.tagline}</p> : null}
          <RatingLine vm={vm} className="mt-4 block text-tp-muted" />
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryAction ? <ActionButton action={primaryAction} size="lg" className="rounded-full" /> : null}
            {secondaryActions.slice(0, 1).map((a) => <ActionButton key={a.kind} action={a} tone="secondary" size="lg" className="rounded-full" />)}
          </div>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-[999px] rounded-b-tp bg-tp-surface lg:max-w-none">
          {b.identity.heroImage ? (
            <ProfileImage image={b.identity.heroImage} sizes="(min-width: 1024px) 40vw, 90vw" priority />
          ) : (
            <div className="flex h-full items-center justify-center">
              <TaploAvatar name={b.identity.name} image={b.identity.logo} size="xl" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/** Trust: left-aligned explanation with a contained action card and credential chips. */
function TrustHero({ vm }: BlockProps<BlockOf<"hero">>) {
  const { business: b, primaryAction, secondaryActions } = vm
  const loc = locationLine(vm)
  const bp = bookingPropsFor(vm)
  return (
    <section id="top" className="border-b border-tp-border bg-tp-surface">
      <div className="tp-container grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold text-tp-accent">{b.identity.industryLabel}{loc ? ` · ${loc}` : ""}</p>
          <h1 className="font-tp-heading text-4xl font-semibold leading-tight sm:text-5xl">{b.identity.name}</h1>
          {b.identity.tagline ? <p className="mt-4 max-w-xl text-lg leading-relaxed text-tp-muted">{b.identity.tagline}</p> : null}
          {b.credentials.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Credentials">
              {b.credentials.slice(0, 4).map((c) => <li key={c}><TaploBadge tone="outline" className="bg-tp-bg py-1.5">✓ {c}</TaploBadge></li>)}
            </ul>
          ) : null}
        </div>
        <TaploCard className="bg-tp-bg p-6">
          <div className="flex items-center gap-3">
            <TaploAvatar name={b.identity.name} image={b.identity.logo} size="md" />
            <div>
              <p className="font-semibold leading-tight">{b.identity.name}</p>
              <RatingLine vm={vm} className="text-tp-muted" />
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {bp ? <BookingTrigger {...bp} /> : primaryAction ? <ActionButton action={primaryAction} size="lg" /> : null}
            {secondaryActions.map((a) => <ActionButton key={a.kind} action={a} tone="secondary" size="lg" />)}
          </div>
        </TaploCard>
      </div>
    </section>
  )
}

/** Refined: narrow measure, serif, rules and text-link actions. Authority through restraint. */
function RefinedHero({ vm }: BlockProps<BlockOf<"hero">>) {
  const { business: b, primaryAction, secondaryActions } = vm
  const loc = locationLine(vm)
  return (
    <section id="top" className="tp-section border-b border-tp-border">
      <div className="tp-container">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tp-muted">
          {b.identity.industryLabel}{loc ? ` — ${loc}` : ""}
        </p>
        <h1 className="mt-6 text-balance font-tp-heading text-4xl font-normal leading-[1.1] tracking-tight sm:text-6xl">{b.identity.name}</h1>
        <hr className="my-8 w-16 border-t-2 border-tp-accent" />
        {b.identity.tagline ? <p className="max-w-xl font-tp-heading text-xl leading-relaxed text-tp-muted">{b.identity.tagline}</p> : null}
        <RatingLine vm={vm} className="mt-4 block text-tp-muted" />
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          {primaryAction ? <ActionButton action={primaryAction} size="lg" className="rounded-none" /> : null}
          {secondaryActions.map((a) => (
            <a key={a.kind} href={a.href} className="min-h-11 content-center text-sm font-semibold underline underline-offset-8 decoration-tp-accent decoration-2" {...(a.kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {a.label} →
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Simple: centred, works with no photography at all. */
function SimpleHero({ vm }: BlockProps<BlockOf<"hero">>) {
  const { business: b, primaryAction, secondaryActions } = vm
  const loc = locationLine(vm)
  return (
    <section id="top" className="tp-section border-b border-tp-border pb-12">
      <div className="tp-container flex flex-col items-center text-center">
        <TaploAvatar name={b.identity.name} image={b.identity.logo} size="lg" />
        <h1 className="mt-6 max-w-3xl text-balance font-tp-heading text-4xl font-bold tracking-tight sm:text-5xl">{b.identity.name}</h1>
        {b.identity.tagline ? <p className="mt-4 max-w-xl text-lg text-tp-muted">{b.identity.tagline}</p> : null}
        <p className="mt-3 text-sm text-tp-muted">{b.identity.industryLabel}{loc ? ` · ${loc}` : ""}</p>
        <RatingLine vm={vm} className="mt-2 text-tp-muted" />
        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          {primaryAction ? <ActionButton action={primaryAction} size="lg" /> : null}
          {secondaryActions.map((a) => <ActionButton key={a.kind} action={a} tone="secondary" size="lg" />)}
        </div>
        {b.identity.heroImage ? (
          <div className="relative mt-10 aspect-[16/8] w-full overflow-hidden rounded-tp">
            <ProfileImage image={b.identity.heroImage} sizes="(min-width: 1024px) 64rem, 100vw" priority />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function HeroBlock(props: BlockProps<BlockOf<"hero">>) {
  switch (props.config.variant) {
    case "bold": return <BoldHero {...props} />
    case "editorial": return <EditorialHero {...props} />
    case "trust": return <TrustHero {...props} />
    case "refined": return <RefinedHero {...props} />
    case "simple": return <SimpleHero {...props} />
  }
}
