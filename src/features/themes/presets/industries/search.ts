import type { IndustryPreset } from "../../contracts/industry";

/** Search suggests a starting point. It never decides an owner's category or capabilities. */
const normalise = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const filler = new Set([
  "a",
  "an",
  "and",
  "the",
  "my",
  "i",
  "am",
  "business",
  "mobile",
]);
const tokens = (value: string) =>
  normalise(value)
    .split(" ")
    .filter((t) => t && !filler.has(t));

// Bounded edit distance with adjacent transpositions for everyday spelling mistakes.
function distance(a: string, b: string): number {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [
    i,
    ...Array(b.length).fill(0),
  ]);
  rows[0] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      rows[i]![j] = Math.min(
        rows[i - 1]![j]! + 1,
        rows[i]![j - 1]! + 1,
        rows[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        rows[i]![j] = Math.min(rows[i]![j]!, rows[i - 2]![j - 2]! + 1);
    }
  return rows[a.length]![b.length]!;
}

function wordScore(query: string, word: string): number {
  if (word === query) return 10;
  if (word.startsWith(query)) return 8;
  if (query.length < 4 || Math.abs(query.length - word.length) > 2) return 0;
  const edits = distance(query, word);
  return edits <= (query.length >= 7 ? 2 : 1) ? 5 - edits : 0;
}

export function rankIndustries(
  presets: IndustryPreset[],
  query: string,
): IndustryPreset[] {
  const q = normalise(query).slice(0, 80);
  if (!query.trim()) return presets;
  if (!q) return presets.filter((p) => p.id === "other");
  const terms = tokens(q);
  const ranked = presets
    .filter((p) => p.id !== "other")
    .map((preset, order) => {
      const phrases = [preset.label, ...preset.keywords].map(normalise);
      const words = [...new Set(phrases.flatMap(tokens))];
      const scores = terms.map((term) =>
        Math.max(0, ...words.map((word) => wordScore(term, word))),
      );
      const score = phrases.includes(q)
        ? 1000
        : terms.length && scores.every(Boolean)
          ? scores.reduce((a, b) => a + b, 0) / terms.length
          : 0;
      return { preset, score, order };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((p) => p.preset);
  const other = presets.find((p) => p.id === "other");
  return other ? [...ranked, other] : ranked;
}
