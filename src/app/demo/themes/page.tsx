import Link from "next/link"
import type { Metadata } from "next"
import { FIXTURES, getFixture } from "@/features/themes/fixtures"
import { THEMES } from "@/features/page/themes/catalogue"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Theme gallery — Taplo", robots: { index: false, follow: false } }

const VIEWPORTS = { phone: 390, desktop: 1280 } as const

/** One business through every theme, side by side: shows themes change the page, not the content. */
export default async function ThemeGallery({ searchParams }: { searchParams: Promise<{ fixture?: string; viewport?: string }> }) {
  const sp = await searchParams
  const fixture = getFixture(sp.fixture ?? "") ?? FIXTURES.find((f) => f.key === "barber")!
  const viewport = sp.viewport === "desktop" ? "desktop" : "phone"
  const width = VIEWPORTS[viewport]
  const scale = viewport === "phone" ? 0.62 : 0.28
  const height = viewport === "phone" ? 980 : 900
  return (
    <div className="mx-auto w-full max-w-[1800px] p-4 sm:p-6">
      <p className="text-sm"><Link className="underline" href="/demo/profiles">← Sample profiles</Link></p>
      <h1 className="mt-2 text-xl font-semibold">{fixture.content.identity.name} in every look</h1>
      <p className="mt-1 max-w-3xl text-sm text-neutral-600">Same business records, same widgets in the same order — only the theme changes. (Synthetic sample.)</p>
      <nav aria-label="Samples" className="mt-4 flex flex-wrap gap-2 text-sm">
        {FIXTURES.filter((f) => !["minimal", "no-contacts", "stress", "detailer"].includes(f.key)).map((f) => (
          <Link key={f.key} href={`/demo/themes?fixture=${f.key}&viewport=${viewport}`} className={`rounded-full border px-3 py-1.5 ${f.key === fixture.key ? "bg-neutral-900 text-white" : ""}`}>{f.label}</Link>
        ))}
        <span className="mx-2 self-center text-neutral-400">|</span>
        {(["phone", "desktop"] as const).map((v) => <Link key={v} href={`/demo/themes?fixture=${fixture.key}&viewport=${v}`} className={`rounded-full border px-3 py-1.5 ${v === viewport ? "bg-neutral-900 text-white" : ""}`}>{v}</Link>)}
      </nav>
      <div className="mt-6 grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
        {THEMES.map((t) => (
          <section key={t.id} aria-labelledby={`t-${t.id}`}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <h2 id={`t-${t.id}`} className="font-medium">{t.name}</h2>
              <Link className="text-sm underline underline-offset-4" href={`/${fixture.content.identity.slug}?theme=${t.id}`} target="_blank">Open</Link>
            </div>
            <p className="mb-2 text-xs text-neutral-600">{t.description}</p>
            <div className="overflow-hidden rounded-lg border" style={{ width: width * scale, height: height * scale }}>
              <iframe title={`${fixture.label} — ${t.name}`} src={`/${fixture.content.identity.slug}?theme=${t.id}`} loading="lazy" style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left", border: 0 }} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
