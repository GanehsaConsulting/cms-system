"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NotificationCenterList } from "@/components/shared/notification-center-list";
import { NotificationCenterMoreButton } from "@/components/shared/notification-center-more-button";
import { useNotificationCenter } from "@/components/shared/notification-center-provider";
import { NotificationCenterWidgets } from "@/components/shared/notification-center-widgets";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NOTIFICATION_CENTER_SURFACE } from "@/config/notification-center";
import { NOTIFICATION_CENTER_VISIBLE_COUNT } from "@/config/notifications";
import { CheckIcon, XIcon } from "@/lib/icons";
import type { CmsNotification } from "@/types/notification";

export function NotificationCenterDrawer() {
  const router = useRouter();
  const {
    open,
    setOpen,
    notifications,
    unreadCount,
    markRead,
    markUnread,
    markAllRead,
  } = useNotificationCenter();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded
    ? notifications
    : notifications.slice(0, NOTIFICATION_CENTER_VISIBLE_COUNT);
  const remaining = Math.max(
    0,
    notifications.length - NOTIFICATION_CENTER_VISIBLE_COUNT,
  );

  function handleSelect(notification: CmsNotification) {
    markRead(notification.id);
    if (notification.href) {
      setOpen(false);
      router.push(notification.href);
    }
  }

  function handleToggleRead(notification: CmsNotification) {
    if (notification.read) {
      markUnread(notification.id);
      return;
    }
    markRead(notification.id);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setExpanded(false);
        }
      }}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className={NOTIFICATION_CENTER_SURFACE}
      >
        <SheetHeader className="flex-row items-center justify-between gap-3 space-y-0 px-5 py-4 text-left">
          <div className="min-w-0">
            <SheetTitle className="text-[15px]">Notification Center</SheetTitle>
            <SheetDescription className="text-xs">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up"}
            </SheetDescription>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {unreadCount > 0 ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 gap-1.5 rounded-full bg-white/45 px-3 text-xs dark:bg-secondary"
                onClick={markAllRead}
              >
                <CheckIcon className="size-3.5" />
                Read all
              </Button>
            ) : null}
            <SheetClose
              render={
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className="size-8 shrink-0 rounded-full bg-white/45 dark:bg-secondary"
                  aria-label="Close notification center"
                />
              }
            >
              <XIcon className="size-3.5" />
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-4 pb-4">
          <section
            aria-label="Notifications"
            className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden"
          >
            <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
              <NotificationCenterList
                notifications={visible}
                onSelect={handleSelect}
                onToggleRead={handleToggleRead}
              />
            </div>
            <NotificationCenterMoreButton
              remainingCount={remaining}
              expanded={expanded}
              onToggle={() => setExpanded((current) => !current)}
            />
          </section>

          <NotificationCenterWidgets />
        </div>
      </SheetContent>
    </Sheet>
  );
}
