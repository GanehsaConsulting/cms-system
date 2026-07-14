"use client";

import Image from "next/image";
import Link from "next/link";
import { MediaLibraryKindBadge } from "@/components/cms/media/media-library-kind-badge";
import { MediaLibraryKindIcon } from "@/components/cms/media/media-library-kind-icon";
import { SolidSurface } from "@/components/shared/solid-surface";
import { isRenderableMediaPreview } from "@/lib/media/classify";
import {
  formatMediaUsageSummary,
  getMediaSourceHref,
} from "@/lib/media/list";
import { RADIUS_DEEP } from "@/config/shape";
import type { MediaAsset } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryGridCardProps {
  asset: MediaAsset;
}

export function MediaLibraryGridCard({ asset }: MediaLibraryGridCardProps) {
  const primaryUsage = asset.usages[0];
  const sourceHref = primaryUsage ? getMediaSourceHref(primaryUsage) : null;
  const canPreview = isRenderableMediaPreview(asset.kind);

  return (
    <SolidSurface className="flex h-full flex-col gap-3 p-3">
      <div
        className={cn(
          RADIUS_DEEP,
          "relative aspect-[4/3] overflow-hidden bg-muted",
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

        {sourceHref ? (
          <Link
            href={sourceHref}
            className="mt-auto text-primary text-xs hover:underline"
          >
            Open source
          </Link>
        ) : null}
      </div>
    </SolidSurface>
  );
}
