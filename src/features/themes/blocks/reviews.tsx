import type { BlockOf } from "../contracts/blocks"
import { TaploReviewCard, SOURCE_LABEL } from "@/components/taplo/taplo-review-card"
import { TaploButton } from "@/components/taplo/taplo-button"
import { Section, RatingLine, type BlockProps } from "./shared"

const PLATFORM = { google: "Google", facebook: "Facebook", trustpilot: "Trustpilot" } as const

/** Review destinations are shown neutrally — never gated by sentiment. */
function ReviewLinks({ vm }: BlockProps<BlockOf<"reviews">>) {
  const links = vm.business.reviewLinks
  if (links.length === 0) return null
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="text-sm text-tp-muted">Customers can leave a review on:</span>
      {links.map((l) => (
        <TaploButton key={l.platform} tone="secondary" href={l.url} external>
          {PLATFORM[l.platform]}
        </TaploButton>
      ))}
    </div>
  )
}

function Heading({ vm }: BlockProps<BlockOf<"reviews">>) {
  return vm.business.rating ? <RatingLine vm={vm} className="mb-6 block text-tp-muted" /> : null
}

function CardReviews(p: BlockProps<BlockOf<"reviews">>) {
  const { testimonials } = p.vm.business
  return (
    <Section id="reviews" title={p.vm.industry.terminology.reviews}>
      <Heading {...p} />
      {testimonials.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => <li key={t.id}><TaploReviewCard testimonial={t} /></li>)}
        </ul>
      ) : null}
      <ReviewLinks {...p} />
    </Section>
  )
}

/** Strip: dense, single-column rows with compact attribution. */
function StripReviews(p: BlockProps<BlockOf<"reviews">>) {
  const { testimonials } = p.vm.business
  return (
    <Section id="reviews" title={p.vm.industry.terminology.reviews} eyebrow="What customers say" surface>
      <Heading {...p} />
      {testimonials.length ? (
        <ul className="divide-y divide-tp-border border-y border-tp-border">
          {testimonials.map((t) => (
            <li key={t.id} className="grid gap-1 py-4 sm:grid-cols-[1fr_14rem] sm:gap-6">
              <p className="text-lg">“{t.quote}”</p>
              <p className="text-sm text-tp-muted sm:text-right"><span className="font-semibold text-tp-fg">{t.author}</span><br />{SOURCE_LABEL[t.source]}</p>
            </li>
          ))}
        </ul>
      ) : null}
      <ReviewLinks {...p} />
    </Section>
  )
}

/** Quote: a single large pull-quote; additional ones are listed quietly below. */
function QuoteReviews(p: BlockProps<BlockOf<"reviews">>) {
  const [lead, ...rest] = p.vm.business.testimonials
  return (
    <Section id="reviews" title={p.vm.industry.terminology.reviews} headingClassName="text-center" className="border-t border-tp-border">
      <Heading {...p} />
      {lead ? (
        <figure className="mx-auto max-w-3xl text-center">
          <span aria-hidden="true" className="font-tp-heading text-6xl leading-none text-tp-accent">“</span>
          <blockquote className="-mt-4 font-tp-heading text-2xl leading-snug sm:text-3xl">{lead.quote}</blockquote>
          <figcaption className="mt-6 text-sm text-tp-muted">
            <span className="font-semibold text-tp-fg">{lead.author}</span> · {SOURCE_LABEL[lead.source]}
          </figcaption>
        </figure>
      ) : null}
      {rest.length ? (
        <ul className="mx-auto mt-10 grid max-w-3xl gap-6 border-t border-tp-border pt-8">
          {rest.map((t) => (
            <li key={t.id} className="text-center text-tp-muted">“{t.quote}” — <span className="text-tp-fg">{t.author}</span>, {SOURCE_LABEL[t.source].toLowerCase()}</li>
          ))}
        </ul>
      ) : null}
      <div className="flex justify-center"><ReviewLinks {...p} /></div>
    </Section>
  )
}

/** Testimonials: roomy cards with larger reading size and clear source. */
function TestimonialReviews(p: BlockProps<BlockOf<"reviews">>) {
  const { testimonials } = p.vm.business
  return (
    <Section id="reviews" title={p.vm.industry.terminology.reviews} eyebrow="From families and students" surface>
      <Heading {...p} />
      {testimonials.length ? (
        <ul className="grid gap-5 md:grid-cols-2">
          {testimonials.map((t) => <li key={t.id}><TaploReviewCard testimonial={t} className="bg-tp-bg p-7 text-lg" /></li>)}
        </ul>
      ) : null}
      <ReviewLinks {...p} />
    </Section>
  )
}

export function ReviewsBlock(props: BlockProps<BlockOf<"reviews">>) {
  switch (props.config.variant) {
    case "cards": return <CardReviews {...props} />
    case "strip": return <StripReviews {...props} />
    case "quote": return <QuoteReviews {...props} />
    case "testimonials": return <TestimonialReviews {...props} />
  }
}
