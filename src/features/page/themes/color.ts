import { contrastRatio } from "@/features/themes/tokens/contrast";

export { contrastRatio };

function parse(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const toHex = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0");

/** Linear blend: t=0 → a, t=1 → b. */
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  return `#${toHex(ar + (br - ar) * t)}${toHex(ag + (bg - ag) * t)}${toHex(ab + (bb - ab) * t)}`;
}

export function readableOn(bg: string): string {
  return contrastRatio(bg, "#ffffff") >= contrastRatio(bg, "#111111") ? "#ffffff" : "#111111";
}

/** Keep `fg` if it reads on `bg` (>= min), else the better of black/white. */
export function ensureReadable(fg: string, bg: string, min = 4.5): { color: string; adjusted: boolean } {
  return contrastRatio(fg, bg) >= min ? { color: fg, adjusted: false } : { color: readableOn(bg), adjusted: true };
}
