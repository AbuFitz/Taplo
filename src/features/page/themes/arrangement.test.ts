import { describe, expect, it } from "vitest";
import { recommendArrangement } from "./arrangement";
import { PROFILE_CHOICES } from "../contracts/style";

const img = { src: "/x.png", alt: "x" } as never;
describe("arrangement suggestion", () => {
  it("follows the pictures the business really has", () => {
    expect(recommendArrangement({ name: "Marlowe & Finch" }).id).toBe("type");
    expect(recommendArrangement({ name: "Marlowe & Finch", logo: img }).id).toBe("bento");
    expect(recommendArrangement({ name: "Marlowe & Finch", heroImage: img }).id).toBe("melt");
    expect(recommendArrangement({ name: "Marlowe & Finch", logo: img, heroImage: img }).id).toBe("framed");
    expect(recommendArrangement({ name: "Marlowe & Finch Chartered Surveyors and Valuers", logo: img, heroImage: img }).id).toBe("masthead");
  });
  it("only suggests offered arrangements and is repeatable", () => {
    const ids = PROFILE_CHOICES.map((c) => c.id) as string[];
    for (const a of [{}, { logo: img }, { heroImage: img }, { logo: img, heroImage: img }]) {
      const r = recommendArrangement({ name: "A", ...a });
      expect(ids).toContain(r.id);
      expect(recommendArrangement({ name: "A", ...a })).toEqual(r);
    }
  });
});
