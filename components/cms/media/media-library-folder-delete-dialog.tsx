"use client";

import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogFooter,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { Button } from "@/components/ui/button";
import { deleteMediaFolderAction } from "@/lib/actions/media-folders";
import { getFolderDeleteImpact } from "@/lib/media/folders";
import { FolderOpenIcon } from "@/lib/icons";
import { notifyFromActionResult } from "@/lib/notify/action-toast";
import type { MediaFolder, MediaLibraryFile } from "@/types/media";

interface MediaLibraryFolderDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: MediaFolder | null;
  allFolders: MediaFolder[];
  allFiles: MediaLibraryFile[];
}

export function MediaLibraryFolderDeleteDialog({
  open,
  onOpenChange,
  folder,
  allFolders,
  allFiles,
}: MediaLibraryFolderDeleteDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const impact = useMemo(() => {
    if (!folder) {
      return null;
    }

    return getFolderDeleteImpact(folder.id, allFolders, allFiles);
  }, [allFiles, allFolders, folder]);

  function handleDelete() {
    if (!folder) {
      return;
    }

    startTransition(async () => {
      const result = await deleteMediaFolderAction(folder.id);
      if (!notifyFromActionResult(result, "Folder deleted.")) return;

      onOpenChange(false);
      router.refresh();
    });
  }

  if (!folder || !impact) {
    return null;
  }

  const hasSubfolders = impact.descendantFolders.length > 0;
  const hasFiles = impact.fileCount > 0;
  const hasNestedContent = hasSubfolders || hasFiles;

  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent showCloseButton={!isPending} size="sm">
        <CmsDialogHeader>
          <CmsDialogTitle>Delete {folder.name}?</CmsDialogTitle>
          <CmsDialogDescription>
            {hasNestedContent
              ? "This folder and everything inside it will be permanently removed."
              : "This empty folder will be permanently removed."}
          </CmsDialogDescription>
        </CmsDialogHeader>

        <CmsDialogBody>
          {hasNestedContent ? (
            <div className="space-y-4">
              {hasSubfolders ? (
                <div className="space-y-2">
                  <p className="font-medium text-sm">
                    Subfolders that will also be deleted
                  </p>
                  <ul className="max-h-40 space-y-1 overflow-y-auto rounded-(--radius-deep) bg-muted/50 p-3">
                    {impact.descendantFolders.map((subfolder) => (
                      <li
                        key={subfolder.id}
                        className="flex items-center gap-2 text-sm"
                        style={{
                          paddingLeft: `${Math.max(subfolder.depth - folder.depth - 1, 0) * 12}px`,
                        }}
                      >
                        <FolderOpenIcon className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{subfolder.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {hasFiles ? (
                <p className="text-muted-foreground text-sm">
                  {impact.fileCount} file{impact.fileCount === 1 ? "" : "s"} inside
                  this folder tree will also be deleted.
                </p>
              ) : null}
            </div>
          ) : null}
        </CmsDialogBody>

        <CmsDialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? "Deleting..." : "Delete folder"}
          </Button>
        </CmsDialogFooter>
      </CmsDialogContent>
    </CmsDialog>
  );
}
