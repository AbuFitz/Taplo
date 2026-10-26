import { z } from "zod";
import { FONT_KEYS } from "@/features/themes/contracts/tokens";
import { focalSchema, imageSchema } from "@/features/businesses/content";

/**
 * Appearance contracts. A theme is a complete StyleSpec of defaults; an owner's page stores
 * only StyleOverrides (a deep-partial). "Reset to theme" = delete override keys.
 * Everything is an enum, number range or hex colour: no CSS, HTML or code is ever stored.
 */

export const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a colour like #1a2b3c");

export const colorsSchema = z.object({
  background: hex,
  text: hex,
  muted: hex,
  surface: hex,
  accent: hex,
  accentText: hex,
  border: hex,
});

export const textSchema = z.object({
  headingFont: z.enum(FONT_KEYS),
  bodyFont: z.enum(FONT_KEYS),
  size: z.enum(["sm", "md", "lg"]),
  headingCase: z.enum(["normal", "upper"]),
  headingWeight: z.enum(["regular", "bold"]),
  align: z.enum(["left", "center"]),
});

/** Optional animated wallpaper. Always has a static equivalent: reduced motion, no WebGL and print all use `colors`. */
export const SHADER_STYLES = ["aurora", "silk", "grain", "warp", "orbs", "rays", "swirl", "smoke"] as const;
export const backgroundShaderSchema = z.object({
  kind: z.literal("shader"),
  style: z.enum(SHADER_STYLES),
  source: z.enum(["manual", "logo"]).optional(),
  motion: z.boolean().optional(),
  pace: z.enum(["slow", "steady", "expressive"]).optional(),
  colors: z.array(hex).min(2).max(4),
  /** Base colour behind the shader and in the static fallback. */
  base: hex,
});

export const backgroundSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("solid"), color: hex }),
  backgroundShaderSchema,
  z.object({
    kind: z.literal("gradient"),
    from: hex,
    to: hex,
    angle: z.number().min(0).max(360),
    /** Slow colour drift. Disabled for visitors who prefer reduced motion. */
    motion: z.boolean(),
    pace: z.enum(["slow", "steady", "expressive"]).optional(),
    /** Linked gradients recompute from identity metadata; manual edits detach the link. */
    source: z.enum(["manual", "logo"]).optional(),
  }),
  z.object({
    kind: z.literal("image"),
    image: imageSchema,
    overlay: z.number().min(0).max(90),
    overlayColor: hex,
    /** Colour shown while the image loads and if it fails. */
    fallback: hex,
  }),
]);

/** Only these reviewed arrangements are offered for new profile choices. Older stored values remain readable. */
/** The five profile arrangements offered everywhere. Older arrangements still render for pages that saved them. */
export const PROFILE_CHOICES = [
  { id: "melt", name: "Seamless Melt", line: "Full-width photo that dissolves into the page", needs: "photo" },
  { id: "cutout", name: "Depth Cutout", line: "Your subject stands in front of your name", needs: "photo" },
  { id: "split", name: "Architectural Split", line: "A cover and a badge bridging the seam", needs: "photo" },
  { id: "bento", name: "Floating Bento", line: "One lifted card with everything in reach", needs: "none" },
  { id: "type", name: "Editorial Poster", line: "Bold type, no photo needed", needs: "none" },
] as const;
export const HEADER_LAYOUTS = ["centered", "cover", "side", "poster", "minimal", "feature", "editorial", "banner", "floating", "portrait", "melt", "cutout", "split", "bento", "type"] as const;
export const headerSchema = z.object({
  layout: z.enum(HEADER_LAYOUTS),
  /** "logo" shows the picture uncropped at its own proportions (for wide wordmarks); a wide logo is never cropped to a face shape regardless. */
  avatarShape: z.enum(["circle", "rounded", "square", "none", "logo"]).or(z.literal("arch").transform(() => "rounded" as const)),
  avatarSize: z.enum(["sm", "md", "lg"]),
  align: z.enum(["left", "center"]),
  /** How the primary contact actions appear under the name. */
  actions: z.enum(["primary", "buttons", "icons", "none"]),
  showLocation: z.boolean(),
  /** How far the cover or hero photograph fades into the page: tested presets, not a free slider. */
  scrim: z.enum(["soft", "medium", "strong"]).default("medium"),
  /** "card" sits the profile on its own raised surface; "open" lets it stand directly on the page. */
  surface: z.enum(["card", "open"]).optional(),
});

export const buttonsSchema = z.object({
  shape: z.enum(["square", "rounded", "pill"]),
  fill: z.enum(["solid", "outline", "soft"]),
  shadow: z.enum(["none", "soft", "hard"]),
  /** Optional explicit colours; otherwise derived from the accent. */
  background: hex.optional(),
  text: hex.optional(),
  border: hex.optional(),
  showIcons: z.boolean(),
});

export const cardsSchema = z.object({
  surface: z.enum(["solid", "glass", "transparent", "soft"]),
  opacity: z.number().min(0).max(100),
  radius: z.enum(["none", "sm", "md", "lg", "xl"]),
  border: z.enum(["none", "thin", "thick"]),
  shadow: z.enum(["none", "soft", "hard"]),
  padding: z.enum(["compact", "comfortable", "roomy"]),
});

export const layoutSchema = z.object({
  width: z.enum(["narrow", "regular", "wide"]),
  density: z.enum(["compact", "comfortable"]),
  rhythm: z.enum(["even", "editorial", "tight"]).optional(),
  /** Phones are always a single column. */
  desktop: z.enum(["centered", "split", "columns"]),
  /** How the sections relate to each other and to the profile: stacked cards, a compact two-up grid, a sheet rising over the profile, or a frameless numbered ledger. */
  composition: z.enum(["stack", "bento", "sheet", "sheet-bold", "ledger"]).optional(),
});

export const MOTION_LEVELS = ["none", "subtle", "lively"] as const;

export const DECORATIONS = ["none", "grain", "dots", "grid", "stripes", "glow"] as const;

export const styleSpecSchema = z.object({
  colors: colorsSchema,
  text: textSchema,
  background: backgroundSchema,
  header: headerSchema,
  buttons: buttonsSchema,
  cards: cardsSchema,
  layout: layoutSchema,
  decoration: z.enum(DECORATIONS),
  /** Entrance and hover motion. Always off for visitors who prefer reduced motion. */
  motion: z.enum(MOTION_LEVELS).optional(),
});
export type StyleSpec = z.infer<typeof styleSpecSchema>;

/** Deep-partial overrides. Background is replaced wholesale (a different `kind` cannot be merged). */
export const styleOverridesSchema = z
  .object({
    colors: colorsSchema.partial(),
    text: textSchema.partial(),
    background: backgroundSchema,
    header: headerSchema.partial(),
    buttons: buttonsSchema.partial(),
    cards: cardsSchema.partial(),
    layout: layoutSchema.partial(),
    decoration: z.enum(DECORATIONS),
    motion: z.enum(MOTION_LEVELS),
  })
  .partial();
export type StyleOverrides = z.infer<typeof styleOverridesSchema>;

/** Per-widget overrides: all optional; absent = follow the page style. */
export const widgetAppearanceSchema = z
  .object({
    surface: z.enum(["solid", "glass", "transparent", "accent", "soft"]),
    background: hex,
    text: hex,
    accent: hex,
    radius: z.enum(["none", "sm", "md", "lg", "xl", "pill"]),
    border: z.enum(["none", "thin", "thick"]),
    shadow: z.enum(["none", "soft", "hard"]),
    padding: z.enum(["none", "compact", "comfortable", "roomy"]),
    align: z.enum(["left", "center"]),
    emphasis: z.enum(["normal", "featured"]),
    buttonFill: z.enum(["solid", "outline", "soft"]),
    buttonShape: z.enum(["square", "rounded", "pill"]),
    thumbnail: imageSchema,
  })
  .partial();
export type WidgetAppearance = z.infer<typeof widgetAppearanceSchema>;

export { focalSchema };
