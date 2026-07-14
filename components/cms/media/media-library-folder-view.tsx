"use client";

import { MediaLibraryFolderGrid } from "@/components/cms/media/media-library-folder-grid";
import { MediaLibraryFolderTable } from "@/components/cms/media/media-library-folder-table";
import type { MediaFolder, MediaLibraryFile, MediaViewMode } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryFolderViewProps {
  folders: MediaFolder[];
  allFolders: MediaFolder[];
  files: MediaLibraryFile[];
  viewMode: MediaViewMode;
  onOpen: (folderId: string) => void;
  isSelected: (folderId: string) => boolean;
  hasSelection: boolean;
  onToggleSelect: (folderId: string) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onToggleSelectAll: () => void;
  showBottomBorder?: boolean;
  className?: string;
}

export function MediaLibraryFolderView({
  folders,
  allFolders,
  files,
  viewMode,
  onOpen,
  isSelected,
  hasSelection,
  onToggleSelect,
  isAllSelected,
  isIndeterminate,
  onToggleSelectAll,
  showBottomBorder = false,
  className,
}: MediaLibraryFolderViewProps) {
  if (folders.length === 0) {
    return null;
  }

  if (viewMode === "grid") {
    return (
      <MediaLibraryFolderGrid
        folders={folders}
        allFolders={allFolders}
        allFiles={files}
        onOpen={onOpen}
        isSelected={isSelected}
        hasSelection={hasSelection}
        onToggleSelect={onToggleSelect}
        showBottomBorder={showBottomBorder}
        className={className}
      />
    );
  }

  return (
    <div className={cn(showBottomBorder && "border-(--separator) border-b", className)}>
      <MediaLibraryFolderTable
        folders={folders}
        allFolders={allFolders}
        files={files}
        onOpen={onOpen}
        isSelected={isSelected}
        hasSelection={hasSelection}
        onToggleSelect={onToggleSelect}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        onToggleSelectAll={onToggleSelectAll}
      />
    </div>
  );
}
