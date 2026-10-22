import type { BlockOf } from "../contracts/blocks"
import type { ServiceContent } from "@/features/businesses/content"
import { formatDuration, formatPrice, groupServices } from "@/features/services/format"
import { TaploServiceCard } from "@/components/taplo/taplo-service-card"
import { TaploCard } from "@/components/taplo/taplo-card"
import { TaploBadge } from "@/components/taplo/taplo-badge"
import { Section, ProfileImage, type BlockProps } from "./shared"

const DELIVERY_LABEL = { premises: "In person", mobile: "We come to you", online: "Online" } as const

function meta(s: ServiceContent): string[] {
  const d = formatDuration(s.durationMinutes)
  return [d, ...s.delivery.map((x) => DELIVERY_LABEL[x])].filter((x): x is string => Boolean(x))
}

/** List: compact, scannable rows; price pinned right. Built for quick comparison. */
function ListServices({ vm }: BlockProps<BlockOf<"services">>) {
  return (
    <Section id="services" title={vm.industry.terminology.services} eyebrow="What we do">
      <ul className="divide-y divide-tp-border border-y border-tp-border">
        {vm.business.services.map((s) => (
          <li key={s.id} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
            <div>
              <h3 className="font-tp-heading text-2xl font-semibold uppercase tracking-wide">{s.name}</h3>
              {s.description ? <p className="mt-1 max-w-2xl text-sm text-tp-muted">{s.description}</p> : null}
              {meta(s).length ? <p className="mt-1 text-xs uppercase tracking-wider text-tp-muted">{meta(s).join(" · ")}</p> : null}
            </div>
            <p className="font-tp-heading text-xl font-semibold text-tp-accent sm:text-right">{formatPrice(s)}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Cards: balanced grid, works with or without images. */
function CardServices({ vm }: BlockProps<BlockOf<"services">>) {
  return (
    <Section id="services" title={vm.industry.terminology.services}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vm.business.services.map((s) => (
          <li key={s.id}><TaploServiceCard service={s} /></li>
        ))}
      </ul>
    </Section>
  )
}

/** Image cards / treatment menu: image-led where photos exist, dotted-leader menu rows where not. */
function ImageCardServices({ vm }: BlockProps<BlockOf<"services">>) {
  const groups = groupServices(vm.business.services)
  return (
    <Section id="services" title={vm.industry.terminology.services} eyebrow="The menu" surface headingClassName="text-center">
      <div className="grid gap-12">
        {groups.map((g) => {
          const withImage = g.items.filter((s) => s.image)
          return (
            <div key={g.name ?? "all"}>
              {g.name ? <h3 className="mb-5 text-center font-tp-heading text-2xl italic">{g.name}</h3> : null}
              {withImage.length > 0 ? (
                <ul className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {withImage.map((s) => (
                    <li key={s.id} className="group">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-tp">
                        <ProfileImage image={s.image!} sizes="(min-width: 1024px) 25vw, 50vw" />
                        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                          <p className="font-tp-heading text-xl">{s.name}</p>
                          <p className="text-sm">{formatPrice(s)}{formatDuration(s.durationMinutes) ? ` · ${formatDuration(s.durationMinutes)}` : ""}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
              <ul className="mx-auto grid max-w-2xl gap-5">
                {g.items.filter((s) => !s.image).map((s) => (
                  <li key={s.id}>
                    <div className="flex items-baseline gap-3">
                      <h4 className="font-tp-heading text-lg">{s.name}</h4>
                      <span aria-hidden="true" className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-tp-muted/60" />
                      <span className="font-semibold">{formatPrice(s)}</span>
                    </div>
                    {s.description || meta(s).length ? (
                      <p className="mt-1 text-sm text-tp-muted">{[s.description, meta(s).join(" · ")].filter(Boolean).join(" — ")}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

/** Subjects: friendly grid with level-of-detail aimed at parents and students. */
function SubjectServices({ vm }: BlockProps<BlockOf<"services">>) {
  return (
    <Section id="services" title={vm.industry.terminology.services} eyebrow="What you can learn">
      <ul className="grid gap-4 sm:grid-cols-2">
        {vm.business.services.map((s) => (
          <li key={s.id}>
            <TaploCard className="flex h-full flex-col gap-3 p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-tp-heading text-xl font-semibold leading-snug">{s.name}</h3>
                <TaploBadge tone="accent" className="shrink-0">{formatPrice(s)}</TaploBadge>
              </div>
              {s.description ? <p className="text-tp-muted">{s.description}</p> : null}
              {meta(s).length ? (
                <ul className="mt-auto flex flex-wrap gap-2 pt-2" aria-label="Session details">
                  {meta(s).map((m) => <li key={m}><TaploBadge tone="outline">{m}</TaploBadge></li>)}
                </ul>
              ) : null}
            </TaploCard>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Consulting: numbered engagements, wide measure, price as an indication not a button. */
function ConsultingServices({ vm }: BlockProps<BlockOf<"services">>) {
  return (
    <Section id="services" title={vm.industry.terminology.services} eyebrow="Engagements" className="border-t border-tp-border">
      <ol className="divide-y divide-tp-border">
        {vm.business.services.map((s, i) => (
          <li key={s.id} className="grid gap-3 py-8 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-6">
            <span aria-hidden="true" className="font-tp-heading text-2xl text-tp-accent">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="font-tp-heading text-2xl leading-snug">{s.name}</h3>
              {s.description ? <p className="mt-2 max-w-prose leading-relaxed text-tp-muted">{s.description}</p> : null}
              {meta(s).length ? <p className="mt-2 text-sm text-tp-muted">{meta(s).join(" · ")}</p> : null}
            </div>
            <p className="text-sm font-semibold uppercase tracking-wider sm:text-right">{formatPrice(s)}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function ServicesBlock(props: BlockProps<BlockOf<"services">>) {
  switch (props.config.variant) {
    case "list": return <ListServices {...props} />
    case "cards": return <CardServices {...props} />
    case "imageCards": return <ImageCardServices {...props} />
    case "subjects": return <SubjectServices {...props} />
    case "consulting": return <ConsultingServices {...props} />
  }
}
