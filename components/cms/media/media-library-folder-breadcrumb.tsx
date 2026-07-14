"use client";

import { MEDIA_LIBRARY_ALL_FILES_ID } from "@/config/media-library";
import { getFolderPath } from "@/lib/media/folders";
import { CaretRightIcon } from "@/lib/icons";
import type { MediaFolder } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryFolderBreadcrumbProps {
  folders: MediaFolder[];
  activeFolderId: string;
  onSelect: (folderId: string) => void;
}

export function MediaLibraryFolderBreadcrumb({
  folders,
  activeFolderId,
  onSelect,
}: MediaLibraryFolderBreadcrumbProps) {
  const path =
    activeFolderId === MEDIA_LIBRARY_ALL_FILES_ID
      ? []
      : getFolderPath(folders, activeFolderId);

  return (
    <nav
      aria-label="Folder breadcrumb"
      className="flex min-w-0 items-center gap-1 border-(--separator) border-b px-4 py-3 text-sm"
    >
      <button
        type="button"
        onClick={() => onSelect(MEDIA_LIBRARY_ALL_FILES_ID)}
        className={cn(
          "shrink-0 font-medium transition-colors hover:text-foreground",
          activeFolderId === MEDIA_LIBRARY_ALL_FILES_ID
            ? "text-foreground"
            : "text-muted-foreground",
        )}
      >
        All files
      </button>

      {path.map((folder) => (
        <div key={folder.id} className="flex min-w-0 items-center gap-1">
          <CaretRightIcon className="size-3 shrink-0 text-muted-foreground" />
          <button
            type="button"
            onClick={() => onSelect(folder.id)}
            className={cn(
              "truncate font-medium transition-colors hover:text-foreground",
              folder.id === activeFolderId
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {folder.name}
          </button>
        </div>
      ))}
    </nav>
  );
}
