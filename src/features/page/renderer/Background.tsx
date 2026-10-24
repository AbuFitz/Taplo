import { ProfileImage } from "./ProfileImage"
import { ShaderWallpaper } from "./ShaderWallpaper"
import type { PageViewModel } from "./view-model"
import { backgroundCss } from "../themes/resolve"

/** Page background: solid, gradient (optionally drifting), shader wallpaper or photo with a protective overlay, plus a decoration layer. */
export function Background({ vm, still = false }: { vm: PageViewModel; still?: boolean }) {
  const { spec } = vm.style
  const b = spec.background
  return (
    <>
      <div className="tp-bg" aria-hidden="true">
        {b.kind === "image" ? (
          <>
            <ProfileImage image={b.image} sizes="100vw" priority />
            <div className="absolute inset-0" style={{ background: b.overlayColor, opacity: b.overlay / 100 }} />
          </>
        ) : (
          <div className="tp-bg-gradient" style={{ background: backgroundCss(spec), ...(still ? { animation: "none" } : {}) }} />
        )}
        {b.kind === "shader" && !still ? <ShaderWallpaper style={b.style} colors={b.colors} base={b.base} /> : null}
      </div>
      <div className="tp-deco" aria-hidden="true" />
    </>
  )
}
