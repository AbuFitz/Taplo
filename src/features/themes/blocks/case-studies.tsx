import type { BlockOf } from "../contracts/blocks"
import { cn } from "@/lib/utils"
import { Section, ProfileImage, type BlockProps } from "./shared"

function ListCaseStudies({ vm }: BlockProps<BlockOf<"caseStudies">>) {
  return (
    <Section id="case-studies" title="Case studies">
      <ul className="grid gap-4 md:grid-cols-2">
        {vm.business.caseStudies.map((c) => (
          <li key={c.id} className="rounded-tp border border-tp-border bg-tp-surface p-6">
            <h3 className="font-tp-heading text-xl font-semibold">{c.title}</h3>
            <p className="mt-2 text-tp-muted">{c.summary}</p>
            {c.outcome ? <p className="mt-3 font-semibold">{c.outcome}</p> : null}
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Feature: alternating long-form entries; text-only studies are still complete. */
function FeatureCaseStudies({ vm }: BlockProps<BlockOf<"caseStudies">>) {
  return (
    <Section id="case-studies" title="Selected work" eyebrow="Case studies" className="border-t border-tp-border">
      <ul className="grid gap-14">
        {vm.business.caseStudies.map((c, i) => (
          <li key={c.id} className={cn("grid gap-6 md:items-center", c.image && "md:grid-cols-2")}>
            {c.image ? (
              <div className={cn("relative aspect-[4/3] overflow-hidden rounded-tp", i % 2 === 1 && "md:order-2")}>
                <ProfileImage image={c.image} sizes="(min-width: 768px) 40vw, 100vw" />
              </div>
            ) : null}
            <div>
              <h3 className="font-tp-heading text-2xl leading-snug">{c.title}</h3>
              <p className="mt-3 max-w-prose leading-relaxed text-tp-muted">{c.summary}</p>
              {c.outcome ? <p className="mt-4 border-l-2 border-tp-accent pl-4 font-semibold">{c.outcome}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function CaseStudiesBlock(props: BlockProps<BlockOf<"caseStudies">>) {
  return props.config.variant === "list" ? <ListCaseStudies {...props} /> : <FeatureCaseStudies {...props} />
}
