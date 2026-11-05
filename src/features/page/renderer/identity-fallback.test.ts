import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProfileMark } from "./ProfileMark";
import { TeamMembers, type TeamMemberData } from "../widgets/TeamClient";

const person: TeamMemberData = { id: "sam", name: "Sam Ellis", role: "Barber", summary: "Cuts and styling", subjects: [], credentials: [], services: [], bookable: false };

describe("supplied identity and missing imagery", () => {
  it("does not manufacture a profile mark from the business name", () => {
    for (const shape of ["circle", "rounded", "square", "logo", "none"] as const)
      expect(renderToStaticMarkup(createElement(ProfileMark, { name: "Sam's Studio", shape }))).toBe("");
  });
  it("preserves a supplied transparent logo and its accessible description", () => {
    const html = renderToStaticMarkup(createElement(ProfileMark, { name: "Sam's Studio", shape: "logo", image: { src: "/taplo-demo/station-road-mark.svg", alt: "Sam's Studio mark", width: 300, height: 100 } }));
    expect(html).toContain('class="tp-logo"');
    expect(html).toContain('alt="Sam&#x27;s Studio mark"');
    expect(html).not.toContain('class="tp-avatar"');
  });
  it.each(["list", "grid", "swipe", "avatars"] as const)("keeps a named, actionable team member in %s without fabricated initials or empty portraits", (variant) => {
    const html = renderToStaticMarkup(createElement(TeamMembers, { members: [person], variant }));
    expect(html).toContain("Sam Ellis");
    expect(html).toContain("View profile");
    expect(html).not.toContain('class="tp-portrait');
    expect(html).not.toContain(">SE<");
    expect(html).not.toContain("<img");
  });
  it("retains real supplied portraits alongside text-led people", () => {
    const html = renderToStaticMarkup(createElement(TeamMembers, { members: [person, { ...person, id: "lee", name: "Lee Morgan", photo: { src: "https://images.taplo.test/lee.png", alt: "Lee in the studio" } }], variant: "list" }));
    expect((html.match(/class="tp-portrait /g) ?? []).length).toBe(1);
    expect(html).toContain('alt="Lee in the studio"');
    expect(html).toContain("Sam Ellis");
  });
});
