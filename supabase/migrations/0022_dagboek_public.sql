-- =====================================================
-- 0022 — Publiek dagboek (/dagboek): is_public op colonies
-- =====================================================
-- Additief, niet-destructief. Zie Sprint 8: /dagboek haalde tot nu toe
-- statische data uit content/inspecties.json, losgekoppeld van de echte
-- colonies/hives/inspections-tabellen. Deze migratie voegt een opt-in
-- "is_public"-vlag toe op colonies en de bijbehorende publieke
-- select-policies, zodat /dagboek live kan draaien op RLS-gefilterde
-- Supabase-data i.p.v. een los JSON-bestand.
--
-- Zelfde patroon als bestuifvolk_aanbod_publiek_leesbaar (0021): een
-- additionele select-only policy per tabel — Postgres OR't policies voor
-- hetzelfde command samen, dus dit verzwakt de bestaande owner/org-toegang
-- nergens, het voegt alleen leesbaarheid toe voor colonies.is_public = true
-- (en de kast/standplaats/inspecties die daarbij horen).

alter table colonies add column if not exists is_public boolean not null default false;

create index if not exists idx_colonies_public on colonies(is_public) where is_public = true;

drop policy if exists colonies_publiek_leesbaar on colonies;
create policy colonies_publiek_leesbaar on colonies
  for select
  using (is_public = true and deleted_at is null);

drop policy if exists hives_publiek_leesbaar on hives;
create policy hives_publiek_leesbaar on hives
  for select
  using (
    deleted_at is null
    and exists (
      select 1 from colonies c
      where c.hive_id = hives.id and c.is_public = true and c.deleted_at is null
    )
  );

drop policy if exists apiaries_publiek_leesbaar on apiaries;
create policy apiaries_publiek_leesbaar on apiaries
  for select
  using (exists (
    select 1 from colonies c
    where c.apiary_id = apiaries.id and c.is_public = true and c.deleted_at is null
  ));

drop policy if exists inspections_publiek_leesbaar on inspections;
create policy inspections_publiek_leesbaar on inspections
  for select
  using (
    deleted_at is null
    and exists (
      select 1 from colonies c
      where c.id = inspections.colony_id and c.is_public = true and c.deleted_at is null
    )
  );
