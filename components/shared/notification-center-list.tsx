"use client";

import { NotificationCard } from "@/components/shared/notification-card";
import type { CmsNotification } from "@/types/notification";

interface NotificationCenterListProps {
  notifications: CmsNotification[];
  onSelect: (notification: CmsNotification) => void;
}

export function NotificationCenterList({
  notifications,
  onSelect,
}: NotificationCenterListProps) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-[1.15rem] bg-white/40 px-4 py-8 text-center dark:bg-white/8">
        <p className="font-medium text-sm">No notifications</p>
        <p className="mt-1 text-muted-foreground text-xs">
          CMS activity will show up here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {notifications.map((notification) => (
        <li key={notification.id}>
          <NotificationCard notification={notification} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}
