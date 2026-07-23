"use client";

import { MEDIA_LIBRARY_SECTIONS } from "@/config/media-library";
import {
  IOS_SEGMENTED_ITEM,
  IOS_SEGMENTED_ITEM_ACTIVE,
  IOS_SEGMENTED_ITEM_INACTIVE,
  IOS_SEGMENTED_TRACK,
} from "@/config/ios-segmented";
import type { MediaLibrarySection } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibrarySectionTabsProps {
  value: MediaLibrarySection;
  onChange: (value: MediaLibrarySection) => void;
}

export function MediaLibrarySectionTabs({
  value,
  onChange,
}: MediaLibrarySectionTabsProps) {
  return (
    <nav
      className={cn(IOS_SEGMENTED_TRACK, "w-full max-w-xl")}
      aria-label="Files & media sections"
    >
      {MEDIA_LIBRARY_SECTIONS.map((section) => {
        const isActive = value === section.id;

        return (
          <button
            key={section.id}
            type="button"
            aria-current={isActive ? "true" : undefined}
            onClick={() => onChange(section.id)}
            className={cn(
              IOS_SEGMENTED_ITEM,
              isActive
                ? IOS_SEGMENTED_ITEM_ACTIVE
                : IOS_SEGMENTED_ITEM_INACTIVE,
            )}
          >
            {section.label}
          </button>
        );
      })}
    </nav>
  );
}
