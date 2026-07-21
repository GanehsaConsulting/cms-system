import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import { formatPresenceLastSeen } from "@/lib/presence/format-last-seen";
import type { CmsPresenceUser } from "@/types/presence";
import { cn } from "@/lib/utils";

interface SidebarPresenceUserRowProps {
  user: CmsPresenceUser;
}

export function SidebarPresenceUserRow({ user }: SidebarPresenceUserRowProps) {
  const lastSeen = formatPresenceLastSeen(user.lastSeenAt, user.online);

  return (
    <div className="flex items-center gap-3 rounded-xl px-1 py-2">
      <div className="relative shrink-0">
        <SidebarProfileAvatar
          name={user.name}
          avatarUrl={user.avatarUrl}
          size="sm"
        />
        <span
          aria-hidden
          className={cn(
            "absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-[var(--glass-fill)]",
            user.online ? "bg-emerald-500" : "bg-muted-foreground/40",
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm leading-tight">{user.name}</p>
        <p className="truncate text-muted-foreground text-xs leading-tight">
          {user.roleLabel}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={cn(
            "font-medium text-xs leading-tight",
            user.online ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
          )}
        >
          {user.online ? "Online" : "Offline"}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
          {lastSeen}
        </p>
      </div>
    </div>
  );
}
