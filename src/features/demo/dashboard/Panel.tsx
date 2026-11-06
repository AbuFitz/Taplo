import * as React from "react";
import { type StudioScene } from "./art/StudioArt";
import { SectionSetup } from "@/features/experience/SectionSetup";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  scene,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  scene?: StudioScene;
}) {
  return (
    <header
      className="ts-page-header portal-page-heading ws-page-heading"
      data-scene={scene}
    >
      <div className="ts-page-heading ws-page-intro">
        <span className="ts-overline">
          {scene === "settings"
            ? "YOUR WORKSPACE"
            : scene === "analytics"
              ? "UNDERSTAND YOUR BUSINESS"
              : "MADE FOR YOUR BUSINESS"}
        </span>
        <h1 className="portal-page-title">{title}</h1>
        {description ? (
          <p className="portal-page-description">{description}</p>
        ) : null}
      </div>
      <div className="ts-page-actions ws-heading-actions">
        {scene ? (
          <SectionSetup topic={scene === "design" ? "page" : scene} compact />
        ) : null}
        {actions}
      </div>
    </header>
  );
}
export function Panel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("ts-panel portal-panel", className)}>
      <header>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>
      <div className="ts-panel-body">{children}</div>
    </section>
  );
}
export function NotBuilt({
  title,
  children,
}: {
  title: string;
  phase: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ts-panel">
      <header>
        <h2>{title}</h2>
      </header>
      <div className="ts-panel-body">{children}</div>
    </section>
  );
}
