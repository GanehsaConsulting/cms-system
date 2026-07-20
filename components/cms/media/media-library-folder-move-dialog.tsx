"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
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
import { moveMediaFoldersAction } from "@/lib/actions/media-folders";
import {
  buildMediaFolderTree,
  getBlockedMoveFolderIds,
  getRootSelectedFolderIds,
} from "@/lib/media/folders";
import { CaretRightIcon } from "@/lib/icons";
import { notifyError, notifyFromActionResult } from "@/lib/notify/action-toast";
import type { MediaFolder } from "@/types/media";
import type { MediaFolderTreeNode } from "@/lib/media/folders";
import { cn } from "@/lib/utils";

/** Sentinel for moving folders to the library root. */
const ROOT_PARENT_ID = "__root__";

interface MediaLibraryFolderMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderIds: string[];
  folders: MediaFolder[];
  currentParentId: string | null;
  onMoved?: () => void;
}

interface FolderPickerItemProps {
  node: MediaFolderTreeNode;
  selectedParentId: string | null;
  blockedIds: Set<string>;
  onSelect: (folderId: string) => void;
  depth?: number;
}

function FolderPickerItem({
  node,
  selectedParentId,
  blockedIds,
  onSelect,
  depth = 0,
}: FolderPickerItemProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedParentId === node.id;
  const isDisabled = blockedIds.has(node.id);

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
              selectedParentId={selectedParentId}
              blockedIds={blockedIds}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function MediaLibraryFolderMoveDialog({
  open,
  onOpenChange,
  folderIds,
  folders,
  currentParentId,
  onMoved,
}: MediaLibraryFolderMoveDialogProps) {
  const router = useRouter();
  const [selectedParentKey, setSelectedParentKey] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const rootIds = useMemo(
    () => getRootSelectedFolderIds(folders, folderIds),
    [folderIds, folders],
  );
  const blockedIds = useMemo(
    () => getBlockedMoveFolderIds(folders, rootIds),
    [folders, rootIds],
  );
  const tree = useMemo(() => buildMediaFolderTree(folders), [folders]);
  const folderCount = rootIds.length;
  const isRootSelected = selectedParentKey === ROOT_PARENT_ID;
  const selectedParentId = isRootSelected ? null : selectedParentKey;
  const isSameLocation =
    selectedParentKey !== null &&
    (isRootSelected
      ? currentParentId === null
      : selectedParentKey === currentParentId);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedParentKey(null);
    setError(null);
  }, [open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (selectedParentKey === null) {
      const message = "Select a destination";
      setError(message);
      notifyError(message);
      return;
    }

    const targetParentId =
      selectedParentKey === ROOT_PARENT_ID ? null : selectedParentKey;

    if (
      (targetParentId === null && currentParentId === null) ||
      targetParentId === currentParentId
    ) {
      const message = "Folders are already in this location";
      setError(message);
      notifyError(message);
      return;
    }

    startTransition(async () => {
      const result = await moveMediaFoldersAction(rootIds, targetParentId);

      if (!notifyFromActionResult(result, "Folders moved.")) {
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
              Move {folderCount} {folderCount === 1 ? "folder" : "folders"}
            </CmsDialogTitle>
            <CmsDialogDescription>
              Choose a destination. Subfolders and files move with the folder.
            </CmsDialogDescription>
          </CmsDialogHeader>

          <CmsDialogBody>
            <div className="max-h-64 overflow-y-auto rounded-lg border p-2">
              <button
                type="button"
                disabled={currentParentId === null}
                onClick={() => setSelectedParentKey(ROOT_PARENT_ID)}
                className={cn(
                  "mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                  isRootSelected
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  currentParentId === null &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent",
                )}
              >
                <MacOsFolderIcon size={14} className="shrink-0" />
                All files (root)
              </button>

              {tree.length > 0 ? (
                <div className="space-y-0.5">
                  {tree.map((node) => (
                    <FolderPickerItem
                      key={node.id}
                      node={node}
                      selectedParentId={selectedParentId}
                      blockedIds={blockedIds}
                      onSelect={setSelectedParentKey}
                    />
                  ))}
                </div>
              ) : null}
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
              disabled={isPending || selectedParentKey === null || isSameLocation}
            >
              Move
            </Button>
          </CmsDialogFooter>
        </form>
      </CmsDialogContent>
    </CmsDialog>
  );
}
