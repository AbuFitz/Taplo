import Link from "next/link"
import { LOOKS } from "./looks"
import { LookTile } from "./lab/previews"
import "@/features/page/themes/fonts"

/** The four configurations as links into the appearance lab. */
export function LookStrip() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {LOOKS.map((l) => (
        <li key={l.id}>
          <Link href="/appearance" className="group block rounded-2xl bg-white p-2 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_16px_32px_-20px_rgb(0_0_0/0.3)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
            <span className="block overflow-hidden rounded-xl"><LookTile o={l.overrides} /></span>
            <span className="mt-2 block px-1 pb-1"><span className="block text-sm font-semibold">{l.name}</span><span className="block text-xs text-muted-foreground">{l.blurb}</span></span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
