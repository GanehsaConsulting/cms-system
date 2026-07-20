"use client";

import {
  BrandAppLogo as BrandAppLogoBase,
} from "@/components/shared/app-mark-tile";
import { useSidebarAppMarkShell } from "@/hooks/use-sidebar-app-mark-shell";

type BrandAppLogoSize = "sm" | "dock" | "lg";

interface BrandAppLogoProps {
  src: string;
  size?: BrandAppLogoSize;
  className?: string;
  alt?: string;
}

/** Brand logo with sidebar app-menu shell (matches nav icon tiles). */
export function BrandAppLogo({
  src,
  size = "dock",
  className,
  alt = "",
}: BrandAppLogoProps) {
  const shellSize = size === "sm" ? "sm" : "dock";
  const shellClassName = useSidebarAppMarkShell(shellSize, "brand");

  if (size === "lg") {
    return (
      <BrandAppLogoBase
        src={src}
        size="lg"
        className={className}
        alt={alt}
      />
    );
  }

  return (
    <BrandAppLogoBase
      src={src}
      size={size}
      className={className}
      alt={alt}
      shellClassName={shellClassName}
    />
  );
}
