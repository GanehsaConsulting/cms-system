"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MediaLibraryFileRenameDialog } from "@/components/cms/media/media-library-file-rename-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deleteMediaLibraryFileAction } from "@/lib/actions/media-files";
import { DotsThreeIcon, PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import { notifyFromActionResult } from "@/lib/notify/action-toast";
import type { MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryLibraryFileActionsMenuProps {
  file: MediaLibraryFile;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
  onTriggerClick?: (event: React.MouseEvent) => void;
}

export function MediaLibraryLibraryFileActionsMenu({
  file,
  triggerClassName,
  align = "end",
  onTriggerClick,
}: MediaLibraryLibraryFileActionsMenuProps) {
  const router = useRouter();
  const [renameOpen, setRenameOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  function handleDelete() {
    requestConfirm({
      title: `Delete ${file.filename}?`,
      description: "This file will be removed from your library.",
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: () => {
        startTransition(async () => {
          const result = await deleteMediaLibraryFileAction(file.id);
          if (!notifyFromActionResult(result, "File deleted.")) return;
          router.refresh();
        });
      },
    });
  }

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
              aria-label="File actions"
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
            disabled={isPending}
            onClick={(event) => {
              event.stopPropagation();
              handleDelete();
            }}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MediaLibraryFileRenameDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        file={file}
      />

      {confirmDialog}
    </>
  );
}
