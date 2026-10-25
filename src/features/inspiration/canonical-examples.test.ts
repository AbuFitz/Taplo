import { describe, expect, it } from "vitest";
import { EXAMPLES, bySlug } from "./examples";
import { SCENARIOS } from "@/features/showcase/content";
import { heroScenes } from "@/features/marketing/home/hero-scenes";

describe("advertised example identities", () => {
  for (const example of EXAMPLES) it(`${example.slug} uses the same business address in its renderer and public catalogue`, () => {
    expect(SCENARIOS[example.scenario].content.identity.slug).toBe(example.slug);
  });
  it("every hero business opens an advertised working example", () => {
    for (const scene of heroScenes()) {
      const example = bySlug(scene.slug);
      expect(example, `Missing public design: ${scene.slug}`).toBeDefined();
      expect(example?.scenario).toBe(scene.scenario);
      expect(scene.blocks.length).toBeGreaterThan(0);
    }
  });
});
