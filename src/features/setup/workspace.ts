import { z } from "zod";
import { businessContentSchema } from "@/features/businesses/content";
import { pageDocSchema } from "@/features/page/contracts/page";
import { ONBOARDING_STEPS, setupDraftsSchema } from "./progress";

/** Private authoring data, not a published page, offer configuration or entitlement. */
export const workspaceSnapshotSchema = z
  .object({
    schema_version: z.literal(1),
    content: businessContentSchema,
    page: pageDocSchema,
    progress: z
      .object({
        step: z.enum(ONBOARDING_STEPS),
        slugEdited: z.boolean(),
        showExamples: z.boolean().optional(),
        setupDrafts: setupDraftsSchema,
      })
      .strict(),
  })
  .strict();
export type WorkspaceSnapshot = z.infer<typeof workspaceSnapshotSchema>;
export const WORKSPACE_MAX_BYTES = 2 * 1024 * 1024;

/** Zod supplies defaults, but an unsupported field must never silently disappear. */
export function omittedField(
  input: unknown,
  parsed: unknown,
  path = "",
): string | null {
  if (!input || typeof input !== "object") return null;
  const output =
    parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : {};
  for (const [key, value] of Object.entries(input)) {
    const pointer = `${path}/${key.replaceAll("~", "~0").replaceAll("/", "~1")}`;
    if (!Object.hasOwn(output, key)) return pointer;
    const child = omittedField(value, output[key], pointer);
    if (child) return child;
  }
  return null;
}

export function parseWorkspace(input: unknown): WorkspaceSnapshot {
  // Limit recursive JSON work before the schema and canonical comparison traverse it.
  const pending: { value: unknown; depth: number }[] = [
    { value: input, depth: 0 },
  ];
  let nodes = 0;
  while (pending.length) {
    const entry = pending.pop()!;
    if (++nodes > 50000 || entry.depth > 32)
      throw new Error("workspace.too_complex");
    if (entry.value && typeof entry.value === "object")
      for (const value of Object.values(entry.value)) {
        if (nodes + pending.length >= 50000)
          throw new Error("workspace.too_complex");
        pending.push({ value, depth: entry.depth + 1 });
      }
  }
  if (
    new TextEncoder().encode(JSON.stringify(input)).byteLength >
    WORKSPACE_MAX_BYTES
  )
    throw new Error("workspace.too_large");
  const parsed = workspaceSnapshotSchema.safeParse(input);
  if (!parsed.success) throw new Error("workspace.invalid");
  if (omittedField(input, parsed.data))
    throw new Error("workspace.unsupported_field");
  try {
    new Intl.DateTimeFormat("en", {
      timeZone: parsed.data.content.location.timezone,
    });
  } catch {
    throw new Error("workspace.invalid_timezone");
  }
  // Duplicate IDs make widget references ambiguous after restoring a workspace.
  const collections = [
    parsed.data.page.widgets,
    parsed.data.page.savedLooks,
    parsed.data.page.savedStyles,
    parsed.data.content.services,
    parsed.data.content.products,
    parsed.data.content.staff,
    parsed.data.content.gallery,
    parsed.data.content.faqs,
    parsed.data.content.offers,
    parsed.data.content.testimonials,
    parsed.data.content.caseStudies,
  ];
  if (
    collections.some(
      (items) =>
        items && new Set(items.map((item) => item.id)).size !== items.length,
    )
  )
    throw new Error("workspace.duplicate_ids");
  return parsed.data;
}

/** Capturing a workspace deliberately excludes plan, login, publication and server authority. */
export function captureWorkspace(state: {
  content: unknown;
  page: unknown;
  step: string;
  slugEdited: boolean;
  showExamples?: boolean;
  setupDrafts?: unknown;
}): WorkspaceSnapshot {
  return parseWorkspace({
    schema_version: 1,
    content: state.content,
    page: state.page,
    progress: {
      step: state.step,
      slugEdited: state.slugEdited,
      ...(state.showExamples !== undefined
        ? { showExamples: state.showExamples }
        : {}),
      ...(state.setupDrafts ? { setupDrafts: state.setupDrafts } : {}),
    },
  });
}
