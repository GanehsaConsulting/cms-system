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

function stopRowInteraction(event: React.SyntheticEvent) {
  event.stopPropagation();
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
        "relative z-20 transition-opacity",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
        className,
      )}
      onClick={stopRowInteraction}
      onMouseDown={stopRowInteraction}
      onPointerDown={stopRowInteraction}
      onKeyDown={stopRowInteraction}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        onClick={stopRowInteraction}
        onMouseDown={stopRowInteraction}
        onPointerDown={stopRowInteraction}
        aria-label={label}
        className="size-4 bg-background/80 backdrop-blur-sm data-checked:bg-primary"
      />
    </div>
  );
}
