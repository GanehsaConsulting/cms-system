"use client";

import { BannerPlacementMockView } from "@/components/cms/banners/banner-placement-mock-view";
import { BannerStatusBadge } from "@/components/cms/banners/banner-status-badge";
import type { BannerPlacement } from "@/config/banner-placements";
import { RADIUS_INNER } from "@/config/shape";
import { getBannerImages } from "@/lib/banners/images";
import type { Banner } from "@/types/banner";
import { cn } from "@/lib/utils";

interface BannerPlacementCardProps {
  placement: BannerPlacement;
  banner: Banner | null;
  onSelect: () => void;
}

export function BannerPlacementCard({
  placement,
  banner,
  onSelect,
}: BannerPlacementCardProps) {
  const isActive = Boolean(banner?.isActive);
  const images = banner ? getBannerImages(banner) : [];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        RADIUS_INNER,
        "group flex flex-col gap-3 border border-black/6 bg-white/50 p-3 text-left transition-colors",
        "hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "dark:border-white/8 dark:bg-white/6 dark:hover:bg-white/10",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 font-semibold text-sm leading-snug">
          {placement.title}
        </h3>
        <BannerStatusBadge isActive={isActive} className="shrink-0" />
      </div>

      <BannerPlacementMockView mock={placement.mock} images={images} />

      <p className="text-muted-foreground text-xs leading-relaxed">
        {placement.description}
      </p>
    </button>
  );
}
