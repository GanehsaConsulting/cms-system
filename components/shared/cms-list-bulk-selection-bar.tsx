"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/lib/icons";

interface CmsListBulkSelectionBarProps {
  selectedCount: number;
  onClear: () => void;
  disabled?: boolean;
  children: ReactNode;
}

/** Shared bulk bar shell — count, action slot, Clear. Hidden when empty. */
export function CmsListBulkSelectionBar({
  selectedCount,
  onClear,
  disabled = false,
  children,
}: CmsListBulkSelectionBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-(--separator) border-b bg-primary/5 px-4 py-2.5">
      <p className="mr-1 font-medium text-sm tabular-nums">
        {selectedCount} selected
      </p>

      {children}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto h-8"
        disabled={disabled}
        onClick={onClear}
      >
        <XIcon className="size-3.5" />
        Clear
      </Button>
    </div>
  );
}
