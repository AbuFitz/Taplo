import { describe, it, expect } from "vitest";
import { profileDirection, withSuggestedColours } from "./profile-direction";
import { readsWell } from "./image-palette";
const photo = {
  src: "/photo.webp",
  alt: "Cover",
  width: 1400,
  height: 700,
  accent: "#c15463",
};
const logo = {
  src: "/logo.webp",
  alt: "Logo",
  width: 300,
  height: 300,
  accent: "#267b69",
};
describe("business profile direction", () => {
  it("handles every actual asset combination without inventing an image", () => {
    for (const assets of [
      {},
      { logo },
      { heroImage: photo },
      { logo, heroImage: photo },
    ]) {
      const identity = { name: "North Studio", ...assets };
      const before = JSON.stringify(identity);
      const d = profileDirection(identity);
      expect(d.arrangement.id).toBeTruthy();
      expect(readsWell(d.palette)).toBe(true);
      expect(JSON.stringify(identity)).toBe(before);
      expect(profileDirection(identity)).toEqual(d);
    }
    expect(profileDirection({ name: "North Studio" }).arrangement.id).toBe(
      "type",
    );
  });
  it("gives wide marks and long names room rather than a narrow side column", () => {
    const d = profileDirection({
      name: "The Independent Local Architecture and Design Practice",
      logo: { ...logo, width: 1200, height: 160 },
      heroImage: photo,
    });
    expect(d.arrangement.id).toBe("masthead");
    expect(d.note).toContain("not cropped");
  });
  it("prefers the explicit logo colour over the photograph, and keeps monochrome marks neutral", () => {
    expect(
      profileDirection({ name: "North", logo, heroImage: photo }).colourSource,
    ).toBe("logo");
    expect(
      profileDirection({ name: "North", heroImage: photo }).colourSource,
    ).toBe("cover");
    const d = profileDirection({
      name: "North",
      industryKey: "barber",
      logo: { src: "/mono.webp", alt: "Logo", ink: "mono" },
    });
    expect(d.colourSource).toBe("monochrome");
    expect(d.palette.accent).toBe("#202124");
  });
  it("uses category as a suggestion, never infers brand colours from name wording", () => {
    const a = profileDirection({ name: "Blue Studio", industryKey: "physio" });
    const b = profileDirection({ name: "Red Studio", industryKey: "physio" });
    expect(a.palette).toEqual(b.palette);
    expect(a.colourSource).toBe("category");
    for (const dark of [false, true])
      for (const industryKey of [
        "barber",
        "physio",
        "hospitality",
        "tutor",
        "personal-trainer",
        "car-dealer",
        "other",
      ]) {
        expect(
          readsWell(profileDirection({ name: "X", industryKey }, dark).palette),
        ).toBe(true);
      }
  });
  it("preserves a chosen image wallpaper and updates an explicit solid background", () => {
    const p = profileDirection({ name: "North", logo }).palette;
    const image = {
      kind: "image" as const,
      image: photo,
      overlay: 30,
      overlayColor: "#000000",
      fallback: "#111111",
    };
    expect(withSuggestedColours({ background: image }, p).background).toEqual(
      image,
    );
    expect(
      withSuggestedColours({ background: { kind: "solid", color: "#fff" } }, p)
        .background,
    ).toEqual({ kind: "solid", color: p.background });
  });
  it("warns about portrait cover cropping rather than pretending it knows the subject", () => {
    expect(
      profileDirection({
        name: "North",
        heroImage: { ...photo, width: 600, height: 1000 },
      }).note,
    ).toContain("portrait cover");
  });
});
