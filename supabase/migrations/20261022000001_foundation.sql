-- Taplo foundation (Phase 1): identity, tenancy, slugs, draft/publish, public projection.
-- Conventions: tenant rows carry business_id; writes to sensitive state go through
-- SECURITY DEFINER functions with fixed search_path; anon has no direct table access.

-- ---------------------------------------------------------------- profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- slugs
create table public.reserved_slugs (slug text primary key);
insert into public.reserved_slugs (slug) values
  ('dashboard'),('api'),('auth'),('onboarding'),('review'),('reviews'),('pricing'),('dev'),('settings'),
  ('login'),('logout'),('signup'),('sign-up'),('sign-in'),('register'),('support'),('help'),('book'),
  ('booking'),('bookings'),('admin'),('root'),('app'),('www'),('mail'),('email'),('static'),('assets'),
  ('public'),('_next'),('taplo'),('about'),('contact'),('terms'),('privacy'),('legal'),('cookies'),
  ('blog'),('docs'),('status'),('checkout'),('billing'),('stripe'),('webhooks'),('webhook'),('invite'),
  ('invites'),('team'),('staff'),('robots'),('robots-txt'),('sitemap'),('sitemap-xml'),('favicon'),
  ('manifest'),('demo'),('test'),('null'),('undefined'),('nfc'),('store'),('shop'),('account'),
  ('profile'),('profiles'),('u'),('me'),('new'),('edit'),('search'),('explore');

create function public.is_reserved_slug(p_slug text) returns boolean
language sql stable set search_path = '' as $$
  select exists (select 1 from public.reserved_slugs r where r.slug = p_slug)
      or p_slug ~ '(^|-)taplo(-|$)'
$$;

-- ---------------------------------------------------------------- businesses
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id),
  slug text not null,
  display_name text not null check (char_length(display_name) between 1 and 100),
  industry_key text not null,       -- stable preset key, e.g. 'mechanic' or 'other'
  industry_label text not null,     -- owner's own wording, shown publicly
  currency char(3) not null default 'GBP',
  timezone text not null default 'Europe/London',
  status text not null default 'draft' check (status in ('draft','published','unpublished')),
  published_version integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint businesses_slug_format check (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 40 and slug !~ '^[0-9]+$'
  ),
  constraint businesses_slug_unique unique (slug),
  constraint businesses_published_has_version check (status <> 'published' or published_version is not null)
);
create index businesses_owner_idx on public.businesses (owner_id);

-- Every slug ever used. The primary key is the global uniqueness guarantee, so
-- concurrent claims race on one index and exactly one wins. Retired slugs stay
-- owned by their business (redirects + protection from impersonation).
create table public.business_slugs (
  slug text primary key,
  business_id uuid not null references public.businesses (id) on delete cascade,
  is_current boolean not null default true,
  created_at timestamptz not null default now(),
  retired_at timestamptz
);
create unique index business_slugs_one_current on public.business_slugs (business_id) where is_current;

-- ---------------------------------------------------------------- memberships
create table public.business_memberships (
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('owner','admin','staff')),
  status text not null default 'active' check (status in ('invited','active')),
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);
create index business_memberships_user_idx on public.business_memberships (user_id);

create function public.is_member(p_business uuid, p_roles text[] default array['owner','admin','staff'])
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.business_memberships m
    where m.business_id = p_business and m.user_id = auth.uid()
      and m.status = 'active' and m.role = any (p_roles)
  )
$$;

-- ---------------------------------------------------------------- locations
create table public.business_locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  mode text not null check (mode in ('premises','service_area','online')),
  locality text,
  address_line text,
  directions_url text,
  timezone text not null default 'Europe/London',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  unique (id, business_id)          -- target for composite same-tenant FKs from later tables
);
create index business_locations_business_idx on public.business_locations (business_id);

-- ---------------------------------------------------------------- draft / published
create table public.profile_drafts (
  business_id uuid primary key references public.businesses (id) on delete cascade,
  content jsonb not null default '{}'::jsonb,
  config jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1,
  onboarding_step text not null default 'industry',
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id)
);

create table public.profile_versions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  version integer not null check (version > 0),
  content jsonb not null,
  config jsonb not null,
  schema_version integer not null,
  published_at timestamptz not null default now(),
  published_by uuid references public.profiles (id),
  unique (business_id, version)
);
alter table public.businesses
  add constraint businesses_published_version_fk
  foreign key (id, published_version) references public.profile_versions (business_id, version)
  deferrable initially deferred;

-- ---------------------------------------------------------------- billing state (service-role writes only)
create table public.subscriptions (
  business_id uuid primary key references public.businesses (id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','core','pro','business')),
  status text not null default 'active'
    check (status in ('none','active','trialing','past_due','unpaid','canceled','incomplete')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- audit
create table public.audit_events (
  id bigint generated always as identity primary key,
  business_id uuid references public.businesses (id) on delete set null,
  actor_id uuid,
  action text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_events_business_idx on public.audit_events (business_id, created_at desc);

-- ================================================================ functions
create function public.create_business(
  p_name text, p_slug text, p_industry_key text, p_industry_label text
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_id uuid;
begin
  if v_user is null then raise exception 'not_authenticated' using errcode = '28000'; end if;
  if p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or char_length(p_slug) not between 3 and 40 or p_slug ~ '^[0-9]+$' then
    raise exception 'slug_invalid' using errcode = '22023';
  end if;
  if public.is_reserved_slug(p_slug) then raise exception 'slug_reserved' using errcode = '22023'; end if;

  insert into public.profiles (id) values (v_user) on conflict do nothing;

  insert into public.businesses (owner_id, slug, display_name, industry_key, industry_label)
  values (v_user, p_slug, p_name, p_industry_key, p_industry_label)
  returning id into v_id;

  begin
    insert into public.business_slugs (slug, business_id) values (p_slug, v_id);
  exception when unique_violation then
    raise exception 'slug_taken' using errcode = '23505';
  end;

  insert into public.business_memberships (business_id, user_id, role) values (v_id, v_user, 'owner');
  insert into public.subscriptions (business_id) values (v_id);
  insert into public.profile_drafts (business_id, updated_by) values (v_id, v_user);
  insert into public.audit_events (business_id, actor_id, action, detail)
    values (v_id, v_user, 'business.created', jsonb_build_object('slug', p_slug));
  return v_id;
exception when unique_violation then
  -- businesses.slug unique index hit first (same race, different index)
  raise exception 'slug_taken' using errcode = '23505';
end $$;

create function public.rename_business_slug(p_business uuid, p_new_slug text) returns void
language plpgsql security definer set search_path = '' as $$
declare v_old text;
begin
  if not public.is_member(p_business, array['owner','admin']) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_new_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or char_length(p_new_slug) not between 3 and 40 or p_new_slug ~ '^[0-9]+$' then
    raise exception 'slug_invalid' using errcode = '22023';
  end if;
  if public.is_reserved_slug(p_new_slug) then raise exception 'slug_reserved' using errcode = '22023'; end if;

  select slug into v_old from public.businesses where id = p_business for update;
  if v_old = p_new_slug then return; end if;

  -- Re-adopting one of this business's own retired slugs is allowed; anyone else's is not.
  if exists (select 1 from public.business_slugs where slug = p_new_slug and business_id <> p_business) then
    raise exception 'slug_taken' using errcode = '23505';
  end if;

  update public.business_slugs set is_current = false, retired_at = now() where business_id = p_business and is_current;
  begin
    insert into public.business_slugs (slug, business_id) values (p_new_slug, p_business)
      on conflict (slug) do update set is_current = true, retired_at = null;
  exception when unique_violation then
    raise exception 'slug_taken' using errcode = '23505';
  end;
  update public.businesses set slug = p_new_slug, updated_at = now() where id = p_business;
  insert into public.audit_events (business_id, actor_id, action, detail)
    values (p_business, auth.uid(), 'business.slug_renamed', jsonb_build_object('from', v_old, 'to', p_new_slug));
end $$;

-- Atomic publish: serialises per business, snapshots the draft as the next version.
create function public.publish_profile(p_business uuid) returns integer
language plpgsql security definer set search_path = '' as $$
declare v_draft public.profile_drafts; v_next integer;
begin
  if not public.is_member(p_business, array['owner','admin']) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  perform 1 from public.businesses where id = p_business for update;
  select * into v_draft from public.profile_drafts where business_id = p_business;
  if v_draft is null or coalesce(v_draft.content #>> '{identity,name}', '') = '' then
    raise exception 'draft_incomplete' using errcode = '22023';
  end if;
  select coalesce(max(version), 0) + 1 into v_next from public.profile_versions where business_id = p_business;
  insert into public.profile_versions (business_id, version, content, config, schema_version, published_by)
    values (p_business, v_next, v_draft.content, v_draft.config, v_draft.schema_version, auth.uid());
  update public.businesses set status = 'published', published_version = v_next, updated_at = now() where id = p_business;
  insert into public.audit_events (business_id, actor_id, action, detail)
    values (p_business, auth.uid(), 'profile.published', jsonb_build_object('version', v_next));
  return v_next;
end $$;

create function public.unpublish_profile(p_business uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_member(p_business, array['owner','admin']) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  -- published_version is retained so republishing/restoring keeps history; status gates public reads.
  update public.businesses set status = 'unpublished', updated_at = now() where id = p_business;
  insert into public.audit_events (business_id, actor_id, action) values (p_business, auth.uid(), 'profile.unpublished');
end $$;

-- Restore copies an old version into the DRAFT. It never edits history and never goes live by itself.
create function public.restore_profile_version(p_business uuid, p_version integer) returns void
language plpgsql security definer set search_path = '' as $$
declare v public.profile_versions;
begin
  if not public.is_member(p_business, array['owner','admin']) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  select * into v from public.profile_versions where business_id = p_business and version = p_version;
  if v is null then raise exception 'version_not_found' using errcode = 'P0002'; end if;
  update public.profile_drafts
     set content = v.content, config = v.config, schema_version = v.schema_version, updated_at = now(), updated_by = auth.uid()
   where business_id = p_business;
  insert into public.audit_events (business_id, actor_id, action, detail)
    values (p_business, auth.uid(), 'profile.restored_to_draft', jsonb_build_object('version', p_version));
end $$;

-- The ONLY anonymous read path. Returns the published snapshot, never drafts,
-- never owner data, and nothing at all for unpublished businesses.
create function public.get_public_profile(p_slug text) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare v_biz public.businesses; v_row public.business_slugs; v_ver public.profile_versions; v_sub public.subscriptions;
begin
  select * into v_row from public.business_slugs where slug = p_slug;
  if v_row is null then return jsonb_build_object('status', 'none'); end if;
  select * into v_biz from public.businesses where id = v_row.business_id;
  if v_biz.status <> 'published' then return jsonb_build_object('status', 'none'); end if;
  if not v_row.is_current then
    return jsonb_build_object('status', 'redirect', 'slug', v_biz.slug);
  end if;
  select * into v_ver from public.profile_versions where business_id = v_biz.id and version = v_biz.published_version;
  select * into v_sub from public.subscriptions where business_id = v_biz.id;
  return jsonb_build_object(
    'status', 'found',
    'snapshot', jsonb_build_object('content', v_ver.content, 'config', v_ver.config),
    'plan', coalesce(v_sub.plan, 'free'),
    'subscription_status', coalesce(v_sub.status, 'none')
  );
end $$;

-- ================================================================ RLS
alter table public.profiles enable row level security;
alter table public.reserved_slugs enable row level security;
alter table public.businesses enable row level security;
alter table public.business_slugs enable row level security;
alter table public.business_memberships enable row level security;
alter table public.business_locations enable row level security;
alter table public.profile_drafts enable row level security;
alter table public.profile_versions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_self on public.profiles for select using (id = auth.uid());
create policy profiles_self_update on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy businesses_member_read on public.businesses for select using (public.is_member(id));
create policy slugs_member_read on public.business_slugs for select using (public.is_member(business_id));
create policy memberships_read on public.business_memberships for select
  using (user_id = auth.uid() or public.is_member(business_id, array['owner','admin']));
create policy locations_member_read on public.business_locations for select using (public.is_member(business_id));
create policy locations_admin_write on public.business_locations for all
  using (public.is_member(business_id, array['owner','admin']))
  with check (public.is_member(business_id, array['owner','admin']));
create policy drafts_admin_read on public.profile_drafts for select using (public.is_member(business_id, array['owner','admin']));
create policy drafts_admin_update on public.profile_drafts for update
  using (public.is_member(business_id, array['owner','admin']))
  with check (public.is_member(business_id, array['owner','admin']));
create policy versions_admin_read on public.profile_versions for select using (public.is_member(business_id, array['owner','admin']));
create policy subscriptions_member_read on public.subscriptions for select using (public.is_member(business_id));
create policy audit_admin_read on public.audit_events for select using (public.is_member(business_id, array['owner','admin']));

-- Grants: anon gets no table access at all; authenticated gets only what policies allow.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;
grant select on public.profiles, public.businesses, public.business_slugs, public.business_memberships,
  public.business_locations, public.profile_drafts, public.profile_versions, public.subscriptions,
  public.audit_events to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant insert, update, delete on public.business_locations to authenticated;
grant update (content, config, schema_version, onboarding_step, updated_at, updated_by) on public.profile_drafts to authenticated;
grant execute on function public.is_member(uuid, text[]) to authenticated;
grant execute on function public.is_reserved_slug(text) to anon, authenticated;
grant execute on function public.create_business(text, text, text, text) to authenticated;
grant execute on function public.rename_business_slug(uuid, text) to authenticated;
grant execute on function public.publish_profile(uuid) to authenticated;
grant execute on function public.unpublish_profile(uuid) to authenticated;
grant execute on function public.restore_profile_version(uuid, integer) to authenticated;
grant execute on function public.get_public_profile(text) to anon, authenticated;
