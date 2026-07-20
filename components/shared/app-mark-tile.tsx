import Image from "next/image";
import { SIDEBAR_APP_MARK_LOGO_IMAGE } from "@/config/sidebar";
import { cn } from "@/lib/utils";

type AppMarkTileSize = "sm" | "dock" | "lg";

const SIZE_CLASS: Record<AppMarkTileSize, string> = {
  sm: "size-[1.375rem] rounded-[0.35rem] p-0.5",
  dock: "size-9 rounded-[0.7rem] p-1",
  lg: "size-20 rounded-[1.35rem] p-3",
};

const TILE_SHADOW =
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_1px_3px_rgba(0,0,0,0.45)]";

interface AppMarkTileProps {
  children: React.ReactNode;
  size?: AppMarkTileSize;
  className?: string;
  /** Decorative mark — hide from assistive tech when true. */
  decorative?: boolean;
}

/** App squircle container — use with sidebar shell classes or custom tile styling. */
export function AppMarkTile({
  children,
  size = "dock",
  className,
  decorative = true,
}: AppMarkTileProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        SIZE_CLASS[size],
        className,
      )}
      aria-hidden={decorative || undefined}
    >
      {children}
    </span>
  );
}

interface BrandAppLogoProps {
  src: string;
  size?: AppMarkTileSize;
  className?: string;
  alt?: string;
  shellClassName?: string;
}

const IMAGE_SIZE: Record<AppMarkTileSize, number> = {
  sm: 22,
  dock: 36,
  lg: 80,
};

/** Brand mark on the same app-menu squircle as SidebarAppIcon. */
export function BrandAppLogo({
  src,
  size = "dock",
  className,
  alt = "",
  shellClassName,
}: BrandAppLogoProps) {
  const px = IMAGE_SIZE[size];

  return (
    <AppMarkTile
      size={size}
      className={cn(shellClassName, className)}
      decorative={alt === ""}
    >
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        unoptimized
        className={cn("size-full object-contain", SIDEBAR_APP_MARK_LOGO_IMAGE)}
      />
    </AppMarkTile>
  );
}

export { TILE_SHADOW };
