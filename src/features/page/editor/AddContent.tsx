"use client";

import * as React from "react";
import { Check, Lock, Search } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { getIndustryPreset } from "@/features/themes/presets/industries";
import {
  CHOICES,
  GROUP_LABEL,
  needCta,
  type ContentChoice,
  type RecordKind,
} from "./content-model";
import { ContentPicture, contentReuseLabel } from "./ContentPicture";
import {
  RECORD_TITLE,
  RecordForm,
  blankFor,
  commitRecord,
  validate,
} from "./RecordForms";
import { newWidget } from "../starter";
import { getWidget } from "../widgets/registry";
import type { Editor } from "./useEditor";

/** How many records of a kind the business already has, so adding content reuses them instead of asking again. */
export function recordCount(ed: Editor, kind: RecordKind): number {
  const c = ed.state.content;
  switch (kind) {
    case "service":
      return (c.services ?? []).filter((s) => !s.archived).length;
    case "product":
      return (c.products ?? []).filter(
        (p) => !p.archived && p.kind !== "vehicle",
      ).length;
    case "vehicle":
      return (c.products ?? []).filter(
        (p) => !p.archived && p.kind === "vehicle",
      ).length;
    case "review":
      return (c.testimonials ?? []).length;
    case "staff":
      return (c.staff ?? []).length;
    case "faq":
      return (c.faqs ?? []).length;
    case "photo":
      return (c.gallery ?? []).length;
    case "social":
      return (c.contacts?.social ?? []).length;
    case "credential":
      return (c.credentials ?? []).length;
    case "offer":
      return (c.offers ?? []).filter((o) => !o.archived).length;
    case "phone":
      return c.contacts?.phone ? 1 : 0;
    case "whatsapp":
      return c.contacts?.whatsapp ? 1 : 0;
    case "email":
      return c.contacts?.email ? 1 : 0;
    case "directions":
      return c.location?.directionsUrl ? 1 : 0;
  }
}

/**
 * Add content: one stepped journey in one panel. Choose what to add (suggestions first, but anything is allowed),
 * and if it needs a record the business does not have yet, create it right there. Nothing is added to the page
 * until it has something to show, so there are no empty blocks to fix afterwards.
 */
export function AddContent({
  ed,
  open,
  onOpenChange,
  onAdded,
  initialKind,
}: {
  ed: Editor;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdded: (id: string) => void;
  initialKind?: RecordKind | null;
}) {
  const [q, setQ] = React.useState("");
  const [step, setStep] = React.useState<{
    choice: ContentChoice;
    kind: RecordKind;
  } | null>(null);
  const [draft, setDraft] = React.useState<unknown>(null);
  const [show, setShow] = React.useState(false);
  const [done, setDone] = React.useState<string | null>(null);
  const widgets = ed.state.page.widgets;
  const industry = getIndustryPreset(ed.state.content.identity.industryKey);

  const onPage = (c: ContentChoice) => widgets.some((w) => w.type === c.type);
  const unique = (c: ContentChoice) => !getWidget(c.type)?.multiple;
  const closed = (c: ContentChoice) => unique(c) && onPage(c);

  const reset = () => {
    setStep(null);
    setDraft(null);
    setShow(false);
    setDone(null);
    setQ("");
  };
  const close = (o: boolean) => {
    onOpenChange(o);
    if (!o) reset();
  };

  const suggested = React.useMemo(() => {
    const want = new Set<string>(industry.starterWidgets);
    const out = CHOICES.filter(
      (c) =>
        !c.blocked &&
        !closed(c) &&
        (want.has(c.type) ||
          c.suggestFor?.includes(ed.state.content.identity.industryKey)),
    )
      .filter(
        (c) =>
          c.id !== (industry.id === "car-dealer" ? "products" : "vehicles"),
      )
      .slice(0, 6);
    return out;
  }, [industry, widgets, ed.state.content.identity.industryKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const add = (c: ContentChoice) => {
    const base = newWidget(c.type, { ...(c.settings ?? {}) });
    const settings =
      c.type === "team" && (ed.state.content.staff?.length ?? 0) >= 3
        ? { ...base.settings, variant: "swipe" }
        : base.settings;
    ed.setPage((p) => ({
      ...p,
      widgets: [...p.widgets, { ...base, settings }],
    }));
    return base.id;
  };

  const choose = (c: ContentChoice) => {
    if (c.blocked) return;
    if (c.needs && recordCount(ed, c.needs) === 0) {
      setStep({ choice: c, kind: c.needs });
      setDraft(blankFor(c.needs, ed.state.content));
      setShow(false);
      return;
    }
    const id = add(c);
    onAdded(id);
    close(false);
  };

  // Opened from a card's "Add your first ..." with no widget to add.
  const standalone = initialKind ?? null;
  const active =
    step ??
    (standalone
      ? { choice: null as unknown as ContentChoice, kind: standalone }
      : null);
  // The blank record for a card's "Add your first ..." is made once per opening, not on every render.
  const standaloneBlank = React.useMemo(
    () => (open && standalone ? blankFor(standalone, ed.state.content) : null),
    // The form starts with a snapshot. Typing in it must not recreate the blank.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, standalone],
  );
  const shownDraft = draft ?? standaloneBlank;

  const save = () => {
    if (!active) return;
    if (Object.keys(validate(active.kind, shownDraft)).length) {
      setShow(true);
      return;
    }
    const base = step
      ? newWidget(step.choice.type, { ...(step.choice.settings ?? {}) })
      : null;
    // Content and its section are one action: a single Undo restores the previous page and records.
    ed.update((s) => {
      const content = commitRecord(active.kind, shownDraft, s.content);
      const widget =
        base && base.type === "team" && (content.staff?.length ?? 0) >= 3
          ? { ...base, settings: { ...base.settings, variant: "swipe" } }
          : base;
      return {
        ...s,
        content,
        page: widget
          ? { ...s.page, widgets: [...s.page.widgets, widget] }
          : s.page,
      };
    });
    const id = base?.id;
    close(false);
    if (id) onAdded(id);
  };

  const filtered = CHOICES.filter(
    (c) =>
      !q.trim() ||
      `${c.name} ${c.blurb}`.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const card = (c: ContentChoice) => {
    const cl = closed(c);
    const n = c.needs ? recordCount(ed, c.needs) : 0;
    return (
      <li key={c.id}>
        <button
          type="button"
          onClick={() => choose(c)}
          disabled={cl || Boolean(c.blocked)}
          data-testid="choice"
          data-choice-id={c.id}
          className="grid h-full w-full grid-rows-[4.25rem_auto] gap-2.5 rounded-2xl border bg-card p-2.5 text-left outline-none transition-colors enabled:hover:border-primary enabled:hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
        >
          <span className="block overflow-hidden rounded-xl bg-neutral-100">
            <ContentPicture choice={c} content={ed.state.content} />
          </span>
          <span className="grid gap-0.5 px-0.5 pb-0.5">
            <span className="text-sm font-semibold leading-tight">
              {c.name}
            </span>
            <span className="text-xs leading-snug text-muted-foreground">
              {c.blurb}
            </span>
            <span className="mt-1 text-[0.6875rem] font-medium text-muted-foreground">
              {c.blocked ? (
                <span className="flex items-center gap-1">
                  <Lock aria-hidden="true" className="size-3" />
                  {c.blocked}
                </span>
              ) : cl ? (
                <span className="flex items-center gap-1">
                  <Check aria-hidden="true" className="size-3" />
                  Already on your page
                </span>
              ) : c.needs && n > 0 ? (
                contentReuseLabel(c.needs, n)
              ) : c.needs ? (
                "You will add the first one now"
              ) : null}
            </span>
          </span>
        </button>
      </li>
    );
  };

  const title = active
    ? standalone && !step
      ? RECORD_TITLE[active.kind]
      : `${step?.choice.name ?? ""}: ${RECORD_TITLE[active.kind].toLowerCase()}`
    : "Add content";
  return (
    <Overlay
      kind="panel"
      open={open}
      onOpenChange={close}
      onBack={
        step
          ? () => {
              setStep(null);
              setDraft(null);
            }
          : undefined
      }
      title={title}
      description={
        active
          ? "It is saved with your business, so you can use it anywhere on your page."
          : "Pick what you want on your page. Anything works for any business."
      }
      footer={
        active ? (
          <Button
            className="min-h-12 w-full"
            onClick={save}
            data-testid="record-save"
          >
            {standalone && !step
              ? "Save"
              : `Save and add ${step?.choice.name.toLowerCase()}`}
          </Button>
        ) : undefined
      }
      testId="add-content"
    >
      {active && shownDraft ? (
        <div className="grid gap-4" data-testid="record-step">
          <RecordForm
            kind={active.kind}
            value={shownDraft}
            onChange={setDraft}
            showErrors={show}
            content={ed.state.content}
          />
          {done ? null : (
            <p className="text-xs text-muted-foreground">
              {needCta(active.kind)}. You can change it later in the editor.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          <label className="relative block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              aria-label="Search content"
              placeholder="Search: reviews, photos, vehicles…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="min-h-11 w-full rounded-xl border bg-transparent pl-10 pr-3 text-sm"
            />
          </label>
          {!q.trim() && suggested.length ? (
            <section aria-labelledby="sug-h">
              <h3 id="sug-h" className="text-sm font-semibold">
                Suggested for{" "}
                {ed.state.content.identity.industryLabel || industry.label}
              </h3>
              <p className="mb-2 text-xs text-muted-foreground">
                Based on your category. It is only a starting point.
              </p>
              <ul className="grid grid-cols-2 gap-2">{suggested.map(card)}</ul>
            </section>
          ) : null}
          {(Object.keys(GROUP_LABEL) as ContentChoice["group"][]).map((g) => {
            const items = filtered.filter((c) => c.group === g);
            if (!items.length) return null;
            return (
              <section key={g} aria-labelledby={`g-${g}`}>
                <h3 id={`g-${g}`} className="text-sm font-semibold">
                  {GROUP_LABEL[g].title}
                </h3>
                <p className="mb-2 text-xs text-muted-foreground">
                  {GROUP_LABEL[g].hint}
                </p>
                <ul className="grid grid-cols-2 gap-2">{items.map(card)}</ul>
              </section>
            );
          })}
          {!filtered.length ? (
            <p className="text-sm text-muted-foreground">
              Nothing matches “{q}”.
            </p>
          ) : null}
        </div>
      )}
    </Overlay>
  );
}
