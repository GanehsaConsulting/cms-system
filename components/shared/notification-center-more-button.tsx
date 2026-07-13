"use client";

import { Button } from "@/components/ui/button";
import { NOTIFICATION_PILL_BUTTON } from "@/config/notification-center";
import { cn } from "@/lib/utils";

interface NotificationCenterMoreButtonProps {
  remainingCount: number;
  expanded: boolean;
  onToggle: () => void;
}

export function NotificationCenterMoreButton({
  remainingCount,
  expanded,
  onToggle,
}: NotificationCenterMoreButtonProps) {
  if (remainingCount <= 0 && !expanded) {
    return null;
  }

  return (
    <div className="flex justify-center pt-1">
      <Button
        type="button"
        variant="ghost"
        className={cn(NOTIFICATION_PILL_BUTTON)}
        onClick={onToggle}
      >
        {expanded
          ? "Show less"
          : `${remainingCount} more notification${remainingCount === 1 ? "" : "s"}`}
      </Button>
    </div>
  );
}
