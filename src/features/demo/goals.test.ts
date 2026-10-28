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

import { applyIndustry } from "./actions"
describe("also-do categories", () => {
  it("never repeat the primary category and keep the design untouched", () => {
    const base = applyIndustry(initialState(), "barber")
    const withAlso = { ...base, content: { ...base.content, identity: { ...base.content.identity, alsoKeys: ["detailer", "tutor"] } } }
    const moved = applyIndustry(withAlso, "detailer")
    expect(moved.content.identity.alsoKeys).toEqual(["tutor"])
    expect(applyIndustry(withAlso, "barber").page.themeId).toBe(withAlso.page.themeId)
  })
})

import { canPublish } from "./actions"
describe("example content", () => {
  it("is never published as the owner's real offer", () => {
    const base = initialState()
    const withName = { ...base, content: { ...base.content, identity: { ...base.content.identity, name: "North Studio", slug: "north-studio", industryKey: "barber", industryLabel: "Barber" }, contacts: { ...base.content.contacts, email: "a@b.co" } } }
    const sample = { id: "svc-example", name: "Example haircut", priceMode: "fixed", price: 2000, durationMinutes: 30, archived: false, example: true }
    const withExample = { ...withName, content: { ...withName.content, services: [sample as never] } }
    expect(readiness(withExample).find((c) => c.id === "example")).toMatchObject({ required: true, done: false })
    expect(canPublish(withExample)).toBe(false)
    const cleared = { ...withExample, content: { ...withExample.content, services: [{ ...sample, example: false } as never] } }
    expect(readiness(cleared).some((c) => c.id === "example")).toBe(false)
  })
})
