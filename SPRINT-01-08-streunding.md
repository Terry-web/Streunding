# Streunding — Sprints 1 t/m 7: Dashboard, Volkenoverzicht & Kastdetail

Opgesplitst in 6 kleine, los oplevbare sprints i.p.v. één grote. Elke sprint is op zichzelf testbaar en bouwt voort op de vorige.

**Bijgewerkt naar Melion's schema (`supabase/schema.sql`).** De oorspronkelijke aanname klopte niet: Melion's schema gebruikt Engelse tabelnamen (`colonies`, `hives`, `apiaries`, `inspections`, ...) i.p.v. de Nederlandse werknamen (`volken`, `kasten`, `standplaatsen`, `inspecties`) waarmee dit plan oorspronkelijk was geschreven. Onderstaande sprints zijn herschreven op de daadwerkelijke tabellen/kolommen. De twee aannames uit de vorige versie zijn allebei beantwoord:

- **Koningin-jaar staat niet op het volk zelf** — er is een aparte `queens`-tabel met `birth_year`, gekoppeld via `colonies.queen_id`.
- **Honingopbrengst is géén nieuwe tabel** — `harvests` bestaat al (`colony_id`, `apiary_id`, `harvest_date`, `amount_kg`, `honey_type`, `frames_extracted`), inclusief een kant-en-klare `harvest_summary`-view.

**Belangrijke structuurcorrectie:** in het oorspronkelijke plan was een "kast" 1-op-1 hetzelfde als een "volk". In Melion's schema zijn dit twee losse entiteiten — `colonies.hive_id` verwijst naar een kast, maar een kast kan in de tijd meerdere volken huisvesten (na zwermen, verlies, vervanging). Waar dit onderscheid ertoe doet, staat het expliciet vermeld.

Melion's schema levert al een aantal bruikbare views waar deze sprints op voortbouwen i.p.v. ze opnieuw te bouwen:
- `colony_overview` — volk + standplaats + kast + koningin in één rij (`security_invoker = true`, al gegrant aan `anon, authenticated`)
- `colony_last_inspection` — laatste inspectiedatum + dagen sinds laatste inspectie per volk
- `harvest_summary` — honingopbrengst geaggregeerd per standplaats/jaar/soort

---

## Sprint 1 — Datamodel: afgeleide volk-status

**Doel:** een status-view zodat latere sprints puur UI-werk zijn. Geen nieuwe basistabellen/kolommen nodig — alleen een view bovenop wat er al is.

```sql
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

grant select on colony_status_view to anon, authenticated;
```

**Statusregels (⚠️ aanname te bevestigen — er is geen `sterkte`-kolom, dus dit leunt op `frames_of_bees` uit de laatste inspectie):**
- 🟢 goed = laatste inspectie ≥6 ramen bijen, ≤21 dagen oud
- 🟠 controleren = laatste inspectie 3-5 ramen bijen
- 🔴 aandacht = laatste inspectie <3 ramen bijen, of >21 dagen geen inspectie
- ⚪ onbekend = nooit geïnspecteerd, of `frames_of_bees` niet ingevuld bij een recente inspectie

`security_invoker = true` laat de RLS van `colonies`/`inspections` gewoon gelden voor wie de view bevraagt — geen aparte policy nodig op de view zelf.

**Acceptatiecriteria**
- View draait zonder fouten tegen bestaande data.
- `colony_status_view` toont voor een handmatig ingevoerd testvolk de verwachte status bij elk van de 4 scenario's hierboven.
- RLS-test met 2 accounts: gebruiker A ziet in deze view nooit volken van gebruiker B (via de onderliggende RLS van `colonies`).

---

## Sprint 2 — Dashboard: statistieken-RPC + kaarten

**Doel:** de 6 dashboardkaarten, gevoed door één efficiënte call.

```sql
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
```

Geen `p_owner_id`-parameter meer (zoals in de vorige versie): de functie leunt op `auth.uid()` via `is_owner_or_org_member`, zodat hij dezelfde zichtbaarheidsregels volgt als de rest van de app (organisatie-leden zien ook mee, niet alleen de eigenaar zelf) — consistent met hoe `/beheer` nu al queryt (geen los `owner_id`-filter in de queries, dat doet RLS).

**UI:** `DashboardStatsGrid` — 6 kaarten (🐝🏠👑🍯⚠️📈), waarbij de 6e (ontwikkeling) een CTA-kaart is zonder cijfer, linkend naar het volkenoverzicht — geen los datamodel nodig, komt in Sprint 5.

**Acceptatiecriteria**
- Dashboard doet één RPC-call, geen 6 losse queries (netwerktab-check).
- Cijfers kloppen tegen seed-data (handmatig doorgerekend).
- ⚠️-kaart is klikbaar en linkt naar (nog te bouwen) gefilterd overzicht — link mag in dit sprint nog naar een placeholder-route.
- Lege staat (nieuwe gebruiker, 0 volken) crasht niet en toont 0'en/nette lege-staat teksten.

---

## Sprint 3 — Volkenoverzicht: tabel

**Doel:** sorteerbare tabel van alle volken met status-badges, bovenop `colony_overview` + `colony_status_view` i.p.v. een nieuwe join opnieuw uit te vinden.

```sql
create view colony_status_overview with (security_invoker = true) as
select
  co.id as colony_id,
  co.colony_name,
  co.apiary,
  co.city,
  co.hive_label,
  co.hive_type,
  co.queen_label,
  co.queen_race,
  co.queen_birth_year,
  sv.last_inspection_date,
  sv.frames_of_bees,
  sv.status
from colony_overview co
join colony_status_view sv on sv.colony_id = co.id
order by co.apiary, co.colony_name;

grant select on colony_status_overview to anon, authenticated;
```

**Componenten:**
- `StatusBadge` — gedeelde component, kleurcodering 🟢🟠🔴⚪, herbruikbaar in Sprint 4-6
- `VolkenTable` — sorteerbaar op kolom, rij klikbaar

**Acceptatiecriteria**
- Tabel toont alle eigen volken, gesorteerd op standplaats + volknaam, met correcte badge per statusregel uit Sprint 1.
- Sorteren op kolom (bijv. laatste inspectie) werkt client-side zonder herlaad.
- RLS-test: gebruiker A ziet nooit volken van gebruiker B via deze view.
- ⚠️-kaart uit Sprint 2 linkt nu écht naar deze tabel, voorgefilterd op status `aandacht`.
- Klik op rij navigeert naar `/volk/:colonyId` (route mag in dit sprint nog een lege pagina tonen) — zie routing-opmerking bij Sprint 4 voor waarom dit op het volk en niet op de kast is gebaseerd.

---

## Sprint 4 — Volkdetailpagina: basis

**Doel:** de detailroute met header en statuskaart, nog zonder grafiek/inspectielijst.

**Route:** `/volk/:colonyId` (gebaseerd op `colonies.id`, niet op een kastcode — die bestaat niet in het schema, en zoals hierboven beschreven is een kast geen stabiele proxy voor een volk).

**Componenten:**
- `VolkDetailHeader` — volknaam (`colonies.name`), ras/koningin (`queens.race`), standplaats (`apiaries.name`), kastlabel (`hives.label`)
- Statuskaart (3 kolommen): `frames_of_bees` (volk-sterkte), `queens.birth_year` (koningin-jaar), `StatusBadge`

**Query:** hergebruikt `colony_status_overview` uit Sprint 3, gefilterd op `colony_id`.

**Acceptatiecriteria**
- Navigeren naar `/volk/:id` toont het juiste volk — expliciet testen met minimaal 3 volken dat er geen verwisseling optreedt.
- Niet-bestaand volk-id of volk van een andere gebruiker → nette 404, geen data-lek, geen crash.
- Statuskaart komt overeen met de badge die hetzelfde volk in de Sprint 3-tabel toont (consistentie-check).

---

## Sprint 5 — Volkdetailpagina: ontwikkeling-grafiek

**Doel:** tijdlijn-grafiek van volksontwikkeling op de detailpagina.

```sql
select inspection_date, frames_of_brood, frames_of_bees
from inspections
where colony_id = $1 and deleted_at is null
order by inspection_date asc;
```

**Component:** `VolkOntwikkelingChart` (recharts LineChart) — x-as `inspection_date`, y-as `frames_of_brood`; `frames_of_bees` als tweede lijn, beide al numeriek (geen conversie van een kwalitatieve schaal nodig, zoals in de vorige versie van dit plan).

**Acceptatiecriteria**
- Grafiek toont exact de datapunten uit `inspections` voor dat volk — geen verzonnen interpolatie tussen data die er niet is.
- Volk zonder inspecties → nette lege-staat ("nog geen inspecties"), geen crash, geen lege grafiek-frame die er kapot uitziet.
- Grafiek herlaadt correct bij navigeren tussen twee verschillende volken zonder oude data te tonen (state-reset check).

---

## Sprint 6 — Volkdetailpagina: inspectielijst & toevoegen

**Doel:** laatste inspecties tonen en de bestaande inspectieflow koppelen.

**Component:** `InspectieLijst` — laatste N (bijv. 5), aflopend op `inspection_date`: datum | `StatusBadge` (op basis van `frames_of_bees`, zelfde drempels als Sprint 1) | `frames_of_brood`. "Bekijk alle" indien meer aanwezig.

**Actie:** `[ + Inspectie toevoegen ]` — opent bestaand inspectieformulier (`/beheer/volken/[id]` heeft dit al) met `colony_id` voorgevuld.

**Acceptatiecriteria**
- Lijst toont de 5 meest recente inspecties van dit volk, correct gesorteerd.
- "Bekijk alle" verschijnt alleen als er >5 inspecties zijn, en toont dan de volledige lijst.
- `+ Inspectie toevoegen` opent formulier met `colony_id` correct voorgevuld — nieuwe inspectie verschijnt direct (of na refresh) in zowel deze lijst als de grafiek uit Sprint 5.
- Nieuwe inspectie triggert herberekening van `colony_status_view` (is een view, dus automatisch), zichtbaar terug in Sprint 3-tabel en Sprint 4-statuskaart zonder handmatige cache-clear.

---

## Sprint 7 — Bestuivingsvolken: aanbod & bestel-CTA

**Doel:** een publieke pagina (streunding.nl) waar bezoekers bestuivingsvolken kunnen bekijken en bestellen/aanvragen — losstaand van het interne beheer-dashboard uit Sprint 1-6, maar wel gevoed vanuit dezelfde Supabase-backend.

**Aanname:** dit is geen directe iDEAL-afrekening in dit sprint, maar een bestelaanvraag (lead) die je zelf bevestigt/factureert — sluit aan bij hoe de donor/adoptie-flow (`donations`, `colony_shares`, `honey_rewards`) al werkt. Klopt dat niet en wil je meteen een betaalflow, dan wordt dit een apart, groter sprint (payment provider, voorraad-reservering, facturatie).

**Datamodel**

`bestuifvolk_aanbod` krijgt, net als de andere root-tabellen (`apiaries`, `hives`, `colonies`, ...) in Melion's schema, een eigen `owner_id`/`organization_id` en leunt op `is_owner_or_org_member` — de placeholder-policy uit de vorige versie van dit plan (`auth.uid() = (select owner_id from kasten limit 1)`, letterlijk met het commentaar "pas aan naar je eigen owner-check") is hieronder vervangen door het echte patroon:

```sql
create table if not exists bestuifvolk_aanbod (
  id uuid primary key default gen_random_uuid(),
  naam text not null,              -- bv. "Bestuifvolk Buckfast, 5-raams"
  ras text,
  omvang text,                     -- bv. "5-raams", "1 broedbak"
  prijs numeric(6,2),
  beschikbaar_vanaf date,
  beschikbaar_tot date,
  voorraad int default 0,
  regio text,                      -- leveringsgebied, bv. "Oldambt/Westerwolde"
  beschrijving text,
  actief boolean default true,

  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  organization_id uuid references organizations(id) on delete set null,

  created_at timestamptz default now()
);

create table if not exists bestuifvolk_aanvragen (
  id uuid primary key default gen_random_uuid(),
  aanbod_id uuid not null references bestuifvolk_aanbod(id) on delete cascade,
  naam text not null,
  email text not null,
  telefoon text,
  aantal int default 1,
  gewenste_leverdatum date,
  opmerking text,
  status text default 'nieuw',     -- nieuw / bevestigd / geleverd / geannuleerd
  created_at timestamptz default now()
);

alter table bestuifvolk_aanbod enable row level security;
alter table bestuifvolk_aanvragen enable row level security;

-- Aanbod: publiek leesbaar (alleen actieve items), alleen eigenaar/org mag schrijven
create policy aanbod_publiek_leesbaar on bestuifvolk_aanbod
  for select using (actief = true);
create policy aanbod_beheer_door_eigenaar on bestuifvolk_aanbod
  for all using (is_owner_or_org_member(owner_id, organization_id))
  with check (is_owner_or_org_member(owner_id, organization_id));

-- Aanvragen: iedereen mag aanmaken (publiek formulier), alleen eigenaar/org van het aanbod leest/beheert
create policy aanvraag_aanmaken_door_iedereen on bestuifvolk_aanvragen
  for insert with check (true);
create policy aanvraag_lezen_door_eigenaar on bestuifvolk_aanvragen
  for select using (exists (
    select 1 from bestuifvolk_aanbod a
    where a.id = bestuifvolk_aanvragen.aanbod_id
      and is_owner_or_org_member(a.owner_id, a.organization_id)
  ));
create policy aanvraag_status_door_eigenaar on bestuifvolk_aanvragen
  for update using (exists (
    select 1 from bestuifvolk_aanbod a
    where a.id = bestuifvolk_aanvragen.aanbod_id
      and is_owner_or_org_member(a.owner_id, a.organization_id)
  ));
```

**Publieke pagina (`/bestuiving` of vergelijkbaar)**
- Overzicht van actieve `bestuifvolk_aanbod`-items als kaarten: naam, ras, omvang, prijs, beschikbaarheid, regio.
- Per kaart een CTA-knop **"Bestel je bestuifvolk"** → opent aanvraagformulier (naam, e-mail, telefoon, aantal, gewenste leverdatum, opmerking).
- Formulier schrijft naar `bestuifvolk_aanvragen`, status start op `nieuw`.
- Bevestigingsscherm/e-mail na versturen ("we nemen binnen 2 werkdagen contact op" o.i.d.) — check of er al een e-mail-verzendmechanisme is vanuit de bestaande donor-flow om te hergebruiken.

**Intern beheer**
- Simpel overzicht (kan binnen bestaand dashboard of los admin-scherm) van binnengekomen aanvragen, met statuswissel nieuw → bevestigd → geleverd/geannuleerd.
- Voorraad (`voorraad`) handmatig bij te werken; geen automatische aftrek bij aanvraag in dit sprint (aanvraag ≠ garantie, jij bevestigt handmatig — voorkomt overselling zonder complexe reserveringslogica).

**Acceptatiecriteria**
- Publieke pagina toont alleen `actief = true` aanbod, ook zonder ingelogde gebruiker (RLS-test als anonieme bezoeker).
- Niet-actief of voorbije `beschikbaar_tot`-items verschijnen niet (of expliciet gemarkeerd als "uitverkocht/seizoen voorbij" — kies één gedrag en test het).
- Aanvraagformulier: verplichte velden gevalideerd, onjuist e-mailadres wordt geweigerd.
- Na versturen: record verschijnt in `bestuifvolk_aanvragen` met status `nieuw`, en bezoeker ziet bevestiging.
- Anonieme bezoeker kan géén bestaande aanvragen inzien of aanpassen (alleen insert, geen select/update via publieke rol — RLS-test).
- Eigenaar ziet in beheerscherm alle aanvragen en kan status wijzigen; wijziging persisteert.

**Open vraag voor jou:** wil je dit sprint als losse marketingpagina op streunding.nl, of geïntegreerd in de bestaande donor/adoptie-pagina's (zelfde stijl/CTA-blok als de adoptie-flow)?

---

## Openstaande vraag voor jou

Sprint 4 gaat er nu van uit dat "de huidige bewoner van een kast" = de meest recent gestarte, nog niet dode/verkochte/samengevoegde `colonies`-rij met dat `hive_id` (`status not in ('dead','sold','merged')`, hoogste `established_date`). Als kasten in de praktijk toch altijd 1-op-1 aan één volk blijven hangen, kan Sprint 3/4 weer terug naar een simpelere kast-centrische route — zeg het als dat zo is.
