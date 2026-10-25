import { describe, expect, it } from "vitest";
import { photoSelection, movePhoto } from "./GalleryPhotoPicker";
const photos = [
  { id: "one", name: "One" },
  { id: "two", name: "Two" },
  { id: "three", name: "Three" },
];
describe("gallery selection and ordering", () => {
  it("follows newly added photos only in automatic mode", () => {
    expect(photoSelection(photos, null)).toEqual(["one", "two", "three"]);
    expect(photoSelection(photos, ["two", "one"])).toEqual(["two", "one"]);
  });
  it("drops deleted and duplicate references without changing the owner's order", () => {
    expect(
      photoSelection(photos, ["three", "deleted", "one", "three"]),
    ).toEqual(["three", "one"]);
    expect(photoSelection(photos, [])).toEqual([]);
  });
  it("moves only this gallery's references and preserves the source records", () => {
    const before = ["three", "one", "two"];
    expect(movePhoto(before, "three", 1)).toEqual(["one", "three", "two"]);
    expect(before).toEqual(["three", "one", "two"]);
    expect(photos.map((photo) => photo.id)).toEqual(["one", "two", "three"]);
    expect(movePhoto(before, "three", -1)).toBe(before);
    expect(movePhoto(before, "missing", 1)).toBe(before);
  });
});
