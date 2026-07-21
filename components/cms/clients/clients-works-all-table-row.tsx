"use client";

import Image from "next/image";
import Link from "next/link";
import { ClientContentBadges } from "@/components/cms/clients/client-content-badges";
import { ClientFeaturedBadge } from "@/components/cms/clients/client-featured-badge";
import { ClientsWorksAllWorksPreview } from "@/components/cms/clients/clients-works-all-works-preview";
import { CmsListTableRow } from "@/components/shared/cms-list-table-row";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { LIST_TABLE_CELL_CLASS } from "@/config/list-table";
import { RADIUS_DEEP } from "@/config/shape";
import { getClientContentKinds } from "@/lib/clients/content-kinds";
import type { ClientWithWorks } from "@/lib/clients/group-with-works";
import { formatClientDateParts } from "@/lib/clients/list";
import { PlusIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ClientsWorksAllTableRowProps {
  group: ClientWithWorks;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ClientsWorksAllTableRow({
  group,
  isSelected,
  onSelect,
}: ClientsWorksAllTableRowProps) {
  const { client, works } = group;
  const updated = formatClientDateParts(client.updatedAt);
  const contentKinds = getClientContentKinds(client, works);

  return (
    <CmsListTableRow
      isSelected={isSelected}
      onClick={() => onSelect(client.id)}
    >
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="flex min-w-[200px] items-center gap-3">
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
        <ClientContentBadges kinds={contentKinds} />
      </TableCell>

      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <ClientsWorksAllWorksPreview works={works} />
      </TableCell>

      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <ClientFeaturedBadge featured={client.featured} />
      </TableCell>

      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="text-sm leading-tight">
          <p>{updated.date}</p>
          <p className="text-muted-foreground text-xs">{updated.time}</p>
        </div>
      </TableCell>

      <TableCell className={cn(LIST_TABLE_CELL_CLASS, "text-right")}>
        <Button
          nativeButton={false}
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5"
          render={
            <Link href={`/clients/portfolio/new?clientId=${client.id}`} />
          }
          onClick={(event) => event.stopPropagation()}
        >
          <PlusIcon className="size-3.5" />
          <span className="hidden sm:inline">Add work</span>
        </Button>
      </TableCell>
    </CmsListTableRow>
  );
}
