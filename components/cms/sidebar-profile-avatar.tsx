import Image from "next/image";
import { getAuthorInitials } from "@/lib/articles/list";
import { SIDEBAR_DOCK_APP_ICON_SHELL } from "@/config/sidebar";
import { cn } from "@/lib/utils";

interface SidebarProfileAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: "xs" | "sm" | "md" | "lg" | "dock";
  className?: string;
}

const sizeClasses = {
  xs: "size-5 rounded-full text-[9px]",
  sm: "size-8 rounded-full text-[10px]",
  md: "size-10 rounded-full text-xs",
  lg: "size-14 rounded-full text-base",
} as const;

export function SidebarProfileAvatar({
  name,
  avatarUrl,
  size = "sm",
  className,
}: SidebarProfileAvatarProps) {
  const initials = getAuthorInitials(name);
  const hasPhoto = Boolean(avatarUrl?.trim());

  if (size === "dock") {
    if (hasPhoto) {
      return (
        <span
          aria-hidden
          className={cn(
            SIDEBAR_DOCK_APP_ICON_SHELL,
            "relative overflow-hidden p-0",
            className,
          )}
        >
          <Image
            src={avatarUrl!}
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        </span>
      );
    }

    return (
      <span
        aria-hidden
        className={cn(
          SIDEBAR_DOCK_APP_ICON_SHELL,
          "bg-linear-to-b from-primary via-primary to-primary/90 font-semibold text-xs text-primary-foreground",
          "dark:from-[#3A3A3C] dark:via-[#2C2C2E] dark:to-[#1C1C1E] dark:text-primary",
          className,
        )}
      >
        {initials}
      </span>
    );
  }

  if (hasPhoto) {
    return (
      <span
        aria-hidden
        className={cn(
          "relative shrink-0 overflow-hidden bg-muted",
          sizeClasses[size],
          className,
        )}
      >
        <Image
          src={avatarUrl!}
          alt=""
          fill
          unoptimized
          className="object-cover"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center bg-primary font-semibold text-primary-foreground",
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
