"use client";

import Image from "next/image";
import { BannerRowActionsMenu } from "@/components/cms/banners/banner-row-actions-menu";
import { BannerStatusBadge } from "@/components/cms/banners/banner-status-badge";
import { CmsListTableRow } from "@/components/shared/cms-list-table-row";
import { TableCell } from "@/components/ui/table";
import { LIST_TABLE_CELL_CLASS } from "@/config/list-table";
import { RADIUS_DEEP } from "@/config/shape";
import { formatBannerDateParts } from "@/lib/banners/list";
import type { Banner } from "@/types/banner";
import { cn } from "@/lib/utils";

interface BannerListTableRowProps {
  banner: Banner;
  onEdit: (banner: Banner) => void;
}

export function BannerListTableRow({
  banner,
  onEdit,
}: BannerListTableRowProps) {
  const updated = formatBannerDateParts(banner.updatedAt);

  return (
    <CmsListTableRow isSelected={false} onClick={() => onEdit(banner)}>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div
          className={cn(
            RADIUS_DEEP,
            "relative h-12 w-20 overflow-hidden bg-muted",
          )}
        >
          {banner.image ? (
            <Image
              src={banner.image}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : null}
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="min-w-[160px]">
          <p className="truncate font-medium">{banner.name}</p>
          <p className="truncate text-muted-foreground text-xs">
            {banner.redirectUrl}
          </p>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
          {banner.key}
        </code>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <BannerStatusBadge isActive={banner.isActive} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="text-sm leading-tight">
          <p>{updated.date}</p>
          <p className="text-muted-foreground text-xs">{updated.time}</p>
        </div>
      </TableCell>
      <TableCell className={cn(LIST_TABLE_CELL_CLASS, "text-right")}>
        <BannerRowActionsMenu banner={banner} onEdit={onEdit} />
      </TableCell>
    </CmsListTableRow>
  );
}
