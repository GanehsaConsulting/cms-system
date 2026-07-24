import {
  DEFAULT_OPTIMIZE_IMAGES_ENABLED,
  OPTIMIZE_IMAGES_STORAGE_KEY,
} from "@/config/optimize-images";

export function readStoredOptimizeImagesEnabled(): boolean {
  if (typeof window === "undefined") {
    return DEFAULT_OPTIMIZE_IMAGES_ENABLED;
  }

  const stored = window.localStorage.getItem(OPTIMIZE_IMAGES_STORAGE_KEY);
  if (stored === "0" || stored === "false") {
    return false;
  }
  if (stored === "1" || stored === "true") {
    return true;
  }

  return DEFAULT_OPTIMIZE_IMAGES_ENABLED;
}

export function writeStoredOptimizeImagesEnabled(enabled: boolean): void {
  window.localStorage.setItem(OPTIMIZE_IMAGES_STORAGE_KEY, enabled ? "1" : "0");
}
