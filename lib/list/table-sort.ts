import type { ListTableSortMapping } from "@/config/list-table";

export type ListSortDirection = "asc" | "desc";

export function getListSortDirection<TSort extends string>(
  sort: TSort,
): ListSortDirection | null {
  if (sort.endsWith("-asc")) {
    return "asc";
  }

  if (sort.endsWith("-desc")) {
    return "desc";
  }

  return null;
}

export function isListColumnSorted<TSort extends string, TColumn extends string>(
  column: TColumn,
  sort: TSort,
  sortMap: Record<TColumn, ListTableSortMapping<TSort>>,
) {
  const mapping = sortMap[column];
  return sort === mapping.asc || sort === mapping.desc;
}

export function getNextListColumnSort<
  TSort extends string,
  TColumn extends string,
>(
  column: TColumn,
  currentSort: TSort,
  sortMap: Record<TColumn, ListTableSortMapping<TSort>>,
): TSort {
  const mapping = sortMap[column];

  if (currentSort === mapping.asc) {
    return mapping.desc;
  }

  if (currentSort === mapping.desc) {
    return mapping.asc;
  }

  return mapping.default;
}
