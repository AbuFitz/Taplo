/** What the owner is currently editing. Lives in the editor shell, not in the saved document. */
export type Selection =
  /** The content list: nothing in particular is being edited. */
  | { kind: "content" }
  /** Design: look, colours, type, buttons, cards. */
  | { kind: "page" }
  | { kind: "header" }
  /** Business records shared by many widgets: contact details, hours, questions, photos. */
  | { kind: "details" }
  /** Search visibility and share text; not appearance. */
  | { kind: "settings" }
  | { kind: "widget"; id: string };

export const PAGE: Selection = { kind: "page" };
export const CONTENT: Selection = { kind: "content" };

/** The four editor tabs, and which one a selection belongs to. */
export type EditorTab = "content" | "header" | "design" | "settings";
export const tabOf = (s: Selection): EditorTab => (s.kind === "header" ? "header" : s.kind === "page" ? "design" : s.kind === "details" || s.kind === "settings" ? "settings" : "content");
export const rootOf = (t: EditorTab): Selection => (t === "header" ? { kind: "header" } : t === "design" ? PAGE : t === "settings" ? { kind: "details" } : CONTENT);

export const sameSelection = (a: Selection, b: Selection) =>
  a.kind === b.kind && (a.kind !== "widget" || (b.kind === "widget" && a.id === b.id));

/** Messages exchanged between the editor and its preview frame (same origin only). */
export type ToPreview = { type: "taplo:selected"; selection: Selection; /** Pixels of the bottom edge covered by a sheet, so the selection scrolls into the visible part. */ bottomInset?: number };
export type FromPreview = { type: "taplo:select"; selection: Selection } | { type: "taplo:ready" };
