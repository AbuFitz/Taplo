import { describe, expect, it } from "vitest";
import { clampPreviewHeight, previewLimits } from "./preview-size";

describe("mobile preview space budget", () => {
  it.each([568, 667, 740, 844, 932])(
    "leaves at least 360px for setup on a %ipx viewport",
    (height) => {
      expect(height - clampPreviewHeight(1000, height)).toBeGreaterThanOrEqual(
        360,
      );
    },
  );
  it("shrinks after rotation instead of preserving a tall portrait preview", () => {
    expect(clampPreviewHeight(400, 390)).toBe(96);
  });
  it("keeps keyboard endpoint values ordered on small screens", () => {
    for (const height of [320, 390, 568, 844, 1200]) {
      const { min, max } = previewLimits(height);
      expect(min).toBeLessThanOrEqual(max);
      expect(clampPreviewHeight(-100, height)).toBe(min);
      expect(clampPreviewHeight(9999, height)).toBe(max);
    }
  });
});
