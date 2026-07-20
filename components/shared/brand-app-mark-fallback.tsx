"use client";

import { AppMarkTile } from "@/components/shared/app-mark-tile";
import { useSidebarAppMarkShell } from "@/hooks/use-sidebar-app-mark-shell";
import { cn } from "@/lib/utils";

interface BrandAppMarkFallbackProps {
  label: string;
  size?: "sm" | "dock";
  className?: string;
}

/** Initial fallback when a brand has no logo — same shell as BrandAppLogo. */
export function BrandAppMarkFallback({
  label,
  size = "dock",
  className,
}: BrandAppMarkFallbackProps) {
  const shellClassName = useSidebarAppMarkShell(size, "brand");

  return (
    <AppMarkTile size={size} className={cn(shellClassName, className)}>
      <span className="font-semibold text-muted-foreground text-sm">
        {label.slice(0, 1).toUpperCase()}
      </span>
    </AppMarkTile>
  );
}
