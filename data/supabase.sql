-- =====================================================
-- Imkerij Beheersysteem v2 - Supabase
-- =====================================================

create extension if not exists pgcrypto;

-- =====================================================
-- ENUMS
-- =====================================================

create type customer_type as enum (
  'person',
  'company',
  'municipality',
  'shop',
  'market',
  'other'
);

create type customer_status as enum (
  'prospect',
  'active',
  'inactive',
  'archived'
);

create type apiary_type as enum (
  'home',
  'field',
  'orchard',
  'heather',
  'rented',
  'other'
);

create type hive_type as enum (
  'dadant',
  'simplex',
  'national',
  'warre',
  'langstroth',
  'other'
);

create type queen_race as enum (
  'carnica',
  'buckfast',
  'ligustica',
  'mellifera',
  'other'
);

create type queen_origin as enum (
  'self_bred',
  'purchased',
  'swarm_caught',
  'gift',
  'unknown'
);

create type queen_status as enum (
  'active',
  'superseded',
  'dead',
  'lost',
  'sold'
);

create type colony_status as enum (
  'active',
  'weak',
  'queenless',
  'swarmed',
  'merged',
  'dead',
  'sold'
);

create type brood_pattern as enum (
  'solid',
  'spotty',
  'none',
  'not_assessed'
);

create type temperament as enum (
  'calm',
  'normal',
  'defensive',
  'aggressive'
);

create type treatment_type as enum (
  'oxalic_acid',
  'formic_acid',
  'thymol',
  'lactic_acid',
  'other'
);

create type treatment_method as enum (
  'trickling',
  'vaporization',
  'strips',
  'spray',
  'other'
);

create type feed_type as enum (
  'sugar_syrup',
  'fondant',
  'candy',
  'pollen_patty',
  'other'
);

create type swarm_outcome as enum (
  'caught',
  'lost',
  'returned_to_colony'
);

create type honey_type as enum (
  'spring',
  'summer',
  'heather',
  'acacia',
  'mixed',
  'other'
);

-- [nieuw] voor verkooptabel
create type product_type as enum (
  'honey_250g',
  'honey_500g',
  'honey_1kg',
  'beeswax',
  'propolis',
  'pollen',
  'candle',
  'other'
);

create type contact_type as enum (
  'call',
  'email',
  'visit',
  'whatsapp',
  'follow_up',
  'other'
);

create type task_priority as enum (
  'low',
  'normal',
  'high',
  'urgent'
);

create type donation_tier as enum (
  'bronze',
  'silver',
  'gold',
  'platinum'
);

create type hive_upgrade_type as enum (
  'extra_super',
  'new_queen',
  'insulation',
  'varroa_kit',
  'roof_repair',
  'feeder_upgrade',
  'other'
);

-- =====================================================
-- HELPER FUNCTIONS
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

    owner_permission text,
    rvo_registration_number text,

    max_hives integer,

    notes text,

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_apiary_city on apiaries(city);

create trigger trg_apiary_updated
before update on apiaries
for each row
execute function set_updated_at();

-- =====================================================
-- HIVES (kasten)
-- =====================================================

create table hives (

    id uuid primary key default gen_random_uuid(),

    label text not null,

    type hive_type default 'dadant',

    frame_count integer,
    box_count integer default 1,

    purchase_date date,
    condition text,

    in_use boolean default true,

    notes text,

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create trigger trg_hive_updated
before update on hives
for each row
execute function set_updated_at();

-- =====================================================
-- QUEENS (koninginnen)
-- =====================================================

create table queens (

    id uuid primary key default gen_random_uuid(),

    label text,

    race queen_race default 'carnica',
    origin queen_origin default 'unknown',

    birth_year integer not null,
    marking_color text,
    marked boolean default false,
    clipped boolean default false,

    breeder text,

    status queen_status default 'active',

    introduced_date date,
    removed_date date,

    notes text,

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_queen_status on queens(status);

create trigger trg_queen_updated
before update on queens
for each row
execute function set_updated_at();

-- =====================================================
-- COLONIES (bijenvolken)
-- =====================================================

create table colonies (

    id uuid primary key default gen_random_uuid(),

    name text not null,

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

    origin_swarm_id uuid,   -- fk naar swarms, wordt later toegevoegd

    established_date date default current_date,

    notes text,

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_colony_apiary on colonies(apiary_id);
create index idx_colony_status on colonies(status);

create trigger trg_colony_updated
before update on colonies
for each row
execute function set_updated_at();

-- =====================================================
-- COLONY HISTORY
-- =====================================================

create table colony_history (

    id uuid primary key default gen_random_uuid(),

    colony_id uuid
        not null
        references colonies(id)
        on delete cascade,

    changed_at timestamptz default now(),

    field_changed text not null,
    old_value text,
    new_value text,

    reason text,

    created_at timestamptz default now()

);

create index idx_colony_history_colony on colony_history(colony_id);

-- [verbeterd] automatisch loggen van wijzigingen in koningin, kast, standplaats en status
create or replace function log_colony_changes()
returns trigger
language plpgsql
as $$
begin
    if old.queen_id is distinct from new.queen_id then
        insert into colony_history (colony_id, field_changed, old_value, new_value)
        values (new.id, 'queen', old.queen_id::text, new.queen_id::text);
    end if;

    if old.hive_id is distinct from new.hive_id then
        insert into colony_history (colony_id, field_changed, old_value, new_value)
        values (new.id, 'hive', old.hive_id::text, new.hive_id::text);
    end if;

    if old.apiary_id is distinct from new.apiary_id then
        insert into colony_history (colony_id, field_changed, old_value, new_value)
        values (new.id, 'apiary', old.apiary_id::text, new.apiary_id::text);
    end if;

    if old.status is distinct from new.status then
        insert into colony_history (colony_id, field_changed, old_value, new_value)
        values (new.id, 'status', old.status::text, new.status::text);
    end if;

    return new;
end;
$$;

create trigger trg_log_colony_changes
after update on colonies
for each row
execute function log_colony_changes();

-- =====================================================
-- INSPECTIONS
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

    frames_of_bees integer,
    frames_of_brood integer,

    honey_stores text,
    pollen_stores text,

    varroa_count integer,
    swarm_cells_seen boolean default false,
    queen_cells_seen boolean default false,

    weather text,

    notes text,

    created_at timestamptz default now()

);

create index idx_inspections_colony on inspections(colony_id);
create index idx_inspections_date on inspections(inspection_date);

-- =====================================================
-- TREATMENTS
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
-- FEEDINGS
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
-- SWARMS
-- =====================================================

create table swarms (

    id uuid primary key default gen_random_uuid(),

    source_colony_id uuid
        references colonies(id)
        on delete set null,

    swarm_date date not null default current_date,

    outcome swarm_outcome not null,

    caught_apiary_id uuid
        references apiaries(id)
        on delete set null,

    resulting_colony_id uuid
        references colonies(id)
        on delete set null,

    estimated_size text,

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
-- HARVESTS
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

    -- [verbeterd] configureerbaar per oogst (was hardcoded 10% in trigger)
    reward_pool_pct numeric(5,2) not null default 10.00
        check (reward_pool_pct between 0 and 100),

    notes text,

    created_at timestamptz default now()

);

create index idx_harvests_colony on harvests(colony_id);
create index idx_harvests_date on harvests(harvest_date);

-- =====================================================
-- CUSTOMERS
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

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()

);

create index idx_customer_name on customers(name);
create index idx_customer_status on customers(status);

create trigger trg_customer_updated
before update on customers
for each row
execute function set_updated_at();

-- =====================================================
-- CONTACTS
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
-- SALES (verkopen) [nieuw]
-- =====================================================

create table sales (

    id uuid primary key default gen_random_uuid(),

    customer_id uuid
        references customers(id)
        on delete set null,

    harvest_id uuid
        references harvests(id)
        on delete set null,

    sale_date date not null default current_date,

    product_type product_type not null,

    quantity integer not null check (quantity > 0),

    unit_price_eur numeric(8,2) not null check (unit_price_eur >= 0),

    total_eur numeric(10,2) generated always as (quantity * unit_price_eur) stored,

    notes text,

    created_at timestamptz default now()

);

create index idx_sales_customer on sales(customer_id);
create index idx_sales_date on sales(sale_date);
create index idx_sales_product on sales(product_type);

-- =====================================================
-- TASKS
-- =====================================================

create table tasks (

    id uuid primary key default gen_random_uuid(),

    -- [verbeterd] SET NULL zodat taken blijven bestaan als gekoppelde entiteit wordt verwijderd
    colony_id uuid
        references colonies(id)
        on delete set null,

    apiary_id uuid
        references apiaries(id)
        on delete set null,

    customer_id uuid
        references customers(id)
        on delete set null,

    title text not null,
    description text,

    due_date date,
    completed boolean default false,
    priority task_priority default 'normal',

    created_at timestamptz default now(),
    updated_at timestamptz default now()

);

create index idx_tasks_due on tasks(due_date);
create index idx_tasks_completed on tasks(completed);

create trigger trg_tasks_updated
before update on tasks
for each row
execute function set_updated_at();

-- =====================================================
-- DOCUMENTS
-- =====================================================

create table documents (

    id uuid primary key default gen_random_uuid(),

    -- [verbeterd] SET NULL zodat documenten blijven bestaan
    colony_id uuid
        references colonies(id)
        on delete set null,

    apiary_id uuid
        references apiaries(id)
        on delete set null,

    customer_id uuid
        references customers(id)
        on delete set null,

    filename text not null,
    storage_path text not null,

    uploaded_at timestamptz default now()

);

create index idx_documents_colony on documents(colony_id);

-- =====================================================
-- DONATIONS
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

    tier donation_tier,

    message text,

    created_at timestamptz default now()

);

create index idx_donations_colony on donations(colony_id);
create index idx_donations_customer on donations(customer_id);

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
-- HIVE UPGRADES
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

-- [verbeterd] RETURNING pakt alleen nieuw ontgrendelde upgrades, voorkomt dubbele log-regels
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

    with newly_unlocked as (
        update hive_upgrades
        set unlocked = true,
            unlocked_date = current_date
        where colony_id = new.colony_id
          and unlocked = false
          and cost_eur <= total_donated
        returning upgrade_type
    )
    insert into colony_history (colony_id, field_changed, old_value, new_value, reason)
    select new.colony_id, 'upgrade', 'locked', 'unlocked', upgrade_type::text
    from newly_unlocked;

    return new;
end;
$$;

create trigger trg_check_upgrades
after insert on donations
for each row
execute function check_hive_upgrades();

-- =====================================================
-- COLONY SHARES
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

    -- [verbeterd] 4 decimalen, laatste donateur krijgt het restpercentage zodat totaal exact 100% is
    share_percentage numeric(7,4) not null default 0
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

create or replace function recalc_colony_shares()
returns trigger
language plpgsql
as $$
declare
    total numeric(10,4);
begin
    select coalesce(sum(amount_eur), 0)
    into total
    from donations
    where colony_id = new.colony_id;

    if total = 0 then
        return new;
    end if;

    with ranked as (
        select
            customer_id,
            sum(amount_eur) as donor_total,
            row_number() over (order by min(created_at)) as rn,
            count(*) over () as total_count
        from donations
        where colony_id = new.colony_id
        group by customer_id
    ),
    calculated as (
        select
            customer_id,
            case
                when rn = total_count
                -- laatste donateur krijgt het restant zodat totaal exact 100% is
                then 100 - coalesce(
                    (select sum(round(100 * r2.donor_total / total, 4))
                     from ranked r2
                     where r2.rn < ranked.total_count), 0)
                else round(100 * donor_total / total, 4)
            end as share_pct
        from ranked
    )
    insert into colony_shares (customer_id, colony_id, share_percentage)
    select customer_id, new.colony_id, share_pct
    from calculated
    on conflict (customer_id, colony_id)
    do update set
        share_percentage = excluded.share_percentage,
        updated_at = now();

    return new;
end;
$$;

create trigger trg_recalc_shares
after insert on donations
for each row
execute function recalc_colony_shares();

-- =====================================================
-- HONEY REWARDS
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

    share_percentage numeric(7,4) not null,
    reward_kg numeric(6,3) not null,

    claimed boolean default false,
    claimed_date date,

    created_at timestamptz default now()

);

create index idx_rewards_customer on honey_rewards(customer_id);
create index idx_rewards_harvest on honey_rewards(harvest_id);
create index idx_rewards_claimed on honey_rewards(claimed);

-- [verbeterd] reward_pool_pct uit harvest zelf, niet hardcoded
create or replace function distribute_honey_rewards()
returns trigger
language plpgsql
as $$
declare
    reward_pool numeric(8,3);
begin
    if new.colony_id is null then
        return new;
    end if;

    reward_pool := new.amount_kg * (new.reward_pool_pct / 100);

    insert into honey_rewards (harvest_id, customer_id, colony_id, share_percentage, reward_kg)
    select
        new.id,
        cs.customer_id,
        cs.colony_id,
        cs.share_percentage,
        round(reward_pool * cs.share_percentage / 100, 3)
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
-- VIEWS
-- =====================================================

-- Actieve volken met kast, koningin en standplaats
create view colony_overview as
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

-- Laatste inspectiedatum per volk
create view colony_last_inspection as
select
    c.id as colony_id,
    c.name as colony_name,
    max(i.inspection_date) as last_inspection_date,
    (current_date - max(i.inspection_date)) as days_since_inspection
from colonies c
left join inspections i on i.colony_id = c.id
group by c.id, c.name
order by days_since_inspection desc nulls first;

-- Jaaroogst per standplaats
create view harvest_summary as
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

-- Omzet per klant en per product [nieuw]
create view sales_summary as
select
    c.name as customer_name,
    s.product_type,
    sum(s.quantity) as total_quantity,
    sum(s.total_eur) as total_eur,
    max(s.sale_date) as last_sale_date
from sales s
left join customers c on c.id = s.customer_id
group by c.name, s.product_type
order by total_eur desc;

-- Voortgang per volk: donaties en upgrades
create view colony_funding_progress as
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

-- Overzicht per donateur
create view donor_overview as
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
