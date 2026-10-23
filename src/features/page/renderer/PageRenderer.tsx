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

export function PageRenderer({ vm, bare = false }: { vm: PageViewModel; /** Component workbench only: render the widgets without the page header. */ bare?: boolean }) {
  return (
    <ThemeRoot family="page" cssVars={vm.style.cssVars} attrs={vm.style.attrs}>
      <Background vm={vm} />
      <div className="tp-frame">
        {bare ? null : <PageHeader vm={vm} />}
        <main className="tp-widgets" aria-label="Page content">
          {vm.visible.map((w, i) => (
            <section key={w.id} className="tp-widget" data-widget={w.type} data-bare={BARE.has(w.type) ? "" : undefined} data-widget-id={w.id} {...w.style.attrs} style={{ ...w.style.vars, "--i": i } as React.CSSProperties}>
              {renderWidgetBody(w, vm)}
            </section>
          ))}
        </main>
        <footer className="pb-2 text-center text-sm tp-muted" style={{ gridColumn: "1 / -1" }}>
          {vm.showBranding ? <p><a className="underline underline-offset-4" href="https://taplo.co">Made with Taplo</a></p> : null}
        </footer>
      </div>
    </ThemeRoot>
  )
}
