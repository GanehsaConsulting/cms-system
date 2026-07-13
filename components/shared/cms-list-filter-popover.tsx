"use client";

import type { ReactNode } from "react";
import { FilterIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LIST_FILTER_POPOVER_CLASS,
  LIST_TOOLBAR_BUTTON_CLASS,
} from "@/config/list-toolbar";
import { cn } from "@/lib/utils";

interface CmsListFilterPopoverProps {
  hasActiveFilters: boolean;
  children: ReactNode;
  onReset: () => void;
  contentClassName?: string;
}

export function CmsListFilterPopover({
  hasActiveFilters,
  children,
  onReset,
  contentClassName,
}: CmsListFilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="default"
            className={cn(
              LIST_TOOLBAR_BUTTON_CLASS,
              hasActiveFilters && "bg-black/8 dark:bg-white/12",
            )}

          />
        }
      >
        <FilterIcon className="size-3.5 opacity-70" />
        Filter
        {hasActiveFilters ? (
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
        ) : null}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(LIST_FILTER_POPOVER_CLASS, contentClassName)}
      >
        <PopoverHeader>
          <PopoverTitle>Filter & sort</PopoverTitle>
        </PopoverHeader>

        {children}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-4 w-full"
          disabled={!hasActiveFilters}
          onClick={onReset}
        >
          Reset filters
        </Button>
      </PopoverContent>
    </Popover>
  );
}
