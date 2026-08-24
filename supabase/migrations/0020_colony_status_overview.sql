-- =====================================================
-- 0020 — Volkenoverzicht: colony_status_overview
-- =====================================================
-- Additief, niet-destructief. Vereist 0019_dashboard_stats.sql (levert
-- colony_status_view). Zie SPRINT-01-07-streunding.md, Sprint 3.

create or replace view colony_status_overview with (security_invoker = true) as

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

grant select on colony_status_overview to anon, authenticated;
