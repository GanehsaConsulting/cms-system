"use client";

import { useState } from "react";
import { MEDIA_LIBRARY_ALL_FILES_ID } from "@/config/media-library";
import { buildMediaFolderTree } from "@/lib/media/folders";
import { MacOsFolderIcon } from "@/components/shared/macos-folder-icon";
import { CaretRightIcon } from "@/lib/icons";
import { SolidSurface } from "@/components/shared/solid-surface";
import type { MediaFolder } from "@/types/media";
import type { MediaFolderTreeNode } from "@/lib/media/folders";
import { cn } from "@/lib/utils";

interface MediaLibraryFolderSidebarProps {
  folders: MediaFolder[];
  activeFolderId: string;
  onSelect: (folderId: string) => void;
}

interface FolderTreeItemProps {
  node: MediaFolderTreeNode;
  activeFolderId: string;
  onSelect: (folderId: string) => void;
  depth?: number;
}

function FolderTreeItem({
  node,
  activeFolderId,
  onSelect,
  depth = 0,
}: FolderTreeItemProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isActive = activeFolderId === node.id;

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
          onClick={() => onSelect(node.id)}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
            isActive
              ? "bg-primary/10 font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          <MacOsFolderIcon size={14} className="shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>
      </div>

      {hasChildren && expanded ? (
        <div>
          {node.children.map((child) => (
            <FolderTreeItem
              key={child.id}
              node={child}
              activeFolderId={activeFolderId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function MediaLibraryFolderSidebar({
  folders,
  activeFolderId,
  onSelect,
}: MediaLibraryFolderSidebarProps) {
  const tree = buildMediaFolderTree(folders);
  const isAllFilesActive = activeFolderId === MEDIA_LIBRARY_ALL_FILES_ID;

  return (
    <SolidSurface className="flex w-56 shrink-0 flex-col overflow-hidden">
      <div className="border-(--separator) border-b px-3 py-3">
        <p className="font-semibold text-sm">Folders</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <button
          type="button"
          onClick={() => onSelect(MEDIA_LIBRARY_ALL_FILES_ID)}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
            isAllFilesActive
              ? "bg-primary/10 font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          <MacOsFolderIcon size={14} className="shrink-0" />
          All files
        </button>

        {tree.length > 0 ? (
          <div className="mt-1 space-y-0.5">
            {tree.map((node) => (
              <FolderTreeItem
                key={node.id}
                node={node}
                activeFolderId={activeFolderId}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : (
          <p className="px-2 py-3 text-muted-foreground text-xs leading-relaxed">
            No folders yet. Create one to start uploading.
          </p>
        )}
      </div>
    </SolidSurface>
  );
}
