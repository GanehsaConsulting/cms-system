"use client";

import type { SyntheticEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CmsListBulkCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

function stopRowInteraction(event: SyntheticEvent) {
  event.stopPropagation();
}

/** List-table checkbox that does not trigger row click / panel select. */
export function CmsListBulkCheckbox({
  checked,
  indeterminate = false,
  disabled = false,
  label,
  onCheckedChange,
  className,
}: CmsListBulkCheckboxProps) {
  return (
    <div
      className={cn("relative z-20", className)}
      onClick={stopRowInteraction}
      onMouseDown={stopRowInteraction}
      onPointerDown={stopRowInteraction}
      onKeyDown={stopRowInteraction}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        onClick={stopRowInteraction}
        onMouseDown={stopRowInteraction}
        onPointerDown={stopRowInteraction}
        aria-label={label}
        className={cn(
          "size-4 bg-background/80 backdrop-blur-sm data-checked:bg-primary",
          indeterminate && !checked ? "border-primary bg-primary/40" : undefined,
        )}
      />
    </div>
  );
}
