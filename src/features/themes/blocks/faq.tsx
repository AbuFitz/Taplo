import { ChevronDown } from "lucide-react"
import type { BlockOf } from "../contracts/blocks"
import { Section, type BlockProps } from "./shared"

/** Native <details> keeps this server-rendered, keyboard accessible, and JS-free. */
function Item({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-tp-border py-1">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
        {q}
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <p className="pb-4 text-tp-muted">{a}</p>
    </details>
  )
}

function AccordionFaq({ vm }: BlockProps<BlockOf<"faq">>) {
  return <Section id="faq" title="Questions" containerClassName="max-w-3xl">{vm.business.faqs.map((f) => <Item key={f.id} q={f.question} a={f.answer} />)}</Section>
}

function ColumnFaq({ vm }: BlockProps<BlockOf<"faq">>) {
  return (
    <Section id="faq" title="Frequently asked questions">
      <dl className="grid gap-x-12 gap-y-8 md:grid-cols-2">
        {vm.business.faqs.map((f) => <div key={f.id}><dt className="font-tp-heading text-lg font-semibold">{f.question}</dt><dd className="mt-2 text-tp-muted">{f.answer}</dd></div>)}
      </dl>
    </Section>
  )
}

export function FaqBlock(props: BlockProps<BlockOf<"faq">>) {
  return props.config.variant === "accordion" ? <AccordionFaq {...props} /> : <ColumnFaq {...props} />
}
