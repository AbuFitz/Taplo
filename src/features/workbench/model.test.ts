import { describe, expect, it } from "vitest"
import { WIDGET_TYPES } from "@/features/page/contracts/widgets"
import { GROUPS, STORIES } from "./stories"
import { buildStoryViewModel } from "./model"

describe("real component workbench contracts", () => {
  it("covers every registry type, with unique addresses and reachable group filters", () => {
    expect(new Set(STORIES.map(s => s.id)).size).toBe(STORIES.length)
    const types = new Set(STORIES.flatMap(s => s.widgets.map(w => w.type)))
    expect(WIDGET_TYPES.filter(t => !types.has(t))).toEqual([])
    expect([...new Set(STORIES.map(s => s.group))].filter(g => !GROUPS.includes(g))).toEqual([])
    expect(GROUPS).toContain("Header")
  })
  it("each declared public/hidden state comes from the actual engine", () => {
    for (const story of STORIES) {
      const vm = buildStoryViewModel(story, "https://taplo.example")
      if (story.expectedState) {
        expect(vm.visible, story.id).toHaveLength(0)
        expect(vm.widgets[0].status.state, story.id).toBe(story.expectedState)
      } else expect(vm.visible.length, story.id).toBeGreaterThan(0)
    }
  })
  it("download fixtures follow the hosting origin rather than a dead sample hostname", () => {
    const story = STORIES.find(s => s.id === "document--light")!
    expect(buildStoryViewModel(story, "https://preview.taplo.example").widgets[0].settings.url).toBe("https://preview.taplo.example/workbench/corner-table-menu.pdf")
    expect(buildStoryViewModel(story, "http://localhost:3100").widgets[0].settings.url).toBe("http://localhost:3100/workbench/corner-table-menu.pdf")
  })
})
