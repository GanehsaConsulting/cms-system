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
  DotsThreeIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from "@/lib/icons";
import type { MediaFolder, MediaLibraryFile, MediaLibraryScope } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryFolderActionsProps {
  activeFolderId: string;
  selectedFolder: MediaFolder | null;
  allFolders: MediaFolder[];
  allFiles: MediaLibraryFile[];
  scope: MediaLibraryScope;
}

export function MediaLibraryFolderActions({
  activeFolderId,
  selectedFolder,
  allFolders,
  allFiles,
  scope,
}: MediaLibraryFolderActionsProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const parentId =
    activeFolderId === MEDIA_LIBRARY_ALL_FILES_ID ? null : activeFolderId;

  const canCreate = canCreateChildFolder(selectedFolder);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className={cn(LIST_TOOLBAR_BUTTON_CLASS, "h-8 gap-1.5")}
        disabled={!canCreate}
        onClick={() => setCreateOpen(true)}
      >
        <PlusIcon className="size-3.5" />
        New folder
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={cn(LIST_TOOLBAR_BUTTON_CLASS, "size-8 shrink-0")}
              aria-label="Folder actions"
              disabled={!selectedFolder}
            />
          }
        >
          <DotsThreeIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
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
        scope={scope}
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
