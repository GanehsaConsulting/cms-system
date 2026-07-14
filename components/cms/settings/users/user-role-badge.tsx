import { getUserRoleLabel, type UserRoleId } from "@/config/user";
import { cn } from "@/lib/utils";

interface UserRoleBadgeProps {
  role: UserRoleId;
  className?: string;
}

const roleStyles: Record<UserRoleId, string> = {
  "super-admin":
    "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  admin: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  viewer: "bg-muted text-muted-foreground",
};

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-medium text-[11px]",
        roleStyles[role],
        className,
      )}
    >
      {getUserRoleLabel(role)}
    </span>
  );
}
