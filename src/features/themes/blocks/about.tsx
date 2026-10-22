import type { BlockOf } from "../contracts/blocks"
import { Section, type BlockProps } from "./shared"

function paragraphs(text?: string): string[] {
  return (text ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
}

function Prose({ text }: { text?: string }) {
  return <div className="grid max-w-prose gap-4 text-lg leading-relaxed">{paragraphs(text).map((p, i) => <p key={i}>{p}</p>)}</div>
}

function TextAbout({ vm }: BlockProps<BlockOf<"about">>) {
  return <Section id="about" title="About" className="border-t border-tp-border"><Prose text={vm.business.about} /></Section>
}

/** Split: label column + body, editorial rhythm. */
function SplitAbout({ vm }: BlockProps<BlockOf<"about">>) {
  return (
    <section id="about" aria-labelledby="about-heading" className="tp-section">
      <div className="tp-container grid gap-6 md:grid-cols-[12rem_1fr] md:gap-12">
        <h2 id="about-heading" className="text-xs font-semibold uppercase tracking-[0.22em] text-tp-muted md:pt-2">About</h2>
        <div>
          <Prose text={vm.business.about} />
          {vm.business.credentials.length ? (
            <ul className="mt-6 grid gap-1 text-sm text-tp-muted">{vm.business.credentials.map((c) => <li key={c}>{c}</li>)}</ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/** Credentials: explanation plus substantiated credentials list. Nothing is generated. */
function CredentialAbout({ vm }: BlockProps<BlockOf<"about">>) {
  const { about, credentials } = vm.business
  return (
    <Section id="about" title="How lessons work" eyebrow="About">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Prose text={about} />
        {credentials.length ? (
          <div className="rounded-tp border border-tp-border bg-tp-surface p-6">
            <h3 className="font-tp-heading text-lg font-semibold">Credentials</h3>
            <ul className="mt-3 grid gap-2">
              {credentials.map((c) => <li key={c} className="flex gap-2"><span aria-hidden="true" className="text-tp-accent">✓</span><span>{c}</span></li>)}
            </ul>
          </div>
        ) : null}
      </div>
    </Section>
  )
}

export function AboutBlock(props: BlockProps<BlockOf<"about">>) {
  switch (props.config.variant) {
    case "text": return <TextAbout {...props} />
    case "split": return <SplitAbout {...props} />
    case "credentials": return <CredentialAbout {...props} />
  }
}
