"use client";

import { MEDIA_LIBRARY_TYPE_FILTERS } from "@/config/media-library";
import { getMediaTypeFilterIcon } from "@/lib/media/icons";
import {
  IOS_SEGMENTED_ITEM,
  IOS_SEGMENTED_ITEM_ACTIVE,
  IOS_SEGMENTED_ITEM_INACTIVE,
  IOS_SEGMENTED_TRACK,
} from "@/config/ios-segmented";
import type { MediaTypeFilter } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryTypeTabsProps {
  value: MediaTypeFilter;
  onChange: (value: MediaTypeFilter) => void;
}

export function MediaLibraryTypeTabs({
  value,
  onChange,
}: MediaLibraryTypeTabsProps) {
  return (
    <nav
      className={cn(IOS_SEGMENTED_TRACK, "w-full")}
      aria-label="Media type filters"
    >
      {MEDIA_LIBRARY_TYPE_FILTERS.map((tab) => {
        const isActive = value === tab.id;
        const TabIcon = getMediaTypeFilterIcon(tab.id);

        return (
          <button
            key={tab.id}
            type="button"
            aria-current={isActive ? "true" : undefined}
            onClick={() => onChange(tab.id)}
            className={cn(
              IOS_SEGMENTED_ITEM,
              isActive
                ? IOS_SEGMENTED_ITEM_ACTIVE
                : IOS_SEGMENTED_ITEM_INACTIVE,
            )}
          >
            <TabIcon className="size-3.5 shrink-0" aria-hidden />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
