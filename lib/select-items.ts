/**
 * Map `{ id, label }` options to Base UI Select `items` so `SelectValue`
 * shows the label instead of the raw value.
 */
export function toSelectItems<T extends string>(
  options: ReadonlyArray<{ id: T; label: string }>,
): Array<{ value: T; label: string }> {
  return options.map((option) => ({
    value: option.id,
    label: option.label,
  }));
}
