import type {
  StyleOverrides,
  StyleSpec,
} from "@/features/page/contracts/style";

export const PAGE_FINISHES = [
  {
    id: "ink",
    name: "Ink",
    tone: "dark",
    preview: "#090b0d",
    colors: {
      background: "#090b0d",
      surface: "#202328",
      text: "#f3f5f6",
      muted: "#b7c0c6",
      accent: "#eef3f5",
      accentText: "#101316",
      border: "#3d444c",
    },
    background: { kind: "solid", color: "#090b0d" },
  },
  {
    id: "mono",
    name: "Mono flow",
    tone: "dark",
    preview: "linear-gradient(135deg,#08090b,#62666d,#111315)",
    colors: {
      background: "#090b0d",
      surface: "#24272c",
      text: "#f3f5f6",
      muted: "#e8edf1",
      accent: "#eef3f5",
      accentText: "#101316",
      border: "#41474f",
    },
    background: {
      kind: "gradient",
      from: "#08090b",
      to: "#656970",
      angle: 135,
      motion: true,
      source: "manual",
      pace: "steady",
    },
  },
  {
    id: "midnight",
    name: "Midnight flow",
    tone: "dark",
    preview:
      "radial-gradient(at 10% 20%,#244555,transparent 65%),radial-gradient(at 90% 80%,#423754,transparent 65%),#080b12",
    colors: {
      background: "#080b12",
      surface: "#1b2530",
      text: "#f1f5fa",
      muted: "#b8c8d5",
      accent: "#c0e4ef",
      accentText: "#10212b",
      border: "#3b4c5b",
    },
    background: {
      kind: "shader",
      style: "aurora",
      base: "#080b12",
      colors: ["#080b12", "#244555", "#423754", "#101822"],
      source: "manual",
      motion: true,
      pace: "steady",
    },
  },
  {
    id: "silk",
    name: "Graphite silk",
    tone: "dark",
    preview: "linear-gradient(135deg,#080909,#454c4a,#101314)",
    colors: {
      background: "#0b0e0e",
      surface: "#222b29",
      text: "#f1f6f4",
      muted: "#b9c9c3",
      accent: "#d7ebdf",
      accentText: "#14251b",
      border: "#405049",
    },
    background: {
      kind: "shader",
      style: "silk",
      base: "#0b0e0e",
      colors: ["#0b0e0e", "#49534f", "#18241e"],
      source: "manual",
      motion: true,
      pace: "slow",
    },
  },
  {
    id: "paper",
    name: "Paper",
    tone: "light",
    preview: "linear-gradient(135deg,#f3f3f0,#d8ddd9)",
    colors: {
      background: "#f3f3f0",
      surface: "#ffffff",
      text: "#1a2421",
      muted: "#53615c",
      accent: "#183f32",
      accentText: "#ffffff",
      border: "#ccd4cf",
    },
    background: {
      kind: "gradient",
      from: "#f3f3f0",
      to: "#d8ddd9",
      angle: 140,
      motion: true,
      source: "manual",
      pace: "slow",
    },
  },
  {
    id: "sand",
    name: "Warm sand",
    tone: "light",
    preview: "linear-gradient(135deg,#e9dfd3,#f8f3eb)",
    colors: {
      background: "#e9dfd3",
      surface: "#fffcf7",
      text: "#382a22",
      muted: "#635044",
      accent: "#6c412e",
      accentText: "#ffffff",
      border: "#cbbbaa",
    },
    background: { kind: "solid", color: "#e9dfd3" },
  },
] as const satisfies readonly {
  id: string;
  name: string;
  tone: string;
  preview: string;
  colors: StyleSpec["colors"];
  background: StyleSpec["background"];
}[];
export type FinishId = (typeof PAGE_FINISHES)[number]["id"];

/** A finish is one reversible material/colour decision; identity, type and content stay the owner's. */
export function withFinish(
  overrides: StyleOverrides,
  id: FinishId,
): StyleOverrides {
  const finish = PAGE_FINISHES.find((f) => f.id === id)!;
  return {
    ...overrides,
    colors: { ...finish.colors },
    background: structuredClone(finish.background),
    buttons: {
      ...overrides.buttons,
      background: finish.colors.accent,
      text: finish.colors.accentText,
      border: finish.colors.accent,
      shadow: "soft",
    },
    cards: {
      ...overrides.cards,
      surface: "solid",
      opacity: 100,
      shadow: "soft",
    },
  };
}
/** Pace can change without changing the palette. Custom colours must never retain a preset label. */
export function matchingFinish(spec: StyleSpec) {
  const material = (background: StyleSpec["background"]) => {
    if (background.kind === "gradient")
      return {
        kind: background.kind,
        from: background.from,
        to: background.to,
        angle: background.angle,
      };
    if (background.kind === "shader")
      return {
        kind: background.kind,
        style: background.style,
        base: background.base,
        colors: background.colors,
      };
    return background;
  };
  return PAGE_FINISHES.find(
    (f) =>
      Object.entries(f.colors).every(
        ([key, value]) =>
          spec.colors[key as keyof StyleSpec["colors"]] === value,
      ) &&
      JSON.stringify(material(f.background)) ===
        JSON.stringify(material(spec.background)),
  )?.id;
}
