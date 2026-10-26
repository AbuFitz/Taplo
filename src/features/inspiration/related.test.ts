import { describe, expect, it } from "vitest";
import { EXAMPLES, bySlug } from "./examples";
import { relatedExamples } from "./related";

describe("related inspiration", () => {
  it("never recommends itself, duplicates or hidden legacy examples", () => {
    for (const source of EXAMPLES) {
      const matches = relatedExamples(source);
      expect(matches).toHaveLength(3);
      expect(new Set(matches.map((e) => e.slug)).size).toBe(3);
      expect(
        matches.every((e) => e.slug !== source.slug && EXAMPLES.includes(e)),
      ).toBe(true);
    }
  });
  it("keeps automotive visitors near automotive and home-service designs", () => {
    const matches = relatedExamples(bySlug("harris-cars")!);
    expect(matches[0].industry).toBe("motoring");
    for (const m of matches) expect(["motoring", "trades", "entrepreneurs"]).toContain(m.industry);
  });
  it("offers a related appointment business to a barber before creative portfolios", () => {
    expect(relatedExamples(bySlug("jays-barbers")!)[0].industry).toBe("beauty");
    for (const e of relatedExamples(bySlug("jays-barbers")!)) expect(["beauty", "health", "fitness"]).toContain(e.industry);
  });
  it("works for retained legacy links, preserves catalogue order and respects the limit", () => {
    const source = bySlug("aldous-motor-co")!;
    expect(relatedExamples(source)[0].industry).toBe("motoring");
    expect(relatedExamples(source)).toEqual(relatedExamples(source));
    expect(relatedExamples(source, 0)).toEqual([]);
    expect(relatedExamples(source, 1)).toHaveLength(1);
  });
});
