export function str(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function numOrNull(value: FormDataEntryValue | null): number | null {
  const s = str(value);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function dateOrNull(value: FormDataEntryValue | null): string | null {
  return str(value) || null;
}

export function boolFromCheckbox(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}
