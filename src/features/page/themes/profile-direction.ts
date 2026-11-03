import type { ImageRef } from "@/features/businesses/content";
import type { StyleOverrides } from "../contracts/style";
import { rankArrangements, type ArrangementId } from "./arrangement";
import { paletteFromAccent, readsWell } from "./image-palette";
export interface ProfileIdentity {
  name: string;
  industryKey?: string;
  logo?: ImageRef | null;
  heroImage?: ImageRef | null;
}
const CATEGORY_ACCENTS: Record<string, string> = {
  barber: "#87536e",
  hairdresser: "#87536e",
  "beauty-therapist": "#87536e",
  physio: "#397b76",
  massage: "#397b76",
  hospitality: "#986047",
  tutor: "#6856a5",
  "music-teacher": "#6856a5",
  "personal-trainer": "#53733b",
  "car-dealer": "#4c678d",
  detailer: "#4c678d",
  mechanic: "#4c678d",
  photographer: "#655974",
  designer: "#655974",
};
const VISUAL = new Set([
  "photographer",
  "designer",
  "filmmaker",
  "illustrator",
  "interiors",
]);
const NEUTRAL_DARK = {
  background: "#151518",
  text: "#f4f4f6",
  muted: "#bebec7",
  surface: "#232328",
  accent: "#f2f2f4",
  accentText: "#161616",
  border: "#44444b",
};
const NEUTRAL = {
  background: "#f7f7f8",
  text: "#161616",
  muted: "#62626a",
  surface: "#ffffff",
  accent: "#202124",
  accentText: "#ffffff",
  border: "#e4e4e8",
};
/** Transparent recommendations from explicit inputs. Never guesses a brand's meaning from its name. */
export function profileDirection(identity: ProfileIdentity, dark = false) {
  const wide = Boolean(
    identity.logo?.width &&
    identity.logo?.height &&
    identity.logo.width / identity.logo.height > 1.8,
  );
  const long =
    identity.name.trim().length > 30 ||
    identity.name
      .trim()
      .split(/\s+/)
      .some((w) => w.length > 20);
  const ranked = rankArrangements(identity).map((r) => ({ ...r }));
  for (const r of ranked) {
    if (wide && r.id === "masthead") {
      r.score += 8;
      r.why =
        "Your wide wordmark gets room to stay whole, with the name on its own line.";
    }
    if (long && r.id === "masthead" && (identity.logo || identity.heroImage)) {
      r.score += 4;
      r.why =
        "Your longer name has its own generous line instead of squeezing beside a picture.";
    }
    if (
      VISUAL.has(identity.industryKey ?? "") &&
      identity.heroImage &&
      r.id === "melt"
    ) {
      r.score += 3;
      r.why =
        "Your cover can lead the introduction, with a fade into the page for a visual business.";
    }
    if (!identity.logo && !identity.heroImage && r.id === "type") {
      r.score += 3;
      r.why =
        "Strong typography introduces your business without a missing-photo placeholder.";
    }
  }
  ranked.sort((a, b) => b.score - a.score);
  const arrangement = ranked[0]!;
  const accent = /^#[\da-f]{6}$/i.test(identity.logo?.accent ?? "")
    ? identity.logo!.accent
    : /^#[\da-f]{6}$/i.test(identity.heroImage?.accent ?? "")
      ? identity.heroImage!.accent
      : undefined;
  const monochrome = Boolean(
    identity.logo &&
    !identity.logo.accent &&
    ["mono", "dark", "light"].includes(identity.logo.ink ?? ""),
  );
  const source = accent
    ? identity.logo?.accent === accent
      ? "logo"
      : "cover"
    : monochrome
      ? "monochrome"
      : "category";
  const palette = monochrome
    ? { ...(dark ? NEUTRAL_DARK : NEUTRAL) }
    : paletteFromAccent(
        accent ??
          (monochrome
            ? "#666666"
            : (CATEGORY_ACCENTS[identity.industryKey ?? ""] ?? "#68616f")),
        dark,
      );
  const colourReason =
    source === "logo"
      ? "Built around the colour sampled from your logo, with readable text and a coordinated surface."
      : source === "cover"
        ? "A direction based on the colour sampled from your cover photo."
        : source === "monochrome"
          ? "Your mark is monochrome, so this direction keeps the palette neutral."
          : "A starting colour direction for your business category. Your own brand colours can replace it.";
  const coverRatio =
    identity.heroImage?.width && identity.heroImage?.height
      ? identity.heroImage.width / identity.heroImage.height
      : null;
  const note =
    coverRatio !== null && coverRatio < 0.9
      ? "This portrait cover will crop in wide layouts. Use Adjust cover to keep its important part in view."
      : wide
        ? "The full wordmark stays visible; it is not cropped into a circle."
        : undefined;
  return {
    arrangement: { id: arrangement.id as ArrangementId, why: arrangement.why },
    alternatives: ranked.slice(1, 4),
    palette: readsWell(palette) ? palette : { ...NEUTRAL },
    colourSource: source,
    colourReason,
    note,
    assets: identity.logo
      ? identity.heroImage
        ? "logo-cover"
        : "logo"
      : identity.heroImage
        ? "cover"
        : "type",
  };
}
export function withSuggestedColours(
  overrides: StyleOverrides,
  palette: ReturnType<typeof profileDirection>["palette"],
): StyleOverrides {
  return {
    ...overrides,
    colors: { ...overrides.colors, ...palette },
    ...(!overrides.background || overrides.background.kind === "solid"
      ? { background: { kind: "solid" as const, color: palette.background } }
      : {}),
  };
}
