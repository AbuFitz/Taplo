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
 * The approved legal text has not been supplied, and none is invented here. This page states that plainly
 * and lists what is needed so it can be published, instead of showing text that looks authoritative but is not.
 */
export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const d = (await params).doc as Doc
  if (!(d in DOCS)) notFound()
  return (
    <div className="bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-5 py-20 sm:py-28">
        <h1 className="font-display font-display-tight text-[clamp(2.5rem,7vw,4.5rem)]">{DOCS[d]}</h1>
        <p className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-50 p-5 text-[0.9375rem] leading-relaxed text-amber-950"><strong>Not published yet.</strong> Taplo is in preview and the approved {DOCS[d].toLowerCase()} has not been supplied. This page will show the real text once it is. Nothing here is legal advice or a statement of how the live service will behave.</p>
        <h2 className="mt-10 text-lg font-semibold">What is needed before launch</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-foreground/75">
          <li>The company name, registered address and registration number that operate Taplo.</li>
          <li>{d === "privacy" ? "The approved privacy notice, including data controller, purposes, retention and rights contact." : "The approved terms covering accounts, acceptable use, plans and billing."}</li>
          <li>A support and reporting contact for businesses and the public.</li>
          <li>Cookie and consent wording that matches what the live service actually sets.</li>
        </ul>
        <p className="mt-8 text-sm text-foreground/60">In this preview, everything you enter is stored in your own browser and is not sent anywhere.</p>
      </main>
      <SiteFooter />
    </div>
  )
}
