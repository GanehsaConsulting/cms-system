"use client";

import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import type { SidebarSearchItem } from "@/lib/sidebar/search";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface SidebarSearchResultItemProps {
  item: SidebarSearchItem;
  active?: boolean;
  onSelect: (item: SidebarSearchItem) => void;
}

export function SidebarSearchResultItem({
  item,
  active = false,
  onSelect,
}: SidebarSearchResultItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={cn(
        RADIUS_DEEP,
        "flex w-full items-center gap-2.5 px-2.5 py-2 text-left transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted/80",
      )}
    >
      <SidebarAppIcon icon={item.icon} tone={item.tone} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm">{item.title}</p>
        <p
          className={cn(
            "truncate text-xs",
            active ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {item.subtitle}
        </p>
      </div>
    </button>
  );
}
