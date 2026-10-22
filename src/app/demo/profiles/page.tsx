import Link from "next/link"
import type { Metadata } from "next"
import { FIXTURES } from "@/features/themes/fixtures"
import { THEMES, getTheme } from "@/features/page/themes/catalogue"
import { getIndustryPreset } from "@/features/themes/presets/industries"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Sample profiles — Taplo", robots: { index: false, follow: false } }

const HEADLINE = ["mechanic", "barber", "tutor", "cafe", "consultant", "unlisted"]

/** Stable, server-rendered sample pages. No localStorage and no sign-in: send these links to anyone. */
export default function SampleProfiles() {
  const featured = HEADLINE.map((k) => FIXTURES.find((f) => f.key === k)!)
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10">
      <p className="text-sm font-semibold text-neutral-600"><Link href="/">Taplo</Link></p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Sample profiles</h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Invented businesses, rendered by the same engine as every real Taplo page. Industry and look are independent: a mechanic can be soft and light, a tutor dark and bold. Open any link on your phone.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((f) => (
          <li key={f.key} className="flex flex-col rounded-xl border p-4">
            <p className="text-xs uppercase tracking-wider text-neutral-500">{getIndustryPreset(f.content.identity.industryKey).label}</p>
            <h2 className="mt-1 font-semibold">{f.content.identity.name}</h2>
            <p className="text-sm text-neutral-600">Look: <strong>{getTheme(f.page.themeId)?.name}</strong></p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <Link className="rounded-md bg-neutral-900 px-3 py-2 font-medium text-white" href={`/${f.content.identity.slug}`}>Open page</Link>
              <Link className="rounded-md border px-3 py-2" href={`/demo/themes?fixture=${f.key}`}>Try every look</Link>
            </div>
            <p className="mt-3 text-xs text-neutral-500">/{f.content.identity.slug}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-12 text-lg font-semibold">The same business in every look</h2>
      <p className="mt-1 text-sm text-neutral-600">Add <code>?theme=</code> to any sample address:</p>
      <ul className="mt-3 flex flex-wrap gap-2 text-sm">
        {THEMES.map((t) => <li key={t.id}><Link className="rounded-full border px-3 py-1.5" href={`/demo-barber?theme=${t.id}`}>{t.name}</Link></li>)}
      </ul>
      <p className="mt-10 text-sm text-neutral-600">Build your own: <Link className="underline" href="/onboarding">Create your page</Link> · <Link className="underline" href="/dashboard/page">My page editor</Link></p>
    </main>
  )
}
