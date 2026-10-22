import type { StyleOverrides, StyleSpec, WidgetAppearance } from "../contracts/style";
import { styleOverridesSchema } from "../contracts/style";
import { DEFAULT_THEME_ID, getTheme, type ThemeDefinition } from "./catalogue";
import { contrastRatio, ensureReadable, mix, readableOn } from "./color";
import { FONT_STACKS } from "./fonts";
import { deriveRoles, elevation } from "./roles";

export interface StyleNotice {
  code: string;
  /** Plain-language message shown to the owner. */
  message: string;
}

export interface ContrastCheck {
  label: string;
  ratio: number;
  ok: boolean;
}

export interface ResolvedStyle {
  theme: ThemeDefinition;
  spec: StyleSpec;
  cssVars: Record<string, string>;
  /** Finite enum attributes for CSS attribute selectors (no class interpolation). */
  attrs: Record<string, string>;
  notices: StyleNotice[];
  contrast: ContrastCheck[];
  /** Count of owner overrides still in effect (drives "reset to theme"). */
  overrideCount: number;
}

const RADIUS = { none: "0px", sm: "0.375rem", md: "0.75rem", lg: "1.25rem", xl: "1.75rem", pill: "999px" } as const;
const BTN_RADIUS = { square: "0px", rounded: "0.75rem", pill: "999px" } as const;
const BORDER_W = { none: "0px", thin: "1px", thick: "2.5px" } as const;
const PAD = { compact: "0.75rem", comfortable: "1rem", roomy: "1.5rem" } as const;
const WIDTH = { narrow: "30rem", regular: "36rem", wide: "44rem" } as const;
const GAP = { compact: "0.625rem", comfortable: "0.875rem" } as const;
const SCALE = { sm: "0.94", md: "1", lg: "1.1" } as const;

export function countOverrides(o: StyleOverrides): number {
  let n = 0;
  for (const [k, v] of Object.entries(o)) {
    if (k === "background" || k === "decoration") n += v === undefined ? 0 : 1;
    else if (v && typeof v === "object") n += Object.values(v).filter((x) => x !== undefined).length;
  }
  return n;
}

function bgSamples(spec: StyleSpec): string[] {
  const b = spec.background;
  if (b.kind === "solid") return [b.color];
  if (b.kind === "gradient") return [b.from, b.to, mix(b.from, b.to, 0.5)];
  if (b.kind === "shader") return [b.base, ...b.colors];
  return [b.fallback];
}

/** Smallest overlay (<=90) at which `text` reads on a worst-case (white or black) photo. */
function minOverlay(text: string, overlayColor: string): number {
  for (let o = 0; o <= 90; o += 5) {
    const w = mix("#ffffff", overlayColor, o / 100);
    const k = mix("#000000", overlayColor, o / 100);
    if (contrastRatio(text, w) >= 4.5 && contrastRatio(text, k) >= 4.5) return o;
  }
  return 90;
}

export function deriveButton(
  colors: StyleSpec["colors"],
  buttons: StyleSpec["buttons"],
  over: { fill?: StyleSpec["buttons"]["fill"]; accent?: string; background?: string; text?: string } = {},
) {
  const fill = over.fill ?? buttons.fill;
  const accent = over.accent ?? colors.accent;
  const solidBg = over.background ?? buttons.background ?? accent;
  if (fill === "solid") {
    const t = ensureReadable(over.text ?? buttons.text ?? readableOn(solidBg), solidBg);
    return { bg: solidBg, text: t.color, border: buttons.border ?? solidBg };
  }
  if (fill === "outline") {
    const border = buttons.border ?? accent;
    const t = ensureReadable(over.text ?? buttons.text ?? colors.text, colors.background);
    return { bg: "transparent", text: t.color, border };
  }
  const soft = mix(colors.surface, accent, 0.16);
  const wanted = over.text ?? buttons.text ?? accent;
  const t = ensureReadable(wanted, soft);
  return { bg: soft, text: t.color, border: mix(colors.surface, accent, 0.3) };
}

export function resolveStyle(themeId: string, rawOverrides: unknown = {}): ResolvedStyle {
  const notices: StyleNotice[] = [];
  let theme = getTheme(themeId);
  if (!theme) {
    notices.push({ code: "theme_missing", message: "The theme you picked is no longer available, so a standard look is being used." });
    theme = getTheme(DEFAULT_THEME_ID)!;
  }

  // Keep every individually valid override; drop corrupt ones instead of failing the page.
  let ov: StyleOverrides = {};
  const parsed = styleOverridesSchema.safeParse(rawOverrides ?? {});
  if (parsed.success) ov = parsed.data;
  else {
    for (const [k, v] of Object.entries((rawOverrides ?? {}) as Record<string, unknown>)) {
      const one = styleOverridesSchema.safeParse({ [k]: v });
      if (one.success) Object.assign(ov, one.data);
      else notices.push({ code: "override_invalid", message: "One saved design setting was invalid and was ignored." });
    }
  }

  const base = theme.style;
  const spec: StyleSpec = {
    colors: { ...base.colors, ...ov.colors },
    text: { ...base.text, ...ov.text },
    background: ov.background ?? base.background,
    header: { ...base.header, ...ov.header },
    buttons: { ...base.buttons, ...ov.buttons },
    cards: { ...base.cards, ...ov.cards },
    layout: { ...base.layout, ...ov.layout },
    decoration: ov.decoration ?? base.decoration,
    motion: ov.motion ?? base.motion ?? "subtle",
  };
  // A "page colour" override recolours a plain-colour background (gradients/photos keep their own).
  if (!ov.background && ov.colors?.background && base.background.kind === "solid") spec.background = { kind: "solid", color: ov.colors.background };
  const contrast: ContrastCheck[] = [];
  const check = (label: string, ratio: number, min = 4.5) => contrast.push({ label, ratio: Math.round(ratio * 10) / 10, ok: ratio >= min });

  // ---- page text on page background
  const samples = bgSamples(spec);
  const worst = (fg: string) => Math.min(...samples.map((s) => contrastRatio(fg, s)));
  if (spec.background.kind === "image") {
    const need = minOverlay(spec.colors.text, spec.background.overlayColor);
    if (spec.background.overlay < need) {
      notices.push({ code: "overlay_boosted", message: "The photo overlay was strengthened so text stays readable over any picture." });
      spec.background = { ...spec.background, overlay: need };
    }
  } else if (worst(spec.colors.text) < 4.5) {
    const pick = [spec.colors.text, "#ffffff", "#111111"].map((c) => ({ c, r: worst(c) })).sort((a, b) => b.r - a.r)[0]!;
    notices.push({ code: "text_adjusted", message: "Text colour was adjusted because it was hard to read on this background." });
    spec.colors.text = pick.c;
  }
  if (spec.background.kind !== "image" && worst(spec.colors.muted) < 4.5) spec.colors.muted = spec.colors.text;
  const refBg = spec.background.kind === "image" ? mix(spec.background.overlayColor, "#808080", 1 - spec.background.overlay / 100) : mix(samples[0]!, samples[samples.length - 1]!, 0.5);
  check("Text on page background", spec.background.kind === "image" ? Math.min(contrastRatio(spec.colors.text, mix("#ffffff", spec.background.overlayColor, spec.background.overlay / 100)), contrastRatio(spec.colors.text, mix("#000000", spec.background.overlayColor, spec.background.overlay / 100))) : worst(spec.colors.text));
  if (spec.background.kind === "image") check("Photo overlay strength", spec.background.overlay >= 30 ? 4.5 : 3, 4.5);

  // ---- text on cards
  const cardBase = spec.cards.surface === "transparent" ? refBg : spec.cards.surface === "glass" ? mix(refBg, spec.colors.surface, spec.cards.opacity / 100) : spec.colors.surface;
  if (contrastRatio(spec.colors.text, cardBase) < 4.5 && spec.cards.surface !== "transparent") {
    notices.push({ code: "card_adjusted", message: "Card colour was adjusted so the text on cards is readable." });
    spec.colors.surface = readableOn(spec.colors.text);
    spec.cards = { ...spec.cards, surface: "solid", opacity: 100 };
  }
  check("Text on cards", contrastRatio(spec.colors.text, spec.cards.surface === "transparent" ? refBg : spec.colors.surface));

  // ---- accent/button
  const a = ensureReadable(spec.colors.accentText, spec.colors.accent);
  if (a.adjusted) {
    notices.push({ code: "accent_text_adjusted", message: "Button text colour was adjusted so it reads on your accent colour." });
    spec.colors.accentText = a.color;
  }
  const btn = deriveButton(spec.colors, spec.buttons);
  check("Button text", contrastRatio(btn.text, btn.bg === "transparent" ? spec.colors.background : btn.bg));

  const ratio = (n: number) => n;
  void ratio;
  const hardShadow = `4px 4px 0 0 ${spec.colors.text}`;
  const cardBg =
    spec.cards.surface === "transparent"
      ? "transparent"
      : spec.cards.surface === "soft"
        ? "var(--tp-surface-2)"
        : `color-mix(in srgb, ${spec.colors.surface} ${spec.cards.surface === "glass" ? spec.cards.opacity : 100}%, transparent)`;

  const bg = spec.background;
  const pageBg = bg.kind === "solid" ? bg.color : bg.kind === "gradient" ? mix(bg.from, bg.to, 0.5) : bg.kind === "shader" ? bg.base : bg.fallback;
  const roles = deriveRoles(spec.colors, pageBg);
  const el = elevation(roles);
  const cssVars: Record<string, string> = {
    "--tp-background": pageBg,
    "--tp-foreground": spec.colors.text,
    "--tp-muted": spec.colors.muted,
    "--tp-surface": spec.colors.surface,
    "--tp-accent": spec.colors.accent,
    "--tp-accent-foreground": spec.colors.accentText,
    "--tp-border": spec.colors.border,
    "--tp-font-heading": FONT_STACKS[spec.text.headingFont],
    "--tp-font-body": FONT_STACKS[spec.text.bodyFont],
    "--tp-heading-case": spec.text.headingCase === "upper" ? "uppercase" : "none",
    "--tp-heading-weight": spec.text.headingWeight === "bold" ? "700" : "500",
    "--tp-heading-tracking": spec.text.headingCase === "upper" ? "0.02em" : "-0.01em",
    "--tp-scale": SCALE[spec.text.size],
    "--tp-text-align": spec.text.align,
    "--tp-card-bg": cardBg,
    "--tp-card-radius": RADIUS[spec.cards.radius],
    "--tp-card-border-w": BORDER_W[spec.cards.border],
    "--tp-card-shadow": spec.cards.shadow === "soft" ? `${el.e2}, var(--tp-edge)` : spec.cards.shadow === "hard" ? hardShadow : "none",
    "--tp-card-pad": PAD[spec.cards.padding],
    "--tp-card-blur": spec.cards.surface === "glass" ? "22px" : "0px",
    "--tp-surface-2": roles.surface2,
    "--tp-line": roles.line,
    "--tp-line-strong": roles.lineStrong,
    "--tp-ink-3": roles.ink3,
    "--tp-accent-hover": roles.accentHover,
    "--tp-accent-press": roles.accentPress,
    "--tp-accent-soft": roles.accentSoft,
    "--tp-accent-line": roles.accentLine,
    "--tp-edge": el.edge,
    "--tp-shadow-1": el.e1,
    "--tp-shadow-2": el.e2,
    "--tp-shadow-3": el.e3,
    "--tp-radius-sm": `calc(${RADIUS[spec.cards.radius]} * 0.5)`,
    "--tp-radius-md": `calc(${RADIUS[spec.cards.radius]} * 0.75)`,
    "--tp-btn-sheen": spec.buttons.fill === "solid" && spec.buttons.shadow !== "hard" ? "linear-gradient(180deg, rgb(255 255 255 / 0.16), rgb(255 255 255 / 0) 62%)" : "none",
    "--tp-btn-hover": spec.buttons.fill === "solid" ? roles.accentHover : "transparent",
    "--tp-btn-bg": btn.bg,
    "--tp-btn-text": btn.text,
    "--tp-btn-border": btn.border,
    "--tp-btn-radius": BTN_RADIUS[spec.buttons.shape],
    "--tp-btn-shadow": spec.buttons.shadow === "soft" ? el.e1 : spec.buttons.shadow === "hard" ? hardShadow : "none",
    "--tp-btn-border-w": spec.buttons.fill === "outline" || spec.buttons.shadow === "hard" || spec.cards.border === "thick" ? "2px" : "1px",
    "--tp-width": WIDTH[spec.layout.width],
    "--tp-gap": GAP[spec.layout.density],
    "--tp-radius": RADIUS[spec.cards.radius],
  };

  return {
    theme,
    spec,
    cssVars,
    attrs: {
      "data-decoration": spec.decoration,
      "data-motion": bg.kind === "gradient" && bg.motion ? "drift" : "none",
      "data-header": spec.header.layout,
      "data-desktop": spec.layout.desktop,
      "data-density": spec.layout.density,
      "data-card-surface": spec.cards.surface,
      "data-btn-fill": spec.buttons.fill,
      "data-btn-icons": spec.buttons.showIcons ? "on" : "off",
      "data-bg": bg.kind,
      "data-tone": roles.dark ? "dark" : "light",
      "data-motion-level": spec.motion ?? "subtle",
    },
    notices,
    contrast,
    overrideCount: countOverrides(ov),
  };
}

/** Static stand-in for a shader wallpaper: layered radial colour fields on the base colour. Used until the shader mounts, for reduced motion and without WebGL. */
export function shaderFallbackCss(b: { colors: string[]; base: string }): string {
  const spots = [["18% 12%", 0], ["88% 22%", 1], ["70% 92%", 2], ["8% 78%", 3]] as const;
  const layers = b.colors.map((c, i) => `radial-gradient(60% 55% at ${spots[i % spots.length]![0]}, ${c} 0%, transparent 70%)`);
  return `${layers.join(", ")}, ${b.base}`;
}

/** Background layer CSS (solid/gradient only; images render as an element). */
export function backgroundCss(spec: StyleSpec): string | undefined {
  const b = spec.background;
  if (b.kind === "solid") return b.color;
  if (b.kind === "gradient") return `linear-gradient(${b.angle}deg, ${b.from}, ${b.to})`;
  if (b.kind === "shader") return shaderFallbackCss(b);
  return undefined;
}

/** Per-widget variable overrides + attributes; empty when the widget follows the page style. */
export function widgetStyle(style: ResolvedStyle, a: WidgetAppearance): { vars: Record<string, string>; attrs: Record<string, string> } {
  const vars: Record<string, string> = {};
  const attrs: Record<string, string> = {};
  const { spec } = style;
  const accent = a.accent ?? spec.colors.accent;
  const featured = a.emphasis === "featured";

  if (a.surface === "accent") {
    const t = ensureReadable(spec.colors.accentText, accent);
    vars["--tp-card-bg"] = accent;
    vars["--tp-foreground"] = t.color;
    vars["--tp-muted"] = t.color;
    vars["--tp-border"] = accent;
    attrs["data-card-surface"] = "solid";
  } else if (a.surface === "transparent") {
    vars["--tp-card-bg"] = "transparent";
    attrs["data-card-surface"] = "transparent";
  } else if (a.surface === "glass") {
    vars["--tp-card-bg"] = `color-mix(in srgb, ${spec.colors.surface} 62%, transparent)`;
    vars["--tp-card-blur"] = "22px";
    attrs["data-card-surface"] = "glass";
  } else if (a.surface === "soft") {
    vars["--tp-card-bg"] = "var(--tp-surface-2)";
    vars["--tp-card-blur"] = "0px";
    attrs["data-card-surface"] = "soft";
  } else if (a.surface === "solid") {
    vars["--tp-card-bg"] = spec.colors.surface;
    vars["--tp-card-blur"] = "0px";
    attrs["data-card-surface"] = "solid";
  }
  if (a.background) {
    vars["--tp-card-bg"] = a.background;
    const t = ensureReadable(a.text ?? spec.colors.text, a.background);
    vars["--tp-foreground"] = t.color;
    vars["--tp-muted"] = t.color;
  } else if (a.text && a.surface !== "accent") {
    const surfaceNow = a.surface === "transparent" ? spec.colors.background : spec.colors.surface;
    const t = ensureReadable(a.text, surfaceNow);
    vars["--tp-foreground"] = t.color;
  }
  if (a.accent) {
    vars["--tp-accent"] = a.accent;
    vars["--tp-accent-foreground"] = ensureReadable(spec.colors.accentText, a.accent).color;
  }
  if (a.radius) {
    vars["--tp-card-radius"] = RADIUS[a.radius];
    if (a.radius === "pill") vars["--tp-card-radius"] = "1.75rem";
  }
  if (a.border) vars["--tp-card-border-w"] = BORDER_W[a.border];
  if (a.shadow) vars["--tp-card-shadow"] = a.shadow === "soft" ? `${style.cssVars["--tp-shadow-2"]}, var(--tp-edge)` : a.shadow === "hard" ? `4px 4px 0 0 ${vars["--tp-foreground"] ?? spec.colors.text}` : "none";
  if (a.padding) vars["--tp-card-pad"] = PAD[a.padding];
  if (a.align) vars["--tp-text-align"] = a.align;
  if (featured) {
    vars["--tp-card-pad"] = PAD.roomy;
    attrs["data-featured"] = "true";
  }

  const needsButton = a.buttonFill || a.buttonShape || a.accent || a.background || a.text || a.surface === "accent";
  if (needsButton) {
    // On an accent-filled card, buttons invert so they stay distinguishable.
    const inverted = a.surface === "accent";
    const btn = inverted
      ? { bg: ensureReadable(spec.colors.accentText, accent).color, text: accent, border: ensureReadable(spec.colors.accentText, accent).color }
      : deriveButton(spec.colors, spec.buttons, { fill: a.buttonFill, accent });
    vars["--tp-btn-bg"] = btn.bg;
    vars["--tp-btn-text"] = btn.text;
    vars["--tp-btn-border"] = btn.border;
    if (a.buttonFill) attrs["data-btn-fill"] = a.buttonFill;
  }
  if (a.buttonShape) vars["--tp-btn-radius"] = BTN_RADIUS[a.buttonShape];
  return { vars, attrs };
}
