"use client";

import { MediaLibraryGridCard } from "@/components/cms/media/media-library-grid-card";
import { MEDIA_LIBRARY_GRID_CLASS } from "@/config/media-library";
import type { MediaAsset } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryGridProps {
  assets: MediaAsset[];
}

export function MediaLibraryGrid({ assets }: MediaLibraryGridProps) {
  return (
    <div className={cn(MEDIA_LIBRARY_GRID_CLASS)}>
      {assets.map((asset) => (
        <MediaLibraryGridCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
