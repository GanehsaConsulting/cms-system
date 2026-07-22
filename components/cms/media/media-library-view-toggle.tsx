"use client";

import { ListIcon, SquaresFourIcon } from "@/lib/icons";
import {
  LIST_TOOLBAR_SEGMENTED_ITEM,
  LIST_TOOLBAR_SEGMENTED_ITEM_ACTIVE,
  LIST_TOOLBAR_SEGMENTED_ITEM_INACTIVE,
  LIST_TOOLBAR_SEGMENTED_TRACK,
} from "@/config/list-toolbar";
import type { MediaViewMode } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryViewToggleProps {
  value: MediaViewMode;
  onChange: (value: MediaViewMode) => void;
}

export function MediaLibraryViewToggle({
  value,
  onChange,
}: MediaLibraryViewToggleProps) {
  return (
    <div className={LIST_TOOLBAR_SEGMENTED_TRACK}>
      <button
        type="button"
        aria-label="List view"
        aria-pressed={value === "table"}
        onClick={() => onChange("table")}
        className={cn(
          LIST_TOOLBAR_SEGMENTED_ITEM,
          "min-w-7 px-1.5",
          value === "table"
            ? LIST_TOOLBAR_SEGMENTED_ITEM_ACTIVE
            : LIST_TOOLBAR_SEGMENTED_ITEM_INACTIVE,
        )}
      >
        <ListIcon className="size-3.5" />
      </button>
      <button
        type="button"
        aria-label="Grid view"
        aria-pressed={value === "grid"}
        onClick={() => onChange("grid")}
        className={cn(
          LIST_TOOLBAR_SEGMENTED_ITEM,
          "min-w-7 px-1.5",
          value === "grid"
            ? LIST_TOOLBAR_SEGMENTED_ITEM_ACTIVE
            : LIST_TOOLBAR_SEGMENTED_ITEM_INACTIVE,
        )}
      >
        <SquaresFourIcon className="size-3.5" />
      </button>
    </div>
  );
}
