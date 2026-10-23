import { afterAll, beforeAll, describe, expect, it } from "vitest"
import type { Pool } from "pg"
import { TEST_DB_URL, as, createCleanDatabase } from "./db"
import { getAvailability } from "../../src/features/booking/availability"
import { localToInstant } from "../../src/features/booking/time"
import { schedulingConfig, type SchedulingConfig } from "../../src/features/booking/types"

const U1 = "00000000-0000-4000-8000-0000000000a1"
const U2 = "00000000-0000-4000-8000-0000000000a2"
const TZ = "Europe/London"
const hours = (w: { start: string; end: string }[]) => ({ mon: w, tue: w, wed: w, thu: w, fri: w, sat: [], sun: [] })
const at = (d: string, t: string) => localToInstant(d, t, TZ)!

const SERVICES = [
  { id: "s1", name: "Cut", bookingMode: "instant", durationMinutes: 60, priceMode: "fixed", priceMinor: 3000, currency: "GBP" },
  { id: "s2", name: "Consultation", bookingMode: "request", durationMinutes: 30, priceMode: "free", currency: "GBP" },
  { id: "s3", name: "Ask us", bookingMode: "contact", durationMinutes: 30, priceMode: "quote", currency: "GBP" },
  { id: "s4", name: "Class", bookingMode: "instant", durationMinutes: 60, priceMode: "fixed", priceMinor: 1000, currency: "GBP" },
]
const STAFF = [{ id: "a", slug: "a", name: "Alex", serviceIds: null }, { id: "b", slug: "b", name: "Bea", serviceIds: ["s1"] }]

const config = (over: Partial<SchedulingConfig> = {}): SchedulingConfig => schedulingConfig.parse({
  timezone: TZ, rules: { minNoticeMinutes: 60, slotIntervalMinutes: 30, maxAdvanceDays: 120, bufferAfterMinutes: 0, pendingExpiryHours: 48, holdMinutes: 10, cancelUntilHours: 24 },
  staff: [{ staffId: "a", hours: hours([{ start: "09:00", end: "13:00" }, { start: "14:00", end: "17:00" }]) }, { staffId: "b", hours: hours([{ start: "10:00", end: "15:00" }]) }],
  ...over,
})

describe.skipIf(!TEST_DB_URL)("booking (real Postgres)", () => {
  let pool: Pool
  let drop: () => Promise<void>
  let biz: string
  let n = 0
  const key = () => `key-${Date.now()}-${++n}-${Math.random().toString(36).slice(2, 8)}`
  const setNow = async (iso: string) => { await pool.query("delete from public.taplo_test_clock"); await pool.query("insert into public.taplo_test_clock (t) values ($1)", [iso]) }
  const saveConfig = (c: SchedulingConfig) => as(pool, { sub: U1 }, (q) => q("select public.save_scheduling_settings($1, $2::jsonb)", [biz, JSON.stringify(c)]))
  const book = (o: { service?: string; staff?: string | null; start: number; mode?: string; key?: string; customer?: object }) =>
    as(pool, "anon", async (q) => (await q("select public.create_booking($1,$2,$3,$4,$5::jsonb,$6,$7) as r", [biz, o.service ?? "s1", o.staff ?? null, new Date(o.start).toISOString(), JSON.stringify(o.customer ?? { name: "Sam", email: "sam@example.com" }), o.mode ?? "instant", o.key ?? key()])).rows[0].r as any)
  const reset = async () => { await pool.query("delete from public.bookings"); await pool.query("delete from public.booking_holds") }

  beforeAll(async () => {
    ({ pool, drop } = await createCleanDatabase())
    for (const u of [U1, U2]) await pool.query("insert into auth.users (id, email) values ($1, $2)", [u, `${u}@example.com`])
    biz = await as(pool, { sub: U1 }, async (q) => (await q("select public.create_business('Northgate','northgate','plumber','Plumber') as id")).rows[0].id as string)
    await pool.query("update public.businesses set timezone = $2 where id = $1", [biz, TZ])
    await pool.query("update public.profile_drafts set content = $2::jsonb, config = '{}'::jsonb where business_id = $1", [biz, JSON.stringify({ identity: { name: "Northgate", slug: "northgate" }, services: SERVICES, staff: STAFF })])
    await as(pool, { sub: U1 }, (q) => q("select public.publish_profile($1)", [biz]))
    await saveConfig(config())
    await setNow("2026-11-02T08:00:00Z") // Monday 08:00 GMT
  })
  afterAll(async () => drop?.())

  describe("the server and the availability engine agree", () => {
    const cases: [string, SchedulingConfig][] = [
      ["weekly hours with a lunch gap", config()],
      ["buffers and a longer interval", config({ rules: { ...config().rules, bufferAfterMinutes: 15, slotIntervalMinutes: 60 } })],
      ["a closed day and special hours", config({ exceptions: [{ id: "x", date: "2026-11-03", staffId: null, windows: [] }, { id: "y", date: "2026-11-04", staffId: "a", windows: [{ start: "12:00", end: "15:30" }] }] })],
      ["blocked time", config({ blocks: [{ id: "b", staffId: "a", startsAt: at("2026-11-05", "10:00"), endsAt: at("2026-11-05", "12:00"), reason: "Training" }] })],
      ["minimum notice of a day", config({ rules: { ...config().rules, minNoticeMinutes: 24 * 60 } })],
    ]
    for (const [name, c] of cases) {
      it(`${name}: every offered start is accepted and nothing else is`, async () => {
        await reset(); await saveConfig(c)
        const ts = getAvailability({ now: Date.UTC(2026, 10, 2, 8), config: c, service: { id: "s1", durationMinutes: 60 }, eligible: ["a", "b"], bookings: [], holds: [], fromDate: "2026-11-02", days: 7 })
        const offered = new Map<string, Set<number>>()
        for (const d of ts) for (const s of d.slots) for (const sid of s.staffIds) { if (!offered.has(sid)) offered.set(sid, new Set()); offered.get(sid)!.add(s.startsAt) }
        for (const sid of ["a", "b"]) {
          const accepted = new Set<number>()
          for (let t = at("2026-11-02", "00:00"); t < at("2026-11-09", "00:00"); t += 15 * 60000) {
            const r = await pool.query("select public.slot_problem($1,'s1',$2,$3) as p", [biz, sid, new Date(t).toISOString()])
            if (r.rows[0].p === null) accepted.add(t)
          }
          expect([...accepted].sort()).toEqual([...(offered.get(sid) ?? new Set<number>())].sort())
        }
      })
    }
    it("also across the clocks-forward day", async () => {
      const c = schedulingConfig.parse({ timezone: TZ, rules: { minNoticeMinutes: 0, slotIntervalMinutes: 60, maxAdvanceDays: 400 }, staff: [{ staffId: "a", hours: { sun: [{ start: "00:00", end: "06:00" }] } }, { staffId: "b", hours: {} }] })
      await reset(); await saveConfig(c); await setNow("2026-03-01T08:00:00Z")
      const ts = getAvailability({ now: Date.UTC(2026, 2, 1, 8), config: c, service: { id: "s1", durationMinutes: 60 }, eligible: ["a"], bookings: [], holds: [], fromDate: "2026-03-29", days: 1 })
      const want = ts[0]!.slots.map((s) => s.startsAt)
      expect(want).toHaveLength(5)
      const got: number[] = []
      for (let t = at("2026-03-29", "00:00"); t < at("2026-03-30", "00:00"); t += 15 * 60000) if ((await pool.query("select public.slot_problem($1,'s1','a',$2) as p", [biz, new Date(t).toISOString()])).rows[0].p === null) got.push(t)
      expect(got).toEqual(want)
      await setNow("2026-11-02T08:00:00Z"); await saveConfig(config())
    })
  })

  describe("placing bookings", () => {
    const t = () => at("2026-11-03", "10:00")
    it("an instant service is confirmed, a request service waits, and the price comes from the service", async () => {
      await reset()
      const a = await book({ start: t(), staff: "a" })
      expect(a.ok).toBe(true); expect(a.booking.status).toBe("confirmed"); expect(a.booking.price_label).toBe("£30.00")
      const b = await book({ service: "s2", start: at("2026-11-03", "11:00"), staff: "a", mode: "instant" }) // the client cannot upgrade a request service
      expect(b.ok).toBe(true); expect(b.booking.status).toBe("pending"); expect(new Date(b.booking.expires_at).getTime() - Date.UTC(2026, 10, 2, 8)).toBe(48 * 3600000)
    })
    it("contact-only services cannot be booked online, and unknown or ineligible combinations are refused", async () => {
      await reset()
      expect((await book({ service: "s3", start: t(), staff: "a" })).ok).toBe(false)
      expect((await book({ service: "s2", start: t(), staff: "b" })).ok).toBe(false) // Bea only does s1
      expect((await book({ service: "nope", start: t(), staff: "a" })).ok).toBe(false)
    })
    it("'anyone' assigns the first free person in order; a second customer gets the next; a third is refused", async () => {
      await reset()
      const r1 = await book({ start: t() }); const r2 = await book({ start: t() }); const r3 = await book({ start: t() })
      expect([r1.booking.staff_key, r2.booking.staff_key]).toEqual(["a", "b"])
      expect(r3.ok).toBe(false); expect(r3.code).toBe("slot_unavailable")
    })
    it("a retry with the same key returns the same booking and writes nothing", async () => {
      await reset()
      const k = key()
      const a = await book({ start: t(), staff: "a", key: k }); const b = await book({ start: t(), staff: "a", key: k })
      expect(b.replay).toBe(true); expect(b.booking.id).toBe(a.booking.id)
      expect((await pool.query("select count(*)::int c from public.bookings")).rows[0].c).toBe(1)
    })
    it("twelve customers racing for one slot: exactly one wins and nobody sees a server error", async () => {
      await reset()
      const out = await Promise.all(Array.from({ length: 12 }, () => book({ start: at("2026-11-03", "14:00"), staff: "a" })))
      expect(out.filter((r) => r.ok)).toHaveLength(1)
      expect(out.filter((r) => !r.ok).every((r) => r.code === "slot_unavailable")).toBe(true)
      expect((await pool.query("select count(*)::int c from public.bookings where status='confirmed'")).rows[0].c).toBe(1)
    })
    it("racing for 'anyone' with two people available fills both and refuses the rest", async () => {
      await reset()
      const out = await Promise.all(Array.from({ length: 8 }, () => book({ start: at("2026-11-03", "11:00") })))
      expect(out.filter((r) => r.ok)).toHaveLength(2)
    })
    it("capacity lets a class share one start, then refuses", async () => {
      await reset(); await saveConfig(config({ serviceOverrides: [{ serviceId: "s4", capacity: 3 }] }))
      const out = await Promise.all(Array.from({ length: 6 }, () => book({ service: "s4", start: at("2026-11-03", "11:00"), staff: "a" })))
      expect(out.filter((r) => r.ok)).toHaveLength(3)
      await saveConfig(config())
    })
    it("the exclusion constraint is a backstop even for a direct insert that skipped the checks", async () => {
      await reset()
      await book({ start: t(), staff: "a" })
      const s = new Date(t()).toISOString(); const e = new Date(t() + 3600000).toISOString()
      await expect(pool.query("insert into public.bookings (business_id,service_id,service_name,staff_key,starts_at,ends_at,block_start,block_end,status,mode,customer,duration_minutes,idempotency_key) values ($1,'s1','Cut','a',$2,$3,$2,$3,'confirmed','instant','{}',60,$4)", [biz, s, e, key()])).rejects.toThrow(/bookings_no_overlap/)
    })
    it("validates customer details on the server too", async () => {
      await reset()
      expect((await book({ start: t(), staff: "a", customer: { name: "Sam" } })).code).toBe("invalid")
      expect((await book({ start: t(), staff: "a", customer: { email: "x@example.com" } })).code).toBe("invalid")
    })
    it("refuses past, off-grid and out-of-hours times that a stale screen might still send", async () => {
      await reset()
      for (const start of [at("2026-11-01", "10:00"), at("2026-11-03", "10:10"), at("2026-11-03", "20:00"), at("2026-11-07", "10:00")]) expect((await book({ start, staff: "a" })).ok).toBe(false)
    })
    it("an unanswered request expires on the server and frees the time", async () => {
      await reset()
      expect((await book({ service: "s2", start: t(), staff: "a" })).ok).toBe(true)
      expect((await book({ service: "s1", start: t(), staff: "a" })).ok).toBe(false)
      await setNow("2026-11-04T09:00:00Z") // 49 hours later (still before the slot the following week is not needed: use a later slot)
      const later = await book({ service: "s1", start: at("2026-11-05", "10:00"), staff: "a" })
      expect(later.ok).toBe(true)
      await setNow("2026-11-02T08:00:00Z")
    })
    it("a hold stops other customers until it expires, and is consumed by its own booking", async () => {
      await reset()
      const holder = `hold-${key()}`
      const h = await as(pool, "anon", async (q) => (await q("select public.hold_slot($1,'s1','a',$2,$3) as r", [biz, new Date(t()).toISOString(), holder])).rows[0].r as any)
      expect(h.ok).toBe(true)
      expect((await book({ start: t(), staff: "a" })).ok).toBe(false)
      expect((await book({ start: t(), staff: "a", key: holder })).ok).toBe(true)
      expect((await pool.query("select count(*)::int c from public.booking_holds")).rows[0].c).toBe(0)
    })
  })

  describe("owner and customer controls", () => {
    it("only members can change status; the allowed moves are enforced", async () => {
      await reset()
      const r = await book({ service: "s2", start: at("2026-11-03", "09:00"), staff: "a" })
      const id = r.booking.id
      await expect(as(pool, { sub: U2 }, (q) => q("select public.set_booking_status($1,'confirmed')", [id]))).rejects.toThrow(/forbidden/)
      expect(await as(pool, { sub: U1 }, async (q) => (await q("select public.set_booking_status($1,'confirmed') as r", [id])).rows[0].r)).toEqual({ ok: true })
      expect(await as(pool, { sub: U1 }, async (q) => (await q("select public.set_booking_status($1,'declined') as r", [id])).rows[0].r)).toMatchObject({ ok: false })
    })
    it("customer cancellation needs the token and respects the notice rule", async () => {
      await reset()
      const far = await book({ start: at("2026-11-10", "10:00"), staff: "a" })
      const bad = await as(pool, "anon", async (q) => (await q("select public.cancel_booking_by_token($1,'wrong') as r", [far.booking.id])).rows[0].r)
      expect(bad.code).toBe("not_found")
      const ok = await as(pool, "anon", async (q) => (await q("select public.cancel_booking_by_token($1,$2) as r", [far.booking.id, far.booking.manage_token])).rows[0].r)
      expect(ok.ok).toBe(true)
      const near = await book({ start: at("2026-11-03", "10:00"), staff: "a" }) // under 24h from the test clock? 26h: still allowed
      await setNow("2026-11-03T08:00:00Z")
      const late = await as(pool, "anon", async (q) => (await q("select public.cancel_booking_by_token($1,$2) as r", [near.booking.id, near.booking.manage_token])).rows[0].r)
      expect(late.code).toBe("too_late")
      await setNow("2026-11-02T08:00:00Z")
    })
    it("rescheduling is re-checked and the old time is freed", async () => {
      await reset()
      const b = await book({ start: at("2026-11-04", "10:00"), staff: "a" })
      const moved = await as(pool, { sub: U1 }, async (q) => (await q("select public.reschedule_booking($1,$2) as r", [b.booking.id, new Date(at("2026-11-04", "11:00")).toISOString()])).rows[0].r)
      expect(moved.ok).toBe(true)
      expect((await book({ start: at("2026-11-04", "10:00"), staff: "a" })).ok).toBe(true)
      const clash = await as(pool, { sub: U1 }, async (q) => (await q("select public.reschedule_booking($1,$2) as r", [b.booking.id, new Date(at("2026-11-04", "10:00")).toISOString()])).rows[0].r)
      expect(clash.ok).toBe(false)
    })
  })

  describe("enquiries and access", () => {
    it("an enquiry reserves nothing, is idempotent and needs a way to reply", async () => {
      const k = key()
      const call = (e?: string, p?: string, key_ = k) => as(pool, "anon", async (q) => (await q("select public.submit_enquiry($1,'Ana',$2,$3,'Do you do kids cuts?','s1',$4) as r", [biz, e ?? null, p ?? null, key_])).rows[0].r as any)
      expect((await call("ana@example.com")).ok).toBe(true)
      expect((await call("ana@example.com")).replay).toBe(true)
      expect((await call(undefined, undefined, key())).ok).toBe(false)
      expect((await pool.query("select count(*)::int c from public.enquiries")).rows[0].c).toBe(1)
    })
    it("anonymous visitors cannot read or write any scheduling table directly", async () => {
      for (const t of ["bookings", "enquiries", "scheduling_settings", "booking_holds"]) await expect(as(pool, "anon", (q) => q(`select * from public.${t}`))).rejects.toThrow(/permission denied/)
      await expect(as(pool, "anon", (q) => q("select public.slot_problem($1,'s1','a',now())", [biz]))).rejects.toThrow(/permission denied/)
    })
    it("other tenants cannot read this business's bookings", async () => {
      await reset(); await book({ start: at("2026-11-05", "10:00"), staff: "a" })
      expect((await as(pool, { sub: U2 }, (q) => q("select * from public.bookings"))).rows).toHaveLength(0)
      expect((await as(pool, { sub: U1 }, (q) => q("select * from public.bookings"))).rows.length).toBeGreaterThan(0)
    })
  })
})
