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
import { LIST_TOOLBAR_BUTTON_CLASS } from "@/config/list-toolbar";
import { canCreateChildFolder } from "@/lib/media/folders";
import { MEDIA_LIBRARY_ALL_FILES_ID } from "@/config/media-library";
import {
  CaretDownIcon,
  FolderOpenIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from "@/lib/icons";
import type { MediaFolder, MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryFolderActionsProps {
  activeFolderId: string;
  selectedFolder: MediaFolder | null;
  allFolders: MediaFolder[];
  allFiles: MediaLibraryFile[];
}

export function MediaLibraryFolderActions({
  activeFolderId,
  selectedFolder,
  allFolders,
  allFiles,
}: MediaLibraryFolderActionsProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const parentId =
    activeFolderId === MEDIA_LIBRARY_ALL_FILES_ID
      ? null
      : activeFolderId;

  const canCreate = canCreateChildFolder(selectedFolder);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              className={cn(LIST_TOOLBAR_BUTTON_CLASS, "h-8 gap-1.5")}
              aria-label="Folder actions"
            />
          }
        >
          <FolderOpenIcon className="size-3.5" />
          Folder
          <CaretDownIcon className="size-3 opacity-80" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem
            disabled={!canCreate}
            onClick={() => setCreateOpen(true)}
          >
            <PlusIcon />
            New folder
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!selectedFolder}
            onClick={() => setRenameOpen(true)}
          >
            <PencilSimpleIcon />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={!selectedFolder}
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MediaLibraryFolderDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        parentId={parentId}
      />

      <MediaLibraryFolderDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        mode="rename"
        folder={selectedFolder}
      />

      <MediaLibraryFolderDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        folder={selectedFolder}
        allFolders={allFolders}
        allFiles={allFiles}
      />
    </>
  );
}
