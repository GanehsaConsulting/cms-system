"use client";

import { BannerPlacementMockView } from "@/components/cms/banners/banner-placement-mock-view";
import { BannerStatusBadge } from "@/components/cms/banners/banner-status-badge";
import { Button } from "@/components/ui/button";
import type { BannerPlacement } from "@/config/banner-placements";
import { RADIUS_INNER } from "@/config/shape";
import { DocumentIcon } from "@/lib/icons";
import { getBannerImages } from "@/lib/banners/images";
import type { Banner } from "@/types/banner";
import { cn } from "@/lib/utils";

interface BannerPlacementCardProps {
  placement: BannerPlacement;
  banner: Banner | null;
  onSelect: () => void;
  onOpenWiring: () => void;
}

export function BannerPlacementCard({
  placement,
  banner,
  onSelect,
  onOpenWiring,
}: BannerPlacementCardProps) {
  const isActive = Boolean(banner?.isActive);
  const images = banner ? getBannerImages(banner) : [];
  const isConfigured = Boolean(banner);

  return (
    <div
      className={cn(
        RADIUS_INNER,
        "flex flex-col gap-3 border border-black/6 bg-white/50 p-3",
        "dark:border-white/8 dark:bg-white/6",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "group flex flex-col gap-3 text-left transition-colors",
          "rounded-[calc(var(--radius-inner)-0.25rem)]",
          "hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <h3 className="font-semibold text-sm leading-snug">
              {placement.title}
            </h3>
            <p className="font-mono text-[10px] text-muted-foreground">
              {placement.key}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <BannerStatusBadge isActive={isActive} />
            {placement.required ? (
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary">
                {isConfigured ? "Required" : "Setup required"}
              </span>
            ) : (
              <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground">
                Custom
              </span>
            )}
          </div>
        </div>

        <BannerPlacementMockView mock={placement.mock} images={images} />

        <p className="text-muted-foreground text-xs leading-relaxed">
          {!isConfigured && placement.required
            ? "Empty in CMS — FE should hide this slot until content is added."
            : placement.description}
        </p>
      </button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 w-full gap-1.5"
        onClick={(event) => {
          event.stopPropagation();
          onOpenWiring();
        }}
      >
        <DocumentIcon className="size-3.5" />
        Copy FE docs
      </Button>
    </div>
  );
}
