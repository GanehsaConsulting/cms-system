"use client";

import Image from "next/image";
import { MediaLibraryKindBadge } from "@/components/cms/media/media-library-kind-badge";
import { MediaLibraryKindIcon } from "@/components/cms/media/media-library-kind-icon";
import { MediaLibraryLibraryFileActionsMenu } from "@/components/cms/media/media-library-library-file-actions-menu";
import { MediaLibraryLibraryFileSelectCheckbox } from "@/components/cms/media/media-library-library-file-select-checkbox";
import { CmsListTableRow } from "@/components/shared/cms-list-table-row";
import { TableCell } from "@/components/ui/table";
import { formatMediaFileSize } from "@/lib/media/list";
import { isRenderableMediaPreview } from "@/lib/media/classify";
import { formatClientDateParts } from "@/lib/clients/list";
import { LIST_TABLE_CELL_CLASS } from "@/config/list-table";
import { RADIUS_DEEP } from "@/config/shape";
import type { MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryLibraryTableRowProps {
  file: MediaLibraryFile;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export function MediaLibraryLibraryTableRow({
  file,
  isSelected,
  onToggleSelect,
}: MediaLibraryLibraryTableRowProps) {
  const created = formatClientDateParts(file.uploadedAt);
  const updated = formatClientDateParts(file.updatedAt);
  const canPreview = isRenderableMediaPreview(file.kind);

  return (
    <CmsListTableRow
      isSelected={isSelected}
      onClick={() => onToggleSelect(file.id)}
    >
      <TableCell className={cn(LIST_TABLE_CELL_CLASS, "w-10")}>
        <MediaLibraryLibraryFileSelectCheckbox
          checked={isSelected}
          visible
          onCheckedChange={() => onToggleSelect(file.id)}
        />
      </TableCell>
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
                src={file.url}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <MediaLibraryKindIcon
                kind={file.kind}
                className="size-4 text-muted-foreground"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{file.filename}</p>
            <p className="truncate text-muted-foreground text-xs">
              {file.mimeType}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <MediaLibraryKindBadge kind={file.kind} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <p className="text-sm">{formatMediaFileSize(file.sizeBytes)}</p>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="text-sm leading-tight">
          <p>{created.date}</p>
          <p className="text-muted-foreground text-xs">{created.time}</p>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="text-sm leading-tight">
          <p>{updated.date}</p>
          <p className="text-muted-foreground text-xs">{updated.time}</p>
        </div>
      </TableCell>
      <TableCell className={cn(LIST_TABLE_CELL_CLASS, "text-right")}>
        <MediaLibraryLibraryFileActionsMenu
          file={file}
          onTriggerClick={(event) => event.stopPropagation()}
        />
      </TableCell>
    </CmsListTableRow>
  );
}
