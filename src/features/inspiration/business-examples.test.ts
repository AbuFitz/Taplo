import { expect, it } from "vitest";
import { EXAMPLES, bySlug, describe } from "./examples";
import { exampleStart } from "./suggest";
it("lists both real businesses in their relevant inspiration categories", () => {
  for (const [slug, industry] of [
    ["fixnowmechanics", "motoring"],
    ["brightlearn", "learning"],
  ]) {
    const e = bySlug(slug)!;
    expect(EXAMPLES).toContain(e);
    expect(e.industry).toBe(industry);
    expect(describe(e).content).toContain(
      slug === "brightlearn" ? "Price menu" : "Services",
    );
  }
});
it("adopting FixNow preserves its layout but never its business links or record references", () => {
  const start = exampleStart("fixnowmechanics")!;
  expect(start.overrides.header?.layout).toBe("centered");
  expect(
    start.widgets.find((w) => w.type === "serviceList")?.settings.variant,
  ).toBe("compact");
  for (const w of start.widgets) {
    if (w.type === "link")
      expect(w.settings).toMatchObject({ url: "", label: "Add a link" });
    expect(w.settings.serviceId).toBeUndefined();
    expect(w.settings.serviceIds).toBeUndefined();
    expect(w.appearance.thumbnail).toBeUndefined();
  }
  expect(JSON.stringify(start.widgets)).not.toMatch(
    /fixnowmechanics\.co\.uk|FixNow on Google|FixNow website/,
  );
});
