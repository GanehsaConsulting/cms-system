/** Shared CMS list table layout and styling. */

export const LIST_DEFAULT_PAGE_SIZE = 10;

export const LIST_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const LIST_TABLE_HEAD_CLASS =
  "sticky top-0 z-10 h-11 bg-[var(--glass-fill)] px-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground glass-backdrop shadow-[inset_0_-1px_0_0_var(--separator)]";

export const LIST_TABLE_CELL_CLASS = "px-4 py-3.5";

export const LIST_PAGINATION_CLASS =
  "grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-[color:var(--separator)] border-t px-4 py-3";

/** 1px inset from the table container edge. */
export const LIST_TABLE_WRAP_CLASS = "px-px";

/** Separate borders so selected rows can use rounded cell backgrounds. */
export const LIST_TABLE_CLASS =
  "border-separate border-spacing-x-0 border-spacing-y-px";

const LIST_TABLE_ROW_ROUNDED_CELLS =
  "[&>td:first-child]:rounded-l-[var(--radius-deep)] [&>td:last-child]:rounded-r-[var(--radius-deep)]";

export const LIST_TABLE_ROW_BASE =
  `cursor-pointer border-0 bg-transparent transition-colors hover:[&>td]:bg-primary/5 hover:[&>td:first-child]:rounded-l-[var(--radius-deep)] hover:[&>td:last-child]:rounded-r-[var(--radius-deep)] data-[state=selected]:bg-transparent`;

export const LIST_TABLE_ROW_SELECTED =
  `border-0 bg-transparent data-[state=selected]:bg-transparent [&>td]:bg-muted ${LIST_TABLE_ROW_ROUNDED_CELLS}`;

export interface ListTableSortMapping<TSort extends string> {
  asc: TSort;
  desc: TSort;
  default: TSort;
}
