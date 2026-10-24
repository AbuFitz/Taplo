import type { Look } from "@/features/page/themes/looks"
/** Actual shared-renderer captures illustrate the layout; the large preview is the owner's own content. */
export function ThemeSwatch({look}:{look:Look}) {
  return <span aria-hidden="true" className="theme-swatch block w-full overflow-hidden rounded-xl bg-neutral-100">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`/looks/${look.id}.webp`} alt="" width={780} height={1080} className="size-full object-cover object-top" loading="lazy"/>
  </span>
}
