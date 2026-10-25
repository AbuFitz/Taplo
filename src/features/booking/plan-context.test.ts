import { describe, expect, it } from "vitest";
import { businessContentSchema } from "@/features/businesses/content";
import { PHYSIO } from "@/features/showcase/examples";
import { resolveEntitlements } from "@/features/subscriptions/entitlements";
import { buildPlanContext, eligibleStaff } from "./model";

describe("plan-aware public staff calendars", () => {
  it("limits Pro to three bookable people and keeps all source profiles", () => {
    const source = businessContentSchema.parse(PHYSIO);
    const person = source.staff[0]!;
    source.staff = Array.from({ length: 5 }, (_, i) => ({
      ...person,
      id: `person-${i}`,
      slug: `person-${i}`,
      name: `Person ${i}`,
      bookable: i !== 0,
      serviceIds: null,
    }));
    const pro = buildPlanContext(source, resolveEntitlements("pro"));
    expect(pro.staff.map((p) => p.id)).toEqual([
      "person-1",
      "person-2",
      "person-3",
    ]);
    expect(eligibleStaff(pro, pro.services[0]!)).toEqual([
      "person-1",
      "person-2",
      "person-3",
    ]);
    expect(source.staff).toHaveLength(5);
    expect(
      buildPlanContext(source, resolveEntitlements("business")).staff,
    ).toHaveLength(4);
  });
});
