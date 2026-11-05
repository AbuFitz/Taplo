import { describe, expect, it } from "vitest";
import { FIXTURES } from "@/features/themes/fixtures";
import {
  captureWorkspace,
  parseWorkspace,
  WORKSPACE_MAX_BYTES,
} from "./workspace";

const fixture = FIXTURES[0];
export const workspaceFixture = () =>
  captureWorkspace({
    content: structuredClone(fixture.content),
    page: structuredClone(fixture.page),
    step: "finish",
    slugEdited: true,
    setupDrafts: {
      services: [
        { id: "unfinished", name: "Next service", price: "12.", minutes: "" },
      ],
      planIntent: "pro",
    },
  });

describe("private workspace boundary", () => {
  it("round-trips every registered business and its detailed page without changing supplied records or layouts", () => {
    for (const sample of FIXTURES) {
      const snapshot = captureWorkspace({
        content: sample.content,
        page: sample.page,
        step: "finish",
        slugEdited: true,
      });
      expect(parseWorkspace(JSON.parse(JSON.stringify(snapshot)))).toEqual(
        snapshot,
      );
      expect(snapshot.page).toEqual(sample.page);
    }
  });
  it("preserves unfinished price text independently of real offers and excludes account, publication and billing authority", () => {
    const snapshot = workspaceFixture();
    expect(snapshot.progress.setupDrafts?.services?.[0].price).toBe("12.");
    expect(() => parseWorkspace({ ...snapshot, plan: "business" })).toThrow();
    expect(() =>
      parseWorkspace({ ...snapshot, published: { at: "now" } }),
    ).toThrow();
    expect(() =>
      parseWorkspace({ ...snapshot, userId: "another-user" }),
    ).toThrow();
  });
  it("rejects unsupported nested fields rather than silently deleting customisation", () => {
    const snapshot = workspaceFixture();
    expect(() =>
      parseWorkspace({
        ...snapshot,
        page: { ...snapshot.page, newLayout: true },
      }),
    ).toThrow("unsupported_field");
    expect(() =>
      parseWorkspace({
        ...snapshot,
        content: {
          ...snapshot.content,
          identity: { ...snapshot.content.identity, unknownLogoSetting: true },
        },
      }),
    ).toThrow("unsupported_field");
  });
  it("rejects duplicate record IDs and widget IDs without rewriting references", () => {
    const snapshot = workspaceFixture();
    snapshot.page.widgets.push(structuredClone(snapshot.page.widgets[0]));
    expect(() => parseWorkspace(snapshot)).toThrow("duplicate_ids");
    const records = workspaceFixture();
    records.content.services.push(structuredClone(records.content.services[0]));
    expect(() => parseWorkspace(records)).toThrow("duplicate_ids");
  });
  it("limits the whole snapshot, not just individual image fields", () => {
    const snapshot = workspaceFixture();
    snapshot.page.widgets[0].settings.extra = "x".repeat(WORKSPACE_MAX_BYTES);
    expect(() => parseWorkspace(snapshot)).toThrow("too_large");
  });

  it("rejects excessively deep structures before recursive schema and receipt work", () => {
    const snapshot = workspaceFixture();
    let value: unknown = "leaf";
    for (let n = 0; n < 40; n++) value = { nested: value };
    snapshot.page.widgets[0].settings.extra = value;
    expect(() => parseWorkspace(snapshot)).toThrow("too_complex");
  });

  it("does not turn an invalid business time zone into an implicit UK operating schedule", () => {
    const snapshot = workspaceFixture();
    snapshot.content.location.timezone = "Wrong/Zone";
    expect(() => parseWorkspace(snapshot)).toThrow("invalid_timezone");
  });
});
