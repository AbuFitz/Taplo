"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { StudioSkeleton } from "./dashboard/Studio";
import { RouteSkeleton } from "./dashboard/workspace-navigation";
import { WorkspaceNav } from "./dashboard/WorkspaceNav";
import { Welcome } from "./Welcome";
import { useDemo } from "./store";
import "@/features/page/editor/portal-workspace.css";
import "./dashboard/workspace-tools.css";
import "./dashboard/workspace.css";
import "./dashboard/workspace-polish.css";

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
};
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { ready, state, storageFailed } = useDemo();
  const path = usePathname();
  const section = path.split("/")[2] || "overview";
  const editor = section === "page";
  const empty =
    ready && (!state || (!state.onboarded && !state.content.identity.name));
  return (
    <div
      className="workspace-v2 portal-workspace"
      data-workspace-section={editor ? "editor" : "manage"}
      data-route={section}
    >
      <WorkspaceNav />
      <div className="ws-main">
        <header className="ws-topbar">
          <div>
            <span>Studio</span>
            <i>/</i>
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
        <main
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
            Taplo Studio
            <span role={storageFailed ? "alert" : undefined}>
              {storageFailed
                ? "Changes could not be saved. Browser storage is unavailable."
                : "Your changes are saved on this device."}
            </span>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
