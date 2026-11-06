"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  OperationalRoot,
  AppearanceSelect,
  OperationalLogo,
} from "@/features/platform/OperationalTheme";
import { StudioSkeleton } from "./dashboard/Studio";
import { RouteSkeleton } from "./dashboard/workspace-navigation";
import { WorkspaceNav } from "./dashboard/WorkspaceNav";
import { Welcome } from "./Welcome";
import { useDemo } from "./store";
import "@/features/page/editor/portal-workspace.css";
import "./dashboard/workspace-tools.css";
import "./dashboard/workspace.css";
import "./dashboard/workspace-polish.css";
import "./dashboard/workspace-foundation.css";
import "./dashboard/studio-shell.css";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { ready, state, storageFailed } = useDemo();
  const path = usePathname();
  const section = path.split("/")[2] || "overview";
  const editor = section === "page";
  const empty =
    ready && (!state || (!state.onboarded && !state.content.identity.name));
  return (
    <OperationalRoot section={editor ? "editor" : "manage"} route={section}>
      <a className="studio-skip" href="#studio-content">
        Skip to content
      </a>
      <div className="studio-layout">
        <aside className="studio-rail" aria-label="Studio sections">
          <div className="studio-rail-brand">
            <Link href="/dashboard" className="studio-brand" aria-label="Taplo Studio home"><OperationalLogo /></Link>
            <span>Studio</span>
          </div>
          <WorkspaceNav variant="rail" />
          <div className="studio-rail-preferences"><AppearanceSelect /></div>
        </aside>
        <div className="studio-workspace-column">
          <header className="studio-header">
            <Link href="/dashboard" className="studio-brand" aria-label="Taplo Studio home"><OperationalLogo /></Link>
            <span>Studio</span>
            {editor ? <Link href="/dashboard" className="studio-editor-return">← Back to Studio</Link> : null}
          </header>
          <WorkspaceNav variant="mobile" />
          <div className="ws-main">
        <main
          id="studio-content"
          tabIndex={-1}
          className={`portal-content ws-content ${editor ? "ws-editor-content" : ""}`}
        >
          {!ready ? (
            section === "overview" ? (
              <StudioSkeleton />
            ) : (
              <RouteSkeleton />
            )
          ) : empty ? (
            <Welcome />
          ) : (
            children
          )}
        </main>
        {!editor ? (
          <footer className="ws-footer">
            <span role={storageFailed ? "alert" : undefined}>
              {storageFailed
                ? "Changes could not be saved. Try again before leaving."
                : "Your changes are saved."}
            </span>
          </footer>
        ) : null}
          </div>
        </div>
      </div>
    </OperationalRoot>
  );
}
