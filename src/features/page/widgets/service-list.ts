import type { ServiceContent } from "@/features/businesses/content"

/** One selection rule for public rendering, owner summaries and empty-state validation. */
export function serviceListItems(services: ServiceContent[], settings: Record<string, unknown>, featuredIds: string[] = []) {
  let list = services.filter((s) => !s.archived && (!Array.isArray(settings.serviceIds) || settings.serviceIds.includes(s.id)))
  if (settings.group) list = list.filter((s) => s.group === settings.group)
  if (settings.excludeFeatured) list = list.filter((s) => !featuredIds.includes(s.id))
  if (typeof settings.limit === "number" && settings.limit > 0) list = list.slice(0, settings.limit)
  return list
}
