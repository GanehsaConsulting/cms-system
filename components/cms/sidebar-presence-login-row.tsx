import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import { formatPresenceLoginAt } from "@/lib/presence/format-login-at";
import type { CmsLoginHistoryEntry } from "@/types/presence";

interface SidebarPresenceLoginRowProps {
  entry: CmsLoginHistoryEntry;
}

export function SidebarPresenceLoginRow({
  entry,
}: SidebarPresenceLoginRowProps) {
  const when = formatPresenceLoginAt(entry.loggedInAt);

  return (
    <div className="flex items-center gap-3 rounded-xl px-1 py-2">
      <SidebarProfileAvatar
        name={entry.name}
        avatarUrl={entry.avatarUrl}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm leading-tight">
          {entry.name}
        </p>
        <p className="truncate text-muted-foreground text-xs leading-tight">
          {entry.roleLabel}
          {entry.ipAddress ? ` · ${entry.ipAddress}` : ""}
        </p>
      </div>
      <p className="shrink-0 text-right text-[11px] text-muted-foreground leading-tight">
        {when}
      </p>
    </div>
  );
}
