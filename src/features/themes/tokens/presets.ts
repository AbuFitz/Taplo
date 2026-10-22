import type { TokenPreset } from "../contracts/tokens";

/**
 * Token presets are data. Each pairs with a layout family but any preset can
 * be combined with any layout later (premium themes, owner choice).
 * All text/background pairs below clear WCAG AA (verified in tokens.test.ts).
 */
export const TOKEN_PRESETS: TokenPreset[] = [
  {
    id: "trades-dark",
    label: "Workshop dark",
    tokens: {
      background: "#0d0f12",
      foreground: "#f4f5f7",
      surface: "#171a1f",
      mutedForeground: "#a9afb9",
      accent: "#ffb81c",
      accentForeground: "#111111",
      border: "#2a2f37",
      headingFont: "barlowCondensed",
      bodyFont: "inter",
      contentWidth: "wide",
      sectionSpacing: "compact",
      radius: "sm",
      shadow: "crisp",
      motion: "subtle",
    },
  },
  {
    id: "beauty-light",
    label: "Studio light",
    tokens: {
      background: "#faf6f1",
      foreground: "#231b17",
      surface: "#f1e8de",
      mutedForeground: "#6a5b51",
      accent: "#8a4b3a",
      accentForeground: "#ffffff",
      border: "#e0d3c5",
      headingFont: "fraunces",
      bodyFont: "manrope",
      contentWidth: "wide",
      sectionSpacing: "airy",
      radius: "lg",
      shadow: "soft",
      motion: "subtle",
    },
  },
  {
    id: "education-clean",
    label: "Classroom clean",
    tokens: {
      background: "#ffffff",
      foreground: "#14213d",
      surface: "#eef3fb",
      mutedForeground: "#475674",
      accent: "#1f5fbf",
      accentForeground: "#ffffff",
      border: "#d5deec",
      headingFont: "lexend",
      bodyFont: "inter",
      contentWidth: "regular",
      sectionSpacing: "regular",
      radius: "md",
      shadow: "soft",
      motion: "subtle",
    },
  },
  {
    id: "professional-refined",
    label: "Practice refined",
    tokens: {
      background: "#f7f6f3",
      foreground: "#1b1d21",
      surface: "#ffffff",
      mutedForeground: "#585b62",
      accent: "#1f3a34",
      accentForeground: "#ffffff",
      border: "#d9d6cf",
      headingFont: "sourceSerif",
      bodyFont: "inter",
      contentWidth: "narrow",
      sectionSpacing: "airy",
      radius: "none",
      shadow: "none",
      motion: "none",
    },
  },
  {
    id: "general-balanced",
    label: "Balanced",
    tokens: {
      background: "#ffffff",
      foreground: "#1a1a1a",
      surface: "#f4f4f2",
      mutedForeground: "#585855",
      accent: "#0f766e",
      accentForeground: "#ffffff",
      border: "#e2e2de",
      headingFont: "manrope",
      bodyFont: "manrope",
      contentWidth: "regular",
      sectionSpacing: "regular",
      radius: "md",
      shadow: "soft",
      motion: "subtle",
    },
  },
];

const byId = new Map(TOKEN_PRESETS.map((p) => [p.id, p]));
export const FALLBACK_TOKEN_PRESET_ID = "general-balanced";

export function getTokenPreset(id: string): TokenPreset | undefined {
  return byId.get(id);
}
