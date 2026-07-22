"use client";

import { CmsDeleteButton } from "@/components/shared/cms-delete-button";
import { Button } from "@/components/ui/button";
import { FolderOpenIcon, TrashIcon, XIcon } from "@/lib/icons";

interface MediaLibraryLibrarySelectionBarProps {
  selectedCount: number;
  onMove: () => void;
  onDelete: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export function MediaLibraryLibrarySelectionBar({
  selectedCount,
  onMove,
  onDelete,
  onClear,
  disabled = false,
}: MediaLibraryLibrarySelectionBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-(--separator) border-b bg-primary/5 px-4 py-2.5">
      <p className="mr-1 font-medium text-sm">
        {selectedCount} selected
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8"
        disabled={disabled}
        onClick={onMove}
      >
        <FolderOpenIcon className="size-3.5" />
        Move
      </Button>

      <CmsDeleteButton
        type="button"
        className="h-8"
        disabled={disabled}
        onClick={onDelete}
      >
        <TrashIcon className="size-3.5" />
        Delete
      </CmsDeleteButton>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto h-8"
        disabled={disabled}
        onClick={onClear}
      >
        <XIcon className="size-3.5" />
        Clear
      </Button>
    </div>
  );
}
