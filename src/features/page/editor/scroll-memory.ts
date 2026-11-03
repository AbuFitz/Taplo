"use client"

import * as React from "react"

/**
 * A scroller that remembers where each screen was left, so Back returns to the same place in a list instead of the top.
 * A screen the scroller has not shown before starts at its top.
 */
export function useScrollMemory<T extends HTMLElement>(key: string) {
  const ref = React.useRef<T>(null)
  const saved = React.useRef(new Map<string, number>())
  const current = React.useRef(key)
  React.useLayoutEffect(() => {
    current.current = key
    ref.current?.scrollTo({ top: saved.current.get(key) ?? 0 })
  }, [key])
  const onScroll = React.useCallback((e: React.UIEvent<T>) => { saved.current.set(current.current, e.currentTarget.scrollTop) }, [])
  return [ref, onScroll] as const
}
