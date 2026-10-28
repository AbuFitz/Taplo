import type { CSSProperties } from "react";
import { ProfileImage } from "./ProfileImage";
import { ShaderWallpaper } from "./ShaderWallpaper";
import type { PageViewModel } from "./view-model";
import { backgroundCss } from "../themes/resolve";

/** Page background: solid, gradient (optionally drifting), shader wallpaper or photo with a protective overlay, plus a decoration layer. */
export function Background({
  vm,
  still = false,
  thumb = false,
}: {
  vm: PageViewModel;
  still?: boolean;
  /** A miniature: no WebGL, but the colour field still drifts so a design looks alive on a shelf. */
  thumb?: boolean;
}) {
  const { spec } = vm.style;
  const b = spec.background;
  return (
    <>
      <div className="tp-bg" aria-hidden="true">
        {b.kind === "image" ? (
          <>
            <ProfileImage image={b.image} sizes="100vw" priority />
            <div
              className="absolute inset-0"
              style={{ background: b.overlayColor, opacity: b.overlay / 100 }}
            />
          </>
        ) : (
          <div
            className="tp-bg-gradient"
            data-animate={
              (!still || thumb) &&
              (b.kind === "gradient"
                ? b.motion
                : b.kind === "shader" && b.motion !== false)
            }
            style={
              {
                background: backgroundCss(spec),
                "--tp-wallpaper-duration": `${{ slow: 22, steady: 12, expressive: 7 }[b.kind === "gradient" || b.kind === "shader" ? (b.pace ?? "steady") : "steady"]}s`,
                ...(still && !thumb ? { animation: "none" } : {}),
              } as CSSProperties
            }
          />
        )}
        {b.kind === "shader" && b.motion !== false && !still && !thumb ? (
          <ShaderWallpaper
            style={b.style}
            colors={b.colors}
            base={b.base}
            pace={b.pace}
            animate
          />
        ) : null}
      </div>
      <div className="tp-deco" aria-hidden="true" />
    </>
  );
}
