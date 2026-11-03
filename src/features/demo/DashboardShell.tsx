"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { OperationalRoot, AppearanceSelect, OperationalLogo } from "@/features/platform/OperationalTheme";
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

const TITLES: Record<string, string> = {
  services: "Services",
  bookings: "Bookings",
  team: "Team",
  products: "Products",
  reviews: "Reviews",
  analytics: "Analytics",
  settings: "Settings",
  page: "Page builder",
  profile: "Business details",
  help: "Help & feedback",
};
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { ready, state, storageFailed } = useDemo();
  const path = usePathname();
  const section = path.split("/")[2] || "overview";
  const editor = section === "page";
  const empty =
    ready && (!state || (!state.onboarded && !state.content.identity.name));
  return (
    <OperationalRoot section={editor ? "editor" : "manage"} route={section}>
      <a className="studio-skip" href="#studio-content">Skip to content</a>
      <header className="studio-header">
        <Link href="/dashboard" className="studio-brand" aria-label="Taplo home"><OperationalLogo /></Link>
        <WorkspaceNav />
        <AppearanceSelect />
      </header>
      <div className="ws-main">
        <header className="ws-topbar">
          <div>
            <strong>{TITLES[section] || "Overview"}</strong>
          </div>
          <div className="ws-topbar-actions">
            <span className="ws-save-dot">
              {state?.published ? "Published" : "Draft"}
            </span>
            {state?.content.identity.name ? (
              <Link href="/demo/preview" target="_blank">
                View page
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </header>
        <main id="studio-content" tabIndex={-1}
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
    </OperationalRoot>
  );
}
