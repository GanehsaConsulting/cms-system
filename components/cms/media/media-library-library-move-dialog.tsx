"use client";

import { useEffect, useState, useTransition } from "react";
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
import { MacOsFolderIcon } from "@/components/shared/macos-folder-icon";
import { Button } from "@/components/ui/button";
import { DIALOG_FORM_CLASS } from "@/config/dialog";
import { moveMediaLibraryFilesAction } from "@/lib/actions/media-files";
import { buildMediaFolderTree } from "@/lib/media/folders";
import { CaretRightIcon } from "@/lib/icons";
import { notifyError, notifyFromActionResult } from "@/lib/notify/action-toast";
import type { MediaFolder } from "@/types/media";
import type { MediaFolderTreeNode } from "@/lib/media/folders";
import { cn } from "@/lib/utils";

interface MediaLibraryLibraryMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileIds: string[];
  folders: MediaFolder[];
  currentFolderId: string;
  onMoved?: () => void;
}

interface FolderPickerItemProps {
  node: MediaFolderTreeNode;
  selectedFolderId: string | null;
  disabledFolderId: string;
  onSelect: (folderId: string) => void;
  depth?: number;
}

function FolderPickerItem({
  node,
  selectedFolderId,
  disabledFolderId,
  onSelect,
  depth = 0,
}: FolderPickerItemProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedFolderId === node.id;
  const isDisabled = node.id === disabledFolderId;

  return (
    <div>
      <div
        className="flex min-w-0 items-center"
        style={{ paddingLeft: `${depth * 12}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={expanded ? "Collapse folder" : "Expand folder"}
            onClick={() => setExpanded((value) => !value)}
            className="flex size-6 shrink-0 items-center justify-center text-muted-foreground"
          >
            <CaretRightIcon
              className={cn(
                "size-3 transition-transform",
                expanded ? "rotate-90" : "",
              )}
            />
          </button>
        ) : (
          <span className="size-6 shrink-0" />
        )}

        <button
          type="button"
          disabled={isDisabled}
          onClick={() => onSelect(node.id)}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
            isSelected
              ? "bg-primary/10 font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            isDisabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
          )}
        >
          <MacOsFolderIcon size={14} className="shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>
      </div>

      {hasChildren && expanded ? (
        <div>
          {node.children.map((child) => (
            <FolderPickerItem
              key={child.id}
              node={child}
              selectedFolderId={selectedFolderId}
              disabledFolderId={disabledFolderId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function MediaLibraryLibraryMoveDialog({
  open,
  onOpenChange,
  fileIds,
  folders,
  currentFolderId,
  onMoved,
}: MediaLibraryLibraryMoveDialogProps) {
  const router = useRouter();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const tree = buildMediaFolderTree(folders);
  const fileCount = fileIds.length;

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedFolderId(null);
    setError(null);
  }, [open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!selectedFolderId) {
      const message = "Select a destination folder";
      setError(message);
      notifyError(message);
      return;
    }

    startTransition(async () => {
      const result = await moveMediaLibraryFilesAction(fileIds, selectedFolderId);

      if (!notifyFromActionResult(result, "Files moved.")) {
        if (!result.success) {
          setError(result.error);
        }
        return;
      }

      onOpenChange(false);
      onMoved?.();
      router.refresh();
    });
  }

  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent size="sm">
        <form className={DIALOG_FORM_CLASS} onSubmit={handleSubmit}>
          <CmsDialogHeader>
            <CmsDialogTitle>
              Move {fileCount} {fileCount === 1 ? "file" : "files"}
            </CmsDialogTitle>
            <CmsDialogDescription>
              Choose a folder to move the selected files into.
            </CmsDialogDescription>
          </CmsDialogHeader>

          <CmsDialogBody>
            <div className="max-h-64 overflow-y-auto rounded-lg border p-2">
              {tree.length > 0 ? (
                <div className="space-y-0.5">
                  {tree.map((node) => (
                    <FolderPickerItem
                      key={node.id}
                      node={node}
                      selectedFolderId={selectedFolderId}
                      disabledFolderId={currentFolderId}
                      onSelect={setSelectedFolderId}
                    />
                  ))}
                </div>
              ) : (
                <p className="px-2 py-3 text-muted-foreground text-sm">
                  No folders available.
                </p>
              )}
            </div>

            {error ? (
              <p className="text-destructive text-sm">{error}</p>
            ) : null}
          </CmsDialogBody>

          <CmsDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || selectedFolderId === null}
            >
              Move
            </Button>
          </CmsDialogFooter>
        </form>
      </CmsDialogContent>
    </CmsDialog>
  );
}
