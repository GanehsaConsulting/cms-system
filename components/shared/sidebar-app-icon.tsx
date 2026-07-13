"use client";

import type { Icon } from "@/lib/icons";
import { useAppearance } from "@/components/shared/appearance-provider";
import {
  getSidebarAppIconTone,
  SIDEBAR_APP_ICON_GLYPH_SHADOW_COLORED,
  SIDEBAR_APP_ICON_GLYPH_SIZE,
  SIDEBAR_APP_ICON_SHELL,
  SIDEBAR_DOCK_APP_ICON_GLYPH_SIZE,
  SIDEBAR_DOCK_APP_ICON_SHELL,
  type SidebarAppIconTone,
} from "@/config/sidebar";
import { cn } from "@/lib/utils";

interface SidebarAppIconProps {
  icon: Icon;
  tone: SidebarAppIconTone;
  className?: string;
  /** `menu` = System Settings scale; `dock` = header / collapsed rail. */
  size?: "menu" | "dock";
  /** @deprecated Use `size="dock"` instead. */
  forceAppStyle?: boolean;
}

export function SidebarAppIcon({
  icon: IconComponent,
  tone,
  className,
  size = "menu",
  forceAppStyle = false,
}: SidebarAppIconProps) {
  const isDock = size === "dock" || forceAppStyle;
  const { appIconStyle } = useAppearance();
  const { shell, glyph } = getSidebarAppIconTone(tone, appIconStyle);

  return (
    <span
      className={cn(
        isDock ? SIDEBAR_DOCK_APP_ICON_SHELL : SIDEBAR_APP_ICON_SHELL,
        "bg-linear-to-b",
        shell,
        className,
      )}
    >
      <IconComponent
        className={cn(
          isDock ? SIDEBAR_DOCK_APP_ICON_GLYPH_SIZE : SIDEBAR_APP_ICON_GLYPH_SIZE,
          glyph,
          appIconStyle === "colored" && SIDEBAR_APP_ICON_GLYPH_SHADOW_COLORED,
        )}
      />
    </span>
  );
}
