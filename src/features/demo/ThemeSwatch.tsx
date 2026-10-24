import type { Look } from "@/features/page/themes/looks"

/** A compact map of the composition. The live canvas shows the owner's actual content. */
export function ThemeSwatch({ look }: { look: Look }) {
  const { colors: c, header: h, buttons } = look.overrides
  const centered = h?.layout === "centered"
  const photo = h?.layout === "feature" || h?.layout === "cover" || h?.layout === "poster"
  const side = h?.layout === "side"
  const line = (width: string, opacity: number) => <span className="block h-1 rounded-full" style={{ width, background: c?.text, opacity }} />
  return <span aria-hidden="true" className="theme-swatch flex aspect-[3/4] w-full flex-col gap-2.5 overflow-hidden rounded-xl p-3" style={{ background: c?.background, color: c?.text }}>
    {photo ? <span className="block h-[30%] shrink-0 rounded-lg" style={{ background: c?.text, opacity: .12 }} /> : null}
    <span className={`flex gap-2 ${centered ? "flex-col items-center" : side ? "items-center" : "flex-col"}`}>
      {!photo ? <span className={`block size-6 shrink-0 ${centered ? "rounded-full" : "rounded-lg"}`} style={{ background: c?.text, opacity: .18 }} /> : null}
      <span className={`flex w-full flex-col gap-1.5 ${centered ? "items-center" : ""}`}>{line("75%", .85)}{line("50%", .25)}</span>
    </span>
    <span className="mt-auto flex flex-col gap-2">
      {[0, 1].map(row => <span key={row} className="flex items-center justify-between gap-2">{line("50%", .3)}{line("18%", .65)}</span>)}
      <span className="mt-1 block h-5" style={{ background: c?.accent, borderRadius: buttons?.shape === "pill" ? 999 : 8 }} />
    </span>
  </span>
}
