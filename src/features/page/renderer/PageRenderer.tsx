import "../themes/fonts"
import "./page.css"
import { ThemeRoot } from "@/components/taplo/theme-root"
import { renderWidgetBody } from "../widgets/renderers"
import { Background } from "./Background"
import { PageHeader } from "./Header"
import type { PageViewModel } from "./view-model"

/**
 * THE renderer. The editor preview, the published page and every demo/fixture route call
 * this with a view-model; they differ only in which data they pass in.
 */
/** Widgets whose items are cards in their own right: they get no outer panel. */
const BARE = new Set(["team", "products", "gallery"])

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
            <section key={w.id} className="tp-widget" data-widget={w.type} data-bare={BARE.has(w.type) ? "" : undefined} data-widget-id={w.id} {...w.style.attrs} style={{ ...w.style.vars, "--i": i } as React.CSSProperties}>
              {renderWidgetBody(w, vm)}
            </section>
          ))}
        </main>}
        {fragment ? null : <footer className="pb-2 text-center text-sm tp-muted" style={{ gridColumn: "1 / -1" }}>
          {vm.showBranding ? <p><a className="underline underline-offset-4" href="https://taplo.co">Made with Taplo</a></p> : null}
        </footer>}
      </div>
    </ThemeRoot>
  )
}
