import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types/user";

interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-medium text-[11px]",
        status === "active"
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}
