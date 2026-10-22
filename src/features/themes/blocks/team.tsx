import type { BlockOf } from "../contracts/blocks"
import { TaploAvatar } from "@/components/taplo/taplo-avatar"
import { TaploBadge } from "@/components/taplo/taplo-badge"
import { TaploCard } from "@/components/taplo/taplo-card"
import { Section, type BlockProps } from "./shared"

/** Cards: compact per-person cards. */
function CardTeam({ vm }: BlockProps<BlockOf<"team">>) {
  return (
    <Section id="team" title={vm.industry.terminology.team}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vm.business.staff.map((s) => (
          <li key={s.id}>
            <TaploCard className="flex h-full items-start gap-4 p-5">
              <TaploAvatar name={s.name} image={s.photo} size="md" />
              <div>
                <h3 className="font-semibold leading-tight">{s.name}</h3>
                {s.role ? <p className="text-sm text-tp-muted">{s.role}</p> : null}
                {s.bio ? <p className="mt-2 text-sm">{s.bio}</p> : null}
              </div>
            </TaploCard>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Portraits: large circular portraits, centred, minimal copy. */
function PortraitTeam({ vm }: BlockProps<BlockOf<"team">>) {
  return (
    <Section id="team" title={`Meet the ${vm.industry.terminology.team.toLowerCase()}`} headingClassName="text-center">
      <ul className="flex flex-wrap justify-center gap-x-12 gap-y-10">
        {vm.business.staff.map((s) => (
          <li key={s.id} className="w-44 text-center">
            <TaploAvatar name={s.name} image={s.photo} size="xl" className="mx-auto" />
            <h3 className="mt-4 font-tp-heading text-xl">{s.name}</h3>
            {s.role ? <p className="text-sm text-tp-muted">{s.role}</p> : null}
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Tutors: readable profile rows with subject chips. */
function TutorTeam({ vm }: BlockProps<BlockOf<"team">>) {
  return (
    <Section id="team" title={vm.industry.terminology.team} eyebrow="Who you will learn with">
      <ul className="grid gap-5">
        {vm.business.staff.map((s) => (
          <li key={s.id}>
            <TaploCard className="grid gap-4 p-6 sm:grid-cols-[auto_1fr]">
              <TaploAvatar name={s.name} image={s.photo} size="lg" />
              <div>
                <h3 className="font-tp-heading text-xl font-semibold">{s.name}</h3>
                {s.role ? <p className="text-tp-muted">{s.role}</p> : null}
                {s.bio ? <p className="mt-2 max-w-prose">{s.bio}</p> : null}
                {s.subjects.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Subjects taught">
                    {s.subjects.map((x) => <li key={x}><TaploBadge tone="outline">{x}</TaploBadge></li>)}
                  </ul>
                ) : null}
              </div>
            </TaploCard>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function TeamBlock(props: BlockProps<BlockOf<"team">>) {
  switch (props.config.variant) {
    case "cards": return <CardTeam {...props} />
    case "portraits": return <PortraitTeam {...props} />
    case "tutors": return <TutorTeam {...props} />
  }
}
