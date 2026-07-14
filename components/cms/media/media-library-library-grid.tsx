"use client";

import { MediaLibraryLibraryGridCard } from "@/components/cms/media/media-library-library-grid-card";
import { MEDIA_LIBRARY_GRID_CLASS } from "@/config/media-library";
import type { MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryLibraryGridProps {
  files: MediaLibraryFile[];
  isSelected: (id: string) => boolean;
  hasSelection: boolean;
  onToggleSelect: (id: string) => void;
}

export function MediaLibraryLibraryGrid({
  files,
  isSelected,
  hasSelection,
  onToggleSelect,
}: MediaLibraryLibraryGridProps) {
  return (
    <div className={cn(MEDIA_LIBRARY_GRID_CLASS)}>
      {files.map((file) => (
        <MediaLibraryLibraryGridCard
          key={file.id}
          file={file}
          isSelected={isSelected(file.id)}
          hasSelection={hasSelection}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
