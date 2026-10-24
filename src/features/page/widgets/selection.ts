/** Shared record selection: explicit IDs preserve the owner's order; null follows all records. */
export const referencedRecords = <T extends { id: string }>(all: T[], ids: unknown): T[] =>
  Array.isArray(ids) ? ids.map(id => all.find(x => x.id === id)).filter((x): x is T => Boolean(x)) : all

export const selectedPlatforms = <T extends { platform: string }>(all: T[], ids: unknown): T[] =>
  all.filter(x => !Array.isArray(ids) || ids.includes(x.platform))

/** Automatic selection can follow the first service. An explicit missing service must not become another one. */
export const selectedService = <T extends { id: string }>(all: T[], id: unknown): T | undefined =>
  typeof id === "string" && id ? all.find(x => x.id === id) : all[0]
