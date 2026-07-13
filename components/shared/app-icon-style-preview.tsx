import { SquaresFourIcon } from "@/lib/icons";
import {
  getSidebarAppIconTone,
  SIDEBAR_APP_ICON_GLYPH_SHADOW_COLORED,
  SIDEBAR_APP_ICON_SHELL,
} from "@/config/sidebar";
import type { AppIconStyle } from "@/types/appearance";
import { cn } from "@/lib/utils";

interface AppIconStylePreviewProps {
  style: AppIconStyle;
}

export function AppIconStylePreview({ style }: AppIconStylePreviewProps) {
  const { shell, glyph } = getSidebarAppIconTone("overview", style);

  return (
    <span
      aria-hidden
      className={cn(SIDEBAR_APP_ICON_SHELL, "bg-linear-to-b", shell)}
    >
      <SquaresFourIcon
        className={cn(
          "size-[0.875rem]!",
          glyph,
          style === "colored" && SIDEBAR_APP_ICON_GLYPH_SHADOW_COLORED,
        )}
      />
    </span>
  );
}
