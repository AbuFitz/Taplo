import { describe, expect, it } from "vitest";
import {
  serviceRowErrors,
  serviceRowValid,
  serviceRowEmpty,
} from "./setup-service";
const row = { id: "svc_test", name: "Haircut", price: "22.50", minutes: "30" };
describe("first service detail validation", () => {
  it.each(["0", "1441", "9999", "1.5", "-30", "NaN"])(
    "does not silently accept or rewrite %s minutes",
    (minutes) => {
      expect(serviceRowValid({ ...row, minutes })).toBe(false);
      expect(serviceRowErrors({ ...row, minutes }).minutes).toBeTruthy();
    },
  );
  it("allows an unfinished empty row and an optional duration", () => {
    expect(serviceRowEmpty({ ...row, name: "", price: "", minutes: "" })).toBe(
      true,
    );
    expect(serviceRowValid({ ...row, minutes: "" })).toBe(true);
    expect(serviceRowValid({ ...row, minutes: "1440" })).toBe(true);
  });
  it("requires a deliberate price except when quote or free is selected", () => {
    expect(serviceRowValid({ ...row, price: "" })).toBe(false);
    expect(serviceRowValid({ ...row, price: "", priceMode: "quote" })).toBe(
      true,
    );
    expect(serviceRowValid({ ...row, price: "", priceMode: "free" })).toBe(
      true,
    );
    expect(serviceRowValid({ ...row, price: "22.999" })).toBe(false);
  });
});
