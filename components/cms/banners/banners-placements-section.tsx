"use client";

import { BannerPlacementCard } from "@/components/cms/banners/banner-placement-card";
import { GlassSurface } from "@/components/shared/glass-surface";
import {
  BANNER_PLACEMENTS,
  type BannerPlacement,
} from "@/config/banner-placements";
import type { Banner } from "@/types/banner";
import { cn } from "@/lib/utils";

interface BannersPlacementsSectionProps {
  bannersByKey: Map<string, Banner>;
  onSelectPlacement: (placement: BannerPlacement, banner: Banner | null) => void;
  className?: string;
}

export function BannersPlacementsSection({
  bannersByKey,
  onSelectPlacement,
  className,
}: BannersPlacementsSectionProps) {
  return (
    <GlassSurface
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
        className,
      )}
    >
      <div className="shrink-0 border-(--separator) border-b px-4 py-3">
        <h2 className="font-semibold text-sm">Website</h2>
        <p className="mt-0.5 text-muted-foreground text-xs">
          Click on any placement to edit its banner.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {BANNER_PLACEMENTS.map((placement) => {
            const banner = bannersByKey.get(placement.key) ?? null;

            return (
              <BannerPlacementCard
                key={placement.id}
                placement={placement}
                banner={banner}
                onSelect={() => onSelectPlacement(placement, banner)}
              />
            );
          })}
        </div>
      </div>
    </GlassSurface>
  );
}
