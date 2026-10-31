"use client";

import * as React from "react";
import { ArrowLeft, Maximize2, Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  canPublish,
  hasUnpublishedChanges,
  publish,
  readiness,
} from "@/features/demo/actions";
import { PagePreview } from "@/features/preview/PagePreview";
import { WorkspaceMenu } from "@/features/demo/dashboard/WorkspaceNav";
import { getWidget } from "../widgets/registry";
import { EditorDrawer, DEFAULT_SNAP, type DrawerSnap } from "./EditorDrawer";
import { ContextHelp } from "./ContextHelp";
import { ContentList } from "./ContentList";
import { SettingsBody } from "./EditorPanel";
import { Inspector } from "./Inspector";
import { PAGE, type Selection } from "./selection";
import type { Editor } from "./useEditor";
import "./mobile-workspace.css";

type Section = "content" | "header" | "design" | "settings";
const SECTIONS: { id: Section; label: string }[] = [
  { id: "content", label: "Content" },
  { id: "header", label: "Profile" },
  { id: "design", label: "Design" },
  { id: "settings", label: "Settings" },
];

/** Content first. Root sections occupy the screen; only an individual item opens a sheet. */
export function MobileEditor({
  ed,
  selection,
  setSelection,
  notify,
  note,
  clearNote,
}: {
  ed: Editor;
  selection: Selection;
  setSelection: (s: Selection) => void;
  notify: (msg: string, undoable?: boolean) => void;
  note: { msg: string; undoable: boolean } | null;
  clearNote: () => void;
}) {
  const [section, setSection] = React.useState<Section>("content");
  const [preview, setPreview] = React.useState(false);
  const [inspecting, setInspecting] = React.useState(false);
  const [showRequirements, setShowRequirements] = React.useState(false);
  const [snap, setSnap] = React.useState<DrawerSnap | null>(DEFAULT_SNAP);
  const scroll = React.useRef<HTMLDivElement>(null);
  const root = React.useRef<HTMLDivElement>(null);
  const opened = React.useRef(false);
  React.useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    if (new URLSearchParams(window.location.search).get("open") === "details") {
      queueMicrotask(() => {
        setSection("settings");
        setSelection({ kind: "details" });
      });
    }
  }, [setSelection]);
  React.useEffect(() => {
    const vv = window.visualViewport;
    const sync = () => {
      root.current?.style.setProperty(
        "--editor-vh",
        `${vv?.height ?? window.innerHeight}px`,
      );
      if (root.current)
        root.current.dataset.keyboard = String(
          window.innerHeight - (vv?.height ?? window.innerHeight) > 150 &&
            Boolean(document.activeElement?.matches("input,textarea,select")),
        );
      root.current?.style.setProperty(
        "--editor-top",
        `${vv?.offsetTop ?? 0}px`,
      );
    };
    sync();
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    return () => {
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
    };
  }, []);
  const s = ed.state;
  const changed = hasUnpublishedChanges(s);
  const select = (value: Selection) => {
    setSelection(value);
    if (value.kind === "content") {
      setSection("content");
      setInspecting(false);
      return;
    }
    if (value.kind === "header") {
      setSection("header");
      setInspecting(false);
      return;
    }
    if (value.kind === "page") {
      setSection("design");
      setInspecting(false);
      return;
    }
    setInspecting(true);
    setSnap(DEFAULT_SNAP);
  };
  const widget =
    selection.kind === "widget"
      ? s.page.widgets.find((w) => w.id === selection.id)
      : undefined;
  const title = widget
    ? (getWidget(widget.type)?.label ?? "Edit block")
    : selection.kind === "details"
      ? "Business details"
      : "Edit your page";
  const selectSection = (next: Section) => {
    setSection(next);
    setInspecting(false);
    setPreview(false);
    scroll.current?.scrollTo({ top: 0 });
  };
  return (
    <div
      ref={root}
      className="mobile-studio"
      data-testid="my-page"
      data-editor="compact"
    >
      <header
        className="mobile-studio-header"
        role="toolbar"
        aria-label="Page actions"
      >
        {preview ? (
          <button
            type="button"
            className="mobile-studio-back"
            aria-label="Back to editing"
            onClick={() => setPreview(false)}
          >
            <ArrowLeft />
          </button>
        ) : (
          <WorkspaceMenu />
        )}
        <div className="mobile-studio-identity">
          <strong>{s.content.identity.name || "Your page"}</strong>
          <span role={ed.storageFailed ? "alert" : undefined}>
            {ed.storageFailed ? "Changes not saved" : "Draft saved"}
          </span>
        </div>
        {!preview ? (
          <button
            type="button"
            className="mobile-studio-preview"
            onClick={() => {
              setPreview(true);
              setInspecting(false);
            }}
            aria-label="Expand page preview"
            data-testid="customer-preview"
          >
            <Maximize2 />
            <span className="sr-only">Expand preview</span>
          </button>
        ) : null}
      </header>
      <div
        className="mobile-studio-live"
        data-expanded={preview}
        data-section={section}
      >
        <PagePreview
          mode="fill"
          src={preview ? "/demo/preview" : "/demo/preview?edit=1"}
          title="Live preview of your page"
          testId="preview-frame"
          focus={
            section === "design" || section === "header"
              ? "identity"
              : inspecting && widget
                ? ((
                    {
                      priceMenu: "offer",
                      serviceList: "offer",
                      featuredService: "offer",
                      booking: "booking",
                      team: "team",
                      gallery: "gallery",
                      hours: "hours",
                    } as Record<string, string>
                  )[widget.type] ?? "identity")
                : "identity"
          }
          edit={preview ? undefined : { selection, onSelect: select }}
          onOverlayOpen={() => setPreview(true)}
          focusKey={section === "header" || section === "design" ? `${s.page.themeId}-${s.page.appearance.header?.layout}` : undefined}
          resizeKey={`${preview}-${section}`}
        />
      </div>

      {!preview ? (
        <>
          <nav className="mobile-studio-tabs" aria-label="Editor sections">
            {SECTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={section === t.id}
                data-testid={`tab-${t.id}`}
                onClick={() => selectSection(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div
            ref={scroll}
            className="mobile-studio-body"
            data-testid="inspector"
          >
            {section === "content" ? (
              <ContentList
                ed={ed}
                selection={selection}
                onSelect={select}
                notify={notify}
              />
            ) : null}
            {section === "header" ? (
              <Inspector
                ed={ed}
                selection={{ kind: "header" }}
                onSelect={select}
                notify={notify}
                compact
              />
            ) : null}
            {section === "design" ? (
              <Inspector
                ed={ed}
                selection={PAGE}
                onSelect={select}
                notify={notify}
                compact
              />
            ) : null}
            {section === "settings" ? (
              <SettingsBody
                ed={ed}
                selection={selection}
                onSelect={setSelection}
                notify={notify}
              />
            ) : null}
          </div>
          <footer className="mobile-studio-footer">
            <div className="mobile-studio-history">
              <Button
                variant="ghost"
                size="icon"
                onClick={ed.undo}
                disabled={!ed.canUndo}
                aria-label="Undo"
                data-testid="undo"
              >
                <Undo2 />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={ed.redo}
                disabled={!ed.canRedo}
                aria-label="Redo"
                data-testid="redo"
              >
                <Redo2 />
              </Button>
            </div>
            <Button
              disabled={!canPublish(s)}
              onClick={() => {
                ed.update(publish);
                notify(
                  "This version is published on this device. Public publishing is not connected.",
                );
              }}
              data-testid="publish"
            >
              {s.published
                ? changed
                  ? "Publish changes"
                  : "Published"
                : "Publish"}
            </Button>
            {!canPublish(s) ? (
              <button
                type="button"
                className="mobile-studio-requirements"
                aria-expanded={showRequirements}
                onClick={() => setShowRequirements(!showRequirements)}
              >
                {showRequirements ? "Hide requirements" : "What’s left?"}
              </button>
            ) : null}
            {showRequirements && !canPublish(s) ? (
              <p>
                {readiness(s)
                  .filter((c) => c.required && !c.done)
                  .map((c) => c.label)
                  .join(" · ")}
              </p>
            ) : null}
          </footer>
        </>
      ) : null}
      {note ? (
        <div role="status" className="mobile-studio-toast" data-testid="notice">
          <span>{note.msg}</span>
          {note.undoable ? (
            <button
              type="button"
              onClick={() => {
                ed.undo();
                clearNote();
              }}
            >
              Undo
            </button>
          ) : null}
          <button type="button" aria-label="Dismiss" onClick={clearNote}>
            ×
          </button>
        </div>
      ) : null}
      <EditorDrawer
        open={inspecting}
        onOpenChange={setInspecting}
        snap={snap}
        onSnap={setSnap}
        side="bottom"
        offsetTop={56}
        offsetBottom={0}
        title={title}
        canGoBack
        onBack={() => setInspecting(false)}
        screenKey={selection.kind === "widget" ? selection.id : selection.kind}
      >
        {widget?.type === "booking" ? <ContextHelp topic="booking" /> : null}
        <Inspector
          ed={ed}
          selection={selection}
          onSelect={(value) => {
            setSelection(value);
            if (value.kind === "content") setInspecting(false);
          }}
          notify={notify}
          compact
        />
      </EditorDrawer>
    </div>
  );
}
