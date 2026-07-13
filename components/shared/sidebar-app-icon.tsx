"use client";

import type { Icon } from "@/lib/icons";
import { useSidebar } from "@/components/ui/sidebar";
import {
  SIDEBAR_APP_ICON_GLYPH,
  SIDEBAR_APP_ICON_SHELL,
  type SidebarAppIconGradient,
} from "@/config/sidebar";
import { cn } from "@/lib/utils";

interface SidebarAppIconProps {
  icon: Icon;
  gradient: SidebarAppIconGradient;
  className?: string;
  isActive?: boolean;
  forceAppStyle?: boolean;
}

export function SidebarAppIcon({
  icon: IconComponent,
  gradient,
  className,
  isActive = false,
  forceAppStyle = false,
}: SidebarAppIconProps) {
  const { state } = useSidebar();
  const isAppStyle = forceAppStyle || state === "collapsed";

  if (!isAppStyle) {
    return <IconComponent className={cn("size-4 shrink-0", className)} />;
  }

  return (
    <span
      className={cn(
        SIDEBAR_APP_ICON_SHELL,
        "bg-linear-to-b",
        gradient,
        isActive && "ring-2 ring-white/80 ring-offset-2 ring-offset-black/10",
        className,
      )}
    >
      <IconComponent className={SIDEBAR_APP_ICON_GLYPH} />
    </span>
  );
}
