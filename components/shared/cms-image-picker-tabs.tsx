"use client";

import {
  IOS_SEGMENTED_ITEM,
  IOS_SEGMENTED_ITEM_ACTIVE,
  IOS_SEGMENTED_ITEM_INACTIVE,
  IOS_SEGMENTED_TRACK,
} from "@/config/ios-segmented";
import type { CmsImagePickerTab } from "@/types/cms-image-picker";
import { cn } from "@/lib/utils";

const TABS: { id: CmsImagePickerTab; label: string }[] = [
  { id: "shared", label: "Shared" },
  { id: "in-use", label: "In use" },
  { id: "url", label: "URL" },
];

interface CmsImagePickerTabsProps {
  value: CmsImagePickerTab;
  onChange: (value: CmsImagePickerTab) => void;
}

export function CmsImagePickerTabs({
  value,
  onChange,
}: CmsImagePickerTabsProps) {
  return (
    <nav
      className={cn(IOS_SEGMENTED_TRACK, "w-full")}
      aria-label="Image source"
    >
      {TABS.map((tab) => {
        const isActive = value === tab.id;

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
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
