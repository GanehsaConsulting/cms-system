"use client";

import { PlusIcon } from "@/lib/icons";
import { RADIUS_INNER } from "@/config/shape";
import { cn } from "@/lib/utils";

interface BannerPlacementAddCtaCardProps {
  onAdd: () => void;
}

export function BannerPlacementAddCtaCard({
  onAdd,
}: BannerPlacementAddCtaCardProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className={cn(
        RADIUS_INNER,
        "flex min-h-50 flex-col items-center justify-center gap-2 border border-dashed border-black/12 bg-white/35 p-4 text-center transition-colors",
        "hover:border-black/20 hover:bg-white/55",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "dark:border-white/14 dark:bg-white/4 dark:hover:border-white/22 dark:hover:bg-white/8",
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <PlusIcon className="size-4" />
      </span>
      <span className="font-semibold text-sm">Add custom CTA</span>
      <span className="max-w-56 text-muted-foreground text-xs leading-relaxed">
        Create a new placement with your own key for the frontend to fetch.
      </span>
    </button>
  );
}
