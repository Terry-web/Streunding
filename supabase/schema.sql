-- =====================================================
-- Melion — Imkerij Beheersysteem: volledig schema
-- =====================================================
-- Enige bron van waarheid: basisschema (standplaatsen, kasten, volken, ...),
-- auth/ownership/multi-tenant (organizations, RLS), de donatie/game-module,
-- en alles uit Sprint 13 t/m 34 (koninginnen-historie, varroa, gewicht,
-- labels, voorraad/financiën, foto's, koninginnenteelt, kastopbouw,
-- gezondheid, audit trail, soft delete/herstel) — in één doorlopend script.
--
-- Dit bestand vervangt de losse migraties 0001-0018 (verwijderd na deze
-- consolidatie): waar een migratie een eerdere bug fixte (bijv. de
-- organization_members_insert self-join-hole uit Sprint 7, of de
-- kolom-ambiguïteit in de photos-storage-policy uit Sprint 21), staat hier
-- alleen de gecorrigeerde eindtoestand — niet de geschiedenis van bug dan
-- fix. Die geschiedenis staat in git.
--
-- ⚠️ IDEMPOTENT MAAR DESTRUCTIEF: alles wordt eerst verwijderd (drop ...
-- cascade), dan opnieuw opgebouwd. Dit is bedoeld voor een verse database —
-- NIET om tegen de huidige, gevulde productie-/staging-database te draaien.
-- Dat wist al je data. Voor een lopende database: gebruik dit bestand alleen
-- als naslagwerk voor de actuele schema-vorm, en pas losse, additive
-- migraties toe zoals voorheen (zie het projectgeheugen/README voor de
-- afspraak) als er weer nieuwe schema-wijzigingen nodig zijn.
--
-- Verse opzet: open dit bestand, selecteer alles, plak het in de Supabase
-- Studio SQL-editor en druk één keer op Run.
-- =====================================================

-- =====================================================
-- RESET
-- =====================================================

drop table if exists bestuifvolk_aanvragen cascade;
drop table if exists bestuifvolk_aanbod cascade;

drop view if exists colony_status_overview;
drop view if exists colony_status_view;
drop view if exists harvest_summary;
drop view if exists colony_last_inspection;
drop view if exists colony_overview;
drop view if exists donor_overview;
drop view if exists colony_funding_progress;

drop table if exists audit_log cascade;
drop table if exists health_incidents cascade;
drop table if exists hive_component_changes cascade;
drop table if exists breeding_rounds cascade;
drop table if exists finance_entries cascade;
drop table if exists inventory_items cascade;
drop table if exists hive_labels cascade;
drop table if exists labels cascade;
drop table if exists inspection_photos cascade;
drop table if exists weight_logs cascade;
drop table if exists varroa_counts cascade;
drop table if exists honey_rewards cascade;
drop table if exists colony_shares cascade;
drop table if exists hive_upgrades cascade;
drop table if exists donations cascade;
drop table if exists documents cascade;
drop table if exists tasks cascade;
drop table if exists contacts cascade;
drop table if exists customers cascade;
drop table if exists harvests cascade;
drop table if exists swarms cascade;
drop table if exists feedings cascade;
drop table if exists treatments cascade;
drop table if exists inspections cascade;
drop table if exists colony_history cascade;
drop table if exists colonies cascade;
drop table if exists queens cascade;
drop table if exists hives cascade;
drop table if exists apiaries cascade;
drop table if exists profiles cascade;
drop table if exists organization_invitations cascade;
drop table if exists organization_members cascade;
drop table if exists organizations cascade;

-- Trigger op auth.users leeft los van de public-schema drops hierboven —
-- moet vóór het droppen van handle_new_user() verwijderd worden, anders
-- faalt die drop op een nog bestaande afhankelijke trigger.
drop trigger if exists on_auth_user_created on auth.users;

drop function if exists get_dashboard_stats();
drop function if exists anonymize_own_account();
drop function if exists purge_organization(uuid, integer);
drop function if exists purge_inspection_photos(uuid[]);
drop function if exists fn_photos_pending_purge(integer);
drop function if exists purge_expired_soft_deletes(integer);
drop function if exists fn_audit_org_deleted();
drop function if exists fn_audit_photo_deleted();
drop function if exists fn_audit_inspection_deleted();
drop function if exists fn_audit_colony_deleted();
drop function if exists fn_audit_hive_deleted();
drop function if exists fn_cascade_hive_soft_delete();
drop function if exists fn_audit_role_change();
drop function if exists fn_audit_colony_moved();
drop function if exists fn_audit_colony_owner_change();
drop function if exists fn_audit_hive_owner_change();
drop function if exists log_audit_event(uuid, text, text, uuid, jsonb, jsonb);
drop function if exists handle_new_user();
drop function if exists distribute_honey_rewards();
drop function if exists recalc_colony_shares();
drop function if exists check_hive_upgrades();
drop function if exists set_donation_tier();
drop function if exists is_owner_or_org_member(uuid, uuid);
drop function if exists is_org_admin(uuid);
drop function if exists is_org_member(uuid);
drop function if exists set_updated_at();

drop type if exists breeding_round_status;
drop type if exists breeding_method;
drop type if exists finance_entry_type;
drop type if exists inventory_category;
drop type if exists health_incident_status;
drop type if exists health_incident_category;
drop type if exists hive_component_change_type;
drop type if exists varroa_method;
drop type if exists photo_category;
drop type if exists invitation_status;
drop type if exists hive_upgrade_type;
drop type if exists donation_tier;
drop type if exists org_role;
drop type if exists org_tier;
drop type if exists donormodel;
drop type if exists kastenbeheer_modus;
drop type if exists task_priority;
drop type if exists contact_type;
drop type if exists honey_type;
drop type if exists swarm_outcome;
drop type if exists feed_type;
drop type if exists treatment_method;
drop type if exists treatment_type;
drop type if exists temperament;
drop type if exists brood_pattern;
drop type if exists colony_status;
drop type if exists queen_status;
drop type if exists queen_origin;
drop type if exists queen_race;
drop type if exists hive_type;
drop type if exists apiary_type;
drop type if exists customer_status;
drop type if exists customer_type;

create extension if not exists pgcrypto;

-- =====================================================
-- ENUMS — basisschema
-- =====================================================

create type customer_type as enum (
  'person', 'company', 'municipality', 'shop', 'market', 'other'
);

create type customer_status as enum (
  'prospect', 'active', 'inactive', 'archived'
);

create type apiary_type as enum (
  'home', 'field', 'orchard', 'heather', 'rented', 'other'
);

create type hive_type as enum (
  'dadant', 'simplex', 'national', 'warre', 'langstroth', 'other'
);

create type queen_race as enum (
  'carnica', 'buckfast', 'ligustica', 'mellifera', 'other'
);

create type queen_origin as enum (
  'self_bred', 'purchased', 'swarm_caught', 'gift', 'unknown'
);

create type queen_status as enum (
  'active', 'superseded', 'dead', 'lost', 'sold'
);

create type colony_status as enum (
  'active', 'weak', 'queenless', 'swarmed', 'merged', 'dead', 'sold'
);

create type brood_pattern as enum (
  'solid', 'spotty', 'none', 'not_assessed'
);

create type temperament as enum (
  'calm', 'normal', 'defensive', 'aggressive'
);

create type treatment_type as enum (
  'oxalic_acid', 'formic_acid', 'thymol', 'lactic_acid', 'other'
);

create type treatment_method as enum (
  'trickling', 'vaporization', 'strips', 'spray', 'other'
);

create type feed_type as enum (
  'sugar_syrup', 'fondant', 'candy', 'pollen_patty', 'other'
);

create type swarm_outcome as enum (
  'caught', 'lost', 'returned_to_colony'
);

create type honey_type as enum (
  'spring', 'summer', 'heather', 'acacia', 'mixed', 'other'
);

create type contact_type as enum (
  'call', 'email', 'visit', 'whatsapp', 'follow_up', 'other'
);

create type task_priority as enum (
  'low', 'normal', 'high', 'urgent'
);

-- =====================================================
-- ENUMS — multi-tenant
-- =====================================================

create type kastenbeheer_modus as enum (
  'exclusief', 'gedeeld'
);

create type donormodel as enum (
  'centraal', 'per_imker'
);

create type org_tier as enum (
  'solo', 'team', 'pro'
);

create type org_role as enum (
  'eigenaar', 'beheerder', 'imker'
);

-- =====================================================
-- ENUMS — uitbreidingen (Sprint 13+)
-- =====================================================

create type invitation_status as enum ('pending', 'accepted', 'revoked');

create type photo_category as enum (
  'queen', 'frames', 'brood', 'hive_structure', 'problem', 'other'
);

create type varroa_method as enum (
  'sugar_roll', 'alcohol_wash', 'natural_drop', 'other'
);

create type hive_component_change_type as enum (
  'frame_added', 'frame_removed', 'super_added', 'super_removed', 'other'
);

create type health_incident_category as enum (
  'disease', 'queenlessness', 'weakness', 'other'
);

create type health_incident_status as enum (
  'open', 'resolved'
);

create type inventory_category as enum (
  'kasten', 'onderdelen', 'materialen', 'gereedschap', 'behandelmiddelen'
);

create type finance_entry_type as enum (
  'expense', 'income'
);

create type breeding_method as enum (
  'miller', 'hopkins', 'nicot', 'cloake_board', 'other'
);

create type breeding_round_status as enum (
  'planned', 'emerged', 'completed', 'failed'
);

-- =====================================================
-- UPDATED_AT FUNCTION
-- =====================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

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

    -- Nodig zodat de maker zijn eigen rij kan zien in hetzelfde request dat
    -- hem aanmaakt (PostgREST's INSERT ... RETURNING toetst ook de SELECT-
    -- policy, en organization_members heeft op dat moment nog geen rij voor
    -- hem).
    created_by uuid references auth.users(id) default auth.uid(),

    deleted_at timestamptz,                    -- soft delete, zie Sprint 34
    deletion_export_completed_at timestamptz,  -- AVG-dataportabiliteit-gate vóór purge

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

-- security definer: omzeilt de eigen RLS van organization_members zodat dit
-- binnen die tabel se policy gebruikt kan worden zonder oneindige recursie.
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
-- ORGANIZATION INVITATIONS
-- =====================================================

create table organization_invitations (

    id uuid primary key default gen_random_uuid(),

    organization_id uuid
        not null
        references organizations(id)
        on delete cascade,

    email text not null,
    role org_role not null default 'imker',
    status invitation_status not null default 'pending',

    invited_by uuid not null references auth.users(id) default auth.uid(),

    created_at timestamptz not null default now(),
    accepted_at timestamptz,

    unique (organization_id, email)

);

create index idx_org_invitations_org on organization_invitations(organization_id);
create index idx_org_invitations_email on organization_invitations(email);

alter table organization_invitations enable row level security;

create policy org_invitations_select on organization_invitations
  for select using (
    is_org_admin(organization_id)
    or lower(email) = lower(auth.jwt() ->> 'email')
  );

create policy org_invitations_insert on organization_invitations
  for insert with check (is_org_admin(organization_id));

-- Invitee needs update rights on their own row to accept (flips status to
-- 'accepted'); org admins can also update (e.g. to revoke).
create policy org_invitations_update on organization_invitations
  for update using (
    is_org_admin(organization_id)
    or lower(email) = lower(auth.jwt() ->> 'email')
  )
  with check (
    is_org_admin(organization_id)
    or lower(email) = lower(auth.jwt() ->> 'email')
  );

create policy org_invitations_delete on organization_invitations
  for delete using (is_org_admin(organization_id));

grant select, insert, update, delete on organization_invitations to anon, authenticated;

-- =====================================================
-- RLS — organizations / organization_members
-- =====================================================

alter table organizations enable row level security;

create policy organizations_select on organizations
  for select using (is_org_member(id) or created_by = auth.uid());

-- An invitee isn't an org member yet, so the policy above hides the org
-- from them — this additive policy lets a pending invite still show the
-- organization's name.
create policy organizations_select_invited on organizations
  for select using (
    exists (
      select 1 from organization_invitations oi
      where oi.organization_id = organizations.id
        and lower(oi.email) = lower(auth.jwt() ->> 'email')
        and oi.status = 'pending'
    )
  );

-- Org-creatie gebeurt vóórdat membership bestaat — elke ingelogde gebruiker
-- mag een org aanmaken, waarna de app hem meteen als 'eigenaar' toevoegt aan
-- organization_members (zie organization_members_insert hieronder).
create policy organizations_insert on organizations
  for insert with check (auth.uid() is not null);

create policy organizations_update on organizations
  for update using (is_org_admin(id)) with check (is_org_admin(id));

create policy organizations_delete on organizations
  for delete using (is_org_admin(id));

alter table organization_members enable row level security;

create policy organization_members_select on organization_members
  for select using (is_org_member(organization_id));

-- Toegestaan bij: (a) jezelf toevoegen net na het aanmaken van je eigen org,
-- (b) een matchende pending invitation accepteren, of (c) een eigenaar/
-- beheerder die iemand toevoegt/importeert.
--
-- BUG (Sprint 7, hier al gefixt): een eerdere versie stond
-- `user_id = auth.uid()` onvoorwaardelijk toe — elke ingelogde gebruiker
-- kon zichzelf aan een willekeurige organisatie toevoegen, met een
-- willekeurige rol (incl. eigenaar), zonder ooit uitgenodigd te zijn.
-- Gevonden door tests/rls_regression.sql's outsider-C-check.
create policy organization_members_insert on organization_members
  for insert with check (
    is_org_admin(organization_id)
    or (
      user_id = auth.uid()
      and (
        exists (
          select 1 from organizations o
          where o.id = organization_members.organization_id
            and o.created_by = auth.uid()
        )
        or exists (
          select 1 from organization_invitations oi
          where oi.organization_id = organization_members.organization_id
            and oi.role = organization_members.role
            and oi.status = 'pending'
            and lower(oi.email) = lower(auth.jwt() ->> 'email')
        )
      )
    )
  );

create policy organization_members_update on organization_members
  for update using (is_org_admin(organization_id)) with check (is_org_admin(organization_id));

create policy organization_members_delete on organization_members
  for delete using (is_org_admin(organization_id));

-- =====================================================
-- PROFILES — minimal public mirror of auth.users(email)
-- =====================================================
-- De API exposet alleen het public-schema, dus dit is nodig om "wie" te
-- tonen — een collega's naam op een gedeelde kast, of wie de laatste
-- inspectie logde.

create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    created_at timestamptz not null default now()
);

-- Backfill bestaande gebruikers — alleen relevant als dit script tegen een
-- auth-instance draait die al accounts heeft (de SQL-editor draait met
-- verhoogde rechten die auth.users mogen lezen).
insert into profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, email)
    values (new.id, new.email)
    on conflict (id) do update set email = excluded.email;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email on auth.users
for each row execute function handle_new_user();

alter table profiles enable row level security;

-- Zichtbaar voor jezelf, en voor iedereen die minstens één organisatie met
-- je deelt (zodat een collega's naam getoond kan worden bij een gedeelde
-- kast).
create policy profiles_select on profiles
  for select using (
    id = auth.uid()
    or exists (
      select 1 from organization_members m1
      join organization_members m2 on m1.organization_id = m2.organization_id
      where m1.user_id = auth.uid() and m2.user_id = profiles.id
    )
  );

grant select on profiles to anon, authenticated;

-- =====================================================
-- APIARIES (standplaatsen)
-- =====================================================

create table apiaries (

    id uuid primary key default gen_random_uuid(),

    name text not null,

    address text,
    postal_code text,
    city text,
    province text,

    latitude numeric(10,7),
    longitude numeric(10,7),

    type apiary_type default 'field',

    owner_permission text,          -- naam grondeigenaar/toestemming
    rvo_registration_number text,   -- I&R-nummer / registratie standplaats

    max_hives integer,              -- max aantal kasten toegestaan/geschikt

    notes text,

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_apiary_city on apiaries(city);
create index idx_apiaries_owner on apiaries(owner_id);
create index idx_apiaries_org on apiaries(organization_id);

create trigger trg_apiary_updated
before update on apiaries
for each row
execute function set_updated_at();

-- =====================================================
-- HIVES (kasten - fysiek materiaal, herbruikbaar)
-- =====================================================

create table hives (

    id uuid primary key default gen_random_uuid(),

    label text not null,            -- eigen naam/nummer, bv "Kast 7"

    type hive_type default 'dadant',

    frame_count integer,
    box_count integer default 1,    -- aantal kasten hoog (broedkamer + supers)

    purchase_date date,
    condition text,

    in_use boolean default true,

    notes text,

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    deleted_at timestamptz,  -- soft delete, zie Sprint 34

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_hives_owner on hives(owner_id);
create index idx_hives_org on hives(organization_id);
create index idx_hives_trash on hives(organization_id) where deleted_at is not null;

create trigger trg_hive_updated
before update on hives
for each row
execute function set_updated_at();

-- =====================================================
-- QUEENS (koninginnen)
-- =====================================================

create table queens (

    id uuid primary key default gen_random_uuid(),

    label text,                     -- eigen naam/code, optioneel

    race queen_race default 'carnica',
    origin queen_origin default 'unknown',

    birth_year integer not null,
    marking_color text,             -- internationale kleurcode o.b.v. birth_year
    marked boolean default false,
    clipped boolean default false,  -- vleugel geknipt

    breeder text,                   -- bij aankoop: fokker/leverancier

    status queen_status default 'active',

    introduced_date date,           -- datum in volk gezet
    removed_date date,              -- datum vervangen/gestorven/verloren

    notes text,

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_queen_status on queens(status);
create index idx_queens_owner on queens(owner_id);
create index idx_queens_org on queens(organization_id);

create trigger trg_queen_updated
before update on queens
for each row
execute function set_updated_at();

-- =====================================================
-- COLONIES (bijenvolken)
-- =====================================================

create table colonies (

    id uuid primary key default gen_random_uuid(),

    name text not null,             -- eigen naam/nummer van het volk

    apiary_id uuid
        references apiaries(id)
        on delete restrict,

    hive_id uuid
        references hives(id)
        on delete restrict,

    queen_id uuid
        references queens(id)
        on delete set null,

    status colony_status default 'active',

    origin_swarm_id uuid,           -- fk naar swarms, later toegevoegd (zie onder)

    established_date date default current_date,

    notes text,

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    deleted_at timestamptz,  -- soft delete, zie Sprint 34

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_colony_apiary on colonies(apiary_id);
create index idx_colony_status on colonies(status);
create index idx_colonies_owner on colonies(owner_id);
create index idx_colonies_org on colonies(organization_id);
create index idx_colonies_trash on colonies(organization_id) where deleted_at is not null;

create trigger trg_colony_updated
before update on colonies
for each row
execute function set_updated_at();

-- Reverse link koningin -> volk (queens bestond al vóór colonies bestond,
-- dus deze kolom kan pas nu toegevoegd worden). Threadt ook de actieve
-- koningin op elke inspectie bij aanmaken, zodat historie correct blijft na
-- latere vervangingen (zie inspections.queen_id verderop).
alter table queens
  add column colony_id uuid references colonies(id) on delete set null;

create index idx_queens_colony on queens(colony_id);

-- =====================================================
-- COLONY HISTORY (log van kast/koningin/standplaats wissels)
-- =====================================================

create table colony_history (

    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    changed_at timestamptz default now(),

    field_changed text not null,    -- 'hive', 'queen', 'apiary', 'status'
    old_value text,
    new_value text,

    reason text,                    -- bv. 'zwerm', 'koningin dood', 'verplaatst naar heide'

    created_at timestamptz default now()

);

create index idx_colony_history_colony on colony_history(colony_id);

-- =====================================================
-- INSPECTIONS (volkinspecties)
-- =====================================================

create table inspections (

    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    inspection_date date not null default current_date,

    queen_seen boolean,
    eggs_seen boolean,
    brood_pattern brood_pattern default 'not_assessed',

    temperament temperament default 'normal',

    frames_of_bees integer,         -- geschatte volkssterkte in ramen
    frames_of_brood integer,

    honey_stores text,              -- inschatting: laag/gemiddeld/hoog
    pollen_stores text,

    varroa_count integer,           -- mijtenval bij telling
    swarm_cells_seen boolean default false,
    queen_cells_seen boolean default false,

    weather text,

    notes text,

    queen_id uuid references queens(id) on delete set null,
    created_by uuid references auth.users(id) on delete set null default auth.uid(),

    deleted_at timestamptz,  -- soft delete, zie Sprint 34

    created_at timestamptz default now()

);

create index idx_inspections_colony on inspections(colony_id);
create index idx_inspections_date on inspections(inspection_date);
create index idx_inspections_created_by on inspections(created_by);
create index idx_inspections_trash on inspections(colony_id) where deleted_at is not null;

-- =====================================================
-- TREATMENTS (varroa- en ziektebehandelingen)
-- =====================================================

create table treatments (

    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    treatment_date date not null default current_date,

    type treatment_type not null,
    method treatment_method,

    dosage text,

    mite_drop_before integer,
    mite_drop_after integer,

    notes text,

    created_at timestamptz default now()

);

create index idx_treatments_colony on treatments(colony_id);
create index idx_treatments_date on treatments(treatment_date);

-- =====================================================
-- FEEDINGS (voeren)
-- =====================================================

create table feedings (

    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    feeding_date date not null default current_date,

    type feed_type default 'sugar_syrup',
    amount_liters numeric(6,2),
    amount_kg numeric(6,2),

    notes text,

    created_at timestamptz default now()

);

create index idx_feedings_colony on feedings(colony_id);

-- =====================================================
-- VARROA COUNTS (losse mijtentellingen, los van een volledige inspectie)
-- =====================================================
-- Standalone van inspections.varroa_count (een mijtenval-meting tijdens een
-- volledige inspectie) — dit is voor een losse telling, bv. een suikerroltest/
-- alcoholwas tussen inspecties door.

create table varroa_counts (
    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    count_date date not null default current_date,

    method varroa_method default 'natural_drop',
    mite_count integer not null,
    sample_size integer,

    notes text,

    created_at timestamptz default now()
);

create index idx_varroa_counts_colony on varroa_counts(colony_id);
create index idx_varroa_counts_date on varroa_counts(count_date);

alter table varroa_counts enable row level security;
create policy varroa_counts_access on varroa_counts
  for all
  using (exists (
    select 1 from colonies c
    where c.id = varroa_counts.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = varroa_counts.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

grant select, insert, update, delete on varroa_counts to anon, authenticated;

-- =====================================================
-- WEIGHT LOGS (kastweging)
-- =====================================================

create table weight_logs (
    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    log_date date not null default current_date,
    weight_kg numeric(6,2) not null,

    notes text,

    created_at timestamptz default now()
);

create index idx_weight_logs_colony on weight_logs(colony_id);
create index idx_weight_logs_date on weight_logs(log_date);

alter table weight_logs enable row level security;
create policy weight_logs_access on weight_logs
  for all
  using (exists (
    select 1 from colonies c
    where c.id = weight_logs.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = weight_logs.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

grant select, insert, update, delete on weight_logs to anon, authenticated;

-- =====================================================
-- INSPECTION PHOTOS (foto's/media bij inspecties)
-- =====================================================
-- Gebruikt de "photos"-bucket (zie STORAGE-sectie onderaan). Storage-
-- object-paden zijn "<colony_id>/<bestandsnaam>" — de storage-policy
-- onderaan leest het colony_id-segment uit het pad en hergebruikt dezelfde
-- toegangscheck als deze tabel.

create table inspection_photos (
    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    inspection_id uuid references inspections(id) on delete set null,

    storage_path text not null,
    category photo_category default 'other',
    caption text,

    taken_date date not null default current_date,

    created_by uuid references auth.users(id) on delete set null default auth.uid(),

    deleted_at timestamptz,  -- soft delete, zie Sprint 34 (bestand blijft in
                             -- storage tot de purge-job na de hersteltermijn)

    created_at timestamptz default now()
);

create index idx_inspection_photos_colony on inspection_photos(colony_id);
create index idx_inspection_photos_inspection on inspection_photos(inspection_id);
create index idx_photos_trash on inspection_photos(colony_id) where deleted_at is not null;

alter table inspection_photos enable row level security;
create policy inspection_photos_access on inspection_photos
  for all
  using (exists (
    select 1 from colonies c
    where c.id = inspection_photos.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = inspection_photos.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

grant select, insert, update, delete on inspection_photos to anon, authenticated;

-- =====================================================
-- SWARMS (zwermen)
-- =====================================================

create table swarms (

    id uuid primary key default gen_random_uuid(),

    source_colony_id uuid
        references colonies(id)
        on delete set null,         -- eigen volk dat zwermde (indien bekend)

    swarm_date date not null default current_date,

    outcome swarm_outcome not null,

    caught_apiary_id uuid
        references apiaries(id)
        on delete set null,

    resulting_colony_id uuid
        references colonies(id)
        on delete set null,         -- als de zwerm een nieuw volk werd

    estimated_size text,            -- klein/middel/groot

    notes text,

    created_at timestamptz default now()

);

create index idx_swarms_source on swarms(source_colony_id);

alter table colonies
    add constraint fk_colony_origin_swarm
    foreign key (origin_swarm_id)
    references swarms(id)
    on delete set null;

-- =====================================================
-- HARVESTS (honingoogst)
-- =====================================================

create table harvests (

    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        references colonies(id)
        on delete set null,

    apiary_id uuid
        references apiaries(id)
        on delete set null,

    harvest_date date not null default current_date,

    honey_type honey_type default 'mixed',

    amount_kg numeric(6,2) not null,

    frames_extracted integer,

    notes text,

    created_at timestamptz default now()

);

create index idx_harvests_colony on harvests(colony_id);
create index idx_harvests_date on harvests(harvest_date);

-- =====================================================
-- CUSTOMERS (bv. honingafnemers, winkels, markten)
-- =====================================================

create table customers (

    id uuid primary key default gen_random_uuid(),

    name text not null,
    type customer_type not null default 'person',

    phone text,
    mobile text,
    email text,

    status customer_status not null default 'prospect',

    notes text,

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()

);

create index idx_customer_name on customers(name);
create index idx_customer_status on customers(status);
create index idx_customers_owner on customers(owner_id);
create index idx_customers_org on customers(organization_id);

create trigger trg_customer_updated
before update on customers
for each row
execute function set_updated_at();

-- =====================================================
-- CONTACT HISTORY
-- =====================================================

create table contacts (

    id uuid primary key default gen_random_uuid(),

    customer_id uuid
        not null
        references customers(id)
        on delete cascade,

    contact_date timestamptz default now(),

    type contact_type default 'call',

    note text,

    next_action_date date,

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_contacts_customer on contacts(customer_id);

create trigger trg_contact_updated
before update on contacts
for each row
execute function set_updated_at();

-- =====================================================
-- TASKS
-- =====================================================

create table tasks (

    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        references colonies(id)
        on delete cascade,

    apiary_id uuid
        references apiaries(id)
        on delete cascade,

    customer_id uuid
        references customers(id)
        on delete cascade,

    title text not null,
    description text,

    due_date date,
    completed boolean default false,
    priority task_priority default 'normal',

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_tasks_due on tasks(due_date);
create index idx_tasks_completed on tasks(completed);
create index idx_tasks_owner on tasks(owner_id);
create index idx_tasks_org on tasks(organization_id);

create trigger trg_tasks_updated
before update on tasks
for each row
execute function set_updated_at();

-- =====================================================
-- DOCUMENTS
-- =====================================================

create table documents (

    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        references colonies(id)
        on delete cascade,

    apiary_id uuid
        references apiaries(id)
        on delete cascade,

    customer_id uuid
        references customers(id)
        on delete cascade,

    hive_id uuid
        references hives(id)
        on delete cascade,

    filename text not null,
    storage_path text not null,

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    uploaded_at timestamptz default now()

);

create index idx_documents_colony on documents(colony_id);
create index idx_documents_hive on documents(hive_id);
create index idx_documents_owner on documents(owner_id);
create index idx_documents_org on documents(organization_id);

-- =====================================================
-- LABELS & TIJDLIJN (vrije tagging)
-- =====================================================

create table labels (

    id uuid primary key default gen_random_uuid(),

    name text not null,
    color text not null default '#d4a017',

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    created_at timestamptz default now()

);

create unique index idx_labels_org_name on labels(organization_id, name);

alter table labels enable row level security;
create policy labels_access on labels
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

grant select, insert, update, delete on labels to anon, authenticated;

create table hive_labels (
    hive_id uuid not null references hives(id) on delete cascade,
    label_id uuid not null references labels(id) on delete cascade,

    created_at timestamptz default now(),

    primary key (hive_id, label_id)
);

create index idx_hive_labels_label on hive_labels(label_id);

alter table hive_labels enable row level security;
create policy hive_labels_access on hive_labels
  for all
  using (exists (
    select 1 from hives h
    where h.id = hive_labels.hive_id
      and is_owner_or_org_member(h.owner_id, h.organization_id)
  ))
  with check (exists (
    select 1 from hives h
    where h.id = hive_labels.hive_id
      and is_owner_or_org_member(h.owner_id, h.organization_id)
  ));

grant select, insert, update, delete on hive_labels to anon, authenticated;

-- =====================================================
-- VOORRAAD & FINANCIËN (basis)
-- =====================================================
-- Puur registratie, geen facturatie of boekhoudkoppeling. Zelfde owner/org
-- RLS-patroon als apiaries/hives/customers (top-level, geen colony-kind).

create table inventory_items (

    id uuid primary key default gen_random_uuid(),

    name text not null,
    category inventory_category not null default 'materialen',
    quantity integer not null default 0,

    notes text,

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index idx_inventory_items_owner on inventory_items(owner_id);
create index idx_inventory_items_org on inventory_items(organization_id);

create trigger trg_inventory_items_updated
before update on inventory_items
for each row
execute function set_updated_at();

alter table inventory_items enable row level security;
create policy inventory_items_access on inventory_items
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

grant select, insert, update, delete on inventory_items to anon, authenticated;

create table finance_entries (

    id uuid primary key default gen_random_uuid(),

    type finance_entry_type not null,
    amount numeric(10,2) not null,
    entry_date date not null default current_date,
    description text,

    apiary_id uuid references apiaries(id) on delete set null,
    colony_id uuid references colonies(id) on delete set null,

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    created_at timestamptz default now()
);

create index idx_finance_entries_owner on finance_entries(owner_id);
create index idx_finance_entries_org on finance_entries(organization_id);
create index idx_finance_entries_date on finance_entries(entry_date);

alter table finance_entries enable row level security;
create policy finance_entries_access on finance_entries
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

grant select, insert, update, delete on finance_entries to anon, authenticated;

-- =====================================================
-- KONINGINNENTEELT-KALENDER
-- =====================================================
-- Celrijpheid/uitloop/bevruchtingsvenster worden NIET opgeslagen — die zijn
-- een pure functie van larvae_transfer_date (zie src/lib/breedingSchedule.ts)
-- en worden in de UI berekend, niet gedupliceerd in de database.

create table breeding_rounds (

    id uuid primary key default gen_random_uuid(),

    method breeding_method not null default 'nicot',
    larvae_transfer_date date not null,

    cell_apiary_id uuid references apiaries(id) on delete set null,
    mating_apiary_id uuid references apiaries(id) on delete set null,

    status breeding_round_status not null default 'planned',
    notes text,

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index idx_breeding_rounds_owner on breeding_rounds(owner_id);
create index idx_breeding_rounds_org on breeding_rounds(organization_id);
create index idx_breeding_rounds_date on breeding_rounds(larvae_transfer_date);

create trigger trg_breeding_rounds_updated
before update on breeding_rounds
for each row
execute function set_updated_at();

alter table breeding_rounds enable row level security;
create policy breeding_rounds_access on breeding_rounds
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

grant select, insert, update, delete on breeding_rounds to anon, authenticated;

-- Optionele terugkoppeling: welke teeltronde leverde deze koningin op
-- (breeding_rounds bestond nog niet toen queens werd aangemaakt).
alter table queens
  add column breeding_round_id uuid references breeding_rounds(id) on delete set null;

create index idx_queens_breeding_round on queens(breeding_round_id);

-- =====================================================
-- KASTOPBOUW-HISTORIE (mutatielog ramen/honingkamers)
-- =====================================================
-- Losstaand van inspecties — dit is een mutatielog van de fysieke opbouw,
-- niet van de volkstoestand. Gekoppeld aan hive_id (het fysieke
-- kastmateriaal), niet colony_id. De actuele opbouw wordt NIET opgeslagen:
-- die volgt uit hives.box_count/frame_count (de staat bij aanmaken) plus de
-- som van deze mutaties — berekend in de UI, niet gedupliceerd hier.

create table hive_component_changes (

    id uuid primary key default gen_random_uuid(),

    hive_id uuid
        not null
        references hives(id)
        on delete cascade,

    change_type hive_component_change_type not null,
    quantity integer not null default 1,
    change_date date not null default current_date,

    notes text,

    created_at timestamptz default now()

);

create index idx_hive_component_changes_hive on hive_component_changes(hive_id);
create index idx_hive_component_changes_date on hive_component_changes(change_date);

alter table hive_component_changes enable row level security;
create policy hive_component_changes_access on hive_component_changes
  for all
  using (exists (
    select 1 from hives h
    where h.id = hive_component_changes.hive_id
      and is_owner_or_org_member(h.owner_id, h.organization_id)
  ))
  with check (exists (
    select 1 from hives h
    where h.id = hive_component_changes.hive_id
      and is_owner_or_org_member(h.owner_id, h.organization_id)
  ));

grant select, insert, update, delete on hive_component_changes to anon, authenticated;

-- =====================================================
-- GEZONDHEID & INCIDENTEN-LOG
-- =====================================================
-- Los van treatments — dit signaleert een probleem, treatments is de actie
-- erop. resolved_treatment_id is een optionele terugkoppeling zodra een
-- incident daadwerkelijk is opgelost door een geregistreerde behandeling.

create table health_incidents (

    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    category health_incident_category not null default 'other',
    description text,
    incident_date date not null default current_date,

    status health_incident_status not null default 'open',
    resolved_treatment_id uuid references treatments(id) on delete set null,

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_health_incidents_colony on health_incidents(colony_id);
create index idx_health_incidents_status on health_incidents(status);

create trigger trg_health_incidents_updated
before update on health_incidents
for each row
execute function set_updated_at();

alter table health_incidents enable row level security;
create policy health_incidents_access on health_incidents
  for all
  using (exists (
    select 1 from colonies c
    where c.id = health_incidents.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ))
  with check (exists (
    select 1 from colonies c
    where c.id = health_incidents.colony_id
      and is_owner_or_org_member(c.owner_id, c.organization_id)
  ));

grant select, insert, update, delete on health_incidents to anon, authenticated;

-- =====================================================================
-- =====================================================================
-- GAME / DONATIE ELEMENT
-- Donateurs kunnen een volk sponsoren. Hun donaties bouwen een
-- percentage-aandeel op in dat volk. Bij voldoende donaties ontgrendelt
-- een kast automatisch een upgrade (extra honingkamer, nieuwe koningin...).
-- Bij elke oogst krijgen alle aandeelhouders automatisch een eigen
-- honingpotje, evenredig aan hun aandeel.
-- =====================================================================
-- =====================================================================

-- =====================================================
-- ENUMS (donatie/game)
-- =====================================================

create type donation_tier as enum (
  'bronze',    -- < 20 euro
  'silver',    -- 20 - 49 euro
  'gold',      -- 50 - 99 euro
  'platinum'   -- >= 100 euro
);

create type hive_upgrade_type as enum (
  'extra_super',     -- extra honingkamer
  'new_queen',        -- nieuwe koningin
  'insulation',        -- winterisolatie
  'varroa_kit',        -- varroa-behandelset
  'roof_repair',       -- dakreparatie
  'feeder_upgrade',    -- betere voederbak
  'other'
);

-- =====================================================
-- DONATIONS (donaties per volk)
-- =====================================================

create table donations (

    id uuid primary key default gen_random_uuid(),

    customer_id uuid
        not null
        references customers(id)
        on delete cascade,

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    donation_date date not null default current_date,

    amount_eur numeric(8,2) not null check (amount_eur > 0),

    tier donation_tier,      -- wordt automatisch gezet door trg_set_donation_tier

    message text,           -- optioneel bericht van de donateur

    created_at timestamptz default now()

);

create index idx_donations_colony on donations(colony_id);
create index idx_donations_customer on donations(customer_id);

-- Bepaalt automatisch de tier op basis van het gedoneerde bedrag
create or replace function set_donation_tier()
returns trigger
language plpgsql
as $$
begin
    new.tier :=
        case
            when new.amount_eur >= 100 then 'platinum'
            when new.amount_eur >= 50  then 'gold'
            when new.amount_eur >= 20  then 'silver'
            else 'bronze'
        end::donation_tier;
    return new;
end;
$$;

create trigger trg_set_donation_tier
before insert or update of amount_eur on donations
for each row
execute function set_donation_tier();

-- =====================================================
-- HIVE UPGRADES (doelen die ontgrendeld worden door donaties)
-- =====================================================

create table hive_upgrades (

    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    upgrade_type hive_upgrade_type not null,

    cost_eur numeric(8,2) not null,

    unlocked boolean default false,
    unlocked_date date,

    notes text,

    created_at timestamptz default now()

);

create index idx_upgrades_colony on hive_upgrades(colony_id);
create index idx_upgrades_unlocked on hive_upgrades(unlocked);

-- Ontgrendel automatisch upgrades zodra totale donaties de kosten dekken
create or replace function check_hive_upgrades()
returns trigger
language plpgsql
as $$
declare
    total_donated numeric(10,2);
begin
    select coalesce(sum(amount_eur), 0)
    into total_donated
    from donations
    where colony_id = new.colony_id;

    update hive_upgrades
    set unlocked = true,
        unlocked_date = current_date
    where colony_id = new.colony_id
      and unlocked = false
      and cost_eur <= total_donated;

    -- log elke nieuwe ontgrendeling in colony_history
    insert into colony_history (colony_id, field_changed, old_value, new_value, reason)
    select new.colony_id, 'upgrade', 'locked', 'unlocked', upgrade_type::text
    from hive_upgrades
    where colony_id = new.colony_id
      and unlocked = true
      and unlocked_date = current_date;

    return new;
end;
$$;

create trigger trg_check_upgrades
after insert on donations
for each row
execute function check_hive_upgrades();

-- =====================================================
-- COLONY SHARES (aandelen o.b.v. donaties)
-- =====================================================

create table colony_shares (

    id uuid primary key default gen_random_uuid(),

    customer_id uuid
        not null
        references customers(id)
        on delete cascade,

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    share_percentage numeric(5,2) not null default 0
        check (share_percentage between 0 and 100),

    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    unique (customer_id, colony_id)

);

create index idx_shares_colony on colony_shares(colony_id);
create index idx_shares_customer on colony_shares(customer_id);

create trigger trg_shares_updated
before update on colony_shares
for each row
execute function set_updated_at();

-- Herbereken aandeel: elke donateur krijgt % van totale donaties aan dat volk
create or replace function recalc_colony_shares()
returns trigger
language plpgsql
as $$
declare
    total numeric(10,2);
begin
    select coalesce(sum(amount_eur), 0)
    into total
    from donations
    where colony_id = new.colony_id;

    if total > 0 then
        insert into colony_shares (customer_id, colony_id, share_percentage)
        select
            d.customer_id,
            d.colony_id,
            round(100 * sum(d.amount_eur) / total, 2)
        from donations d
        where d.colony_id = new.colony_id
        group by d.customer_id, d.colony_id
        on conflict (customer_id, colony_id)
        do update set
            share_percentage = excluded.share_percentage,
            updated_at = now();
    end if;

    return new;
end;
$$;

create trigger trg_recalc_shares
after insert on donations
for each row
execute function recalc_colony_shares();

-- =====================================================
-- HONEY REWARDS (potje honing per aandeelhouder bij oogst)
-- =====================================================

create table honey_rewards (

    id uuid primary key default gen_random_uuid(),

    harvest_id uuid
        not null
        references harvests(id)
        on delete cascade,

    customer_id uuid
        not null
        references customers(id)
        on delete cascade,

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    share_percentage numeric(5,2) not null,
    reward_kg numeric(6,2) not null,

    claimed boolean default false,
    claimed_date date,

    created_at timestamptz default now()

);

create index idx_rewards_customer on honey_rewards(customer_id);
create index idx_rewards_harvest on honey_rewards(harvest_id);
create index idx_rewards_claimed on honey_rewards(claimed);

-- Percentage van de oogst dat gereserveerd wordt voor aandeelhouders
-- (10% is een voorbeeld, pas aan naar wens)
create or replace function distribute_honey_rewards()
returns trigger
language plpgsql
as $$
declare
    reward_pool numeric(8,2);
begin
    if new.colony_id is null then
        return new;
    end if;

    reward_pool := new.amount_kg * 0.10;

    insert into honey_rewards (harvest_id, customer_id, colony_id, share_percentage, reward_kg)
    select
        new.id,
        cs.customer_id,
        cs.colony_id,
        cs.share_percentage,
        round(reward_pool * cs.share_percentage / 100, 2)
    from colony_shares cs
    where cs.colony_id = new.colony_id
      and cs.share_percentage > 0;

    return new;
end;
$$;

create trigger trg_distribute_rewards
after insert on harvests
for each row
execute function distribute_honey_rewards();

-- =====================================================
-- AUDIT TRAIL (Sprint 33)
-- =====================================================
-- Belangrijke mutaties op organisatieniveau traceerbaar: wie deed wat,
-- wanneer, en wat de oude/nieuwe waarde was. Niet elke read/klik — alleen
-- eigenaarswissel, verplaatsing, verwijdering, rolwijziging, org-instellingen.
--
-- Twee schrijfpaden, met opzet:
--   1. Expliciete app-level calls via log_audit_event() (RPC) vanuit
--      mutatie-flows die geen enkele-kolom-trigger kunnen uitdrukken
--      (bijv. org-instellingen: meerdere velden tegelijk).
--   2. DB-triggers als primair pad op de kolomgebaseerde gevallen
--      (rolwijziging, eigenaarswissel, verplaatsing, verwijdering) —
--      SECURITY DEFINER, dus die werken ook als een grant/policy op
--      audit_log ooit vergeten wordt. Precies de bugklasse die de
--      ontbrekende GRANTs op inspection_photos en 8 andere tabellen
--      (Sprint 15-28) veroorzaakte — hier bewust ontworpen om daar niet
--      opnieuw tegenaan te lopen.

create table audit_log (
    id uuid primary key default gen_random_uuid(),

    organization_id uuid not null references organizations(id) on delete cascade,
    actor_user_id uuid references auth.users(id) on delete set null,

    action_type text not null,      -- 'kast.owner_changed', 'kast.deleted', 'volk.deleted',
                                     -- 'volk.owner_changed', 'volk.moved', 'inspectie.deleted',
                                     -- 'foto.deleted', 'user.role_changed', 'org.deleted',
                                     -- 'org.settings_changed', ...
    entity_type text not null,
    entity_id uuid not null,

    changes jsonb,                  -- { field: { old, new } }
    metadata jsonb,                 -- optioneel: reden/comment, ip, user-agent

    created_at timestamptz not null default now()
);

create index idx_audit_log_org on audit_log(organization_id, created_at desc);
create index idx_audit_log_entity on audit_log(entity_type, entity_id);
create index idx_audit_log_actor on audit_log(actor_user_id);

alter table audit_log enable row level security;

-- Alleen eigenaar/beheerder van de organisatie leest het audit-log, nooit
-- cross-tenant.
create policy audit_log_select on audit_log
  for select using (is_org_admin(organization_id));

-- Insert alleen voor jezelf, binnen een org waar je lid van bent — de RPC
-- hieronder is de bedoelde ingang, maar deze policy staat ook een directe
-- insert toe zolang actor_user_id niet gespoofed wordt.
create policy audit_log_insert on audit_log
  for insert with check (
    actor_user_id = auth.uid() and is_org_member(organization_id)
  );

-- Bewust geen anon in deze grant (in tegenstelling tot de meeste andere
-- tabellen hier) — audit_log heeft geen legitieme unauthenticated-read, en
-- dit is gevoeligere data dan de rest van het schema.
grant select, insert on audit_log to authenticated;

-- log_audit_event() — het expliciete schrijfpad. security invoker
-- (default): respecteert audit_log_insert hierboven, dus de aanroeper kan
-- alleen loggen voor zichzelf, binnen zijn eigen org. actor_user_id komt
-- altijd uit auth.uid(), nooit uit een parameter — een caller kan dus nooit
-- een event namens iemand anders loggen.
create or replace function log_audit_event(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text,
  p_entity_id uuid,
  p_changes jsonb default null,
  p_metadata jsonb default null
)
returns uuid
language sql
as $$
  insert into audit_log (organization_id, actor_user_id, action_type, entity_type, entity_id, changes, metadata)
  values (p_organization_id, auth.uid(), p_action_type, p_entity_type, p_entity_id, p_changes, p_metadata)
  returning id;
$$;

-- Postgres grant EXECUTE op nieuwe functies standaard aan PUBLIC — zonder
-- deze revoke zou elke ingelogde gebruiker deze RPC (en daarmee, via
-- audit_log_insert, elke org waar hij lid van is) kunnen aanroepen buiten
-- de bedoelde app-flows om. Onschadelijk op zich (insert-only, eigen
-- actor_user_id), maar minimale grant-oppervlakte is hier bewust gekozen.
revoke execute on function log_audit_event(uuid, text, text, uuid, jsonb, jsonb) from public;
grant execute on function log_audit_event(uuid, text, text, uuid, jsonb, jsonb) to authenticated;

-- Trigger-vangnetten: security definer + eigen insert (niet via de RPC)
-- zodat deze altijd werken, ook los van audit_log_insert/grants. Een
-- dubbele log-regel bij een flow die zowel de RPC aanroept als hier een
-- trigger raakt is aanvaardbaar (audit-log mag te veel zijn, nooit te
-- weinig).

create or replace function fn_audit_hive_owner_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.owner_id is distinct from OLD.owner_id then
    insert into audit_log (organization_id, actor_user_id, action_type, entity_type, entity_id, changes)
    values (
      NEW.organization_id, auth.uid(), 'kast.owner_changed', 'hive', NEW.id,
      jsonb_build_object('owner_id', jsonb_build_object('old', OLD.owner_id, 'new', NEW.owner_id))
    );
  end if;
  return NEW;
end;
$$;

create trigger trg_audit_hive_owner_change
after update of owner_id on hives
for each row
when (NEW.organization_id is not null)
execute function fn_audit_hive_owner_change();

create or replace function fn_audit_colony_owner_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.owner_id is distinct from OLD.owner_id then
    insert into audit_log (organization_id, actor_user_id, action_type, entity_type, entity_id, changes)
    values (
      NEW.organization_id, auth.uid(), 'volk.owner_changed', 'colony', NEW.id,
      jsonb_build_object('owner_id', jsonb_build_object('old', OLD.owner_id, 'new', NEW.owner_id))
    );
  end if;
  return NEW;
end;
$$;

create trigger trg_audit_colony_owner_change
after update of owner_id on colonies
for each row
when (NEW.organization_id is not null)
execute function fn_audit_colony_owner_change();

create or replace function fn_audit_colony_moved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.apiary_id is distinct from OLD.apiary_id then
    insert into audit_log (organization_id, actor_user_id, action_type, entity_type, entity_id, changes)
    values (
      NEW.organization_id, auth.uid(), 'volk.moved', 'colony', NEW.id,
      jsonb_build_object('apiary_id', jsonb_build_object('old', OLD.apiary_id, 'new', NEW.apiary_id))
    );
  end if;
  return NEW;
end;
$$;

create trigger trg_audit_colony_moved
after update of apiary_id on colonies
for each row
when (NEW.organization_id is not null)
execute function fn_audit_colony_moved();

create or replace function fn_audit_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.role is distinct from OLD.role then
    insert into audit_log (organization_id, actor_user_id, action_type, entity_type, entity_id, changes, metadata)
    values (
      NEW.organization_id, auth.uid(), 'user.role_changed', 'organization_member', NEW.id,
      jsonb_build_object('role', jsonb_build_object('old', OLD.role, 'new', NEW.role)),
      jsonb_build_object('target_user_id', NEW.user_id)
    );
  end if;
  return NEW;
end;
$$;

create trigger trg_audit_role_change
after update of role on organization_members
for each row
execute function fn_audit_role_change();

-- =====================================================
-- VERWIJDEREN & HERSTELBELEID (Sprint 34)
-- =====================================================
-- deleted_at-kolommen staan al op hives/colonies/inspections/
-- inspection_photos/organizations (zie die tabellen hierboven). Dit is de
-- cascade, de audit-vangnetten op verwijdering, en de purge-kant.
--
-- RLS-keuze: bestaande policies op deze tabellen blijven ongewijzigd
-- (ownership-gebaseerd). "Zichtbaar in de gewone lijst" vs. "zichtbaar in
-- de prullenbak" is een applicatie-laag-keuze (query filtert wel/niet op
-- deleted_at is null), geen autorisatie-vraag — RLS is voor wie mag zien,
-- niet voor welke levenscyclus-status.
--
-- ⚠️ NIET automatisch ingepland: purge_expired_soft_deletes() en
-- purge_organization() moeten door een scheduler (pg_cron, of een externe
-- cron die een API-route aanroept) aangeroepen worden — welke scheduler
-- beschikbaar is op de self-hosted Docker-instance is een infra-keuze.
-- Test deze functies (in een transactie, met rollback) voordat je ze aan
-- een schema koppelt: ze zijn nog niet tegen een echte database getest.

-- Kast verwijderen → volken in die kast mee (soft), niet hard.
create or replace function fn_cascade_hive_soft_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.deleted_at is not null and OLD.deleted_at is null then
    update colonies
    set deleted_at = NEW.deleted_at
    where hive_id = NEW.id and deleted_at is null;
  end if;
  return NEW;
end;
$$;

create trigger trg_cascade_hive_soft_delete
after update of deleted_at on hives
for each row
execute function fn_cascade_hive_soft_delete();

create or replace function fn_audit_hive_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.deleted_at is not null and OLD.deleted_at is null then
    insert into audit_log (organization_id, actor_user_id, action_type, entity_type, entity_id)
    values (NEW.organization_id, auth.uid(), 'kast.deleted', 'hive', NEW.id);
  end if;
  return NEW;
end;
$$;

create trigger trg_audit_hive_deleted
after update of deleted_at on hives
for each row
when (NEW.organization_id is not null)
execute function fn_audit_hive_deleted();

create or replace function fn_audit_colony_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.deleted_at is not null and OLD.deleted_at is null then
    insert into audit_log (organization_id, actor_user_id, action_type, entity_type, entity_id)
    values (NEW.organization_id, auth.uid(), 'volk.deleted', 'colony', NEW.id);
  end if;
  return NEW;
end;
$$;

create trigger trg_audit_colony_deleted
after update of deleted_at on colonies
for each row
when (NEW.organization_id is not null)
execute function fn_audit_colony_deleted();

-- inspections/inspection_photos hebben geen organization_id direct — die
-- wordt via colonies opgezocht.

create or replace function fn_audit_inspection_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  if NEW.deleted_at is not null and OLD.deleted_at is null then
    select organization_id into v_org_id from colonies where id = NEW.colony_id;
    if v_org_id is not null then
      insert into audit_log (organization_id, actor_user_id, action_type, entity_type, entity_id)
      values (v_org_id, auth.uid(), 'inspectie.deleted', 'inspection', NEW.id);
    end if;
  end if;
  return NEW;
end;
$$;

create trigger trg_audit_inspection_deleted
after update of deleted_at on inspections
for each row
execute function fn_audit_inspection_deleted();

create or replace function fn_audit_photo_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  if NEW.deleted_at is not null and OLD.deleted_at is null then
    select organization_id into v_org_id from colonies where id = NEW.colony_id;
    if v_org_id is not null then
      insert into audit_log (organization_id, actor_user_id, action_type, entity_type, entity_id)
      values (v_org_id, auth.uid(), 'foto.deleted', 'inspection_photo', NEW.id);
    end if;
  end if;
  return NEW;
end;
$$;

create trigger trg_audit_photo_deleted
after update of deleted_at on inspection_photos
for each row
execute function fn_audit_photo_deleted();

create or replace function fn_audit_org_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.deleted_at is not null and OLD.deleted_at is null then
    insert into audit_log (organization_id, actor_user_id, action_type, entity_type, entity_id)
    values (NEW.id, auth.uid(), 'org.deleted', 'organization', NEW.id);
  end if;
  return NEW;
end;
$$;

create trigger trg_audit_org_deleted
after update of deleted_at on organizations
for each row
execute function fn_audit_org_deleted();

-- Purge: routine-entiteiten (kasten/volken/inspecties). Volk-purge
-- cascadeert al naar treatments/feedings/harvests/foto's/varroa_counts/
-- weight_logs/health_incidents/donations/colony_shares/hive_upgrades/
-- honey_rewards/colony_history/tasks/documents via de bestaande
-- "on delete cascade"-constraints hierboven. Kast-purge cascadeert naar
-- hive_component_changes/hive_labels/documents op dezelfde manier.
-- Losstaand verwijderde inspecties (kolonie blijft bestaan) worden apart
-- gepurged.

create or replace function purge_expired_soft_deletes(p_retention_days integer default 30)
returns table(hives_purged integer, colonies_purged integer, inspections_purged integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cutoff timestamptz := now() - (p_retention_days || ' days')::interval;
  v_inspections integer;
  v_colonies integer;
  v_hives integer;
begin
  delete from inspections where deleted_at is not null and deleted_at < v_cutoff;
  get diagnostics v_inspections = row_count;

  delete from colonies where deleted_at is not null and deleted_at < v_cutoff;
  get diagnostics v_colonies = row_count;

  delete from hives where deleted_at is not null and deleted_at < v_cutoff;
  get diagnostics v_hives = row_count;

  return query select v_hives, v_colonies, v_inspections;
end;
$$;

-- Postgres grant EXECUTE op nieuwe functies standaard aan PUBLIC — zonder
-- deze revoke zou elke ingelogde gebruiker deze purge-functie via
-- PostgREST/RPC kunnen aanroepen. Alleen bedoeld voor een scheduler die als
-- postgres/service_role draait (die grants/RLS toch al omzeilt).
revoke execute on function purge_expired_soft_deletes(integer) from public;

-- Foto's apart: de storage-file moet vóór de DB-rij verdwijnen (anders
-- verweest het bestand in de bucket). De app leest fn_photos_pending_purge(),
-- verwijdert de bestanden via de storage-API, en roept dan
-- purge_inspection_photos() aan met precies de ids die gelukt zijn.

create or replace function fn_photos_pending_purge(p_retention_days integer default 30)
returns table(id uuid, storage_path text)
language sql
security definer
set search_path = public
as $$
  select p.id, p.storage_path
  from inspection_photos p
  where p.deleted_at is not null
    and p.deleted_at < now() - (p_retention_days || ' days')::interval;
$$;

revoke execute on function fn_photos_pending_purge(integer) from public;

create or replace function purge_inspection_photos(p_ids uuid[])
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  delete from inspection_photos
  where id = any(p_ids)
    and deleted_at is not null;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function purge_inspection_photos(uuid[]) from public;

-- Purge: organisatie (cooling-off + verplichte export eerst).
-- organization_id-kolommen op apiaries/hives/queens/colonies/customers/
-- labels/inventory_items/finance_entries/breeding_rounds/tasks/documents
-- staan bewust op "on delete set null" hierboven — dat beschermt tegen een
-- per-ongeluk cascade als de organizations-rij ooit los verwijderd wordt.
-- Voor een ECHTE organisatie-purge moet dus expliciet, in de juiste
-- volgorde, per tabel opgeruimd worden. swarms heeft geen organization_id
-- en cascadeert nergens vandaan (alle FK's zijn "set null") — zonder
-- expliciete opruiming hier zouden die rijen wees worden na deze purge.

create or replace function purge_organization(p_org_id uuid, p_retention_days integer default 30)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org organizations%rowtype;
begin
  select * into v_org from organizations where id = p_org_id;

  if v_org is null then
    raise exception 'Organisatie % bestaat niet (meer)', p_org_id;
  end if;
  if v_org.deleted_at is null then
    raise exception 'Organisatie % is niet als verwijderd gemarkeerd', p_org_id;
  end if;
  if v_org.deleted_at > now() - (p_retention_days || ' days')::interval then
    raise exception 'Hersteltermijn van organisatie % is nog niet verstreken', p_org_id;
  end if;
  if v_org.deletion_export_completed_at is null then
    raise exception 'Data-export voor organisatie % is nog niet voltooid — purge geblokkeerd (AVG dataportabiliteit)', p_org_id;
  end if;

  -- Wezen zonder cascade: swarms heeft geen organization_id.
  delete from swarms
  where source_colony_id in (select id from colonies where organization_id = p_org_id)
     or resulting_colony_id in (select id from colonies where organization_id = p_org_id)
     or caught_apiary_id in (select id from apiaries where organization_id = p_org_id);

  -- colonies eerst: cascadeert naar treatments/feedings/inspections/
  -- harvests/foto's/varroa_counts/weight_logs/health_incidents/donations/
  -- colony_shares/hive_upgrades/honey_rewards/colony_history/tasks/documents.
  delete from colonies where organization_id = p_org_id;

  -- hives.restrict op colonies.hive_id is nu geen probleem meer (colonies
  -- van deze org zijn weg). Cascadeert naar hive_component_changes/
  -- hive_labels/documents(hive_id).
  delete from hives where organization_id = p_org_id;

  -- apiaries.restrict op colonies.apiary_id idem. Cascadeert naar
  -- resterende tasks/documents(apiary_id).
  delete from apiaries where organization_id = p_org_id;

  -- customers cascadeert naar contacts/resterende donations/colony_shares/
  -- honey_rewards/tasks/documents(customer_id).
  delete from customers where organization_id = p_org_id;

  delete from queens where organization_id = p_org_id;
  delete from labels where organization_id = p_org_id;
  delete from inventory_items where organization_id = p_org_id;
  delete from finance_entries where organization_id = p_org_id;
  delete from breeding_rounds where organization_id = p_org_id;

  -- Vangnet: org-brede taken/documenten die aan geen enkele entiteit
  -- hingen (dus niet al via bovenstaande cascades verdwenen).
  delete from tasks where organization_id = p_org_id;
  delete from documents where organization_id = p_org_id;

  -- Laatste stap: cascadeert organization_members, organization_invitations
  -- en audit_log (bewust — geen orgaan meer om het audit-log van te tonen).
  delete from organizations where id = p_org_id;
end;
$$;

revoke execute on function purge_organization(uuid, integer) from public;

-- Account-anonimisering (AVG art. 17, i.p.v. hard delete). Rij in
-- auth.users blijft bestaan (FK's zoals owner_id/created_by/actor_user_id
-- blijven dus geldig — geen wees-audit-records nodig), maar PII wordt
-- gewist. profiles.email volgt automatisch mee via on_auth_user_created
-- hierboven (vuurt ook op UPDATE OF email op auth.users).
--
-- Sessie-invalidatie (auth.sessions/auth.refresh_tokens) is best-effort en
-- schema-versie-afhankelijk voor self-hosted GoTrue — controleer dit tegen
-- je eigen instance. De PII-scrub zelf slaagt ook als dat deel faalt.

create or replace function anonymize_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_placeholder text;
begin
  if v_uid is null then
    raise exception 'Niet ingelogd';
  end if;

  if exists (
    select 1 from organization_members me
    where me.user_id = v_uid and me.role = 'eigenaar'
    and not exists (
      select 1 from organization_members other
      where other.organization_id = me.organization_id
        and other.role = 'eigenaar'
        and other.user_id != v_uid
    )
  ) then
    raise exception 'Je bent enige eigenaar van minstens één organisatie — draag eigenaarschap over of verwijder de organisatie eerst';
  end if;

  v_placeholder := 'deleted-' || replace(v_uid::text, '-', '') || '@deleted.melion.local';

  update auth.users
  set email = v_placeholder,
      encrypted_password = null,
      raw_user_meta_data = '{}'::jsonb,
      phone = null
  where id = v_uid;

  begin
    delete from auth.sessions where user_id = v_uid;
    delete from auth.refresh_tokens where user_id = v_uid::text;
  exception when others then
    null; -- best-effort, zie comment hierboven
  end;
end;
$$;

revoke execute on function anonymize_own_account() from public;
grant execute on function anonymize_own_account() to authenticated;

-- =====================================================
-- GRANTS — oorspronkelijke tabellen
-- =====================================================
-- Expliciet i.p.v. te vertrouwen op default privileges van de cluster
-- bootstrap — voorkomt "permission denied" ondanks correcte RLS-policies.
--
-- Alleen de tabellen uit het oorspronkelijke schema staan hier gebundeld;
-- elke tabel uit Sprint 13+ grant't zichzelf direct na haar eigen RLS
-- hierboven. Dat laatste is het geleerde patroon: gescheiden houden van
-- "tabel aanmaken" en "tabel grant'en" is precies hoe 9 tabellen
-- (Sprint 15-28) zonder grant belandden en stilletjes faalden met
-- "permission denied" ondanks correcte RLS.

grant select, insert, update, delete on
    organizations, organization_members,
    apiaries, hives, queens, colonies, colony_history,
    inspections, treatments, feedings, swarms, harvests,
    customers, contacts, tasks, documents,
    donations, hive_upgrades, colony_shares, honey_rewards
to anon, authenticated;

-- =====================================================
-- RLS — root tables (owner_id + organization_id)
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
-- RLS — child tables (ownership via een parent-FK)
-- =====================================================

-- via colony_id (not null op al deze tabellen)

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

-- donations: verplichte customer_id én colony_id — toegang via colony_id

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

-- swarms: twee optionele parents (source_colony_id, caught_apiary_id) —
-- toegankelijk als één van beide resolvet naar een eigen/gedeelde rij.

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

-- harvests: twee optionele parents (colony_id, apiary_id) — zelfde patroon.

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
-- VIEWS (donatie/game overzicht)
-- =====================================================

create view colony_funding_progress with (security_invoker = true) as

select

    c.id as colony_id,
    c.name as colony_name,

    coalesce(sum(d.amount_eur), 0) as total_donated,
    count(distinct d.customer_id) as donor_count,

    count(hu.id) filter (where hu.unlocked) as upgrades_unlocked,
    count(hu.id) filter (where not hu.unlocked) as upgrades_pending

from colonies c

left join donations d on d.colony_id = c.id
left join hive_upgrades hu on hu.colony_id = c.id

group by c.id, c.name

order by total_donated desc;

create view donor_overview with (security_invoker = true) as

select

    cust.id as customer_id,
    cust.name as customer_name,

    cs.colony_id,
    col.name as colony_name,

    cs.share_percentage,

    coalesce(sum(hr.reward_kg), 0) as total_honey_earned_kg,
    count(hr.id) filter (where not hr.claimed) as unclaimed_rewards

from customers cust

join colony_shares cs on cs.customer_id = cust.id
join colonies col on col.id = cs.colony_id
left join honey_rewards hr on hr.customer_id = cust.id and hr.colony_id = cs.colony_id

group by cust.id, cust.name, cs.colony_id, col.name, cs.share_percentage

order by cust.name;

-- =====================================================
-- VIEWS (origineel)
-- =====================================================

create view colony_overview with (security_invoker = true) as

select

    c.id,
    c.name as colony_name,
    c.status,

    a.name as apiary,
    a.city,

    h.label as hive_label,
    h.type as hive_type,

    q.label as queen_label,
    q.race as queen_race,
    q.birth_year as queen_birth_year,
    q.status as queen_status

from colonies c

left join apiaries a on a.id = c.apiary_id
left join hives h on h.id = c.hive_id
left join queens q on q.id = c.queen_id

order by a.name, c.name;

create view colony_last_inspection with (security_invoker = true) as

select

    c.id as colony_id,
    c.name as colony_name,

    max(i.inspection_date) as last_inspection_date,

    (current_date - max(i.inspection_date)) as days_since_inspection

from colonies c

left join inspections i on i.colony_id = c.id

group by c.id, c.name

order by days_since_inspection desc nulls first;

-- Afgeleide status per volk (Sprint 1, SPRINT-01-07-streunding.md): geen
-- eigen sterkte-kolom in het schema, dus dit leunt op frames_of_bees uit de
-- laatste inspectie plus de "hoe lang geleden" uit colony_last_inspection.
create view colony_status_view with (security_invoker = true) as

select

    c.id as colony_id,
    c.hive_id,
    c.apiary_id,

    li.last_inspection_date,
    li.days_since_inspection,
    i.frames_of_bees,

    case
      when li.last_inspection_date is null then 'onbekend'
      when li.days_since_inspection > 21 then 'aandacht'
      when i.frames_of_bees is null then 'onbekend'
      when i.frames_of_bees < 3 then 'aandacht'
      when i.frames_of_bees < 6 then 'controleren'
      else 'goed'
    end as status

from colonies c

join colony_last_inspection li on li.colony_id = c.id

left join lateral (
  select frames_of_bees
  from inspections i2
  where i2.colony_id = c.id and i2.deleted_at is null
  order by i2.inspection_date desc
  limit 1
) i on true

where c.deleted_at is null;

-- Volkenoverzicht-tabel (Sprint 3, SPRINT-01-07-streunding.md): colony_overview
-- (volk + standplaats + kast + koningin) plus de afgeleide status hierboven,
-- in één rij per volk.
create view colony_status_overview with (security_invoker = true) as

select

    co.id as colony_id,
    co.colony_name,
    co.status as colony_status,

    co.apiary,
    co.city,

    co.hive_label,
    co.hive_type,

    co.queen_label,
    co.queen_race,
    co.queen_birth_year,
    co.queen_status,

    sv.last_inspection_date,
    sv.frames_of_bees,
    sv.status

from colony_overview co

join colony_status_view sv on sv.colony_id = co.id

order by co.apiary, co.colony_name;

create view harvest_summary with (security_invoker = true) as

select

    a.name as apiary,
    extract(year from h.harvest_date) as harvest_year,
    h.honey_type,

    sum(h.amount_kg) as total_kg,
    count(*) as harvest_count

from harvests h

join apiaries a on a.id = h.apiary_id

group by a.name, extract(year from h.harvest_date), h.honey_type

order by harvest_year desc, apiary;

grant select on
    colony_overview, colony_last_inspection, colony_status_view,
    colony_status_overview,
    colony_funding_progress, donor_overview, harvest_summary
to anon, authenticated;

-- =====================================================
-- DASHBOARD — statistieken-RPC (Sprint 2, SPRINT-01-07-streunding.md)
-- =====================================================
-- Eén call i.p.v. 6 losse queries. Leunt op auth.uid() via
-- is_owner_or_org_member (geen p_owner_id-parameter) zodat organisatieleden
-- hetzelfde te zien krijgen als via de gewone RLS op deze tabellen.

create or replace function get_dashboard_stats()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'totaal_volken', (
      select count(*) from colonies c
      where c.deleted_at is null
        and is_owner_or_org_member(c.owner_id, c.organization_id)
    ),
    'actieve_kasten', (
      select count(*) from hives h
      where h.deleted_at is null and h.in_use
        and is_owner_or_org_member(h.owner_id, h.organization_id)
    ),
    'koninginnen_gemiddelde_leeftijd', (
      select round(avg(extract(year from current_date) - q.birth_year), 1)
      from queens q
      where q.status = 'active'
        and is_owner_or_org_member(q.owner_id, q.organization_id)
    ),
    'honing_dit_seizoen_kg', (
      select coalesce(sum(h.amount_kg), 0)
      from harvests h
      join apiaries a on a.id = h.apiary_id
      where h.harvest_date >= date_trunc('year', current_date)
        and is_owner_or_org_member(a.owner_id, a.organization_id)
    ),
    'kasten_aandacht', (
      select count(*) from colony_status_view sv
      join colonies c on c.id = sv.colony_id
      where sv.status = 'aandacht'
        and is_owner_or_org_member(c.owner_id, c.organization_id)
    )
  );
$$;

grant execute on function get_dashboard_stats() to authenticated;

-- =====================================================
-- STORAGE — foto's
-- =====================================================
-- Privé bucket, geen publieke links: foto's worden bekeken via
-- time-limited signed URLs. Padconventie: {colony_id}/{bestandsnaam} — het
-- eerste padsegment is het volk, wat de policy hieronder gebruikt om
-- dezelfde toegangscheck te hergebruiken als inspection_photos_access.
--
-- CORRECTIE (Sprint 21): dit was oorspronkelijk een owner-folder-conventie
-- ({auth.uid()}/...), overgenomen uit de solo-Streunding-opzet. Die klopte
-- niet meer zodra foto's via organisaties gedeeld moesten kunnen worden —
-- elke upload werd geweigerd door RLS, ongeacht eigenaarschap, omdat de
-- policy nooit matchte. Ook een kolom-ambiguïteitsbug gehad: `name` zonder
-- schema-prefix bond aan colonies.name in plaats van storage.objects.name
-- (pg_policies bevestigde dit destijds). Hieronder staat alleen de
-- uiteindelijk correcte versie.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos', 'photos', false, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists photos_select on storage.objects;
drop policy if exists photos_insert on storage.objects;
drop policy if exists photos_delete on storage.objects;
drop policy if exists inspection_photos_storage_access on storage.objects;

create policy inspection_photos_storage_access on storage.objects
  for all
  using (
    bucket_id = 'photos'
    and exists (
      select 1 from colonies c
      where c.id::text = split_part(storage.objects.name, '/', 1)
        and is_owner_or_org_member(c.owner_id, c.organization_id)
    )
  )
  with check (
    bucket_id = 'photos'
    and exists (
      select 1 from colonies c
      where c.id::text = split_part(storage.objects.name, '/', 1)
        and is_owner_or_org_member(c.owner_id, c.organization_id)
    )
  );

-- =====================================================
-- BESTUIFVOLKEN — publiek aanbod & aanvragen (Sprint 7)
-- =====================================================
-- Publieke marketing/verkooppagina, los van het interne beheer-dashboard
-- (Sprint 1-6) maar wel gevoed vanuit dezelfde backend. Root-tabel
-- bestuifvolk_aanbod volgt hetzelfde owner_id/organization_id-patroon als
-- apiaries/hives/colonies; bestuifvolk_aanvragen is een publiek-insertbare
-- child-tabel die ownership afleidt via aanbod_id (zelfde patroon als
-- donations_access hierboven).

create table bestuifvolk_aanbod (

    id uuid primary key default gen_random_uuid(),

    naam text not null,              -- bv. "Bestuifvolk Buckfast, 5-raams"
    ras text,
    omvang text,                     -- bv. "5-raams", "1 broedbak"
    prijs numeric(6,2),

    beschikbaar_vanaf date,
    beschikbaar_tot date,
    voorraad integer not null default 0,

    regio text,                      -- leveringsgebied, bv. "Oldambt/Westerwolde"
    beschrijving text,
    actief boolean not null default true,

    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    organization_id uuid references organizations(id) on delete set null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()

);

create index idx_bestuifvolk_aanbod_owner on bestuifvolk_aanbod(owner_id);
create index idx_bestuifvolk_aanbod_org on bestuifvolk_aanbod(organization_id);
create index idx_bestuifvolk_aanbod_actief on bestuifvolk_aanbod(actief);

create trigger trg_bestuifvolk_aanbod_updated
before update on bestuifvolk_aanbod
for each row execute function set_updated_at();

alter table bestuifvolk_aanbod enable row level security;

create policy bestuifvolk_aanbod_publiek_leesbaar on bestuifvolk_aanbod
  for select
  using (actief = true);

create policy bestuifvolk_aanbod_beheer_door_eigenaar on bestuifvolk_aanbod
  for all
  using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

grant select, insert, update, delete on bestuifvolk_aanbod to anon, authenticated;

create table bestuifvolk_aanvragen (

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
    status text not null default 'nieuw',   -- nieuw / bevestigd / geleverd / geannuleerd

    created_at timestamptz not null default now()

);

create index idx_bestuifvolk_aanvragen_aanbod on bestuifvolk_aanvragen(aanbod_id);

alter table bestuifvolk_aanvragen enable row level security;

-- Iedereen mag aanmaken (publiek formulier); alleen de eigenaar/org van het
-- gekoppelde aanbod mag lezen en de status wijzigen.
create policy bestuifvolk_aanvragen_aanmaken_door_iedereen on bestuifvolk_aanvragen
  for insert
  with check (true);

create policy bestuifvolk_aanvragen_lezen_door_eigenaar on bestuifvolk_aanvragen
  for select
  using (exists (
    select 1 from bestuifvolk_aanbod a
    where a.id = bestuifvolk_aanvragen.aanbod_id
      and is_owner_or_org_member(a.owner_id, a.organization_id)
  ));

create policy bestuifvolk_aanvragen_status_door_eigenaar on bestuifvolk_aanvragen
  for update
  using (exists (
    select 1 from bestuifvolk_aanbod a
    where a.id = bestuifvolk_aanvragen.aanbod_id
      and is_owner_or_org_member(a.owner_id, a.organization_id)
  ));

grant select, update on bestuifvolk_aanvragen to authenticated;
grant insert on bestuifvolk_aanvragen to anon, authenticated;
