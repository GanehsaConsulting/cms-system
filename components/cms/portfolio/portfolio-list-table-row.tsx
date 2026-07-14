"use client";

import Image from "next/image";
import { PortfolioFeaturedBadge } from "@/components/cms/portfolio/portfolio-featured-badge";
import { PortfolioRowActionsMenu } from "@/components/cms/portfolio/portfolio-row-actions-menu";
import { PortfolioWorkTypeBadge } from "@/components/cms/portfolio/portfolio-work-type-badge";
import { CmsListTableRow } from "@/components/shared/cms-list-table-row";
import { TableCell } from "@/components/ui/table";
import { LIST_TABLE_CELL_CLASS } from "@/config/list-table";
import { RADIUS_DEEP } from "@/config/shape";
import { formatPortfolioDateParts } from "@/lib/portfolio/list";
import type { Portfolio } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface PortfolioListTableRowProps {
  item: Portfolio;
  clientName: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function PortfolioListTableRow({
  item,
  clientName,
  isSelected,
  onSelect,
}: PortfolioListTableRowProps) {
  const updated = formatPortfolioDateParts(item.updatedAt);

  return (
    <CmsListTableRow isSelected={isSelected} onClick={() => onSelect(item.id)}>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="flex min-w-[220px] items-center gap-3">
          <div
            className={cn(
              RADIUS_DEEP,
              "relative flex size-9 shrink-0 items-center justify-center overflow-hidden bg-muted",
            )}
          >
            {item.coverImage ? (
              <Image
                src={item.coverImage}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="font-medium text-muted-foreground text-xs">
                {item.title.slice(0, 1).toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{item.title}</p>
            <p className="truncate text-muted-foreground text-xs">
              {clientName || "Unknown client"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <PortfolioWorkTypeBadge workType={item.workType} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <PortfolioFeaturedBadge featured={item.featured} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="text-sm leading-tight">
          <p>{updated.date}</p>
          <p className="text-muted-foreground text-xs">{updated.time}</p>
        </div>
      </TableCell>
      <TableCell className={cn(LIST_TABLE_CELL_CLASS, "text-right")}>
        <PortfolioRowActionsMenu item={item} />
      </TableCell>
    </CmsListTableRow>
  );
}
