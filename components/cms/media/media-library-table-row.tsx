"use client";

import Image from "next/image";
import Link from "next/link";
import { MediaLibraryKindBadge } from "@/components/cms/media/media-library-kind-badge";
import { MediaLibraryKindIcon } from "@/components/cms/media/media-library-kind-icon";
import { CmsListTableRow } from "@/components/shared/cms-list-table-row";
import { TableCell } from "@/components/ui/table";
import { LIST_TABLE_CELL_CLASS } from "@/config/list-table";
import { RADIUS_DEEP } from "@/config/shape";
import { isRenderableMediaPreview } from "@/lib/media/classify";
import {
  formatMediaUsageSummary,
  getMediaSourceHref,
} from "@/lib/media/list";
import { formatClientDateParts } from "@/lib/clients/list";
import type { MediaAsset } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryTableRowProps {
  asset: MediaAsset;
}

export function MediaLibraryTableRow({ asset }: MediaLibraryTableRowProps) {
  const primaryUsage = asset.usages[0];
  const sourceHref = primaryUsage ? getMediaSourceHref(primaryUsage) : null;
  const updated = formatClientDateParts(asset.updatedAt);
  const canPreview = isRenderableMediaPreview(asset.kind);

  return (
    <CmsListTableRow isSelected={false} onClick={() => undefined}>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="flex min-w-[220px] items-center gap-3">
          <div
            className={cn(
              RADIUS_DEEP,
              "relative flex size-10 shrink-0 items-center justify-center overflow-hidden bg-muted",
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
              <MediaLibraryKindIcon
                kind={asset.kind}
                className="size-4 text-muted-foreground"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{asset.filename}</p>
            <p className="truncate text-muted-foreground text-xs">
              {asset.mimeType ?? "Unknown type"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <MediaLibraryKindBadge kind={asset.kind} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <p className="truncate text-sm">
          {formatMediaUsageSummary(asset.usages)}
        </p>
        {asset.usages.length > 1 ? (
          <p className="text-muted-foreground text-xs">
            Used in {asset.usages.length} places
          </p>
        ) : null}
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="text-sm leading-tight">
          <p>{updated.date}</p>
          <p className="text-muted-foreground text-xs">{updated.time}</p>
        </div>
      </TableCell>
      <TableCell className={cn(LIST_TABLE_CELL_CLASS, "text-right")}>
        {sourceHref ? (
          <Link
            href={sourceHref}
            className="text-primary text-sm hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            Open
          </Link>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
    </CmsListTableRow>
  );
}
