import "../fonts"
import { ThemeRoot } from "@/components/taplo/theme-root"
import { renderBlock } from "../blocks/registry"
import { ActionButton } from "../blocks/shared"
import type { PublicProfileViewModel } from "./view-model"

/**
 * The one renderer for preview AND live output. Callers differ only in which
 * data they pass in (draft for authorised preview, published snapshot for
 * public) — never in how it is drawn.
 */
export function ProfileRenderer({ vm }: { vm: PublicProfileViewModel }) {
  const mobile = vm.mobileAction
  return (
    <ThemeRoot family={vm.family} cssVars={vm.cssVars} className={mobile ? "pb-24 md:pb-0" : undefined}>
      <main>
        {vm.blocks.map(({ config }) => (
          <div key={config.id} data-block={config.type} data-variant={config.variant}>
            {renderBlock(config, vm)}
          </div>
        ))}
      </main>
      <footer className="border-t border-tp-border py-8 text-center text-sm text-tp-muted">
        <div className="tp-container">
          <p>{vm.business.identity.name}</p>
          {vm.showBranding ? (
            <p className="mt-1">
              <a className="underline underline-offset-4" href="https://taplo.co">Made with Taplo</a>
            </p>
          ) : null}
        </div>
      </footer>
      {mobile ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-tp-border bg-tp-bg/95 p-3 backdrop-blur md:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <div className="mx-auto flex max-w-md gap-2">
            <ActionButton action={mobile} size="lg" className="flex-1" />
            {vm.secondaryActions.find((a) => a.kind === "whatsapp" && a.kind !== mobile.kind) ? (
              <ActionButton action={vm.secondaryActions.find((a) => a.kind === "whatsapp")!} tone="secondary" size="lg" />
            ) : null}
          </div>
        </div>
      ) : null}
    </ThemeRoot>
  )
}
