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
  onToggleRead?: (notification: CmsNotification) => void;
}

export function NotificationCard({
  notification,
  onSelect,
  onToggleRead,
}: NotificationCardProps) {
  const Icon = KIND_ICON[notification.kind];
  const isUnread = !notification.read;

  return (
    <div
      className={cn(
        NOTIFICATION_CARD_SURFACE,
        "flex w-full items-start gap-3 transition-colors",
        isUnread
          ? "bg-white/70 ring-1 ring-primary/15 dark:bg-white/14 dark:ring-primary/25"
          : "opacity-90",
      )}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 items-start gap-3 text-left"
        onClick={() => onSelect?.(notification)}
      >
        <span className="relative mt-0.5 shrink-0">
          <SidebarAppIcon icon={Icon} tone={notification.tone} />
          {isUnread ? (
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-red-500"
            />
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span
              className={cn(
                "truncate text-sm leading-tight",
                isUnread ? "font-semibold" : "font-medium",
              )}
            >
              {notification.title}
            </span>
            <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
              {notification.timeLabel}
            </span>
          </span>
          <span className="mt-0.5 line-clamp-2 block text-muted-foreground text-xs leading-relaxed">
            {notification.body}
          </span>
        </span>
      </button>

      {onToggleRead ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleRead(notification);
          }}
          className={cn(
            "mt-0.5 shrink-0 rounded-full px-2 py-1 text-[11px] font-medium transition-colors",
            "hover:bg-black/5 dark:hover:bg-white/10",
            isUnread
              ? "text-primary"
              : "text-muted-foreground",
          )}
          aria-label={
            isUnread
              ? `Mark ${notification.title} as read`
              : `Mark ${notification.title} as unread`
          }
        >
          {isUnread ? "Mark read" : "Unread"}
        </button>
      ) : null}
    </div>
  );
}
