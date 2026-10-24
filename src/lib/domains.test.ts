import { describe, it, expect } from "vitest";
import { businessAddress, dashboardDestination } from "./domains";
describe("confirmed host separation",()=>{
  it("uses the app host from the public main and UK hosts",()=>{
    for(const host of ["mytaplo.com","www.mytaplo.com","taplo.co.uk"]) expect(dashboardDestination(host)).toBe("https://app.mytaplo.com");
  });
  it("retains working local and preview dashboards",()=>{
    for(const host of ["localhost","taplo-lilac.vercel.app","","unrelated.example"]) expect(dashboardDestination(host)).toBe("/dashboard");
  });
  it("renders the owner-confirmed public business path",()=>{
    expect(businessAddress("brightlearn")).toBe("mytaplo.com/brightlearn");
  });
});
