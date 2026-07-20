"use client";

import Image from "next/image";
import { MediaLibraryKindBadge } from "@/components/cms/media/media-library-kind-badge";
import { MediaLibraryKindIcon } from "@/components/cms/media/media-library-kind-icon";
import { SolidSurface } from "@/components/shared/solid-surface";
import { isRenderableMediaPreview } from "@/lib/media/classify";
import { formatMediaUsageSummary } from "@/lib/media/list";
import { RADIUS_DEEP } from "@/config/shape";
import type { MediaAsset } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryGridCardProps {
  asset: MediaAsset;
  onSelect?: (asset: MediaAsset) => void;
}

export function MediaLibraryGridCard({ asset, onSelect }: MediaLibraryGridCardProps) {
  const canPreview = isRenderableMediaPreview(asset.kind);
  const isInteractive = Boolean(onSelect);

  return (
    // biome-ignore lint/a11y/useSemanticElements: card opens a detail dialog
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? () => onSelect?.(asset) : undefined}
      onKeyDown={
        isInteractive
          ? (event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.(asset);
              }
            }
          : undefined
      }
      className={cn(
        isInteractive &&
          "cursor-pointer rounded-(--radius-inner) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
      )}
    >
      <SolidSurface
        className={cn(
          "flex h-full flex-col gap-3 p-3 transition-colors",
          isInteractive && "hover:bg-muted/40",
        )}
      >
        <div
          className={cn(
            RADIUS_DEEP,
            "relative aspect-4/3 overflow-hidden bg-muted",
          )}
        >
          {canPreview ? (
            <Image
              src={asset.url}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <MediaLibraryKindIcon kind={asset.kind} className="size-8 opacity-60" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 min-w-0 font-medium text-sm leading-snug">
              {asset.filename}
            </p>
            <MediaLibraryKindBadge kind={asset.kind} className="shrink-0" />
          </div>

          <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">
            {formatMediaUsageSummary(asset.usages)}
          </p>

          {isInteractive ? (
            <p className="mt-auto text-primary text-xs">View details</p>
          ) : null}
        </div>
      </SolidSurface>
    </div>
  );
}
