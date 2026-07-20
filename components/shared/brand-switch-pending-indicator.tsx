"use client";

import { useBrand } from "@/components/shared/brand-provider";
import { MacActivityIndicator } from "@/components/shared/mac-activity-indicator";
import { cn } from "@/lib/utils";

export function BrandSwitchPendingIndicator() {
  const { isSwitchingBrand, activeBrand } = useBrand();

  if (!isSwitchingBrand) {
    return null;
  }

  const label = activeBrand?.name
    ? `Loading ${activeBrand.name}…`
    : "Loading workspace…";

  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center",
        "bg-black/12 dark:bg-black/45",
        "backdrop-blur-lg backdrop-saturate-150",
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex min-w-42 flex-col items-center gap-3 px-7 py-6">
        <MacActivityIndicator className="size-17 text-foreground/40" />
        <p className="max-w-48 text-center font-medium text-[16px] text-foreground/50 leading-snug tracking-tight">
          {label}
        </p>
      </div>
    </div>
  );
}
