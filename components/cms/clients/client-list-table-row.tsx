"use client";

import Image from "next/image";
import { ClientFeaturedBadge } from "@/components/cms/clients/client-featured-badge";
import { ClientRowActionsMenu } from "@/components/cms/clients/client-row-actions-menu";
import { CmsListTableRow } from "@/components/shared/cms-list-table-row";
import { TableCell } from "@/components/ui/table";
import { LIST_TABLE_CELL_CLASS } from "@/config/list-table";
import { RADIUS_DEEP } from "@/config/shape";
import { formatClientDateParts } from "@/lib/clients/list";
import type { Client } from "@/types/client";
import { cn } from "@/lib/utils";

interface ClientListTableRowProps {
  client: Client;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ClientListTableRow({
  client,
  isSelected,
  onSelect,
}: ClientListTableRowProps) {
  const updated = formatClientDateParts(client.updatedAt);

  return (
    <CmsListTableRow isSelected={isSelected} onClick={() => onSelect(client.id)}>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="flex min-w-[220px] items-center gap-3">
          <div
            className={cn(
              RADIUS_DEEP,
              "relative flex size-9 shrink-0 items-center justify-center overflow-hidden bg-muted",
            )}
          >
            {client.logo ? (
              <Image
                src={client.logo}
                alt=""
                fill
                unoptimized
                className="object-contain p-1"
              />
            ) : (
              <span className="font-medium text-muted-foreground text-xs">
                {client.name.slice(0, 1).toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{client.name}</p>
            <p className="truncate text-muted-foreground text-xs">
              {client.website || "No website"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <ClientFeaturedBadge featured={client.featured} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <p className="text-sm tabular-nums">{client.testimonials.length}</p>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <p className="text-sm tabular-nums">{client.photos.length}</p>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="text-sm leading-tight">
          <p>{updated.date}</p>
          <p className="text-muted-foreground text-xs">{updated.time}</p>
        </div>
      </TableCell>
      <TableCell className={cn(LIST_TABLE_CELL_CLASS, "text-right")}>
        <ClientRowActionsMenu client={client} />
      </TableCell>
    </CmsListTableRow>
  );
}
