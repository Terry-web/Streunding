-- =====================================================
-- 0023 — Publieke /kasten-pagina: is_public op hives
-- =====================================================
-- Additief, niet-destructief. Zelfde probleem als /dagboek (0022): de
-- statsbalk op /kasten (aantal kasten, type, bouwjaar) stond hardcoded in
-- de pagina zelf, los van de echte hives-tabel. Een kast staat vaak al
-- klaar (getimmerd) vóórdat er ooit een volk in zit, dus deze kan niet
-- leunen op colonies.is_public (0022) — hives krijgt hier zijn eigen
-- onafhankelijke is_public-vlag.

alter table hives add column if not exists is_public boolean not null default false;

create index if not exists idx_hives_public on hives(is_public) where is_public = true;

-- 0022 maakte al een policy met deze naam (kast zichtbaar via een publiek
-- volk) — dit is een aparte, aanvullende policy op dezelfde tabel voor het
-- geval een kast zelf als publiek gemarkeerd is, los van een volk.
drop policy if exists hives_publiek_leesbaar_eigen on hives;
create policy hives_publiek_leesbaar_eigen on hives
  for select
  using (is_public = true and deleted_at is null);
