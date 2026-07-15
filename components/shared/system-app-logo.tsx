import Image from "next/image";
import { AppMarkTile } from "@/components/shared/app-mark-tile";
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
}

/**
 * System mark on a frosted glass app tile — use wherever the CMS logo
 * appears over wallpaper or glass UI (login, sidebar fallback, etc.).
 */
export function SystemAppLogo({
  size = "dock",
  className,
  decorative = true,
}: SystemAppLogoProps) {
  const px = IMAGE_SIZE[size];

  return (
    <AppMarkTile size={size} className={cn(className)} decorative={decorative}>
      <Image
        src={SYSTEM_LOGO_SRC}
        alt={decorative ? "" : SYSTEM_LOGO_ALT}
        width={px}
        height={px}
        className="size-full object-contain"
        priority={size === "lg"}
      />
    </AppMarkTile>
  );
}
