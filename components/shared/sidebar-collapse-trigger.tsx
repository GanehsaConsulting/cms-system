"use client";

import { SidebarIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { GLASS_HOVER, GLASS_SURFACE } from "@/config/glass";
import {
  SEPARATED_MENU_ITEM,
  SIDEBAR_APP_ICON_GLYPH,
  SIDEBAR_APP_ICON_GRADIENTS,
  SIDEBAR_APP_ICON_SHELL,
} from "@/config/sidebar";
import { SEPARATED_CONTROL } from "@/config/shape";
import { cn } from "@/lib/utils";

interface SidebarCollapseTriggerProps {
  className?: string;
}

export function SidebarCollapseTrigger({
  className,
}: SidebarCollapseTriggerProps) {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={isCollapsed ? "Buka sidebar" : "Minimalkan sidebar"}
      onClick={toggleSidebar}
      className={cn(
        isCollapsed
          ? cn(
              SIDEBAR_APP_ICON_SHELL,
              "bg-linear-to-b",
              SIDEBAR_APP_ICON_GRADIENTS.collapse,
              "size-9 p-0 hover:opacity-90",
            )
          : cn(
              GLASS_SURFACE,
              GLASS_HOVER,
              SEPARATED_CONTROL,
              "size-8 shrink-0 p-0",
              "opacity-0 transition-opacity focus-visible:opacity-100 group-hover/sidebar:opacity-100",
            ),
        className,
      )}
    >
      <SidebarIcon
        className={cn(isCollapsed ? SIDEBAR_APP_ICON_GLYPH : "size-4")}
      />
    </Button>
  );
}
