import type { FontKey } from "@/features/themes/contracts/tokens";

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
  inter: "Inter · clean",
  barlowCondensed: "Barlow Condensed · strong",
  fraunces: "Fraunces · warm serif",
  sourceSerif: "Source Serif · editorial",
  manrope: "Manrope · friendly",
  lexend: "Lexend · easy to read",
  instrumentSerif: "Instrument Serif · refined display",
  bricolage: "Bricolage Grotesque · expressive",
  geist: "Geist · precise, modern",
  spaceGrotesk: "Space Grotesk · technical",
};
