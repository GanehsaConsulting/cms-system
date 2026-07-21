"use client";

import { SidebarPresenceTrigger } from "@/components/cms/sidebar-presence-trigger";
import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import type { CmsUser } from "@/config/cms-user";
import { RADIUS_DEEP } from "@/config/shape";
import { CaretRightIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface SidebarProfileButtonProps {
  user: CmsUser;
  onlineCount: number;
  onOpen: () => void;
  onOpenPresence: () => void;
  className?: string;
}

export function SidebarProfileButton({
  user,
  onlineCount,
  onOpen,
  onOpenPresence,
  className,
}: SidebarProfileButtonProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-1 overflow-visible p-1",
        className,
      )}
    >
      <SidebarPresenceTrigger
        count={onlineCount}
        onOpen={onOpenPresence}
        className={cn(
          RADIUS_DEEP,
          "p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/8",
        )}
      >
        <SidebarProfileAvatar
          name={user.name}
          avatarUrl={user.avatarUrl}
          size="sm"
        />
      </SidebarPresenceTrigger>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          RADIUS_DEEP,
          "flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left transition-colors",
          "hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          "dark:hover:bg-white/8",
        )}
        aria-label={`Open profile for ${user.name}`}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-sm leading-tight">
            {user.name}
          </span>
          <span className="mt-0.5 block truncate text-muted-foreground text-xs leading-tight">
            {user.role}
          </span>
        </span>
        <CaretRightIcon className="size-3 shrink-0 text-muted-foreground opacity-60" />
      </button>
    </div>
  );
}
