import * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="portal-page-heading">
      <div>
        <h1 className="portal-page-title">{title}</h1>
        {description ? (
          <p className="portal-page-description">{description}</p>
        ) : null}
      </div>
      {actions}
    </div>
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
    <section className={cn("portal-panel", className)}>
      <h2 className="font-semibold">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Honest "not built yet" state: names the phase and what is missing, offers no fake controls. */
export function NotBuilt({
  title,
  phase,
  children,
}: {
  title: string;
  phase: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl rounded-xl border border-dashed p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Not built yet · {phase}
      </p>
      <h2 className="mt-1 text-lg font-semibold">{title}</h2>
      <div className="mt-2 grid gap-2 text-sm text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
