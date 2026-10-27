import { describe, it, expect } from "vitest"
import { initialState } from "./store"
import { readiness } from "./actions"

describe("what customers should do is intent, not configuration", () => {
  it("adds nothing to the checklist until a goal is chosen", () => {
    expect(readiness(initialState()).some((c) => c.id.startsWith("goal-"))).toBe(false)
  })
  it("a wish for bookings stays an open step until a service with a duration exists", () => {
    const s = { ...initialState(), setupDrafts: { goals: ["book" as const, "call" as const] } }
    const open = readiness(s).filter((c) => c.id.startsWith("goal-") && !c.done).map((c) => c.id)
    expect(open).toEqual(["goal-book", "goal-call"])
  })
})
