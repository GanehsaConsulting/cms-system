"use client";

import Image from "next/image";
import { ContentActivityKindBadge } from "@/components/cms/content-activities/content-activity-kind-badge";
import { ContentActivityRowActionsMenu } from "@/components/cms/content-activities/content-activity-row-actions-menu";
import { ContentActivityStatusBadge } from "@/components/cms/content-activities/content-activity-status-badge";
import { CmsListTableRow } from "@/components/shared/cms-list-table-row";
import { TableCell } from "@/components/ui/table";
import { LIST_TABLE_CELL_CLASS } from "@/config/list-table";
import { RADIUS_DEEP } from "@/config/shape";
import {
  formatContentActivityDateParts,
  stripContentActivityHtml,
} from "@/lib/content-activities/list";
import type { ContentActivity } from "@/types/content-activity";
import { cn } from "@/lib/utils";

interface ContentActivityListTableRowProps {
  item: ContentActivity;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ContentActivityListTableRow({
  item,
  isSelected,
  onSelect,
}: ContentActivityListTableRowProps) {
  const display = formatContentActivityDateParts(item.displayAt);
  const cover = item.images[0] ?? "";

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
            {cover ? (
              <Image
                src={cover}
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
              {stripContentActivityHtml(item.content).slice(0, 80) || "No description"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <ContentActivityKindBadge kind={item.kind} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <ContentActivityStatusBadge status={item.status} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <span className="text-sm">
          {item.showTitle ? "Shown" : "Hidden"}
        </span>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="text-sm leading-tight">
          <p>{display.date}</p>
          <p className="text-muted-foreground text-xs">{display.time}</p>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <span className="font-medium text-sm tabular-nums">
          {item.clickCount.toLocaleString("en-US")}
        </span>
      </TableCell>
      <TableCell className={cn(LIST_TABLE_CELL_CLASS, "text-right")}>
        <ContentActivityRowActionsMenu item={item} />
      </TableCell>
    </CmsListTableRow>
  );
}
