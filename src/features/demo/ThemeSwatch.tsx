import type { Look } from "@/features/page/themes/looks"
import { FONT_STACKS } from "@/features/page/themes/font-metadata"

/** A compact illustration of the engine choices; the owner's live page supplies the full preview. */
export function ThemeSwatch({ look }: { look: Look }) {
  const o=look.overrides, c=o.colors!, shape=o.buttons?.shape
  return <span aria-hidden="true" className="relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-xl p-3" style={{ background:c.background,color:c.text }}>
    <span className="mt-1 text-[clamp(2.5rem,6vw,3.5rem)] leading-none tracking-[-0.06em]" style={{ fontFamily:FONT_STACKS[o.text!.headingFont!],fontWeight:o.text?.headingWeight==='regular'?400:700 }}>Aa</span>
    <span className="relative flex min-h-9 items-center justify-center border text-[10px] font-semibold" style={{ background:c.accent,color:c.accentText,borderColor:c.border,borderRadius:shape==='pill'?'999px':shape==='square'?'0':'8px',boxShadow:o.buttons?.shadow==='hard'?`3px 3px 0 ${c.text}`:undefined }}>Your next step <span className="ml-2" aria-hidden="true">↗</span></span>
  </span>
}
