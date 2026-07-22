"use client";

import { MediaLibraryFolderActionsMenu } from "@/components/cms/media/media-library-folder-actions-menu";
import { MediaLibraryLibraryFileSelectCheckbox } from "@/components/cms/media/media-library-library-file-select-checkbox";
import { MacOsFolderIcon } from "@/components/shared/macos-folder-icon";
import { CmsListTableRow } from "@/components/shared/cms-list-table-row";
import { TableCell } from "@/components/ui/table";
import { formatClientDateParts } from "@/lib/clients/list";
import { getFolderTreeSizeBytes } from "@/lib/media/folders";
import { formatMediaFileSize } from "@/lib/media/list";
import { LIST_TABLE_CELL_CLASS } from "@/config/list-table";
import type { MediaFolder, MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryFolderTableRowProps {
  folder: MediaFolder;
  allFolders: MediaFolder[];
  files: MediaLibraryFile[];
  onOpen: (folderId: string) => void;
  isChecked: boolean;
  hasSelection: boolean;
  onToggleSelect: (folderId: string) => void;
}

export function MediaLibraryFolderTableRow({
  folder,
  allFolders,
  files,
  onOpen,
  isChecked,
  hasSelection,
  onToggleSelect,
}: MediaLibraryFolderTableRowProps) {
  const created = formatClientDateParts(folder.createdAt);
  const updated = formatClientDateParts(folder.updatedAt);
  const sizeBytes = getFolderTreeSizeBytes(folder.id, allFolders, files);

  return (
    <CmsListTableRow
      isSelected={isChecked}
      onClick={() => {
        if (hasSelection) {
          onToggleSelect(folder.id);
          return;
        }
        onOpen(folder.id);
      }}
    >
      <TableCell
        className={cn(LIST_TABLE_CELL_CLASS, "w-10")}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <MediaLibraryLibraryFileSelectCheckbox
          checked={isChecked}
          visible
          label={`Select ${folder.name}`}
          onCheckedChange={() => onToggleSelect(folder.id)}
        />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="flex min-w-55 items-center gap-3">
          <MacOsFolderIcon size={32} />
          <div className="min-w-0">
            <p className="truncate font-medium">{folder.name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-[11px] text-foreground">
          Folder
        </span>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <p className="text-sm">{formatMediaFileSize(sizeBytes)}</p>
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
        <MediaLibraryFolderActionsMenu
          folder={folder}
          allFolders={allFolders}
          allFiles={files}
          onTriggerClick={(event) => event.stopPropagation()}
        />
      </TableCell>
    </CmsListTableRow>
  );
}
