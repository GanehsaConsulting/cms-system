"use client";

import { PlusIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { CMS_IMAGE_SOURCE_LABELS } from "@/config/cms-image-source";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface CmsImageSourceMenuProps {
  disabled?: boolean;
  /** `tile` = dashed grid add cell; `button` = outline button trigger. */
  variant?: "tile" | "button";
  buttonLabel?: string;
  className?: string;
  onOpen: () => void;
}

/** Opens the shared image picker (Device / Shared / In use / URL). */
export function CmsImageSourceMenu({
  disabled = false,
  variant = "tile",
  buttonLabel = CMS_IMAGE_SOURCE_LABELS.add,
  className,
  onOpen,
}: CmsImageSourceMenuProps) {
  if (variant === "button") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        className={cn("gap-1.5", className)}
        onClick={onOpen}
      >
        <PlusIcon className="size-3.5" />
        {buttonLabel}
      </Button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onOpen}
      className={cn(
        RADIUS_DEEP,
        "flex aspect-4/3 w-full flex-col items-center justify-center gap-1 border border-dashed border-black/15 text-muted-foreground transition-colors",
        "hover:border-black/25 hover:bg-black/3 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "dark:border-white/18 dark:hover:border-white/28 dark:hover:bg-white/6",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <PlusIcon className="size-4" />
      <span className="text-[10px]">{CMS_IMAGE_SOURCE_LABELS.add}</span>
    </button>
  );
}
