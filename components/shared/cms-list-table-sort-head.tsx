"use client";

import { CaretDownIcon, CaretUpIcon } from "@/lib/icons";
import { TableHead } from "@/components/ui/table";
import {
  LIST_TABLE_HEAD_CLASS,
  type ListTableSortMapping,
} from "@/config/list-table";
import {
  getListSortDirection,
  getNextListColumnSort,
  isListColumnSorted,
} from "@/lib/list/table-sort";
import { cn } from "@/lib/utils";

interface CmsListTableSortHeadProps<
  TSort extends string,
  TColumn extends string,
> {
  label: string;
  column: TColumn;
  sort: TSort;
  sortMap: Record<TColumn, ListTableSortMapping<TSort>>;
  onSortChange: (sort: TSort) => void;
  className?: string;
}

export function CmsListTableSortHead<
  TSort extends string,
  TColumn extends string,
>({
  label,
  column,
  sort,
  sortMap,
  onSortChange,
  className,
}: CmsListTableSortHeadProps<TSort, TColumn>) {
  const isActive = isListColumnSorted(column, sort, sortMap);
  const direction = isActive ? getListSortDirection(sort) : null;

  return (
    <TableHead className={cn(LIST_TABLE_HEAD_CLASS, className)}>
      <button
        type="button"
        onClick={() => onSortChange(getNextListColumnSort(column, sort, sortMap))}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-foreground",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
        aria-label={`Sort by ${label}`}
      >
        <span>{label}</span>
        {direction === "asc" ? (
          <CaretUpIcon className="size-3 opacity-80" aria-hidden />
        ) : direction === "desc" ? (
          <CaretDownIcon className="size-3 opacity-80" aria-hidden />
        ) : (
          <span className="inline-flex flex-col opacity-40" aria-hidden>
            <CaretUpIcon className="-mb-1 size-2.5" />
            <CaretDownIcon className="size-2.5" />
          </span>
        )}
      </button>
    </TableHead>
  );
}
