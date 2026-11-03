import type { Look } from "@/features/page/themes/looks"
import { resolveStyle, deriveButton, shaderFallbackCss } from "@/features/page/themes/resolve"
import { FONT_STACKS } from "@/features/page/themes/font-metadata"

/** A style sample uses the actual theme tokens, without miniature business text or screenshots. */
export function ThemeSwatch({ look }: { look: Look }) {
  const { spec } = resolveStyle(look.id)
  const bg = spec.background
  const background = bg.kind === "gradient" ? `linear-gradient(${bg.angle}deg,${bg.from},${bg.to})` : bg.kind === "solid" ? bg.color : bg.kind === "shader" ? shaderFallbackCss(bg) : bg.fallback
  const button = deriveButton(spec.colors, spec.buttons)
  return <span aria-hidden="true" className="theme-swatch" data-layout={spec.header.layout} style={{ background, color: spec.colors.text, fontFamily: FONT_STACKS[spec.text.headingFont], fontWeight: spec.text.headingWeight === "bold" ? 700 : 400 }}>
    <span className="theme-swatch-type">Aa</span>
    <span className="theme-swatch-content" style={{ background: spec.colors.surface, borderRadius: spec.cards.radius === "none" ? 0 : spec.cards.radius === "sm" ? 6 : 16 }}>
      <span className="theme-swatch-line" style={{ background: spec.colors.text }} />
      <span className="theme-swatch-line short" style={{ background: spec.colors.muted }} />
      <span className="theme-swatch-action" style={{ background: button.bg, color: button.text, border: `1px solid ${button.border}`, borderRadius: spec.buttons.shape === "pill" ? 999 : spec.buttons.shape === "square" ? 0 : 8 }} />
    </span>
  </span>
}
