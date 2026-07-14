"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface MediaLibraryLibraryFileSelectCheckboxProps {
  checked: boolean;
  visible: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  label?: string;
}

export function MediaLibraryLibraryFileSelectCheckbox({
  checked,
  visible,
  onCheckedChange,
  className,
  label = "Select file",
}: MediaLibraryLibraryFileSelectCheckboxProps) {
  return (
    <div
      className={cn(
        "transition-opacity",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
        className,
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        onClick={(event) => event.stopPropagation()}
        aria-label={label}
        className="size-4 bg-background/80 backdrop-blur-sm data-checked:bg-primary"
      />
    </div>
  );
}
