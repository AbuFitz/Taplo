-- Booking and enquiries. The server is authoritative: every booking write re-checks the same rules the
-- application's availability engine (src/features/booking/availability.ts) uses, inside one transaction,
-- and an exclusion constraint makes overlapping bookings for one person impossible even if a check were missed.
-- tests/integration/booking.test.ts runs both and asserts that they agree.

create extension if not exists btree_gist;

-- ---------------------------------------------------------------- settings
-- One validated SchedulingConfig document per business: timezone, rules, weekly hours per person,
-- date exceptions, blocked time, per-service overrides. Shape is validated by the application (zod) and
-- read defensively here.
create table public.scheduling_settings (
  business_id uuid primary key references public.businesses (id) on delete cascade,
  config jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id)
);

-- Test clock. Empty in production, so `now()` is the real time. Only a superuser can write it.
create table public.taplo_test_clock (id boolean primary key default true check (id), t timestamptz not null);
create function public.taplo_now() returns timestamptz language sql stable security definer set search_path = '' as $$
  select coalesce((select t from public.taplo_test_clock limit 1), now())
$$;

-- ---------------------------------------------------------------- bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  service_id text not null,
  service_name text not null,
  staff_key text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  block_start timestamptz not null,
  block_end timestamptz not null,
  status text not null check (status in ('confirmed','pending','declined','cancelled','completed','no_show','expired')),
  mode text not null check (mode in ('instant','request')),
  customer jsonb not null,
  duration_minutes integer not null check (duration_minutes > 0),
  price_label text not null default '',
  capacity integer not null default 1 check (capacity >= 1),
  expires_at timestamptz,
  idempotency_key text not null check (char_length(idempotency_key) between 8 and 80),
  customer_timezone text,
  manage_token text not null default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_idempotent unique (business_id, idempotency_key),
  constraint bookings_time_order check (ends_at > starts_at and block_start <= starts_at and block_end >= ends_at),
  -- A person cannot hold two overlapping bookings. Applies to single-capacity services; capacity > 1 (classes)
  -- is enforced under an advisory lock in create_booking.
  constraint bookings_no_overlap exclude using gist (
    business_id with =, staff_key with =, tstzrange(block_start, block_end) with &&
  ) where (status in ('confirmed','pending') and capacity = 1)
);
create index bookings_business_start_idx on public.bookings (business_id, starts_at);

create table public.booking_holds (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  staff_key text not null default '',
  service_id text not null,
  block_start timestamptz not null,
  block_end timestamptz not null,
  expires_at timestamptz not null,
  holder_key text not null,
  created_at timestamptz not null default now(),
  unique (business_id, holder_key)
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  email text check (email is null or char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 32),
  message text not null check (char_length(message) between 5 and 1200),
  service_id text,
  status text not null default 'new' check (status in ('new','answered','archived')),
  idempotency_key text not null check (char_length(idempotency_key) between 8 and 80),
  created_at timestamptz not null default now(),
  constraint enquiries_contactable check (email is not null or phone is not null),
  constraint enquiries_idempotent unique (business_id, idempotency_key)
);
create index enquiries_business_idx on public.enquiries (business_id, created_at desc);

-- ================================================================ time helpers (mirror src/features/booking/time.ts)
create function public.tz_offset_minutes(p_t timestamptz, p_tz text) returns integer
language sql stable set search_path = '' as $$
  select (extract(epoch from ((p_t at time zone p_tz) - (p_t at time zone 'UTC'))) / 60)::integer
$$;

-- The instant a clock in p_tz reads p_date p_time, or null when that wall time does not exist (skipped hour).
-- When it occurs twice, the first occurrence.
create function public.local_to_instant(p_date date, p_time time, p_tz text) returns timestamptz
language plpgsql stable set search_path = '' as $$
declare naive timestamp := p_date + p_time; n_utc timestamptz := naive at time zone 'UTC'; off integer; t timestamptz; best timestamptz;
begin
  foreach off in array array[
    public.tz_offset_minutes(n_utc - interval '1 day', p_tz), public.tz_offset_minutes(n_utc, p_tz), public.tz_offset_minutes(n_utc + interval '1 day', p_tz)
  ] loop
    t := (naive - make_interval(mins => off)) at time zone 'UTC';
    if (t at time zone p_tz) = naive and (best is null or t < best) then best := t; end if;
  end loop;
  return best;
end $$;

-- A wall-clock window as instants. A start or end inside a skipped hour moves to the nearest real time inside the window.
create function public.window_instants(p_date date, p_start time, p_end time, p_tz text) returns tstzrange
language plpgsql stable set search_path = '' as $$
declare s timestamptz; e timestamptz; m integer; i integer;
begin
  s := public.local_to_instant(p_date, p_start, p_tz);
  if s is null then
    m := extract(hour from p_start) * 60 + extract(minute from p_start);
    for i in 1..180 loop
      m := m + 1; exit when m >= 1440;
      s := public.local_to_instant(p_date, make_time(m / 60, m % 60, 0), p_tz); exit when s is not null;
    end loop;
  end if;
  e := public.local_to_instant(p_date, p_end, p_tz);
  if e is null then
    m := extract(hour from p_end) * 60 + extract(minute from p_end);
    for i in 1..180 loop
      m := m - 1; exit when m < 0;
      e := public.local_to_instant(p_date, make_time(m / 60, m % 60, 0), p_tz); exit when e is not null;
    end loop;
  end if;
  if s is null or e is null or e <= s then return null; end if;
  return tstzrange(s, e, '[)');
end $$;

-- ================================================================ the slot check (internal)
-- Returns null when the start is bookable, else a reason code. Not granted to any client role.
create function public.slot_problem(
  p_business uuid, p_service text, p_staff text, p_start timestamptz, p_ignore uuid default null, p_hold_key text default null
) returns text
language plpgsql stable security definer set search_path = '' as $$
declare
  v_biz public.businesses; v_cfg jsonb; v_content jsonb; v_svc jsonb; v_staff jsonb;
  v_tz text; v_rules jsonb; v_dur integer; v_interval integer; v_notice integer; v_adv integer;
  v_bb integer; v_ba integer; v_cap integer; v_ov jsonb;
  v_date date; v_today date; v_key text; v_win jsonb; v_w tstzrange; v_hours jsonb; v_found boolean := false;
  v_end timestamptz; v_o0 timestamptz; v_o1 timestamptz; v_now timestamptz := public.taplo_now();
  dow text[] := array['sun','mon','tue','wed','thu','fri','sat'];
begin
  select * into v_biz from public.businesses where id = p_business;
  if v_biz is null or v_biz.status <> 'published' then return 'not_published'; end if;
  select config into v_cfg from public.scheduling_settings where business_id = p_business;
  if v_cfg is null then return 'not_configured'; end if;
  select content into v_content from public.profile_versions where business_id = p_business and version = v_biz.published_version;

  select s into v_svc from jsonb_array_elements(coalesce(v_content->'services', '[]'::jsonb)) s
    where s->>'id' = p_service and coalesce((s->>'archived')::boolean, false) = false limit 1;
  if v_svc is null then return 'unknown_service'; end if;
  if coalesce(v_svc->>'bookingMode', 'contact') not in ('instant','request') then return 'not_bookable_online'; end if;
  v_dur := (v_svc->>'durationMinutes')::integer;
  if v_dur is null or v_dur <= 0 then return 'no_duration'; end if;

  -- Eligibility. With a staff list, the person must exist and be allowed this service (serviceIds absent = all). Without one, the business itself ('').
  if jsonb_array_length(coalesce(v_content->'staff', '[]'::jsonb)) > 0 then
    select s into v_staff from jsonb_array_elements(v_content->'staff') s where s->>'id' = p_staff limit 1;
    if v_staff is null then return 'staff_not_eligible'; end if;
    if jsonb_typeof(v_staff->'serviceIds') = 'array' and not (v_staff->'serviceIds') ? p_service then return 'staff_not_eligible'; end if;
  elsif p_staff <> '' then return 'staff_not_eligible'; end if;

  v_tz := coalesce(v_cfg->>'timezone', v_biz.timezone);
  v_rules := coalesce(v_cfg->'rules', '{}'::jsonb);
  v_interval := coalesce((v_rules->>'slotIntervalMinutes')::integer, 15);
  v_notice := coalesce((v_rules->>'minNoticeMinutes')::integer, 120);
  v_adv := coalesce((v_rules->>'maxAdvanceDays')::integer, 60);
  select o into v_ov from jsonb_array_elements(coalesce(v_cfg->'serviceOverrides', '[]'::jsonb)) o where o->>'serviceId' = p_service limit 1;
  v_bb := coalesce((v_ov->>'bufferBeforeMinutes')::integer, (v_rules->>'bufferBeforeMinutes')::integer, 0);
  v_ba := coalesce((v_ov->>'bufferAfterMinutes')::integer, (v_rules->>'bufferAfterMinutes')::integer, 0);
  v_cap := coalesce((v_ov->>'capacity')::integer, 1);

  v_end := p_start + make_interval(mins => v_dur);
  v_date := (p_start at time zone v_tz)::date;
  v_today := (v_now at time zone v_tz)::date;
  if v_date < v_today then return 'past'; end if;
  if v_date - v_today > v_adv then return 'too_far'; end if;
  if p_start < v_now + make_interval(mins => v_notice) then return 'too_soon'; end if;

  -- Working windows: this person's date exception, else the business-wide one, else the weekly pattern.
  select e->'windows' into v_hours from jsonb_array_elements(coalesce(v_cfg->'exceptions', '[]'::jsonb)) e
    where e->>'date' = v_date::text and e->>'staffId' = p_staff limit 1;
  if v_hours is null then
    select e->'windows' into v_hours from jsonb_array_elements(coalesce(v_cfg->'exceptions', '[]'::jsonb)) e
      where e->>'date' = v_date::text and e->'staffId' = 'null'::jsonb limit 1;
  end if;
  if v_hours is null then
    select s->'hours'->(dow[extract(dow from v_date)::integer + 1]) into v_hours
      from jsonb_array_elements(coalesce(v_cfg->'staff', '[]'::jsonb)) s where s->>'staffId' = p_staff limit 1;
  end if;
  for v_win in select * from jsonb_array_elements(coalesce(v_hours, '[]'::jsonb)) loop
    v_w := public.window_instants(v_date, (v_win->>'start')::time, (v_win->>'end')::time, v_tz);
    if v_w is not null and p_start >= lower(v_w) and v_end <= upper(v_w)
       and mod((extract(epoch from p_start) - extract(epoch from lower(v_w)))::bigint, v_interval::bigint * 60) = 0 then
      v_found := true; exit;
    end if;
  end loop;
  if not v_found then return 'not_offered'; end if;

  if exists (
    select 1 from jsonb_array_elements(coalesce(v_cfg->'blocks', '[]'::jsonb)) b
    where (b->'staffId' = 'null'::jsonb or b->>'staffId' = p_staff)
      and p_start < to_timestamp((b->>'endsAt')::double precision / 1000) and to_timestamp((b->>'startsAt')::double precision / 1000) < v_end
  ) then return 'blocked'; end if;

  v_o0 := p_start - make_interval(mins => v_bb);
  v_o1 := v_end + make_interval(mins => v_ba);
  if v_cap > 1 then
    if (select count(*) from public.bookings b where b.business_id = p_business and b.staff_key = p_staff and b.service_id = p_service and b.starts_at = p_start
          and b.id is distinct from p_ignore and (b.status = 'confirmed' or (b.status = 'pending' and (b.expires_at is null or b.expires_at > v_now)))) >= v_cap then return 'full'; end if;
    if exists (select 1 from public.bookings b where b.business_id = p_business and b.staff_key = p_staff and b.id is distinct from p_ignore
          and not (b.service_id = p_service and b.starts_at = p_start)
          and (b.status = 'confirmed' or (b.status = 'pending' and (b.expires_at is null or b.expires_at > v_now)))
          and tstzrange(b.block_start, b.block_end) && tstzrange(v_o0, v_o1)) then return 'taken'; end if;
  elsif exists (select 1 from public.bookings b where b.business_id = p_business and b.staff_key = p_staff and b.id is distinct from p_ignore
          and (b.status = 'confirmed' or (b.status = 'pending' and (b.expires_at is null or b.expires_at > v_now)))
          and tstzrange(b.block_start, b.block_end) && tstzrange(v_o0, v_o1)) then return 'taken';
  end if;
  if exists (select 1 from public.booking_holds h where h.business_id = p_business and h.staff_key = p_staff and h.expires_at > v_now
          and h.holder_key is distinct from p_hold_key and tstzrange(h.block_start, h.block_end) && tstzrange(v_o0, v_o1)) then return 'held'; end if;
  return null;
end $$;

-- ================================================================ public writes
create function public.hold_slot(p_business uuid, p_service text, p_staff text, p_start timestamptz, p_holder text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_problem text; v_ids text[]; v_pick text; v_hold public.booking_holds; v_now timestamptz := public.taplo_now(); v_cfg jsonb; v_svc jsonb; v_dur integer; v_bb integer; v_ba integer; v_min integer;
begin
  if char_length(coalesce(p_holder, '')) < 8 then return jsonb_build_object('ok', false, 'code', 'invalid'); end if;
  select config into v_cfg from public.scheduling_settings where business_id = p_business;
  if v_cfg is null then return jsonb_build_object('ok', false, 'code', 'not_configured'); end if;
  v_pick := public.pick_staff(p_business, p_service, p_staff, p_start, p_holder, null);
  if v_pick is null then return jsonb_build_object('ok', false, 'code', 'slot_unavailable'); end if;
  perform pg_advisory_xact_lock(hashtextextended(p_business::text || ':' || v_pick, 0));
  delete from public.booking_holds where business_id = p_business and (expires_at <= v_now or holder_key = p_holder);
  v_problem := public.slot_problem(p_business, p_service, v_pick, p_start, null, p_holder);
  if v_problem is not null then return jsonb_build_object('ok', false, 'code', 'slot_unavailable', 'reason', v_problem); end if;
  select s into v_svc from jsonb_array_elements((select content->'services' from public.profile_versions v join public.businesses b on b.id = v.business_id and b.published_version = v.version where v.business_id = p_business)) s where s->>'id' = p_service;
  v_dur := (v_svc->>'durationMinutes')::integer;
  v_bb := coalesce((select (o->>'bufferBeforeMinutes')::integer from jsonb_array_elements(coalesce(v_cfg->'serviceOverrides','[]'::jsonb)) o where o->>'serviceId' = p_service), (v_cfg->'rules'->>'bufferBeforeMinutes')::integer, 0);
  v_ba := coalesce((select (o->>'bufferAfterMinutes')::integer from jsonb_array_elements(coalesce(v_cfg->'serviceOverrides','[]'::jsonb)) o where o->>'serviceId' = p_service), (v_cfg->'rules'->>'bufferAfterMinutes')::integer, 0);
  v_min := coalesce((v_cfg->'rules'->>'holdMinutes')::integer, 10);
  insert into public.booking_holds (business_id, staff_key, service_id, block_start, block_end, expires_at, holder_key)
    values (p_business, v_pick, p_service, p_start - make_interval(mins => v_bb), p_start + make_interval(mins => v_dur + v_ba), v_now + make_interval(mins => v_min), p_holder)
    returning * into v_hold;
  return jsonb_build_object('ok', true, 'holdId', v_hold.id, 'expiresAt', v_hold.expires_at, 'staffId', v_pick);
end $$;

-- The first eligible person (in the business's own order) who can take the start, or p_staff when one was chosen.
create function public.pick_staff(p_business uuid, p_service text, p_staff text, p_start timestamptz, p_hold_key text, p_ignore uuid)
returns text language plpgsql stable security definer set search_path = '' as $$
declare v_content jsonb; v_s jsonb;
begin
  if p_staff is not null then
    return case when public.slot_problem(p_business, p_service, p_staff, p_start, p_ignore, p_hold_key) is null then p_staff end;
  end if;
  select pv.content into v_content from public.profile_versions pv join public.businesses b on b.id = pv.business_id and b.published_version = pv.version where pv.business_id = p_business;
  if jsonb_array_length(coalesce(v_content->'staff', '[]'::jsonb)) = 0 then
    return case when public.slot_problem(p_business, p_service, '', p_start, p_ignore, p_hold_key) is null then '' end;
  end if;
  for v_s in select * from jsonb_array_elements(v_content->'staff') loop
    if public.slot_problem(p_business, p_service, v_s->>'id', p_start, p_ignore, p_hold_key) is null then return v_s->>'id'; end if;
  end loop;
  return null;
end $$;

create function public.create_booking(
  p_business uuid, p_service text, p_staff text, p_start timestamptz, p_customer jsonb, p_mode text, p_key text, p_customer_tz text default null
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_existing public.bookings; v_pick text; v_problem text; v_now timestamptz := public.taplo_now();
  v_cfg jsonb; v_content jsonb; v_svc jsonb; v_dur integer; v_bb integer; v_ba integer; v_cap integer; v_status text; v_row public.bookings; v_expiry integer; v_svc_mode text; v_name text;
begin
  if char_length(coalesce(p_key, '')) < 8 then return jsonb_build_object('ok', false, 'code', 'invalid', 'message', 'A retry key is required'); end if;
  if p_mode not in ('instant','request') then return jsonb_build_object('ok', false, 'code', 'invalid'); end if;
  -- Customer details are re-validated here: a name, and a way to reach them.
  v_name := btrim(coalesce(p_customer->>'name', ''));
  if v_name = '' or char_length(v_name) > 120
     or (btrim(coalesce(p_customer->>'email','')) = '' and btrim(coalesce(p_customer->>'phone','')) = '') then
    return jsonb_build_object('ok', false, 'code', 'invalid', 'message', 'Enter your name and an email address or phone number');
  end if;

  -- Idempotent retry: same key returns the same booking and writes nothing.
  select * into v_existing from public.bookings where business_id = p_business and idempotency_key = p_key;
  if found then
    return jsonb_build_object('ok', true, 'replay', true, 'booking', to_jsonb(v_existing) - 'manage_token' || jsonb_build_object('manage_token', v_existing.manage_token));
  end if;

  -- Serialise writers for this business's people so two customers cannot both pass the check.
  perform pg_advisory_xact_lock(hashtextextended(p_business::text, 0));
  update public.bookings set status = 'expired', updated_at = v_now,
         history = history || jsonb_build_array(jsonb_build_object('at', (extract(epoch from v_now) * 1000)::bigint, 'status', 'expired', 'note', 'No reply in time'))
   where business_id = p_business and status = 'pending' and expires_at is not null and expires_at <= v_now;
  delete from public.booking_holds where business_id = p_business and expires_at <= v_now;

  v_pick := public.pick_staff(p_business, p_service, p_staff, p_start, p_key, null);
  if v_pick is null then
    return jsonb_build_object('ok', false, 'code', 'slot_unavailable', 'message', 'That time has just been taken. Pick another time; nothing you typed is lost.', 'reason', coalesce(public.slot_problem(p_business, p_service, coalesce(p_staff, ''), p_start, null, p_key), 'taken'));
  end if;

  select config into v_cfg from public.scheduling_settings where business_id = p_business;
  select pv.content into v_content from public.profile_versions pv join public.businesses b on b.id = pv.business_id and b.published_version = pv.version where pv.business_id = p_business;
  select s into v_svc from jsonb_array_elements(v_content->'services') s where s->>'id' = p_service;
  v_svc_mode := v_svc->>'bookingMode';
  -- The service decides: a client cannot turn a request-only service into an instant booking, or the reverse.
  p_mode := v_svc_mode;
  v_dur := (v_svc->>'durationMinutes')::integer;
  v_bb := coalesce((select (o->>'bufferBeforeMinutes')::integer from jsonb_array_elements(coalesce(v_cfg->'serviceOverrides','[]'::jsonb)) o where o->>'serviceId' = p_service), (v_cfg->'rules'->>'bufferBeforeMinutes')::integer, 0);
  v_ba := coalesce((select (o->>'bufferAfterMinutes')::integer from jsonb_array_elements(coalesce(v_cfg->'serviceOverrides','[]'::jsonb)) o where o->>'serviceId' = p_service), (v_cfg->'rules'->>'bufferAfterMinutes')::integer, 0);
  v_cap := coalesce((select (o->>'capacity')::integer from jsonb_array_elements(coalesce(v_cfg->'serviceOverrides','[]'::jsonb)) o where o->>'serviceId' = p_service), 1);
  v_expiry := coalesce((v_cfg->'rules'->>'pendingExpiryHours')::integer, 48);
  v_status := case p_mode when 'instant' then 'confirmed' else 'pending' end;

  begin
    insert into public.bookings (business_id, service_id, service_name, staff_key, starts_at, ends_at, block_start, block_end, status, mode, customer, duration_minutes, price_label, capacity, expires_at, idempotency_key, customer_timezone, history)
    values (p_business, p_service, coalesce(v_svc->>'name', p_service), v_pick, p_start, p_start + make_interval(mins => v_dur),
            p_start - make_interval(mins => v_bb), p_start + make_interval(mins => v_dur + v_ba), v_status, p_mode,
            jsonb_build_object('name', v_name, 'email', nullif(btrim(coalesce(p_customer->>'email','')), ''), 'phone', nullif(btrim(coalesce(p_customer->>'phone','')), ''), 'notes', nullif(btrim(coalesce(p_customer->>'notes','')), '')),
            v_dur, case v_svc->>'priceMode' when 'fixed' then '£' || trim(to_char((v_svc->>'priceMinor')::numeric / 100, 'FM999999990.00')) when 'from' then 'From £' || trim(to_char((v_svc->>'priceMinor')::numeric / 100, 'FM999999990.00')) when 'free' then 'Free' else 'Quote on request' end, v_cap,
            case when v_status = 'pending' then v_now + make_interval(hours => v_expiry) end, p_key, p_customer_tz,
            jsonb_build_array(jsonb_build_object('at', (extract(epoch from v_now) * 1000)::bigint, 'status', v_status)))
    returning * into v_row;
  exception when exclusion_violation then
    return jsonb_build_object('ok', false, 'code', 'slot_unavailable', 'message', 'That time has just been taken. Pick another time; nothing you typed is lost.', 'reason', 'taken');
  end;
  delete from public.booking_holds where business_id = p_business and holder_key = p_key;
  return jsonb_build_object('ok', true, 'replay', false, 'booking', to_jsonb(v_row));
end $$;

create function public.submit_enquiry(p_business uuid, p_name text, p_email text, p_phone text, p_message text, p_service text, p_key text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_row public.enquiries; v_prior public.enquiries;
begin
  if not exists (select 1 from public.businesses where id = p_business and status = 'published') then return jsonb_build_object('ok', false, 'code', 'not_published'); end if;
  if char_length(coalesce(p_key, '')) < 8 then return jsonb_build_object('ok', false, 'code', 'invalid'); end if;
  select * into v_prior from public.enquiries where business_id = p_business and idempotency_key = p_key;
  if found then return jsonb_build_object('ok', true, 'replay', true, 'id', v_prior.id); end if;
  if btrim(coalesce(p_name, '')) = '' or char_length(btrim(coalesce(p_message, ''))) < 5 or (btrim(coalesce(p_email, '')) = '' and btrim(coalesce(p_phone, '')) = '') then
    return jsonb_build_object('ok', false, 'code', 'invalid');
  end if;
  insert into public.enquiries (business_id, name, email, phone, message, service_id, idempotency_key)
    values (p_business, btrim(p_name), nullif(btrim(coalesce(p_email,'')), ''), nullif(btrim(coalesce(p_phone,'')), ''), btrim(p_message), p_service, p_key)
    returning * into v_row;
  return jsonb_build_object('ok', true, 'replay', false, 'id', v_row.id);
end $$;

-- A customer cancels from their confirmation using the secret token, within the cancellation rule.
create function public.cancel_booking_by_token(p_booking uuid, p_token text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_b public.bookings; v_cfg jsonb; v_hours integer; v_now timestamptz := public.taplo_now();
begin
  select * into v_b from public.bookings where id = p_booking and manage_token = p_token;
  if v_b is null then return jsonb_build_object('ok', false, 'code', 'not_found'); end if;
  if v_b.status not in ('confirmed','pending') then return jsonb_build_object('ok', false, 'code', 'closed'); end if;
  select config into v_cfg from public.scheduling_settings where business_id = v_b.business_id;
  v_hours := coalesce((v_cfg->'rules'->>'cancelUntilHours')::integer, 24);
  if v_b.starts_at <= v_now or (v_b.status = 'confirmed' and v_b.starts_at < v_now + make_interval(hours => v_hours)) then
    return jsonb_build_object('ok', false, 'code', 'too_late', 'hours', v_hours);
  end if;
  update public.bookings set status = 'cancelled', updated_at = v_now,
    history = history || jsonb_build_array(jsonb_build_object('at', (extract(epoch from v_now) * 1000)::bigint, 'status', 'cancelled', 'note', 'Cancelled by customer'))
   where id = p_booking;
  return jsonb_build_object('ok', true);
end $$;

-- ================================================================ owner writes
create function public.save_scheduling_settings(p_business uuid, p_config jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_member(p_business, array['owner','admin']) then raise exception 'forbidden' using errcode = '42501'; end if;
  if jsonb_typeof(p_config) <> 'object' or jsonb_typeof(p_config->'staff') <> 'array' then raise exception 'invalid_config' using errcode = '22023'; end if;
  insert into public.scheduling_settings (business_id, config, updated_by) values (p_business, p_config, auth.uid())
    on conflict (business_id) do update set config = excluded.config, updated_at = now(), updated_by = auth.uid();
  insert into public.audit_events (business_id, actor_id, action) values (p_business, auth.uid(), 'scheduling.saved');
end $$;

create function public.set_booking_status(p_booking uuid, p_status text, p_note text default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_b public.bookings; v_now timestamptz := public.taplo_now(); v_ok boolean;
begin
  select * into v_b from public.bookings where id = p_booking;
  if v_b is null or not public.is_member(v_b.business_id, array['owner','admin','staff']) then raise exception 'forbidden' using errcode = '42501'; end if;
  if v_b.status = p_status then return jsonb_build_object('ok', true); end if;
  v_ok := case v_b.status
    when 'pending' then p_status in ('confirmed','declined','cancelled','expired')
    when 'confirmed' then p_status in ('cancelled','completed','no_show')
    else false end;
  if not v_ok then return jsonb_build_object('ok', false, 'code', 'not_allowed'); end if;
  update public.bookings set status = p_status, updated_at = v_now, expires_at = case when p_status = 'confirmed' then null else expires_at end,
    history = history || jsonb_build_array(jsonb_build_object('at', (extract(epoch from v_now) * 1000)::bigint, 'status', p_status, 'note', p_note))
   where id = p_booking;
  return jsonb_build_object('ok', true);
end $$;

create function public.reschedule_booking(p_booking uuid, p_start timestamptz, p_staff text default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_b public.bookings; v_now timestamptz := public.taplo_now(); v_pick text; v_before interval; v_after interval;
begin
  select * into v_b from public.bookings where id = p_booking;
  if v_b is null or not public.is_member(v_b.business_id, array['owner','admin','staff']) then raise exception 'forbidden' using errcode = '42501'; end if;
  if v_b.status not in ('confirmed','pending') then return jsonb_build_object('ok', false, 'code', 'closed'); end if;
  perform pg_advisory_xact_lock(hashtextextended(v_b.business_id::text, 0));
  v_pick := public.pick_staff(v_b.business_id, v_b.service_id, coalesce(p_staff, v_b.staff_key), p_start, null, v_b.id);
  if v_pick is null then return jsonb_build_object('ok', false, 'code', 'slot_unavailable'); end if;
  v_before := v_b.starts_at - v_b.block_start; v_after := v_b.block_end - v_b.ends_at;
  begin
    update public.bookings set staff_key = v_pick, starts_at = p_start, ends_at = p_start + make_interval(mins => v_b.duration_minutes),
      block_start = p_start - v_before, block_end = p_start + make_interval(mins => v_b.duration_minutes) + v_after, updated_at = v_now,
      history = history || jsonb_build_array(jsonb_build_object('at', (extract(epoch from v_now) * 1000)::bigint, 'status', v_b.status, 'note', 'Rescheduled'))
     where id = p_booking;
  exception when exclusion_violation then return jsonb_build_object('ok', false, 'code', 'slot_unavailable');
  end;
  return jsonb_build_object('ok', true);
end $$;

-- ================================================================ RLS and grants
alter table public.scheduling_settings enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_holds enable row level security;
alter table public.enquiries enable row level security;
alter table public.taplo_test_clock enable row level security;

create policy scheduling_member_read on public.scheduling_settings for select using (public.is_member(business_id, array['owner','admin']));
create policy bookings_member_read on public.bookings for select using (public.is_member(business_id));
create policy enquiries_admin_read on public.enquiries for select using (public.is_member(business_id, array['owner','admin']));

revoke all on public.scheduling_settings, public.bookings, public.booking_holds, public.enquiries, public.taplo_test_clock from anon, authenticated;
grant select on public.scheduling_settings, public.bookings, public.enquiries to authenticated;
revoke all on all functions in schema public from public, anon, authenticated;
-- Public (anonymous visitors): reads of nothing, and only these writes.
grant execute on function public.get_public_profile(text) to anon, authenticated;
grant execute on function public.is_reserved_slug(text) to anon, authenticated;
grant execute on function public.hold_slot(uuid, text, text, timestamptz, text) to anon, authenticated;
grant execute on function public.create_booking(uuid, text, text, timestamptz, jsonb, text, text, text) to anon, authenticated;
grant execute on function public.submit_enquiry(uuid, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.cancel_booking_by_token(uuid, text) to anon, authenticated;
-- Owners and staff.
grant execute on function public.is_member(uuid, text[]) to authenticated;
grant execute on function public.create_business(text, text, text, text) to authenticated;
grant execute on function public.rename_business_slug(uuid, text) to authenticated;
grant execute on function public.publish_profile(uuid) to authenticated;
grant execute on function public.unpublish_profile(uuid) to authenticated;
grant execute on function public.restore_profile_version(uuid, integer) to authenticated;
grant execute on function public.save_scheduling_settings(uuid, jsonb) to authenticated;
grant execute on function public.set_booking_status(uuid, text, text) to authenticated;
grant execute on function public.reschedule_booking(uuid, timestamptz, text) to authenticated;
