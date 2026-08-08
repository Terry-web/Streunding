-- =====================================================
-- Streunding — Imkerij Beheersysteem: volledig schema
-- =====================================================
-- Enige bron van waarheid: basisschema (standplaatsen, kasten, volken, ...),
-- auth/ownership/multi-tenant (organizations, RLS) en de donatie/game-module
-- in één doorlopend script.
--
-- Idempotent: alles wordt eerst verwijderd (if exists), dan opnieuw
-- opgebouwd. Open dit bestand, selecteer alles, plak het in de Supabase
-- Studio SQL-editor en druk één keer op Run.
-- =====================================================

-- =====================================================
-- RESET
-- =====================================================

drop view if exists harvest_summary;
drop view if exists colony_last_inspection;
drop view if exists colony_overview;
drop view if exists donor_overview;
drop view if exists colony_funding_progress;

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
drop table if exists organization_members cascade;
drop table if exists organizations cascade;

drop function if exists distribute_honey_rewards();
drop function if exists recalc_colony_shares();
drop function if exists check_hive_upgrades();
drop function if exists set_donation_tier();
drop function if exists is_owner_or_org_member(uuid, uuid);
drop function if exists is_org_admin(uuid);
drop function if exists is_org_member(uuid);
drop function if exists set_updated_at();

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
-- RLS — organizations / organization_members
-- =====================================================

alter table organizations enable row level security;

create policy organizations_select on organizations
  for select using (is_org_member(id) or created_by = auth.uid());

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

-- Toegestaan bij het joinen van jezelf net na het aanmaken van een org, of
-- wanneer een eigenaar/beheerder iemand anders uitnodigt (Sprint 1-flow).
create policy organization_members_insert on organization_members
  for insert with check (
    user_id = auth.uid() or is_org_admin(organization_id)
  );

create policy organization_members_update on organization_members
  for update using (is_org_admin(organization_id)) with check (is_org_admin(organization_id));

create policy organization_members_delete on organization_members
  for delete using (is_org_admin(organization_id));

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

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_hives_owner on hives(owner_id);
create index idx_hives_org on hives(organization_id);

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

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_colony_apiary on colonies(apiary_id);
create index idx_colony_status on colonies(status);
create index idx_colonies_owner on colonies(owner_id);
create index idx_colonies_org on colonies(organization_id);

create trigger trg_colony_updated
before update on colonies
for each row
execute function set_updated_at();

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

    created_at timestamptz default now()

);

create index idx_inspections_colony on inspections(colony_id);
create index idx_inspections_date on inspections(inspection_date);

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
-- GRANTS
-- =====================================================
-- Expliciet i.p.v. te vertrouwen op default privileges van de cluster
-- bootstrap — voorkomt "permission denied" ondanks correcte RLS-policies.

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
    colony_overview, colony_last_inspection,
    colony_funding_progress, donor_overview, harvest_summary
to anon, authenticated;

-- =====================================================
-- STORAGE — foto's
-- =====================================================
-- Privé bucket, geen publieke links: foto's worden bekeken via
-- time-limited signed URLs (zelfde RLS-first aanpak als de rest van het
-- schema). Padconventie: {auth.uid()}/{apiary|hive|colony}/{entity_id}/
-- {random-uuid}.{ext} — het eerste padsegment is de eigenaar, wat de
-- policies hieronder afdwingen onafhankelijk van de tabel-RLS op
-- documents (defense in depth).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos', 'photos', false, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists photos_select on storage.objects;
drop policy if exists photos_insert on storage.objects;
drop policy if exists photos_delete on storage.objects;

create policy photos_select on storage.objects
  for select
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy photos_insert on storage.objects
  for insert
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy photos_delete on storage.objects
  for delete
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
