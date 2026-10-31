"use client";
import * as React from "react";
const ROUTES = [
  "overview",
  "page",
  "services",
  "bookings",
  "products",
  "team",
  "reviews",
  "analytics",
  "settings",
  "onboarding",
] as const;
/** Real application documents at real CSS viewport widths. No replica components or seeded business data. */
export function WorkspaceWorkbench() {
  const [route, setRoute] = React.useState<(typeof ROUTES)[number]>("overview");
  const [width, setWidth] = React.useState(390);
  const src =
    route === "onboarding"
      ? "/onboarding"
      : route === "overview"
        ? "/dashboard"
        : `/dashboard/${route}`;
  return (
    <main
      style={{
        padding: 24,
        background: "#eef0f3",
        minHeight: "100vh",
        fontFamily: "system-ui",
      }}
    >
      <header
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 600 }}>Workspace workbench</h1>
        <label>
          Screen{" "}
          <select
            aria-label="Workspace screen"
            value={route}
            onChange={(e) => setRoute(e.target.value as typeof route)}
            style={{
              marginLeft: 8,
              padding: 10,
              borderRadius: 8,
              background: "white",
            }}
          >
            {ROUTES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <div
          role="group"
          aria-label="Viewport width"
          style={{ display: "flex", gap: 6 }}
        >
          {[360, 390, 768, 1280].map((w) => (
            <button
              key={w}
              type="button"
              aria-pressed={width === w}
              onClick={() => setWidth(w)}
              style={{
                padding: 10,
                borderRadius: 8,
                background: width === w ? "#171717" : "white",
                color: width === w ? "white" : "#171717",
              }}
            >
              {w}px
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          Uses this browser’s draft. Nothing is reset.
        </span>
      </header>
      <div style={{ overflowX: "auto", paddingBottom: 16 }}>
        <iframe
          title="Workspace at selected viewport"
          src={src}
          style={{
            display: "block",
            marginInline: "auto",
            width,
            height: 844,
            border: 0,
            background: "white",
            boxShadow: "0 8px 35px #18203215",
            borderRadius: width < 600 ? 18 : 0,
          }}
        />
      </div>
    </main>
  );
}
