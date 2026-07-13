"use client";

import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { NOTIFICATION_CARD_SURFACE } from "@/config/notification-center";
import {
  DollarSignIcon,
  FileTextIcon,
  GearSixIcon,
  type Icon,
  Person2Icon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { CmsNotification, NotificationKind } from "@/types/notification";

const KIND_ICON: Record<NotificationKind, Icon> = {
  article: FileTextIcon,
  price: DollarSignIcon,
  client: Person2Icon,
  system: GearSixIcon,
};

interface NotificationCardProps {
  notification: CmsNotification;
  onSelect?: (notification: CmsNotification) => void;
}

export function NotificationCard({
  notification,
  onSelect,
}: NotificationCardProps) {
  const Icon = KIND_ICON[notification.kind];

  return (
    <button
      type="button"
      className={cn(
        NOTIFICATION_CARD_SURFACE,
        "flex w-full items-start gap-3 text-left transition-colors hover:bg-white/70 dark:hover:bg-white/14",
      )}
      onClick={() => onSelect?.(notification)}
    >
      <SidebarAppIcon icon={Icon} tone={notification.tone} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-semibold text-sm leading-tight">
            {notification.title}
          </p>
          <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
            {notification.timeLabel}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
          {notification.body}
        </p>
      </div>
    </button>
  );
}
