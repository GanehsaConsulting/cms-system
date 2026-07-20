"use client";

import { useBrand } from "@/components/shared/brand-provider";
import { MacActivityIndicator } from "@/components/shared/mac-activity-indicator";
import { GLASS_BACKDROP } from "@/config/glass";
import { RADIUS_INNER } from "@/config/shape";
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
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center",
        "bg-black/12 dark:bg-black/45",
        "backdrop-blur-2xl backdrop-saturate-150",
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={cn(
          RADIUS_INNER,
          GLASS_BACKDROP,
          "flex min-w-42 flex-col items-center gap-3 border border-white/40 bg-white/65 px-7 py-6 shadow-[0_10px_40px_rgb(0_0_0/0.14)]",
          "dark:border-white/12 dark:bg-[#2c2c2e]/75 dark:shadow-[0_10px_40px_rgb(0_0_0/0.5)]",
        )}
      >
        <MacActivityIndicator className="size-10 text-foreground/85" />
        <p className="max-w-48 text-center font-medium text-[13px] text-foreground/90 leading-snug tracking-tight">
          {label}
        </p>
      </div>
    </div>
  );
}
