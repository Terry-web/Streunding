// Zelfde drempels als colony_status_view in supabase/schema.sql (Sprint 1).
export function inspectionHealthStatus(framesOfBees: number | null): string {
  if (framesOfBees == null) return "onbekend";
  if (framesOfBees < 3) return "aandacht";
  if (framesOfBees < 6) return "controleren";
  return "goed";
}
