/** Resize + WebP (or JPEG fallback) before CMS image upload. Default ON. */
export const DEFAULT_OPTIMIZE_IMAGES_ENABLED = true;

export const OPTIMIZE_IMAGES_STORAGE_KEY = "cms:optimize-images";

/** Longest edge after optimize resize. */
export const OPTIMIZE_IMAGES_MAX_EDGE_PX = 2048;

/** Canvas encode quality for WebP / JPEG. */
export const OPTIMIZE_IMAGES_QUALITY = 0.88;
