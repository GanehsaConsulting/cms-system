"use client";

import { MediaLibraryFolderTableRow } from "@/components/cms/media/media-library-folder-table-row";
import { MediaLibraryLibraryFileSelectCheckbox } from "@/components/cms/media/media-library-library-file-select-checkbox";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { TableHead } from "@/components/ui/table";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { MediaFolder, MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryFolderTableProps {
  folders: MediaFolder[];
  allFolders: MediaFolder[];
  files: MediaLibraryFile[];
  onOpen: (folderId: string) => void;
  isSelected: (folderId: string) => boolean;
  hasSelection: boolean;
  onToggleSelect: (folderId: string) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onToggleSelectAll: () => void;
}

export function MediaLibraryFolderTable({
  folders,
  allFolders,
  files,
  onOpen,
  isSelected,
  hasSelection,
  onToggleSelect,
  isAllSelected,
  isIndeterminate,
  onToggleSelectAll,
}: MediaLibraryFolderTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <TableHead className={cn(LIST_TABLE_HEAD_CLASS, "w-10")}>
            <MediaLibraryLibraryFileSelectCheckbox
              checked={isAllSelected}
              visible
              label="Select all folders"
              onCheckedChange={() => onToggleSelectAll()}
              className={
                isIndeterminate
                  ? "**:data-[slot=checkbox]:bg-primary/40"
                  : undefined
              }
            />
          </TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Folder</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Kind</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Size</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Created</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Updated</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS} />
        </>
      }
    >
      {folders.map((folder) => (
        <MediaLibraryFolderTableRow
          key={folder.id}
          folder={folder}
          allFolders={allFolders}
          files={files}
          onOpen={onOpen}
          isChecked={isSelected(folder.id)}
          hasSelection={hasSelection}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </CmsListTable>
  );
}
