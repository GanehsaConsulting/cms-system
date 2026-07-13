"use client";

import { SidebarIcon } from "@/lib/icons";
import { useAppearance } from "@/components/shared/appearance-provider";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { GLASS_HOVER, GLASS_SURFACE } from "@/config/glass";
import {
  getSidebarAppIconTone,
  SIDEBAR_APP_ICON_GLYPH_SHADOW_COLORED,
  SIDEBAR_DOCK_APP_ICON_GLYPH_SIZE,
  SIDEBAR_DOCK_APP_ICON_SHELL,
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
  const { appIconStyle } = useAppearance();
  const isCollapsed = state === "collapsed";
  const collapseTone = getSidebarAppIconTone("collapse", appIconStyle);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      onClick={toggleSidebar}
      className={cn(
        isCollapsed
          ? cn(
              SIDEBAR_DOCK_APP_ICON_SHELL,
              "bg-linear-to-b",
              collapseTone.shell,
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
        className={cn(
          isCollapsed
            ? cn(
                SIDEBAR_DOCK_APP_ICON_GLYPH_SIZE,
                collapseTone.glyph,
                appIconStyle === "colored" &&
                  SIDEBAR_APP_ICON_GLYPH_SHADOW_COLORED,
              )
            : "size-4",
        )}
      />
    </Button>
  );
}
