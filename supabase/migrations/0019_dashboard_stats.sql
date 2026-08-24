-- =====================================================
-- 0019 — Dashboard: volk-status view + statistieken-RPC
-- =====================================================
-- Additief, niet-destructief: alleen create/replace, geen drops van
-- bestaande tabellen. Veilig te draaien tegen de huidige, gevulde
-- database (plak in de Supabase Studio SQL-editor, run eenmalig).
--
-- Voegt exact toe wat supabase/schema.sql inmiddels ook bevat (het
-- naslagwerk voor een verse installatie) — zie SPRINT-01-07-streunding.md,
-- Sprint 1 en 2.

-- ---------------------------------------------------
-- Sprint 1 — afgeleide status per volk
-- ---------------------------------------------------
-- Geen eigen sterkte-kolom in het schema, dus dit leunt op frames_of_bees
-- uit de laatste inspectie plus de "hoe lang geleden" uit de bestaande
-- colony_last_inspection-view.

create or replace view colony_status_view with (security_invoker = true) as

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

-- ---------------------------------------------------
-- Sprint 2 — dashboardstatistieken in één call
-- ---------------------------------------------------
-- Leunt op auth.uid() via is_owner_or_org_member (geen p_owner_id-param)
-- zodat organisatieleden hetzelfde te zien krijgen als via de gewone RLS
-- op deze tabellen.

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
