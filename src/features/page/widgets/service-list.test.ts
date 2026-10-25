import { expect, it } from "vitest"
import { buildPageViewModel } from "../renderer/view-model"
import { initialConfig, toContent, toPage } from "@/features/showcase/lab-state"
import { serviceListItems } from "./service-list"

it("the optional featured filter follows visible features without changing business records", () => {
  const cfg = initialConfig("rowan")
  const content = toContent(cfg)
  const page = toPage(cfg)
  const before = structuredClone(content)
  const vm = buildPageViewModel(content, page, { plan: "business" })
  const list = vm.widgets.find((w) => w.type === "serviceList")!
  expect(serviceListItems(vm.business.services, list.settings, vm.ctx.featuredServiceIds).map((s) => s.name)).toEqual(["GCSE maths session", "A-level maths session"])
  const hidden = { ...page, widgets: page.widgets.map((w) => w.type === "featuredService" ? { ...w, hidden: true } : w) }
  const hiddenVM = buildPageViewModel(content, hidden, { plan: "business" })
  expect(serviceListItems(hiddenVM.business.services, list.settings, hiddenVM.ctx.featuredServiceIds)).toHaveLength(3)
  expect(content).toEqual(before)
})

it("a list with only featured records is hidden publicly and explains its empty state to the owner", () => {
  const cfg = initialConfig("rowan")
  const content = { ...toContent(cfg), services: toContent(cfg).services.slice(0, 1) }
  const vm = buildPageViewModel(content, toPage(cfg), { plan: "business" })
  const list = vm.widgets.find((w) => w.type === "serviceList")!
  expect(list.status).toMatchObject({ state: "empty", reason: expect.stringContaining("already featured") })
  expect(vm.visible.some((w) => w.id === list.id)).toBe(false)
})


it("preserves explicit service order, removes stale and duplicate references, then applies filters and limits", () => {
  const content = toContent(initialConfig("station"));
  const [first, second, third] = content.services;
  const services = [first, second, { ...third, archived: true }];
  const before = structuredClone(services);
  expect(serviceListItems(services, { serviceIds: [second.id, "missing", first.id, second.id, third.id] }).map(s => s.id)).toEqual([second.id, first.id]);
  expect(serviceListItems(services, { serviceIds: [second.id, first.id], limit: 1 }).map(s => s.id)).toEqual([second.id]);
  expect(serviceListItems(services, { serviceIds: [second.id, first.id], excludeFeatured: true }, [second.id]).map(s => s.id)).toEqual([first.id]);
  expect(serviceListItems(services, { serviceIds: [] })).toEqual([]);
  expect(services).toEqual(before);
});
