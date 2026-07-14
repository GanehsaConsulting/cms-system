"use client";

import Image from "next/image";
import { BannerRowActionsMenu } from "@/components/cms/banners/banner-row-actions-menu";
import { RADIUS_DEEP } from "@/config/shape";
import { getBannerCoverImage, getBannerImages } from "@/lib/banners/images";
import type { Banner } from "@/types/banner";
import { cn } from "@/lib/utils";

interface BannersGlobalPanelItemProps {
  banner: Banner;
  onEdit: (banner: Banner) => void;
}

export function BannersGlobalPanelItem({
  banner,
  onEdit,
}: BannersGlobalPanelItemProps) {
  const cover = getBannerCoverImage(banner);
  const imageCount = getBannerImages(banner).length;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-[1rem] bg-white/45 px-2.5 py-2 transition-colors",
        "hover:bg-white/65 dark:bg-white/8 dark:hover:bg-white/12",
      )}
    >
      <button
        type="button"
        onClick={() => onEdit(banner)}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <div
          className={cn(
            RADIUS_DEEP,
            "relative h-10 w-14 shrink-0 overflow-hidden bg-muted",
          )}
        >
          {cover ? (
            <Image
              src={cover}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : null}
          {imageCount > 1 ? (
            <span className="absolute right-0.5 bottom-0.5 rounded bg-black/55 px-1 py-px text-[9px] text-white tabular-nums">
              {imageCount}
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-sm leading-snug">
            {banner.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <code className="rounded-md bg-black/6 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground dark:bg-white/10">
              {banner.key}
            </code>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  banner.isActive ? "bg-emerald-500" : "bg-muted-foreground/50",
                )}
                aria-hidden
              />
              {banner.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </button>

      <BannerRowActionsMenu banner={banner} onEdit={onEdit} />
    </div>
  );
}
