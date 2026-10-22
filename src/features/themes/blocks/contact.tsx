import type { BlockOf } from "../contracts/blocks"
import { Section, ActionButton, locationLine, type BlockProps } from "./shared"
import { TaploCard } from "@/components/taplo/taplo-card"

const DAY: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" }
const SOCIAL: Record<string, string> = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", linkedin: "LinkedIn", youtube: "YouTube", x: "X" }

function Social({ vm }: BlockProps<BlockOf<"contact">>) {
  const s = vm.business.contacts.social
  if (!s.length) return null
  return (
    <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label="Social profiles">
      {s.map((x) => (
        <li key={x.platform}>
          <a className="inline-flex min-h-11 items-center text-sm underline underline-offset-4" href={x.url} target="_blank" rel="noopener noreferrer">{SOCIAL[x.platform]}</a>
        </li>
      ))}
    </ul>
  )
}

/** Actions: big tappable buttons. Only channels the owner has enabled exist. */
function ActionsContact(p: BlockProps<BlockOf<"contact">>) {
  const { vm } = p
  return (
    <Section id="contact" title="Get in touch" eyebrow={locationLine(vm) ?? undefined}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {vm.contactActions.map((a) => <ActionButton key={a.kind} action={a} tone={a.kind === "call" ? "primary" : "secondary"} size="lg" className="justify-start" />)}
      </div>
      {vm.business.location.mode === "premises" && vm.business.location.addressLine ? (
        <address className="mt-6 not-italic text-tp-muted">{vm.business.location.addressLine}</address>
      ) : null}
      <Social {...p} />
    </Section>
  )
}

/** Details: quiet two-column reference block with location and hours. */
function DetailsContact(p: BlockProps<BlockOf<"contact">>) {
  const { vm } = p
  const { location, hours } = vm.business
  const open = hours.filter((h) => h.opens && h.closes)
  return (
    <Section id="contact" title="Contact" surface>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <ul className="grid gap-2">
            {vm.contactActions.map((a) => <li key={a.kind}><ActionButton action={a} tone={a.kind === "call" || a.kind === "book" ? "primary" : "secondary"} className="w-full justify-start sm:w-auto" /></li>)}
          </ul>
          <Social {...p} />
        </div>
        <TaploCard className="bg-tp-bg p-6">
          <h3 className="font-tp-heading text-lg font-semibold">{location.mode === "online" ? "Online" : location.mode === "service_area" ? "Areas covered" : "Find us"}</h3>
          {/* A mobile operator's private address is never published (service_area/online hide it). */}
          {location.mode === "premises" && location.addressLine ? <address className="mt-2 not-italic">{location.addressLine}</address> : null}
          {location.locality && location.mode !== "premises" ? <p className="mt-2">{location.locality}</p> : null}
          {open.length ? (
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
              {open.map((h) => <div key={h.day} className="contents"><dt className="font-medium">{DAY[h.day]}</dt><dd className="text-tp-muted">{h.opens}–{h.closes}</dd></div>)}
            </dl>
          ) : null}
        </TaploCard>
      </div>
    </Section>
  )
}

export function ContactBlock(props: BlockProps<BlockOf<"contact">>) {
  return props.config.variant === "actions" ? <ActionsContact {...props} /> : <DetailsContact {...props} />
}
