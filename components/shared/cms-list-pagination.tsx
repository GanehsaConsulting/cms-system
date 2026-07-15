"use client";

import { CaretLeftIcon, CaretRightIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LIST_PAGE_SIZE_OPTIONS,
  LIST_PAGINATION_CLASS,
} from "@/config/list-table";
import { RADIUS_DEEP } from "@/config/shape";
import { getVisiblePaginationPages } from "@/lib/list/pagination";
import { cn } from "@/lib/utils";

interface CmsListPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function CmsListPagination({
  page,
  pageSize,
  total,
  totalPages,
  rangeStart,
  rangeEnd,
  itemLabel,
  onPageChange,
  onPageSizeChange,
}: CmsListPaginationProps) {
  const visiblePages = getVisiblePaginationPages(page, totalPages);

  return (
    <div className={LIST_PAGINATION_CLASS}>
      <div className="justify-self-start">
        <Select
          value={String(pageSize)}
          items={LIST_PAGE_SIZE_OPTIONS.map((option) => ({
            value: String(option),
            label: `${option} / page`,
          }))}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIST_PAGE_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-center text-muted-foreground/50 text-sm">
        Showing {rangeStart}–{rangeEnd} of {total} {itemLabel}
      </p>

      <div className="flex items-center justify-end justify-self-end gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="size-8"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <CaretLeftIcon className="size-3.5" />
        </Button>

        {visiblePages.map((pageNumber, index) => {
          const previous = visiblePages[index - 1];
          const showEllipsis =
            previous !== undefined && pageNumber - previous > 1;

          return (
            <div key={pageNumber} className="flex items-center gap-1">
              {showEllipsis ? (
                <span className="px-1 text-muted-foreground text-sm">…</span>
              ) : null}
              <button
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-current={page === pageNumber ? "page" : undefined}
                className={cn(
                  RADIUS_DEEP,
                  "min-w-8 px-2 py-1 text-sm tabular-nums transition-colors",
                  page === pageNumber
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {pageNumber}
              </button>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="size-8"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <CaretRightIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
