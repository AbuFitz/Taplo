import { describe, expect, it } from "vitest"
import { buildPageViewModel } from "../renderer/view-model"
import { initialConfig, toContent, toPage } from "@/features/showcase/lab-state"
import { newWidget } from "../starter"
import { referencedRecords, selectedService } from "./selection"

describe("selection keeps owner intent when records disappear", () => {
  it("keeps explicit ordering and distinguishes automatic, empty and missing selections", () => {
    const records = [{ id: "one" }, { id: "two" }]
    expect(referencedRecords(records, ["two", "missing", "one"])).toEqual([records[1], records[0]])
    expect(referencedRecords(records, [])).toEqual([])
    expect(referencedRecords(records, null)).toEqual(records)
    expect(selectedService(records, null)).toBe(records[0])
    expect(selectedService(records, "missing")).toBeUndefined()
  })
  it("a missing featured service neither substitutes another one nor hides it from a list", () => {
    const cfg = initialConfig("station"), content = toContent(cfg)
    const page = { ...toPage(cfg), widgets: [newWidget("featuredService", { serviceId: "removed" }), newWidget("serviceList", { excludeFeatured: true })] }
    const before = JSON.stringify({ content, page })
    const vm = buildPageViewModel(content, page, { plan: "business" })
    expect(vm.widgets[0].status.state).toBe("empty")
    expect(vm.widgets[0].settings.serviceId).toBe("removed")
    expect(vm.visible.map(w => w.type)).toEqual(["serviceList"])
    expect(vm.ctx.featuredServiceIds).toEqual([])
    expect(JSON.stringify({ content, page })).toBe(before)
  })
  it("archiving a selected service does not feature an unrelated remaining service", () => {
    const cfg = initialConfig("station"), content = toContent(cfg)
    const id = content.services[0].id
    content.services[0].archived = true
    const page = { ...toPage(cfg), widgets: [newWidget("featuredService", { serviceId: id })] }
    const vm = buildPageViewModel(content, page, { plan: "business" })
    expect(vm.business.services.length).toBeGreaterThan(0)
    expect(vm.visible).toHaveLength(0)
    expect(vm.widgets[0].status.state).toBe("empty")
  })
})
