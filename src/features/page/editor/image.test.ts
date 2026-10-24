import { afterEach, describe, expect, it, vi } from "vitest";
import { prepareImage } from "./image";

afterEach(() => vi.unstubAllGlobals());

describe("browser picture storage", () => {
  it("reduces a detailed picture's dimensions when quality alone cannot meet the budget", async () => {
    const close = vi.fn();
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn().mockResolvedValue({ width: 2400, height: 1600, close }),
    );
    const drawn: number[] = [];
    vi.stubGlobal("document", {
      createElement: () => {
        const canvas = {
          width: 0,
          height: 0,
          getContext: () => ({
            fillRect() {},
            drawImage() {
              drawn.push(canvas.width);
            },
            fillStyle: "",
          }),
          toDataURL: () =>
            "data:image/jpeg;base64," +
            "a".repeat(canvas.width > 1000 ? 400000 : 100000),
        };
        return canvas;
      },
    });
    const result = await prepareImage(
      new File(["test"], "busy.jpg", { type: "image/jpeg" }),
    );
    expect(result.width).toBe(960);
    expect(result.height).toBe(640);
    expect(result.src.length).toBeLessThanOrEqual(380000);
    expect(drawn).toEqual([1280, 960]);
    expect(close).toHaveBeenCalledOnce();
  });
  it("rejects an uncompressible picture and releases the decoded image", async () => {
    const close = vi.fn();
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn().mockResolvedValue({ width: 2400, height: 1600, close }),
    );
    vi.stubGlobal("document", {
      createElement: () => ({
        width: 0,
        height: 0,
        getContext: () => ({ fillRect() {}, drawImage() {}, fillStyle: "" }),
        toDataURL: () => "data:image/jpeg;base64," + "a".repeat(400000),
      }),
    });
    await expect(
      prepareImage(new File(["test"], "busy.jpg", { type: "image/jpeg" })),
    ).rejects.toThrow("could not be compressed");
    expect(close).toHaveBeenCalledOnce();
  });
  it("rejects unsupported uploads before decoding", async () => {
    const decode = vi.fn();
    vi.stubGlobal("createImageBitmap", decode);
    await expect(
      prepareImage(new File(["test"], "animation.gif", { type: "image/gif" })),
    ).rejects.toThrow("JPG, PNG or WebP");
    expect(decode).not.toHaveBeenCalled();
  });
});
