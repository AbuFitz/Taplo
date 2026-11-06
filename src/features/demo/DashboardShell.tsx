"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  OperationalRoot,
  AppearanceSelect,
  OperationalLogo,
} from "@/features/platform/OperationalTheme";
import { StudioIcons } from "@/features/platform/icons";
import { StudioSkeleton } from "./dashboard/Studio";
import { RouteSkeleton } from "./dashboard/workspace-navigation";
import { WorkspaceNav } from "./dashboard/WorkspaceNav";
import { StudioSearch } from "@/features/studio/StudioSearch";
import { Welcome } from "./Welcome";
import { useDemo } from "./store";
import "@/features/studio/studio-design.css";

const ROUTES: Record<string, string> = {
  overview: "Overview",
  page: "Your page",
  offers: "What you offer",
  services: "Services",
  products: "Products",
  bookings: "Bookings",
  team: "Team",
  reviews: "Reviews",
  analytics: "Analytics",
  settings: "Settings",
  help: "Help & support",
  profile: "Business details",
};
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { ready, state, storageFailed } = useDemo();
  const section = usePathname().split("/")[2] || "overview";
  const editor = section === "page";
  const empty =
    ready && (!state || (!state.onboarded && !state.content.identity.name));
  return (
    <OperationalRoot section={editor ? "editor" : "manage"} route={section}>
      <a className="studio-skip" href="#studio-content">
        Skip to content
      </a>
      <div className="ts-workspace" data-studio-design="2026">
        <aside
          data-testid="studio-rail"
          className="ts-sidebar studio-rail"
          aria-label="Studio sections"
        >
          <Link
            href="/dashboard"
            className="ts-brand"
            aria-label="Taplo Studio home"
          >
            <OperationalLogo />
            <span>studio</span>
          </Link>
          <div className="ts-business">
            <span className="ts-workspace-label">YOUR WORKSPACE</span>
            <strong>{state?.content.identity.name || "Your business"}</strong>
            <small>
              {state?.content.identity.industryLabel || "Make it yours"}
            </small>
          </div>
          <WorkspaceNav variant="rail" />
          <div className="ts-sidebar-bottom">
            <AppearanceSelect />
            <p>Made for the way you work.</p>
          </div>
        </aside>
        <div className="ts-workspace-main">
          <header className="ts-topbar">
            <div className="ts-location">
              <Link
                href="/dashboard"
                className="ts-mobile-brand"
                aria-label="Taplo Studio home"
              >
                <OperationalLogo />
              </Link>
              <span className="ts-location-studio">Studio</span>
              <span aria-hidden="true">/</span>
              <strong>{ROUTES[section] || "Workspace"}</strong>
            </div>
            <StudioSearch />
            <Link
              href={`/dashboard/help${section !== "help" && section !== "overview" ? `?topic=${section === "offers" ? "services" : section}` : ""}`}
              className="ts-help-button"
              aria-label="Help & support"
            >
              <StudioIcons.help />
            </Link>
          </header>
          <main
            id="studio-content"
            tabIndex={-1}
            className={`portal-content ws-content ts-canvas ${editor ? "ts-editor-canvas" : ""}`}
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
            <footer className="ts-footer">
              <span role={storageFailed ? "alert" : undefined}>
                {storageFailed
                  ? "We couldn’t save your changes. Please try again."
                  : "All changes saved"}
              </span>
              <Link href="/dashboard/help">
                Help & support <StudioIcons.external />
              </Link>
            </footer>
          ) : null}
        </div>
        <WorkspaceNav variant="mobile" />
      </div>
    </OperationalRoot>
  );
}
