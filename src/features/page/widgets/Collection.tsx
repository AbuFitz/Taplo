"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * A horizontal collection on CSS scroll snap. No library: native scrolling keeps touch, trackpad and vertical
 * page scroll working together, and `scroll-snap` gives the settle.
 *
 * Rules this component enforces (they are the accessibility contract for every swipe collection):
 *  - the next item always peeks in, and an edge fade plus a "2 of 6" count say there is more;
 *  - nothing is only reachable by swiping: previous/next buttons and the arrow keys scroll it, and every
 *    item's own controls stay in the tab order;
 *  - no automatic movement; reduced motion turns smooth scrolling off.
 */
export function Collection({ label, children, itemClassName, compact = false }: { label: string; children: React.ReactNode[]; itemClassName?: string; compact?: boolean }) {
  const ref = React.useRef<HTMLUListElement>(null)
  const [edge, setEdge] = React.useState({ start: true, end: false, first: 1, last: 1 })
  const count = React.Children.count(children)

  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    const kids = Array.from(el.children) as HTMLElement[]
    const left = el.scrollLeft
    const right = left + el.clientWidth
    const visible = kids.map((k, i) => ({ i, on: k.offsetLeft + k.offsetWidth * 0.5 >= left && k.offsetLeft + k.offsetWidth * 0.5 <= right })).filter((x) => x.on)
    setEdge({ start: left <= 2, end: left + el.clientWidth >= el.scrollWidth - 2, first: (visible[0]?.i ?? 0) + 1, last: (visible[visible.length - 1]?.i ?? 0) + 1 })
  }, [])

  React.useEffect(() => {
    measure()
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure, count])

  const step = (dir: -1 | 1) => {
    const el = ref.current
    if (!el) return
    const first = el.children[0] as HTMLElement | undefined
    const gap = first ? first.offsetWidth + 12 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * gap, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
  }

  return (
    <div className="tp-collection" role="group" aria-roledescription="collection" aria-label={label} data-count={count} data-compact={compact || undefined} data-start={edge.start || undefined} data-end={edge.end || undefined}>
      <ul
        ref={ref}
        className="tp-collection-track"
        tabIndex={0}
        aria-label={`${label}, scrollable. Use the left and right arrow keys, or the previous and next buttons.`}
        onScroll={measure}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); step(1) }
          else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1) }
        }}
      >
        {React.Children.map(children, (c, i) => <li key={i} className={itemClassName}>{c}</li>)}
      </ul>
      {count > 1 ? (
        <div className="tp-collection-bar">
          <span className="tp-collection-count" aria-live="polite">{edge.first === edge.last ? `${edge.first} of ${count}` : `${edge.first}–${edge.last} of ${count}`}</span>
          <span className="tp-collection-nav">
            <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label={`Previous in ${label}`}><ChevronLeft aria-hidden="true" className="size-4" /></button>
            <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label={`Next in ${label}`}><ChevronRight aria-hidden="true" className="size-4" /></button>
          </span>
        </div>
      ) : null}
    </div>
  )
}
