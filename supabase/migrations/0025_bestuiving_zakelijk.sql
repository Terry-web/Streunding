-- =====================================================
-- 0025 — Zakelijke bestuivingsaanvragen (los van een aanbod-item)
-- =====================================================
-- Additief, niet-destructief. Zie SPRINT-01-08-streunding.md, Sprint 9-A.
--
-- /bestuiving draait al met een simpel model: aanbod-kaarten
-- (bestuifvolk_aanbod) met een aanvraagformulier per item
-- (bestuifvolk_aanvragen, Sprint 7). Voor zakelijke aanvragen (boomgaard,
-- akkerbouw, teelt) is er geen concreet aanbod-item om op te bestellen —
-- dit is een adviesaanvraag, geen bestelling. In plaats van een aparte
-- tabel met eigen ownership-puzzel breidt dit gewoon bestuifvolk_aanvragen
-- uit: aanbod_id wordt optioneel, plus drie velden die alleen bij
-- doelgroep 'zakelijk' relevant zijn.

alter table bestuifvolk_aanvragen alter column aanbod_id drop not null;

alter table bestuifvolk_aanvragen
  add column if not exists doelgroep text not null default 'particulier',
  add column if not exists gewas text,
  add column if not exists oppervlakte text,
  add column if not exists bloeiperiode text;

alter table bestuifvolk_aanvragen
  drop constraint if exists bestuifvolk_aanvragen_doelgroep_check;
alter table bestuifvolk_aanvragen
  add constraint bestuifvolk_aanvragen_doelgroep_check
  check (doelgroep in ('particulier', 'zakelijk'));

-- Zonder aanbod_id valt de bestaande owner-check (via aanbod_id) weg. Voor
-- die rijen mag elke eigenaar/org-lid die zelf minstens één
-- bestuifvolk_aanbod-item heeft de zakelijke aanvraag zien/beheren — op
-- dit moment één eigenaar site-breed, dus functioneel gelijk aan de
-- bestaande policy, maar zonder aanname over een specifiek record.

drop policy if exists bestuifvolk_aanvragen_lezen_door_eigenaar on bestuifvolk_aanvragen;
create policy bestuifvolk_aanvragen_lezen_door_eigenaar on bestuifvolk_aanvragen
  for select
  using (
    (aanbod_id is not null and exists (
      select 1 from bestuifvolk_aanbod a
      where a.id = bestuifvolk_aanvragen.aanbod_id
        and is_owner_or_org_member(a.owner_id, a.organization_id)
    ))
    or
    (aanbod_id is null and exists (
      select 1 from bestuifvolk_aanbod a
      where is_owner_or_org_member(a.owner_id, a.organization_id)
    ))
  );

drop policy if exists bestuifvolk_aanvragen_status_door_eigenaar on bestuifvolk_aanvragen;
create policy bestuifvolk_aanvragen_status_door_eigenaar on bestuifvolk_aanvragen
  for update
  using (
    (aanbod_id is not null and exists (
      select 1 from bestuifvolk_aanbod a
      where a.id = bestuifvolk_aanvragen.aanbod_id
        and is_owner_or_org_member(a.owner_id, a.organization_id)
    ))
    or
    (aanbod_id is null and exists (
      select 1 from bestuifvolk_aanbod a
      where is_owner_or_org_member(a.owner_id, a.organization_id)
    ))
  );
