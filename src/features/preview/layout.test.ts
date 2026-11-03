import { describe, expect, it } from "vitest";
import { layoutPreview } from "./PagePreview";

describe("visible mobile document viewport", () => {
  for (const box of [{ w: 334, h: 190 }, { w: 358, h: 360 }, { w: 358, h: 650 }]) {
    it(`fits the document inside ${box.w} × ${box.h} without hiding its lower viewport`, () => {
      const layout = layoutPreview("device", box, undefined, "fit", true, false, 1, true);
      expect(layout.vw).toBe(390);
      expect(layout.outerW * layout.scale).toBeLessThanOrEqual(box.w);
      expect(layout.outerH * layout.scale).toBeLessThanOrEqual(box.h);
      expect(box.h - layout.outerH * layout.scale).toBeLessThan(1);
      expect(layout.vh).toBeGreaterThan(150);
    });
  }
});
