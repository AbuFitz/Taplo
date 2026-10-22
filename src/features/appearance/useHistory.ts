import * as React from "react"

interface Stack<T> { past: T[]; present: T; future: T[]; key: string | null; at: number }

/**
 * Undo/redo for a value. Edits that share a `coalesce` key within a second collapse into one
 * step, so dragging a colour or slider is a single undo. Mirrors the behaviour of the page editor's history.
 */
export function useHistory<T>(initial: () => T) {
  const [s, setS] = React.useState<Stack<T>>(() => ({ past: [], present: initial(), future: [], key: null, at: 0 }))
  const set = React.useCallback((next: T | ((p: T) => T), coalesce?: string) => {
    setS((cur) => {
      const value = typeof next === "function" ? (next as (p: T) => T)(cur.present) : next
      if (JSON.stringify(value) === JSON.stringify(cur.present)) return cur
      const now = Date.now()
      const merge = coalesce && cur.key === coalesce && now - cur.at < 1000
      return { past: merge ? cur.past : [...cur.past.slice(-99), cur.present], present: value, future: [], key: coalesce ?? null, at: now }
    })
  }, [])
  const undo = React.useCallback(() => setS((c) => (c.past.length ? { past: c.past.slice(0, -1), present: c.past[c.past.length - 1]!, future: [c.present, ...c.future], key: null, at: 0 } : c)), [])
  const redo = React.useCallback(() => setS((c) => (c.future.length ? { past: [...c.past, c.present], present: c.future[0]!, future: c.future.slice(1), key: null, at: 0 } : c)), [])
  return { value: s.present, set, undo, redo, canUndo: s.past.length > 0, canRedo: s.future.length > 0 }
}
