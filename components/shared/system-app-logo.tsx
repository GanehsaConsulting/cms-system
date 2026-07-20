"use client";

import Image from "next/image";
import {
  AppMarkTile,
  TILE_SHADOW,
} from "@/components/shared/app-mark-tile";
import { useSidebarAppMarkShell } from "@/hooks/use-sidebar-app-mark-shell";
import { SIDEBAR_APP_MARK_LOGO_IMAGE } from "@/config/sidebar";
import { SYSTEM_LOGO_ALT, SYSTEM_LOGO_SRC } from "@/config/system-brand";
import { cn } from "@/lib/utils";

type SystemAppLogoSize = "sm" | "dock" | "lg";

const IMAGE_SIZE: Record<SystemAppLogoSize, number> = {
  sm: 22,
  dock: 36,
  lg: 80,
};

interface SystemAppLogoProps {
  size?: SystemAppLogoSize;
  className?: string;
  /** Decorative mark — hide from assistive tech when true. */
  decorative?: boolean;
  /** Match sidebar nav icon squircle (menu / dock). */
  sidebarShell?: boolean;
}

/**
 * System mark — sidebar uses the same app-menu squircle as nav icons;
 * other surfaces (e.g. toasts) keep a plain tile via className.
 */
export function SystemAppLogo({
  size = "dock",
  className,
  decorative = true,
  sidebarShell = false,
}: SystemAppLogoProps) {
  const px = IMAGE_SIZE[size];
  const shellSize = size === "sm" ? "sm" : "dock";
  const sidebarShellClassName = useSidebarAppMarkShell(shellSize, "brand");

  return (
    <AppMarkTile
      size={size}
      className={cn(
        sidebarShell && size !== "lg" ? sidebarShellClassName : TILE_SHADOW,
        className,
      )}
      decorative={decorative}
    >
      <Image
        src={SYSTEM_LOGO_SRC}
        alt={decorative ? "" : SYSTEM_LOGO_ALT}
        width={px}
        height={px}
        className={cn(
          "size-full object-contain",
          sidebarShell && size !== "lg" && SIDEBAR_APP_MARK_LOGO_IMAGE,
        )}
        priority={size === "lg"}
      />
    </AppMarkTile>
  );
}
