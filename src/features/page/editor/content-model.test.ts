import { describe, expect, it } from "vitest";
import { FIXTURES } from "@/features/themes/fixtures";
import { newWidget } from "../starter";
import { summarise } from "./content-model";

describe("public-hours content summary", () => {
  it("counts opening days rather than split periods or closed records", () => {
    const business = structuredClone(FIXTURES[0]!.content);
    business.hours = [
      { day: "mon", opens: "09:00", closes: "12:00" },
      { day: "mon", opens: "13:00", closes: "17:00" },
      { day: "tue", opens: "10:00", closes: "14:00" },
      { day: "wed" },
      { day: "thu", opens: "17:00", closes: "09:00" },
    ];
    expect(summarise(newWidget("hours"), business, null).summary).toBe("Open 2 days a week");
    business.hours = business.hours.slice(0, 2);
    expect(summarise(newWidget("hours"), business, null).summary).toBe("Open 1 day a week");
  });
});
