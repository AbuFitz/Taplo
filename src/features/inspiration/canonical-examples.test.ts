import { describe, expect, it } from "vitest";
import { EXAMPLES, bySlug } from "./examples";
import { HOME_DESIGNS } from "@/features/marketing/home/designs";
import { SCENARIOS } from "@/features/showcase/content";

describe("advertised example identities", () => {
  for (const example of EXAMPLES)
    it(`${example.slug} uses the same business address in its renderer and public catalogue`, () => {
      expect(SCENARIOS[example.scenario].content.identity.slug).toBe(
        example.slug,
      );
    });
  it("curated home designs use actual catalogue identities", () => {
    for (const design of HOME_DESIGNS) {
      expect(bySlug(design.slug)?.scenario).toBe(design.scenario);
      expect(SCENARIOS[design.scenario].content.identity.name).toBe(
        design.name,
      );
    }
  });
});
