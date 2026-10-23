import type { MiniArt } from "./content-model"

const bar = (w: string, o = 1, h = "0.375rem") => <i className="block rounded-full bg-neutral-900" style={{ width: w, height: h, opacity: o }} />
const dot = (s = "1.25rem") => <i className="block shrink-0 rounded-md bg-neutral-300" style={{ width: s, height: s }} />

/**
 * A tiny drawing of what a kind of content looks like on the page, so people choose by sight.
 * Pure markup in neutral tones: it describes the layout, not any business's style.
 */
export function Miniature({ art }: { art: MiniArt }) {
  const wrap = "grid h-full w-full content-center gap-1.5 p-2.5"
  switch (art) {
    case "list": return <div className={wrap}>{[["62%", "18%"], ["48%", "18%"], ["70%", "18%"]].map(([a, b], i) => <div key={i} className="flex items-center justify-between gap-2">{bar(a!, 0.85)}{bar(b!, 0.5)}</div>)}</div>
    case "cards": return <div className={wrap}>{[0, 1].map((i) => <div key={i} className="flex items-center gap-2 rounded-md bg-white p-1.5 ring-1 ring-neutral-200">{dot("1.375rem")}<div className="grid flex-1 gap-1">{bar("70%", 0.85)}{bar("45%", 0.4)}</div></div>)}</div>
    case "card": return <div className={wrap}><div className="grid gap-1.5 rounded-md bg-white p-2 ring-1 ring-neutral-200">{bar("40%", 0.5)}{bar("75%", 0.9, "0.5rem")}{bar("30%", 0.5)}</div></div>
    case "grid": return <div className="grid h-full grid-cols-2 gap-1.5 p-2.5">{[0, 1].map((i) => <div key={i} className="grid content-between rounded-md bg-white p-1.5 ring-1 ring-neutral-200"><i className="block h-5 rounded bg-neutral-300" />{bar("60%", 0.8)}</div>)}</div>
    case "avatars": return <div className={`${wrap} grid-cols-3`}>{[0, 1, 2].map((i) => <div key={i} className="grid justify-items-center gap-1"><i className="block size-6 rounded-full bg-neutral-300" />{bar("70%", 0.7, "0.25rem")}</div>)}</div>
    case "button": return <div className={wrap}><i className="mx-auto block h-6 w-4/5 rounded-full bg-neutral-900" /><i className="mx-auto block h-1.5 w-1/2 rounded-full bg-neutral-300" /></div>
    case "text": return <div className={wrap}>{bar("90%", 0.7, "0.3125rem")}{bar("80%", 0.5, "0.3125rem")}{bar("55%", 0.5, "0.3125rem")}</div>
    case "map": return <div className="relative h-full w-full overflow-hidden"><i className="absolute inset-0 bg-neutral-200" /><i className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-900 ring-4 ring-white" /></div>
    case "photos": return <div className="grid h-full grid-cols-3 gap-1 p-2"><i className="col-span-2 row-span-2 rounded bg-neutral-300" /><i className="rounded bg-neutral-400" /><i className="rounded bg-neutral-200" /></div>
    case "stars": return <div className={wrap}><div className="flex gap-0.5 text-neutral-900" aria-hidden="true">{"★★★★★"}</div>{bar("85%", 0.6, "0.3125rem")}{bar("60%", 0.4, "0.3125rem")}</div>
    case "tag": return <div className={wrap}><i className="mx-auto block h-7 w-3/4 rounded-md border-2 border-dashed border-neutral-500" /></div>
    case "video": return <div className="grid h-full place-items-center bg-neutral-800"><i className="block size-0 border-y-[0.4rem] border-l-[0.7rem] border-y-transparent border-l-white" /></div>
    case "clock": return <div className={wrap}>{[0, 1, 2].map((i) => <div key={i} className="flex justify-between">{bar("22%", 0.8, "0.3125rem")}{bar("34%", 0.45, "0.3125rem")}</div>)}</div>
    case "links": return <div className={wrap}>{[0, 1].map((i) => <i key={i} className="mx-auto block h-4 w-4/5 rounded-full ring-2 ring-neutral-800" />)}</div>
    case "bell": return <div className={wrap}><div className="rounded-md bg-neutral-900 p-1.5">{bar("80%", 1, "0.3125rem")}</div></div>
  }
}
