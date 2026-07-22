"use client";

import {
  CONTENT_ACTIVITY_KIND_TABS,
  type ContentActivityKindFilter,
} from "@/config/content-activities-list";
import {
  IOS_SEGMENTED_ITEM,
  IOS_SEGMENTED_ITEM_ACTIVE,
  IOS_SEGMENTED_ITEM_INACTIVE,
  IOS_SEGMENTED_TRACK,
} from "@/config/ios-segmented";
import { SparkleIcon, SquaresFourIcon, TagIcon } from "@/lib/icons";
import type { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const TAB_ICONS: Record<ContentActivityKindFilter, Icon> = {
  all: SquaresFourIcon,
  activity: SparkleIcon,
  promo: TagIcon,
};

interface ContentActivitiesListKindTabsProps {
  value: ContentActivityKindFilter;
  counts: Record<ContentActivityKindFilter, number>;
  onChange: (value: ContentActivityKindFilter) => void;
}

export function ContentActivitiesListKindTabs({
  value,
  counts,
  onChange,
}: ContentActivitiesListKindTabsProps) {
  return (
    <nav
      className={cn(IOS_SEGMENTED_TRACK, "w-full")}
      aria-label="Activity and promo filters"
    >
      {CONTENT_ACTIVITY_KIND_TABS.map((tab) => {
        const isActive = value === tab.id;
        const TabIcon = TAB_ICONS[tab.id];
        const count = counts[tab.id];

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
            <span>{tab.label}</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 font-normal text-[10px] tabular-nums",
                isActive
                  ? "bg-black/6 text-foreground dark:bg-white/10"
                  : "bg-black/4 text-muted-foreground dark:bg-white/6",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
