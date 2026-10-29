"use client";
import { StudioSkeleton } from "./dashboard/Studio";
import { RouteSkeleton, StudioNav } from "./dashboard/StudioNav";
import "@/features/page/editor/portal-workspace.css";
import "./dashboard/workspace-tools.css";

import { TaploLogo } from "@/components/taplo/brand";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Welcome } from "./Welcome";
import { useDemo } from "./store";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { ready, state } = useDemo();
  const path = usePathname();
  const focus = path === "/dashboard/page";
  const empty =
    ready && (!state || (!state.onboarded && !state.content.identity.name));
  const isHome = path === "/dashboard";
  return (
    <div
      className="portal-workspace"
      data-workspace-section={focus ? "editor" : "manage"}
    >
      <div className="portal-main portal-frame">
        <StudioNav />
        <div className="portal-column">
          {!focus ? (
            <header className="portal-toolbar" aria-label="Workspace">
              <div className="portal-toolbar-identity">
                <Link href="/dashboard" title={state?.content.identity.name || "Taplo"}>
                  {state?.content.identity.name || "Taplo"}
                </Link>
                {state && !isHome ? (
                  <span className={cn("studio-pill", state.published && "studio-pill-live")}>
                    {state.published ? "Published" : "Draft"}
                  </span>
                ) : null}
              </div>
              <div className="ml-auto flex items-center gap-2">
                {state?.content.identity.name ? (
                  <Link
                    href="/demo/preview"
                    target="_blank"
                    className="portal-preview-link"
                  >
                    View page
                  </Link>
                ) : (
                  <Link href="/" aria-label="Taplo home">
                    <TaploLogo className="h-5" />
                  </Link>
                )}
              </div>
            </header>
          ) : null}
          <main
            className={cn("portal-content", focus && "portal-content-editor")}
          >
            {!ready ? (
              isHome ? <StudioSkeleton /> : <RouteSkeleton />
            ) : empty ? (
              <Welcome />
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
