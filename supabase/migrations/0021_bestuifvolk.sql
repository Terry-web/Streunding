-- =====================================================
-- 0021 — Bestuifvolken: publiek aanbod & aanvragen
-- =====================================================
-- Additief, niet-destructief. Zie SPRINT-01-07-streunding.md, Sprint 7.
-- Root-tabel bestuifvolk_aanbod volgt hetzelfde owner_id/organization_id-
-- patroon als apiaries/hives/colonies; bestuifvolk_aanvragen is een
-- publiek-insertbare child-tabel die ownership afleidt via aanbod_id
-- (zelfde patroon als donations_access in supabase/schema.sql).

create table if not exists bestuifvolk_aanbod (

    id uuid primary key default gen_random_uuid(),

    naam text not null,
    ras text,
    omvang text,
    prijs numeric(6,2),

    beschikbaar_vanaf date,
    beschikbaar_tot date,
    voorraad integer not null default 0,

    regio text,
    beschrijving text,
    actief boolean not null default true,

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()

);

create index if not exists idx_bestuifvolk_aanbod_owner on bestuifvolk_aanbod(owner_id);
create index if not exists idx_bestuifvolk_aanbod_org on bestuifvolk_aanbod(organization_id);
create index if not exists idx_bestuifvolk_aanbod_actief on bestuifvolk_aanbod(actief);

drop trigger if exists trg_bestuifvolk_aanbod_updated on bestuifvolk_aanbod;
create trigger trg_bestuifvolk_aanbod_updated
before update on bestuifvolk_aanbod
for each row execute function set_updated_at();

alter table bestuifvolk_aanbod enable row level security;

drop policy if exists bestuifvolk_aanbod_publiek_leesbaar on bestuifvolk_aanbod;
create policy bestuifvolk_aanbod_publiek_leesbaar on bestuifvolk_aanbod
  for select
  using (actief = true);

drop policy if exists bestuifvolk_aanbod_beheer_door_eigenaar on bestuifvolk_aanbod;
create policy bestuifvolk_aanbod_beheer_door_eigenaar on bestuifvolk_aanbod
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

grant select, insert, update, delete on bestuifvolk_aanbod to anon, authenticated;

create table if not exists bestuifvolk_aanvragen (

    id uuid primary key default gen_random_uuid(),

    aanbod_id uuid
        not null
        references bestuifvolk_aanbod(id)
        on delete cascade,

    naam text not null,
    email text not null,
    telefoon text,
    aantal integer not null default 1,
    gewenste_leverdatum date,
    opmerking text,
    status text not null default 'nieuw',

    created_at timestamptz not null default now()

);

create index if not exists idx_bestuifvolk_aanvragen_aanbod on bestuifvolk_aanvragen(aanbod_id);

alter table bestuifvolk_aanvragen enable row level security;

drop policy if exists bestuifvolk_aanvragen_aanmaken_door_iedereen on bestuifvolk_aanvragen;
create policy bestuifvolk_aanvragen_aanmaken_door_iedereen on bestuifvolk_aanvragen
  for insert
  with check (true);

drop policy if exists bestuifvolk_aanvragen_lezen_door_eigenaar on bestuifvolk_aanvragen;
create policy bestuifvolk_aanvragen_lezen_door_eigenaar on bestuifvolk_aanvragen
  for select
  using (exists (
    select 1 from bestuifvolk_aanbod a
    where a.id = bestuifvolk_aanvragen.aanbod_id
      and is_owner_or_org_member(a.owner_id, a.organization_id)
  ));

drop policy if exists bestuifvolk_aanvragen_status_door_eigenaar on bestuifvolk_aanvragen;
create policy bestuifvolk_aanvragen_status_door_eigenaar on bestuifvolk_aanvragen
  for update
  using (exists (
    select 1 from bestuifvolk_aanbod a
    where a.id = bestuifvolk_aanvragen.aanbod_id
      and is_owner_or_org_member(a.owner_id, a.organization_id)
  ));

grant select, update on bestuifvolk_aanvragen to authenticated;
grant insert on bestuifvolk_aanvragen to anon, authenticated;
