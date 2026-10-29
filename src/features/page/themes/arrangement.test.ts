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

describe("arrangement availability", () => {
  const img = { src: "/x.webp", alt: "x", width: 10, height: 10 } as never;
  it("a photo-led arrangement needs a cover photo, and nothing that needs one is ever suggested without one", async () => {
    const { arrangementAvailable, recommendArrangement } = await import("./arrangement");
    expect(arrangementAvailable("split", {})).toBe(false);
    expect(arrangementAvailable("split", { heroImage: img })).toBe(true);
    expect(arrangementAvailable("bento", {})).toBe(true);
    for (const logo of [undefined, img]) for (const name of ["Ann", "A very long business name that wraps over several lines"]) {
      const s = recommendArrangement({ name, logo, heroImage: undefined });
      expect(arrangementAvailable(s.id, {})).toBe(true);
    }
  });
});
