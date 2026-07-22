"use client";

import { MacOsFolderIcon } from "@/components/shared/macos-folder-icon";
import { MediaLibraryFolderActionsMenu } from "@/components/cms/media/media-library-folder-actions-menu";
import { MediaLibraryLibraryFileSelectCheckbox } from "@/components/cms/media/media-library-library-file-select-checkbox";
import type { MediaFolder, MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryFolderGridItemProps {
  folder: MediaFolder;
  allFolders: MediaFolder[];
  allFiles: MediaLibraryFile[];
  onOpen: (folderId: string) => void;
  isChecked: boolean;
  hasSelection: boolean;
  onToggleSelect: (folderId: string) => void;
}

export function MediaLibraryFolderGridItem({
  folder,
  allFolders,
  allFiles,
  onOpen,
  isChecked,
  hasSelection,
  onToggleSelect,
}: MediaLibraryFolderGridItemProps) {
  const showSelectControl = hasSelection || isChecked;

  return (
    <div
      className={cn(
        "group relative flex w-22 flex-col items-center gap-2 rounded-lg px-1 py-2 text-center transition-colors",
        "hover:bg-primary/6",
        isChecked && "bg-primary/10 ring-2 ring-primary/40",
      )}
    >
      <div
        className={cn(
          "absolute top-1 left-1 z-20 transition-opacity",
          showSelectControl
            ? "opacity-100"
            : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100",
        )}
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
      </div>

      <div className="absolute top-1.5 right-1.5 z-10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <MediaLibraryFolderActionsMenu
          folder={folder}
          allFolders={allFolders}
          allFiles={allFiles}
          triggerClassName="size-7 bg-background/80 backdrop-blur-sm hover:bg-background"
          onTriggerClick={(event) => event.stopPropagation()}
        />
      </div>

      <button
        type="button"
        onClick={() => {
          if (hasSelection) {
            onToggleSelect(folder.id);
            return;
          }
          onOpen(folder.id);
        }}
        onDoubleClick={() => onOpen(folder.id)}
        className={cn(
          "flex w-full flex-col items-center gap-2 rounded-lg text-center",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        )}
      >
        <MacOsFolderIcon
          size={64}
          className="transition-transform duration-200 group-hover:scale-[1.04]"
        />
        <span
          className={cn(
            "line-clamp-2 w-full px-1 text-xs leading-snug",
            isChecked ? "font-medium text-foreground" : "text-foreground/90",
          )}
        >
          {folder.name}
        </span>
      </button>
    </div>
  );
}
