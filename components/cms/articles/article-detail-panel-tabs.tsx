"use client";

import type { ArticleDetailPanelTab } from "@/components/cms/articles/article-detail-panel";
import {
  IOS_SEGMENTED_ITEM,
  IOS_SEGMENTED_ITEM_ACTIVE,
  IOS_SEGMENTED_ITEM_INACTIVE,
  IOS_SEGMENTED_TRACK,
} from "@/config/ios-segmented";
import { cn } from "@/lib/utils";

const PANEL_TABS: { id: ArticleDetailPanelTab; label: string }[] = [
  { id: "detail", label: "Detail" },
  { id: "seo", label: "SEO" },
];

interface ArticleDetailPanelTabsProps {
  activeTab: ArticleDetailPanelTab;
  onTabChange: (tab: ArticleDetailPanelTab) => void;
}

export function ArticleDetailPanelTabs({
  activeTab,
  onTabChange,
}: ArticleDetailPanelTabsProps) {
  return (
    <nav
      className={cn(IOS_SEGMENTED_TRACK, "mt-4")}
      role="tablist"
      aria-label="Article panel sections"
    >
      {PANEL_TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
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
