import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteFooter, SiteHeader } from "@/features/marketing/Site"

const DOCS = { privacy: "Privacy notice", terms: "Terms of service" } as const
type Doc = keyof typeof DOCS

export function generateStaticParams() { return (Object.keys(DOCS) as Doc[]).map((doc) => ({ doc })) }
export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const d = (await params).doc as Doc
  return d in DOCS ? { title: `${DOCS[d]} | Taplo`, robots: { index: false } } : {}
}

/**
 * The approved legal text has not been supplied, and none is invented here: the page says so in one line. What is still
 * needed is tracked in docs/launch-dependencies.md.
 */
export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const d = (await params).doc as Doc
  if (!(d in DOCS)) notFound()
  return (
    <div className="bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-5 py-20 sm:py-28">
        <h1 className="font-display font-display-tight text-[clamp(2rem,5vw,3.25rem)]">{DOCS[d]}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70">The full {DOCS[d].toLowerCase()} will be published here before Taplo opens to the public. Draft pages and example submissions are stored in this browser. Visiting Taplo also sends normal web requests to hosting and asset services.</p>
      </main>
      <SiteFooter />
    </div>
  )
}
