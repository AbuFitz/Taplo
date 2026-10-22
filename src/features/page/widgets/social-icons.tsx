import { siFacebook, siInstagram, siTiktok, siX, siYoutube } from "simple-icons"

/**
 * Platform logos from Simple Icons (CC0). Only the glyphs we use are imported so the rest
 * of the set never reaches the bundle. LinkedIn is not in Simple Icons any more, so it keeps
 * a neutral lettermark rather than a hand-drawn imitation of a trademark.
 */
const PATHS: Record<string, string> = {
  instagram: siInstagram.path,
  facebook: siFacebook.path,
  tiktok: siTiktok.path,
  youtube: siYoutube.path,
  x: siX.path,
}

export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const d = PATHS[platform]
  if (!d) return <span aria-hidden="true" className={className} style={{ fontWeight: 700, lineHeight: 1 }}>{platform === "linkedin" ? "in" : "•"}</span>
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className} width="1.25em" height="1.25em" focusable="false">
      <path d={d} />
    </svg>
  )
}
