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
import {
  MOCK_NOTIFICATIONS,
  NOTIFICATION_CENTER_VISIBLE_COUNT,
} from "@/config/notifications";
import { XIcon } from "@/lib/icons";
import type { CmsNotification } from "@/types/notification";

export function NotificationCenterDrawer() {
  const router = useRouter();
  const { open, setOpen } = useNotificationCenter();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded
    ? MOCK_NOTIFICATIONS
    : MOCK_NOTIFICATIONS.slice(0, NOTIFICATION_CENTER_VISIBLE_COUNT);
  const remaining = Math.max(
    0,
    MOCK_NOTIFICATIONS.length - NOTIFICATION_CENTER_VISIBLE_COUNT,
  );

  function handleSelect(notification: CmsNotification) {
    if (notification.href) {
      setOpen(false);
      router.push(notification.href);
    }
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
            <SheetDescription className="sr-only">
              Recent CMS activity and widgets.
            </SheetDescription>
          </div>
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
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
          <section aria-label="Notifications" className="space-y-2">
            <NotificationCenterList
              notifications={visible}
              onSelect={handleSelect}
            />
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
