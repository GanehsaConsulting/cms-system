"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IOS_SEGMENTED_ITEM,
  IOS_SEGMENTED_ITEM_ACTIVE,
  IOS_SEGMENTED_ITEM_INACTIVE,
  IOS_SEGMENTED_TRACK,
} from "@/config/ios-segmented";
import {
  SETTINGS_TABS,
  getSettingsActiveTab,
} from "@/config/settings";
import { cn } from "@/lib/utils";

export function SettingsTabs() {
  const pathname = usePathname();
  const activeTab = getSettingsActiveTab(pathname);

  return (
    <nav
      className={cn(IOS_SEGMENTED_TRACK, "w-full")}
      aria-label="Settings sections"
    >
      {SETTINGS_TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              IOS_SEGMENTED_ITEM,
              isActive
                ? IOS_SEGMENTED_ITEM_ACTIVE
                : IOS_SEGMENTED_ITEM_INACTIVE,
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
