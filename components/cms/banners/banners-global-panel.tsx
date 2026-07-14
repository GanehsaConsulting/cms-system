"use client";

import { PlusIcon } from "@/lib/icons";
import { BannersGlobalPanelItem } from "@/components/cms/banners/banners-global-panel-item";
import { GlassSurface } from "@/components/shared/glass-surface";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/types/banner";
import { cn } from "@/lib/utils";

interface BannersGlobalPanelProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onAddPlacement: () => void;
  className?: string;
}

export function BannersGlobalPanel({
  banners,
  onEdit,
  onAddPlacement,
  className,
}: BannersGlobalPanelProps) {
  return (
    <GlassSurface
      className={cn(
        "flex min-h-0 w-full shrink-0 flex-col overflow-hidden lg:w-88",
        className,
      )}
    >
      <div className="shrink-0 border-(--separator) border-b px-4 py-3">
        <h2 className="font-semibold text-sm">Global Banners</h2>
        <p className="mt-0.5 text-muted-foreground text-xs">
          All your banners in one place.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-3 py-3">
        {banners.length > 0 ? (
          <div className="flex flex-col gap-2">
            {banners.map((banner) => (
              <BannersGlobalPanelItem
                key={banner.id}
                banner={banner}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-40 flex-col items-center justify-center px-4 text-center">
            <p className="font-medium text-sm">No banners yet</p>
            <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
              Create a banner or click a placement to get started.
            </p>
          </div>
        )}
      </div>

      <div className="shrink-0 border-(--separator) border-t p-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-full justify-center gap-1.5"
          onClick={onAddPlacement}
        >
          <PlusIcon className="size-3.5" />
          Add New Placement
        </Button>
      </div>
    </GlassSurface>
  );
}
