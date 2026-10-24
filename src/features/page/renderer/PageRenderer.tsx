import "../themes/fonts"
import Link from "next/link"
import "./page.css"
import "./widget-layouts.css"
import { ThemeRoot } from "@/components/taplo/theme-root"
import { renderWidgetBody } from "../widgets/renderers"
import { SharePanel } from "../widgets/ShareClient"
import { Share2, ArrowUpRight } from "lucide-react"
import { Background } from "./Background"
import { PageHeader } from "./Header"
import type { PageViewModel } from "./view-model"

/**
 * THE renderer. The editor preview, the published page and every demo/fixture route call
 * this with a view-model; they differ only in which data they pass in.
 */
/** Widgets whose items are cards in their own right: they get no outer panel. */
const BARE = new Set(["team", "products", "gallery"])
const ITEM_SURFACES: Record<string, readonly string[]> = {
  serviceList: ["cards", "spotlight"], priceMenu: ["panels"], faq: ["cards"], offers: ["cards"], text: ["statement"],
}
const hasItemSurfaces = (w: PageViewModel["widgets"][number]) => BARE.has(w.type) || ITEM_SURFACES[w.type]?.includes(String(w.settings.variant))

export type PageFragment = { kind: "header" } | { kind: "widget"; id: string }

export function PageRenderer({ vm, bare = false, fragment }: { vm: PageViewModel; /** Component workbench only: render the widgets without the page header. */ bare?: boolean; /** Design/capture surfaces render the same components, without unrelated content. */ fragment?: PageFragment }) {
  const visible = fragment?.kind === "widget" ? vm.widgets.filter((w) => w.id === fragment.id && w.status.state === "ready") : vm.visible
  return (
    <ThemeRoot family="page" cssVars={vm.style.cssVars} attrs={vm.style.attrs}>
      <Background vm={vm} still={Boolean(fragment)} />
      <div className="tp-frame">
        {bare || fragment?.kind === "widget" ? null : <PageHeader vm={vm} />}
        {fragment?.kind === "header" ? null : <main className="tp-widgets" aria-label="Page content">
          {visible.map((w, i) => (
            <section key={w.id} className="tp-widget" data-widget={w.type} data-bare={hasItemSurfaces(w) ? "" : undefined} data-widget-id={w.id} {...w.style.attrs} style={{ ...w.style.vars, "--i": i } as React.CSSProperties}>
              {renderWidgetBody(w, vm)}
            </section>
          ))}
        </main>}
        {fragment ? null : <footer aria-label={`${vm.business.identity.name} business page footer`} className="pb-2 text-center text-sm tp-muted" style={{ gridColumn: "1 / -1" }}>
          {[vm.business.identity.heroImage, ...vm.business.products.map(p => p.image)].some(image => image?.src.startsWith('/photography/')) ? <p className="mb-2 text-xs"><a href="/credits" target="_blank" rel="noreferrer" className="underline underline-offset-4">Photography credits</a></p> : null}
          <SharePanel data={{ name: vm.business.identity.name, slug: vm.business.identity.slug }} trigger={<button type="button" className="mx-auto mb-3 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4" aria-label="Share page"><Share2 aria-hidden="true" className="size-4" />Share</button>} />
          {vm.showBranding ? <Link href="/onboarding" target="_top" className="group mx-auto flex min-h-11 w-fit flex-wrap items-center justify-center gap-x-2 rounded-full px-4 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-4"><span>Powered by <strong className="font-semibold">Taplo</strong></span><span aria-hidden="true">·</span><span className="inline-flex items-center gap-1">Build your own<ArrowUpRight aria-hidden="true" className="size-3" /></span></Link> : null}
        </footer>}
      </div>
    </ThemeRoot>
  )
}
