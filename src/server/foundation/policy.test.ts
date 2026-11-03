import { describe, expect, it } from "vitest";
import { authorise, type Membership, type Principal } from "./policy";
import { validateInput } from "./contracts";
const principal: Principal = { id: "usr_owner123", audience: "merchant", assurance: "aal1" };
const member: Membership = { userId: principal.id, businessId: "biz_one12345", role: "owner", status: "active", locationIds: [], resourceIds: [] };
const target = { businessId: member.businessId };
describe("3.0 authority", () => {
 it("never grants tenant access merely because the role is owner", () => { expect(() => authorise(principal,member,"page.publish",{businessId:"biz_other123"})).toThrow("NOT_FOUND_OR_NOT_PERMITTED"); });
 it("revokes access immediately when membership changes", () => { expect(() => authorise(principal,{...member,status:"revoked"},"page.publish",target)).toThrow(); });
 it("does not turn merchant ownership into workforce authority", () => { expect(() => authorise(principal,member,"console.case.read",target)).toThrow("FORBIDDEN"); });
 it("never turns a customer session into merchant authority even with a matching membership", () => { expect(() => authorise({...principal,audience:"customer"},member,"page.publish",target)).toThrow("FORBIDDEN"); });
 it("requires explicit permitted field projection even for an owner", () => { expect(() => authorise(principal,member,"business.profile.manage",{...target,fields:["bank_account"],allowedFields:["display_name"]})).toThrow("FORBIDDEN"); });
 it("keeps personal work scoped to its principal", () => { expect(() => authorise(principal,{...member,role:"practitioner"},"own_work.read",{...target,subjectUserId:"usr_other123"})).toThrow(); });
 it("requires current step-up for consequential actions", () => { expect(() => authorise(principal,member,"money.policy.manage",{...target,requiresStepUp:true})).toThrow("VERIFICATION_REQUIRED"); expect(() => authorise({...principal,assurance:"aal2",stepUpAt:1000},member,"money.policy.manage",{...target,requiresStepUp:true},302000)).toThrow(); });
 it("enforces assigned resource scope independently of the action preset", () => { expect(() => authorise(principal,{...member,role:"practitioner",resourceIds:["res_mine1234"]},"assigned_work.update",{...target,resourceId:"res_other123"})).toThrow(); });
 it("validates canonical inputs and rejects unexpected client authority", () => { expect(() => validateInput("UpsertOnboardingDraft",{expected_version:0,display_name:"Maker",business_id:member.businessId})).toThrow("INVALID_INPUT"); expect(validateInput("UpsertOnboardingDraft",{expected_version:0,display_name:"Maker"})).toEqual({expected_version:0,display_name:"Maker"}); });
});
