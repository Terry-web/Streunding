-- =====================================================
-- Melion Sprint 0 — Auth + Ownership + Multi-tenant Schema
-- =====================================================
-- Prerequisite: install2.sql already applied.
--
-- Run PART 1 first. It adds owner_id/organization_id as NULLABLE columns
-- so it's safe to run against a database that already has rows (e.g. test
-- data inserted via the old /test page, before login existed).
--
-- Before running PART 2, clear out or backfill any pre-existing rows —
-- PART 2 tightens owner_id to NOT NULL and will fail otherwise. The
-- diagnostic SELECT at the top of PART 2 tells you exactly which tables
-- still have NULL owner_id.
-- =====================================================

create extension if not exists pgcrypto;

-- =====================================================
-- PART 1 — organizations, membership, ownership columns, RLS
-- =====================================================

-- =====================================================
-- ENUMS
-- =====================================================

create type kastenbeheer_modus as enum (
  'exclusief',
  'gedeeld'
);

create type donormodel as enum (
  'centraal',
  'per_imker'
);

create type org_tier as enum (
  'solo',
  'team',
  'pro'
);

create type org_role as enum (
  'eigenaar',
  'beheerder',
  'imker'
);

-- =====================================================
-- ORGANIZATIONS
-- =====================================================

create table organizations (

    id uuid primary key default gen_random_uuid(),

    name text not null,
    type text,              -- 'bedrijf' / 'vereniging' — cosmetisch, geen functioneel verschil

    kastenbeheer_modus kastenbeheer_modus not null default 'exclusief',
    donormodel donormodel not null default 'per_imker',

    tier org_tier not null default 'solo',

    created_at timestamptz not null default now()

);

-- =====================================================
-- ORGANIZATION MEMBERS
-- =====================================================

create table organization_members (

    id uuid primary key default gen_random_uuid(),

    organization_id uuid
        not null
        references organizations(id)
        on delete cascade,

    user_id uuid
        not null
        references auth.users(id)
        on delete cascade,

    role org_role not null default 'imker',

    created_at timestamptz not null default now(),

    unique (organization_id, user_id)

);

create index idx_org_members_org on organization_members(organization_id);
create index idx_org_members_user on organization_members(user_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- security definer: bypasses organization_members' own RLS so this can be
-- used inside that table's policy without infinite recursion.
create or replace function is_org_member(org_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from organization_members m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function is_org_admin(org_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from organization_members m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
      and m.role in ('eigenaar', 'beheerder')
  );
$$;

create or replace function is_owner_or_org_member(p_owner_id uuid, p_organization_id uuid)
returns boolean
language sql
stable
as $$
  select p_owner_id = auth.uid()
    or (p_organization_id is not null and is_org_member(p_organization_id));
$$;

-- =====================================================
-- RLS — organizations / organization_members
-- =====================================================

alter table organizations enable row level security;

create policy organizations_select on organizations
  for select using (is_org_member(id));

-- Org creation happens before membership exists — any authenticated user
-- may create an org, then the app immediately inserts them into
-- organization_members as 'eigenaar' (see organization_members_insert below).
create policy organizations_insert on organizations
  for insert with check (auth.uid() is not null);

create policy organizations_update on organizations
  for update using (is_org_admin(id)) with check (is_org_admin(id));

create policy organizations_delete on organizations
  for delete using (is_org_admin(id));

alter table organization_members enable row level security;

create policy organization_members_select on organization_members
  for select using (is_org_member(organization_id));

-- Allowed when joining yourself right after creating an org, or when an
-- eigenaar/beheerder is inviting someone else (Sprint 1 flow).
create policy organization_members_insert on organization_members
  for insert with check (
    user_id = auth.uid() or is_org_admin(organization_id)
  );

create policy organization_members_update on organization_members
  for update using (is_org_admin(organization_id)) with check (is_org_admin(organization_id));

create policy organization_members_delete on organization_members
  for delete using (is_org_admin(organization_id));

-- =====================================================
-- OWNERSHIP COLUMNS — root tables
-- =====================================================
-- "Root" = no non-nullable parent to inherit ownership from.
-- owner_id stays NULLABLE here; PART 2 tightens it once existing rows
-- (if any) are cleaned up.

alter table apiaries add column owner_id uuid references auth.users(id) on delete cascade;
alter table apiaries alter column owner_id set default auth.uid();
alter table apiaries add column organization_id uuid references organizations(id) on delete set null;
create index idx_apiaries_owner on apiaries(owner_id);
create index idx_apiaries_org on apiaries(organization_id);

alter table hives add column owner_id uuid references auth.users(id) on delete cascade;
alter table hives alter column owner_id set default auth.uid();
alter table hives add column organization_id uuid references organizations(id) on delete set null;
create index idx_hives_owner on hives(owner_id);
create index idx_hives_org on hives(organization_id);

alter table queens add column owner_id uuid references auth.users(id) on delete cascade;
alter table queens alter column owner_id set default auth.uid();
alter table queens add column organization_id uuid references organizations(id) on delete set null;
create index idx_queens_owner on queens(owner_id);
create index idx_queens_org on queens(organization_id);

alter table colonies add column owner_id uuid references auth.users(id) on delete cascade;
alter table colonies alter column owner_id set default auth.uid();
alter table colonies add column organization_id uuid references organizations(id) on delete set null;
create index idx_colonies_owner on colonies(owner_id);
create index idx_colonies_org on colonies(organization_id);

alter table customers add column owner_id uuid references auth.users(id) on delete cascade;
alter table customers alter column owner_id set default auth.uid();
alter table customers add column organization_id uuid references organizations(id) on delete set null;
create index idx_customers_owner on customers(owner_id);
create index idx_customers_org on customers(organization_id);

alter table tasks add column owner_id uuid references auth.users(id) on delete cascade;
alter table tasks alter column owner_id set default auth.uid();
alter table tasks add column organization_id uuid references organizations(id) on delete set null;
create index idx_tasks_owner on tasks(owner_id);
create index idx_tasks_org on tasks(organization_id);

alter table documents add column owner_id uuid references auth.users(id) on delete cascade;
alter table documents alter column owner_id set default auth.uid();
alter table documents add column organization_id uuid references organizations(id) on delete set null;
create index idx_documents_owner on documents(owner_id);
create index idx_documents_org on documents(organization_id);

-- =====================================================
-- RLS — root tables
-- =====================================================

alter table apiaries enable row level security;
create policy apiaries_access on apiaries
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

alter table hives enable row level security;
create policy hives_access on hives
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

alter table queens enable row level security;
create policy queens_access on queens
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

alter table colonies enable row level security;
create policy colonies_access on colonies
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

alter table customers enable row level security;
create policy customers_access on customers
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

alter table tasks enable row level security;
create policy tasks_access on tasks
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

alter table documents enable row level security;
create policy documents_access on documents
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

-- =====================================================
-- RLS — child tables (ownership inherited via a parent FK)
-- =====================================================

-- via colony_id (not null on all of these)

alter table inspections enable row level security;
create policy inspections_access on inspections
  for all
  using (exists (
    select 1 from colonies c
    where c.id = inspections.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = inspections.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

alter table treatments enable row level security;
create policy treatments_access on treatments
  for all
  using (exists (
    select 1 from colonies c
    where c.id = treatments.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = treatments.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

alter table feedings enable row level security;
create policy feedings_access on feedings
  for all
  using (exists (
    select 1 from colonies c
    where c.id = feedings.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = feedings.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

alter table colony_history enable row level security;
create policy colony_history_access on colony_history
  for all
  using (exists (
    select 1 from colonies c
    where c.id = colony_history.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = colony_history.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

alter table hive_upgrades enable row level security;
create policy hive_upgrades_access on hive_upgrades
  for all
  using (exists (
    select 1 from colonies c
    where c.id = hive_upgrades.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = hive_upgrades.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

alter table colony_shares enable row level security;
create policy colony_shares_access on colony_shares
  for all
  using (exists (
    select 1 from colonies c
    where c.id = colony_shares.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = colony_shares.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

alter table honey_rewards enable row level security;
create policy honey_rewards_access on honey_rewards
  for all
  using (exists (
    select 1 from colonies c
    where c.id = honey_rewards.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = honey_rewards.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

alter table donations enable row level security;
create policy donations_access on donations
  for all
  using (exists (
    select 1 from colonies c
    where c.id = donations.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = donations.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

-- via customer_id

alter table contacts enable row level security;
create policy contacts_access on contacts
  for all
  using (exists (
    select 1 from customers cu
    where cu.id = contacts.customer_id
      and is_owner_or_org_member(cu.owner_id, cu.organization_id)
  ))
  with check (exists (
    select 1 from customers cu
    where cu.id = contacts.customer_id
      and is_owner_or_org_member(cu.owner_id, cu.organization_id)
  ));

-- swarms: two optional parents (source_colony_id, caught_apiary_id) —
-- accessible if either resolves to an owned/shared row.

alter table swarms enable row level security;
create policy swarms_access on swarms
  for all
  using (
    (source_colony_id is not null and exists (
      select 1 from colonies c
      where c.id = swarms.source_colony_id
        and is_owner_or_org_member(c.owner_id, c.organization_id)
    ))
    or
    (caught_apiary_id is not null and exists (
      select 1 from apiaries a
      where a.id = swarms.caught_apiary_id
        and is_owner_or_org_member(a.owner_id, a.organization_id)
    ))
  )
  with check (
    (source_colony_id is not null and exists (
      select 1 from colonies c
      where c.id = swarms.source_colony_id
        and is_owner_or_org_member(c.owner_id, c.organization_id)
    ))
    or
    (caught_apiary_id is not null and exists (
      select 1 from apiaries a
      where a.id = swarms.caught_apiary_id
        and is_owner_or_org_member(a.owner_id, a.organization_id)
    ))
  );

-- harvests: two optional parents (colony_id, apiary_id) — same pattern.

alter table harvests enable row level security;
create policy harvests_access on harvests
  for all
  using (
    (colony_id is not null and exists (
      select 1 from colonies c
      where c.id = harvests.colony_id
        and is_owner_or_org_member(c.owner_id, c.organization_id)
    ))
    or
    (apiary_id is not null and exists (
      select 1 from apiaries a
      where a.id = harvests.apiary_id
        and is_owner_or_org_member(a.owner_id, a.organization_id)
    ))
  )
  with check (
    (colony_id is not null and exists (
      select 1 from colonies c
      where c.id = harvests.colony_id
        and is_owner_or_org_member(c.owner_id, c.organization_id)
    ))
    or
    (apiary_id is not null and exists (
      select 1 from apiaries a
      where a.id = harvests.apiary_id
        and is_owner_or_org_member(a.owner_id, a.organization_id)
    ))
  );

-- =====================================================
-- PART 2 — run only after cleaning up pre-existing rows
-- =====================================================
-- Diagnostic: every row below should read 0. If not, either delete those
-- rows (e.g. leftover /test page data with no real owner) or manually
-- backfill owner_id to a real auth.users id before proceeding.

select 'apiaries' as table_name, count(*) from apiaries where owner_id is null
union all select 'hives', count(*) from hives where owner_id is null
union all select 'queens', count(*) from queens where owner_id is null
union all select 'colonies', count(*) from colonies where owner_id is null
union all select 'customers', count(*) from customers where owner_id is null
union all select 'tasks', count(*) from tasks where owner_id is null
union all select 'documents', count(*) from documents where owner_id is null;

-- Once the diagnostic above is all zeroes, uncomment and run:

-- alter table apiaries alter column owner_id set not null;
-- alter table hives alter column owner_id set not null;
-- alter table queens alter column owner_id set not null;
-- alter table colonies alter column owner_id set not null;
-- alter table customers alter column owner_id set not null;
-- alter table tasks alter column owner_id set not null;
-- alter table documents alter column owner_id set not null;
