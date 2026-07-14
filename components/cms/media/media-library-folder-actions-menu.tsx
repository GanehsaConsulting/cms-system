"use client";

import { useState } from "react";
import { MediaLibraryFolderDeleteDialog } from "@/components/cms/media/media-library-folder-delete-dialog";
import { MediaLibraryFolderDialog } from "@/components/cms/media/media-library-folder-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsThreeIcon, PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import type { MediaFolder, MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryFolderActionsMenuProps {
  folder: MediaFolder;
  allFolders: MediaFolder[];
  allFiles: MediaLibraryFile[];
  triggerClassName?: string;
  align?: "start" | "center" | "end";
  onTriggerClick?: (event: React.MouseEvent) => void;
}

export function MediaLibraryFolderActionsMenu({
  folder,
  allFolders,
  allFiles,
  triggerClassName,
  align = "end",
  onTriggerClick,
}: MediaLibraryFolderActionsMenuProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={cn("size-8 shrink-0", triggerClassName)}
              aria-label="Folder actions"
              onClick={onTriggerClick}
            />
          }
        >
          <DotsThreeIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="w-40">
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              setRenameOpen(true);
            }}
          >
            <PencilSimpleIcon />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={(event) => {
              event.stopPropagation();
              setDeleteOpen(true);
            }}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MediaLibraryFolderDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        mode="rename"
        folder={folder}
      />

      <MediaLibraryFolderDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        folder={folder}
        allFolders={allFolders}
        allFiles={allFiles}
      />
    </>
  );
}
