"use client";

import { useBrand } from "@/components/shared/brand-provider";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

export function BrandSwitchPendingIndicator() {
  const { isSwitchingBrand, activeBrand } = useBrand();

  if (!isSwitchingBrand) {
    return null;
  }

  const label = activeBrand?.name
    ? `Updating ${activeBrand.name}…`
    : "Updating workspace…";

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center p-3"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={cn(
          RADIUS_DEEP,
          "flex items-center gap-2 border border-border/60 bg-background/90 px-3 py-2 text-sm shadow-sm backdrop-blur-md",
        )}
      >
        <span
          className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
          aria-hidden
        />
        <span className="font-medium text-foreground">{label}</span>
      </div>
    </div>
  );
}
