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

describe("identity images and focal geometry", () => {
  it("recognises transparent dark and light marks without treating photographs as logos", async () => {
    const { transparentLogoInk } = await import("./image")
    expect(transparentLogoInk([0,0,0,0, 0,0,0,255])).toBe("dark")
    expect(transparentLogoInk([0,0,0,0, 255,255,255,255])).toBe("light")
    expect(transparentLogoInk([0,0,0,255, 255,255,255,255])).toBeUndefined()
  })
  it("maps the original image inside a letterboxed preview", async () => {
    const { containedImageRect } = await import("./image")
    expect(containedImageRect({ width: 400, height: 250 }, { width: 1600, height: 400 })).toEqual({ x:0, y:75, width:400, height:100 })
    expect(containedImageRect({ width: 400, height: 250 }, { width: 400, height: 1600 })).toEqual({ x:168.75, y:0, width:62.5, height:250 })
  })
})

it("keeps an opaque JPEG portrait efficient while using the identity upload path", async () => {
  vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue({ width:800, height:1200, close:vi.fn() }))
  vi.stubGlobal("document", { createElement: () => ({ width:0, height:0,
    getContext: () => ({ drawImage() {}, getImageData: () => ({ data:new Uint8ClampedArray([30,30,30,255]) }) }),
    toDataURL: (mime:string) => `data:${mime};base64,AAA`,
  }) })
  const image=await prepareImage(new File(["image"],"portrait.jpg",{type:"image/jpeg"}),640,{preserveAlpha:true})
  expect(image).toMatchObject({width:427,height:640,src:"data:image/jpeg;base64,AAA"})
  expect(image.ink).toBeUndefined()
})
