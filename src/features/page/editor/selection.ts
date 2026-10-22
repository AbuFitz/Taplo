/** What the owner is currently editing. Lives in the editor shell, not in the saved document. */
export type Selection =
  | { kind: "page" }
  | { kind: "header" }
  /** Business records shared by many widgets: contact details, hours, questions, photos. */
  | { kind: "details" }
  /** Search visibility and share text; not appearance. */
  | { kind: "settings" }
  | { kind: "widget"; id: string };

export const PAGE: Selection = { kind: "page" };

export const sameSelection = (a: Selection, b: Selection) =>
  a.kind === b.kind && (a.kind !== "widget" || (b.kind === "widget" && a.id === b.id));

/** Messages exchanged between the editor and its preview frame (same origin only). */
export type ToPreview = { type: "taplo:selected"; selection: Selection };
export type FromPreview = { type: "taplo:select"; selection: Selection } | { type: "taplo:ready" };
