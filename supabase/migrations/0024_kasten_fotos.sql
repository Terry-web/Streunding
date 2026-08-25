-- =====================================================
-- 0024 — Publieke kastfoto's
-- =====================================================
-- Additief, niet-destructief. Zie Sprint 8: elke publieke kast
-- (hives.is_public, migratie 0023) kan nu foto's tonen op zijn eigen
-- publieke pagina (/kasten/:id). Twee dingen ontbraken daarvoor:
--   1. documents (de fototabel) had geen publieke leesbaarheid.
--   2. de storage-policy op de 'photos'-bucket matchte alleen colonies,
--      niet hives.
--
-- Select en schrijven zijn bewust apart gehouden voor de storage-policy op
-- hives (i.p.v. één "for all"): DELETE checkt alleen de USING-clause, dus
-- als "is_public" daar ook in zou staan, kan een publieke bezoeker foto's
-- van een publieke kast verwijderen. Schrijven blijft dus altijd
-- owner-only, lezen mag ook bij is_public = true — zelfde opzet als de
-- bestaande colonies-only policy (inspection_photos_storage_access), die
-- ongewijzigd blijft.

drop policy if exists hives_storage_select on storage.objects;
create policy hives_storage_select on storage.objects
  for select
  using (
    bucket_id = 'photos'
    and exists (
      select 1 from hives h
      where h.id::text = split_part(storage.objects.name, '/', 1)
        and (is_owner_or_org_member(h.owner_id, h.organization_id) or h.is_public = true)
    )
  );

drop policy if exists hives_storage_write on storage.objects;
create policy hives_storage_write on storage.objects
  for all
  using (
    bucket_id = 'photos'
    and exists (
      select 1 from hives h
      where h.id::text = split_part(storage.objects.name, '/', 1)
        and is_owner_or_org_member(h.owner_id, h.organization_id)
    )
  )
  with check (
    bucket_id = 'photos'
    and exists (
      select 1 from hives h
      where h.id::text = split_part(storage.objects.name, '/', 1)
        and is_owner_or_org_member(h.owner_id, h.organization_id)
    )
  );

drop policy if exists documents_publiek_leesbaar on documents;
create policy documents_publiek_leesbaar on documents
  for select
  using (
    (hive_id is not null and exists (
      select 1 from hives h
      where h.id = documents.hive_id and h.is_public = true and h.deleted_at is null
    ))
    or
    (colony_id is not null and exists (
      select 1 from colonies c
      where c.id = documents.colony_id and c.is_public = true and c.deleted_at is null
    ))
  );
