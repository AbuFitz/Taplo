import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { devToolsEnabled } from "@/lib/env"
import { FIXTURES, getFixture } from "@/features/themes/fixtures"
import { LAYOUT_PRESETS } from "@/features/themes/presets/layouts"
import { visibleBlockTypes } from "@/features/themes/renderer"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Theme showcase (dev)", robots: { index: false, follow: false } }

const VIEWPORTS = { mobile: 390, tablet: 820, desktop: 1280 } as const
type Viewport = keyof typeof VIEWPORTS

export default async function ThemesShowcase({ searchParams }: { searchParams: Promise<{ fixture?: string; viewport?: string; plan?: string }> }) {
  if (!devToolsEnabled()) notFound()
  const sp = await searchParams
  const fixture = getFixture(sp.fixture ?? "") ?? FIXTURES[0]!
  const viewport: Viewport = sp.viewport === "mobile" || sp.viewport === "tablet" ? sp.viewport : "desktop"
  const width = VIEWPORTS[viewport]
  const scale = viewport === "mobile" ? 0.62 : viewport === "tablet" ? 0.42 : 0.3
  const height = viewport === "mobile" ? 1400 : 1500
  const qs = (patch: Record<string, string>) => new URLSearchParams({ fixture: fixture.key, viewport, ...(sp.plan ? { plan: sp.plan } : {}), ...patch }).toString()
  const planParam = sp.plan ? `?plan=${sp.plan}` : ""

  return (
    <div className="mx-auto w-full max-w-[1800px] p-4 sm:p-6">
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="destructive">Development only</Badge>
          <h1 className="text-xl font-semibold">Theme showcase</h1>
        </div>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          One synthetic business dataset rendered through every layout family by the same engine. Fixtures are invented placeholders — never real business data.
        </p>
      </header>

      <nav aria-label="Fixtures" className="mb-3 flex flex-wrap gap-2">
        {FIXTURES.map((f) => (
          <Button key={f.key} asChild size="sm" variant={f.key === fixture.key ? "default" : "outline"}>
            <Link href={`/dev/themes?${qs({ fixture: f.key })}`}>{f.label}</Link>
          </Button>
        ))}
      </nav>
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Viewport</span>
        {(Object.keys(VIEWPORTS) as Viewport[]).map((v) => (
          <Button key={v} asChild size="sm" variant={v === viewport ? "default" : "outline"}>
            <Link href={`/dev/themes?${qs({ viewport: v })}`}>{v} {VIEWPORTS[v]}px</Link>
          </Button>
        ))}
        <span className="ml-4 text-muted-foreground">Plan</span>
        {(["free", "core", "pro", "business"] as const).map((p) => (
          <Button key={p} asChild size="sm" variant={(sp.plan ?? fixture.plan) === p ? "default" : "outline"}>
            <Link href={`/dev/themes?${qs({ plan: p })}`}>{p}</Link>
          </Button>
        ))}
      </div>

      <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr))]">
        {LAYOUT_PRESETS.map((layout) => {
          const sections = visibleBlockTypes(fixture.content, layout.id, (sp.plan as never) ?? fixture.plan)
          return (
            <section key={layout.id} aria-labelledby={`h-${layout.id}`}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <h2 id={`h-${layout.id}`} className="font-medium">{layout.label} <span className="text-xs text-muted-foreground">v{layout.version}</span></h2>
                <Link className="text-sm underline underline-offset-4" href={`/dev/themes/preview/${fixture.key}/${layout.id}${planParam}`} target="_blank">Open full</Link>
              </div>
              <p className="mb-2 text-xs text-muted-foreground">Sections shown: {sections.join(" → ")}</p>
              <div className={cn("overflow-hidden rounded-lg border bg-muted")} style={{ width: width * scale, height: height * scale }}>
                <iframe
                  title={`${fixture.label} — ${layout.label} layout`}
                  src={`/dev/themes/preview/${fixture.key}/${layout.id}${planParam}`}
                  loading="lazy"
                  style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left", border: 0 }}
                />
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
