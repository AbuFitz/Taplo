import { tokenOverridesSchema, type TokenOverrides, type TokenSet, type FontKey } from "../contracts/tokens";
import { contrastRatio, MIN_TEXT_CONTRAST, readableOn } from "./contrast";
import { FALLBACK_TOKEN_PRESET_ID, getTokenPreset } from "./presets";

export interface ThemeWarning {
  code: string;
  message: string;
}

export interface ResolvedTokens {
  presetId: string;
  tokens: TokenSet;
  warnings: ThemeWarning[];
}

/**
 * Merge allowed overrides onto a preset. Invalid or low-contrast overrides
 * are dropped (never thrown) and reported as owner-visible warnings, so a
 * stored bad value cannot break a published page.
 */
export function resolveTokens(presetId: string, rawOverrides: unknown = {}): ResolvedTokens {
  const warnings: ThemeWarning[] = [];
  let preset = getTokenPreset(presetId);
  if (!preset) {
    warnings.push({
      code: "token_preset_missing",
      message: `Style preset "${presetId}" is no longer available; using the default style.`,
    });
    preset = getTokenPreset(FALLBACK_TOKEN_PRESET_ID)!;
  }

  const parsed = tokenOverridesSchema.safeParse(rawOverrides ?? {});
  let overrides: TokenOverrides = {};
  if (parsed.success) {
    overrides = parsed.data;
  } else {
    // Keep the individually valid keys; drop the rest.
    const input = (rawOverrides ?? {}) as Record<string, unknown>;
    for (const key of Object.keys(input)) {
      const single = tokenOverridesSchema.safeParse({ [key]: input[key] });
      if (single.success) Object.assign(overrides, single.data);
      else warnings.push({ code: "override_invalid", message: `Ignored invalid style setting "${key}".` });
    }
  }

  const merged: TokenSet = { ...preset.tokens };

  if (overrides.background) merged.background = overrides.background;
  if (overrides.foreground) merged.foreground = overrides.foreground;
  if (contrastRatio(merged.background, merged.foreground) < MIN_TEXT_CONTRAST) {
    warnings.push({
      code: "override_contrast_text",
      message: "Custom background and text colours were too close in contrast; reverted to the preset.",
    });
    merged.background = preset.tokens.background;
    merged.foreground = preset.tokens.foreground;
  } else {
    // Surfaces derived from the preset may no longer pair with new colours.
    if (overrides.background && contrastRatio(merged.surface, merged.foreground) < MIN_TEXT_CONTRAST) {
      merged.surface = merged.background;
    }
    if (overrides.background && contrastRatio(merged.background, merged.mutedForeground) < MIN_TEXT_CONTRAST) {
      merged.mutedForeground = merged.foreground;
    }
  }

  if (overrides.accent) {
    const fg = overrides.accentForeground ?? readableOn(overrides.accent);
    if (contrastRatio(overrides.accent, fg) >= MIN_TEXT_CONTRAST) {
      merged.accent = overrides.accent;
      merged.accentForeground = fg;
    } else {
      warnings.push({
        code: "override_contrast_accent",
        message: "That accent colour does not leave readable button text; kept the preset accent.",
      });
    }
  }

  if (overrides.headingFont) merged.headingFont = overrides.headingFont;
  if (overrides.bodyFont) merged.bodyFont = overrides.bodyFont;
  if (overrides.radius) merged.radius = overrides.radius;

  return { presetId: preset.id, tokens: merged, warnings };
}

const FONT_STACKS: Record<FontKey, string> = {
  inter: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
  barlowCondensed: '"Barlow Condensed", "Arial Narrow", ui-sans-serif, sans-serif',
  fraunces: '"Fraunces Variable", Georgia, "Times New Roman", serif',
  sourceSerif: '"Source Serif 4 Variable", Georgia, "Times New Roman", serif',
  manrope: '"Manrope Variable", ui-sans-serif, system-ui, sans-serif',
  lexend: '"Lexend Variable", ui-sans-serif, system-ui, sans-serif',
};

const WIDTHS = { narrow: "46rem", regular: "64rem", wide: "76rem" } as const;
const SPACING = {
  compact: "clamp(2.25rem, 5vw, 3.5rem)",
  regular: "clamp(3rem, 7vw, 5rem)",
  airy: "clamp(4rem, 9vw, 7.5rem)",
} as const;
const RADIUS = { none: "0px", sm: "0.25rem", md: "0.625rem", lg: "1.25rem", pill: "999px" } as const;
const SHADOW = {
  none: "none",
  soft: "0 10px 30px -12px rgb(0 0 0 / 0.18)",
  crisp: "0 2px 0 0 rgb(0 0 0 / 0.6)",
} as const;

/** The only place token values become CSS. All inputs are enum/hex validated. */
export function tokensToCssVars(t: TokenSet): Record<string, string> {
  return {
    "--tp-background": t.background,
    "--tp-foreground": t.foreground,
    "--tp-surface": t.surface,
    "--tp-muted": t.mutedForeground,
    "--tp-accent": t.accent,
    "--tp-accent-foreground": t.accentForeground,
    "--tp-border": t.border,
    "--tp-font-heading": FONT_STACKS[t.headingFont],
    "--tp-font-body": FONT_STACKS[t.bodyFont],
    "--tp-content-width": WIDTHS[t.contentWidth],
    "--tp-section-y": SPACING[t.sectionSpacing],
    "--tp-radius": RADIUS[t.radius],
    "--tp-shadow": SHADOW[t.shadow],
  };
}
