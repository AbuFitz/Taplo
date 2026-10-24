import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProfileImage } from "./ProfileImage";

describe("public image delivery", () => {
  it("uses responsive derivatives for a small local portrait and preserves its focal point", () => {
    const html = renderToStaticMarkup(
      createElement(ProfileImage, {
        image: {
          src: "/taplo-demo/station-sam.png",
          alt: "Sam",
          focal: { x: 50, y: 33 },
        },
        sizes: "48px",
      }),
    );
    expect(html).toContain("/_next/image?");
    expect(html).toContain('sizes="48px"');
    expect(html).toContain("srcSet=");
    expect(html).toContain("object-position:50% 33%");
  });
  it("keeps an arbitrary external photo usable without an image-host allowlist", () => {
    const html = renderToStaticMarkup(
      createElement(ProfileImage, {
        image: { src: "https://images.taplo.test/sam.png", alt: "Sam" },
        sizes: "48px",
      }),
    );
    expect(html).toContain('src="https://images.taplo.test/sam.png"');
    expect(html).not.toContain("/_next/image?");
  });
  it("keeps uploaded image data and vector wordmarks as their original source", () => {
    for (const src of [
      "data:image/png;base64,iVBORw0KGgo=",
      "/taplo-demo/station-road-mark.svg",
    ]) {
      const html = renderToStaticMarkup(
        createElement(ProfileImage, {
          image: { src, alt: "Business image" },
          sizes: "48px",
        }),
      );
      expect(html).toContain(`src="${src}"`);
      expect(html).not.toContain("/_next/image?");
    }
  });
});
