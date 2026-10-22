import type { TestimonialContent } from "@/features/businesses/content"
import { cn } from "@/lib/utils"
import { TaploCard } from "./taplo-card"
import { TaploBadge } from "./taplo-badge"

export const SOURCE_LABEL: Record<TestimonialContent["source"], string> = {
  owner_supplied: "Shared by the business",
  google: "From Google",
  facebook: "From Facebook",
  trustpilot: "From Trustpilot",
  taplo: "Verified on Taplo",
}

/** Every testimonial carries a visible provenance label. Never an invented score. */
export function TaploReviewCard({ testimonial, className }: { testimonial: TestimonialContent; className?: string }) {
  return (
    <TaploCard className={cn("flex h-full flex-col gap-4 p-5", className)}>
      <blockquote className="text-base leading-relaxed">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-auto flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold">{testimonial.author}</span>
        {testimonial.sourceUrl ? (
          <a className="underline underline-offset-4" href={testimonial.sourceUrl} target="_blank" rel="noopener noreferrer">
            {SOURCE_LABEL[testimonial.source]}
          </a>
        ) : (
          <TaploBadge tone="outline">{SOURCE_LABEL[testimonial.source]}</TaploBadge>
        )}
      </figcaption>
    </TaploCard>
  )
}
