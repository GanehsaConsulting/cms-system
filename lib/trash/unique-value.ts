/** Soft-delete slug/key helpers — free unique constraints while item is in Trash. */

export function toTrashUniqueValue(value: string, id: string): string {
  const suffix = `__trash__${id}`;
  if (value.endsWith(suffix)) {
    return value;
  }
  return `${value}${suffix}`;
}

export function fromTrashUniqueValue(value: string, id: string): string {
  const suffix = `__trash__${id}`;
  if (value.endsWith(suffix)) {
    return value.slice(0, -suffix.length);
  }
  return value;
}
