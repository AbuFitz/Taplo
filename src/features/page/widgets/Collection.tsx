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
  const [edge, setEdge] = React.useState({ start: true, end: false, overflow: false, first: 1, last: 1 })
  const count = React.Children.count(children)

  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    const kids = Array.from(el.children) as HTMLElement[]
    const bounds = el.getBoundingClientRect()
    const visible = kids.map((k, i) => ({ i, box: k.getBoundingClientRect() }))
      .filter(({ box }) => box.left + box.width / 2 >= bounds.left && box.left + box.width / 2 <= bounds.right)
    const next = {
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      overflow: el.scrollWidth > el.clientWidth + 2,
      first: (visible[0]?.i ?? 0) + 1,
      last: (visible.at(-1)?.i ?? 0) + 1,
    }
    setEdge((old) => Object.keys(next).every((k) => old[k as keyof typeof old] === next[k as keyof typeof next]) ? old : next)
  }, [])

  React.useEffect(() => {
    measure()
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    Array.from(el.children).forEach((child) => ro.observe(child))
    return () => ro.disconnect()
  }, [measure, count])

  const step = (dir: -1 | 1) => {
    const el = ref.current
    if (!el) return
    const padding = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0
    const left = el.getBoundingClientRect().left + padding
    const kids = Array.from(el.children) as HTMLElement[]
    const target = dir === 1
      ? kids.find((k) => k.getBoundingClientRect().left > left + 2)
      : kids.findLast((k) => k.getBoundingClientRect().left < left - 2)
    el.scrollTo({
      left: target ? el.scrollLeft + target.getBoundingClientRect().left - left : dir === 1 ? el.scrollWidth : 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    })
  }

  return (
    <div className="tp-collection" role="group" aria-roledescription="collection" aria-label={label} data-overflow={edge.overflow || undefined} data-count={count} data-compact={compact || undefined} data-start={edge.start || undefined} data-end={edge.end || undefined}>
      <ul
        ref={ref}
        className="tp-collection-track"
        tabIndex={edge.overflow ? 0 : -1}
        aria-label={`${label}, scrollable. Use the left and right arrow keys, or the previous and next buttons.`}
        onScroll={measure}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return
          if (e.key === "Home" || e.key === "End") { e.preventDefault(); e.currentTarget.scrollTo({ left: e.key === "Home" ? 0 : e.currentTarget.scrollWidth, behavior: "instant" }) }
          else if (e.key === "ArrowRight") { e.preventDefault(); step(1) }
          else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1) }
        }}
      >
        {React.Children.map(children, (c, i) => <li key={i} className={itemClassName}>{c}</li>)}
      </ul>
      {count > 1 ? (
        <div className="tp-collection-bar">
          <span className="tp-collection-count" aria-live="polite">{edge.first === edge.last ? `${edge.first} of ${count}` : `${edge.first} to ${edge.last} of ${count}`}</span>
          <span className="tp-collection-nav">
            <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label={`Previous in ${label}`}><ChevronLeft aria-hidden="true" className="size-4" /></button>
            <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label={`Next in ${label}`}><ChevronRight aria-hidden="true" className="size-4" /></button>
          </span>
        </div>
      ) : null}
    </div>
  )
}
