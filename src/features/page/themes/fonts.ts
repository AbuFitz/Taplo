import type { FontKey } from "@/features/themes/contracts/tokens";

// Approved fonts, self-hosted via Fontsource (no third-party requests at runtime).
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/manrope";
import "@fontsource-variable/lexend";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/geist";
import "@fontsource-variable/space-grotesk";

export const FONT_STACKS: Record<FontKey, string> = {
  inter: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
  barlowCondensed: '"Barlow Condensed", "Arial Narrow", ui-sans-serif, sans-serif',
  fraunces: '"Fraunces Variable", Georgia, "Times New Roman", serif',
  sourceSerif: '"Source Serif 4 Variable", Georgia, "Times New Roman", serif',
  manrope: '"Manrope Variable", ui-sans-serif, system-ui, sans-serif',
  lexend: '"Lexend Variable", ui-sans-serif, system-ui, sans-serif',
  instrumentSerif: '"Instrument Serif", Georgia, "Times New Roman", serif',
  bricolage: '"Bricolage Grotesque Variable", ui-sans-serif, system-ui, sans-serif',
  geist: '"Geist Variable", ui-sans-serif, system-ui, sans-serif',
  spaceGrotesk: '"Space Grotesk Variable", ui-sans-serif, system-ui, sans-serif',
};

export const FONT_LABELS: Record<FontKey, string> = {
  inter: "Inter — clean",
  barlowCondensed: "Barlow Condensed — strong",
  fraunces: "Fraunces — warm serif",
  sourceSerif: "Source Serif — editorial",
  manrope: "Manrope — friendly",
  lexend: "Lexend — easy to read",
  instrumentSerif: "Instrument Serif — refined display",
  bricolage: "Bricolage Grotesque — expressive",
  geist: "Geist — precise, modern",
  spaceGrotesk: "Space Grotesk — technical",
};
