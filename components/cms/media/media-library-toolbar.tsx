"use client";

import { MediaLibrarySearch } from "@/components/cms/media/media-library-search";
import { MediaLibraryViewToggle } from "@/components/cms/media/media-library-view-toggle";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";
import type { MediaViewMode } from "@/types/media";

interface MediaLibraryToolbarProps {
  search: string;
  viewMode?: MediaViewMode;
  onSearchChange: (value: string) => void;
  onViewModeChange?: (mode: MediaViewMode) => void;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  showViewToggle?: boolean;
}

export function MediaLibraryToolbar({
  search,
  viewMode = "grid",
  onSearchChange,
  onViewModeChange,
  searchPlaceholder,
  searchAriaLabel,
  showViewToggle = true,
}: MediaLibraryToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      {showViewToggle && onViewModeChange ? (
        <MediaLibraryViewToggle value={viewMode} onChange={onViewModeChange} />
      ) : null}
      <MediaLibrarySearch
        value={search}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
        ariaLabel={searchAriaLabel}
      />
    </div>
  );
}
