import { MEDIA_LIBRARY_DEFAULT_VIEW } from "@/config/media-library";
import type { MediaViewMode } from "@/types/media";

export const MEDIA_LIBRARY_VIEW_STORAGE_KEY = "cms:media-library-view";

export function readStoredMediaViewMode(): MediaViewMode {
  if (typeof window === "undefined") {
    return MEDIA_LIBRARY_DEFAULT_VIEW;
  }

  const stored = window.localStorage.getItem(MEDIA_LIBRARY_VIEW_STORAGE_KEY);
  return stored === "table" || stored === "grid"
    ? stored
    : MEDIA_LIBRARY_DEFAULT_VIEW;
}

export function writeStoredMediaViewMode(mode: MediaViewMode): void {
  window.localStorage.setItem(MEDIA_LIBRARY_VIEW_STORAGE_KEY, mode);
}
