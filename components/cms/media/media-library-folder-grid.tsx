"use client";

import { MediaLibraryFolderGridItem } from "@/components/cms/media/media-library-folder-grid-item";
import { MEDIA_LIBRARY_FOLDER_GRID_CLASS } from "@/config/media-library";
import type { MediaFolder, MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryFolderGridProps {
  folders: MediaFolder[];
  allFolders: MediaFolder[];
  allFiles: MediaLibraryFile[];
  onOpen: (folderId: string) => void;
  isSelected: (folderId: string) => boolean;
  hasSelection: boolean;
  onToggleSelect: (folderId: string) => void;
  showBottomBorder?: boolean;
  className?: string;
}

export function MediaLibraryFolderGrid({
  folders,
  allFolders,
  allFiles,
  onOpen,
  isSelected,
  hasSelection,
  onToggleSelect,
  showBottomBorder = false,
  className,
}: MediaLibraryFolderGridProps) {
  if (folders.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        MEDIA_LIBRARY_FOLDER_GRID_CLASS,
        showBottomBorder && "border-(--separator) border-b",
        className,
      )}
    >
      {folders.map((folder) => (
        <MediaLibraryFolderGridItem
          key={folder.id}
          folder={folder}
          allFolders={allFolders}
          allFiles={allFiles}
          onOpen={onOpen}
          isChecked={isSelected(folder.id)}
          hasSelection={hasSelection}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
