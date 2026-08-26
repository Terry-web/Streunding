-- =====================================================
-- 0026 — Tier-label op bestuivingsaanvragen
-- =====================================================
-- Additief, niet-destructief. Zie SPRINT-01-08-streunding.md, Sprint 9-A.
--
-- De publieke pagina toont nu 4 losse CTA's (tuin, boomgaard, teelt,
-- maatwerk) i.p.v. één generiek zakelijk-formulier (0025). doelgroep
-- (particulier/zakelijk) blijft het grove onderscheid voor RLS/weergave;
-- tier legt vast via welke van de 4 CTA's de aanvraag binnenkwam, puur
-- informatief voor het beheerscherm.

alter table bestuifvolk_aanvragen
  add column if not exists tier text;

alter table bestuifvolk_aanvragen
  drop constraint if exists bestuifvolk_aanvragen_tier_check;
alter table bestuifvolk_aanvragen
  add constraint bestuifvolk_aanvragen_tier_check
  check (tier is null or tier in ('tuin', 'boomgaard', 'teelt', 'maatwerk'));
