"use client";

import { MediaLibraryLibraryTableRow } from "@/components/cms/media/media-library-library-table-row";
import { MediaLibraryLibraryFileSelectCheckbox } from "@/components/cms/media/media-library-library-file-select-checkbox";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { TableHead } from "@/components/ui/table";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryLibraryTableProps {
  files: MediaLibraryFile[];
  isSelected: (id: string) => boolean;
  onToggleSelect: (id: string) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onToggleSelectAll: () => void;
}

export function MediaLibraryLibraryTable({
  files,
  isSelected,
  onToggleSelect,
  isAllSelected,
  isIndeterminate,
  onToggleSelectAll,
}: MediaLibraryLibraryTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <TableHead className={cn(LIST_TABLE_HEAD_CLASS, "w-10")}>
            <MediaLibraryLibraryFileSelectCheckbox
              checked={isAllSelected}
              visible
              label="Select all files"
              onCheckedChange={() => onToggleSelectAll()}
              className={isIndeterminate ? "[&_[data-slot=checkbox]]:bg-primary/40" : undefined}
            />
          </TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>File</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Kind</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Size</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Created</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Updated</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS} />
        </>
      }
    >
      {files.map((file) => (
        <MediaLibraryLibraryTableRow
          key={file.id}
          file={file}
          isSelected={isSelected(file.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </CmsListTable>
  );
}
