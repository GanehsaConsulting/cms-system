/** Helpers for article schedule publish datetime (datetime-local ↔ ISO). */

export function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid schedule date");
  }

  return date.toISOString();
}

/** Default schedule: tomorrow at 09:00 local time. */
export function getDefaultScheduleDatetimeLocal(from = new Date()): string {
  const next = new Date(from);
  next.setDate(next.getDate() + 1);
  next.setHours(9, 0, 0, 0);
  return toDatetimeLocalValue(next.toISOString());
}

export function isFutureDatetimeLocal(
  value: string,
  now = new Date(),
): boolean {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getTime() > now.getTime();
}
