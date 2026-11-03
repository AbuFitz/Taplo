import { buildPageViewModel } from "@/features/page/renderer/view-model"
import { newWidget } from "@/features/page/starter"
import { base } from "./data"
import { SURFACE_LOOK, type Story } from "./stories"

export function buildStoryViewModel(story: Story, origin: string) {
  const content = (story.content ?? (c => c))(base(story.scenario))
  const page = {
    schemaVersion: 2 as const, themeId: SURFACE_LOOK[story.surface], appearance: story.appearance ?? {},
    meta: { searchVisible: false, primaryAction: story.header ? ("auto" as const) : ("none" as const) },
    widgets: story.widgets.map((w, i) => ({ ...newWidget(w.type, { ...w.settings, ...(w.assetPath ? { url: new URL(w.assetPath, origin).href } : {}) }), id: `wb-${i}` })),
    savedLooks: [], savedStyles: [],
  }
  return buildPageViewModel(content, page, { plan: story.plan ?? "business", ...(story.now ? { now: new Date(story.now) } : {}) })
}
