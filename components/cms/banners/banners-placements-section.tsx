"use client";

import { useMemo, useState } from "react";
import { BannerPlacementAddCustomCard } from "@/components/cms/banners/banner-placement-add-custom-card";
import { BannerPlacementCard } from "@/components/cms/banners/banner-placement-card";
import { BannerPlacementWiringDialog } from "@/components/cms/banners/banner-placement-wiring-dialog";
import { GlassSurface } from "@/components/shared/glass-surface";
import {
  BANNER_PLACEMENT_CATEGORIES,
  getBannerPlacementsByCategory,
  isCustomBannerKey,
  toCustomBannerPlacement,
  type BannerPlacement,
} from "@/config/banner-placements";
import type { Banner } from "@/types/banner";
import { cn } from "@/lib/utils";

interface BannersPlacementsSectionProps {
  banners: Banner[];
  bannersByKey: Map<string, Banner>;
  onSelectPlacement: (placement: BannerPlacement, banner: Banner | null) => void;
  onAddCustomBanner: () => void;
  className?: string;
}

export function BannersPlacementsSection({
  banners,
  bannersByKey,
  onSelectPlacement,
  onAddCustomBanner,
  className,
}: BannersPlacementsSectionProps) {
  const [wiringPlacement, setWiringPlacement] = useState<BannerPlacement | null>(
    null,
  );

  const customBanners = useMemo(
    () =>
      banners
        .filter((banner) => isCustomBannerKey(banner.key))
        .sort((left, right) => left.name.localeCompare(right.name)),
    [banners],
  );

  return (
    <>
      <GlassSurface
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          className,
        )}
      >
        <div className="shrink-0 border-(--separator) border-b px-4 py-3">
          <h2 className="font-semibold text-sm">Website</h2>
          <p className="mt-0.5 text-muted-foreground text-xs">
            Fixed banner slots stay required once set up. Custom banners use
            keys you add yourself — use Copy FE docs for frontend wiring.
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-auto p-4">
          {BANNER_PLACEMENT_CATEGORIES.map((category) => {
            if (category.id === "custom") {
              return (
                <section key={category.id} className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm">{category.title}</h3>
                    <p className="mt-0.5 text-muted-foreground text-xs">
                      {category.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {customBanners.map((banner) => {
                      const placement = toCustomBannerPlacement(banner);

                      return (
                        <BannerPlacementCard
                          key={banner.id}
                          placement={placement}
                          banner={banner}
                          onSelect={() => onSelectPlacement(placement, banner)}
                          onOpenWiring={() => setWiringPlacement(placement)}
                        />
                      );
                    })}

                    <BannerPlacementAddCustomCard onAdd={onAddCustomBanner} />
                  </div>
                </section>
              );
            }

            const placements = getBannerPlacementsByCategory(category.id);

            return (
              <section key={category.id} className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm">{category.title}</h3>
                  <p className="mt-0.5 text-muted-foreground text-xs">
                    {category.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {placements.map((placement) => {
                    const banner = bannersByKey.get(placement.key) ?? null;

                    return (
                      <BannerPlacementCard
                        key={placement.id}
                        placement={placement}
                        banner={banner}
                        onSelect={() => onSelectPlacement(placement, banner)}
                        onOpenWiring={() => setWiringPlacement(placement)}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </GlassSurface>

      <BannerPlacementWiringDialog
        open={Boolean(wiringPlacement)}
        onOpenChange={(open) => {
          if (!open) {
            setWiringPlacement(null);
          }
        }}
        placement={wiringPlacement}
      />
    </>
  );
}
